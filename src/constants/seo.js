/**
 * SEO Configuration for Edutect
 * Centralized SEO metadata and configuration
 */

export const SITE_CONFIG = {
  name: "Innoknowvex",
  title: "Innoknowvex - Web Development, Cyber Security & Professional Training",
  description:
    "Innoknowvex offers comprehensive web development, MERN Stack, cyber security training, internships, and placement programs to form aspirations into achievements.",
  domain: "https://www.innoknowvex.in",
  locale: "en_US",
  email: "support@innoknowvex.in",
  phone: "+91 9535788085",
  socialMedia: {
    facebook: "https://www.facebook.com/profile.php?id=61582759388164",
    linkedin: "https://www.linkedin.com/company/innoknowvex",
    instagram: "https://www.instagram.com/inno_knowvex/",
    youtube: "https://www.youtube.com/channel/UCAh8BzOPFtransa1GrHDeMa9l7Tw",
  },
};

export const DEFAULT_OG_IMAGE = `${SITE_CONFIG.domain}/og-image.jpg`;

export const PAGES = {
  home: {
    path: "/",
    title: "Innoknowvex - Transform Aspirations into Achievements",
    description:
      "Explore web development, MERN Stack, cyber security training, internships, and placement programs designed to launch your tech career.",
    keywords:
      "web development, MERN stack, cyber security, internships, placement training, tech education",
  },
  programs: {
    path: "/programs",
    title: "Professional Training Programs - Innoknowvex",
    description:
      "Comprehensive training programs in web development, MERN Stack, and cyber security with placement assistance.",
    keywords:
      "training programs, web development course, cyber security training, MERN stack course, tech programs",
  },
  offlineCourses: {
    path: "/offline-courses",
    title: "Offline Courses - Innoknowvex",
    description:
      "Hands-on offline courses in web development, cyber security, and tech specializations with mentorship.",
    keywords:
      "offline courses, in-person training, cyber security course, web development course",
  },
  techStarterPack: {
    path: "/tech-starter-pack",
    title: "Tech Starter Pack - Begin Your Tech Journey",
    description:
      "Perfect entry-level program to learn web development and tech fundamentals with Innoknowvex.",
    keywords: "tech starter pack, beginner coding, web development basics, tech course",
  },
  goldenPass: {
    path: "/golden-pass",
    title: "Golden Pass - Premium Tech Training",
    description:
      "Premium membership offering unlimited access to all courses, mentorship, and placement support.",
    keywords: "golden pass, premium membership, unlimited learning, tech mentorship",
  },
  aboutUs: {
    path: "/about-us",
    title: "About Innoknowvex - Our Mission & Vision",
    description:
      "Learn about Innoknowvex's mission to transform aspirations into achievements through quality tech education.",
    keywords: "about us, company mission, tech education, Innoknowvex story",
  },
  cart: {
    path: "/cart",
    title: "Shopping Cart - Innoknowvex",
    description: "Review your selected courses and complete your purchase.",
    keywords: "shopping cart, checkout, buy courses",
    noindex: true,
  },
  studentDashboard: {
    path: "/student/dashboard",
    title: "Student Dashboard",
    description: "Manage your courses, progress, and learning path.",
    keywords: "dashboard, student portal, course management",
    noindex: true,
  },
  adminDashboard: {
    path: "/admin",
    title: "Admin Dashboard",
    description: "Administrative management panel.",
    keywords: "admin, dashboard, management",
    noindex: true,
  },
  studentSignIn: {
    path: "/auth/student/sign-in",
    title: "Student Sign In - Innoknowvex",
    description: "Sign in to your Innoknowvex student account.",
    keywords: "sign in, login, student portal",
    noindex: true,
  },
  studentSignUp: {
    path: "/auth/student/sign-up",
    title: "Student Sign Up - Innoknowvex",
    description: "Create a new student account on Innoknowvex.",
    keywords: "sign up, register, student account",
    noindex: true,
  },
  adminSignIn: {
    path: "/auth/admin/sign-in",
    title: "Admin Sign In - Innoknowvex",
    description: "Admin sign in for Innoknowvex dashboard.",
    keywords: "admin sign in, admin login",
    noindex: true,
  },
  adminSignUp: {
    path: "/auth/admin/sign-up",
    title: "Admin Sign Up - Innoknowvex",
    description: "Create an admin account on Innoknowvex.",
    keywords: "admin sign up, admin register",
    noindex: true,
  },
  forgotPassword: {
    path: "/auth/student/forgot-password",
    title: "Forgot Password - Innoknowvex",
    description: "Reset your Innoknowvex account password.",
    keywords: "forgot password, password reset",
    noindex: true,
  },
  resetPassword: {
    path: "/auth/reset-password",
    title: "Reset Password - Innoknowvex",
    description: "Set a new password for your Innoknowvex account.",
    keywords: "reset password, new password",
    noindex: true,
  },
};

export const SCHEMA_ORGANIZATION = {
  "@context": "https://schema.org",
  "@type": "EducationalOrganization",
  name: SITE_CONFIG.name,
  url: SITE_CONFIG.domain,
  logo: `${SITE_CONFIG.domain}/logo.png`,
  description: SITE_CONFIG.description,
  sameAs: Object.values(SITE_CONFIG.socialMedia),
  contactPoint: {
    "@type": "ContactPoint",
    contactType: "Customer Service",
    telephone: SITE_CONFIG.phone,
    email: SITE_CONFIG.email,
  },
};

export const ROBOTS_CONFIG = {
  rules: [
    {
      userAgent: "*",
      allow: "/",
      disallow: ["/admin", "/student/[studentId]/dashboard", "/cart", "/api"],
    },
  ],
  sitemap: `${SITE_CONFIG.domain}/sitemap.xml`,
};

/**
 * Common SEO metadata for pages
 */
export const generatePageMetadata = (page) => ({
  title: page.title,
  description: page.description,
  keywords: page.keywords,
  robots: page.noindex ? "noindex, nofollow" : "index, follow",
});

/**
 * Open Graph metadata template
 */
export const generateOpenGraph = (page, ogImage = DEFAULT_OG_IMAGE) => ({
  type: "website",
  url: `${SITE_CONFIG.domain}${page.path}`,
  title: page.title,
  description: page.description,
  siteName: SITE_CONFIG.name,
  images: [
    {
      url: ogImage,
      width: 1200,
      height: 630,
      alt: page.title,
    },
  ],
  locale: SITE_CONFIG.locale,
});

/**
 * Twitter Card metadata template
 */
export const generateTwitterCard = (page, ogImage = DEFAULT_OG_IMAGE) => ({
  card: "summary_large_image",
  title: page.title,
  description: page.description,
  images: [ogImage],
  creator: "@innoknowvex",
  site: "@innoknowvex",
});

/**
 * Canonical URL helper
 */
export const getCanonicalUrl = (path) => `${SITE_CONFIG.domain}${path}`;

/**
 * Schema markup for different types
 */
export const SCHEMA_COURSE = (course) => ({
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
    name: course.instructorName || "Innoknowvex Team",
  },
  aggregateRating: course.rating
    ? {
        "@type": "AggregateRating",
        ratingValue: course.rating.value,
        ratingCount: course.rating.count,
      }
    : undefined,
});

export const SCHEMA_BREADCRUMB = (items) => ({
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: items.map((item, index) => ({
    "@type": "ListItem",
    position: index + 1,
    name: item.name,
    item: `${SITE_CONFIG.domain}${item.path}`,
  })),
});
