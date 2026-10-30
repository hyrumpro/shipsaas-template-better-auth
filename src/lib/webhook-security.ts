import crypto from "crypto";

/**
 * Verify a provider HMAC before handing a webhook body to application code.
 * Mailgun and Lemon Squeezy send hexadecimal digests.
 */
export function verifyHmacSha256(
  rawBody: string,
  signature: string | null,
  secret: string | undefined
): boolean {
  if (!signature || !secret) return false;

  const expected = crypto
    .createHmac("sha256", secret)
    .update(rawBody)
    .digest("hex");
  const received = signature.trim();

  if (!/^[a-f0-9]+$/i.test(received) || received.length !== expected.length) {
    return false;
  }

  return crypto.timingSafeEqual(
    Buffer.from(expected, "hex"),
    Buffer.from(received, "hex")
  );
}

/**
 * Lemon Squeezy and Mailgun do not expose a stable delivery-event id in every
 * webhook shape. This is an internal duplicate-delivery key, not a claimed
 * provider id. A changed payload produces a different key.
 */
export function createWebhookBodyDedupeKey(
  provider: "lemonsqueezy" | "mailgun",
  rawBody: string
): string {
  return `${provider}:body:${crypto.createHash("sha256").update(rawBody).digest("hex")}`;
}
