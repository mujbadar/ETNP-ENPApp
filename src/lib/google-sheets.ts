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

// Cache for authorized emails
let authorizedEmailsCache: Set<string> | null = null
let cacheTimestamp: number = 0
const CACHE_DURATION = 5 * 60 * 1000 // 5 minutes - faster refresh for better security

/**
 * Fetch authorized emails from Google Spreadsheet
 * Reads Primary Contact Email (H) and Secondary Contact Email (I) starting at row 2
 */
export async function getAuthorizedEmails(): Promise<Set<string>> {
  // Check cache first
  const now = Date.now()
  if (authorizedEmailsCache && (now - cacheTimestamp) < CACHE_DURATION) {
    console.log(`Using cached emails (${authorizedEmailsCache.size} emails, age: ${Math.round((now - cacheTimestamp) / 1000)}s)`)
    return authorizedEmailsCache
  }

  try {
    const spreadsheetId = '1bylYIq5PA_ShPzBEUhIXEVkU7Z8JLEColZ0lP8ViohA'
    const range = 'Form Responses 1!H2:I' // Columns H (Primary Email) and I (Secondary Email) starting from row 2

    console.log('Fetching fresh emails from Google Sheets...')
    
    // Add timeout to prevent slow API calls from blocking login
    const fetchPromise = sheets.spreadsheets.values.get({
      spreadsheetId,
      range,
    })
    
    const timeoutPromise = new Promise<never>((_, reject) => {
      setTimeout(() => reject(new Error('Google Sheets API timeout after 5 seconds')), 5000)
    })
    
    const response = await Promise.race([fetchPromise, timeoutPromise]) as any

    const values = response.data.values || []
    const emails = new Set<string>()

    // Process each row in columns H and I
    for (const row of values) {
      // Check column H - Primary Contact Email (index 0)
      if (row[0] && typeof row[0] === 'string') {
        const email = row[0].trim().toLowerCase()
        // Basic email validation
        if (email.includes('@') && email.includes('.')) {
          emails.add(email)
        }
      }
      
      // Check column I - Secondary Contact Email (index 1)
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

    console.log(`✅ Fetched ${emails.size} authorized emails from spreadsheet`)
    return emails
  } catch (error) {
    console.error('❌ Error fetching authorized emails from spreadsheet:', error)
    
    // Return stale cache if available (graceful degradation)
    if (authorizedEmailsCache && authorizedEmailsCache.size > 0) {
      console.log(`⚠️  Using stale cache (${authorizedEmailsCache.size} emails) due to fetch error`)
      return authorizedEmailsCache
    }
    
    // No cache available, return empty set
    console.error('🚨 No cache available and fetch failed - returning empty set')
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

/**
 * Pre-warm the cache on server startup
 * Call this during Next.js initialization
 */
export function prewarmCache(): void {
  // Fire and forget - don't await
  getAuthorizedEmails().catch(err => {
    console.error('Failed to prewarm email cache:', err)
  })
}

// Pre-warm cache on module load
prewarmCache()
