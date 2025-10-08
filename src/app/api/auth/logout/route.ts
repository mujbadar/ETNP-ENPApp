import { NextRequest, NextResponse } from 'next/server'

interface LogoutResponse {
  success: boolean
  message: string
}

/**
 * POST /api/auth/logout
 * Clear authentication cookie
 */
export async function POST(request: NextRequest): Promise<NextResponse<LogoutResponse>> {
  try {
    const response = NextResponse.json({
      success: true,
      message: 'Logged out successfully'
    })

    // Clear the auth cookie
    response.cookies.set('auth-token', '', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 0, // Expire immediately
      path: '/'
    })

    return response

  } catch (error) {
    console.error('Logout error:', error)
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    )
  }
}
