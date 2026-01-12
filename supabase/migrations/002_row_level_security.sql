-- ============================================================================
-- Row Level Security (RLS) Policies
-- Secure access to data based on authenticated user
-- ============================================================================

-- Enable RLS on all tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE webhook_events ENABLE ROW LEVEL SECURITY;

-- ============================================================================
-- USERS TABLE POLICIES
-- ============================================================================

-- Users can view their own profile
CREATE POLICY "Users can view own profile"
  ON users
  FOR SELECT
  USING (auth.uid() = id);

-- Users can update their own profile
CREATE POLICY "Users can update own profile"
  ON users
  FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Users can insert their own profile (for initial setup)
CREATE POLICY "Users can insert own profile"
  ON users
  FOR INSERT
  WITH CHECK (auth.uid() = id);

-- Service role can do everything (for webhooks and admin operations)
CREATE POLICY "Service role has full access to users"
  ON users
  FOR ALL
  USING (auth.jwt()->>'role' = 'service_role');

-- ============================================================================
-- SUBSCRIPTIONS TABLE POLICIES
-- ============================================================================

-- Users can view their own subscriptions
CREATE POLICY "Users can view own subscriptions"
  ON subscriptions
  FOR SELECT
  USING (auth.uid() = user_id);

-- Service role can manage all subscriptions (for webhooks)
CREATE POLICY "Service role has full access to subscriptions"
  ON subscriptions
  FOR ALL
  USING (auth.jwt()->>'role' = 'service_role');

-- ============================================================================
-- ORDERS TABLE POLICIES
-- ============================================================================

-- Users can view their own orders
CREATE POLICY "Users can view own orders"
  ON orders
  FOR SELECT
  USING (auth.uid() = user_id);

-- Service role can manage all orders (for webhooks)
CREATE POLICY "Service role has full access to orders"
  ON orders
  FOR ALL
  USING (auth.jwt()->>'role' = 'service_role');

-- ============================================================================
-- PAYMENTS TABLE POLICIES
-- ============================================================================

-- Users can view their own payment history
CREATE POLICY "Users can view own payments"
  ON payments
  FOR SELECT
  USING (auth.uid() = user_id);

-- Service role can manage all payments (for webhooks)
CREATE POLICY "Service role has full access to payments"
  ON payments
  FOR ALL
  USING (auth.jwt()->>'role' = 'service_role');

-- ============================================================================
-- WEBHOOK EVENTS TABLE POLICIES
-- ============================================================================

-- Only service role can access webhook events (admin/debugging only)
CREATE POLICY "Service role has full access to webhook events"
  ON webhook_events
  FOR ALL
  USING (auth.jwt()->>'role' = 'service_role');

-- ============================================================================
-- HELPER FUNCTIONS FOR AUTHORIZATION
-- ============================================================================

-- Function to check if user has active subscription
CREATE OR REPLACE FUNCTION has_active_subscription(user_uuid UUID)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 
    FROM subscriptions 
    WHERE user_id = user_uuid 
    AND status IN ('active', 'trialing')
    AND current_period_end > NOW()
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to check if user has specific subscription tier
CREATE OR REPLACE FUNCTION has_subscription_tier(user_uuid UUID, tier_name TEXT)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 
    FROM subscriptions 
    WHERE user_id = user_uuid 
    AND status IN ('active', 'trialing')
    AND current_period_end > NOW()
    AND plan_name ILIKE '%' || tier_name || '%'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get user's current subscription tier
CREATE OR REPLACE FUNCTION get_user_subscription_tier(user_uuid UUID)
RETURNS TEXT AS $$
DECLARE
  tier TEXT;
BEGIN
  SELECT plan_name INTO tier
  FROM subscriptions
  WHERE user_id = user_uuid
  AND status IN ('active', 'trialing')
  AND current_period_end > NOW()
  ORDER BY created_at DESC
  LIMIT 1;
  
  RETURN COALESCE(tier, 'free');
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================================================
-- GRANTS
-- ============================================================================

-- Grant authenticated users access to their own data
GRANT SELECT, UPDATE ON users TO authenticated;
GRANT SELECT ON subscriptions TO authenticated;
GRANT SELECT ON orders TO authenticated;
GRANT SELECT ON payments TO authenticated;

-- Grant service role full access (for API routes and webhooks)
GRANT ALL ON users TO service_role;
GRANT ALL ON subscriptions TO service_role;
GRANT ALL ON orders TO service_role;
GRANT ALL ON payments TO service_role;
GRANT ALL ON webhook_events TO service_role;

-- Grant usage on sequences
GRANT USAGE ON ALL SEQUENCES IN SCHEMA public TO authenticated;
GRANT USAGE ON ALL SEQUENCES IN SCHEMA public TO service_role;
