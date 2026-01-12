import {
  pgTable,
  uuid,
  varchar,
  text,
  timestamp,
  boolean,
  integer,
  decimal,
  pgEnum,
  jsonb,
  index,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

// ============================================================================
// ENUMS
// ============================================================================

export const subscriptionStatusEnum = pgEnum("subscription_status", [
  "active",
  "past_due",
  "canceled",
  "unpaid",
  "trialing",
  "incomplete",
  "incomplete_expired",
  "paused",
]);

export const planIntervalEnum = pgEnum("plan_interval", [
  "month",
  "year",
  "week",
  "day",
]);

export const paymentProviderEnum = pgEnum("payment_provider", [
  "stripe",
  "lemonsqueezy",
]);

export const orderStatusEnum = pgEnum("order_status", [
  "pending",
  "paid",
  "failed",
  "refunded",
  "canceled",
]);

// ============================================================================
// USERS TABLE
// ============================================================================
// Note: Supabase auth.users is the source of truth for authentication
// This table extends user data with app-specific fields
// The UUID matches auth.users.id from Supabase Auth

export const users = pgTable(
  "users",
  {
    // Primary key - matches Supabase auth.users.id
    id: uuid("id").primaryKey(),

    // Profile information
    email: varchar("email", { length: 255 }).notNull().unique(),
    fullName: varchar("full_name", { length: 255 }),
    avatarUrl: text("avatar_url"),

    // Subscription status (denormalized for quick access)
    isSubscribed: boolean("is_subscribed").default(false).notNull(),
    subscriptionTier: varchar("subscription_tier", { length: 50 }), // 'free', 'pro', 'enterprise'

    // Stripe/LemonSqueezy customer IDs
    stripeCustomerId: varchar("stripe_customer_id", { length: 255 }),
    lemonSqueezyCustomerId: varchar("lemonsqueezy_customer_id", {
      length: 255,
    }),

    // Metadata
    metadata: jsonb("metadata"), // For custom fields: onboarding_completed, preferences, etc.

    // Timestamps
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (table) => ({
    emailIdx: index("users_email_idx").on(table.email),
    stripeCustomerIdx: index("users_stripe_customer_idx").on(
      table.stripeCustomerId
    ),
    lemonSqueezyCustomerIdx: index("users_lemonsqueezy_customer_idx").on(
      table.lemonSqueezyCustomerId
    ),
  })
);

// ============================================================================
// SUBSCRIPTIONS TABLE
// ============================================================================

export const subscriptions = pgTable(
  "subscriptions",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),

    // Payment provider details
    provider: paymentProviderEnum("provider").notNull(),
    providerSubscriptionId: varchar("provider_subscription_id", {
      length: 255,
    })
      .notNull()
      .unique(), // stripe_sub_xxx or ls_sub_xxx
    providerCustomerId: varchar("provider_customer_id", { length: 255 }),

    // Subscription details
    status: subscriptionStatusEnum("status").notNull(),
    planName: varchar("plan_name", { length: 100 }).notNull(), // 'Pro Monthly', 'Enterprise Yearly'
    planId: varchar("plan_id", { length: 255 }), // Stripe Price ID or LemonSqueezy Variant ID

    // Pricing
    amount: integer("amount").notNull(), // Amount in cents (e.g., 2900 = $29.00)
    currency: varchar("currency", { length: 3 }).default("usd").notNull(),
    interval: planIntervalEnum("interval").notNull(),
    intervalCount: integer("interval_count").default(1).notNull(), // For custom intervals (e.g., every 3 months)

    // Billing periods
    currentPeriodStart: timestamp("current_period_start").notNull(),
    currentPeriodEnd: timestamp("current_period_end").notNull(),
    cancelAtPeriodEnd: boolean("cancel_at_period_end").default(false).notNull(),
    canceledAt: timestamp("canceled_at"),
    endedAt: timestamp("ended_at"),

    // Trial
    trialStart: timestamp("trial_start"),
    trialEnd: timestamp("trial_end"),

    // Metadata
    metadata: jsonb("metadata"), // Store additional provider-specific data

    // Timestamps
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (table) => ({
    userIdIdx: index("subscriptions_user_id_idx").on(table.userId),
    providerSubscriptionIdx: index("subscriptions_provider_sub_idx").on(
      table.providerSubscriptionId
    ),
    statusIdx: index("subscriptions_status_idx").on(table.status),
  })
);

// ============================================================================
// ORDERS TABLE (One-time payments)
// ============================================================================

export const orders = pgTable(
  "orders",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),

    // Payment provider details
    provider: paymentProviderEnum("provider").notNull(),
    providerOrderId: varchar("provider_order_id", { length: 255 })
      .notNull()
      .unique(), // Stripe Payment Intent or LemonSqueezy Order ID
    providerCustomerId: varchar("provider_customer_id", { length: 255 }),

    // Order details
    status: orderStatusEnum("status").notNull(),
    productName: varchar("product_name", { length: 255 }).notNull(),
    productId: varchar("product_id", { length: 255 }), // Stripe Product ID or LemonSqueezy Product ID

    // Pricing
    amount: integer("amount").notNull(), // Amount in cents
    currency: varchar("currency", { length: 3 }).default("usd").notNull(),
    tax: integer("tax").default(0), // Tax amount in cents
    total: integer("total").notNull(), // Total amount in cents (amount + tax)

    // Refund information
    refundedAmount: integer("refunded_amount").default(0),
    refundedAt: timestamp("refunded_at"),
    refundReason: text("refund_reason"),

    // Receipt
    receiptUrl: text("receipt_url"),
    invoiceUrl: text("invoice_url"),

    // Metadata
    metadata: jsonb("metadata"), // Store product details, customer info, etc.

    // Timestamps
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (table) => ({
    userIdIdx: index("orders_user_id_idx").on(table.userId),
    providerOrderIdx: index("orders_provider_order_idx").on(
      table.providerOrderId
    ),
    statusIdx: index("orders_status_idx").on(table.status),
    createdAtIdx: index("orders_created_at_idx").on(table.createdAt),
  })
);

