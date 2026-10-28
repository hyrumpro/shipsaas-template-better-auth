/**
 * Compatibility alias. All checkout requests use the canonical plan-based
 * route so clients cannot submit arbitrary provider price IDs.
 */
export { POST } from "@/app/api/checkout/route";
