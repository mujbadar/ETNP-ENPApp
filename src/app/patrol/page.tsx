'use client'

import { useEffect, useRef, useState } from 'react'
import maplibregl from 'maplibre-gl'
import 'maplibre-gl/dist/maplibre-gl.css'

// TypeScript interfaces
interface DutyStatus {
  onDuty: boolean
  currentEventEnd?: string
  nextEventStart?: string
  officerName?: string
  calendarName?: string
  actuallyOnDuty?: boolean
  calendarOnDuty?: boolean
  locationStatus?: {
    hasLeftHomeBase: boolean
    distanceFromBase: number
    status: 'at_base' | 'in_field'
  } | null
  dutyStartCondition?: 'calendar_and_location' | 'calendar_only' | 'off_duty'
  statusMessage?: string
}

interface PatrolPosition {
  lat: number
  lon: number
  at: string
}

interface ApiError {
  error: string
  details?: string
}

/**
 * Main page component for ENP Patrol
 * Displays duty status, patrol location, and action buttons
 */
export default function ENPPatrolPage() {
  // State management
  const [status, setStatus] = useState<DutyStatus>({
    onDuty: false,
    currentEventEnd: undefined,
    nextEventStart: undefined
  })
  
  const [position, setPosition] = useState<PatrolPosition | null>(null)
  const [lastUpdate, setLastUpdate] = useState<string>('')
  const [nextUpdate, setNextUpdate] = useState<string>('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [showCalendar, setShowCalendar] = useState(false)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [userEmail, setUserEmail] = useState<string | null>(null)
  
  // Map references
  const mapContainer = useRef<HTMLDivElement>(null)
  const mapRef = useRef<maplibregl.Map | null>(null)
  const markerRef = useRef<maplibregl.Marker | null>(null)

  // Get environment variables for client-side use
  const patrolPhone = process.env.NEXT_PUBLIC_PATROL_PHONE || '+1234567890'
  const gcalId = process.env.NEXT_PUBLIC_GCAL_ID

  /**
   * Fetch combined duty status (calendar + geofencing) via our API
   */
  const fetchStatus = async (): Promise<void> => {
    try {
      const response = await fetch('/api/duty-status', { 
        cache: 'no-store',
        headers: {
          'Accept': 'application/json'
        }
      })
      
      if (!response.ok) {
        const errorData: ApiError = await response.json()
        throw new Error(errorData.error || `HTTP ${response.status}`)
      }
      
      const data: DutyStatus = await response.json()
      setStatus(data)
      setError(null)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch status'


      setError(errorMessage)
    }
  }

  /**
   * Fetch patrol position from Traccar via our API
   */
  const fetchPosition = async (): Promise<void> => {
    // Only fetch position if officer is actually on duty (calendar + geofencing)
    if (!status.actuallyOnDuty) {
      setPosition(null)
      setLastUpdate('')
      setNextUpdate('')
      return
    }

    try {
      const response = await fetch('/api/position', { 
        cache: 'no-store',
        headers: {
          'Accept': 'application/json'
        }
      })
      
      if (!response.ok) {
        const errorData: ApiError = await response.json()
        throw new Error(errorData.error || `HTTP ${response.status}`)
      }
      
      const data: PatrolPosition = await response.json()
      setPosition(data)
      
      // Calculate cache-aware update times based on actual data fetch time
      const dataTime = new Date(data.at)
      setLastUpdate(dataTime.toLocaleTimeString())
      
      // Next position update will be 2 minutes from when this data was fetched
      const nextPositionUpdate = new Date(dataTime.getTime() + 2 * 60 * 1000)
      setNextUpdate(nextPositionUpdate.toLocaleTimeString())
      
      setError(null)
      
      // Update map marker if position is valid
      updateMapMarker(data)
      
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch position'
      // Don't overwrite position error with status error
      if (!error) setError(errorMessage)
    }
  }

  /**
   * Initialize MapLibre map with latest position
   */
  const initializeMap = (initialPosition: PatrolPosition): void => {
    // Wait for next tick to ensure DOM is ready
    setTimeout(() => {
      if (!mapContainer.current || mapRef.current) {
        return
      }

      try {
      // Create map instance with center on Dallas patrol area
      mapRef.current = new maplibregl.Map({
        container: mapContainer.current,
        style: {
          version: 8,
          sources: {
            'osm': {
              type: 'raster',
              tiles: ['https://tile.openstreetmap.org/{z}/{x}/{y}.png'],
              tileSize: 256,
              attribution: '&copy; OpenStreetMap contributors'
            }
          },
          layers: [
            {
              id: 'osm',
              type: 'raster',
              source: 'osm'
            }
          ]
        },
        center: [-96.7850, 32.8350], // Center on Dallas patrol area
        zoom: 14,
        attributionControl: false,
        logoPosition: 'bottom-left',
        minZoom: 10,
        maxZoom: 18
      })

      // Add zoom controls
      mapRef.current.addControl(new maplibregl.NavigationControl({}), 'top-right')

      // Create and add marker
      updateMapMarker(initialPosition)

      // Handle map resize
      mapRef.current.on('load', () => {
        if (mapRef.current) {
          mapRef.current.resize()
        }
      })

      // Handle map errors
      mapRef.current.on('error', (e) => {
        console.error('Map error:', e)
      })

      } catch (err) {
        console.error('Map initialization error:', err)
      }
    }, 100)
  }

  /**
   * Update map marker position
   */
  const updateMapMarker = (newPosition: PatrolPosition): void => {
    if (!mapRef.current) {
      initializeMap(newPosition)
      return
    }

    // Remove existing marker
    if (markerRef.current) {
      markerRef.current.remove()
    }

    // Create new marker
    markerRef.current = new maplibregl.Marker({
      color: '#ef4444',
      scale: 1.2
    })
      .setLngLat([newPosition.lon, newPosition.lat])
      .addTo(mapRef.current)

    // Center map on new position
    mapRef.current.setCenter([newPosition.lon, newPosition.lat])
    const currentZoom = mapRef.current.getZoom()
    if (currentZoom < 12) {
      mapRef.current.setZoom(14)
    }
  }

  /**
   * Format time for display
   */
  const formatTime = (isoString?: string): string => {
    if (!isoString) return 'Unknown'
    
    try {
      const date = new Date(isoString)
      return date.toLocaleTimeString([], { 
        hour: '2-digit', 
        minute: '2-digit',
        hour12: true 
      })
    } catch {
      return 'Invalid time'
    }
  }

  /**
   * Generate Google Calendar embed URL for iframe
   */
  const getCalendarEmbedUrl = (): string => {
    if (!gcalId) return ''
    
    const encodedCalendarId = encodeURIComponent(gcalId)
    return `https://calendar.google.com/calendar/embed?src=${encodedCalendarId}&mode=week&showCalendars=0&showTz=0&showTitle=0&height=600&wkst=1&bgcolor=%23FFFFFF&ctz=America%2FChicago`
  }

  /**
   * Open calendar modal
   */
  const openCalendarModal = (): void => {
    setShowCalendar(true)
  }

  /**
   * Close calendar modal
   */
  const closeCalendarModal = (): void => {
    setShowCalendar(false)
  }

  /**
   * Check authentication status
   */
  const checkAuth = async (): Promise<void> => {
    try {
      const response = await fetch('/api/auth/me', {
        credentials: 'include'
      })
      
      if (response.ok) {
        const data = await response.json()
        setIsAuthenticated(true)
        setUserEmail(data.email)
      } else {
        setIsAuthenticated(false)
        setUserEmail(null)
      }
    } catch (error) {
      setIsAuthenticated(false)
      setUserEmail(null)
    }
  }

  /**
   * Logout user
   */
  const handleLogout = async (): Promise<void> => {
    try {
      await fetch('/api/auth/logout', {
        method: 'POST',
        credentials: 'include'
      })
      setIsAuthenticated(false)
      setUserEmail(null)
      // Redirect to login page
      window.location.href = '/patrol/login'
    } catch (error) {
      console.error('Logout error:', error)
    }
  }

  /**
   * Initial data fetch and polling setup
   */
  useEffect(() => {
    const loadInitialData = async (): Promise<void> => {
      setLoading(true)
      await Promise.all([checkAuth(), fetchStatus(), fetchPosition()])
      setLoading(false)
    }

    loadInitialData()

    // Set up polling intervals
    const statusInterval = setInterval(fetchStatus, 60000) // Every minute
    const positionInterval = setInterval(fetchPosition, 120000) // Every 2 minutes

    return () => {
      clearInterval(statusInterval)
      clearInterval(positionInterval)
    }
  }, [status.onDuty])

  /**
   * Cleanup map on unmount
   */
  useEffect(() => {
    return () => {
      if (mapRef.current) {
        mapRef.current.remove()
        mapRef.current = null
      }
    }
  }, [])

  return (
    <div className="app">
      <header className="header">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <h1 style={{ margin: 0 }}>ETNP ENP Patrol</h1>
          {isAuthenticated && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <span style={{ fontSize: '14px', color: '#6b7280' }}>
                {userEmail}
              </span>
              <button
                onClick={handleLogout}
                style={{
                  padding: '6px 12px',
                  backgroundColor: '#dc2626',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  fontSize: '12px',
                  cursor: 'pointer'
                }}
              >
                Logout
              </button>
            </div>
          )}
        </div>
        
        {status.officerName && (
          <p className="status-text" style={{ fontSize: '16px', fontWeight: '600', marginBottom: '8px' }}>
            {status.actuallyOnDuty ? `Officer ${status.officerName}` : `Officer ${status.officerName}`}
          </p>
        )}
        
        <div className={`status-pill ${status.actuallyOnDuty ? 'on-duty' : status.onDuty ? 'scheduled' : 'off-duty'}`}>
          {status.actuallyOnDuty ? 'ON DUTY' : status.onDuty ? 'SCHEDULED' : 'OFF DUTY'}
        </div>
        
        <p className="status-text">
          {loading ? (
            'Loading status...'
          ) : status.statusMessage ? (
            status.statusMessage
          ) : status.onDuty ? (
            `On duty until ${formatTime(status.currentEventEnd)}`
          ) : status.nextEventStart ? (
            `Next shift starts at ${formatTime(status.nextEventStart)}`
          ) : (
            'No upcoming shifts scheduled'
          )}
        </p>

        {error && (
          <p className="status-text" style={{ color: '#ef4444', fontWeight: '500' }}>
            Status error: {error}
          </p>
        )}
      </header>

      <div className="map-container">
        {loading && !position ? (
          <div className="map-loading">
            Loading patrol location...
          </div>
        ) : status.onDuty && position ? (
          <>
            <div 
              ref={mapContainer} 
              style={{ 
                width: '100%', 
                height: '100%'
              }} 
            />
          </>
        ) : !status.actuallyOnDuty ? (
          <div className="map-loading">
            {!status.onDuty 
              ? '🚫 Officer off duty - No location tracking'
              : '⏳ Scheduled but not yet on patrol'
            }
          </div>
        ) : (
          <div className="map-loading">
            No location data available
          </div>
        )}
      </div>

      {status.actuallyOnDuty && lastUpdate && (
        <div className="last-update">
          Last update: {lastUpdate} • Next at: {nextUpdate}
        </div>
      )}
      
      {status.onDuty && !status.actuallyOnDuty && (
        <div className="last-update" style={{ color: '#888' }}>
          {status.statusMessage || 'Location tracking will begin when patrol starts'}
        </div>
      )}
      
      {!status.onDuty && (
        <div className="last-update" style={{ color: '#888' }}>
          Location tracking disabled during off-duty hours
        </div>
      )}

      {/* Calendar Modal */}
      {showCalendar && (
        <div 
          className="modal-overlay"
          onClick={closeCalendarModal}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000
          }}
        >
          <div 
            className="modal-content"
            onClick={(e) => e.stopPropagation()}
            style={{
              backgroundColor: 'white',
              borderRadius: '8px',
              padding: '16px',
              width: '800px',
              height: '600px',
              display: 'flex',
              flexDirection: 'column'
            }}
          >
            <div style={{
              textAlign: 'center',
              marginBottom: '16px'
            }}>
              <h2 style={{
                margin: 0,
                fontSize: '18px',
                color: '#374151'
              }}>
                📅 ETNP ENP Patrol Schedule
              </h2>
              <button
                onClick={closeCalendarModal}
                style={{
                  background: 'none',
                  border: 'none',
                  fontSize: '20px',
                  cursor: 'pointer',
                  float: 'right',
                  marginTop: '-30px'
                }}
                aria-label="Close calendar"
              >
                ×
              </button>
            </div>
            
            <iframe
              src={getCalendarEmbedUrl()}
              width="100%"
              height="100%"
              frameBorder="0"
              scrolling="no"
              title="Officer Patrol Schedule"
            />
          </div>
        </div>
      )}
          <p style={{ padding: '10px', fontWeight: '600', color: '#dc2626', }}>
            {status.onDuty ? 
              `🚨 For emergencies call 911. Officer ${status.officerName} will respond to 911 calls for our neighborhood` : 
              "🚨 For emergencies call 911 • Off duty Response time: 24-48 hours for voicemails/texts"
            }
          </p>
      <div className="non-emergency-contacts">
        <h3 style={{
          fontSize: '16px',
          fontWeight: '600',
          color: '#2563eb',
          margin: '0 0 12px',
          padding: '0 16px'
        }}>
         Non-Emergency Contact
        </h3>
        
        <div className="action-buttons">
          <a 
            href={`tel:${patrolPhone}`}
            className="action-btn"
            aria-label={`Call ${status.officerName || 'Officer'}`}
          >
            📞 Call ENP Officer
          </a>
          
          <a 
            href={`sms:${patrolPhone}?body=Hello%20officer%20${status.officerName || 'Officer'}`}
            className="action-btn"
            aria-label={`Send SMS to ${status.officerName || 'Officer'}`}
          >
            💬 Text ENP Officer
          </a>
          
          <button 
            onClick={openCalendarModal}
            className="action-btn white-border"
            aria-label="View weekly schedule"
          >
            📅 View Weekly Schedule
          </button>
        </div>
      </div>

      <footer className="footer">
        ENP Patrol System • Secure Access Required
      </footer>
    </div>
  )
}
