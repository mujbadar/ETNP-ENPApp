import { NextRequest, NextResponse } from 'next/server'
import { verifyAuth } from '@/lib/auth'

interface MeResponse {
  authenticated: boolean
  email?: string
}

/**
 * GET /api/auth/me
 * Check authentication status
 */
export async function GET(request: NextRequest): Promise<NextResponse<MeResponse>> {
  try {
    const authToken = verifyAuth(request)
    
    if (!authToken) {
      return NextResponse.json(
        { authenticated: false },
        { status: 401 }
      )
    }

    return NextResponse.json({
      authenticated: true,
      email: authToken.email
    })

  } catch (error) {
    console.error('Auth check error:', error)
    return NextResponse.json(
      { authenticated: false },
      { status: 401 }
    )
  }
}
