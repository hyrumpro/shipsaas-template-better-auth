/**
 * Test email script
 *
 * Sends a real test email through your configured Mailgun account so you
 * can confirm deliverability, branding, and link behavior end-to-end.
 *
 * Usage:
 *   npx tsx scripts/test-email.ts                                  # sends welcome
 *   npx tsx scripts/test-email.ts welcome                          # explicit template
 *   npx tsx scripts/test-email.ts paymentSuccess you@you.com       # override recipient
 *   SKIP_EMAILS=true npx tsx scripts/test-email.ts                 # log only
 *
 * Requires: MAILGUN_API_KEY, MAILGUN_DOMAIN, NEXT_PUBLIC_SITE_URL (optional)
 * Tip:    Set SKIP_EMAILS=true to verify the template + send code path
 *         without actually sending.
 */

import {
  sendWelcomeEmail,
  sendPaymentSuccessEmail,
  sendPaymentFailedEmail,
  sendSubscriptionCancelledEmail,
  sendSubscriptionRenewalUpcomingEmail,
  sendTrialEndingEmail,
  sendRefundIssuedEmail,
  sendEmailVerification,
  sendPasswordResetEmail,
  sendNotificationEmail,
} from "../src/lib/mailgun";
import { logger } from "../src/lib/logger";

const TEMPLATES = {
  welcome: (to: string) =>
    sendWelcomeEmail(to, "Test User", `${process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"}/auth/login`),
  emailVerification: (to: string) =>
    sendEmailVerification(to, "Test User", `${process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"}/auth/confirm?token=test`),
  passwordReset: (to: string) =>
    sendPasswordResetEmail(to, "Test User", `${process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"}/auth/reset-password?token=test`),
  paymentSuccess: (to: string) =>
    sendPaymentSuccessEmail(to, "Test User", "$29.00", "Pro Monthly", `${process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"}/dashboard/billing`),
  paymentFailed: (to: string) =>
    sendPaymentFailedEmail(
      to,
      "Test User",
      "Pro Monthly",
      "$29.00",
      "Your card was declined (insufficient_funds).",
      `${process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"}/dashboard/billing`,
    ),
  subscriptionRenewalUpcoming: (to: string) =>
    sendSubscriptionRenewalUpcomingEmail(
      to,
      "Test User",
      "Pro Monthly",
      "$29.00",
      new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      }),
      `${process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"}/dashboard/billing`,
    ),
  trialEnding: (to: string) =>
    sendTrialEndingEmail(
      to,
      "Test User",
      "Pro Monthly",
      new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      }),
      "$29.00",
      `${process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"}/dashboard/billing`,
    ),
  refundIssued: (to: string) =>
    sendRefundIssuedEmail(to, "Test User", "$29.00", "Pro Monthly", "re_test_123"),
  subscriptionCancelled: (to: string) =>
    sendSubscriptionCancelledEmail(
      to,
      "Test User",
      new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      }),
    ),
  notification: (to: string) =>
    sendNotificationEmail(
      to,
      "Test User",
      "Test notification",
      "This is a test notification to verify the email system end-to-end.",
      `${process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"}/dashboard`,
      "View dashboard",
    ),
} as const;

type TemplateName = keyof typeof TEMPLATES;

async function main() {
  const [, , templateArg, emailArg] = process.argv;

  const template = (templateArg as TemplateName) || "welcome";
  const email = emailArg || process.env.TEST_EMAIL || "test@example.com";

  if (!TEMPLATES[template]) {
    console.error(`Unknown template: ${template}`);
    console.error(`Available: ${Object.keys(TEMPLATES).join(", ")}`);
    process.exit(1);
  }

  console.log(`\nSending "${template}" to ${email}...`);
  if (process.env.SKIP_EMAILS === "true") {
    console.log("(SKIP_EMAILS=true — send will be a no-op)\n");
  }
  if (!process.env.MAILGUN_API_KEY) {
    console.warn("(MAILGUN_API_KEY not set — send will be a no-op)\n");
  }

  const ok = await TEMPLATES[template](email);

  if (ok) {
    console.log("Done. Check your inbox (and /dev/emails in the browser for the live preview).");
  } else {
    console.log("Send failed — check the logs above for the reason.");
    process.exit(1);
  }
}

main().catch((err) => {
  logger.error("test-email script failed", err);
  process.exit(1);
});
