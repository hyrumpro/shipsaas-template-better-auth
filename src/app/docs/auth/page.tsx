import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Authentication",
  description:
    "Configure Better Auth for ShipSaaS: email verification, magic links, Google OAuth, sessions, and middleware gating.",
};

export default function AuthDocsPage() {
  return (
    <article>
      <h1>Authentication (Better Auth)</h1>
      <p>
        ShipSaaS uses <a href="https://better-auth.com/">Better Auth</a> for
        user accounts. The template ships with email/password + email
        verification, passwordless <strong>magic links</strong>, and{" "}
        <strong>Google OAuth</strong> out of the box — all backed by your own
        Postgres database, with no third-party auth service in the middle.
      </p>

      <h2>1. Set your environment</h2>
      <p>
        Copy <code>.env.example</code> to <code>.env.local</code> and set:
      </p>
      <pre className="not-prose bg-secondary p-3 rounded-md text-sm overflow-x-auto mt-2">
        {`BETTER_AUTH_SECRET=<openssl rand -base64 32>
BETTER_AUTH_URL=http://localhost:3000
DATABASE_URL=postgresql://user:password@localhost:5432/shipsaas`}
      </pre>
      <p>
        The auth instance lives in <code>src/lib/auth.ts</code> and the browser
        client in <code>src/lib/auth-client.ts</code>. All auth routes are
        handled by <code>src/app/api/auth/[...all]/route.ts</code> — there is
        nothing to deploy or configure outside your app.
      </p>

      <h2>2. Run the migrations</h2>
      <p>
        Better Auth&apos;s tables (<code>user</code>, <code>session</code>,{" "}
        <code>account</code>, <code>verification</code>) live in{" "}
        <code>src/db/schema.ts</code> alongside your app tables — one database,
        one schema, type-safe end to end. Apply them either way:
      </p>
      <pre className="not-prose bg-secondary p-4 rounded-md text-sm overflow-x-auto">
        {`# Option A: let Drizzle push the schema (fast, dev-friendly)
npx drizzle-kit push

# Option B: apply the reviewed SQL
psql $DATABASE_URL -f migrations/001_initial_schema.sql`}
      </pre>

      <h2>3. Email verification</h2>
      <p>
        Sign-up requires email verification before sign-in
        (<code>emailAndPassword.requireEmailVerification</code>). The
        verification email is sent automatically on sign-up
        (<code>emailVerification.sendOnSignUp</code>), and clicking the link
        signs the user in (<code>autoSignInAfterVerification</code>).
      </p>
      <p>
        Emails go through Mailgun using the templates in{" "}
        <code>src/lib/email-templates.ts</code> (
        <code>emailVerification</code>, <code>magicLink</code>,{" "}
        <code>passwordReset</code>). For local development set{" "}
        <code>SKIP_EMAILS=true</code> to log links to the console instead of
        sending.
      </p>

      <h2>4. Magic links</h2>
      <p>
        The <code>magicLink</code> plugin is enabled on the server and the{" "}
        <code>magicLinkClient</code> on the browser. Users click{" "}
        <em>Send magic link</em> on <code>/auth/login</code>, receive a
        one-time link, and land signed in. Delivery is wired in{" "}
        <code>src/lib/auth.ts</code> via{" "}
        <code>magicLink(&#123; sendMagicLink &#125;)</code>.
      </p>

      <h2>5. Google OAuth</h2>
      <ol>
        <li>
          In the{" "}
          <a href="https://console.cloud.google.com/">Google Cloud Console</a>,
          create a project and configure the OAuth consent screen.
        </li>
        <li>
          Under <em>Credentials</em>, create an <strong>OAuth client ID</strong>{" "}
          for a <em>Web application</em> and add this authorized redirect URI:
          <pre className="not-prose bg-secondary p-3 rounded-md text-sm overflow-x-auto mt-2">
            {`http://localhost:3000/api/auth/callback/google
https://yourdomain.com/api/auth/callback/google`}
          </pre>
        </li>
        <li>
          Set <code>GOOGLE_CLIENT_ID</code> and{" "}
          <code>GOOGLE_CLIENT_SECRET</code> in <code>.env.local</code>. The
          provider is wired automatically in{" "}
          <code>src/lib/auth.ts</code> when both are present.
        </li>
      </ol>

      <h2>6. Sessions and route protection</h2>
      <p>
        Sessions are stored in the <code>session</code> table with a 7-day
        expiry, refreshed daily, and cookie-cached for 5 minutes so most
        server-rendered requests skip the session lookup.
      </p>
      <ul>
        <li>
          <strong>Server components / route handlers:</strong> call{" "}
          <code>getServerSession()</code> from <code>src/lib/auth.ts</code>.
          The dashboard layout redirects unauthenticated users to{" "}
          <code>/auth/login?redirectTo=...</code>.
        </li>
        <li>
          <strong>Client components:</strong> use the <code>useAuth()</code>{" "}
          hook (<code>src/hooks/useAuth.ts</code>), which wraps Better Auth in
          TanStack Query.
        </li>
        <li>
          <strong>Middleware</strong> (<code>proxy.ts</code>) only checks that
          the session cookie is present and redirects early; full verification
          always happens server-side. API routes get a JSON{" "}
          <code>401</code> instead of a redirect.
        </li>
      </ul>

      <h2>7. Security posture</h2>
      <p>
        What is enabled out of the box, so you don&apos;t have to think about
        it:
      </p>
      <ul>
        <li>
          <strong>Cookies</strong> — httpOnly, Secure in production,
          SameSite=Lax, signed by <code>BETTER_AUTH_SECRET</code>.
        </li>
        <li>
          <strong>CSRF &amp; origin checks</strong> — origin validation on
          every auth mutation; callback and redirect URLs are validated
          against <code>BETTER_AUTH_URL</code> (plus optional{" "}
          <code>BETTER_AUTH_TRUSTED_ORIGINS</code>).
        </li>
        <li>
          <strong>Rate limiting</strong> — 100 req/10s per IP overall, with
          sign-in capped at 5/min and sign-up and password reset at 3/min.
        </li>
        <li>
          <strong>Email verification required</strong> — accounts can&apos;t
          sign in until verified, and sign-in responses don&apos;t reveal
          whether an email is registered.
        </li>
        <li>
          <strong>OAuth tokens encrypted at rest</strong> — Google tokens in
          the <code>account</code> table are AES-256-GCM encrypted.
        </li>
        <li>
          <strong>Session hygiene</strong> — 7-day expiry with daily refresh,
          a 1-hour &ldquo;fresh&rdquo; window for sensitive actions, password
          reset revokes every session, and the 5-minute cookie cache is
          HMAC-signed.
        </li>
      </ul>
      <p>
        The middleware (<code>proxy.ts</code>) only checks cookie presence for
        early redirects — real authorization always happens server-side via{" "}
        <code>getServerSession()</code> in layouts and route handlers.
      </p>

      <h2>8. Test it</h2>
      <ul>
        <li>
          Visit <code>/auth/register</code>, sign up, and check the Mailgun log
          (or console) for the verification email. Clicking the link should
          land you signed in on the dashboard.
        </li>
        <li>
          Sign out, go to <code>/auth/login</code>, use{" "}
          <em>Magic link</em>, and confirm the passwordless round-trip.
        </li>
        <li>
          Click <em>Continue with Google</em> and complete the OAuth
          round-trip.
        </li>
        <li>
          Check <code>/api/auth/ok</code> returns{" "}
          <code>&#123;&quot;status&quot;:&quot;ok&quot;&#125;</code>.
        </li>
      </ul>
    </article>
  );
}
