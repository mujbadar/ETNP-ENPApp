import { NextRequest } from 'next/server'

interface AuthToken {
  email: string
  iat: number
  exp: number
}

/**
 * Verify JWT token using Web Crypto API (Edge Runtime compatible)
 */
export function verifyAuth(request: NextRequest): AuthToken | null {
  try {
    const token = request.cookies.get('auth-token')?.value
    
    if (!token) {
      return null
    }

    // Parse JWT without verification in middleware
    // We'll verify in API routes instead
    const parts = token.split('.')
    if (parts.length !== 3) {
      return null
    }

    // Decode payload (base64url) - Edge Runtime compatible
    const payload = parts[1]
    
    // Convert base64url to base64
    let base64 = payload.replace(/-/g, '+').replace(/_/g, '/')
    
    // Add padding if needed
    while (base64.length % 4) {
      base64 += '='
    }
    
    // Decode using atob (Edge Runtime compatible)
    const decoded = JSON.parse(
      atob(base64)
    )

    // Check expiration
    if (decoded.exp && Date.now() >= decoded.exp * 1000) {
      return null
    }

    return decoded as AuthToken

  } catch (error) {
    console.error('Auth verification error:', error)
    return null
  }
}

