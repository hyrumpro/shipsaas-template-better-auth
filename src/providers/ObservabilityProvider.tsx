"use client";

import { usePathname, useSearchParams } from "next/navigation";
import { Suspense, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import {
  trackEventClient,
  identifyUserClient,
  resetClient,
  observabilityEnabled,
} from "@/lib/observability";

/**
 * Client-side observability provider.
 *
 * Lives at the root of the React tree. When `NEXT_PUBLIC_POSTHOG_KEY` is set
 * and `posthog-js` is installed, it captures pageviews on route change,
 * identifies signed-in users, and resets on sign-out.
 *
 * When the env var is missing or the package is not installed, this
 * component is effectively a no-op.
 *
 * `PageviewTracker` is split out so that its `useSearchParams()` call
 * sits inside a Suspense boundary — required by Next.js for pages that
 * prerender.
 */
export function ObservabilityProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const enabled = observabilityEnabled();
  const { data: user } = useAuth({ enabled });

  useEffect(() => {
    if (!enabled) return;
    if (user?.id) {
      identifyUserClient(user.id, {
        email: user.email,
        name: user.name || undefined,
      });
    } else {
      resetClient();
    }
  }, [enabled, user?.id, user?.email, user?.name]);

  return (
    <>
      <Suspense fallback={null}>
        <PageviewTracker enabled={enabled} />
      </Suspense>
      {children}
    </>
  );
}

function PageviewTracker({ enabled }: { enabled: boolean }) {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (!enabled || !pathname) return;
    const url = searchParams?.toString()
      ? `${pathname}?${searchParams.toString()}`
      : pathname;
    trackEventClient("$pageview", { $current_url: url });
  }, [enabled, pathname, searchParams]);

  return null;
}
