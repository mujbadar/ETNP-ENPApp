import { NextRequest, NextResponse } from 'next/server'
import { adminAuth } from '@/lib/firebase-admin'
import { isEmailAuthorized } from '@/lib/google-sheets'
import sgMail from '@sendgrid/mail'

// Set SendGrid API key
sgMail.setApiKey(process.env.SENDGRID_API_KEY!)

interface LoginRequest {
  email: string
}

interface LoginResponse {
  success: boolean
  message: string
}

/**
 * POST /api/auth/login
 * Generate 6-digit code and send via email using SendGrid
 */
export async function POST(request: NextRequest): Promise<NextResponse<LoginResponse>> {
  try {
    const body: LoginRequest = await request.json()
    const { email } = body

    if (!email || typeof email !== 'string') {
      return NextResponse.json(
        { success: false, message: 'Email is required' },
        { status: 400 }
      )
    }

    // Check if email is authorized (from Google Spreadsheet)
    const isAuthorized = await isEmailAuthorized(email)
    if (!isAuthorized) {
      return NextResponse.json(
        { success: false, message: 'Email not authorized' },
        { status: 403 }
      )
    }

    // Generate 6-digit verification code
    const code = Math.floor(100000 + Math.random() * 900000).toString()
    const expires = Date.now() + 10 * 60 * 1000 // 10 minutes

    // Store verification code in Firebase Auth custom claims
    try {
      // Create or get user in Firebase Auth
      let user
      try {
        user = await adminAuth.getUserByEmail(email.toLowerCase())
      } catch (error) {
        // User doesn't exist, create them
        user = await adminAuth.createUser({
          email: email.toLowerCase(),
          emailVerified: false
        })
      }

      // Set custom claims with verification code
      await adminAuth.setCustomUserClaims(user.uid, {
        verificationCode: code,
        codeExpires: expires,
        email: email.toLowerCase()
      })

      // Send email with verification code (non-blocking)
      sendVerificationEmail(email, code).catch((emailError) => {
        console.error('SendGrid error:', emailError)
      })
      
      console.log(`Verification code sent to ${email}: ${code}`)
      
      return NextResponse.json({
        success: true,
        message: 'Verification code sent to your email'
      })

    } catch (firebaseError) {
      console.error('Firebase error:', firebaseError)
      return NextResponse.json(
        { success: false, message: 'Failed to process authentication request' },
        { status: 500 }
      )
    }

  } catch (error) {
    console.error('Login error:', error)
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    )
  }
}

/**
 * Send verification email using SendGrid
 */
async function sendVerificationEmail(email: string, code: string): Promise<void> {
  const msg = {
    to: email,
    from: {
      email: process.env.SENDGRID_FROM_EMAIL!,
      name: 'ENP Patrol System'
    },
    replyTo: process.env.SENDGRID_FROM_EMAIL!,
    subject: 'Your ENP Patrol Login Code',
    text: `Your ENP Patrol verification code is: ${code}\n\nThis code expires in 10 minutes.\n\nIf you didn't request this code, please ignore this email.`,
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>ENP Patrol Login Code</title>
      </head>
      <body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f8f9fa;">
        <div style="max-width: 600px; margin: 0 auto; background-color: white; padding: 20px;">
          <div style="text-align: center; margin-bottom: 30px; border-bottom: 1px solid #e5e7eb; padding-bottom: 20px;">
            <h1 style="color: #2563eb; margin: 0; font-size: 24px;">ENP Patrol</h1>
            <p style="color: #6b7280; margin: 5px 0 0; font-size: 14px;">Neighborhood Security System</p>
          </div>
          
          <div style="background-color: #f8fafc; padding: 30px; border-radius: 8px; text-align: center; margin-bottom: 30px;">
            <h2 style="color: #1f2937; margin: 0 0 20px; font-size: 20px;">Your Login Verification Code</h2>
            <div style="background-color: white; padding: 20px; border-radius: 8px; display: inline-block; border: 2px solid #e5e7eb; margin-bottom: 15px;">
              <span style="font-size: 32px; font-weight: bold; color: #2563eb; letter-spacing: 4px; font-family: monospace;">${code}</span>
            </div>
            <p style="color: #6b7280; margin: 0; font-size: 14px;">This code will expire in 10 minutes</p>
          </div>
          
          <div style="text-align: center; color: #6b7280; font-size: 14px; line-height: 1.5;">
            <p style="margin: 0 0 10px;">If you didn't request this code, please ignore this email.</p>
            <p style="margin: 0;">For security reasons, do not share this code with anyone.</p>
          </div>
          
          <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb; color: #9ca3af; font-size: 12px;">
            <p style="margin: 0;">This is an automated message from ENP Patrol System</p>
          </div>
        </div>
      </body>
      </html>
    `
  }

  await sgMail.send(msg)
}

