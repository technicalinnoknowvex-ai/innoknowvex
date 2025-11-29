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
  "/api/auth/callback",           // Critical for email verification
  "/auth/student/reset-password", // 🔥 CRITICAL: Allow password reset
  "/auth/admin/reset-password",   // 🔥 CRITICAL: Allow admin password reset
  "/api/*",                       // Skip all API routes
  "/_next/*",                     // Next.js internals
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

  console.log('🔍 [UPDATE SESSION] Processing:', pathname);

  // ✅ CRITICAL: Skip middleware for callback, API routes, and reset password FIRST
  if (matchesPattern(pathname, SKIP_MIDDLEWARE)) {
    console.log('⏭️ [UPDATE SESSION] Skipping - matched skip pattern');
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

  console.log('👤 [UPDATE SESSION] User:', user?.email || 'Not logged in');
  console.log('🎭 [UPDATE SESSION] Role:', userRole || 'None');

  // Check if path is public
  const isPublicPage = matchesPattern(pathname, PUBLIC_PAGES);

  // Check if path is any auth page
  const allAuthPages = Object.values(ROLE_CONFIG).flatMap(
    (config) => config.authPages
  );
  const isAuthPage = matchesPattern(pathname, allAuthPages);

  // === NOT LOGGED IN ===
  if (!user) {
    console.log('🔓 [UPDATE SESSION] No user - checking access...');
    
    // Allow public pages and auth pages
    if (isPublicPage || isAuthPage) {
      console.log('✅ [UPDATE SESSION] Allowing public/auth page');
      return supabaseResponse;
    }

    // Check which role's protected page they're trying to access
    for (const [role, config] of Object.entries(ROLE_CONFIG)) {
      if (matchesPattern(pathname, config.protectedPages)) {
        console.log(`🚫 [UPDATE SESSION] Protected ${role} page - redirecting to sign in`);
        const redirectUrl = new URL(config.signInRedirect, request.url);
        redirectUrl.searchParams.set("redirect", pathname);
        return NextResponse.redirect(redirectUrl);
      }
    }

    // Unknown protected route - redirect to home
    console.log('🏠 [UPDATE SESSION] Unknown route - redirecting to home');
    return NextResponse.redirect(new URL("/", request.url));
  }

  // === LOGGED IN ===
  console.log('🔐 [UPDATE SESSION] User logged in - checking permissions...');

  // Redirect away from auth pages
  if (isAuthPage) {
    console.log('🔄 [UPDATE SESSION] Logged in user on auth page - redirecting home');
    const redirect = roleConfig?.homeRedirect || "/";
    return NextResponse.redirect(new URL(redirect, request.url));
  }

  // Allow public pages
  if (isPublicPage) {
    console.log('✅ [UPDATE SESSION] Allowing public page');
    return supabaseResponse;
  }

  // Check if user is accessing their own protected pages
  if (roleConfig && matchesPattern(pathname, roleConfig.protectedPages)) {
    console.log('✅ [UPDATE SESSION] Accessing own protected pages');
    return supabaseResponse; // Allow access
  }

  // Check if user is trying to access another role's protected pages
  for (const [role, config] of Object.entries(ROLE_CONFIG)) {
    if (role !== userRole && matchesPattern(pathname, config.protectedPages)) {
      console.log(`🚫 [UPDATE SESSION] Wrong role - trying to access ${role} pages`);
      // Redirect to their own role's signin (or could be their home)
      const redirectUrl = new URL(
        roleConfig?.signInRedirect || "/",
        request.url
      );
      return NextResponse.redirect(redirectUrl);
    }
  }

  // Allow any other routes not explicitly protected
  console.log('✅ [UPDATE SESSION] Allowing other route');
  return supabaseResponse;
}