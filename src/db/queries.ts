/**
 * Database Query Helpers
 * Type-safe database operations using Drizzle ORM
 */

import { db } from "./index";
import {
  users,
  subscriptions,
  orders,
  payments,
  webhookEvents,
  waitlist,
  emailLog,
} from "./schema";
import { eq, and, desc, inArray, or, sql } from "drizzle-orm";

type WebhookProvider = "stripe" | "lemonsqueezy" | "supabase" | "mailgun";

// ============================================================================
// USER OPERATIONS
// ============================================================================

export async function getUserById(userId: string) {
  const [user] = await db.select().from(users).where(eq(users.id, userId));
  return user;
}

export async function getUserByEmail(email: string) {
  const [user] = await db.select().from(users).where(eq(users.email, email));
  return user;
}

export async function createUser(data: {
  id: string; // From Supabase auth.users.id
  email: string;
  fullName?: string;
  avatarUrl?: string;
}) {
  const [user] = await db
    .insert(users)
    .values({
      id: data.id,
      email: data.email,
      fullName: data.fullName,
      avatarUrl: data.avatarUrl,
    })
    .returning();
  return user;
}

export async function updateUser(
  userId: string,
  data: {
    fullName?: string;
    avatarUrl?: string;
    stripeCustomerId?: string;
    lemonSqueezyCustomerId?: string;
    isSubscribed?: boolean;
    subscriptionTier?: string;
    metadata?: any;
  }
) {
  const [user] = await db
    .update(users)
    .set(data)
    .where(eq(users.id, userId))
    .returning();
  return user;
}

// ============================================================================
// SUBSCRIPTION OPERATIONS
// ============================================================================

export async function getActiveSubscription(userId: string) {
  const [subscription] = await db
    .select()
    .from(subscriptions)
    .where(
      and(
        eq(subscriptions.userId, userId),
        inArray(subscriptions.status, ["active", "trialing"])
      )
    )
    .orderBy(desc(subscriptions.createdAt))
    .limit(1);
  return subscription;
}

export async function getSubscriptionByProviderId(
  provider: "stripe" | "lemonsqueezy",
  providerSubscriptionId: string
) {
  const [subscription] = await db
    .select()
    .from(subscriptions)
    .where(
      and(
        eq(subscriptions.provider, provider),
        eq(subscriptions.providerSubscriptionId, providerSubscriptionId)
      )
    );
  return subscription;
}

export async function getUserSubscriptions(userId: string) {
  return db
    .select()
    .from(subscriptions)
    .where(eq(subscriptions.userId, userId))
    .orderBy(desc(subscriptions.createdAt));
}

export async function createSubscription(data: {
  userId: string;
  provider: "stripe" | "lemonsqueezy";
  providerSubscriptionId: string;
  providerCustomerId?: string;
  status:
    | "active"
    | "past_due"
    | "canceled"
    | "unpaid"
    | "trialing"
    | "incomplete"
    | "incomplete_expired"
    | "paused";
  planName: string;
  planId?: string;
  amount: number;
  currency?: string;
  interval: "month" | "year" | "week" | "day";
  intervalCount?: number;
  currentPeriodStart: Date;
  currentPeriodEnd: Date;
  trialStart?: Date;
  trialEnd?: Date;
  metadata?: any;
}) {
  const [subscription] = await db
    .insert(subscriptions)
    .values(data)
    .onConflictDoNothing({ target: subscriptions.providerSubscriptionId })
    .returning();
  return subscription;
}

export async function updateSubscription(
  subscriptionId: string,
  data: {
    status?:
      | "active"
      | "past_due"
      | "canceled"
      | "unpaid"
      | "trialing"
      | "incomplete"
      | "incomplete_expired"
      | "paused";
    planName?: string;
    planId?: string;
    amount?: number;
    currency?: string;
    interval?: "month" | "year" | "week" | "day";
    currentPeriodStart?: Date;
    currentPeriodEnd?: Date;
    cancelAtPeriodEnd?: boolean;
    canceledAt?: Date;
    endedAt?: Date;
    metadata?: any;
  }
) {
  const [subscription] = await db
    .update(subscriptions)
    .set(data)
    .where(eq(subscriptions.id, subscriptionId))
    .returning();
  return subscription;
}

export async function cancelSubscription(
  subscriptionId: string,
  cancelAtPeriodEnd: boolean = true
) {
  const data: any = {
    cancelAtPeriodEnd,
    canceledAt: new Date(),
  };

  if (!cancelAtPeriodEnd) {
    data.status = "canceled";
    data.endedAt = new Date();
  }

  return updateSubscription(subscriptionId, data);
}

// ============================================================================
// ORDER OPERATIONS
// ============================================================================

export async function getOrderByProviderId(
  provider: "stripe" | "lemonsqueezy",
  providerOrderId: string
) {
  const [order] = await db
    .select()
    .from(orders)
    .where(
      and(
        eq(orders.provider, provider),
        eq(orders.providerOrderId, providerOrderId)
      )
    );
  return order;
}

