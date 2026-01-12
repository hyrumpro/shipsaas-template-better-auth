import type { Metadata } from "next";
import { Bricolage_Grotesque } from "next/font/google";
import "./globals.css";
import type React from "react";
import { cn } from "@/lib/utils";
import { StructuredData } from "@/components/StructuredData";

const bricolageGrotesque = Bricolage_Grotesque({
  subsets: ["latin"],
  display: "swap",
});

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(baseUrl),
  title: {
    default: "ShipFree - Open Source SaaS Boilerplate",
    template: "%s | ShipFree",
  },
  description:
    "Free, open-source SaaS boilerplate built with Next.js 16, Supabase, Stripe, and Mailgun. Launch your startup in days, not weeks.",
  keywords: [
    "saas",
    "boilerplate",
    "open source",
    "free",
    "next.js",
    "supabase",
    "stripe",
    "shipfree",
    "startup",
    "saas template",
  ],
  authors: [{ name: "ShipFree Team" }],
  creator: "ShipFree",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: baseUrl,
    siteName: "ShipFree",
    title: "ShipFree - Open Source SaaS Boilerplate",
    description:
      "Free, open-source SaaS boilerplate. Launch your startup in days, not weeks.",
    images: [
      {
        url: `${baseUrl}/og-image.png`,
        width: 1200,
        height: 630,
        alt: "ShipFree - Open Source SaaS Boilerplate",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "ShipFree - Open Source SaaS Boilerplate",
    description:
      "Free, open-source SaaS boilerplate. Launch your startup in days, not weeks.",
    images: [`${baseUrl}/og-image.png`],
    creator: "@shipfree",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

// Organization structured data
const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "ShipFree",
  url: baseUrl,
  logo: `${baseUrl}/logo.png`,
  description:
    "Free, open-source SaaS boilerplate for launching startups quickly",
  sameAs: [
    "https://github.com/yourusername/shipfree",
    "https://twitter.com/shipfree",
  ],
};

// WebApplication structured data
const webAppSchema = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "ShipFree",
  url: baseUrl,
  description:
    "Open-source SaaS boilerplate with authentication, payments, and email integration",
  applicationCategory: "DeveloperApplication",
  operatingSystem: "Web",
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "USD",
  },
  featureList: [
    "User Authentication",
    "Payment Integration",
    "Email Templates",
    "SEO Optimization",
    "Docker Support",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <StructuredData data={organizationSchema} />
        <StructuredData data={webAppSchema} />
      </head>
      <body className={cn(bricolageGrotesque.className, "antialiased")}>
        {children}
      </body>
    </html>
  );
}
