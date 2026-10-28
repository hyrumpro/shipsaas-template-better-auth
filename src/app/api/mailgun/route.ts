/**
 * Compatibility alias for the canonical Mailgun webhook endpoint.
 * Keeping one implementation prevents signature and forwarding behavior from
 * drifting between the legacy and documented URLs.
 */
export { GET, POST } from "@/app/api/mailgun/webhook/route";
