import { StructuredData } from "../StructuredData";

interface ProductSchemaProps {
  name: string;
  description: string;
  price: string;
  currency?: string;
  image?: string;
  rating?: number;
  reviewCount?: number;
}

export function ProductSchema({
  name,
  description,
  price,
  currency = "USD",
  image,
  rating,
  reviewCount,
}: ProductSchemaProps) {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

  const productSchema: any = {
    "@context": "https://schema.org",
    "@type": "Product",
    name,
    description,
    image: image || `${baseUrl}/og-image.png`,
    offers: {
      "@type": "Offer",
      price,
      priceCurrency: currency,
      availability: "https://schema.org/InStock",
      url: baseUrl,
    },
  };

  // Add aggregate rating if provided
  if (rating && reviewCount) {
    productSchema.aggregateRating = {
      "@type": "AggregateRating",
      ratingValue: rating,
      reviewCount,
    };
  }

  return <StructuredData data={productSchema} />;
}
