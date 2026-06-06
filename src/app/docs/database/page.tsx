import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Database",
  description:
    "Run the Supabase Postgres migrations for ShipSaaS, understand the row-level security model, and query the database with Drizzle.",
};

export default function DatabaseDocsPage() {
  return (
    <article>
      <h1>Database (Supabase Postgres + Drizzle)</h1>
      <p>
        ShipSaaS uses Supabase for the Postgres database, Drizzle for
        the type-safe query layer, and Supabase Auth for user
        management. This guide covers the schema, the RLS model, and
        how to query the database.
      </p>

      <h2>Schema overview</h2>
      <p>The template ships with five tables:</p>
      <ul>
        <li>
          <code>users</code> &mdash; mirrors <code>auth.users</code> with
          app-specific fields like <code>stripeCustomerId</code>,{" "}
          <code>isSubscribed</code>, and <code>subscriptionTier</code>.
        </li>
        <li>
          <code>subscriptions</code> &mdash; one row per active or
          historical subscription, keyed by{" "}
          <code>(provider, providerSubscriptionId)</code>.
        </li>
        <li>
          <code>orders</code> &mdash; one-time payments (digital
          downloads, lifetime deals, etc).
        </li>
        <li>
          <code>payments</code> &mdash; every recurring charge or
          invoice, keyed by <code>providerPaymentId</code> for
          idempotency.
        </li>
        <li>
          <code>webhook_events</code> &mdash; audit trail of every
          webhook received, with a <code>processed</code> flag for
          retry safety.
        </li>
      </ul>

      <h2>Apply the migrations</h2>
      <p>
        Three SQL files in <code>supabase/migrations/</code> must be
        applied in order:
      </p>
      <ol>
        <li>
          <code>001_initial_schema.sql</code> &mdash; tables, enums,
          indexes, and the <code>sync_user_subscription_status()</code>{" "}
          trigger that flips <code>users.isSubscribed</code> based on
          subscription status.
        </li>
        <li>
          <code>002_row_level_security.sql</code> &mdash; RLS policies
          restricting each table to its own user (plus service-role
          bypass for webhooks).
        </li>
        <li>
          <code>003_rls_optimization.sql</code> &mdash; rewrites the
          policies to wrap <code>auth.uid()</code> and{" "}
          <code>auth.jwt()</code> in subselects, so the Postgres planner
          hoists them out of the per-row evaluation.
        </li>
      </ol>
      <p>Apply them via the Supabase CLI:</p>
      <pre className="not-prose bg-secondary p-4 rounded-md text-sm overflow-x-auto">
{`supabase link --project-ref your-project-ref
supabase db push`}
      </pre>
      <p>Or paste each file into the SQL editor in the Supabase dashboard.</p>

      <h2>Row-level security model</h2>
      <p>
        Every table has RLS enabled. A user can read or update only
        their own row(s). Webhooks run with the service role and bypass
        RLS to write subscription and payment records.
      </p>
      <p>
        If you need to query another user&apos;s data (for an admin
        dashboard, for example), create a separate Supabase client with
        the service role key in a server-only route handler. Never
        expose the service role key to the browser.
      </p>

      <h2>Querying with Drizzle</h2>
      <p>All queries go through <code>src/db/queries.ts</code>:</p>
      <pre className="not-prose bg-secondary p-4 rounded-md text-sm overflow-x-auto">
{`import { getUserById, getActiveSubscription } from "@/db/queries";

const user = await getUserById(userId);
const subscription = await getActiveSubscription(userId);

if (subscription) {
  // user has an active or trialing subscription
}`}
      </pre>
      <p>
        For one-off queries, use the Drizzle client directly:
      </p>
      <pre className="not-prose bg-secondary p-4 rounded-md text-sm overflow-x-auto">
{`import { db } from "@/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";

const [user] = await db
  .select()
  .from(users)
  .where(eq(users.id, userId));`}
      </pre>

      <h2>Local development</h2>
      <p>
        The included <code>docker-compose.yml</code> starts a local
        Postgres 16 on port <code>5432</code>. Point{" "}
        <code>DATABASE_URL</code> at it:
      </p>
      <pre className="not-prose bg-secondary p-4 rounded-md text-sm overflow-x-auto">
{`DATABASE_URL=postgresql://postgres:postgres@localhost:5432/shipsaas`}
      </pre>
      <p>
        Run <code>npm run db:push</code> to apply the Drizzle schema,
        and <code>npm run db:studio</code> to open Drizzle Studio for
        a local GUI.
      </p>
    </article>
  );
}
