import { SITE_CONFIG, PAGES } from "@/constants/seo";

/**
 * Dynamic sitemap.xml generation
 * Automatically includes all public pages and routes
 */

// Define all public pages
const publicPages = [
  { url: PAGES.home.path, lastModified: new Date(), changeFrequency: "weekly", priority: 1.0 },
  { url: PAGES.programs.path, lastModified: new Date(), changeFrequency: "weekly", priority: 0.9 },
  { url: PAGES.offlineCourses.path, lastModified: new Date(), changeFrequency: "weekly", priority: 0.9 },
  { url: PAGES.techStarterPack.path, lastModified: new Date(), changeFrequency: "monthly", priority: 0.8 },
  { url: PAGES.goldenPass.path, lastModified: new Date(), changeFrequency: "monthly", priority: 0.8 },
  { url: PAGES.aboutUs.path, lastModified: new Date(), changeFrequency: "yearly", priority: 0.7 },
];

/**
 * This function fetches dynamic routes if you have them
 * For now, it returns static routes
 * TODO: Add dynamic program and course routes from your database
 */
async function getDynamicRoutes() {
  try {
    // Fetch programs
    // const programsResponse = await fetch(`${SITE_CONFIG.domain}/api/programs`);
    // const programs = await programsResponse.json();
    
    // Fetch offline courses
    // const coursesResponse = await fetch(`${SITE_CONFIG.domain}/api/offline-courses`);
    // const courses = await coursesResponse.json();

    // For now, returning empty array - you can populate this dynamically
    return [];
  } catch (error) {
    console.error("Error fetching dynamic routes for sitemap:", error);
    return [];
  }
}

export default async function sitemap() {
  const dynamicRoutes = await getDynamicRoutes();

  const allRoutes = [
    ...publicPages.map((page) => ({
      url: `${SITE_CONFIG.domain}${page.url}`,
      lastModified: page.lastModified,
      changeFrequency: page.changeFrequency,
      priority: page.priority,
    })),
    ...dynamicRoutes,
  ];

  return allRoutes;
}
