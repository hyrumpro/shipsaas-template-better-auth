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
} from "./schema";
import { eq, and, desc, gte } from "drizzle-orm";

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
        eq(subscriptions.status, "active")
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
      and(eq(orders.provider, provider), eq(orders.providerOrderId, providerOrderId))
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
  const [order] = await db.insert(orders).values(data).returning();
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
  const [payment] = await db.insert(payments).values(data).returning();
  return payment;
}

// ============================================================================
// WEBHOOK EVENT OPERATIONS
// ============================================================================

export async function getWebhookEventByEventId(
  provider: "stripe" | "lemonsqueezy",
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
  provider: "stripe" | "lemonsqueezy";
  eventId: string;
  eventType: string;
  payload: any;
}) {
  const [event] = await db.insert(webhookEvents).values(data).returning();
  return event;
}

export async function markWebhookEventProcessed(
  eventId: string,
  error?: string
) {
  const [event] = await db
    .update(webhookEvents)
    .set({
      processed: true,
      processedAt: new Date(),
      error,
    })
    .where(eq(webhookEvents.id, eventId))
    .returning();
  return event;
}

export async function getUnprocessedWebhookEvents(
  provider?: "stripe" | "lemonsqueezy"
) {
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
