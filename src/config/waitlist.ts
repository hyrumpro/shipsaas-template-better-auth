/**
 * Waitlist page copy
 *
 * Edit this file to change the public /waitlist page.
 *
 * To enable the page, set NEXT_PUBLIC_WAITLIST_ENABLED=true in .env.local
 * (and run the migrations/002_waitlist.sql migration).
 *
 * When disabled, the route returns 404 and the page is unreachable.
 */

export const waitlistConfig = {
  enabled: process.env.NEXT_PUBLIC_WAITLIST_ENABLED === "true",

  // Page-level
  eyebrow: "Coming soon",
  title: "We're launching soon.",
  subtitle:
    "Be the first to know when we open the doors. Drop your email and we'll send you a single message when it's time.",

  // Form
  emailLabel: "Email",
  emailPlaceholder: "you@example.com",
  nameLabel: "Name (optional)",
  namePlaceholder: "Jane Doe",
  submitLabel: "Join the waitlist",
  submittingLabel: "Joining…",
  successMessage:
    "You're on the list. We'll be in touch when it's time to launch.",
  alreadyOnListMessage: "You're already on the list. We'll be in touch.",

  // Counter (only shown when waitlistCount is available)
  counterPrefix: "Join",
  counterSuffix: "others on the list",
  counterEmpty: "Be the first",

  // Footer link
  homeLinkLabel: "Back to home",
};
