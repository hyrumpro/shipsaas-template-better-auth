import { NextConfig } from "next";

const nextConfig = {
  // TypeScript checking enabled - all code is type-safe
  pageExtensions: ["ts", "tsx", "mdx"],
  output: "standalone",

  // Dummy env vars for build (LemonSqueezy SDK uses dynamic imports)
  env: {
    LEMONSQUEEZY_API_KEY: process.env.LEMONSQUEEZY_API_KEY || "dummy_key_for_build",
    LEMONSQUEEZY_STORE_ID: process.env.LEMONSQUEEZY_STORE_ID || "dummy_store_for_build",
  },
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "Strict-Transport-Security",
            value: "max-age=31536000; includeSubDomains; preload",
          },
          {
            key: "X-Frame-Options",
            value: "DENY",
          },
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "Referrer-Policy",
            value: "strict-origin-when-cross-origin",
          },
        ],
      },
    ];
  },
} satisfies NextConfig;

export default nextConfig;
