-- ============================================================================
-- ShipSaaS Database Schema
-- Production-ready schema for SaaS applications with Supabase
-- ============================================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================================
-- ENUMS
-- ============================================================================

CREATE TYPE subscription_status AS ENUM (
  'active',
  'past_due',
  'canceled',
  'unpaid',
  'trialing',
  'incomplete',
  'incomplete_expired',
  'paused'
);

CREATE TYPE plan_interval AS ENUM (
  'month',
  'year',
  'week',
  'day'
);

CREATE TYPE payment_provider AS ENUM (
  'stripe',
  'lemonsqueezy'
);

CREATE TYPE order_status AS ENUM (
  'pending',
  'paid',
  'failed',
  'refunded',
  'canceled'
);

-- ============================================================================
-- USERS TABLE
-- ============================================================================
-- Extends Supabase auth.users with application-specific data
-- The id column references auth.users(id) from Supabase Auth

CREATE TABLE users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  
  -- Profile information
  email VARCHAR(255) NOT NULL UNIQUE,
  full_name VARCHAR(255),
  avatar_url TEXT,
  
  -- Subscription status (denormalized for performance)
  is_subscribed BOOLEAN DEFAULT FALSE NOT NULL,
  subscription_tier VARCHAR(50), -- 'free', 'pro', 'enterprise', etc.
  
  -- Payment provider customer IDs
  stripe_customer_id VARCHAR(255),
  lemonsqueezy_customer_id VARCHAR(255),
  
  -- Metadata for custom fields
  metadata JSONB,
  
  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Indexes for users table
CREATE INDEX users_email_idx ON users(email);
CREATE INDEX users_stripe_customer_idx ON users(stripe_customer_id);
CREATE INDEX users_lemonsqueezy_customer_idx ON users(lemonsqueezy_customer_id);

-- ============================================================================
-- SUBSCRIPTIONS TABLE
-- ============================================================================

CREATE TABLE subscriptions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  
  -- Payment provider details
  provider payment_provider NOT NULL,
  provider_subscription_id VARCHAR(255) NOT NULL UNIQUE,
  provider_customer_id VARCHAR(255),
  
  -- Subscription details
  status subscription_status NOT NULL,
  plan_name VARCHAR(100) NOT NULL,
  plan_id VARCHAR(255),
  
  -- Pricing
  amount INTEGER NOT NULL, -- Amount in cents
  currency VARCHAR(3) DEFAULT 'usd' NOT NULL,
  interval plan_interval NOT NULL,
  interval_count INTEGER DEFAULT 1 NOT NULL,
  
  -- Billing periods
  current_period_start TIMESTAMPTZ NOT NULL,
  current_period_end TIMESTAMPTZ NOT NULL,
  cancel_at_period_end BOOLEAN DEFAULT FALSE NOT NULL,
  canceled_at TIMESTAMPTZ,
  ended_at TIMESTAMPTZ,
  
  -- Trial
  trial_start TIMESTAMPTZ,
  trial_end TIMESTAMPTZ,
  
  -- Metadata
  metadata JSONB,
  
  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Indexes for subscriptions table
CREATE INDEX subscriptions_user_id_idx ON subscriptions(user_id);
CREATE INDEX subscriptions_provider_sub_idx ON subscriptions(provider_subscription_id);
CREATE INDEX subscriptions_status_idx ON subscriptions(status);

-- ============================================================================
-- ORDERS TABLE (One-time payments)
-- ============================================================================

CREATE TABLE orders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  
  -- Payment provider details
  provider payment_provider NOT NULL,
  provider_order_id VARCHAR(255) NOT NULL UNIQUE,
  provider_customer_id VARCHAR(255),
  
  -- Order details
  status order_status NOT NULL,
  product_name VARCHAR(255) NOT NULL,
  product_id VARCHAR(255),
  
  -- Pricing
  amount INTEGER NOT NULL, -- Amount in cents
  currency VARCHAR(3) DEFAULT 'usd' NOT NULL,
  tax INTEGER DEFAULT 0,
  total INTEGER NOT NULL,
  
  -- Refund information
  refunded_amount INTEGER DEFAULT 0,
  refunded_at TIMESTAMPTZ,
  refund_reason TEXT,
  
  -- Receipt
  receipt_url TEXT,
  invoice_url TEXT,
  
  -- Metadata
  metadata JSONB,
  
  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Indexes for orders table
