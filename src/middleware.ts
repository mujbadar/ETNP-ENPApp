import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  // Only protect the main page, not API routes or login page
  if (request.nextUrl.pathname === '/') {
    const authToken = request.cookies.get('auth-token')
    
    if (!authToken) {
      // Redirect to login page if not authenticated
      return NextResponse.redirect(new URL('/login', request.url))
    }
  }
  
  return NextResponse.next()
}

export const config = {
  matcher: ['/']
}
