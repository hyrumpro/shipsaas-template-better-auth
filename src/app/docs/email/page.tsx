import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Email (Mailgun)",
  description:
    "Configure Mailgun transactional email with DKIM, DMARC, and SPF so ShipSaaS emails land in the inbox.",
};

export default function EmailDocsPage() {
  return (
    <article>
      <h1>Email setup (Mailgun)</h1>
      <p>
        ShipSaaS uses Mailgun to send transactional email: welcome messages,
        password resets, magic links, and receipts. This guide walks through
        configuring Mailgun, then adding the four DNS records that prove your
        domain is yours.
      </p>

      <h2>1. Create a Mailgun account</h2>
      <ol>
        <li>
          Sign up at <a href="https://www.mailgun.com/">mailgun.com</a> and add
          a custom sending domain (e.g. <code>mg.yourdomain.com</code>).
        </li>
        <li>
          In the Mailgun dashboard, copy the four DNS records shown on the
          domain-setup page. You will need them in step 3.
        </li>
        <li>
          Generate an API key under <em>Settings &rarr; API Keys</em> and keep
          it handy.
        </li>
      </ol>

      <h2>2. Configure environment variables</h2>
      <p>
        Copy <code>.env.example</code> to <code>.env.local</code> and fill in:
      </p>
      <pre className="not-prose bg-secondary p-4 rounded-md text-sm overflow-x-auto">
        {`MAILGUN_API_KEY=key-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
MAILGUN_DOMAIN=mg.yourdomain.com
MAILGUN_SUBDOMAIN=mg
MAILGUN_FROM_NOREPLY="Your App <noreply@mg.yourdomain.com>"
MAILGUN_FROM_ADMIN="Your App <admin@mg.yourdomain.com>"
MAILGUN_SUPPORT_EMAIL=support@yourdomain.com
MAILGUN_FORWARD_TO=hello@yourdomain.com
MAILGUN_WEBHOOK_SIGNING_KEY=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx`}
      </pre>

      <h2>3. Add the four DNS records</h2>
      <p>
        SPF, DKIM, and DMARC are important deliverability signals. Mailgun
        provides the exact records for your domain; this template documents the
        setup but cannot create DNS records or guarantee inbox placement.
      </p>

      <h3>SPF (TXT record on the subdomain)</h3>
      <pre className="not-prose bg-secondary p-4 rounded-md text-sm overflow-x-auto">
        {`Host:  mg.yourdomain.com
Type:  TXT
Value: v=spf1 include:mailgun.org ~all`}
      </pre>

      <h3>DKIM (TXT record Mailgun gives you)</h3>
      <pre className="not-prose bg-secondary p-4 rounded-md text-sm overflow-x-auto">
        {`Host:  pic._domainkey.mg.yourdomain.com
Type:  TXT
Value: k=rsa; p=MIGfMA0GCSq... (long string from Mailgun)`}
      </pre>

      <h3>DMARC (TXT record on the apex domain)</h3>
      <pre className="not-prose bg-secondary p-4 rounded-md text-sm overflow-x-auto">
        {`Host:  _dmarc.yourdomain.com
Type:  TXT
Value: v=DMARC1; p=quarantine; rua=mailto:dmarc@yourdomain.com; pct=100`}
      </pre>

      <h3>MX (so bounces get reported back to Mailgun)</h3>
      <pre className="not-prose bg-secondary p-4 rounded-md text-sm overflow-x-auto">
        {`Host:  mg.yourdomain.com
Type:  MX
Value: 10 mxa.mailgun.org
        10 mxb.mailgun.org`}
      </pre>

      <h2>4. Verify in Mailgun</h2>
      <p>
        Go back to the Mailgun dashboard. After DNS propagates (usually
        5&ndash;30 minutes, occasionally up to 24 hours), Mailgun will show all
        four records as verified. Click <em>Send a test email</em> to confirm.
      </p>

      <h2>5. Inbound email (optional)</h2>
      <p>
        If you want <em>support@yourdomain.com</em> to forward to your personal
        inbox, add a Mailgun route that points to{" "}
        <code>MAILGUN_FORWARD_TO</code> and set the webhook URL on your Mailgun
        domain to:
      </p>
      <pre className="not-prose bg-secondary p-4 rounded-md text-sm overflow-x-auto">
        {`https://yourdomain.com/api/mailgun/webhook`}
      </pre>

      <h2>Testing locally</h2>
      <p>
        Use the Mailgun sandbox domain for development so you don&apos;t burn
        your production sending quota. The sandbox only delivers to verified
        recipients, which is perfect for local testing.
      </p>

      <h2>Templates</h2>
      <p>
        Ten transactional templates ship with the template. They live in{" "}
        <code>src/lib/email-templates.ts</code> and pull their brand styling
        (logo, colors, support address) from <code>src/config/email.ts</code> so
        you can rebrand every outgoing email by editing env vars — no code
        changes required.
      </p>
      <ul>
        <li>
          <strong>Welcome</strong> — sent by{" "}
          <code>src/app/api/auth/webhook/route.ts</code> on user signup.
        </li>
        <li>
          <strong>Email verification</strong> — fired manually via{" "}
          <code>sendEmailVerification()</code> or wired into your own
          verification flow. The default Supabase email path handles this
          automatically.
        </li>
        <li>
          <strong>Password reset</strong> — the user-facing form lives at{" "}
          <code>/auth/forgot-password</code> and{" "}
          <code>/auth/reset-password</code>. Supabase delivers the actual reset
          email using its own built-in template (configure the redirect URL to
          your reset page in the Supabase dashboard). The{" "}
          <code>EmailTemplates.passwordReset()</code> helper is the design
          reference for when you swap in custom Mailgun delivery.
        </li>
        <li>
          <strong>Subscription receipt</strong> — sent automatically by{" "}
          <code>src/lib/webhooks/stripe-handler.ts</code> on{" "}
          <code>invoice.payment_succeeded</code> and by the LemonSqueezy handler
          on <code>subscription_payment_success</code>.
        </li>
        <li>
          <strong>Payment failed</strong> — sent automatically on{" "}
          <code>invoice.payment_failed</code> (Stripe) and{" "}
          <code>subscription_payment_failed</code> (LemonSqueezy) with a link
          back to <code>/dashboard/billing</code> to update the payment method.
        </li>
        <li>
          <strong>Subscription renewal upcoming</strong> — sent on Stripe{" "}
          <code>invoice.upcoming</code> (Stripe sends this ~3 days before the
          charge). Gives the user a heads-up so they aren&apos;t surprised.
        </li>
        <li>
          <strong>Trial ending</strong> — sent on Stripe{" "}
          <code>customer.subscription.trial_will_end</code> (~3 days before the
          trial ends). Tells the user what happens next.
        </li>
        <li>
          <strong>Refund issued</strong> — sent on Stripe{" "}
          <code>charge.refunded</code> and LemonSqueezy{" "}
          <code>order_refunded</code>. Confirms the refund and gives a realistic
          timeline.
        </li>
        <li>
          <strong>Subscription cancelled</strong> — sent on Stripe{" "}
          <code>customer.subscription.deleted</code> and LemonSqueezy{" "}
          <code>subscription_cancelled</code>. Confirms the cancellation, end
          date, and how to reactivate.
        </li>
        <li>
          <strong>Generic notification</strong> —{" "}
          <code>sendNotificationEmail()</code> is your hook for any one-off
          email: comment notifications, weekly digests, product updates.
          Includes a one-click unsubscribe header (RFC 8058) by default.
        </li>
      </ul>
      <p>
        Set <code>SKIP_EMAILS=true</code> in <code>.env.local</code> to
        short-circuit Mailgun and log outgoing messages to the console during
        local development.
      </p>

      <h2>Dev preview & test send</h2>
      <p>
        Run the dev server and visit <code>/dev/emails</code> to see every
        template rendered with sample data in your browser. The route is
        404&apos;d in production.
      </p>
      <p>
        To send a real email to yourself and confirm end-to-end deliverability:
      </p>
      <pre className="not-prose bg-secondary p-4 rounded-md text-sm overflow-x-auto">
        {`# Welcome email
npm run email:test -- welcome you@you.com

# Payment-failed email
npm run email:test -- paymentFailed you@you.com

# Dry-run (logs only, no Mailgun call)
SKIP_EMAILS=true npm run email:test -- welcome`}
      </pre>

      <h2>Email log</h2>
      <p>
        Every send writes a row to <code>email_log</code> (table created by{" "}
        <code>supabase/migrations/005_email_log.sql</code>) with the recipient,
        template, Mailgun message id, and tags. Use it to:
      </p>
      <ul>
        <li>Audit what was sent to a user (ops + GDPR/CCPA data export)</li>
        <li>
          Track delivery status — the Mailgun webhook updates each row as events
          arrive (<code>delivered</code>, <code>bounced</code>,{" "}
          <code>complained</code>, <code>unsubscribed</code>,{" "}
          <code>failed</code>).
        </li>
        <li>Replay a failed email by re-fetching the log row + template.</li>
      </ul>

      <h2>Unsubscribes</h2>
      <p>
        <code>sendNotificationEmail()</code> automatically adds the{" "}
        <code>List-Unsubscribe</code> + <code>List-Unsubscribe-Post</code>{" "}
        headers (RFC 8058). The link points to{" "}
        <code>POST /api/unsubscribe</code> (one-click, no UI) and{" "}
        <code>GET /api/unsubscribe</code> (fallback, shows a confirmation page).
      </p>
      <p>
        Per Gmail/Outlook bulk sender guidelines,{" "}
        <strong>
          transactional emails are never tagged as unsubscribe-able
        </strong>
        : receipts, payment-failed notices, password resets, and refunds always
        go out regardless. The unsubscribe only suppresses marketing and
        notification sends.
      </p>

      <h2>Swapping the provider</h2>
      <p>
        All sends go through <code>sendEmail()</code> in{" "}
        <code>src/lib/mailgun.ts</code>. To swap to Resend, Postmark, or AWS
        SES:
      </p>
      <ol>
        <li>
          Install the SDK (<code>npm i resend</code>, etc.)
        </li>
        <li>
          Replace the <code>getMailgunClient()</code> +{" "}
          <code>client.messages.create()</code> call inside{" "}
          <code>sendEmail()</code> with the new provider&apos;s API.
        </li>
        <li>
          Update the inbound webhook in{" "}
          <code>src/app/api/mailgun/webhook/route.ts</code> to handle the new
          provider&apos;s delivery event format (Resend uses{" "}
          <code>email.delivered</code>, <code>email.bounced</code>, etc).
        </li>
        <li>
          The <code>email_log</code> table, templates, brand config, and all
          callers stay unchanged.
        </li>
      </ol>
    </article>
  );
}