export async function getUserOrders(userId: string) {
  return db
    .select()
    .from(orders)
    .where(eq(orders.userId, userId))
    .orderBy(desc(orders.createdAt));
}

export async function createOrder(data: {
  userId: string;
  provider: "stripe" | "lemonsqueezy";
  providerOrderId: string;
  providerCustomerId?: string;
  status: "pending" | "paid" | "failed" | "refunded" | "canceled";
  productName: string;
  productId?: string;
  amount: number;
  currency?: string;
  tax?: number;
  total: number;
  receiptUrl?: string;
  invoiceUrl?: string;
  metadata?: any;
}) {
  const [order] = await db
    .insert(orders)
    .values(data)
    .onConflictDoNothing({ target: orders.providerOrderId })
    .returning();
  return order;
}

export async function updateOrder(
  orderId: string,
  data: {
    status?: "pending" | "paid" | "failed" | "refunded" | "canceled";
    refundedAmount?: number;
    refundedAt?: Date;
    refundReason?: string;
    metadata?: any;
  }
) {
  const [order] = await db
    .update(orders)
    .set(data)
    .where(eq(orders.id, orderId))
    .returning();
  return order;
}

// ============================================================================
// PAYMENT OPERATIONS
// ============================================================================

export async function getPaymentByProviderId(
  provider: "stripe" | "lemonsqueezy",
  providerPaymentId: string
) {
  const [payment] = await db
    .select()
    .from(payments)
    .where(
      and(
        eq(payments.provider, provider),
        eq(payments.providerPaymentId, providerPaymentId)
      )
    );
  return payment;
}

export async function getUserPayments(userId: string) {
  return db
    .select()
    .from(payments)
    .where(eq(payments.userId, userId))
    .orderBy(desc(payments.createdAt));
}

export async function getSubscriptionPayments(subscriptionId: string) {
  return db
    .select()
    .from(payments)
    .where(eq(payments.subscriptionId, subscriptionId))
    .orderBy(desc(payments.createdAt));
}

export async function createPayment(data: {
  userId: string;
  subscriptionId?: string;
  provider: "stripe" | "lemonsqueezy";
  providerPaymentId: string;
  providerCustomerId?: string;
  status: string;
  amount: number;
  currency?: string;
  billingReason?: string;
  attemptCount?: number;
  receiptUrl?: string;
  invoiceUrl?: string;
  failureCode?: string;
  failureMessage?: string;
  paidAt?: Date;
  metadata?: any;
}) {
  const [payment] = await db
    .insert(payments)
    .values(data)
    .onConflictDoNothing({ target: payments.providerPaymentId })
    .returning();
  return payment;
}

// ============================================================================
// WEBHOOK EVENT OPERATIONS
// ============================================================================

export async function getWebhookEventByEventId(
  provider: WebhookProvider,
  eventId: string
) {
  const [event] = await db
    .select()
    .from(webhookEvents)
    .where(
      and(
        eq(webhookEvents.provider, provider),
        eq(webhookEvents.eventId, eventId)
      )
    );
  return event;
}

export async function createWebhookEvent(data: {
  provider: WebhookProvider;
  eventId: string;
  eventType: string;
  payload: any;
}) {
  const [event] = await db
    .insert(webhookEvents)
    .values(data)
    .onConflictDoNothing({ target: webhookEvents.eventId })
    .returning();
  return event;
}

/**
 * Atomically claim a webhook for processing. A stale claim can be recovered
 * after five minutes, which protects serverless deployments from a crashed
 * invocation permanently blocking provider retries.
 */
export async function claimWebhookEvent(data: {
  provider: WebhookProvider;
  eventId: string;
  eventType: string;
  payload: unknown;
}): Promise<boolean> {
  const inserted = await db
    .insert(webhookEvents)
    .values({
      provider: data.provider,
      eventId: data.eventId,
      eventType: data.eventType,
      payload: data.payload,
    })
    .onConflictDoNothing({ target: webhookEvents.eventId })
    .returning({ id: webhookEvents.id });

  const [claimed] = await db
    .update(webhookEvents)
    .set({
      processing: true,
      processingStartedAt: new Date(),
    })
    .where(
      and(
        eq(webhookEvents.eventId, data.eventId),
        eq(webhookEvents.processed, false),
        or(
          eq(webhookEvents.processing, false),
          sql`${webhookEvents.processingStartedAt} < now() - interval '5 minutes'`
        )
      )
    )
    .returning({ id: webhookEvents.id });

  return Boolean(inserted[0] && claimed) || Boolean(claimed);
}

export async function markWebhookEventProcessed(
  providerEventId: string,
  error?: string
) {
  const [event] = await db
    .update(webhookEvents)
    .set({
      processed: true,
      processing: false,
      processedAt: new Date(),
      processingStartedAt: null,
      error,
    })
    .where(eq(webhookEvents.eventId, providerEventId))
    .returning();
  return event;
}

