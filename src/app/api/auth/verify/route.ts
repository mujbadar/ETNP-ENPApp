import { NextRequest, NextResponse } from 'next/server'
import { adminAuth } from '@/lib/firebase-admin'
import jwt from 'jsonwebtoken'

interface VerifyRequest {
  email: string
  code: string
}

interface VerifyResponse {
  success: boolean
  message: string
  token?: string
}

/**
 * POST /api/auth/verify
 * Verify 6-digit code from Firebase custom claims and create session cookie
 */
export async function POST(request: NextRequest): Promise<NextResponse<VerifyResponse>> {
  try {
    const body: VerifyRequest = await request.json()
    const { email, code } = body

    if (!email || !code) {
      return NextResponse.json(
        { success: false, message: 'Email and code are required' },
        { status: 400 }
      )
    }

    try {
      // Get user from Firebase Auth
      const user = await adminAuth.getUserByEmail(email.toLowerCase())
      
      // Get custom claims
      const customClaims = user.customClaims || {}
      
      console.log(`Verifying code for ${email}:`, {
        storedCode: customClaims.verificationCode,
        providedCode: code,
        expires: customClaims.codeExpires,
        currentTime: Date.now()
      })

      // Check if verification code exists
      if (!customClaims.verificationCode) {
        return NextResponse.json(
          { success: false, message: 'No verification code found for this email' },
          { status: 404 }
        )
      }

      // Check if code has expired
      if (Date.now() > customClaims.codeExpires) {
        // Clear expired code
        await adminAuth.setCustomUserClaims(user.uid, {
          ...customClaims,
          verificationCode: null,
          codeExpires: null
        })
        return NextResponse.json(
          { success: false, message: 'Verification code has expired' },
          { status: 400 }
        )
      }

      // Verify code
      if (customClaims.verificationCode !== code) {
        return NextResponse.json(
          { success: false, message: 'Invalid verification code' },
          { status: 400 }
        )
      }

      // Generate JWT token
      const token = jwt.sign(
        { 
          email: email.toLowerCase(),
          uid: user.uid,
          iat: Math.floor(Date.now() / 1000)
        },
        process.env.JWT_SECRET!,
        { expiresIn: '60d' }
      )

      // Clear verification code from custom claims
      await adminAuth.setCustomUserClaims(user.uid, {
        ...customClaims,
        verificationCode: null,
        codeExpires: null,
        emailVerified: true
      })

      // Create response with cookie
      const response = NextResponse.json({
        success: true,
        message: 'Login successful',
        token
      })

      // Set HTTP-only cookie for 60 days
      response.cookies.set('auth-token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 60 * 24 * 60 * 60, // 60 days in seconds
        path: '/'
      })

      return response

    } catch (firebaseError) {
      console.error('Firebase verification error:', firebaseError)
      return NextResponse.json(
        { success: false, message: 'Failed to verify code' },
        { status: 500 }
      )
    }

  } catch (error) {
    console.error('Verification error:', error)
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    )
  }
}
