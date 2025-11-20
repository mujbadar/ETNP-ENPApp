import { NextResponse } from 'next/server'

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

interface CalendarMetadata {
  id: string
  summary: string
  description?: string
}

interface StatusResponse {
  onDuty: boolean
  currentEventEnd?: string
  nextEventStart?: string
  officerName?: string
  calendarName?: string
}

interface ErrorResponse {
  error: string
  details?: string
}

// Cache for status data (in-memory cache with 1-minute expiration)
let cachedStatus: { data: StatusResponse; timestamp: number } | null = null
const STATUS_CACHE_DURATION = 1 * 60 * 1000 // 1 minute in milliseconds

/**
 * GET /api/status
 * Fetch duty status from Google Calendar
 * Returns current duty status and timing information
 */
export async function GET(): Promise<NextResponse<StatusResponse | ErrorResponse>> {
  // Check cache first
  const now = Date.now()
  if (cachedStatus && (now - cachedStatus.timestamp) < STATUS_CACHE_DURATION) {
    return NextResponse.json(cachedStatus.data)
  }

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
    // Calculate time window: 6 hours ago to 14 days in future (to catch weekend shifts)
    const timeWindowStart = new Date(now - 6 * 60 * 60 * 1000)
    const timeWindowEnd = new Date(now + 14 * 24 * 60 * 60 * 1000)

    // Build Google Calendar API URL
    const baseUrl = 'https://www.googleapis.com/calendar/v3/calendars'
    const params = new URLSearchParams({
      key: apiKey,
      timeMin: timeWindowStart.toISOString(),
      timeMax: timeWindowEnd.toISOString(),
      singleEvents: 'true',
      orderBy: 'startTime',
      maxResults: '50'
    })

    const eventsUrl = `${baseUrl}/${encodeURIComponent(gcalId)}/events?${params}`

    // Fetch calendar events with caching disabled
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

    // Fetch calendar metadata to understand better
    const calendarsUrl = `${baseUrl}/${encodeURIComponent(gcalId)}?key=${apiKey}`
    const calendarResponse = await fetch(calendarsUrl, {
      cache: 'no-store',
      headers: {
        'Accept': 'application/json',
      }
    })

    let calendarMetadata: CalendarMetadata | null = null
    if (calendarResponse.ok) {
      calendarMetadata = await calendarResponse.json()
    }

    // Extract officer name from various sources
    let officerName: string | undefined
    let calendarName: string | undefined

    // Try to extract officer name from calendar summary/description
    if (calendarMetadata) {
      calendarName = calendarMetadata.summary
      
      // Extract officer name from calendar summary (e.g., "Officer Smith Patrol Schedule")
      const summaryMatch = calendarMetadata.summary.match(/(?:Officer\s+|Patrol\s+)?(.+?)(?:\s+(?:Schedule|Shifts?|Calendar|Patrol))?/i)
      if (summaryMatch && summaryMatch[1]) {
        officerName = summaryMatch[1].trim()
      }

      // Try description if summary didn't work
      if (!officerName && calendarMetadata.description) {
        const descMatch = calendarMetadata.description.match(/Officer[:\s]+([A-Za-z\s]+)/i)
        if (descMatch) {
          officerName = descMatch[1].trim()
        }
      }
    }

    // Determine current duty status
    const currentEvent = events.find(event => {
      const eventStart = parseEventDateTime(event.start)
      const eventEnd = parseEventDateTime(event.end)
      return new Date(now) >= eventStart && new Date(now) <= eventEnd
    })

    const onDuty = !!currentEvent

    // Try to extract officer name from current event FIRST, then calendar metadata
    if (currentEvent && currentEvent.summary) {
      // Various patterns for extracting officer name from current event titles
      const patterns = [
        /Officer\s+([A-Za-z\s]+)/i,
        /Patrol\s+[-–]\s*([A-Za-z\s]+)/i,
        /([A-Za-z\s]+)\s+Patrol/i,
        /Shift[:\s]+([A-Za-z\s]+)/i,
        /On\s+Duty\s+[-–]\s*Officer\s+([A-Za-z\s]+)/i,
        /On\s+Duty\s+[-–]\s*([A-Za-z\s]+)/i
      ]
      
      for (const pattern of patterns) {
        const match = currentEvent.summary.match(pattern)
        if (match && match[1]) {
          officerName = match[1].trim()
          break
        }
      }
    }
    
    // If still no officer name, try upcoming events or calendar metadata
    if (!officerName && events.length > 0) {
      const relevantEvent = events.find(event => parseEventDateTime(event.start) > new Date(now))
      if (relevantEvent && relevantEvent.summary) {
        const patterns = [
          /Officer\s+([A-Za-z\s]+)/i,
          /Patrol\s+[-–]\s*([A-Za-z\s]+)/i,
          /([A-Za-z\s]+)\s+Patrol/i,
          /Shift[:\s]+([A-Za-z\s]+)/i,
          /On\s+Duty\s+[-–]\s*Officer\s+([A-Za-z\s]+)/i,
          /On\s+Duty\s+[-–]\s*([A-Za-z\s]+)/i
        ]
        
        for (const pattern of patterns) {
          const match = relevantEvent.summary.match(pattern)
          if (match && match[1]) {
            officerName = match[1].trim()
            break
          }
        }
      }
    }
    // Find next upcoming event if not currently on duty
    let nextEvent: CalendarEvent | undefined
    if (!onDuty) {
      nextEvent = events
        .filter(event => parseEventDateTime(event.start) > new Date(now))
        .sort((a, b) => 
          parseEventDateTime(a.start).getTime() - parseEventDateTime(b.start).getTime()
        )[0]
    }

    // Build response
    const statusResponse: StatusResponse = {
      onDuty,
      currentEventEnd: currentEvent ? serializeEventDateTime(currentEvent.end) : undefined,
      nextEventStart: nextEvent ? serializeEventDateTime(nextEvent.start) : undefined,
      officerName,
      calendarName
    }

    // Cache the status data
    cachedStatus = { data: statusResponse, timestamp: now }
    return NextResponse.json(statusResponse)

  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Status API error:', error)
    
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    return NextResponse.json(
      { error: 'Failed to fetch duty status', details: errorMessage },
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
    // Specific datetime event
    return new Date(dateTime.dateTime)
  } else if (dateTime.date) {
    // All-day event (use start of day in local timezone)
    return new Date(dateTime.date + 'T00:00:00')
  } else {
    throw new Error('Invalid event date format')
  }
}

/**
 * Serialize event date/time back to ISO string format
 */
function serializeEventDateTime(dateTime: CalendarEvent['start'] | CalendarEvent['end']): string {
  if ('dateTime' in dateTime && dateTime.dateTime) {
    return dateTime.dateTime
  } else if ('date' in dateTime && dateTime.date) {
    // For all-day events, use actual date instead of 11:59:59 PM
    return dateTime.date
  } else {
    throw new Error('Invalid event date format')
  }
}