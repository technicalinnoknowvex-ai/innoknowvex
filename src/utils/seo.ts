import { SITE_CONFIG, DEFAULT_OG_IMAGE } from "@/constants/seo";

/**
 * SEO Utility Functions
 * Helper functions for generating consistent SEO metadata
 */

interface MetadataParams {
  title: string;
  description: string;
  keywords?: string[];
  image?: string;
  path?: string;
  noindex?: boolean;
  type?: string;
}

/**
 * Generate complete metadata object for a page
 */
export function generateMetadataObject({
  title,
  description,
  keywords = [],
  image = DEFAULT_OG_IMAGE,
  path = "/",
  noindex = false,
  type = "website",
}: MetadataParams) {
  const canonicalUrl = `${SITE_CONFIG.domain}${path}`;

  return {
    // Basic metadata
    title,
    description,
    keywords: Array.isArray(keywords) ? keywords.join(", ") : keywords,

    // Robots
    robots: noindex ? "noindex, nofollow" : "index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1",

    // Canonical
    alternates: {
      canonical: canonicalUrl,
    },

    // Open Graph
    openGraph: {
      type,
      url: canonicalUrl,
      title,
      description,
      siteName: SITE_CONFIG.name,
      locale: SITE_CONFIG.locale,
      images: [
        {
          url: image,
          width: 1200,
          height: 630,
          alt: title,
          type: "image/jpeg",
        },
      ],
    },

    // Twitter Card
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [image],
      creator: "@innoknowvex",
      site: "@innoknowvex",
    },

    // Author
    author: SITE_CONFIG.name,

    // Viewport
    viewport: "width=device-width, initial-scale=1.0, maximum-scale=5.0",

    // Theme color
    themeColor: "#000000",

    // Generator
    generator: "Next.js",

    // Format detection
    formatDetection: {
      email: true,
      telephone: true,
      address: true,
    },
  };
}

/**
 * Generate schema.org JSON-LD markup
 */
export function generateSchemaMarkup(schema) {
  return {
    __html: JSON.stringify(schema),
  };
}

/**
 * Create breadcrumb schema markup
 */
export function createBreadcrumbSchema(items) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

/**
 * Create organization schema markup
 */
export function createOrganizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "EducationalOrganization",
    name: SITE_CONFIG.name,
    url: SITE_CONFIG.domain,
    logo: `${SITE_CONFIG.domain}/images/logo.png`,
    description: SITE_CONFIG.description,
    sameAs: Object.values(SITE_CONFIG.socialMedia).filter(Boolean),
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "Customer Service",
      email: SITE_CONFIG.email,
    },
  };
}

/**
 * Create course schema markup
 */
export function createCourseSchema(course) {
  return {
    "@context": "https://schema.org",
    "@type": "Course",
    name: course.name,
    description: course.description,
    provider: {
      "@type": "Organization",
      name: SITE_CONFIG.name,
      url: SITE_CONFIG.domain,
    },
    instructor: {
      "@type": "Person",
      name: course.instructor || "Edutect Team",
    },
    ...(course.price && {
      offers: {
        "@type": "Offer",
        price: course.price,
        priceCurrency: "INR",
        availability: "https://schema.org/InStock",
      },
    }),
  };
}

/**
 * Create person schema markup
 */
export function createPersonSchema(person) {
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    name: person.name,
    description: person.description,
    image: person.image,
    ...(person.url && { url: person.url }),
  };
}

/**
 * Sanitize title for SEO (max 60 chars)
 */
export function sanitizeTitle(title) {
  return title.length > 60 ? title.substring(0, 57) + "..." : title;
}

/**
 * Sanitize description for SEO (max 160 chars)
 */
export function sanitizeDescription(description) {
  return description.length > 160
    ? description.substring(0, 157) + "..."
    : description;
}
