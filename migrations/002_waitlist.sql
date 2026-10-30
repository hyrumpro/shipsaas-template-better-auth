-- ============================================================================
-- Waitlist table (for /waitlist pre-launch email capture)
-- Run this migration if you want the waitlist feature enabled.
-- The /waitlist page is env-gated (NEXT_PUBLIC_WAITLIST_ENABLED) and the
-- /api/waitlist endpoint is a no-op when DATABASE_URL is missing.
-- ============================================================================

CREATE TABLE IF NOT EXISTS waitlist (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email VARCHAR(255) NOT NULL UNIQUE,
  name VARCHAR(255),
  referrer VARCHAR(500),
  user_agent VARCHAR(500),
  created_at TIMESTAMP DEFAULT NOW() NOT NULL
);

CREATE INDEX IF NOT EXISTS waitlist_email_idx ON waitlist (email);
CREATE INDEX IF NOT EXISTS waitlist_created_at_idx ON waitlist (created_at);
