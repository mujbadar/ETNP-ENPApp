import { NextResponse } from 'next/server'

// TypeScript interfaces for Traccar API responses
interface TraccarPosition {
  id: number
  deviceId: number
  protocol: string
  deviceTime: string
  serverTime: string
  fixTime: string
  valid: boolean
  latitude: number
  longitude: number
  altitude: number
  speed: number
  course: number
  address: string
  accuracy: number
  network: unknown
  attributes: Record<string, unknown>
}

interface PositionResponse {
  lat: number
  lon: number
  at: string
}

interface ErrorResponse {
  error: string
  details?: string
}

// Cache for position data (in-memory cache with 2-minute expiration)
let cachedPosition: { data: PositionResponse; timestamp: number } | null = null
const CACHE_DURATION = 2 * 60 * 1000 // 2 minutes in milliseconds

/**
 * GET /api/position
 * Fetch latest patrol position from Traccar
 * Returns current GPS coordinates and timestamp
 */
export async function GET(): Promise<NextResponse<PositionResponse | ErrorResponse>> {
  // Check cache first
  const now = Date.now()
  if (cachedPosition && (now - cachedPosition.timestamp) < CACHE_DURATION) {
    // Check if officer is still on duty according to calendar before returning cached position
    try {
      const baseUrl = process.env.NODE_ENV === 'development' ? 'http://localhost:3000' : process.env.NEXT_PUBLIC_BASE_URL || 'https://etnp-enp-app.vercel.app'
      const statusResponse = await fetch(`${baseUrl}/api/status`, {
        cache: 'no-store'
      })
      if (statusResponse.ok) {
        const statusData = await statusResponse.json()
        if (!statusData.onDuty) {
          // Officer is off duty according to calendar - clear cache and return error
          cachedPosition = null
          return NextResponse.json({ error: 'Off duty - no GPS tracking' }, { status: 423 })
        }
      }
    } catch (error) {
      // eslint-disable-next-line no-console
      console.warn('Could not verify duty status, returning cached position')
    }

    // Return cached data but update timestamp to show cache expiration
    if (!cachedPosition) {
      return NextResponse.json({ error: 'Cache error' }, { status: 500 })
    }
    
    const cacheExpiryTime = cachedPosition.timestamp + CACHE_DURATION
    const cachedResponse = {
      ...cachedPosition.data,
      at: new Date(cacheExpiryTime).toISOString() // Show when cache expires
    }
    return NextResponse.json(cachedResponse)
  }

  // Before fetching new position, check if officer is on duty according to calendar
  try {
    const baseUrl = process.env.NODE_ENV === 'development' ? 'http://localhost:3000' : process.env.NEXT_PUBLIC_BASE_URL || 'https://etnp-enp-app.vercel.app'
    const statusResponse = await fetch(`${baseUrl}/api/status`, {
      cache: 'no-store'
    })
    if (statusResponse.ok) {
      const statusData = await statusResponse.json()
      if (!statusData.onDuty) {
        // Officer is off duty according to calendar - don't fetch position
        cachedPosition = null
        return NextResponse.json({ error: 'Off duty - no GPS tracking' }, { status: 423 })
      }
    }
  } catch (error) {
    // eslint-disable-next-line no-console
    console.warn('Could not verify duty status, proceeding with position fetch')
  }

  // Check if Traccar is properly configured
  if (!process.env.TRACCAR_BASE_URL || 
      !process.env.TRACCAR_USERNAME || 
      !process.env.TRACCAR_PASSWORD || 
      !process.env.TRACCAR_DEVICE_ID) {
    return NextResponse.json(
      { error: 'GPS tracking is not currently available' },
      { status: 503 }
    )
  }

  // Validate environment variables for real Traccar
  const baseUrl = process.env.TRACCAR_BASE_URL
  const username = process.env.TRACCAR_USERNAME
  const password = process.env.TRACCAR_PASSWORD
  const deviceId = process.env.TRACCAR_DEVICE_ID

  if (!baseUrl || !username || !password || !deviceId) {
    return NextResponse.json(
      { error: 'Missing Traccar server configuration' },
      { status: 500 }
    )
  }

  try {
    // Clean base URL (remove trailing slash)
    const cleanBaseUrl = baseUrl.replace(/\/$/, '')
    
    // Build Traccar API URL
    const params = new URLSearchParams({
      deviceId: deviceId,
      latest: 'true'
    })
    const url = `${cleanBaseUrl}/api/positions?${params}`

    // Create Basic Auth header
    const auth = Buffer.from(`${username}:${password}`).toString('base64')

    // Fetch position data with caching disabled
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Authorization': `Basic ${auth}`,
        'Accept': 'application/json',
        'User-Agent': 'ENP-Patrol/1.0'
      },
      cache: 'no-store',
      // Set reasonable timeout
      signal: AbortSignal.timeout(10000) // 10 second timeout
    })

    if (!response.ok) {
      let errorDetails = `HTTP ${response.status}`
      
      try {
        // Read the body as text first, then try to parse as JSON
        const responseText = await response.text()
        try {
          const errorData = JSON.parse(responseText)
          errorDetails = errorData.message || JSON.stringify(errorData)
        } catch {
          errorDetails = responseText || errorDetails
        }
      } catch {
        // If we can't read the response at all, use the default error details
      }

      // Map HTTP status codes to appropriate responses
      if (response.status === 401) {
        return NextResponse.json(
          { error: 'GPS tracking is temporarily unavailable' },
          { status: 401 }
        )
      } else if (response.status === 403) {
        return NextResponse.json(
          { error: 'GPS tracking is temporarily unavailable' },
          { status: 403 }
        )
      } else if (response.status === 404) {
        return NextResponse.json(
          { error: 'GPS device not found - tracking unavailable' },
          { status: 404 }
        )
      } else if (response.status >= 500) {
        return NextResponse.json(
          { error: 'GPS tracking server is temporarily down' },
          { status: 503 }
        )
      } else {
        return NextResponse.json(
          { error: 'GPS tracking is currently unavailable' },
          { status: response.status }
        )
      }
    }

    const data: TraccarPosition[] = await response.json()

    // Validate response structure
    if (!Array.isArray(data) || data.length === 0) {
      return NextResponse.json(
        { error: 'GPS location data is not currently available' },
        { status: 404 }
      )
    }

    // Get the latest position (should be first in array based on 'latest=true')
    const latestPosition = data[0]

    // Validate position data
    if (!latestPosition || typeof latestPosition.latitude !== 'number' || typeof latestPosition.longitude !== 'number') {
      return NextResponse.json(
        { error: 'GPS data is invalid - tracking unavailable' },
        { status: 502 }
      )
    }

    // Check if position is valid (not null/garbage)
    if (!latestPosition.valid || 
        latestPosition.latitude === 0 && latestPosition.longitude === 0 ||
        Math.abs(latestPosition.latitude) > 90 || 
        Math.abs(latestPosition.longitude) > 180) {
      return NextResponse.json(
        { error: 'GPS coordinates are invalid - tracking unavailable' },
        { status: 422 }
      )
    }

    // Build response with sanitized data
    const positionResponse: PositionResponse = {
      lat: Number(latestPosition.latitude.toFixed(6)),
      lon: Number(latestPosition.longitude.toFixed(6)),
      at: latestPosition.fixTime || latestPosition.serverTime || new Date().toISOString()
    }

    // Cache the real Traccar data
    cachedPosition = { data: positionResponse, timestamp: now }
    
    return NextResponse.json(positionResponse)

  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Position API error:', error)
    
    // Handle timeout and network errors
    if (error instanceof Error) {
      if (error.name === 'AbortError') {
        return NextResponse.json(
          { error: 'Traccar server timeout' },
          { status: 504 }
        )
      }
    }

    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    return NextResponse.json(
      { error: 'Failed to fetch position data', details: errorMessage },
      { status: 500 }
    )
  }
}
