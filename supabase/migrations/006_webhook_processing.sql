-- Webhook delivery audit and processing claims are shared by billing,
-- authentication, and email providers.

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'webhook_provider') THEN
    CREATE TYPE webhook_provider AS ENUM ('stripe', 'lemonsqueezy', 'supabase', 'mailgun');
  END IF;
END $$;

ALTER TABLE webhook_events
  ALTER COLUMN provider TYPE webhook_provider
  USING provider::text::webhook_provider;

ALTER TABLE webhook_events
  ADD COLUMN IF NOT EXISTS processing boolean NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS processing_started_at timestamptz;

CREATE INDEX IF NOT EXISTS webhook_events_processing_idx
  ON webhook_events (processing, processed, processing_started_at);
