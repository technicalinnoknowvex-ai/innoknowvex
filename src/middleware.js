import { NextResponse } from 'next/server'

export async function middleware(request) {
  try {
    // Skip problematic routes
    const { pathname } = request.nextUrl
    
    // API routes - skip
    if (pathname.startsWith('/api/')) {
      return NextResponse.next()
    }
    
    // Static assets - skip  
    if (pathname.startsWith('/_next/') || 
        pathname.includes('/favicon.ico') ||
        pathname.match(/\.(svg|png|jpg|jpeg|gif|webp)$/)) {
      return NextResponse.next()
    }
    
    // Reset password - skip
    if (pathname === '/auth/reset-password') {
      return NextResponse.next()
    }
    
    // Auth pages - skip (let Supabase handle)
    if (pathname.startsWith('/auth/')) {
      return NextResponse.next()
    }
    
    // ALL OTHER ROUTES: Just pass through (no Supabase calls)
    return NextResponse.next()
    
  } catch (error) {
    console.error('[MIDDLEWARE ERROR]:', error)
    return NextResponse.next()
  }
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
