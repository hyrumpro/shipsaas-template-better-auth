/**
 * Observability shim — PostHog (analytics) + Sentry (errors).
 *
 * This file is a no-op unless the matching environment variables are set.
 * To enable either provider, install the package and set the env var:
 *
 *   # Analytics (client + server)
 *   npm install posthog-js posthog-node
 *   NEXT_PUBLIC_POSTHOG_KEY=phc_...
 *   NEXT_PUBLIC_POSTHOG_HOST=https://us.i.posthog.com
 *
 *   # Errors (client + server + edge)
 *   npm install @sentry/nextjs
 *   SENTRY_DSN=https://...@sentry.io/...
 *   NEXT_PUBLIC_SENTRY_DSN=https://...@sentry.io/...
 *
 * Why not as a hard dependency? Both packages pull in large dep trees
 * with their own audit surface. For a template we want a clean default
 * install and a one-line upgrade path.
 *
 * The dynamic imports are written via a Function constructor so that
 * TypeScript doesn't try to resolve the module at compile time (the
 * packages are intentionally not in package.json). At runtime, the
 * import either succeeds (package installed) or throws (caught as a
 * silent no-op).
 */

type Properties = Record<string, unknown>;

type PostHogClient = {
  init: (key: string, opts: Record<string, unknown>) => void;
  capture: (event: string, properties?: Properties) => void;
  identify: (distinctId: string, properties?: Properties) => void;
  reset: () => void;
};

type PostHogServer = {
  capture: (input: {
    distinctId: string;
    event: string;
    properties?: Properties;
  }) => void;
};

type SentryModule = {
  captureException: (
    error: unknown,
    context?: { tags?: Record<string, string>; extras?: Properties }
  ) => void;
};

let cached: {
  postHogClient?: PostHogClient;
  postHogServer?: PostHogServer;
} | null = null;

function config() {
  if (!cached) cached = {};
  return cached;
}

const POSTHOG_KEY = process.env.NEXT_PUBLIC_POSTHOG_KEY;
const POSTHOG_HOST =
  process.env.NEXT_PUBLIC_POSTHOG_HOST ?? "https://us.i.posthog.com";
const SENTRY_DSN = process.env.SENTRY_DSN ?? process.env.NEXT_PUBLIC_SENTRY_DSN;

function isEnabled() {
  return Boolean(POSTHOG_KEY) || Boolean(SENTRY_DSN);
}

// Runtime-only dynamic import. Bypasses TS module resolution so the
// packages can be opt-in without being listed in package.json.
const dynamicImport = (id: string): Promise<unknown> => {
  return new Function("m", "return import(m)")(id) as Promise<unknown>;
};

async function getPostHogClient(): Promise<PostHogClient | null> {
  if (!POSTHOG_KEY) return null;
  const cfg = config();
  if (cfg.postHogClient) return cfg.postHogClient;
  try {
    const mod = (await dynamicImport("posthog-js")) as {
      default: PostHogClient;
    };
    mod.default.init(POSTHOG_KEY, {
      api_host: POSTHOG_HOST,
      capture_pageview: false,
      capture_pageleave: true,
      person_profiles: "identified_only",
    });
    cfg.postHogClient = mod.default;
    return mod.default;
  } catch {
    return null;
  }
}

async function getPostHogServer(): Promise<PostHogServer | null> {
  if (!POSTHOG_KEY) return null;
  const cfg = config();
  if (cfg.postHogServer) return cfg.postHogServer;
  try {
    const mod = (await dynamicImport("posthog-node")) as {
      PostHog: new (key: string, opts: Record<string, unknown>) => PostHogServer;
    };
    cfg.postHogServer = new mod.PostHog(POSTHOG_KEY, {
      host: POSTHOG_HOST,
      flushAt: 1,
      flushInterval: 1000,
    });
    return cfg.postHogServer;
  } catch {
    return null;
  }
}

export async function trackEventServer(
  event: string,
  properties?: Properties,
  distinctId?: string
) {
  if (!isEnabled()) return;
  const client = await getPostHogServer();
  if (!client) return;
  try {
    client.capture({
      distinctId: distinctId ?? "anonymous",
      event,
      properties,
    });
  } catch {
    // Swallow — analytics must never break the request
  }
}

export function trackEventClient(event: string, properties?: Properties) {
  if (!isEnabled() || typeof window === "undefined") return;
  void getPostHogClient().then((client) => {
    if (!client) return;
    try {
      client.capture(event, properties);
    } catch {
      // Swallow
    }
  });
}

export function identifyUserClient(
  distinctId: string,
  properties?: Properties
) {
  if (!isEnabled() || typeof window === "undefined") return;
  void getPostHogClient().then((client) => {
    if (!client) return;
    try {
      client.identify(distinctId, properties);
    } catch {
      // Swallow
    }
  });
}

export function resetClient() {
  if (!isEnabled() || typeof window === "undefined") return;
  void getPostHogClient().then((client) => {
    if (!client) return;
    try {
      client.reset();
    } catch {
      // Swallow
    }
  });
}

export async function captureError(
  error: unknown,
  context?: { tags?: Record<string, string>; extras?: Properties }
) {
  if (!SENTRY_DSN) return;
  try {
    const Sentry = (await dynamicImport("@sentry/nextjs")) as SentryModule;
    Sentry.captureException(error, context);
  } catch {
    // Package not installed — silent no-op
  }
}

export function observabilityEnabled() {
  return isEnabled();
}
