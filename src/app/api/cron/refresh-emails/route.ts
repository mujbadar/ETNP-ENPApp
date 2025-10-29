import { NextRequest, NextResponse } from 'next/server'
import { getAuthorizedEmails } from '@/lib/google-sheets'

// Force dynamic to prevent caching
export const dynamic = 'force-dynamic'

/**
 * GET /api/cron/refresh-emails
 * Cron job to refresh the authorized emails cache
 * Runs once daily at 6 AM UTC on Vercel Hobby plan
 * 
 * SECURITY: Protected by Vercel Cron Secret or Authorization header
 */
export async function GET(request: NextRequest) {
  // Security: Verify the request is from Vercel Cron or an authorized source
  const authHeader = request.headers.get('authorization')
  const cronSecret = process.env.CRON_SECRET
  
  if (!cronSecret) {
    console.error('🚨 CRON_SECRET environment variable not set')
    return NextResponse.json(
      { success: false, message: 'Server configuration error' },
      { status: 500 }
    )
  }
  
  // Check if request has valid authorization
  // Vercel Cron sends: Authorization: Bearer <CRON_SECRET>
  const expectedAuth = `Bearer ${cronSecret}`
  
  if (authHeader !== expectedAuth) {
    console.warn('⚠️  Unauthorized cron request attempt')
    return NextResponse.json(
      { success: false, message: 'Unauthorized' },
      { status: 401 }
    )
  }
  
  try {
    const startTime = Date.now()
    
    // Refresh the cache by fetching authorized emails
    const emails = await getAuthorizedEmails()
    
    const duration = Date.now() - startTime
    
    console.log(`✅ Email cache refreshed: ${emails.size} emails loaded in ${duration}ms`)
    
    return NextResponse.json({
      success: true,
      message: 'Email cache refreshed successfully',
      emailCount: emails.size,
      durationMs: duration,
      timestamp: new Date().toISOString()
    })
  } catch (error) {
    console.error('❌ Failed to refresh email cache:', error)
    
    return NextResponse.json(
      {
        success: false,
        message: 'Failed to refresh email cache',
        error: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    )
  }
}

