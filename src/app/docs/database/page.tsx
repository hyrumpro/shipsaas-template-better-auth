import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Database",
  description:
    "Apply the ShipSaaS Postgres migrations, understand the schema (Better Auth + app tables), and query the database with Drizzle.",
};

export default function DatabaseDocsPage() {
  return (
    <article>
      <h1>Database (Postgres + Drizzle)</h1>
      <p>
        ShipSaaS runs on plain Postgres — any provider works (Neon, Railway,
        Supabase, RDS, self-hosted). Drizzle is the type-safe query layer, and
        Better Auth owns the auth tables in the same schema. This guide covers
        the schema, migrations, and how to query the database.
      </p>

      <h2>Schema overview</h2>
      <p>The template ships with these tables:</p>
      <ul>
        <li>
          <code>user</code> — the Better Auth user table. Auth fields
          (<code>name</code>, <code>email</code>, <code>emailVerified</code>,{" "}
          <code>image</code>) plus app fields like{" "}
          <code>stripeCustomerId</code>, <code>isSubscribed</code>, and{" "}
          <code>subscriptionTier</code>.
        </li>
        <li>
          <code>session</code>, <code>account</code>,{" "}
          <code>verification</code> — Better Auth&apos;s session store,
          OAuth account links, and email-verification tokens.
        </li>
        <li>
          <code>subscriptions</code> — one row per active or
          historical subscription, keyed by{" "}
          <code>(provider, providerSubscriptionId)</code>.
        </li>
        <li>
          <code>orders</code> — one-time payments (digital
          downloads, lifetime deals, etc).
        </li>
        <li>
          <code>payments</code> — every recurring charge or
          invoice, keyed by <code>providerPaymentId</code> for
          idempotency.
        </li>
        <li>
          <code>webhook_events</code> — audit trail of every
          webhook received, with a <code>processed</code> flag for
          retry safety.
        </li>
        <li>
          <code>waitlist</code> and <code>email_log</code> — optional
          (see migrations 002 and 003).
        </li>
      </ul>

      <h2>Apply the migrations</h2>
      <p>
        The reviewed SQL lives in <code>migrations/</code> and is applied in
        order:
      </p>
      <ol>
        <li>
          <code>001_initial_schema.sql</code> — Better Auth tables, app
          tables, enums, indexes, and the{" "}
          <code>sync_user_subscription_status()</code> trigger that flips{" "}
          <code>user.isSubscribed</code> based on subscription status.
        </li>
        <li>
          <code>002_waitlist.sql</code> — optional pre-launch email capture
          table.
        </li>
        <li>
          <code>003_email_log.sql</code> — optional delivery-audit table.
        </li>
      </ol>
      <p>Either apply them directly:</p>
      <pre className="not-prose bg-secondary p-4 rounded-md text-sm overflow-x-auto">
{`psql $DATABASE_URL -f migrations/001_initial_schema.sql
psql $DATABASE_URL -f migrations/002_waitlist.sql
psql $DATABASE_URL -f migrations/003_email_log.sql`}
      </pre>
      <p>
        …or let Drizzle generate and push the schema from{" "}
        <code>src/db/schema.ts</code>:
      </p>
      <pre className="not-prose bg-secondary p-4 rounded-md text-sm overflow-x-auto">
{`npx drizzle-kit push`}
      </pre>

      <h2>Authorization model</h2>
      <p>
        There is no row-level security by design: the app connects with a
        single Postgres role and every query is scoped in application code —
        all database access goes through server-side code
        (<code>src/db/queries.ts</code> and route handlers); nothing queries
        the database from the browser.
      </p>
      <p>
        If you add admin features, scope them explicitly in the query layer
        (a role column on <code>user</code> plus server-side checks), and keep
        every table&apos;s <code>userId</code> foreign key — user deletion
        cascades across session, account, subscription, order, and payment
        rows.
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
import { user } from "@/db/schema";
import { eq } from "drizzle-orm";

const [row] = await db
  .select()
  .from(user)
  .where(eq(user.id, userId));`}
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
