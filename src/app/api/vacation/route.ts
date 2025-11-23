import { NextRequest, NextResponse } from 'next/server'
import { createVacationEvent } from '@/lib/google-calendar'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { firstName, lastName, address, startDate, endDate, primaryContact, secondaryContact } = body

    // Validate required fields
    if (!firstName || !lastName || !address || !startDate || !endDate || !primaryContact) {
      return NextResponse.json(
        { error: 'Missing required fields: firstName, lastName, address, startDate, endDate, and primaryContact are required' },
        { status: 400 }
      )
    }

    // Validate firstName is not empty
    if (typeof firstName !== 'string' || firstName.trim().length === 0) {
      return NextResponse.json(
        { error: 'First name must be a non-empty string' },
        { status: 400 }
      )
    }

    // Validate lastName is not empty
    if (typeof lastName !== 'string' || lastName.trim().length === 0) {
      return NextResponse.json(
        { error: 'Last name must be a non-empty string' },
        { status: 400 }
      )
    }

    // Validate address is not empty
    if (typeof address !== 'string' || address.trim().length === 0) {
      return NextResponse.json(
        { error: 'Address must be a non-empty string' },
        { status: 400 }
      )
    }

    // Validate primary contact is not empty
    if (typeof primaryContact !== 'string' || primaryContact.trim().length === 0) {
      return NextResponse.json(
        { error: 'Primary phone number must be a non-empty string' },
        { status: 400 }
      )
    }

    // Validate secondary contact if provided
    if (secondaryContact && (typeof secondaryContact !== 'string' || secondaryContact.trim().length === 0)) {
      return NextResponse.json(
        { error: 'Secondary phone number must be a valid string if provided' },
        { status: 400 }
      )
    }

    // Validate dates
    const start = new Date(startDate)
    const end = new Date(endDate)

    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
      return NextResponse.json(
        { error: 'Invalid date format. Please use YYYY-MM-DD format' },
        { status: 400 }
      )
    }

    if (end < start) {
      return NextResponse.json(
        { error: 'End date must be on or after start date' },
        { status: 400 }
      )
    }

    // Create the calendar event
    const event = await createVacationEvent({
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      address: address.trim(),
      startDate,
      endDate,
      primaryContact: primaryContact.trim(),
      secondaryContact: secondaryContact ? secondaryContact.trim() : undefined,
    })

    return NextResponse.json(
      {
        success: true,
        message: 'Vacation notice added to calendar successfully',
        eventId: event.id,
        eventLink: event.htmlLink,
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('Error in vacation API route:', error)
    
    // Handle specific Google API errors
    if (error instanceof Error) {
      if (error.message.includes('Invalid Credentials')) {
        return NextResponse.json(
          { error: 'Calendar service is not properly configured' },
          { status: 500 }
        )
      }
      
      if (error.message.includes('quota')) {
        return NextResponse.json(
          { error: 'Calendar service is temporarily unavailable' },
          { status: 503 }
        )
      }

      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      )
    }

    return NextResponse.json(
      { error: 'An unexpected error occurred' },
      { status: 500 }
    )
  }
}

// Optional: GET endpoint to list vacation events
export async function GET() {
  return NextResponse.json(
    { 
      message: 'Use POST to submit vacation notices',
      endpoints: {
        POST: '/api/vacation - Submit a vacation notice'
      }
    },
    { status: 200 }
  )
}

