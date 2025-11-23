import { google } from 'googleapis'

// Initialize Google Calendar API
const auth = new google.auth.GoogleAuth({
  credentials: {
    client_email: process.env.GOOGLE_CLIENT_EMAIL,
    private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
  },
  scopes: [
    'https://www.googleapis.com/auth/calendar',
    'https://www.googleapis.com/auth/calendar.events',
  ],
})

const calendar = google.calendar({ version: 'v3', auth })

// Vacation calendar ID
const VACATION_CALENDAR_ID = 'cedcde7f2a81cfb2766be4b3031913485f71cd8ec3b3a85be08874961ee1f426@group.calendar.google.com'

interface VacationEventParams {
  firstName: string
  lastName: string
  address: string
  startDate: string // ISO date string (YYYY-MM-DD)
  endDate: string   // ISO date string (YYYY-MM-DD)
  primaryContact: string
  secondaryContact?: string
}

/**
 * Create an all-day vacation event on the Google Calendar
 * @param params - Vacation event parameters
 * @returns The created event
 */
export async function createVacationEvent(params: VacationEventParams) {
  const { firstName, lastName, address, startDate, endDate, primaryContact, secondaryContact } = params

  try {
    // Validate dates
    const start = new Date(startDate)
    const end = new Date(endDate)
    
    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
      throw new Error('Invalid date format')
    }

    if (end < start) {
      throw new Error('End date must be after start date')
    }

    // For all-day events, we need to add one day to the end date
    // because Google Calendar uses exclusive end dates for all-day events
    const endDatePlusOne = new Date(end)
    endDatePlusOne.setDate(endDatePlusOne.getDate() + 1)

    const fullName = `${firstName} ${lastName}`

    // Build description with contact information
    let description = `Vacation Watch Request\n\n`
    description += `📍 Address: ${address}\n`
    description += `👤 Resident: ${fullName}\n`
    description += `📅 Dates: ${startDate} to ${endDate}\n\n`
    description += `📞 Contact Information:\n`
    description += `Primary Phone: ${primaryContact}\n`
    if (secondaryContact) {
      description += `Secondary Phone: ${secondaryContact}\n`
    }
    description += `\n🚓 Officers: Please keep an eye on this property during patrol shifts.`

    const event = {
      summary: `🏖️ Vacation Watch - ${address}`,
      description,
      start: {
        date: startDate, // Format: YYYY-MM-DD for all-day events
      },
      end: {
        date: endDatePlusOne.toISOString().split('T')[0], // Format: YYYY-MM-DD
      },
      colorId: '11', // Red color to make it stand out
    }

    console.log('Creating calendar event:', event)

    const response = await calendar.events.insert({
      calendarId: VACATION_CALENDAR_ID,
      requestBody: event,
    })

    console.log('✅ Calendar event created:', response.data.id)
    return response.data
  } catch (error) {
    console.error('❌ Error creating calendar event:', error)
    throw error
  }
}

/**
 * List upcoming vacation events
 * @param maxResults - Maximum number of events to return
 * @returns List of upcoming vacation events
 */
export async function listVacationEvents(maxResults: number = 10) {
  try {
    const response = await calendar.events.list({
      calendarId: VACATION_CALENDAR_ID,
      timeMin: new Date().toISOString(),
      maxResults,
      singleEvents: true,
      orderBy: 'startTime',
    })

    return response.data.items || []
  } catch (error) {
    console.error('❌ Error listing calendar events:', error)
    throw error
  }
}

/**
 * Delete a vacation event
 * @param eventId - The ID of the event to delete
 */
export async function deleteVacationEvent(eventId: string) {
  try {
    await calendar.events.delete({
      calendarId: VACATION_CALENDAR_ID,
      eventId,
    })

    console.log('✅ Calendar event deleted:', eventId)
  } catch (error) {
    console.error('❌ Error deleting calendar event:', error)
    throw error
  }
}

