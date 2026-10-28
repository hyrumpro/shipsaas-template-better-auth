/**
 * Stripe Webhook Handler
 * Handles all Stripe webhook events with database operations
 */

import { logger } from "@/lib/logger";
import {
  createSubscription,
  updateSubscription,
  getSubscriptionByProviderId,
  createOrder,
  updateOrder,
  getOrderByProviderId,
  createPayment,
  updateUser,
  getUserById,
  claimWebhookEvent,
  markWebhookEventProcessed,
  markWebhookEventFailed,
} from "@/db/queries";
import {
  sendPaymentSuccessEmail,
  sendPaymentFailedEmail,
  sendSubscriptionCancelledEmail,
  sendSubscriptionRenewalUpcomingEmail,
  sendTrialEndingEmail,
  sendRefundIssuedEmail,
} from "@/lib/mailgun";
import type Stripe from "stripe";

export async function handleStripeWebhook(event: Stripe.Event) {
  const claimed = await claimWebhookEvent({
    provider: "stripe",
    eventId: event.id,
    eventType: event.type,
    payload: event,
  });

  if (!claimed) {
    logger.info("Stripe webhook already claimed or processed, skipping", {
      eventId: event.id,
      eventType: event.type,
    });
    return;
  }

  try {
    switch (event.type) {
      case "checkout.session.completed":
        await handleCheckoutCompleted(event);
        break;

      case "customer.subscription.created":
        await handleSubscriptionCreated(event);
        break;

      case "customer.subscription.updated":
        await handleSubscriptionUpdated(event);
        break;

      case "customer.subscription.deleted":
        await handleSubscriptionDeleted(event);
        break;

      case "invoice.payment_succeeded":
        await handlePaymentSucceeded(event);
        break;

      case "invoice.payment_failed":
        await handlePaymentFailed(event);
        break;

      case "charge.refunded":
        await handleChargeRefunded(event);
        break;

      case "invoice.upcoming":
        await handleInvoiceUpcoming(event);
        break;

      case "customer.subscription.trial_will_end":
        await handleTrialWillEnd(event);
        break;

      default:
        logger.info("Unhandled Stripe webhook event", { type: event.type });
    }

    // Mark webhook as processed only after all database side effects succeed.
    await markWebhookEventProcessed(event.id);
  } catch (error) {
    logger.error("Error processing Stripe webhook", error, {
      eventType: event.type,
      eventId: event.id,
    });
    // Leave the event retryable. Stripe retries non-2xx responses.
    await markWebhookEventFailed(
      event.id,
      error instanceof Error ? error.message : "Unknown error"
    );
    throw error;
  }
}

async function handleCheckoutCompleted(event: Stripe.Event) {
  const session = event.data.object as Stripe.Checkout.Session;
  const userId = session.metadata?.user_id;

  if (!userId) {
    logger.warn("Checkout completed without user_id in metadata", {
      sessionId: session.id,
    });
    return;
  }

  logger.payment("checkout_completed", {
    sessionId: session.id,
    userId,
    mode: session.mode,
    amount: session.amount_total,
  });

  if (session.mode === "payment") {
    // One-time payment
    await createOrder({
      userId,
      provider: "stripe",
      providerOrderId: session.payment_intent as string,
      providerCustomerId: session.customer as string,
      status: "paid",
      productName: session.metadata?.product_name || "One-time purchase",
      productId: session.metadata?.product_id,
      amount: session.amount_total || 0,
      currency: session.currency || "usd",
      total: session.amount_total || 0,
      receiptUrl: (session as any).receipt_url,
      metadata: {
        sessionId: session.id,
        customerEmail: session.customer_email,
      },
    });

    // Update user's Stripe customer ID
    if (session.customer) {
      await updateUser(userId, {
        stripeCustomerId: session.customer as string,
      });
    }

    logger.payment("order_created", { userId, sessionId: session.id });
  }
  // Subscription mode is handled by customer.subscription.created
}

