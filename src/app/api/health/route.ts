/**
 * Health Check Endpoint
 * 
 * Used by Docker health checks and monitoring tools to verify the application is running.
 * Returns a simple JSON response with status and timestamp.
 */

export async function GET() {
  return Response.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    service: 'ShipFree SaaS',
  });
}
