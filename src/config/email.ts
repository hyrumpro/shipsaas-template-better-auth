/**
 * Email brand config
 *
 * Every transactional email pulls from this file. Edit the values below to
 * rebrand all outgoing email without touching the template logic.
 *
 * Color values use CSS color formats (hex / rgb / hsl) — they're inlined
 * into the HTML so most email clients render them correctly.
 */

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ||
  "http://localhost:3000";

export const emailConfig = {
  brandName: process.env.EMAIL_BRAND_NAME || "ShipSaaS",
  productName: process.env.EMAIL_PRODUCT_NAME || "ShipSaaS",
  supportEmail: process.env.EMAIL_SUPPORT_ADDRESS || "support@shipsaas.dev",
  siteUrl,
  logoUrl: process.env.EMAIL_LOGO_URL || `${siteUrl}/logo.png`,

  // Modern-minimal palette (slate-indigo on paper).
  // Override per brand in .env.local: EMAIL_PRIMARY_COLOR, EMAIL_TEXT_COLOR, etc.
  primaryColor: process.env.EMAIL_PRIMARY_COLOR || "#0b0f1a",
  textColor: process.env.EMAIL_TEXT_COLOR || "#0b0f1a",
  mutedColor: process.env.EMAIL_MUTED_COLOR || "#64748b",
  borderColor: process.env.EMAIL_BORDER_COLOR || "#e2e8f0",
  surfaceColor: process.env.EMAIL_SURFACE_COLOR || "#ffffff",
  backgroundColor: process.env.EMAIL_BACKGROUND_COLOR || "#f8fafc",
};