async function handleSubscriptionCreated(event: Stripe.Event) {
  const subscription = event.data.object as Stripe.Subscription;
  const userId = subscription.metadata?.user_id;

  if (!userId) {
    logger.warn("Subscription created without user_id in metadata", {
      subscriptionId: subscription.id,
    });
    return;
  }

  const priceData = subscription.items.data[0]?.price;
  const productName =
    subscription.metadata?.plan_name ||
    (priceData?.nickname as string) ||
    "Subscription";

  await createSubscription({
    userId,
    provider: "stripe",
    providerSubscriptionId: subscription.id,
    providerCustomerId: subscription.customer as string,
    status: subscription.status as any,
    planName: productName,
    planId: priceData?.id,
    amount: priceData?.unit_amount || 0,
    currency: priceData?.currency || "usd",
    interval: (priceData?.recurring?.interval as any) || "month",
    intervalCount: priceData?.recurring?.interval_count || 1,
    currentPeriodStart: new Date(subscription.current_period_start * 1000),
    currentPeriodEnd: new Date(subscription.current_period_end * 1000),
    trialStart: subscription.trial_start
      ? new Date(subscription.trial_start * 1000)
      : undefined,
    trialEnd: subscription.trial_end
      ? new Date(subscription.trial_end * 1000)
      : undefined,
    metadata: {
      stripeSubscriptionId: subscription.id,
      priceId: priceData?.id,
    },
  });

  // Update user's Stripe customer ID and subscription status
  await updateUser(userId, {
    stripeCustomerId: subscription.customer as string,
    isSubscribed:
      subscription.status === "active" || subscription.status === "trialing",
    subscriptionTier: productName,
  });

  logger.payment("subscription_created", {
    userId,
    subscriptionId: subscription.id,
    status: subscription.status,
  });
}

async function handleSubscriptionUpdated(event: Stripe.Event) {
  const subscription = event.data.object as Stripe.Subscription;
  const previousAttributes = event.data.previous_attributes as any;

  const dbSubscription = await getSubscriptionByProviderId(
    "stripe",
    subscription.id
  );

  if (!dbSubscription) {
    logger.warn("Subscription not found in database", {
      subscriptionId: subscription.id,
    });
    return;
  }

  const priceData = subscription.items.data[0]?.price;
  const updateData: any = {
    status: subscription.status as any,
    currentPeriodStart: new Date(subscription.current_period_start * 1000),
    currentPeriodEnd: new Date(subscription.current_period_end * 1000),
    cancelAtPeriodEnd: subscription.cancel_at_period_end,
  };

  // Handle plan changes
  if (previousAttributes?.items) {
    updateData.planName =
      subscription.metadata?.plan_name ||
      (priceData?.nickname as string) ||
      "Subscription";
    updateData.planId = priceData?.id;
    updateData.amount = priceData?.unit_amount || 0;
    updateData.interval = (priceData?.recurring?.interval as any) || "month";
  }

  // Handle cancellation
  if (subscription.canceled_at) {
    updateData.canceledAt = new Date(subscription.canceled_at * 1000);
  }

  if (subscription.ended_at) {
    updateData.endedAt = new Date(subscription.ended_at * 1000);
  }

  await updateSubscription(dbSubscription.id, updateData);

  // Update user subscription status
  await updateUser(dbSubscription.userId, {
    isSubscribed:
      subscription.status === "active" || subscription.status === "trialing",
    subscriptionTier:
      subscription.status === "active" || subscription.status === "trialing"
        ? updateData.planName || dbSubscription.planName
        : undefined,
  });

  logger.payment("subscription_updated", {
    userId: dbSubscription.userId,
    subscriptionId: subscription.id,
    status: subscription.status,
    cancelAtPeriodEnd: subscription.cancel_at_period_end,
  });
}