CREATE INDEX orders_user_id_idx ON orders(user_id);
CREATE INDEX orders_provider_order_idx ON orders(provider_order_id);
CREATE INDEX orders_status_idx ON orders(status);
CREATE INDEX orders_created_at_idx ON orders(created_at);

-- ============================================================================
-- PAYMENTS TABLE (Payment history for subscriptions)
-- ============================================================================

CREATE TABLE payments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  subscription_id UUID REFERENCES subscriptions(id) ON DELETE SET NULL,
  
  -- Payment provider details
  provider payment_provider NOT NULL,
  provider_payment_id VARCHAR(255) NOT NULL UNIQUE,
  provider_customer_id VARCHAR(255),
  
  -- Payment details
  status VARCHAR(50) NOT NULL,
  amount INTEGER NOT NULL,
  currency VARCHAR(3) DEFAULT 'usd' NOT NULL,
  
  -- Billing details
  billing_reason VARCHAR(100),
  attempt_count INTEGER DEFAULT 1,
  
  -- Receipt
  receipt_url TEXT,
  invoice_url TEXT,
  
  -- Failure information
  failure_code VARCHAR(100),
  failure_message TEXT,
  
  -- Metadata
  metadata JSONB,
  
  -- Timestamps
  paid_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Indexes for payments table
CREATE INDEX payments_user_id_idx ON payments(user_id);
CREATE INDEX payments_subscription_id_idx ON payments(subscription_id);
CREATE INDEX payments_provider_payment_idx ON payments(provider_payment_id);
CREATE INDEX payments_status_idx ON payments(status);
CREATE INDEX payments_created_at_idx ON payments(created_at);

-- ============================================================================
-- WEBHOOK EVENTS TABLE (For debugging and audit trail)
-- ============================================================================

CREATE TABLE webhook_events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  
  -- Provider details
  provider payment_provider NOT NULL,
  event_id VARCHAR(255) NOT NULL UNIQUE,
  event_type VARCHAR(100) NOT NULL,
  
  -- Processing status
  processed BOOLEAN DEFAULT FALSE NOT NULL,
  processed_at TIMESTAMPTZ,
  error TEXT,
  
  -- Event data
  payload JSONB NOT NULL,
  
  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Indexes for webhook_events table
CREATE INDEX webhook_events_event_id_idx ON webhook_events(event_id);
CREATE INDEX webhook_events_provider_idx ON webhook_events(provider);
CREATE INDEX webhook_events_processed_idx ON webhook_events(processed);
CREATE INDEX webhook_events_created_at_idx ON webhook_events(created_at);

-- ============================================================================
-- FUNCTIONS
-- ============================================================================

-- Function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers for updated_at
CREATE TRIGGER update_users_updated_at
  BEFORE UPDATE ON users
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_subscriptions_updated_at
  BEFORE UPDATE ON subscriptions
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_orders_updated_at
  BEFORE UPDATE ON orders
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Function to sync user subscription status
CREATE OR REPLACE FUNCTION sync_user_subscription_status()
RETURNS TRIGGER AS $$
BEGIN
  -- Update user's subscription status based on active subscriptions
  UPDATE users
  SET 
    is_subscribed = EXISTS (
      SELECT 1 FROM subscriptions 
      WHERE user_id = NEW.user_id 
      AND status IN ('active', 'trialing')
    ),
    subscription_tier = (
      SELECT plan_name 
      FROM subscriptions 
      WHERE user_id = NEW.user_id 
      AND status IN ('active', 'trialing')
      ORDER BY created_at DESC 
      LIMIT 1
    )
  WHERE id = NEW.user_id;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to sync subscription status
CREATE TRIGGER sync_subscription_status
  AFTER INSERT OR UPDATE ON subscriptions
  FOR EACH ROW
  EXECUTE FUNCTION sync_user_subscription_status();
