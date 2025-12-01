import { updateSession } from "@/utils/supabase/middleware";
import { NextResponse } from 'next/server';

export async function middleware(request) {
  const { pathname } = request.nextUrl;

  console.log('🛡️ [MIDDLEWARE] Request:', pathname);

  // Skip middleware for API routes
  if (pathname.startsWith("/api/")) {
    console.log('⏭️ [MIDDLEWARE] Skipping API route');
    return NextResponse.next();
  }

  // 🔥 CRITICAL: Allow reset password pages without auth checks
  if (pathname === '/auth/reset-password' ) {
    console.log('✅ [MIDDLEWARE] Allowing reset password page - bypassing all auth');
    return NextResponse.next();
  }

  // Update user's auth session for all other routes
  console.log('🔄 [MIDDLEWARE] Updating session');
  return await updateSession(request);
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - api routes
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};