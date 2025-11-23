'use client'

import { useEffect, useRef, useState, useCallback } from 'react'
import maplibregl from 'maplibre-gl'
import 'maplibre-gl/dist/maplibre-gl.css'
import PatrolScheduleModal from '@/components/PatrolScheduleModal'
import VacationForm from '@/components/VacationForm'

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
  const [showVacationForm, setShowVacationForm] = useState(false)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [userEmail, setUserEmail] = useState<string | null>(null)
  
  // Map references
  const mapContainer = useRef<HTMLDivElement>(null)
  const mapRef = useRef<maplibregl.Map | null>(null)
  const markerRef = useRef<maplibregl.Marker | null>(null)

  // Get environment variables for client-side use
  const patrolPhone = process.env.NEXT_PUBLIC_PATROL_PHONE || '+1234567890'

  /**
   * Fetch combined duty status (calendar + geofencing) via our API
   */
  const fetchStatus = useCallback(async (): Promise<void> => {
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
  }, [])

  /**
   * Fetch patrol position from Traccar via our API
   * Uses ref to avoid recreating function on every status change
   */
  const statusRef = useRef(status)
  
  // Keep ref in sync with latest status
  useEffect(() => {
    statusRef.current = status
  }, [status])
  
  const fetchPosition = useCallback(async (): Promise<void> => {
    // Only fetch position if officer is actually on duty (calendar + geofencing)
    if (!statusRef.current.actuallyOnDuty) {
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
      // Only set error if there isn't one already
      setError(prev => prev || errorMessage)
    }
  }, [])

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
   * Format date and time for display (shows date if not within 18 hours)
   */
  const formatDateTime = (isoString?: string): string => {
    if (!isoString) return 'Unknown'
    
    try {
      const date = new Date(isoString)
      const now = new Date()
      const hoursUntil = (date.getTime() - now.getTime()) / (1000 * 60 * 60)
      
      // If within 18 hours, show just the time
      if (hoursUntil <= 18) {
        return date.toLocaleTimeString([], { 
          hour: '2-digit', 
          minute: '2-digit',
          hour12: true 
        })
      } else {
        // For shifts beyond 18 hours, show date and time
        const dateStr = date.toLocaleDateString([], { 
          weekday: 'short',
          month: 'short', 
          day: 'numeric'
        })
        const timeStr = date.toLocaleTimeString([], { 
          hour: '2-digit', 
          minute: '2-digit',
          hour12: true 
        })
        return `${dateStr} at ${timeStr}`
      }
    } catch {
      return 'Invalid date/time'
    }
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
   * Open vacation form modal
   */
  const openVacationForm = (): void => {
    setShowVacationForm(true)
  }

  /**
   * Close vacation form modal
   */
  const closeVacationForm = (): void => {
    setShowVacationForm(false)
  }

  /**
   * Check authentication status
   */
  const checkAuth = useCallback(async (): Promise<void> => {
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
  }, [])

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
   * Separated to avoid infinite loops from dependency changes
   */
  useEffect(() => {
    const loadInitialData = async (): Promise<void> => {
      setLoading(true)
      // Fetch in sequence: auth first, then status, then position
      await checkAuth()
      await fetchStatus()
      // Wait a tick to ensure status is updated before fetching position
      await new Promise(resolve => setTimeout(resolve, 100))
      await fetchPosition()
      setLoading(false)
    }

    loadInitialData()

    // Set up polling intervals
    const statusInterval = setInterval(() => {
      fetchStatus()
    }, 60000) // Every minute
    
    const positionInterval = setInterval(() => {
      fetchPosition()
    }, 120000) // Every 2 minutes

    return () => {
      clearInterval(statusInterval)
      clearInterval(positionInterval)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []) // Empty deps - only run once on mount

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
        <div className="header-content">
          <div className="header-top">
            <div className="header-brand">
              <img 
                src="/west-inwood-logo.svg" 
                alt="West Inwood" 
                className="header-logo"
              />
              <div className="header-title-group">
                <h1>West Inwood ENP</h1>
                <p className="header-subtitle">Member Patrol Dashboard</p>
              </div>
            </div>
            {isAuthenticated && (
              <div className="header-user">
                <span className="header-email">{userEmail}</span>
                <button onClick={handleLogout} className="logout-btn">
                  Logout
                </button>
              </div>
            )}
          </div>
          
          <div className="header-status">
            {status.officerName && (
              <p className="officer-name">
                Officer {status.officerName}
              </p>
            )}
            
            <div className={`status-pill ${status.actuallyOnDuty ? 'on-duty' : status.onDuty ? 'scheduled' : 'off-duty'}`}>
              {status.actuallyOnDuty ? '✓ ON DUTY' : status.onDuty ? '⏱ SCHEDULED' : '○ OFF DUTY'}
            </div>
            
            <p className="status-text">
              {loading ? (
                'Loading status...'
              ) : status.onDuty ? (
                `On duty until ${formatTime(status.currentEventEnd)}`
              ) : status.nextEventStart ? (
                (() => {
                  const nextShiftDate = new Date(status.nextEventStart)
                  const now = new Date()
                  const hoursUntil = (nextShiftDate.getTime() - now.getTime()) / (1000 * 60 * 60)
                  
                  // Within 18 hours: use "starts at" with time only
                  if (hoursUntil <= 18) {
                    return `Next shift starts at ${formatDateTime(status.nextEventStart)}`
                  } else {
                    // Beyond 18 hours: use shorter "Next shift:" with date and time
                    return `Next shift: ${formatDateTime(status.nextEventStart)}`
                  }
                })()
              ) : (
                'No upcoming shifts scheduled'
              )}
            </p>

            {error && (
              <p className="status-text" style={{ color: '#fca5a5', fontWeight: '500' }}>
                Status error: {error}
              </p>
            )}
          </div>
        </div>
      </header>

      <div className="main-content">
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
            Officer location is delayed for security purposes.
          </div>
        )}
        
        {status.onDuty && !status.actuallyOnDuty && (
          <div className="last-update" style={{ color: '#888' }}>
            {status.statusMessage || 'Location tracking will begin when patrol starts'}
          </div>
        )}
        
        {!status.onDuty && (
          <div>
          </div>
        )}

        <div className="emergency-notice">
          🚨 {status.onDuty ? 
            `For emergencies call 911. Officer ${status.officerName} will respond to 911 calls for our neighborhood` : 
            "For emergencies call 911 • Off duty response time: 24-48 hours for voicemails/texts"
          }
        </div>
        
        <div className="non-emergency-contacts">
          <h3>Non-Emergency Contact</h3>
          
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
              aria-label="View patrol schedule"
            >
              📅 View Patrol Schedule
            </button>
            
            <button 
              onClick={openVacationForm}
              className="action-btn white-border"
              aria-label="Submit vacation notice"
            >
              🏖️ Vacation Notice
            </button>
          </div>
        </div>
      </div>

      {/* Calendar Modal */}
      <PatrolScheduleModal isOpen={showCalendar} onClose={closeCalendarModal} />
      
      {/* Vacation Form Modal */}
      <VacationForm isOpen={showVacationForm} onClose={closeVacationForm} />

      <footer className="footer">
        <div style={{ marginBottom: '8px' }}>
          West Inwood Extended Neighborhood Patrol • Member Portal • Secure Access Required
        </div>
        <div style={{ fontSize: '13px' }}>
          <a 
            href="mailto:westinwood75209@gmail.com?subject=Bug Report - Member Portal" 
            style={{ 
              color: '#93c5fd', 
              textDecoration: 'none',
              borderBottom: '1px solid transparent',
              transition: 'border-color 0.2s'
            }}
            onMouseOver={(e) => e.currentTarget.style.borderBottomColor = '#93c5fd'}
            onMouseOut={(e) => e.currentTarget.style.borderBottomColor = 'transparent'}
          >
            🐛 Report a Bug
          </a>
        </div>
      </footer>
    </div>
  )
}
