import { NextRequest, NextResponse } from 'next/server'

// TypeScript interfaces for Google Calendar API responses
interface CalendarEvent {
  id: string
  summary: string
  start: {
    dateTime?: string
    date?: string
    timeZone?: string
  }
  end: {
    dateTime?: string
    date?: string
    timeZone?: string
  }
}

interface CalendarResponse {
  items: CalendarEvent[]
  kind: string
  etag: string
}

interface ScheduleEvent {
  id: string
  date: string
  startTime: string
  endTime: string
  officerName: string
  summary: string
  isSeasonal: boolean
}

interface ScheduleResponse {
  events: ScheduleEvent[]
}

interface ErrorResponse {
  error: string
  details?: string
}

/**
 * GET /api/schedule
 * Fetch calendar events for a specific date range
 * Query params: startDate (ISO string), endDate (ISO string)
 */
export async function GET(request: NextRequest): Promise<NextResponse<ScheduleResponse | ErrorResponse>> {
  // Validate environment variables
  const gcalId = process.env.GCAL_ID || process.env.NEXT_PUBLIC_GCAL_ID
  const apiKey = process.env.GCAL_API_KEY || process.env.NEXT_PUBLIC_GCAL_API_KEY

  if (!gcalId || !apiKey) {
    return NextResponse.json(
      { error: 'Missing Google Calendar configuration' },
      { status: 500 }
    )
  }

  try {
    // Get date range from query params
    const searchParams = request.nextUrl.searchParams
    const startDate = searchParams.get('startDate')
    const endDate = searchParams.get('endDate')

    if (!startDate || !endDate) {
      return NextResponse.json(
        { error: 'Missing required query parameters: startDate, endDate' },
        { status: 400 }
      )
    }

    // Build Google Calendar API URL
    const baseUrl = 'https://www.googleapis.com/calendar/v3/calendars'
    const params = new URLSearchParams({
      key: apiKey,
      timeMin: new Date(startDate).toISOString(),
      timeMax: new Date(endDate).toISOString(),
      singleEvents: 'true',
      orderBy: 'startTime',
      maxResults: '100'
    })

    const eventsUrl = `${baseUrl}/${encodeURIComponent(gcalId)}/events?${params}`

    // Fetch calendar events
    const response = await fetch(eventsUrl, {
      cache: 'no-store',
      headers: {
        'Accept': 'application/json',
      }
    })

    if (!response.ok) {
      const errorText = await response.text()
      throw new Error(`Calendar API error: ${response.status} - ${errorText}`)
    }

    const data: CalendarResponse = await response.json()
    const events = data.items || []

    // Transform events to our format
    const scheduleEvents: ScheduleEvent[] = events.map(event => {
      const startDateTime = parseEventDateTime(event.start)
      const endDateTime = parseEventDateTime(event.end)
      
      // Check if this is a seasonal shift
      const isSeasonal = event.summary.toUpperCase().startsWith('SEASONAL')
      
      // Extract officer name from event summary
      let officerName = 'Officer'
      // Remove "SEASONAL" prefix if present before parsing
      let summaryToParse = isSeasonal ? event.summary.replace(/^SEASONAL\s*/i, '') : event.summary
      
      const patterns = [
        /Officer\s+([A-Za-z\s]+)/i,
        /Patrol\s+[-–]\s*([A-Za-z\s]+)/i,
        /([A-Za-z\s]+)\s+Patrol/i,
        /Shift[:\s]+([A-Za-z\s]+)/i,
        /On\s+Duty\s+[-–]\s*Officer\s+([A-Za-z\s]+)/i,
        /On\s+Duty\s+[-–]\s*([A-Za-z\s]+)/i
      ]
      
      for (const pattern of patterns) {
        const match = summaryToParse.match(pattern)
        if (match && match[1]) {
          officerName = match[1].trim()
          break
        }
      }

      return {
        id: event.id,
        date: startDateTime.toISOString(),
        startTime: startDateTime.toLocaleTimeString([], { 
          hour: '2-digit', 
          minute: '2-digit',
          hour12: true 
        }),
        endTime: endDateTime.toLocaleTimeString([], { 
          hour: '2-digit', 
          minute: '2-digit',
          hour12: true 
        }),
        officerName,
        summary: event.summary,
        isSeasonal
      }
    })

    return NextResponse.json({ events: scheduleEvents })

  } catch (error) {
    console.error('Schedule API error:', error)
    
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    return NextResponse.json(
      { error: 'Failed to fetch schedule', details: errorMessage },
      { status: 500 }
    )
  }
}

/**
 * Parse event date/time from Google Calendar format
 * Handles both datetime and all-day events
 */
function parseEventDateTime(dateTime: CalendarEvent['start']): Date {
  if (dateTime.dateTime) {
    return new Date(dateTime.dateTime)
  } else if (dateTime.date) {
    return new Date(dateTime.date + 'T00:00:00')
  } else {
    throw new Error('Invalid event date format')
  }
}

