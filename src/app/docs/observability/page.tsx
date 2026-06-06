import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Observability",
  description:
    "Opt-in PostHog analytics and Sentry error tracking. The shim is a no-op until you install the package and set the env var.",
};

export default function ObservabilityDocsPage() {
  return (
    <article>
      <h1>Observability (PostHog + Sentry)</h1>
      <p>
        ShipSaaS ships an <strong>opt-in shim</strong> for analytics and
        error tracking. By default nothing is sent anywhere — the shim
        is a no-op. You turn it on by installing the package you want
        and setting the matching environment variable.
      </p>
      <p>
        This keeps the default install clean (no large SDK trees, no
        extra audit surface) and gives you a one-line upgrade path.
      </p>

      <h2>What you get out of the box</h2>
      <ul>
        <li>
          <code>src/lib/observability.ts</code> — PostHog + Sentry
          facade with <code>trackEventServer</code>,{" "}
          <code>trackEventClient</code>,{" "}
          <code>identifyUserClient</code>, <code>resetClient</code>, and{" "}
          <code>captureError</code>.
        </li>
        <li>
          <code>src/providers/ObservabilityProvider.tsx</code> — a
          client provider that captures pageviews on route change and
          identifies signed-in users.
        </li>
        <li>
          <code>src/app/error.tsx</code> and{" "}
          <code>src/app/global-error.tsx</code> — error boundaries
          that automatically report to Sentry (if configured).
        </li>
        <li>
          <code>src/app/not-found.tsx</code> — branded 404 page.
        </li>
        <li>
          The API error helper{" "}
          <code>handleApiError()</code> in{" "}
          <code>src/lib/error-handler.ts</code> now reports 5xx errors
          to Sentry automatically.
        </li>
      </ul>

      <h2>Enabling PostHog (analytics)</h2>
      <ol>
        <li>
          Create a project at{" "}
          <a
            href="https://posthog.com"
            target="_blank"
            rel="noopener noreferrer"
          >
            posthog.com
          </a>{" "}
          and copy the project key.
        </li>
        <li>
          Install the SDKs:
          <pre className="not-prose bg-secondary p-4 rounded-md text-sm overflow-x-auto">
{`npm install posthog-js posthog-node`}
          </pre>
        </li>
        <li>
          Add the env vars to <code>.env.local</code>:
          <pre className="not-prose bg-secondary p-4 rounded-md text-sm overflow-x-auto">
{`NEXT_PUBLIC_POSTHOG_KEY=phc_...
NEXT_PUBLIC_POSTHOG_HOST=https://us.i.posthog.com`}
          </pre>
        </li>
        <li>
          Restart the dev server. That&apos;s it — pageviews will start
          flowing, and the <code>ObservabilityProvider</code> will
          identify users on sign-in and reset on sign-out.
        </li>
      </ol>

      <h3>Tracking custom events</h3>
      <pre className="not-prose bg-secondary p-4 rounded-md text-sm overflow-x-auto">
{`// server-side (e.g. webhook, API route)
import { trackEventServer } from "@/lib/observability";

await trackEventServer("user_signed_up", { plan: "pro" }, userId);

// client-side (e.g. onClick)
import { trackEventClient } from "@/lib/observability";

trackEventClient("pricing_cta_clicked", { plan: "pro" });`}
      </pre>
      <p>
        Both calls are no-ops if the package isn&apos;t installed or the
        key isn&apos;t set, so they&apos;re safe to leave in your code.
      </p>

      <h2>Enabling Sentry (errors)</h2>
      <ol>
        <li>
          Create a project at{" "}
          <a
            href="https://sentry.io"
            target="_blank"
            rel="noopener noreferrer"
          >
            sentry.io
          </a>{" "}
          and copy the DSN.
        </li>
        <li>
          Install the Next.js SDK:
          <pre className="not-prose bg-secondary p-4 rounded-md text-sm overflow-x-auto">
{`npm install @sentry/nextjs
npx @sentry/wizard@latest -i nextjs`}
          </pre>
          <p>
            The wizard wires up <code>sentry.client.config.ts</code>,{" "}
            <code>sentry.server.config.ts</code>,{" "}
            <code>sentry.edge.config.ts</code>, and the source-map
            upload in your build.
          </p>
        </li>
        <li>
          Add the DSNs to <code>.env.local</code>:
          <pre className="not-prose bg-secondary p-4 rounded-md text-sm overflow-x-auto">
{`SENTRY_DSN=https://...@sentry.io/...
NEXT_PUBLIC_SENTRY_DSN=https://...@sentry.io/...`}
          </pre>
        </li>
        <li>
          Restart the dev server. API 5xx errors and{" "}
          <code>app/error.tsx</code> / <code>global-error.tsx</code>{" "}
          exceptions will start landing in your Sentry project.
        </li>
      </ol>

      <h3>Capturing errors manually</h3>
      <pre className="not-prose bg-secondary p-4 rounded-md text-sm overflow-x-auto">
{`import { captureError } from "@/lib/observability";

try {
  await somethingRisky();
} catch (err) {
  await captureError(err, {
    tags: { feature: "billing" },
    extras: { userId, planId },
  });
  throw err;
}`}
      </pre>

      <h2>Privacy</h2>
      <ul>
        <li>
          PostHog is configured with{" "}
          <code>person_profiles: &quot;identified_only&quot;</code>, so
          anonymous visitors are not person-profiled.
        </li>
        <li>
          The server logger (<code>src/lib/logger.ts</code>) already
          redacts <code>email</code>, <code>password</code>,{" "}
          <code>token</code>, <code>apiKey</code>,{" "}
          <code>secret</code>, <code>authorization</code>, and{" "}
          <code>cookie</code> keys. These are also redacted before any
          analytics event is sent.
        </li>
        <li>
          The shim swallows its own errors. Observability will never
          break a request.
        </li>
      </ul>

      <h2>Disabling</h2>
      <p>
        Remove the env var (or set it to empty) and uninstall the
        package. The shim goes back to no-op, and no data is sent.
      </p>
    </article>
  );
}
