import { google } from 'googleapis'

// Initialize Google Sheets API
const auth = new google.auth.GoogleAuth({
  credentials: {
    client_email: process.env.GOOGLE_CLIENT_EMAIL,
    private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
  },
  scopes: ['https://www.googleapis.com/auth/spreadsheets.readonly'],
})

const sheets = google.sheets({ version: 'v4', auth })

// Cache for authorized emails (refresh every 30 minutes)
let authorizedEmailsCache: Set<string> | null = null
let cacheTimestamp: number = 0
const CACHE_DURATION = 30 * 60 * 1000 // 30 minutes

/**
 * Fetch authorized emails from Google Spreadsheet
 * Reads from column B starting at row 2
 */
export async function getAuthorizedEmails(): Promise<Set<string>> {
  // Check cache first
  const now = Date.now()
  if (authorizedEmailsCache && (now - cacheTimestamp) < CACHE_DURATION) {
    return authorizedEmailsCache
  }

  try {
    const spreadsheetId = '1bylYIq5PA_ShPzBEUhIXEVkU7Z8JLEColZ0lP8ViohA'
    const range = 'Form Responses 1!G2:H' // Columns G and H starting from row 2

    const response = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range,
    })

    const values = response.data.values || []
    const emails = new Set<string>()

    // Process each row in columns G and H
    for (const row of values) {
      // Check column G (index 0)
      if (row[0] && typeof row[0] === 'string') {
        const email = row[0].trim().toLowerCase()
        // Basic email validation
        if (email.includes('@') && email.includes('.')) {
          emails.add(email)
        }
      }
      
      // Check column H (index 1)
      if (row[1] && typeof row[1] === 'string') {
        const email = row[1].trim().toLowerCase()
        // Basic email validation
        if (email.includes('@') && email.includes('.')) {
          emails.add(email)
        }
      }
    }

    // Update cache
    authorizedEmailsCache = emails
    cacheTimestamp = now

    console.log(`Fetched ${emails.size} authorized emails from spreadsheet`)
    return emails
  } catch (error) {
    console.error('Error fetching authorized emails from spreadsheet:', error)  
    // Return fallback emails if spreadsheet fails
    return new Set([])
  }
}

/**
 * Check if an email is authorized
 */
export async function isEmailAuthorized(email: string): Promise<boolean> {
  const authorizedEmails = await getAuthorizedEmails()
  return authorizedEmails.has(email.toLowerCase())
}
