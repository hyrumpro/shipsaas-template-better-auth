import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Authentication",
  description:
    "Configure Supabase Auth for ShipSaaS: magic links, Google OAuth, and the auth webhook that syncs new users into your database.",
};

export default function AuthDocsPage() {
  return (
    <article>
      <h1>Authentication (Magic links + Google)</h1>
      <p>
        ShipSaaS uses Supabase Auth for user accounts. The template ships with
        two sign-in methods out of the box: passwordless{" "}
        <strong>magic links</strong> and <strong>Google OAuth</strong>.
      </p>

      <h2>1. Create a Supabase project</h2>
      <ol>
        <li>
          Sign up at <a href="https://supabase.com/">supabase.com</a> and create
          a new project.
        </li>
        <li>
          In <em>Project Settings &rarr; API</em>, copy the <strong>URL</strong>
          , <strong>anon key</strong>, and <strong>service role key</strong>{" "}
          into <code>.env.local</code>:
          <pre className="not-prose bg-secondary p-3 rounded-md text-sm overflow-x-auto mt-2">
            {`NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_ROLE_KEY=eyJ...`}
          </pre>
        </li>
      </ol>

      <h2>2. Run the migrations</h2>
      <p>
        From the project root, apply the SQL migrations in{" "}
        <code>supabase/migrations/</code>:
      </p>
      <pre className="not-prose bg-secondary p-4 rounded-md text-sm overflow-x-auto">
        {`# Option A: Supabase CLI
supabase db push

# Option B: paste each file into the SQL editor in the Supabase dashboard`}
      </pre>
      <p>
        The migrations set up: the tables and triggers (
        <code>001_initial_schema.sql</code>), row-level security (
        <code>002_row_level_security.sql</code>), and RLS performance
        optimization (<code>003_rls_optimization.sql</code>), and webhook
        processing claims (<code>006_webhook_processing.sql</code>).
      </p>

      <h2>3. Enable magic links</h2>
      <ol>
        <li>
          In the Supabase dashboard go to{" "}
          <em>Authentication &rarr; Providers</em>.
        </li>
        <li>
          <strong>Email</strong> is on by default. Make sure{" "}
          <em>Confirm email</em> is enabled &mdash; this is how magic links
          work.
        </li>
        <li>
          Customize the email templates under{" "}
          <em>Authentication &rarr; Email Templates</em> if you want.
        </li>
      </ol>
      <p>
        That is it. Users can now click <em>Send Magic Link</em> on the sign-in
        page, receive an email with a one-time link, and land signed in.
      </p>

      <h2>4. Enable Google OAuth</h2>
      <ol>
        <li>
          In the{" "}
          <a href="https://console.cloud.google.com/">Google Cloud Console</a>,
          create a new project (or use an existing one).
        </li>
        <li>
          Configure the OAuth consent screen under{" "}
          <em>APIs &amp; Services &rarr; OAuth consent screen</em>. Add your
          brand, support email, and the scopes <code>email</code>,{" "}
          <code>profile</code>, and <code>openid</code>.
        </li>
        <li>
          Under <em>Credentials</em>, create an <strong>OAuth client ID</strong>{" "}
          for a <em>Web application</em>. Add these authorized redirect URIs:
          <pre className="not-prose bg-secondary p-3 rounded-md text-sm overflow-x-auto mt-2">
            {`https://xxxxx.supabase.co/auth/v1/callback
http://localhost:3000/auth/callback`}
          </pre>
        </li>
        <li>
          Copy the <strong>Client ID</strong> and <strong>Client secret</strong>{" "}
          into Supabase under{" "}
          <em>Authentication &rarr; Providers &rarr; Google</em>.
        </li>
      </ol>

      <h2>5. Configure the auth webhook</h2>
      <p>
        ShipSaaS uses a Supabase database hook to keep your <code>users</code>{" "}
        table in sync with <code>auth.users</code> and to send the welcome
        email.
      </p>
      <ol>
        <li>
          Generate a strong random secret and put it in{" "}
          <code>SUPABASE_WEBHOOK_SECRET</code> in <code>.env.local</code> AND in
          your Vercel/deployment env vars.
        </li>
        <li>
          In Supabase go to{" "}
          <em>Database &rarr; Webhooks &rarr; Create a new hook</em>.
        </li>
        <li>
          Name it &ldquo;User Sync&rdquo;, table <code>users</code>, events{" "}
          <code>INSERT</code>, <code>UPDATE</code>, <code>DELETE</code>, and
          HTTP method <code>POST</code> to:
          <pre className="not-prose bg-secondary p-3 rounded-md text-sm overflow-x-auto mt-2">
            {`https://yourdomain.com/api/auth/webhook`}
          </pre>
        </li>
        <li>
          Configure the webhook signature using the provider&apos;s HMAC SHA-256
          setting. The handler accepts <code>X-Supabase-Signature</code>
          or <code>X-Webhook-Signature</code> containing the hexadecimal digest;
          do not send the raw secret as the header value.
        </li>
      </ol>
      <p>
        The webhook handler verifies the signature before parsing, records a
        durable dedupe key, and keeps failed processing retryable.
      </p>

      <h2>6. Test it</h2>
      <ul>
        <li>
          Visit <code>/auth/register</code>, sign up with your email, and check
          the Mailgun logs (or your inbox) for the welcome email.
        </li>
        <li>
          Sign out, go to <code>/auth/login</code>, click{" "}
          <em>Send Magic Link</em>, and confirm you can sign in without a
          password.
        </li>
        <li>
          Click <em>Sign in with Google</em> and complete the OAuth round-trip.
        </li>
      </ul>
    </article>
  );
}
