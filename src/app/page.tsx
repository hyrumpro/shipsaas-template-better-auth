import { Metadata } from "next";
import { StructuredData } from "@/components/StructuredData";
import { EnhancedNavbar } from "@/components/landing/EnhancedNavbar";
import { EnhancedHero } from "@/components/landing/EnhancedHero";
import { WhyShipFree } from "@/components/landing/WhyShipFree";
import { EnhancedFeatures } from "@/components/landing/EnhancedFeatures";
import { TechStack } from "@/components/landing/TechStack";
import { EnhancedFAQ } from "@/components/landing/EnhancedFAQ";
import { EnhancedCTA } from "@/components/landing/EnhancedCTA";
import { EnhancedFooter } from "@/components/landing/EnhancedFooter";

export const metadata: Metadata = {
  title: "ShipFree - Free Open Source SaaS Boilerplate",
  description:
    "Free, open-source SaaS boilerplate with Next.js 16, Supabase, Stripe, and Mailgun. Launch your startup in days, not weeks.",
};

export default function Home() {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

  // Website structured data
  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "ShipFree",
    url: baseUrl,
    description:
      "Free, open-source SaaS boilerplate for launching startups quickly",
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${baseUrl}/search?q={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  };

  // SoftwareApplication structured data
  const softwareSchema = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "ShipFree",
    applicationCategory: "DeveloperApplication",
    operatingSystem: "Web",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
    },
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: "4.9",
      ratingCount: "250",
    },
  };

  return (
    <>
      <StructuredData data={websiteSchema} />
      <StructuredData data={softwareSchema} />
      
      <div className="bg-background min-h-screen">
        <EnhancedNavbar />
        <EnhancedHero />
        <WhyShipFree />
        <EnhancedFeatures />
        <TechStack />
        <EnhancedFAQ />
        <EnhancedCTA />
        <EnhancedFooter />
      </div>
    </>
  );
}
