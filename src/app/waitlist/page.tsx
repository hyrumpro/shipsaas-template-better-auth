import { notFound } from "next/navigation";
import { waitlistConfig } from "@/config/waitlist";
import { WaitlistForm } from "@/components/waitlist/WaitlistForm";
import { getWaitlistCount } from "@/db/queries";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Join the waitlist",
  description: "Be the first to know when we launch.",
  robots: { index: false, follow: true },
};

export const dynamic = "force-dynamic";

export default async function WaitlistPage() {
  if (!waitlistConfig.enabled) {
    notFound();
  }

  let initialCount: number | null = null;
  try {
    initialCount = await getWaitlistCount();
  } catch {
    // If the table is missing or the DB is unreachable, hide the counter
    // rather than crash the page.
    initialCount = null;
  }

  return <WaitlistForm initialCount={initialCount} />;
}
