/**
 * Mailgun Email Service
 * Handles all transactional email sending with proper error handling,
 * delivery logging, and tag-based segmentation.
 *
 * Every send goes through sendEmail() which:
 *   1. Respects SKIP_EMAILS=true (test mode) and NODE_ENV=test
 *   2. Captures the Mailgun provider message id (for delivery event tracking)
 *   3. Writes a row to email_log (table src/db/schema.ts)
 *   4. Logs to the PII-redacting logger
 *
 * The inbound webhook at /api/mailgun/webhook updates email_log.status
 * when Mailgun reports delivered/bounced/complained/unsubscribed/failed.
 */

import { config } from "@/config";
import formData from "form-data";
import Mailgun from "mailgun.js";
import { logger } from "./logger";
import EmailTemplates from "./email-templates";
import { logEmailSent } from "@/db/queries";

// Lazy initialize Mailgun client only when needed
let mg: any = null;

const getMailgunClient = () => {
  if (!mg && process.env.MAILGUN_API_KEY) {
    const mailgun = new Mailgun(formData);
    mg = mailgun.client({
      username: "api",
      key: process.env.MAILGUN_API_KEY,
    });
  }
  return mg;
};

interface SendEmailOptions {
  to: string;
  subject: string;
  text?: string;
  html: string;
  replyTo?: string;
  from?: string;
  tags?: string[];
  tracking?: boolean;
  template?: string;
  userId?: string;
  metadata?: Record<string, any>;
}

/**
 * Sends an email using Mailgun. Returns the Mailgun provider message id
 * (string) on success, or null on skipped/failed sends.
 */
export const sendEmail = async ({
  to,
  subject,
  text,
  html,
  replyTo,
  from,
  tags = [],
  tracking = true,
  template,
  userId,
  metadata,
}: SendEmailOptions): Promise<string | null> => {
  const templateName = template ?? "raw";

  // Skip in test environment or development without Mailgun
  if (process.env.NODE_ENV === "test" || process.env.SKIP_EMAILS === "true") {
    logger.info("Email skipped (test environment or SKIP_EMAILS=true)", {
      to,
      subject,
      template: templateName,
    });
    console.log(`[EMAIL SKIPPED] to=${to} subject=${subject} template=${templateName}`);
    return null;
  }

  // Validate required configuration
  if (!process.env.MAILGUN_API_KEY || !process.env.MAILGUN_DOMAIN) {
    logger.warn("Mailgun not configured - email skipped in development", {
      to,
      subject,
      template: templateName,
    });
    console.log(`[EMAIL SKIPPED - no Mailgun config] to=${to} subject=${subject}`);
    return null;
  }

  const domain = process.env.MAILGUN_DOMAIN;
  const client = getMailgunClient();

  if (!client) {
    logger.warn("Mailgun client not initialized", { to, subject });
    return null;
  }

  const data: any = {
    from: from || config.mailgun.fromAdmin,
    to: [to],
    subject,
    text: text || "",
    html,
    "o:tracking": tracking,
    "o:tracking-clicks": tracking,
    "o:tracking-opens": tracking,
  };

  if (replyTo) {
    data["h:Reply-To"] = replyTo;
  }

  if (tags.length > 0) {
    data["o:tag"] = tags;
  }

  // List-Unsubscribe header (RFC 8058) — only on non-transactional flows.
  // Transactional emails (receipts, password resets, payment-failed) MUST NOT
  // carry an unsubscribe link per Gmail/Outlook bulk sender guidelines.
  if (tags.includes("marketing") || tags.includes("notification")) {
    const siteUrl =
      process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ||
      "http://localhost:3000";
    data["h:List-Unsubscribe"] = `<${siteUrl}/api/unsubscribe?email=${encodeURIComponent(to)}>`;
    data["h:List-Unsubscribe-Post"] = "List-Unsubscribe=One-Click";
  }

  logger.info("Sending email", { to, subject, template: templateName, tags });

  try {
    const result = await client.messages.create(domain, data);
    const providerMessageId = result?.id ?? null;

    logger.info("Email sent successfully", {
      to,
      subject,
      template: templateName,
      providerMessageId,
    });

    // Persist to email_log (fire-and-forget — log write failure must not
    // break the calling webhook).
    void logEmailSent({
      toEmail: to,
      toUserId: userId ?? null,
      subject,
      template: templateName,
      providerMessageId,
      tags,
      metadata: metadata ?? null,
    }).catch((err) => {
      logger.warn("Failed to write email_log row", { err, to, subject });
    });

    return providerMessageId;
  } catch (error) {
    logger.error("Failed to send email", error, { to, subject });
    return null;
  }
};

/**
 * Send welcome email to new users
 */
export const sendWelcomeEmail = async (
  email: string,
  name: string,
  loginUrl?: string,
  userId?: string
): Promise<boolean> => {
  const siteUrl =
    process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ||
    "http://localhost:3000";
  const template = EmailTemplates.welcome(name, loginUrl ?? `${siteUrl}/auth/login`);

  const providerMessageId = await sendEmail({
    to: email,
    subject: template.subject,
    html: template.html,
    text: template.text,
    tags: ["welcome", "onboarding"],
    template: "welcome",
    userId,
  });
  return providerMessageId !== null;
};

/**
 * Send email verification
 */
