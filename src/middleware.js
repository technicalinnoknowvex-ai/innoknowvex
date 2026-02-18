import { createMiddlewareClient } from '@supabase/ssr'
import { NextResponse } from 'next/server'

export async function middleware(request) {
  const { pathname } = request.nextUrl

  console.log('🛡️ [MIDDLEWARE] Request:', pathname)

  // Skip middleware for API routes
  if (pathname.startsWith('/api/')) {
    console.log('⏭️ [MIDDLEWARE] Skipping API route')
    return NextResponse.next()
  }

  // 🔥 Allow reset password pages without auth checks
  if (pathname === '/auth/reset-password') {
    console.log('✅ [MIDDLEWARE] Allowing reset password page')
    return NextResponse.next()
  }

  // ✅ Edge-compatible middleware client
  const response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  })

  const supabase = createMiddlewareClient({ 
    cookies: () => request.cookies,
    request,
    response 
  })

  // Refresh session
  await supabase.auth.getSession()

  console.log('🔄 [MIDDLEWARE] Session updated')
  return response
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
