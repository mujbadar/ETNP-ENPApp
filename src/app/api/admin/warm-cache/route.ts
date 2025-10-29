import { NextRequest, NextResponse } from 'next/server'
import { getAuthorizedEmails } from '@/lib/google-sheets'

// Force dynamic to prevent caching
export const dynamic = 'force-dynamic'

/**
 * POST /api/admin/warm-cache
 * Manually warm the email cache (useful when adding new members)
 * 
 * SECURITY: Protected by the same CRON_SECRET
 */
export async function POST(request: NextRequest) {
  // Security: Verify the request is authorized
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
  const expectedAuth = `Bearer ${cronSecret}`
  
  if (authHeader !== expectedAuth) {
    console.warn('⚠️  Unauthorized cache warm request attempt')
    return NextResponse.json(
      { success: false, message: 'Unauthorized' },
      { status: 401 }
    )
  }
  
  try {
    const startTime = Date.now()
    
    // Force refresh the cache by fetching authorized emails
    const emails = await getAuthorizedEmails()
    
    const duration = Date.now() - startTime
    
    console.log(`✅ Email cache manually warmed: ${emails.size} emails loaded in ${duration}ms`)
    
    return NextResponse.json({
      success: true,
      message: 'Cache warmed successfully',
      emailCount: emails.size,
      durationMs: duration,
      timestamp: new Date().toISOString()
    })
  } catch (error) {
    console.error('❌ Failed to warm email cache:', error)
    
    return NextResponse.json(
      {
        success: false,
        message: 'Failed to warm email cache',
        error: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    )
  }
}

