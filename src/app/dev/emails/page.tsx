/**
 * Dev-only email template preview.
 *
 * Visit /dev/emails in your browser to see every transactional template
 * rendered with sample data. Gated by NODE_ENV !== "production" — the
 * route returns 404 in production.
 *
 * Useful for:
 *   - previewing template changes before deploying
 *   - rebrand QA (tweak EMAIL_PRIMARY_COLOR, refresh, eyeball it)
 *   - QA across screen sizes
 */

import { notFound } from "next/navigation";
import EmailTemplates from "@/lib/email-templates";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Dev — Email preview",
  robots: { index: false, follow: false },
};

const SAMPLE_NAME = "Alex Rivera";
const SAMPLE_PLAN = "Pro Monthly";
const SAMPLE_AMOUNT = "$29.00";
const SAMPLE_DATE = "January 15, 2027";
const SAMPLE_REASON = "Your card was declined (insufficient_funds).";

export default function DevEmailsPage() {
  if (process.env.NODE_ENV === "production") {
    notFound();
  }

  const siteUrl =
    process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ||
    "http://localhost:3000";

  const templates: Array<{ key: string; label: string; html: string; text: string }> = [
    {
      key: "welcome",
      label: "Welcome",
      html: EmailTemplates.welcome(SAMPLE_NAME, `${siteUrl}/auth/login`).html,
      text: EmailTemplates.welcome(SAMPLE_NAME, `${siteUrl}/auth/login`).text,
    },
    {
      key: "emailVerification",
      label: "Email verification",
      html: EmailTemplates.emailVerification(SAMPLE_NAME, `${siteUrl}/auth/confirm?token=abc`).html,
      text: EmailTemplates.emailVerification(SAMPLE_NAME, `${siteUrl}/auth/confirm?token=abc`).text,
    },
    {
      key: "passwordReset",
      label: "Password reset",
      html: EmailTemplates.passwordReset(SAMPLE_NAME, `${siteUrl}/auth/reset-password?token=abc`).html,
      text: EmailTemplates.passwordReset(SAMPLE_NAME, `${siteUrl}/auth/reset-password?token=abc`).text,
    },
    {
      key: "paymentSuccess",
      label: "Payment success (receipt)",
      html: EmailTemplates.paymentSuccess(SAMPLE_NAME, SAMPLE_AMOUNT, SAMPLE_PLAN, `${siteUrl}/dashboard/billing`).html,
      text: EmailTemplates.paymentSuccess(SAMPLE_NAME, SAMPLE_AMOUNT, SAMPLE_PLAN, `${siteUrl}/dashboard/billing`).text,
    },
    {
      key: "paymentFailed",
      label: "Payment failed",
      html: EmailTemplates.paymentFailed(SAMPLE_NAME, SAMPLE_PLAN, SAMPLE_AMOUNT, SAMPLE_REASON, `${siteUrl}/dashboard/billing`).html,
      text: EmailTemplates.paymentFailed(SAMPLE_NAME, SAMPLE_PLAN, SAMPLE_AMOUNT, SAMPLE_REASON, `${siteUrl}/dashboard/billing`).text,
    },
    {
      key: "subscriptionRenewalUpcoming",
      label: "Subscription renewal upcoming",
      html: EmailTemplates.subscriptionRenewalUpcoming(SAMPLE_NAME, SAMPLE_PLAN, SAMPLE_AMOUNT, SAMPLE_DATE, `${siteUrl}/dashboard/billing`).html,
      text: EmailTemplates.subscriptionRenewalUpcoming(SAMPLE_NAME, SAMPLE_PLAN, SAMPLE_AMOUNT, SAMPLE_DATE, `${siteUrl}/dashboard/billing`).text,
    },
    {
      key: "trialEnding",
      label: "Trial ending",
      html: EmailTemplates.trialEnding(SAMPLE_NAME, SAMPLE_PLAN, SAMPLE_DATE, SAMPLE_AMOUNT, `${siteUrl}/dashboard/billing`).html,
      text: EmailTemplates.trialEnding(SAMPLE_NAME, SAMPLE_PLAN, SAMPLE_DATE, SAMPLE_AMOUNT, `${siteUrl}/dashboard/billing`).text,
    },
    {
      key: "refundIssued",
      label: "Refund issued",
      html: EmailTemplates.refundIssued(SAMPLE_NAME, SAMPLE_AMOUNT, SAMPLE_PLAN, "re_123abc").html,
      text: EmailTemplates.refundIssued(SAMPLE_NAME, SAMPLE_AMOUNT, SAMPLE_PLAN, "re_123abc").text,
    },
    {
      key: "subscriptionCancelled",
      label: "Subscription cancelled",
      html: EmailTemplates.subscriptionCancelled(SAMPLE_NAME, SAMPLE_DATE, `${siteUrl}/dashboard/billing`).html,
      text: EmailTemplates.subscriptionCancelled(SAMPLE_NAME, SAMPLE_DATE, `${siteUrl}/dashboard/billing`).text,
    },
    {
      key: "notification",
      label: "Generic notification",
      html: EmailTemplates.notification(
        SAMPLE_NAME,
        "New comment on your post",
        "Jamie left a comment on your launch update. Click below to view the thread and reply.",
        `${siteUrl}/dashboard/activity`,
        "View comment",
      ).html,
      text: EmailTemplates.notification(
        SAMPLE_NAME,
        "New comment on your post",
        "Jamie left a comment on your launch update. Click below to view the thread and reply.",
        `${siteUrl}/dashboard/activity`,
        "View comment",
      ).text,
    },
  ];

  return (
    <main className="min-h-screen bg-background text-foreground">
      <header className="section-sm">
        <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-amber-500/30 bg-amber-50 px-3 py-1 text-xs font-medium text-amber-900">
          <span className="h-1.5 w-1.5 rounded-full bg-amber-500" />
          Dev only — hidden in production
        </div>
        <h1 className="text-display-xl">Email templates</h1>
        <p className="mt-4 max-w-2xl text-muted-foreground">
          All transactional templates rendered with sample data. Tweak
          <code className="mx-1 rounded bg-muted px-1.5 py-0.5 text-sm">
            EMAIL_BRAND_NAME
          </code>
          ,
          <code className="mx-1 rounded bg-muted px-1.5 py-0.5 text-sm">
            EMAIL_PRIMARY_COLOR
          </code>
          , and other vars in <code>.env.local</code>, then refresh to rebrand
          in real time.
        </p>
        <div className="mt-6 flex flex-wrap gap-2 text-xs">
          {templates.map((t) => (
            <a
              key={t.key}
              href={`#${t.key}`}
              className="rounded-full border border-border bg-card px-3 py-1 text-muted-foreground hover:bg-secondary"
            >
              {t.label}
            </a>
          ))}
        </div>
      </header>

      <div className="space-y-16 pb-24">
        {templates.map((t) => (
          <section key={t.key} id={t.key} className="section">
            <div className="mb-6 flex items-center justify-between border-b border-border pb-3">
              <h2 className="text-display">{t.label}</h2>
              <code className="rounded bg-muted px-2 py-1 text-xs">
                {t.key}
              </code>
            </div>

            <div className="grid gap-8 lg:grid-cols-2">
              <div>
                <p className="mb-3 text-xs font-medium uppercase tracking-wide text-muted-foreground">
                  HTML preview
                </p>
                <div className="card-quiet overflow-hidden p-0">
                  <iframe
                    title={`${t.label} HTML`}
                    srcDoc={t.html}
                    className="h-[640px] w-full border-0 bg-background"
                  />
                </div>
              </div>

              <div>
                <p className="mb-3 text-xs font-medium uppercase tracking-wide text-muted-foreground">
                  Plain-text fallback
                </p>
                <pre className="card-quiet h-[640px] overflow-auto whitespace-pre-wrap text-sm leading-relaxed">
                  {t.text}
                </pre>
              </div>
            </div>
          </section>
        ))}
      </div>
    </main>
  );
}