export const sendEmailVerification = async (
  email: string,
  name: string,
  verificationLink: string,
  userId?: string
): Promise<boolean> => {
  const template = EmailTemplates.emailVerification(name, verificationLink);

  const providerMessageId = await sendEmail({
    to: email,
    subject: template.subject,
    html: template.html,
    text: template.text,
    tags: ["verification", "auth"],
    template: "emailVerification",
    userId,
  });
  return providerMessageId !== null;
};

/**
 * Send password reset email
 */
export const sendPasswordResetEmail = async (
  email: string,
  name: string,
  resetLink: string,
  userId?: string
): Promise<boolean> => {
  const template = EmailTemplates.passwordReset(name, resetLink);

  const providerMessageId = await sendEmail({
    to: email,
    subject: template.subject,
    html: template.html,
    text: template.text,
    tags: ["password-reset", "auth"],
    template: "passwordReset",
    userId,
  });
  return providerMessageId !== null;
};

/**
 * Send payment success email (subscription receipt)
 */
export const sendPaymentSuccessEmail = async (
  email: string,
  name: string,
  amount: string,
  plan: string,
  invoiceUrl?: string,
  userId?: string
): Promise<boolean> => {
  const template = EmailTemplates.paymentSuccess(name, amount, plan, invoiceUrl);

  const providerMessageId = await sendEmail({
    to: email,
    subject: template.subject,
    html: template.html,
    text: template.text,
    tags: ["payment", "success"],
    template: "paymentSuccess",
    userId,
    metadata: { plan, amount, invoiceUrl },
  });
  return providerMessageId !== null;
};

/**
 * Send payment failed email
 */
export const sendPaymentFailedEmail = async (
  email: string,
  name: string,
  plan: string,
  amount: string,
  reason?: string,
  retryUrl?: string,
  userId?: string
): Promise<boolean> => {
  const template = EmailTemplates.paymentFailed(name, plan, amount, reason, retryUrl);

  const providerMessageId = await sendEmail({
    to: email,
    subject: template.subject,
    html: template.html,
    text: template.text,
    tags: ["payment", "failed"],
    template: "paymentFailed",
    userId,
    metadata: { plan, amount, reason },
  });
  return providerMessageId !== null;
};

/**
 * Send subscription cancelled email
 */
export const sendSubscriptionCancelledEmail = async (
  email: string,
  name: string,
  endDate: string,
  userId?: string
): Promise<boolean> => {
  const template = EmailTemplates.subscriptionCancelled(name, endDate);

  const providerMessageId = await sendEmail({
    to: email,
    subject: template.subject,
    html: template.html,
    text: template.text,
    tags: ["subscription", "cancelled"],
    template: "subscriptionCancelled",
    userId,
  });
  return providerMessageId !== null;
};

/**
 * Send a "your subscription renews in 3 days" reminder
 */
export const sendSubscriptionRenewalUpcomingEmail = async (
  email: string,
  name: string,
  plan: string,
  amount: string,
  renewalDate: string,
  manageBillingUrl: string,
  userId?: string
): Promise<boolean> => {
  const template = EmailTemplates.subscriptionRenewalUpcoming(
    name,
    plan,
    amount,
    renewalDate,
    manageBillingUrl,
  );

  const providerMessageId = await sendEmail({
    to: email,
    subject: template.subject,
    html: template.html,
    text: template.text,
    tags: ["subscription", "renewal", "notification"],
    template: "subscriptionRenewalUpcoming",
    userId,
    metadata: { plan, amount, renewalDate },
  });
  return providerMessageId !== null;
};

/**
 * Send a "your free trial ends in 3 days" reminder
 */
export const sendTrialEndingEmail = async (
  email: string,
  name: string,
  plan: string,
  trialEndDate: string,
  amount: string,
  billingUrl: string,
  userId?: string
): Promise<boolean> => {
  const template = EmailTemplates.trialEnding(
    name,
    plan,
    trialEndDate,
    amount,
    billingUrl,
  );

  const providerMessageId = await sendEmail({
    to: email,
    subject: template.subject,
    html: template.html,
    text: template.text,
    tags: ["subscription", "trial", "notification"],
    template: "trialEnding",
    userId,
    metadata: { plan, trialEndDate, amount },
  });
  return providerMessageId !== null;
};

/**
 * Send a "we refunded $X to your card" confirmation
 */
export const sendRefundIssuedEmail = async (
  email: string,
  name: string,
  amount: string,
  plan: string,
  refundId?: string,
  userId?: string
): Promise<boolean> => {
  const template = EmailTemplates.refundIssued(name, amount, plan, refundId);

  const providerMessageId = await sendEmail({
    to: email,
    subject: template.subject,
    html: template.html,
    text: template.text,
    tags: ["payment", "refund"],
    template: "refundIssued",
    userId,
    metadata: { plan, amount, refundId },
  });
  return providerMessageId !== null;
};

/**
 * Send generic notification email
 */
export const sendNotificationEmail = async (
  email: string,
  name: string,
  title: string,
  message: string,
  actionUrl?: string,
  actionText?: string,
  userId?: string
): Promise<boolean> => {
  const template = EmailTemplates.notification(
    name,
    title,
    message,
    actionUrl,
    actionText,
  );

  const providerMessageId = await sendEmail({
    to: email,
    subject: template.subject,
    html: template.html,
    text: template.text,
    tags: ["notification", "marketing"],
    template: "notification",
    userId,
  });
  return providerMessageId !== null;
};
