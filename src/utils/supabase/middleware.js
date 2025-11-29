import { createServerClient } from "@supabase/ssr";
import { NextResponse } from "next/server";
import { ROLES } from "@/constants/roles";

// Role-based configuration - everything in one place per role
const ROLE_CONFIG = {
  [ROLES.ADMIN]: {
    authPages: ["/auth/admin/sign-in", "/auth/admin/sign-up", "/auth/admin/forgot-password"],
    protectedPages: ["/admin/*"],
    signInRedirect: "/auth/admin/sign-in",
    homeRedirect: "/",
  },
  [ROLES.STUDENT]: {
    authPages: ["/auth/student/sign-in", "/auth/student/sign-up", "/auth/student/forgot-password"],
    protectedPages: ["/student/*", "/choose-packs/*"],
    signInRedirect: "/auth/student/sign-in",
    homeRedirect: "/",
  },
};

// Public pages accessible to everyone (logged in or not)
const PUBLIC_PAGES = [
  "/",
  "/about-us",
  "/contact",
  "/programs/*",
  "/blogs/*",
  "/faq",
  "/pricing",
];

// Routes that should ALWAYS be skipped by middleware
const SKIP_MIDDLEWARE = [
  "/api/auth/callback",  // ← ADD THIS - Critical for email verification
  "/api/*",              // Skip all API routes (optional but recommended)
  "/_next/*",            // Next.js internals
  "/favicon.ico",
  "/static/*",
];

// Helper function to check if a path matches any pattern
const matchesPattern = (pathname, patterns) => {
  return patterns.some((pattern) => {
    if (pattern === pathname) return true;
    if (pattern.endsWith("/*")) {
      const base = pattern.slice(0, -2);
      return pathname.startsWith(base);
    }
    return false;
  });
};

// Get role config or null if role doesn't exist
const getRoleConfig = (role) => {
  return ROLE_CONFIG[role] || null;
};

export async function updateSession(request) {
  const pathname = request.nextUrl.pathname;

  // ✅ CRITICAL: Skip middleware for callback and API routes FIRST
  if (matchesPattern(pathname, SKIP_MIDDLEWARE)) {
    return NextResponse.next();
  }

  let supabaseResponse = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          );
          supabaseResponse = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const userRole = user?.user_metadata?.role;
  const roleConfig = getRoleConfig(userRole);

  // Check if path is public
  const isPublicPage = matchesPattern(pathname, PUBLIC_PAGES);

  // Check if path is any auth page
  const allAuthPages = Object.values(ROLE_CONFIG).flatMap(
    (config) => config.authPages
  );
  const isAuthPage = matchesPattern(pathname, allAuthPages);

  // === NOT LOGGED IN ===
  if (!user) {
    // Allow public pages and auth pages
    if (isPublicPage || isAuthPage) {
      return supabaseResponse;
    }

    // Check which role's protected page they're trying to access
    for (const [role, config] of Object.entries(ROLE_CONFIG)) {
      if (matchesPattern(pathname, config.protectedPages)) {
        const redirectUrl = new URL(config.signInRedirect, request.url);
        redirectUrl.searchParams.set("redirect", pathname);
        return NextResponse.redirect(redirectUrl);
      }
    }

    // Unknown protected route - redirect to home
    return NextResponse.redirect(new URL("/", request.url));
  }

  // === LOGGED IN ===

  // Redirect away from auth pages
  if (isAuthPage) {
    const redirect = roleConfig?.homeRedirect || "/";
    return NextResponse.redirect(new URL(redirect, request.url));
  }

  // Allow public pages
  if (isPublicPage) {
    return supabaseResponse;
  }

  // Check if user is accessing their own protected pages
  if (roleConfig && matchesPattern(pathname, roleConfig.protectedPages)) {
    return supabaseResponse; // Allow access
  }

  // Check if user is trying to access another role's protected pages
  for (const [role, config] of Object.entries(ROLE_CONFIG)) {
    if (role !== userRole && matchesPattern(pathname, config.protectedPages)) {
      // Redirect to their own role's signin (or could be their home)
      const redirectUrl = new URL(
        roleConfig?.signInRedirect || "/",
        request.url
      );
      return NextResponse.redirect(redirectUrl);
    }
  }

  // Allow any other routes not explicitly protected
  return supabaseResponse;
}