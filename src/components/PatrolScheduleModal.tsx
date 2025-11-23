'use client'

import { useState, useCallback } from 'react'

interface ScheduleEvent {
  id: string
  date: string
  startTime: string
  endTime: string
  officerName: string
  summary: string
  isSeasonal: boolean
}

interface PatrolScheduleModalProps {
  isOpen: boolean
  onClose: () => void
}

export default function PatrolScheduleModal({ isOpen, onClose }: PatrolScheduleModalProps) {
  const [scheduleEvents, setScheduleEvents] = useState<ScheduleEvent[]>([])
  const [scheduleWeekOffset, setScheduleWeekOffset] = useState(0)
  const [loadingSchedule, setLoadingSchedule] = useState(false)

  /**
   * Fetch schedule events for the current 4-week window
   */
  const fetchScheduleEvents = useCallback(async (weekOffset: number = 0): Promise<void> => {
    setLoadingSchedule(true)
    try {
      const now = new Date()
      // Start from beginning of current week (Sunday)
      const currentDayOfWeek = now.getDay()
      const startOfWeek = new Date(now)
      startOfWeek.setDate(now.getDate() - currentDayOfWeek)
      startOfWeek.setHours(0, 0, 0, 0)
      
      const startDate = new Date(startOfWeek.getTime() + (weekOffset * 7 * 24 * 60 * 60 * 1000))
      const endDate = new Date(startDate.getTime() + (28 * 24 * 60 * 60 * 1000)) // 4 weeks
      
      const params = new URLSearchParams({
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString()
      })
      
      const response = await fetch(`/api/schedule?${params}`, {
        cache: 'no-store',
        headers: {
          'Accept': 'application/json'
        }
      })
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`)
      }
      
      const data = await response.json()
      setScheduleEvents(data.events || [])
    } catch (err) {
      console.error('Failed to fetch schedule:', err)
      setScheduleEvents([])
    } finally {
      setLoadingSchedule(false)
    }
  }, [])

  /**
   * Navigate to previous 4-week period
   */
  const navigatePreviousWeeks = (): void => {
    const newOffset = scheduleWeekOffset - 4
    setScheduleWeekOffset(newOffset)
    fetchScheduleEvents(newOffset)
  }

  /**
   * Navigate to next 4-week period
   */
  const navigateNextWeeks = (): void => {
    const newOffset = scheduleWeekOffset + 4
    setScheduleWeekOffset(newOffset)
    fetchScheduleEvents(newOffset)
  }

  /**
   * Navigate back to current week
   */
  const navigateToCurrentWeek = (): void => {
    setScheduleWeekOffset(0)
    fetchScheduleEvents(0)
  }

  /**
   * Group events by date
   */
  const groupEventsByDate = (events: ScheduleEvent[]): Record<string, ScheduleEvent[]> => {
    return events.reduce((groups, event) => {
      const date = new Date(event.date)
      const dateKey = date.toLocaleDateString([], { 
        weekday: 'long',
        month: 'long', 
        day: 'numeric',
        year: 'numeric'
      })
      
      if (!groups[dateKey]) {
        groups[dateKey] = []
      }
      groups[dateKey].push(event)
      return groups
    }, {} as Record<string, ScheduleEvent[]>)
  }

  /**
   * Get the date range being viewed based on week offset
   */
  const getDateRangeDisplay = (weekOffset: number): string => {
    const now = new Date()
    // Start from beginning of current week (Sunday)
    const currentDayOfWeek = now.getDay()
    const startOfWeek = new Date(now)
    startOfWeek.setDate(now.getDate() - currentDayOfWeek)
    startOfWeek.setHours(0, 0, 0, 0)
    
    const startDate = new Date(startOfWeek.getTime() + (weekOffset * 7 * 24 * 60 * 60 * 1000))
    const endDate = new Date(startDate.getTime() + (28 * 24 * 60 * 60 * 1000) - 1) // 4 weeks minus 1ms
    
    const startStr = startDate.toLocaleDateString([], { 
      month: 'short', 
      day: 'numeric'
    })
    const endStr = endDate.toLocaleDateString([], { 
      month: 'short', 
      day: 'numeric',
      year: 'numeric'
    })
    
    return `${startStr} - ${endStr}`
  }

  /**
   * Handle modal open - fetch initial schedule
   */
  const handleOpen = (): void => {
    if (isOpen && scheduleEvents.length === 0) {
      setScheduleWeekOffset(0)
      fetchScheduleEvents(0)
    }
  }

  // Fetch schedule when modal opens
  if (isOpen && scheduleEvents.length === 0 && !loadingSchedule) {
    handleOpen()
  }

  if (!isOpen) return null

  return (
    <div 
      className="modal-overlay"
      onClick={onClose}
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
        zIndex: 1000,
        padding: '12px'
      }}
    >
      <div 
        className="modal-content"
        onClick={(e) => e.stopPropagation()}
        style={{
          backgroundColor: 'white',
          borderRadius: '12px',
          padding: '16px',
          width: '100%',
          maxWidth: '600px',
          maxHeight: '90vh',
          display: 'flex',
          flexDirection: 'column',
          boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)'
        }}
      >
        {/* Header */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '12px',
          paddingBottom: '12px',
          borderBottom: '2px solid #e5e7eb'
        }}>
          <h2 style={{
            margin: 0,
            fontSize: '18px',
            fontWeight: '600',
            color: '#1f2937'
          }}>
            📅 Patrol Schedule
          </h2>
          <button
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              fontSize: '28px',
              cursor: 'pointer',
              color: '#6b7280',
              lineHeight: '1',
              padding: '0',
              width: '32px',
              height: '32px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0
            }}
            aria-label="Close calendar"
          >
            ×
          </button>
        </div>

        {/* Schedule Info */}
        <div style={{
          backgroundColor: '#f0f9ff',
          border: '1px solid #bfdbfe',
          borderRadius: '8px',
          padding: '10px 12px',
          marginBottom: '12px'
        }}>
          <div style={{
            fontSize: '11px',
            fontWeight: '600',
            color: '#1e40af',
            marginBottom: '6px',
            textTransform: 'uppercase',
            letterSpacing: '0.03em'
          }}>
            Regular Patrol Schedule
          </div>
          <div style={{
            fontSize: '12px',
            color: '#1e40af',
            lineHeight: '1.5'
          }}>
            <div style={{ marginBottom: '4px' }}>
              <strong>Weekend:</strong> Friday & Saturday 12:00 AM - 4:00 AM
            </div>
            <div style={{ marginBottom: scheduleEvents.some(e => e.isSeasonal) ? '8px' : '0' }}>
              <strong>Weekday:</strong> 1 floating shift Mon-Thu 6:00 PM - 10:00 PM
            </div>
            {scheduleEvents.some(e => e.isSeasonal) && (
              <div style={{
                fontSize: '11px',
                color: '#15803d',
                backgroundColor: '#f0fdf4',
                border: '1px solid #bbf7d0',
                borderRadius: '6px',
                padding: '6px 8px',
                marginTop: '6px'
              }}>
                <strong>🌟 Seasonal Shifts:</strong> Extra shifts allocated in our budget beyond our weekly 3 shifts
              </div>
            )}
          </div>
        </div>
        
        {/* Navigation Controls */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: '8px',
          marginBottom: scheduleWeekOffset !== 0 ? '8px' : '12px',
          padding: '10px',
          backgroundColor: '#f9fafb',
          borderRadius: '8px',
          flexWrap: 'wrap'
        }}>
          <button
            onClick={navigatePreviousWeeks}
            style={{
              padding: '6px 12px',
              backgroundColor: '#3b82f6',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
              fontSize: '13px',
              fontWeight: '500',
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              flexShrink: 0,
              minWidth: 'fit-content'
            }}
          >
            ← Prev
          </button>
          
          <span style={{
            fontSize: '12px',
            color: '#1f2937',
            fontWeight: '600',
            textAlign: 'center',
            flex: '1',
            minWidth: '120px'
          }}>
            {getDateRangeDisplay(scheduleWeekOffset)}
          </span>
          
          <button
            onClick={navigateNextWeeks}
            style={{
              padding: '6px 12px',
              backgroundColor: '#3b82f6',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
              fontSize: '13px',
              fontWeight: '500',
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              flexShrink: 0,
              minWidth: 'fit-content'
            }}
          >
            Next →
          </button>
        </div>

        {/* Back to Current Week Button */}
        {scheduleWeekOffset !== 0 && (
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            marginBottom: '12px'
          }}>
            <button
              onClick={navigateToCurrentWeek}
              style={{
                padding: '6px 16px',
                backgroundColor: '#10b981',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer',
                fontSize: '13px',
                fontWeight: '600',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                boxShadow: '0 2px 4px rgba(16, 185, 129, 0.2)'
              }}
            >
              <span>📅</span>
              Current Week
            </button>
          </div>
        )}
        
        {/* Schedule List */}
        <div style={{
          flex: 1,
          overflowY: 'auto',
          padding: '4px 0'
        }}>
          {loadingSchedule ? (
            <div style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              padding: '40px',
              color: '#6b7280'
            }}>
              Loading schedule...
            </div>
          ) : scheduleEvents.length === 0 ? (
            <div style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              padding: '40px',
              color: '#6b7280',
              textAlign: 'center'
            }}>
              No shifts scheduled in this period
            </div>
          ) : (
            (() => {
              const groupedEvents = Object.entries(groupEventsByDate(scheduleEvents))
              const today = new Date()
              today.setHours(0, 0, 0, 0)
              
              // Only show "Today" marker when viewing current week (offset 0)
              const showTodayMarker = scheduleWeekOffset === 0
              
              let todayMarkerInserted = false
              const result: JSX.Element[] = []
              
              groupedEvents.forEach(([date, events]) => {
                const eventDate = new Date(events[0].date)
                eventDate.setHours(0, 0, 0, 0)
                
                // Insert "Today" marker before this date if we haven't yet and event is after today
                if (showTodayMarker && !todayMarkerInserted && eventDate > today) {
                  todayMarkerInserted = true
                  result.push(
                    <div key="today-marker" style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      margin: '12px 0',
                      padding: '8px',
                      backgroundColor: '#eff6ff',
                      borderRadius: '8px',
                      border: '2px dashed #3b82f6'
                    }}>
                      <div style={{
                        backgroundColor: '#3b82f6',
                        color: 'white',
                        fontSize: '11px',
                        fontWeight: '700',
                        padding: '3px 10px',
                        borderRadius: '10px',
                        textTransform: 'uppercase',
                        letterSpacing: '0.03em',
                        whiteSpace: 'nowrap'
                      }}>
                        Today
                      </div>
                      <div style={{
                        flex: 1,
                        height: '2px',
                        backgroundColor: '#3b82f6',
                        opacity: 0.3
                      }} />
                      <div style={{
                        fontSize: '11px',
                        color: '#3b82f6',
                        fontWeight: '600',
                        whiteSpace: 'nowrap'
                      }}>
                        {today.toLocaleDateString([], { 
                          weekday: 'short',
                          month: 'short', 
                          day: 'numeric'
                        })}
                      </div>
                    </div>
                  )
                }
                
                const [dateKey, eventList] = [date, events]
                const isToday = showTodayMarker && eventDate.getTime() === today.getTime()
                
                if (isToday) {
                  todayMarkerInserted = true
                }
                
                result.push(
                  <div key={dateKey} style={{ marginBottom: '16px', position: 'relative' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '6px', flexWrap: 'wrap' }}>
                      <h3 style={{
                        fontSize: '12px',
                        fontWeight: '600',
                        color: isToday ? '#3b82f6' : '#374151',
                        paddingLeft: '2px',
                        textTransform: 'uppercase',
                        letterSpacing: '0.03em',
                        margin: 0
                      }}>
                        {dateKey}
                      </h3>
                      {isToday && (
                        <span style={{
                          backgroundColor: '#3b82f6',
                          color: 'white',
                          fontSize: '10px',
                          fontWeight: '700',
                          padding: '2px 6px',
                          borderRadius: '10px',
                          textTransform: 'uppercase',
                          letterSpacing: '0.03em'
                        }}>
                          Today
                        </span>
                      )}
                    </div>
                    {eventList.map((event) => {
                      // Determine styling based on seasonal status and today status
                      const getEventStyle = () => {
                        if (event.isSeasonal) {
                          return {
                            backgroundColor: '#f0fdf4',
                            border: '2px solid #22c55e',
                            accentColor: '#22c55e'
                          }
                        } else if (isToday) {
                          return {
                            backgroundColor: '#eff6ff',
                            border: '2px solid #3b82f6',
                            accentColor: '#3b82f6'
                          }
                        } else {
                          return {
                            backgroundColor: '#f9fafb',
                            border: '1px solid #e5e7eb',
                            accentColor: undefined
                          }
                        }
                      }
                      
                      const eventStyle = getEventStyle()
                      const showAccent = event.isSeasonal || isToday
                      
                      return (
                        <div
                          key={event.id}
                          style={{
                            backgroundColor: eventStyle.backgroundColor,
                            border: eventStyle.border,
                            borderRadius: '8px',
                            padding: '12px',
                            marginBottom: '8px',
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            position: 'relative',
                            gap: '8px'
                          }}
                        >
                          {showAccent && (
                            <div style={{
                              position: 'absolute',
                              left: 0,
                              top: 0,
                              bottom: 0,
                              width: '3px',
                              backgroundColor: eventStyle.accentColor,
                              borderRadius: '8px 0 0 8px'
                            }} />
                          )}
                          <div style={{ flex: 1, paddingLeft: showAccent ? '6px' : '0', minWidth: 0 }}>
                            <div style={{
                              fontSize: '14px',
                              fontWeight: '600',
                              color: '#1f2937',
                              marginBottom: '3px',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '6px',
                              flexWrap: 'wrap'
                            }}>
                              Officer {event.officerName}
                              {event.isSeasonal && (
                                <span style={{
                                  backgroundColor: '#22c55e',
                                  color: 'white',
                                  fontSize: '10px',
                                  fontWeight: '700',
                                  padding: '2px 6px',
                                  borderRadius: '10px',
                                  textTransform: 'uppercase',
                                  letterSpacing: '0.03em'
                                }}>
                                  Seasonal
                                </span>
                              )}
                            </div>
                            <div style={{
                              fontSize: '12px',
                              color: '#6b7280'
                            }}>
                              {event.startTime} - {event.endTime}
                            </div>
                          </div>
                          <div style={{
                            fontSize: '20px',
                            flexShrink: 0
                          }}>
                            🚓
                          </div>
                        </div>
                      )
                    })}
                  </div>
                )
              })
              
              // If we haven't inserted the "Today" marker yet and all events are in the past, insert it at the end
              if (showTodayMarker && !todayMarkerInserted) {
                result.push(
                  <div key="today-marker" style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    margin: '12px 0',
                    padding: '8px',
                    backgroundColor: '#eff6ff',
                    borderRadius: '8px',
                    border: '2px dashed #3b82f6'
                  }}>
                    <div style={{
                      backgroundColor: '#3b82f6',
                      color: 'white',
                      fontSize: '11px',
                      fontWeight: '700',
                      padding: '3px 10px',
                      borderRadius: '10px',
                      textTransform: 'uppercase',
                      letterSpacing: '0.03em',
                      whiteSpace: 'nowrap'
                    }}>
                      Today
                    </div>
                    <div style={{
                      flex: 1,
                      height: '2px',
                      backgroundColor: '#3b82f6',
                      opacity: 0.3
                    }} />
                    <div style={{
                      fontSize: '11px',
                      color: '#3b82f6',
                      fontWeight: '600',
                      whiteSpace: 'nowrap'
                    }}>
                      {today.toLocaleDateString([], { 
                        weekday: 'short',
                        month: 'short', 
                        day: 'numeric'
                      })}
                    </div>
                  </div>
                )
              }
              
              return result
            })()
          )}
        </div>
      </div>
    </div>
  )
}

