-- ============================================================================
-- Migration 003: RLS Performance Optimization
--
-- Wraps auth.uid() and auth.jwt() calls in subselects so the PostgreSQL
-- planner can hoist them out of the per-row evaluation and cache the
-- result as a single InitPlan. This is the recommended pattern from
-- Supabase performance docs and the postgres-patterns skill.
--
-- Without this, every row scanned re-invokes auth.uid(), which on large
-- tables can be 10x slower than the equivalent (SELECT auth.uid()) form.
-- ============================================================================

-- USERS
DROP POLICY IF EXISTS "Users can view own profile" ON users;
CREATE POLICY "Users can view own profile"
  ON users
  FOR SELECT
  USING ((SELECT auth.uid()) = id);

DROP POLICY IF EXISTS "Users can update own profile" ON users;
CREATE POLICY "Users can update own profile"
  ON users
  FOR UPDATE
  USING ((SELECT auth.uid()) = id)
  WITH CHECK ((SELECT auth.uid()) = id);

DROP POLICY IF EXISTS "Users can insert own profile" ON users;
CREATE POLICY "Users can insert own profile"
  ON users
  FOR INSERT
  WITH CHECK ((SELECT auth.uid()) = id);

DROP POLICY IF EXISTS "Service role has full access to users" ON users;
CREATE POLICY "Service role has full access to users"
  ON users
  FOR ALL
  USING ((SELECT auth.jwt()->>'role') = 'service_role');

-- SUBSCRIPTIONS
DROP POLICY IF EXISTS "Users can view own subscriptions" ON subscriptions;
CREATE POLICY "Users can view own subscriptions"
  ON subscriptions
  FOR SELECT
  USING ((SELECT auth.uid()) = user_id);

DROP POLICY IF EXISTS "Service role has full access to subscriptions" ON subscriptions;
CREATE POLICY "Service role has full access to subscriptions"
  ON subscriptions
  FOR ALL
  USING ((SELECT auth.jwt()->>'role') = 'service_role');

-- ORDERS
DROP POLICY IF EXISTS "Users can view own orders" ON orders;
CREATE POLICY "Users can view own orders"
  ON orders
  FOR SELECT
  USING ((SELECT auth.uid()) = user_id);

DROP POLICY IF EXISTS "Service role has full access to orders" ON orders;
CREATE POLICY "Service role has full access to orders"
  ON orders
  FOR ALL
  USING ((SELECT auth.jwt()->>'role') = 'service_role');

-- PAYMENTS
DROP POLICY IF EXISTS "Users can view own payments" ON payments;
CREATE POLICY "Users can view own payments"
  ON payments
  FOR SELECT
  USING ((SELECT auth.uid()) = user_id);

DROP POLICY IF EXISTS "Service role has full access to payments" ON payments;
CREATE POLICY "Service role has full access to payments"
  ON payments
  FOR ALL
  USING ((SELECT auth.jwt()->>'role') = 'service_role');

-- WEBHOOK EVENTS
DROP POLICY IF EXISTS "Service role has full access to webhook events" ON webhook_events;
CREATE POLICY "Service role has full access to webhook events"
  ON webhook_events
  FOR ALL
  USING ((SELECT auth.jwt()->>'role') = 'service_role');
