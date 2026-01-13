/**
 * LemonSqueezy Webhook Handler
 * Handles all LemonSqueezy webhook events with database operations
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
  createWebhookEvent,
  markWebhookEventProcessed,
} from "@/db/queries";

export async function handleLemonSqueezyWebhook(payload: any) {
  const eventName = payload.meta?.event_name;
  const eventId = payload.meta?.custom_data?.event_id || payload.data?.id;

  // Log webhook event for audit trail
  try {
    await createWebhookEvent({
      provider: "lemonsqueezy",
      eventId: eventId || `ls_${Date.now()}`,
      eventType: eventName,
      payload,
    });
  } catch (error) {
    logger.error("Failed to log webhook event", error);
  }

  try {
    const data = payload.data;
    const attributes = data?.attributes;
    const userId =
      attributes?.custom_data?.user_id ||
      attributes?.user_id ||
      payload.meta?.custom_data?.user_id;

    if (!userId) {
      logger.warn("LemonSqueezy webhook without user_id", {
        event: eventName,
        orderId: data?.id,
      });
    }

    switch (eventName) {
      case "order_created":
        await handleOrderCreated(data, attributes, userId);
        break;

      case "order_paid":
        await handleOrderPaid(data, attributes, userId);
        break;

      case "order_refunded":
        await handleOrderRefunded(data, attributes, userId);
        break;

      case "subscription_created":
        await handleSubscriptionCreated(data, attributes, userId);
        break;

      case "subscription_updated":
        await handleSubscriptionUpdated(data, attributes, userId);
        break;

      case "subscription_cancelled":
        await handleSubscriptionCancelled(data, attributes, userId);
        break;

      case "subscription_resumed":
        await handleSubscriptionResumed(data, attributes, userId);
        break;

      case "subscription_expired":
        await handleSubscriptionExpired(data, attributes, userId);
        break;

      case "subscription_paused":
        await handleSubscriptionPaused(data, attributes, userId);
        break;

      case "subscription_unpaused":
        await handleSubscriptionUnpaused(data, attributes, userId);
        break;

      case "subscription_payment_success":
        await handleSubscriptionPaymentSuccess(data, attributes, userId);
        break;

      case "subscription_payment_failed":
        await handleSubscriptionPaymentFailed(data, attributes, userId);
        break;

      case "subscription_payment_recovered":
        await handleSubscriptionPaymentRecovered(data, attributes, userId);
        break;

      default:
        logger.info("Unhandled LemonSqueezy webhook event", {
          event: eventName,
        });
    }

    // Mark webhook as processed
    await markWebhookEventProcessed(eventId || `ls_${Date.now()}`);
  } catch (error) {
    logger.error("Error processing LemonSqueezy webhook", error, {
      eventType: eventName,
    });
    await markWebhookEventProcessed(
      eventId || `ls_${Date.now()}`,
      error instanceof Error ? error.message : "Unknown error"
    );
    throw error;
  }
}

async function handleOrderCreated(data: any, attributes: any, userId: string) {
  if (!userId) return;

  const orderId = data.id;

  await createOrder({
    userId,
    provider: "lemonsqueezy",
    providerOrderId: orderId,
    providerCustomerId: attributes.customer_id?.toString(),
    status: "pending",
    productName: attributes.first_order_item?.product_name || "Purchase",
    productId: attributes.first_order_item?.product_id?.toString(),
    amount: Math.round(parseFloat(attributes.subtotal) * 100), // Convert to cents
    currency: attributes.currency?.toLowerCase() || "usd",
    tax: Math.round(parseFloat(attributes.tax || 0) * 100),
    total: Math.round(parseFloat(attributes.total) * 100),
    metadata: {
      lemonSqueezyOrderId: orderId,
      orderNumber: attributes.order_number,
    },
  });

  // Update user's LemonSqueezy customer ID
  if (attributes.customer_id) {
    await updateUser(userId, {
      lemonSqueezyCustomerId: attributes.customer_id.toString(),
    });
  }

  logger.payment("order_created", { userId, orderId });
}

async function handleOrderPaid(data: any, attributes: any, userId: string) {
  if (!userId) return;

  const orderId = data.id;
  const dbOrder = await getOrderByProviderId("lemonsqueezy", orderId);

  if (dbOrder) {
    // Update existing order
    await updateOrder(dbOrder.id, {
      status: "paid",
      metadata: {
        ...(dbOrder.metadata || {}),
        receiptUrl: attributes.urls?.receipt,
        paidAt: attributes.created_at,
      },
    });
  } else {
    // Create new order if it doesn't exist
    await createOrder({
      userId,
      provider: "lemonsqueezy",
      providerOrderId: orderId,
      providerCustomerId: attributes.customer_id?.toString(),
      status: "paid",
      productName: attributes.first_order_item?.product_name || "Purchase",
      productId: attributes.first_order_item?.product_id?.toString(),
      amount: Math.round(parseFloat(attributes.subtotal) * 100),
      currency: attributes.currency?.toLowerCase() || "usd",
      tax: Math.round(parseFloat(attributes.tax || 0) * 100),
      total: Math.round(parseFloat(attributes.total) * 100),
      receiptUrl: attributes.urls?.receipt,
      metadata: {
        lemonSqueezyOrderId: orderId,
        orderNumber: attributes.order_number,
        paidAt: attributes.created_at,
      },
    });
  }

  logger.payment("order_paid", { userId, orderId });
}

async function handleOrderRefunded(data: any, attributes: any, userId: string) {
  if (!userId) return;

  const orderId = data.id;
  const dbOrder = await getOrderByProviderId("lemonsqueezy", orderId);

  if (!dbOrder) {
    logger.warn("Order not found for refund", { orderId });
    return;
  }

  await updateOrder(dbOrder.id, {
    status: "refunded",
    refundedAmount: Math.round(parseFloat(attributes.refunded_amount || attributes.total) * 100),
    refundedAt: new Date(),
    metadata: {
      ...(dbOrder.metadata || {}),
      refundedAt: new Date().toISOString(),
    },
  });

  logger.payment("order_refunded", { userId, orderId });
}

async function handleSubscriptionCreated(
  data: any,
  attributes: any,
  userId: string
) {
  if (!userId) return;

  const subscriptionId = data.id;
  const variantName = attributes.variant_name || attributes.product_name;

  await createSubscription({
    userId,
    provider: "lemonsqueezy",
    providerSubscriptionId: subscriptionId,
    providerCustomerId: attributes.customer_id?.toString(),
    status: mapLemonSqueezyStatus(attributes.status),
    planName: variantName || "Subscription",
    planId: attributes.variant_id?.toString(),
    amount: Math.round(parseFloat(attributes.subtotal || 0) * 100),
    currency: attributes.currency?.toLowerCase() || "usd",
    interval: detectInterval(variantName),
    currentPeriodStart: new Date(attributes.created_at),
    currentPeriodEnd: new Date(attributes.renews_at || attributes.ends_at),
    trialEnd: attributes.trial_ends_at
      ? new Date(attributes.trial_ends_at)
      : undefined,
    metadata: {
      lemonSqueezySubscriptionId: subscriptionId,
      variantId: attributes.variant_id,
      productId: attributes.product_id,
    },
  });

  // Update user's LemonSqueezy customer ID and subscription status
  await updateUser(userId, {
    lemonSqueezyCustomerId: attributes.customer_id?.toString(),
    isSubscribed: attributes.status === "active",
    subscriptionTier: variantName,
  });

  logger.payment("subscription_created", {
    userId,
    subscriptionId,
    status: attributes.status,
  });
}

async function handleSubscriptionUpdated(
  data: any,
  attributes: any,
  userId: string
) {
  const subscriptionId = data.id;
  const dbSubscription = await getSubscriptionByProviderId(
    "lemonsqueezy",
    subscriptionId
  );

  if (!dbSubscription) {
    logger.warn("Subscription not found in database", { subscriptionId });
    return;
  }

  const updateData: any = {
    status: mapLemonSqueezyStatus(attributes.status),
    currentPeriodEnd: new Date(attributes.renews_at || attributes.ends_at),
    cancelAtPeriodEnd: !!attributes.cancelled,
  };

  // Handle plan changes
  if (attributes.variant_id_changed) {
    const variantName = attributes.variant_name || attributes.product_name;
    updateData.planName = variantName;
    updateData.planId = attributes.variant_id?.toString();
    updateData.amount = Math.round(parseFloat(attributes.subtotal || 0) * 100);
    updateData.interval = detectInterval(variantName);
  }

  // Handle cancellation
  if (attributes.cancelled && attributes.ends_at) {
    updateData.canceledAt = new Date();
    updateData.endedAt = new Date(attributes.ends_at);
  }

  await updateSubscription(dbSubscription.id, updateData);

  // Update user subscription status
  await updateUser(dbSubscription.userId, {
    isSubscribed: attributes.status === "active",
    subscriptionTier:
      attributes.status === "active"
        ? updateData.planName || dbSubscription.planName
        : undefined,
  });

  logger.payment("subscription_updated", {
    userId: dbSubscription.userId,
    subscriptionId,
    status: attributes.status,
  });
}

async function handleSubscriptionCancelled(
  data: any,
  attributes: any,
  userId: string
) {
  const subscriptionId = data.id;
  const dbSubscription = await getSubscriptionByProviderId(
    "lemonsqueezy",
    subscriptionId
  );

  if (!dbSubscription) return;

  await updateSubscription(dbSubscription.id, {
    status: "canceled",
    cancelAtPeriodEnd: true,
    canceledAt: new Date(),
    endedAt: attributes.ends_at ? new Date(attributes.ends_at) : undefined,
  });

  // Keep access until end of period
  logger.payment("subscription_cancelled", {
    userId: dbSubscription.userId,
    subscriptionId,
    endsAt: attributes.ends_at,
  });
}

async function handleSubscriptionResumed(
  data: any,
  attributes: any,
  userId: string
) {
  const subscriptionId = data.id;
  const dbSubscription = await getSubscriptionByProviderId(
    "lemonsqueezy",
    subscriptionId
  );

  if (!dbSubscription) return;

  await updateSubscription(dbSubscription.id, {
    status: "active",
    cancelAtPeriodEnd: false,
    currentPeriodEnd: new Date(attributes.renews_at),
  });

  await updateUser(dbSubscription.userId, {
    isSubscribed: true,
  });

  logger.payment("subscription_resumed", {
    userId: dbSubscription.userId,
    subscriptionId,
  });
}

async function handleSubscriptionExpired(
  data: any,
  attributes: any,
  userId: string
) {
  const subscriptionId = data.id;
  const dbSubscription = await getSubscriptionByProviderId(
    "lemonsqueezy",
    subscriptionId
  );

  if (!dbSubscription) return;

  await updateSubscription(dbSubscription.id, {
    status: "canceled",
    endedAt: new Date(attributes.ends_at || Date.now()),
  });

  await updateUser(dbSubscription.userId, {
    isSubscribed: false,
    subscriptionTier: undefined,
  });

  logger.payment("subscription_expired", {
    userId: dbSubscription.userId,
    subscriptionId,
  });
}

async function handleSubscriptionPaused(
  data: any,
  attributes: any,
  userId: string
) {
  const subscriptionId = data.id;
  const dbSubscription = await getSubscriptionByProviderId(
    "lemonsqueezy",
    subscriptionId
  );

  if (!dbSubscription) return;

  await updateSubscription(dbSubscription.id, {
    status: "paused",
  });

  logger.payment("subscription_paused", {
    userId: dbSubscription.userId,
    subscriptionId,
  });
}

async function handleSubscriptionUnpaused(
  data: any,
  attributes: any,
  userId: string
) {
  const subscriptionId = data.id;
  const dbSubscription = await getSubscriptionByProviderId(
    "lemonsqueezy",
    subscriptionId
  );

  if (!dbSubscription) return;

  await updateSubscription(dbSubscription.id, {
    status: "active",
  });

  await updateUser(dbSubscription.userId, {
    isSubscribed: true,
  });

  logger.payment("subscription_unpaused", {
    userId: dbSubscription.userId,
    subscriptionId,
  });
}

async function handleSubscriptionPaymentSuccess(
  data: any,
  attributes: any,
  userId: string
) {
  const subscriptionId = data.id;
  const dbSubscription = await getSubscriptionByProviderId(
    "lemonsqueezy",
    subscriptionId
  );

  if (!dbSubscription) return;

  // Record payment
  await createPayment({
    userId: dbSubscription.userId,
    subscriptionId: dbSubscription.id,
    provider: "lemonsqueezy",
    providerPaymentId: `ls_payment_${subscriptionId}_${Date.now()}`,
    providerCustomerId: attributes.customer_id?.toString(),
    status: "succeeded",
    amount: Math.round(parseFloat(attributes.total || 0) * 100),
    currency: attributes.currency?.toLowerCase() || "usd",
    billingReason: "subscription_cycle",
    paidAt: new Date(),
    metadata: {
      subscriptionId,
      renewsAt: attributes.renews_at,
    },
  });

  // Update subscription period
  await updateSubscription(dbSubscription.id, {
    currentPeriodEnd: new Date(attributes.renews_at),
    status: "active",
  });

  // Restore access if was past_due
  await updateUser(dbSubscription.userId, {
    isSubscribed: true,
  });

  logger.payment("subscription_payment_success", {
    userId: dbSubscription.userId,
    subscriptionId,
  });
}

async function handleSubscriptionPaymentFailed(
  data: any,
  attributes: any,
  userId: string
) {
  const subscriptionId = data.id;
  const dbSubscription = await getSubscriptionByProviderId(
    "lemonsqueezy",
    subscriptionId
  );

  if (!dbSubscription) return;

  // Record failed payment
  await createPayment({
    userId: dbSubscription.userId,
    subscriptionId: dbSubscription.id,
    provider: "lemonsqueezy",
    providerPaymentId: `ls_payment_failed_${subscriptionId}_${Date.now()}`,
    providerCustomerId: attributes.customer_id?.toString(),
    status: "failed",
    amount: Math.round(parseFloat(attributes.total || 0) * 100),
    currency: attributes.currency?.toLowerCase() || "usd",
    billingReason: "subscription_cycle",
    failureMessage: attributes.status_reason,
    metadata: {
      subscriptionId,
      statusReason: attributes.status_reason,
    },
  });

  // Update subscription status
  await updateSubscription(dbSubscription.id, {
    status: "past_due",
  });

  logger.payment("subscription_payment_failed", {
    userId: dbSubscription.userId,
    subscriptionId,
  });
}

async function handleSubscriptionPaymentRecovered(
  data: any,
  attributes: any,
  userId: string
) {
  const subscriptionId = data.id;
  const dbSubscription = await getSubscriptionByProviderId(
    "lemonsqueezy",
    subscriptionId
  );

  if (!dbSubscription) return;

  await updateSubscription(dbSubscription.id, {
    status: "active",
    currentPeriodEnd: new Date(attributes.renews_at),
  });

  await updateUser(dbSubscription.userId, {
    isSubscribed: true,
  });

  logger.payment("subscription_payment_recovered", {
    userId: dbSubscription.userId,
    subscriptionId,
  });
}

// Helper functions

function mapLemonSqueezyStatus(
  lsStatus: string
):
  | "active"
  | "past_due"
  | "canceled"
  | "unpaid"
  | "trialing"
  | "incomplete"
  | "incomplete_expired"
  | "paused" {
  const statusMap: Record<string, any> = {
    active: "active",
    on_trial: "trialing",
    past_due: "past_due",
    paused: "paused",
    cancelled: "canceled",
    expired: "canceled",
    unpaid: "unpaid",
  };

  return statusMap[lsStatus] || "active";
}

function detectInterval(planName: string): "month" | "year" | "week" | "day" {
  const name = planName.toLowerCase();
  if (name.includes("year") || name.includes("annual")) return "year";
  if (name.includes("week")) return "week";
  if (name.includes("day")) return "day";
  return "month";
}