export async function markWebhookEventFailed(
  providerEventId: string,
  error: string
) {
  const [event] = await db
    .update(webhookEvents)
    .set({
      processed: false,
      processing: false,
      processingStartedAt: null,
      error,
    })
    .where(eq(webhookEvents.eventId, providerEventId))
    .returning();
  return event;
}

export async function getUnprocessedWebhookEvents(provider?: WebhookProvider) {
  const conditions = [eq(webhookEvents.processed, false)];

  if (provider) {
    conditions.push(eq(webhookEvents.provider, provider));
  }

  return db
    .select()
    .from(webhookEvents)
    .where(and(...conditions))
    .orderBy(webhookEvents.createdAt);
}

// ============================================================================
// ANALYTICS & REPORTING
// ============================================================================

export async function getUserStats(userId: string) {
  const user = await getUserById(userId);
  const activeSubscription = await getActiveSubscription(userId);
  const allOrders = await getUserOrders(userId);
  const allPayments = await getUserPayments(userId);

  const totalSpent = allPayments
    .filter((p) => p.status === "succeeded")
    .reduce((sum, p) => sum + p.amount, 0);

  return {
    user,
    activeSubscription,
    totalOrders: allOrders.length,
    totalPayments: allPayments.length,
    totalSpent,
    isSubscribed: user?.isSubscribed || false,
    subscriptionTier: user?.subscriptionTier || "free",
  };
}

export async function getRecentPayments(limit: number = 10) {
  return db
    .select()
    .from(payments)
    .orderBy(desc(payments.createdAt))
    .limit(limit);
}

export async function getActiveSubscriptionsCount() {
  const result = await db
    .select()
    .from(subscriptions)
    .where(eq(subscriptions.status, "active"));
  return result.length;
}

// ============================================================================
// WAITLIST
// ============================================================================

export async function addToWaitlist(data: {
  email: string;
  name?: string | null;
  referrer?: string | null;
  userAgent?: string | null;
}) {
  // onConflictDoNothing so duplicate sign-ups are a no-op (idempotent)
  const [entry] = await db
    .insert(waitlist)
    .values({
      email: data.email.toLowerCase().trim(),
      name: data.name?.trim() || null,
      referrer: data.referrer?.slice(0, 500) || null,
      userAgent: data.userAgent?.slice(0, 500) || null,
    })
    .onConflictDoNothing({ target: waitlist.email })
    .returning();
  return entry;
}

export async function getWaitlistCount() {
  const [result] = await db
    .select({ count: sql<number>`count(*)::int` })
    .from(waitlist);
  return Number(result?.count ?? 0);
}

export async function isOnWaitlist(email: string) {
  const [row] = await db
    .select({ id: waitlist.id })
    .from(waitlist)
    .where(eq(waitlist.email, email.toLowerCase().trim()));
  return Boolean(row);
}

// ============================================================================
// EMAIL LOG OPERATIONS
// ============================================================================
//
// The email log is written to from src/lib/mailgun.ts on every send and
// updated from /api/mailgun/webhook on delivery events (delivered, bounced,
// complained, unsubscribed, failed).
//
// Why a log table?
//   - Audit trail: "what emails did we send to X last month?"
//   - Delivery debugging: see whether a payment receipt actually landed.
//   - Bounce suppression: unsubscribe / hard-bounce users so we stop mailing.
//   - Replay: re-send a failed email by reading the log row + template.

export async function logEmailSent(data: {
  toEmail: string;
  toUserId?: string | null;
  subject: string;
  template: string;
  providerMessageId?: string | null;
  tags?: string[];
  metadata?: any;
}) {
  const [row] = await db
    .insert(emailLog)
    .values({
      toEmail: data.toEmail.toLowerCase().trim(),
      toUserId: data.toUserId ?? null,
      subject: data.subject,
      template: data.template,
      providerMessageId: data.providerMessageId ?? null,
      tags: data.tags ?? [],
      metadata: data.metadata ?? null,
      status: "sent",
    })
    .returning();
  return row;
}

export async function getEmailLogByProviderMessageId(
  providerMessageId: string
) {
  const [row] = await db
    .select()
    .from(emailLog)
    .where(eq(emailLog.providerMessageId, providerMessageId));
  return row;
}

export async function updateEmailLogStatus(
  providerMessageId: string,
  status:
    | "sent"
    | "delivered"
    | "bounced"
    | "complained"
    | "unsubscribed"
    | "failed",
  failureReason?: string | null
) {
  const [row] = await db
    .update(emailLog)
    .set({
      status,
      failureReason: failureReason ?? null,
      lastEventAt: new Date(),
    })
    .where(eq(emailLog.providerMessageId, providerMessageId))
    .returning();
  return row;
}

export async function getUserEmailLog(userId: string, limit = 20) {
  return db
    .select()
    .from(emailLog)
    .where(eq(emailLog.toUserId, userId))
    .orderBy(desc(emailLog.sentAt))
    .limit(limit);
}

export async function getRecentBounces(limit = 50) {
  return db
    .select()
    .from(emailLog)
    .where(eq(emailLog.status, "bounced"))
    .orderBy(desc(emailLog.lastEventAt))
    .limit(limit);
}