async function handleSubscriptionDeleted(event: Stripe.Event) {
  const subscription = event.data.object as Stripe.Subscription;

  const dbSubscription = await getSubscriptionByProviderId(
    "stripe",
    subscription.id
  );

  if (!dbSubscription) {
    logger.warn("Subscription not found in database", {
      subscriptionId: subscription.id,
    });
    return;
  }

  await updateSubscription(dbSubscription.id, {
    status: "canceled",
    canceledAt: subscription.canceled_at
      ? new Date(subscription.canceled_at * 1000)
      : new Date(),
    endedAt: new Date(),
  });

  // Update user subscription status
  await updateUser(dbSubscription.userId, {
    isSubscribed: false,
    subscriptionTier: undefined,
  });

  // Cancellation email (never blocks the webhook)
  const endDate = subscription.current_period_end
    ? new Date(subscription.current_period_end * 1000).toLocaleDateString(
        "en-US",
        { year: "numeric", month: "long", day: "numeric" }
      )
    : "the end of the current billing period";
  void sendCancellation(dbSubscription.userId, endDate, subscription.id);

  logger.payment("subscription_deleted", {
    userId: dbSubscription.userId,
    subscriptionId: subscription.id,
  });
}

async function handlePaymentSucceeded(event: Stripe.Event) {
  const invoice = event.data.object as Stripe.Invoice;
  const subscriptionId = invoice.subscription as string;

  if (!subscriptionId) {
    logger.warn("Payment succeeded without subscription", {
      invoiceId: invoice.id,
    });
    return;
  }

  const dbSubscription = await getSubscriptionByProviderId(
    "stripe",
    subscriptionId
  );

  if (!dbSubscription) {
    logger.warn("Subscription not found for payment", {
      subscriptionId,
      invoiceId: invoice.id,
    });
    return;
  }

  // Record payment
  await createPayment({
    userId: dbSubscription.userId,
    subscriptionId: dbSubscription.id,
    provider: "stripe",
    providerPaymentId: invoice.id,
    providerCustomerId: invoice.customer as string,
    status: "succeeded",
    amount: invoice.amount_paid,
    currency: invoice.currency,
    billingReason: invoice.billing_reason || undefined,
    receiptUrl: invoice.hosted_invoice_url || undefined,
    invoiceUrl: invoice.invoice_pdf || undefined,
    paidAt: invoice.status_transitions?.paid_at
      ? new Date(invoice.status_transitions.paid_at * 1000)
      : new Date(),
    metadata: {
      invoiceId: invoice.id,
      invoiceNumber: invoice.number,
    },
  });

  // If subscription was past_due, restore access
  if (dbSubscription.status === "past_due") {
    await updateSubscription(dbSubscription.id, {
      status: "active",
    });

    await updateUser(dbSubscription.userId, {
      isSubscribed: true,
    });
  }

  // Receipt email (never blocks the webhook)
  void sendPaymentReceipt(
    dbSubscription.userId,
    dbSubscription.planName,
    invoice.amount_paid,
    invoice.currency,
    invoice.hosted_invoice_url ?? undefined
  );

  logger.payment("payment_succeeded", {
    userId: dbSubscription.userId,
    subscriptionId,
    invoiceId: invoice.id,
    amount: invoice.amount_paid,
  });
}

