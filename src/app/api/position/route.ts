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
    // Check if officer is still on duty before returning cached position
    try {
      const statusResponse = await fetch(`${process.env.NODE_ENV === 'development' ? 'http://localhost:3002' : ''}/api/status`, {
        cache: 'no-store'
      })
      if (statusResponse.ok) {
        const statusData = await statusResponse.json()
        if (!statusData.onDuty) {
          // Officer is off duty - clear cache and return error
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

  // Before fetching new position, check if officer is on duty
  try {
    const statusResponse = await fetch(`${process.env.NODE_ENV === 'development' ? 'http://localhost:3002' : ''}/api/status`, {
      cache: 'no-store'
    })
    if (statusResponse.ok) {
      const statusData = await statusResponse.json()
      if (!statusData.onDuty) {
        // Officer is off duty - don't fetch position
        cachedPosition = null
        return NextResponse.json({ error: 'Off duty - no GPS tracking' }, { status: 423 })
      }
    }
  } catch (error) {
    // eslint-disable-next-line no-console
    console.warn('Could not verify duty status, proceeding with position fetch')
  }

  // Check if we should use fake data (for development/demo)
  const useFakeData = process.env.NODE_ENV === 'development' || 
                     !process.env.TRACCAR_BASE_URL || 
                     !process.env.TRACCAR_USERNAME || 
                     !process.env.TRACCAR_PASSWORD || 
                     !process.env.TRACCAR_DEVICE_ID

  if (useFakeData) {
    // Generate fake patrol position data for Dallas, TX area
    const fakeLocations = [
      { lat: 32.8442, lon: -96.7814, name: "Love Field Area" },           // N. of Lovers Ln, W. of Inwood
      { lat: 32.8402, lon: -96.7839, name: "Vanguard Crossing" },         // Between Lovers and Mockingbird
      { lat: 32.8365, lon: -96.7864, name: "Mockingbird Station" },       // Mockingbird Ln corridor
      { lat: 32.8328, lon: -96.7889, name: "Highland Park Beat" },        // S. of Mockingbird, E. of Lemmon
      { lat: 32.8291, lon: -96.7914, name: "Greenville Ave Patrol" },    // Near Greenville district
      { lat: 32.8254, lon: -96.7939, name: "Lower Greenville" },         // Deep Ellum/Lower Greenville area
      { lat: 32.8217, lon: -96.7964, name: "Knox Henderson District" },  // Knox/Henderson intersection
      { lat: 32.8385, lon: -96.7758, name: "Love Field Terminal" },      // Near Love Field airport
      { lat: 32.8355, lon: -96.7790, name: "Inwood Village" },           // Inwood shopping area
      { lat: 32.8421, lon: -96.7772, name: "Park Cities Patrol" }         // Highland Park/University Park
    ]

    // Randomly select a location
    const randomLocation = fakeLocations[Math.floor(Math.random() * fakeLocations.length)]
    
    // Add some realistic jitter (±0.001 degrees = ~100m radius)
    const jitterLat = randomLocation.lat + (Math.random() - 0.5) * 0.002
    const jitterLon = randomLocation.lon + (Math.random() - 0.5) * 0.002
    
    const positionData: PositionResponse = {
      lat: Number(jitterLat.toFixed(6)),
      lon: Number(jitterLon.toFixed(6)),
      at: new Date().toISOString()
    }

    // Cache the fake data
    cachedPosition = { data: positionData, timestamp: now }
    
    return NextResponse.json(positionData)
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
        const errorData = await response.json()
        errorDetails = errorData.message || JSON.stringify(errorData)
      } catch {
        errorDetails = await response.text() || errorDetails
      }

      // Map HTTP status codes to appropriate responses
      if (response.status === 401) {
        return NextResponse.json(
          { error: 'Traccar authentication failed', details: errorDetails },
          { status: 401 }
        )
      } else if (response.status === 403) {
        return NextResponse.json(
          { error: 'Traccar access forbidden', details: errorDetails },
          { status: 403 }
        )
      } else if (response.status === 404) {
        return NextResponse.json(
          { error: 'Traccar device not found', details: errorDetails },
          { status: 404 }
        )
      } else if (response.status >= 500) {
        return NextResponse.json(
          { error: 'Traccar server error', details: errorDetails },
          { status: 503 }
        )
      } else {
        return NextResponse.json(
          { error: 'Traccar request failed', details: errorDetails },
          { status: response.status }
        )
      }
    }

    const data: TraccarPosition[] = await response.json()

    // Validate response structure
    if (!Array.isArray(data) || data.length === 0) {
      return NextResponse.json(
        { error: 'No position data available' },
        { status: 404 }
      )
    }

    // Get the latest position (should be first in array based on 'latest=true')
    const latestPosition = data[0]

    // Validate position data
    if (!latestPosition || typeof latestPosition.latitude !== 'number' || typeof latestPosition.longitude !== 'number') {
      return NextResponse.json(
        { error: 'Invalid position data received' },
        { status: 502 }
      )
    }

    // Check if position is valid (not null/garbage)
    if (!latestPosition.valid || 
        latestPosition.latitude === 0 && latestPosition.longitude === 0 ||
        Math.abs(latestPosition.latitude) > 90 || 
        Math.abs(latestPosition.longitude) > 180) {
      return NextResponse.json(
        { error: 'Invalid GPS coordinates' },
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
