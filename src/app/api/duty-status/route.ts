import { NextResponse } from 'next/server'
import { getGeofenceStatus, hasLeftHomeBase } from '@/lib/geofencing'

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

interface CalendarStatus {
  onDuty: boolean
  currentEventEnd?: string
  nextEventStart?: string
  officerName?: string
  calendarName?: string
}

interface LocationStatus {
  lat: number
  lon: number
  at: string
}

interface CombinedDutyStatus extends CalendarStatus {
  actuallyOnDuty: boolean
  calendarOnDuty: boolean
  locationStatus: {
    hasLeftHomeBase: boolean
    distanceFromBase: number
    status: 'at_base' | 'in_field'
  } | null
  dutyStartCondition: 'calendar_and_location' | 'calendar_only' | 'off_duty'
  statusMessage: string
}

/**
 * Get GPS position directly from Traccar (to avoid circular dependency with /api/position)
 */
async function getTraccarPosition(): Promise<LocationStatus | null> {
  const baseUrl = process.env.TRACCAR_BASE_URL
  const username = process.env.TRACCAR_USERNAME
  const password = process.env.TRACCAR_PASSWORD
  const deviceId = process.env.TRACCAR_DEVICE_ID

  if (!baseUrl || !username || !password || !deviceId) {
    return null
  }

  try {
    const cleanBaseUrl = baseUrl.replace(/\/$/, '')
    const params = new URLSearchParams({
      deviceId: deviceId,
      latest: 'true'
    })
    const url = `${cleanBaseUrl}/api/positions?${params}`

    const auth = Buffer.from(`${username}:${password}`).toString('base64')

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Authorization': `Basic ${auth}`,
        'Accept': 'application/json',
        'User-Agent': 'ENP-Patrol/1.0'
      },
      cache: 'no-store',
      signal: AbortSignal.timeout(5000)
    })

    if (!response.ok) {
      return null
    }

    const data: TraccarPosition[] = await response.json()

    if (!Array.isArray(data) || data.length === 0) {
      return null
    }

    const latestPosition = data[0]

    if (!latestPosition.valid || 
        latestPosition.latitude === 0 && latestPosition.longitude === 0) {
      return null
    }

    return {
      lat: Number(latestPosition.latitude.toFixed(6)),
      lon: Number(latestPosition.longitude.toFixed(6)),
      at: latestPosition.fixTime || latestPosition.serverTime || new Date().toISOString()
    }
  } catch (error) {
    return null
  }
}

/**
 * GET /api/duty-status
 * Combined duty status using calendar + geofencing
 * Officer is truly "on duty" when calendar shows on-duty AND they've left home base
 */
export async function GET(): Promise<NextResponse<CombinedDutyStatus>> {
  try {
    // Get calendar status
    const calendarResponse = await fetch(`${process.env.NODE_ENV === 'development' ? 'http://localhost:3000' : ''}/api/status`, {
      cache: 'no-store'
    })
    
    if (!calendarResponse.ok) {
      return NextResponse.json({
        onDuty: false,
        actuallyOnDuty: false,
        calendarOnDuty: false,
        locationStatus: null,
        dutyStartCondition: 'off_duty',
        statusMessage: 'Unable to verify calendar status'
      } as CombinedDutyStatus, { status: 500 })
    }

    const calendarStatus: CalendarStatus = await calendarResponse.json()

    // If calendar shows off duty, no need to check location
    if (!calendarStatus.onDuty) {
      return NextResponse.json({
        ...calendarStatus,
        actuallyOnDuty: false,
        calendarOnDuty: false,
        locationStatus: null,
        dutyStartCondition: 'off_duty',
        statusMessage: 'Off duty according to schedule'
      })
    }

    // Calendar shows on duty - now check location directly from Traccar
    try {
      // Get GPS position directly from Traccar (avoid circular dependency)
      const position = await getTraccarPosition()
      
      if (!position) {
        // Calendar says on duty but can't get location - assume on duty for safety
        return NextResponse.json({
          ...calendarStatus,
          actuallyOnDuty: true,
          calendarOnDuty: true,
          locationStatus: null,
          dutyStartCondition: 'calendar_only',
          statusMessage: 'On duty (GPS unavailable - using calendar only)'
        })
      }

      const geofenceStatus = getGeofenceStatus(position)
      const hasLeft = hasLeftHomeBase(position)

      // Determine actual duty status
      const actuallyOnDuty = calendarStatus.onDuty && hasLeft

      return NextResponse.json({
        ...calendarStatus,
        actuallyOnDuty,
        calendarOnDuty: true,
        locationStatus: {
          hasLeftHomeBase: hasLeft,
          distanceFromBase: geofenceStatus.distance,
          status: geofenceStatus.status
        },
        dutyStartCondition: 'calendar_and_location',
        statusMessage: hasLeft ? 'On duty' : 'Scheduled but at base'
      })

    } catch (locationError) {
      // Calendar says on duty but location check failed - assume on duty for safety
      return NextResponse.json({
        ...calendarStatus,
        actuallyOnDuty: true,
        calendarOnDuty: true,
        locationStatus: null,
        dutyStartCondition: 'calendar_only',
        statusMessage: 'On duty (location check failed - using calendar only)'
      })
    }

  } catch (error) {
    console.error('Combined duty status error:', error)
    
    return NextResponse.json({
      onDuty: false,
      actuallyOnDuty: false,
      calendarOnDuty: false,
      locationStatus: null,
      dutyStartCondition: 'off_duty',
      statusMessage: 'System error - unable to determine duty status'
    } as CombinedDutyStatus, { status: 500 })
  }
}