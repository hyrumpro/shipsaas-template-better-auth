/**
 * Email Templates — Hallmark modern-minimal design system
 *
 * Genre: modern-minimal (Stripe / Linear school)
 * Palette: paper white, hairline borders, slate-indigo accent, no glow,
 *          no gradient, no emoji marketing.
 *
 * Every template returns { subject, html, text } so it can be piped
 * straight into sendEmail() in src/lib/mailgun.ts.
 *
 * All copy and styling can be overridden per brand by editing the
 * constants in src/config/email.ts.
 */

import { emailConfig } from "@/config/email";

export interface EmailTemplate {
  subject: string;
  html: string;
  text: string;
}

const BRAND = {
  name: emailConfig.brandName,
  productName: emailConfig.productName,
  supportEmail: emailConfig.supportEmail,
  siteUrl: emailConfig.siteUrl,
  logoUrl: emailConfig.logoUrl,
  primary: emailConfig.primaryColor,
  text: emailConfig.textColor,
  muted: emailConfig.mutedColor,
  border: emailConfig.borderColor,
  surface: emailConfig.surfaceColor,
  background: emailConfig.backgroundColor,
};

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function escapeAttr(value: string): string {
  return escapeHtml(value);
}

function shell(title: string, preheader: string, body: string): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <meta name="x-apple-disable-message-reformatting" />
  <title>${escapeHtml(title)}</title>
  <style>
    body, table, td, a { -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%; }
    table, td { mso-table-lspace: 0pt; mso-table-rspace: 0pt; }
    img { -ms-interpolation-mode: bicubic; }
    body {
      margin: 0;
      padding: 0;
      background-color: ${BRAND.background};
      color: ${BRAND.text};
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
      font-size: 15px;
      line-height: 1.55;
    }
    .preheader { display: none; max-height: 0; overflow: hidden; mso-hide: all; font-size: 1px; line-height: 1px; color: ${BRAND.background}; }
    a { color: ${BRAND.text}; }
    .button {
      display: inline-block;
      padding: 12px 20px;
      background-color: ${BRAND.primary};
      color: ${BRAND.surface} !important;
      text-decoration: none;
      border-radius: 6px;
      font-weight: 600;
      font-size: 14px;
    }
    .button-outline {
      display: inline-block;
      padding: 11px 19px;
      background-color: transparent;
      color: ${BRAND.text} !important;
      text-decoration: none;
      border: 1px solid ${BRAND.border};
      border-radius: 6px;
      font-weight: 600;
      font-size: 14px;
    }
    @media only screen and (max-width: 620px) {
      .container { width: 100% !important; }
      .content { padding: 24px 20px !important; }
      .header { padding: 20px !important; }
    }
  </style>
</head>
<body>
  <span class="preheader">${escapeHtml(preheader)}</span>
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: ${BRAND.background};">
    <tr>
      <td align="center" style="padding: 32px 16px;">
        <table role="presentation" class="container" width="560" cellpadding="0" cellspacing="0" border="0" style="width: 560px; max-width: 100%; background-color: ${BRAND.surface}; border: 1px solid ${BRAND.border}; border-radius: 8px;">
          <tr>
            <td class="header" style="padding: 24px 32px; border-bottom: 1px solid ${BRAND.border};">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
                <tr>
                  <td align="left" style="font-weight: 600; font-size: 16px; letter-spacing: -0.01em; color: ${BRAND.text};">
                    <a href="${escapeAttr(BRAND.siteUrl)}" style="text-decoration: none; color: ${BRAND.text};">
                      ${BRAND.logoUrl
                        ? `<img src="${escapeAttr(BRAND.logoUrl)}" alt="${escapeAttr(BRAND.name)}" height="22" style="display: block; border: 0;" />`
                        : escapeHtml(BRAND.name)
                      }
                    </a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          <tr>
            <td class="content" style="padding: 32px;">
              ${body}
            </td>
          </tr>
          <tr>
            <td style="padding: 20px 32px; border-top: 1px solid ${BRAND.border}; color: ${BRAND.muted}; font-size: 12px; line-height: 1.5;">
              <p style="margin: 0 0 4px 0;">
                &copy; ${new Date().getFullYear()} ${escapeHtml(BRAND.name)}. All rights reserved.
              </p>
              <p style="margin: 0;">
                Need help? <a href="mailto:${escapeAttr(BRAND.supportEmail)}" style="color: ${BRAND.muted}; text-decoration: underline;">${escapeHtml(BRAND.supportEmail)}</a>
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

