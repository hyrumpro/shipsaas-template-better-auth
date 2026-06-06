import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Payments (Stripe / Lemon Squeezy)",
    description:
      "Wire up Stripe or Lemon Squeezy in ShipSaaS and configure webhooks for subscriptions, one-time payments, and refunds.",
};

export default function PaymentsDocsPage() {
  return (
    <article>
      <h1>Payments (Stripe / Lemon Squeezy)</h1>
      <p>
        ShipSaaS ships with a unified checkout abstraction that delegates
        to either Stripe or Lemon Squeezy based on a single env var. Pick
        the provider that fits your business:
      </p>
      <ul>
        <li>
          <strong>Stripe</strong> &mdash; best if you need full control,
          want to scale globally, or already have a Stripe account. You
          handle VAT and sales tax.
        </li>
        <li>
          <strong>Lemon Squeezy</strong> &mdash; merchant of record. They
          handle VAT, sales tax, and global invoicing for you. Best for
          solo founders who want to skip the tax paperwork.
        </li>
      </ul>

      <h2>1. Switch provider</h2>
      <p>
        In <code>.env.local</code>, set:
      </p>
      <pre className="not-prose bg-secondary p-4 rounded-md text-sm overflow-x-auto">
{`NEXT_PUBLIC_PAYMENT_PROVIDER=stripe   # or lemonsqueezy`}
      </pre>

      <h2>2a. Stripe</h2>
      <ol>
        <li>
          Create a Stripe account and grab the <em>Publishable</em> and{" "}
          <em>Secret</em> keys from the{" "}
          <a href="https://dashboard.stripe.com/apikeys">API keys</a> page.
        </li>
        <li>
          Create a recurring product + price for your plan. Copy the{" "}
          <code>price_xxx</code> id.
        </li>
        <li>
          In <code>src/config/payments.ts</code>, paste the price id into
          the matching plan entry.
        </li>
        <li>
          Add a webhook endpoint in the{" "}
          <a href="https://dashboard.stripe.com/webhooks">webhooks</a>{" "}
          page pointing to:
          <pre className="not-prose bg-secondary p-3 rounded-md text-sm overflow-x-auto mt-2">
{`https://yourdomain.com/api/stripe/webhook`}
          </pre>
          Subscribe to: <code>checkout.session.completed</code>,{" "}
          <code>customer.subscription.created</code>,{" "}
          <code>customer.subscription.updated</code>,{" "}
          <code>customer.subscription.deleted</code>,{" "}
          <code>invoice.payment_succeeded</code>,{" "}
          <code>invoice.payment_failed</code>,{" "}
          <code>charge.refunded</code>.
        </li>
        <li>
          Copy the signing secret (<code>whsec_xxx</code>) into{" "}
          <code>STRIPE_WEBHOOK_SECRET</code>.
        </li>
      </ol>

      <h2>2b. Lemon Squeezy</h2>
      <ol>
        <li>
          Create a Lemon Squeezy store and a subscription variant. Copy
          the <em>Variant ID</em> (a number).
        </li>
        <li>
          In <code>src/config/payments.ts</code>, paste the variant id
          into the matching plan.
        </li>
        <li>
          Add a webhook in <em>Settings &rarr; Webhooks</em> with the
          URL:
          <pre className="not-prose bg-secondary p-3 rounded-md text-sm overflow-x-auto mt-2">
{`https://yourdomain.com/api/lemonsqueezy/webhook`}
          </pre>
          Subscribe to every subscription + order event.
        </li>
        <li>
          Copy the signing secret into{" "}
          <code>LEMONSQUEEZY_WEBHOOK_SECRET</code>.
        </li>
      </ol>

      <h2>3. Test the integration</h2>
      <p>
        For Stripe, use the{" "}
        <a href="https://dashboard.stripe.com/test/apikeys">test mode keys</a>{" "}
        and the Stripe CLI to forward webhooks locally:
      </p>
      <pre className="not-prose bg-secondary p-4 rounded-md text-sm overflow-x-auto">
{`stripe listen --forward-to localhost:3000/api/stripe/webhook
stripe trigger checkout.session.completed`}
      </pre>
      <p>
        For Lemon Squeezy, use a real test card on the sandbox store.
      </p>

      <h2>Chargebacks: the basics</h2>
      <p>
        If you sell digital goods, you will see chargebacks. Most are
        friendly fraud (customer forgot they subscribed, a child used the
        card, etc). Three things that help:
      </p>
      <ol>
        <li>
          <strong>Always send a receipt immediately.</strong> Include the
          invoice URL on every receipt email so the customer can
          self-serve instead of disputing. The template does this in{" "}
          <code>src/lib/email-templates.ts</code>.
        </li>
        <li>
          <strong>Make the cancellation button obvious.</strong>{" "}
          Customers who cannot find cancel often initiate a chargeback
          instead. The template ships with a customer portal link on the
          dashboard.
        </li>
        <li>
          <strong>Reply to the dispute within 7 days.</strong> Upload
          proof of subscription, the IP address used at signup, and the
          most-recent successful login. Banks almost always side with
          the merchant when you can produce a fresh login.
        </li>
      </ol>
    </article>
  );
}
