import { ROBOTS_CONFIG, SITE_CONFIG } from "@/constants/seo";

/**
 * Dynamic robots.txt generation
 * Allows all search engines while blocking admin and API routes
 */
export default function robots() {
  return {
    rules: [
      {
        userAgent: "*",
        allow: ["/"],
        disallow: [
          "/admin",
          "/student/*/dashboard",
          "/cart",
          "/api",
          "/*.json",
          "/*?*sort=",
          "/auth",
        ],
      },
      {
        userAgent: "GPTBot",
        disallow: ["/"],
      },
      {
        userAgent: "CCBot",
        disallow: ["/"],
      },
    ],
    sitemap: `${SITE_CONFIG.domain}/sitemap.xml`,
    host: SITE_CONFIG.domain,
  };
}
