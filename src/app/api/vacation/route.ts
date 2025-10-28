import { NextRequest, NextResponse } from 'next/server'
import { google } from 'googleapis'
import jwt from 'jsonwebtoken'
import { cookies } from 'next/headers'
import { getUserAddress, getUserName, getUserPhone } from '@/lib/google-sheets'

// Vacation calendar ID from the URL you provided
const VACATION_CALENDAR_ID = 'cedcde7f2a81cfb2766be4b30319134585f71cd8ec3b3a85be088874961ee1f426@group.calendar.google.com'

interface VacationRequest {
  startDate: string
  endDate: string
  startTime: string
  endTime: string
  name?: string
  phoneNumber?: string
  notes?: string
  userEmail: string
}

export async function POST(request: NextRequest) {
  try {
    // Verify authentication
    const cookieStore = cookies()
    const token = cookieStore.get('auth-token')?.value

    if (!token) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 })
    }

    let userEmail: string
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { email: string }
      userEmail = decoded.email
    } catch {
      return NextResponse.json({ error: 'Invalid authentication token' }, { status: 401 })
    }

    // Parse request body
    const body: VacationRequest = await request.json()
    
    // Validate required fields
    if (!body.startDate || !body.endDate) {
      return NextResponse.json({ 
        error: 'Missing required fields: startDate, endDate' 
      }, { status: 400 })
    }

    // Get user data from spreadsheet
    const userAddress = await getUserAddress(userEmail)
    const userName = await getUserName(userEmail)
    const userPhone = await getUserPhone(userEmail)

    if (!userAddress) {
      return NextResponse.json({ 
        error: 'Address not found for your email. Please contact administrator to update your information.' 
      }, { status: 400 })
    }

    // Use provided values or fall back to spreadsheet data
    const finalName = body.name || userName || userEmail
    const finalPhone = body.phoneNumber || userPhone

    // Create Google Calendar service
    const auth = new google.auth.GoogleAuth({
      credentials: {
        client_email: process.env.GOOGLE_CLIENT_EMAIL,
        private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
      },
      scopes: ['https://www.googleapis.com/auth/calendar']
    })

    const calendar = google.calendar({ version: 'v3', auth })

    // Construct start and end datetime
    const startDateTime = new Date(`${body.startDate}T${body.startTime}:00`)
    const endDateTime = new Date(`${body.endDate}T${body.endTime}:00`)

    // Validate date range
    if (endDateTime <= startDateTime) {
      return NextResponse.json({ 
        error: 'End date/time must be after start date/time' 
      }, { status: 400 })
    }

    // Create calendar event
    const event = {
      summary: `${userAddress}`,
      description: `
Resident: ${finalName} (${userEmail})
Contact Address: ${userAddress}
${finalPhone ? `Contact Phone: ${finalPhone}` : ''}
${body.notes ? `Notes: ${body.notes}` : ''}

This resident will be out of town during this period.
Use the contact information above for emergency reach-out.
      `.trim(),
      start: {
        dateTime: startDateTime.toISOString(),
        timeZone: 'America/Chicago'
      },
      end: {
        dateTime: endDateTime.toISOString(),
        timeZone: 'America/Chicago'
      },
      location: userAddress,
      attendees: [
        {
          email: userEmail,
          responseStatus: 'accepted'
        }
      ]
    }

    // Insert event into vacation calendar
    const response = await calendar.events.insert({
      calendarId: VACATION_CALENDAR_ID,
      requestBody: event,
      sendUpdates: 'all'
    })

    return NextResponse.json({
      success: true,
      eventId: response.data.id,
      eventLink: response.data.htmlLink,
      message: 'Vacation scheduled successfully'
    })

  } catch (error) {
    console.error('Vacation API error:', error)
    
    if (error instanceof Error) {
      // Handle specific Google Calendar API errors
      if (error.message.includes('notFound')) {
        return NextResponse.json({ 
          error: 'Vacation calendar not found. Please contact administrator.' 
        }, { status: 404 })
      }
      
      if (error.message.includes('forbidden')) {
        return NextResponse.json({ 
          error: 'Access denied to vacation calendar. Please contact administrator.' 
        }, { status: 403 })
      }
    }

    return NextResponse.json({ 
      error: 'Failed to schedule vacation. Please try again.' 
    }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  try {
    // Verify authentication
    const cookieStore = cookies()
    const token = cookieStore.get('auth-token')?.value

    if (!token) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 })
    }

    let userEmail: string
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { email: string }
      userEmail = decoded.email
    } catch {
      return NextResponse.json({ error: 'Invalid authentication token' }, { status: 401 })
    }

    // Create Google Calendar service
    const auth = new google.auth.GoogleAuth({
      credentials: {
        client_email: process.env.GOOGLE_CLIENT_EMAIL,
        private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
      },
      scopes: ['https://www.googleapis.com/auth/calendar.readonly']
    })

    const calendar = google.calendar({ version: 'v3', auth })

    // Get upcoming vacation events for this user
    const now = new Date()
    const response = await calendar.events.list({
      calendarId: VACATION_CALENDAR_ID,
      timeMin: now.toISOString(),
      maxResults: 10,
      singleEvents: true,
      orderBy: 'startTime',
      q: userEmail
    })

    const events = response.data.items || []
    
    return NextResponse.json({
      events: events.map(event => ({
        id: event.id,
        summary: event.summary,
        start: event.start?.dateTime || event.start?.date,
        end: event.end?.dateTime || event.end?.date,
        description: event.description,
        location: event.location
      }))
    })

  } catch (error) {
    console.error('Get vacation events error:', error)
    return NextResponse.json({ 
      error: 'Failed to fetch vacation events' 
    }, { status: 500 })
  }
}