function heading(text: string): string {
  return `<h1 style="margin: 0 0 16px 0; font-size: 22px; line-height: 1.3; font-weight: 600; letter-spacing: -0.01em; color: ${BRAND.text};">${escapeHtml(text)}</h1>`;
}

function paragraph(text: string): string {
  return `<p style="margin: 0 0 16px 0; color: ${BRAND.text};">${text}</p>`;
}

function muted(text: string): string {
  return `<p style="margin: 0 0 16px 0; color: ${BRAND.muted}; font-size: 14px;">${text}</p>`;
}

function small(text: string): string {
  return `<p style="margin: 0 0 8px 0; color: ${BRAND.muted}; font-size: 13px; line-height: 1.5;">${text}</p>`;
}

function button(label: string, href: string, variant: "solid" | "outline" = "solid"): string {
  const cls = variant === "solid" ? "button" : "button-outline";
  return `<table role="presentation" cellpadding="0" cellspacing="0" border="0" style="margin: 24px 0;">
  <tr>
    <td>
      <a href="${escapeAttr(href)}" class="${cls}">${escapeHtml(label)}</a>
    </td>
  </tr>
</table>`;
}

function divider(): string {
  return `<hr style="border: 0; border-top: 1px solid ${BRAND.border}; margin: 24px 0;" />`;
}

function detailRow(label: string, value: string): string {
  return `<tr>
  <td style="padding: 6px 0; color: ${BRAND.muted}; font-size: 13px; width: 140px; vertical-align: top;">${escapeHtml(label)}</td>
  <td style="padding: 6px 0; color: ${BRAND.text}; font-size: 14px; vertical-align: top;">${value}</td>
</tr>`;
}

function detailTable(rows: Array<[string, string]>): string {
  return `<table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="margin: 16px 0; border-top: 1px solid ${BRAND.border}; border-bottom: 1px solid ${BRAND.border};">
  ${rows.map(([l, v]) => detailRow(l, v)).join("")}
</table>`;
}

function greeting(name: string): string {
  if (!name || name === "there") return "Hi,";
  return `Hi ${escapeHtml(name)},`;
}

