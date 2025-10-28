import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { verifyAuth } from './lib/auth-edge'

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname

  // Allow root, static files, and login without auth
  if (pathname === '/' || pathname.startsWith('/static/') || pathname === '/login') {
    return NextResponse.next()
  }

  // Protect /patrol routes (except login)
  if (pathname.startsWith('/patrol')) {
    // Allow /patrol/login without auth
    if (pathname.startsWith('/patrol/login')) {
      return NextResponse.next()
    }

    // Check authentication for other /patrol routes
    const authToken = verifyAuth(request)
    
    if (!authToken) {
      return NextResponse.redirect(new URL('/patrol/login', request.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/', '/patrol/:path*', '/login'],
}