// ============================================================================
// PAYMENTS TABLE (Payment history for subscriptions)
// ============================================================================

export const payments = pgTable(
  "payments",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    subscriptionId: uuid("subscription_id").references(() => subscriptions.id, {
      onDelete: "set null",
    }),

    // Payment provider details
    provider: paymentProviderEnum("provider").notNull(),
    providerPaymentId: varchar("provider_payment_id", { length: 255 })
      .notNull()
      .unique(), // Stripe Invoice ID or LemonSqueezy Invoice ID
    providerCustomerId: varchar("provider_customer_id", { length: 255 }),

    // Payment details
    status: varchar("status", { length: 50 }).notNull(), // 'succeeded', 'failed', 'pending', 'refunded'
    amount: integer("amount").notNull(), // Amount in cents
    currency: varchar("currency", { length: 3 }).default("usd").notNull(),

    // Billing details
    billingReason: varchar("billing_reason", { length: 100 }), // 'subscription_create', 'subscription_cycle', 'subscription_update'
    attemptCount: integer("attempt_count").default(1),

    // Receipt
    receiptUrl: text("receipt_url"),
    invoiceUrl: text("invoice_url"),

    // Failure information
    failureCode: varchar("failure_code", { length: 100 }),
    failureMessage: text("failure_message"),

    // Metadata
    metadata: jsonb("metadata"),

    // Timestamps
    paidAt: timestamp("paid_at"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (table) => ({
    userIdIdx: index("payments_user_id_idx").on(table.userId),
    subscriptionIdIdx: index("payments_subscription_id_idx").on(
      table.subscriptionId
    ),
    providerPaymentIdx: index("payments_provider_payment_idx").on(
      table.providerPaymentId
    ),
    statusIdx: index("payments_status_idx").on(table.status),
    createdAtIdx: index("payments_created_at_idx").on(table.createdAt),
  })
);

// ============================================================================
// WEBHOOK EVENTS TABLE (For debugging and audit trail)
// ============================================================================

export const webhookEvents = pgTable(
  "webhook_events",
  {
    id: uuid("id").primaryKey().defaultRandom(),

    // Provider details
    provider: paymentProviderEnum("provider").notNull(),
    eventId: varchar("event_id", { length: 255 }).notNull().unique(), // Provider's event ID
    eventType: varchar("event_type", { length: 100 }).notNull(),

    // Processing status
    processed: boolean("processed").default(false).notNull(),
    processedAt: timestamp("processed_at"),
    error: text("error"),

    // Event data
    payload: jsonb("payload").notNull(), // Full webhook payload

    // Timestamps
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (table) => ({
    eventIdIdx: index("webhook_events_event_id_idx").on(table.eventId),
    providerIdx: index("webhook_events_provider_idx").on(table.provider),
    processedIdx: index("webhook_events_processed_idx").on(table.processed),
    createdAtIdx: index("webhook_events_created_at_idx").on(table.createdAt),
  })
);

// ============================================================================
// RELATIONS
// ============================================================================

export const usersRelations = relations(users, ({ many }) => ({
  subscriptions: many(subscriptions),
  orders: many(orders),
  payments: many(payments),
}));

export const subscriptionsRelations = relations(subscriptions, ({ one, many }) => ({
  user: one(users, {
    fields: [subscriptions.userId],
    references: [users.id],
  }),
  payments: many(payments),
}));

export const ordersRelations = relations(orders, ({ one }) => ({
  user: one(users, {
    fields: [orders.userId],
    references: [users.id],
  }),
}));

export const paymentsRelations = relations(payments, ({ one }) => ({
  user: one(users, {
    fields: [payments.userId],
    references: [users.id],
  }),
  subscription: one(subscriptions, {
    fields: [payments.subscriptionId],
    references: [subscriptions.id],
  }),
}));
