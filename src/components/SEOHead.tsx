import { Metadata } from "next";

interface SEOHeadProps {
  title: string;
  description: string;
  canonical?: string;
  ogImage?: string;
  ogType?: "website" | "article";
  publishedTime?: string;
  modifiedTime?: string;
  author?: string;
  tags?: string[];
}

export function generateSEOMetadata({
  title,
  description,
  canonical,
  ogImage,
  ogType = "website",
  publishedTime,
  modifiedTime,
  author,
  tags,
}: SEOHeadProps): Metadata {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
  const fullCanonical = canonical || baseUrl;
  const fullOgImage = ogImage || `${baseUrl}/og-image.png`;

  const metadata: Metadata = {
    title,
    description,
    alternates: {
      canonical: fullCanonical,
    },
    openGraph: {
      title,
      description,
      url: fullCanonical,
      siteName: "ShipFree",
      images: [
        {
          url: fullOgImage,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
      locale: "en_US",
      type: ogType,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [fullOgImage],
      creator: "@shipfree",
    },
  };

  // Add article-specific metadata
  if (ogType === "article" && (publishedTime || modifiedTime || author || tags)) {
    metadata.openGraph = {
      ...metadata.openGraph,
      type: "article",
      publishedTime,
      modifiedTime,
      authors: author ? [author] : undefined,
      tags,
    };
  }

  return metadata;
}
