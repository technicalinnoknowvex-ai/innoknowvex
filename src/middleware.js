import { updateSession } from "@/utils/supabase/middleware";

export async function middleware(request) {
  // Skip middleware for API routes
  if (request.nextUrl.pathname.startsWith("/api/")) {
    return;
  }

  // update user's auth session
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