export const EmailTemplates = {
  welcome(name: string, loginUrl: string): EmailTemplate {
    const body = [
      heading(`Welcome to ${BRAND.productName}`),
      paragraph(greeting(name)),
      paragraph(
        `Your account is ready. You can sign in any time to manage your subscription, billing, and account settings.`,
      ),
      button("Open your dashboard", loginUrl),
      muted(
        `If you have any questions, just reply to this email and we'll help.`,
      ),
    ].join("");

    return {
      subject: `Welcome to ${BRAND.productName}`,
      html: shell(`Welcome to ${BRAND.productName}`, "Your account is ready.", body),
      text: [
        `Welcome to ${BRAND.productName}`,
        ``,
        greeting(name),
        ``,
        `Your account is ready. You can sign in any time to manage your subscription, billing, and account settings.`,
        ``,
        `Open your dashboard: ${loginUrl}`,
        ``,
        `If you have any questions, just reply to this email and we'll help.`,
        ``,
        `— The ${BRAND.name} team`,
      ].join("\n"),
    };
  },

  passwordReset(name: string, resetUrl: string): EmailTemplate {
    const body = [
      heading("Reset your password"),
      paragraph(greeting(name)),
      paragraph(
        `We received a request to reset the password for your ${BRAND.productName} account. Click the button below to choose a new password.`,
      ),
      button("Reset password", resetUrl),
      small(
        `This link will expire in 1 hour. If you didn't request a password reset, you can safely ignore this email and your password will remain unchanged.`,
      ),
      divider(),
      muted(
        `For security, we never include your new password in email. If the button above doesn't work, paste this link into your browser:`,
      ),
      small(`<a href="${escapeAttr(resetUrl)}" style="color: ${BRAND.muted}; word-break: break-all;">${escapeHtml(resetUrl)}</a>`),
    ].join("");

    return {
      subject: `Reset your ${BRAND.productName} password`,
      html: shell("Reset your password", "Reset your password link inside.", body),
      text: [
        `Reset your password`,
        ``,
        greeting(name),
        ``,
        `We received a request to reset the password for your ${BRAND.productName} account.`,
        ``,
        `Reset your password: ${resetUrl}`,
        ``,
        `This link will expire in 1 hour.`,
        ``,
        `If you didn't request a password reset, you can safely ignore this email and your password will remain unchanged.`,
        ``,
        `— The ${BRAND.name} team`,
      ].join("\n"),
    };
  },

  paymentSuccess(
    name: string,
    amount: string,
    plan: string,
    invoiceUrl?: string,
  ): EmailTemplate {
    const rows: Array<[string, string]> = [
      ["Plan", `<strong>${escapeHtml(plan)}</strong>`],
      ["Amount", escapeHtml(amount)],
      ["Date", new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })],
    ];
    if (invoiceUrl) {
      rows.push(["Invoice", `<a href="${escapeAttr(invoiceUrl)}" style="color: ${BRAND.text}; text-decoration: underline;">View receipt</a>`]);
    }

    const body = [
      heading("Payment received"),
      paragraph(greeting(name)),
      paragraph(
        `Thank you. Your payment for the <strong>${escapeHtml(plan)}</strong> plan was successful and your account is fully active.`,
      ),
      detailTable(rows),
      invoiceUrl
        ? button("View receipt", invoiceUrl, "outline")
        : "",
      muted(
        `A copy of this receipt is on file in your dashboard.`,
      ),
    ].join("");

    return {
      subject: `Receipt from ${BRAND.name} — ${escapeHtml(amount)}`,
      html: shell("Payment received", `Your ${plan} payment was successful.`, body),
      text: [
        `Payment received`,
        ``,
        greeting(name),
        ``,
        `Thank you. Your payment for the ${plan} plan was successful and your account is fully active.`,
        ``,
        `Plan: ${plan}`,
        `Amount: ${amount}`,
        `Date: ${new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}`,
        invoiceUrl ? `Receipt: ${invoiceUrl}` : "",
        ``,
        `A copy of this receipt is on file in your dashboard.`,
        ``,
        `— The ${BRAND.name} team`,
      ].filter(Boolean).join("\n"),
    };
  },

  paymentFailed(
    name: string,
    plan: string,
    amount: string,
    reason?: string,
    retryUrl?: string,
  ): EmailTemplate {
    const rows: Array<[string, string]> = [
      ["Plan", `<strong>${escapeHtml(plan)}</strong>`],
      ["Amount due", escapeHtml(amount)],
      ["Status", `<strong style="color: #b91c1c;">Payment failed</strong>`],
    ];
    if (reason) {
      rows.push(["Reason", escapeHtml(reason)]);
    }

    const body = [
      heading("Your payment didn't go through"),
      paragraph(greeting(name)),
      paragraph(
        `We weren't able to charge your card for the <strong>${escapeHtml(plan)}</strong> plan. Your account is still active for now, but we'll retry the payment over the next few days.`,
      ),
      detailTable(rows),
      paragraph(
        `Most failures are caused by an expired card or a bank-side block. Updating your payment method usually clears it in under a minute.`,
      ),
      retryUrl ? button("Update payment method", retryUrl) : "",
      muted(
        `If you believe this is a mistake, reply to this email and we'll sort it out.`,
      ),
    ].join("");

    return {
      subject: `Action required: payment failed for ${BRAND.productName}`,
      html: shell("Payment failed", "We couldn't charge your card.", body),
      text: [
        `Your payment didn't go through`,
        ``,
        greeting(name),
        ``,
        `We weren't able to charge your card for the ${plan} plan. Your account is still active for now, but we'll retry the payment over the next few days.`,
        ``,
        `Plan: ${plan}`,
        `Amount due: ${amount}`,
        `Status: Payment failed`,
        reason ? `Reason: ${reason}` : "",
        ``,
        `Most failures are caused by an expired card or a bank-side block. Updating your payment method usually clears it in under a minute.`,
        retryUrl ? `Update payment method: ${retryUrl}` : "",
        ``,
        `If you believe this is a mistake, reply to this email and we'll sort it out.`,
        ``,
        `— The ${BRAND.name} team`,
      ].filter(Boolean).join("\n"),
    };
  },

  subscriptionCancelled(name: string, endDate: string, reactivateUrl?: string): EmailTemplate {
    const body = [
      heading("Subscription cancelled"),
      paragraph(greeting(name)),
      paragraph(
        `Your subscription has been cancelled. You'll keep access to <strong>${BRAND.productName}</strong> until <strong>${escapeHtml(endDate)}</strong>.`,
      ),
      muted(
        `After that date, your account will switch to the free tier. You can reactivate any time before then — your data will be waiting for you.`,
      ),
      reactivateUrl ? button("Reactivate subscription", reactivateUrl, "outline") : "",
      small(
        `We'd love to hear why you cancelled. Just reply to this email — every reply is read by a human.`,
      ),
    ].join("");

    return {
      subject: `Your ${BRAND.productName} subscription has been cancelled`,
      html: shell("Subscription cancelled", "You'll keep access until " + endDate + ".", body),
      text: [
        `Subscription cancelled`,
        ``,
        greeting(name),
        ``,
        `Your subscription has been cancelled. You'll keep access to ${BRAND.productName} until ${endDate}.`,
        ``,
        `After that date, your account will switch to the free tier.`,
        reactivateUrl ? `Reactivate: ${reactivateUrl}` : "",
        ``,
        `We'd love to hear why you cancelled. Just reply to this email — every reply is read by a human.`,
        ``,
        `— The ${BRAND.name} team`,
      ].filter(Boolean).join("\n"),
    };
  },

  emailVerification(name: string, verificationUrl: string): EmailTemplate {
    const body = [
      heading("Verify your email"),
      paragraph(greeting(name)),
      paragraph(
        `Click the button below to verify your email address and finish setting up your ${BRAND.productName} account.`,
      ),
      button("Verify email", verificationUrl),
      small(
        `This link will expire in 24 hours. If you didn't create an account, you can safely ignore this email.`,
      ),
    ].join("");

    return {
      subject: `Verify your email for ${BRAND.productName}`,
      html: shell("Verify your email", "Confirm your email to finish setup.", body),
      text: [
        `Verify your email`,
        ``,
        greeting(name),
        ``,
        `Click the link below to verify your email and finish setting up your ${BRAND.productName} account.`,
        ``,
        `Verify email: ${verificationUrl}`,
        ``,
        `This link will expire in 24 hours.`,
        ``,
        `— The ${BRAND.name} team`,
      ].join("\n"),
    };
  },

  magicLink(name: string, magicLinkUrl: string): EmailTemplate {
    const body = [
      heading("Sign in to your account"),
      paragraph(greeting(name)),
      paragraph(
        `Click the button below to sign in to your ${BRAND.productName} account. No password needed.`,
      ),
      button("Sign in", magicLinkUrl),
      small(
        `This link can only be used once and expires in 5 minutes. If you didn't request it, you can safely ignore this email.`,
      ),
    ].join("");

    return {
      subject: `Your ${BRAND.productName} sign-in link`,
      html: shell("Sign-in link", "One-time link to access your account.", body),
      text: [
        `Sign in to your account`,
        ``,
        greeting(name),
        ``,
        `Click the link below to sign in to your ${BRAND.productName} account. No password needed.`,
        ``,
        `Sign in: ${magicLinkUrl}`,
        ``,
        `This link can only be used once and expires in 5 minutes.`,
        ``,
        `— The ${BRAND.name} team`,
      ].join("\n"),
    };
  },

  notification(
    name: string,
    title: string,
    message: string,
    actionUrl?: string,
    actionText?: string,
  ): EmailTemplate {
    const body = [
      heading(title),
      paragraph(greeting(name)),
      paragraph(message),
      actionUrl && actionText ? button(actionText, actionUrl) : "",
    ].join("");

    return {
      subject: title,
      html: shell(title, message.slice(0, 90), body),
      text: [
        title,
        ``,
        greeting(name),
        ``,
        message,
        actionUrl && actionText ? `\n${actionText}: ${actionUrl}` : "",
        ``,
        `— The ${BRAND.name} team`,
      ].filter(Boolean).join("\n"),
    };
  },

  subscriptionRenewalUpcoming(
    name: string,
    plan: string,
    amount: string,
    renewalDate: string,
    manageBillingUrl: string,
  ): EmailTemplate {
    const rows: Array<[string, string]> = [
      ["Plan", `<strong>${escapeHtml(plan)}</strong>`],
      ["Amount", escapeHtml(amount)],
      ["Next charge", `<strong>${escapeHtml(renewalDate)}</strong>`],
    ];

    const body = [
      heading("Your subscription renews soon"),
      paragraph(greeting(name)),
      paragraph(
        `A quick heads-up: your <strong>${escapeHtml(plan)}</strong> subscription will renew on <strong>${escapeHtml(renewalDate)}</strong> for <strong>${escapeHtml(amount)}</strong>.`,
      ),
      detailTable(rows),
      paragraph(
        `No action is required — we'll charge your card on file automatically. If you want to update your payment method, switch plans, or cancel, you can do that any time from your billing page.`,
      ),
      button("Manage subscription", manageBillingUrl, "outline"),
    ].join("");

    return {
      subject: `Your ${BRAND.productName} subscription renews on ${escapeHtml(renewalDate)}`,
      html: shell("Subscription renewal upcoming", `Renews on ${renewalDate} for ${amount}.`, body),
      text: [
        `Your subscription renews soon`,
        ``,
        greeting(name),
        ``,
        `A quick heads-up: your ${plan} subscription will renew on ${renewalDate} for ${amount}.`,
        ``,
        `Plan: ${plan}`,
        `Amount: ${amount}`,
        `Next charge: ${renewalDate}`,
        ``,
        `No action is required — we'll charge your card on file automatically. If you want to update your payment method, switch plans, or cancel, you can do that any time from your billing page.`,
        ``,
        `Manage subscription: ${manageBillingUrl}`,
        ``,
        `— The ${BRAND.name} team`,
      ].join("\n"),
    };
  },

  trialEnding(
    name: string,
    plan: string,
    trialEndDate: string,
    amount: string,
    billingUrl: string,
  ): EmailTemplate {
    const body = [
      heading("Your trial is ending soon"),
      paragraph(greeting(name)),
      paragraph(
        `Your free trial of <strong>${escapeHtml(plan)}</strong> ends on <strong>${escapeHtml(trialEndDate)}</strong>. After that, you'll be charged <strong>${escapeHtml(amount)}</strong> to continue.`,
      ),
      paragraph(
        `If you'd like to keep using ${BRAND.productName}, no action is needed — we'll start your subscription automatically.`,
      ),
      button("Manage subscription", billingUrl, "outline"),
      small(
        `If you don't want to continue, you can cancel any time before ${escapeHtml(trialEndDate)} from your billing page and you won't be charged.`,
      ),
    ].join("");

    return {
      subject: `Your ${BRAND.productName} trial ends on ${escapeHtml(trialEndDate)}`,
      html: shell("Trial ending soon", `Your trial ends on ${trialEndDate}.`, body),
      text: [
        `Your trial is ending soon`,
        ``,
        greeting(name),
        ``,
        `Your free trial of ${plan} ends on ${trialEndDate}. After that, you'll be charged ${amount} to continue.`,
        ``,
        `If you'd like to keep using ${BRAND.productName}, no action is needed — we'll start your subscription automatically.`,
        ``,
        `If you don't want to continue, you can cancel any time before ${trialEndDate} from your billing page and you won't be charged.`,
        ``,
        `Manage subscription: ${billingUrl}`,
        ``,
        `— The ${BRAND.name} team`,
      ].join("\n"),
    };
  },

  refundIssued(
    name: string,
    amount: string,
    plan: string,
    refundId?: string,
  ): EmailTemplate {
    const rows: Array<[string, string]> = [
      ["Refund amount", `<strong>${escapeHtml(amount)}</strong>`],
      ["Original charge", escapeHtml(plan)],
      ["Refund method", `Original payment method`],
    ];
    if (refundId) {
      rows.push(["Reference", escapeHtml(refundId)]);
    }

    const body = [
      heading("Your refund has been issued"),
      paragraph(greeting(name)),
      paragraph(
        `We've issued a refund of <strong>${escapeHtml(amount)}</strong> to your original payment method.`,
      ),
      detailTable(rows),
      muted(
        `Refunds usually appear on your statement within 5–10 business days, depending on your bank. If you don't see it after that window, reply to this email and we'll look into it.`,
      ),
    ].join("");

    return {
      subject: `Refund issued — ${escapeHtml(amount)} from ${BRAND.name}`,
      html: shell("Refund issued", `We've refunded ${amount}.`, body),
      text: [
        `Your refund has been issued`,
        ``,
        greeting(name),
        ``,
        `We've issued a refund of ${amount} to your original payment method.`,
        ``,
        `Refund amount: ${amount}`,
        `Original charge: ${plan}`,
        `Refund method: Original payment method`,
        refundId ? `Reference: ${refundId}` : "",
        ``,
        `Refunds usually appear on your statement within 5–10 business days, depending on your bank. If you don't see it after that window, reply to this email and we'll look into it.`,
        ``,
        `— The ${BRAND.name} team`,
      ].filter(Boolean).join("\n"),
    };
  },
};

export default EmailTemplates;
