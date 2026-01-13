import { Metadata } from "next";
import { StructuredData } from "@/components/StructuredData";
import { EnhancedNavbar } from "@/components/landing/EnhancedNavbar";
import { EnhancedHero } from "@/components/landing/EnhancedHero";
import { WhyShipSaaS } from "@/components/landing/WhyShipSaaS";
import { EnhancedFeatures } from "@/components/landing/EnhancedFeatures";
import { TechStack } from "@/components/landing/TechStack";
import { EnhancedFAQ } from "@/components/landing/EnhancedFAQ";
import { EnhancedCTA } from "@/components/landing/EnhancedCTA";
import { EnhancedFooter } from "@/components/landing/EnhancedFooter";

export const metadata: Metadata = {
  title: "ShipSaaS - Premium Next.js SaaS Template | Launch in Days",
  description:
    "Premium Next.js 16 SaaS template with authentication, payments, emails, and beautiful UI. Production-ready code that saves you weeks of development.",
};

export default function Home() {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

  // Website structured data
  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "ShipSaaS",
    url: baseUrl,
    description:
      "Premium Next.js SaaS template for launching startups quickly",
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
    name: "ShipSaaS",
    applicationCategory: "DeveloperApplication",
    operatingSystem: "Web",
    offers: {
      "@type": "Offer",
      price: "29",
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
        <WhyShipSaaS />
        <EnhancedFeatures />
        <TechStack />
        <EnhancedFAQ />
        <EnhancedCTA />
        <EnhancedFooter />
      </div>
    </>
  );
}
