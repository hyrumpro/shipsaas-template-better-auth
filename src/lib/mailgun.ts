/**
 * Mailgun Email Service
 * Handles all transactional email sending with proper error handling
 */

import { config } from "@/config";
import formData from "form-data";
import Mailgun from "mailgun.js";
import { logger } from "./logger";
import EmailTemplates from "./email-templates";

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
}

/**
 * Sends an email using Mailgun
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
}: SendEmailOptions): Promise<boolean> => {
  try {
    // Skip in test environment or development without Mailgun
    if (process.env.NODE_ENV === "test" || process.env.SKIP_EMAILS === "true") {
      logger.info("Email skipped (test environment or SKIP_EMAILS=true)", { to, subject });
      return true;
    }

    // Validate required configuration
    if (!process.env.MAILGUN_API_KEY || !process.env.MAILGUN_DOMAIN) {
      logger.warn("Mailgun not configured - email skipped in development", { to, subject });
      console.log(`📧 [DEV] Email would be sent to: ${to}`);
      console.log(`📧 [DEV] Subject: ${subject}`);
      return true; // Return true in development so build doesn't fail
    }

    const domain = process.env.MAILGUN_DOMAIN;
    const client = getMailgunClient();

    if (!client) {
      logger.warn("Mailgun client not initialized", { to, subject });
      return true; // Return true in development
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

    // Add reply-to if provided
    if (replyTo) {
      data["h:Reply-To"] = replyTo;
    }

    // Add tags for analytics
    if (tags.length > 0) {
      data["o:tag"] = tags;
    }

    logger.info("Sending email", { to, subject, tags });

    await client.messages.create(domain, data);

    logger.info("Email sent successfully", { to, subject });
    return true;
  } catch (error) {
    logger.error("Failed to send email", error, { to, subject });
    return false;
  }
};

/**
 * Send welcome email to new users
 */
export const sendWelcomeEmail = async (
  email: string,
  name: string
): Promise<boolean> => {
  const template = EmailTemplates.welcome(name);

  return sendEmail({
    to: email,
    subject: template.subject,
    html: template.html,
    text: template.text,
    tags: ["welcome", "onboarding"],
  });
};

/**
 * Send email verification
 */
export const sendEmailVerification = async (
  email: string,
  name: string,
  verificationLink: string
): Promise<boolean> => {
  const template = EmailTemplates.emailVerification(name, verificationLink);

  return sendEmail({
    to: email,
    subject: template.subject,
    html: template.html,
    text: template.text,
    tags: ["verification", "auth"],
  });
};

/**
 * Send password reset email
 */
export const sendPasswordResetEmail = async (
  email: string,
  name: string,
  resetLink: string
): Promise<boolean> => {
  const template = EmailTemplates.passwordReset(name, resetLink);

  return sendEmail({
    to: email,
    subject: template.subject,
    html: template.html,
    text: template.text,
    tags: ["password-reset", "auth"],
  });
};

/**
 * Send payment success email
 */
export const sendPaymentSuccessEmail = async (
  email: string,
  name: string,
  amount: string,
  plan: string,
  invoiceUrl?: string
): Promise<boolean> => {
  const template = EmailTemplates.paymentSuccess(name, amount, plan, invoiceUrl);

  return sendEmail({
    to: email,
    subject: template.subject,
    html: template.html,
    text: template.text,
    tags: ["payment", "success"],
  });
};

/**
 * Send subscription cancelled email
 */
export const sendSubscriptionCancelledEmail = async (
  email: string,
  name: string,
  endDate: string
): Promise<boolean> => {
  const template = EmailTemplates.subscriptionCancelled(name, endDate);

  return sendEmail({
    to: email,
    subject: template.subject,
    html: template.html,
    text: template.text,
    tags: ["subscription", "cancelled"],
  });
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
  actionText?: string
): Promise<boolean> => {
  const template = EmailTemplates.notification(
    name,
    title,
    message,
    actionUrl,
    actionText
  );

  return sendEmail({
    to: email,
    subject: template.subject,
    html: template.html,
    text: template.text,
    tags: ["notification"],
  });
};
