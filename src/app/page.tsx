import { Metadata } from "next";
import { StructuredData } from "@/components/StructuredData";
import { Navbar } from "@/components/landing/Navbar";
import { Hero } from "@/components/landing/Hero";
import { Features } from "@/components/landing/Features";
import { TechStack } from "@/components/landing/TechStack";
import { FAQ } from "@/components/landing/FAQ";
import { CTA } from "@/components/landing/CTA";
import { Footer } from "@/components/landing/Footer";

export const metadata: Metadata = {
  title: "ShipSaaS - Premium Next.js SaaS Template",
  description:
    "A premium Next.js 16 SaaS template with auth, payments, email, and a real dashboard. Production-ready code, end-to-end types.",
};

export default function Home() {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "ShipSaaS",
    url: baseUrl,
    description:
      "A premium Next.js SaaS template for shipping your product faster.",
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${baseUrl}/search?q={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  };

  return (
    <>
      <StructuredData data={websiteSchema} />
      <div className="bg-background min-h-screen">
        <Navbar />
        <main>
          <Hero />
          <Features />
          <TechStack />
          <FAQ />
          <CTA />
        </main>
        <Footer />
      </div>
    </>
  );
}