async function handlePaymentFailed(event: Stripe.Event) {
  const invoice = event.data.object as Stripe.Invoice;
  const subscriptionId = invoice.subscription as string;

  if (!subscriptionId) {
    return;
  }

  const dbSubscription = await getSubscriptionByProviderId(
    "stripe",
    subscriptionId
  );

  if (!dbSubscription) {
    return;
  }

  // Record failed payment
  await createPayment({
    userId: dbSubscription.userId,
    subscriptionId: dbSubscription.id,
    provider: "stripe",
    providerPaymentId: invoice.id,
    providerCustomerId: invoice.customer as string,
    status: "failed",
    amount: invoice.amount_due,
    currency: invoice.currency,
    billingReason: invoice.billing_reason || undefined,
    attemptCount: invoice.attempt_count || 1,
    failureCode: (invoice as any).last_finalization_error?.code,
    failureMessage: (invoice as any).last_finalization_error?.message,
    metadata: {
      invoiceId: invoice.id,
      nextPaymentAttempt: invoice.next_payment_attempt,
    },
  });

  // Update subscription status
  await updateSubscription(dbSubscription.id, {
    status: "past_due",
  });

  // Failure email (never blocks the webhook)
  const failureMessage = (invoice as any).last_finalization_error?.message as
    | string
    | undefined;
  void sendPaymentFailure(
    dbSubscription.userId,
    dbSubscription.planName,
    invoice.amount_due,
    invoice.currency,
    failureMessage
  );

  logger.payment("payment_failed", {
    userId: dbSubscription.userId,
    subscriptionId,
    invoiceId: invoice.id,
    attemptCount: invoice.attempt_count,
  });
}

async function handleChargeRefunded(event: Stripe.Event) {
  const charge = event.data.object as Stripe.Charge;
  const paymentIntentId = charge.payment_intent as string;

  if (!paymentIntentId) {
    logger.warn("Charge refunded without payment intent", {
      chargeId: charge.id,
    });
    return;
  }

  const dbOrder = await getOrderByProviderId("stripe", paymentIntentId);

  if (!dbOrder) {
    logger.warn("Order not found for refund", {
      paymentIntentId,
      chargeId: charge.id,
    });
    return;
  }

  await updateOrder(dbOrder.id, {
    status: "refunded",
    refundedAmount: charge.amount_refunded,
    refundedAt: new Date(),
    refundReason: (charge as any).refund_reason || undefined,
  });

  // Refund email
  void sendRefund(
    dbOrder.userId,
    formatMoney(charge.amount_refunded, charge.currency),
    dbOrder.productName,
    charge.id
  );

  logger.payment("charge_refunded", {
    userId: dbOrder.userId,
    orderId: dbOrder.id,
    chargeId: charge.id,
    amount: charge.amount_refunded,
    currency: charge.currency,
  });
}

// ---------------------------------------------------------------------------
// Email helpers — never block the webhook on a send failure
// ---------------------------------------------------------------------------

function formatMoney(amount: number, currency: string | null): string {
  if (!currency) return `${(amount / 100).toFixed(2)}`;
  try {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currency.toUpperCase(),
      minimumFractionDigits: amount % 100 === 0 ? 0 : 2,
    }).format(amount / 100);
  } catch {
    return `${(amount / 100).toFixed(2)} ${currency.toUpperCase()}`;
  }
}

async function sendPaymentReceipt(
  userId: string,
  planName: string,
  amountCents: number,
  currency: string | null,
  invoiceUrl: string | undefined
) {
  try {
    const user = await getUserById(userId);
    if (!user?.email) return;
    await sendPaymentSuccessEmail(
      user.email,
      user.fullName ?? user.email.split("@")[0] ?? "there",
      formatMoney(amountCents, currency),
      planName,
      invoiceUrl
    );
  } catch (err) {
    logger.warn("Failed to send payment receipt email", { userId, err });
  }
}

async function sendPaymentFailure(
  userId: string,
  planName: string,
  amountCents: number,
  currency: string | null,
  reason: string | undefined
) {
  try {
    const user = await getUserById(userId);
    if (!user?.email) return;
    const siteUrl =
      process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ||
      "http://localhost:3000";
    await sendPaymentFailedEmail(
      user.email,
      user.fullName ?? user.email.split("@")[0] ?? "there",
      planName,
      formatMoney(amountCents, currency),
      reason,
      `${siteUrl}/dashboard/billing`
    );
  } catch (err) {
    logger.warn("Failed to send payment failure email", { userId, err });
  }
}

