import { NextRequest, NextResponse } from 'next/server'
import jwt from 'jsonwebtoken'

interface AuthToken {
  email: string
  iat: number
  exp: number
}

/**
 * Middleware to verify authentication token
 */
export function verifyAuth(request: NextRequest): AuthToken | null {
  try {
    const token = request.cookies.get('auth-token')?.value
    
    if (!token) {
      return null
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as AuthToken
    return decoded

  } catch (error) {
    console.error('Auth verification error:', error)
    return null
  }
}

/**
 * Create authenticated response or redirect to login
 */
export function requireAuth(request: NextRequest): NextResponse | null {
  const authToken = verifyAuth(request)
  
  if (!authToken) {
    return NextResponse.json(
      { error: 'Authentication required' },
      { status: 401 }
    )
  }
  
  return null
}

/**
 * Get current user email from request
 */
export function getCurrentUser(request: NextRequest): string | null {
  const authToken = verifyAuth(request)
  return authToken?.email || null
}