async function sendCancellation(
  userId: string,
  endDate: string,
  subscriptionId: string
) {
  try {
    const user = await getUserById(userId);
    if (!user?.email) return;
    await sendSubscriptionCancelledEmail(
      user.email,
      user.fullName ?? user.email.split("@")[0] ?? "there",
      endDate
    );
    logger.info("Subscription cancellation email queued", {
      userId,
      subscriptionId,
    });
  } catch (err) {
    logger.warn("Failed to send subscription cancellation email", {
      userId,
      err,
    });
  }
}

async function handleInvoiceUpcoming(event: Stripe.Event) {
  const invoice = event.data.object as Stripe.Invoice;
  const subscriptionId = invoice.subscription as string;

  if (!subscriptionId) return;

  const dbSubscription = await getSubscriptionByProviderId(
    "stripe",
    subscriptionId
  );
  if (!dbSubscription) return;

  const renewalDate = invoice.next_payment_attempt
    ? new Date(invoice.next_payment_attempt * 1000).toLocaleDateString(
        "en-US",
        { year: "numeric", month: "long", day: "numeric" }
      )
    : new Date(invoice.period_end * 1000).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });

  void sendRenewalReminder(
    dbSubscription.userId,
    dbSubscription.planName,
    invoice.amount_due,
    invoice.currency,
    renewalDate
  );

  logger.info("invoice.upcoming processed", {
    userId: dbSubscription.userId,
    subscriptionId,
    renewalDate,
  });
}

async function handleTrialWillEnd(event: Stripe.Event) {
  const subscription = event.data.object as Stripe.Subscription;
  const dbSubscription = await getSubscriptionByProviderId(
    "stripe",
    subscription.id
  );
  if (!dbSubscription) return;

  if (!subscription.trial_end) return;

  const trialEndDate = new Date(
    subscription.trial_end * 1000
  ).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  void sendTrialEndReminder(
    dbSubscription.userId,
    dbSubscription.planName,
    trialEndDate,
    dbSubscription.amount,
    dbSubscription.currency
  );

  logger.info("customer.subscription.trial_will_end processed", {
    userId: dbSubscription.userId,
    subscriptionId: subscription.id,
    trialEndDate,
  });
}

async function sendRenewalReminder(
  userId: string,
  planName: string,
  amountCents: number,
  currency: string | null,
  renewalDate: string
) {
  try {
    const user = await getUserById(userId);
    if (!user?.email) return;
    const siteUrl =
      process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ||
      "http://localhost:3000";
    await sendSubscriptionRenewalUpcomingEmail(
      user.email,
      user.fullName ?? user.email.split("@")[0] ?? "there",
      planName,
      formatMoney(amountCents, currency),
      renewalDate,
      `${siteUrl}/dashboard/billing`
    );
  } catch (err) {
    logger.warn("Failed to send renewal upcoming email", { userId, err });
  }
}

async function sendTrialEndReminder(
  userId: string,
  planName: string,
  trialEndDate: string,
  amountCents: number,
  currency: string
) {
  try {
    const user = await getUserById(userId);
    if (!user?.email) return;
    const siteUrl =
      process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ||
      "http://localhost:3000";
    await sendTrialEndingEmail(
      user.email,
      user.fullName ?? user.email.split("@")[0] ?? "there",
      planName,
      trialEndDate,
      formatMoney(amountCents, currency),
      `${siteUrl}/dashboard/billing`
    );
  } catch (err) {
    logger.warn("Failed to send trial ending email", { userId, err });
  }
}

async function sendRefund(
  userId: string,
  amount: string,
  productName: string,
  refundId: string
) {
  try {
    const user = await getUserById(userId);
    if (!user?.email) return;
    await sendRefundIssuedEmail(
      user.email,
      user.fullName ?? user.email.split("@")[0] ?? "there",
      amount,
      productName,
      refundId
    );
  } catch (err) {
    logger.warn("Failed to send refund email", { userId, err });
  }
}
