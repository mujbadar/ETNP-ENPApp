/**
 * Geofencing utilities for ENP Patrol
 * Handles location-based logic for duty status
 */

export interface GeofenceConfig {
  name: string
  lat: number
  lon: number
  radiusMeters: number
}

export interface LocationPoint {
  lat: number
  lon: number
}

export interface GeofenceStatus {
  geofence: GeofenceConfig
  distance: number
  isInside: boolean
  hasLeft: boolean
  status: 'at_base' | 'in_field'
}

/**
 * Calculate distance between two points using Haversine formula
 * Returns distance in meters
 */
export function calculateDistance(point1: LocationPoint, point2: LocationPoint): number {
  const R = 6371000 // Earth's radius in meters
  const lat1Rad = (point1.lat * Math.PI) / 180
  const lat2Rad = (point2.lat * Math.PI) / 180
  const deltaLatRad = ((point2.lat - point1.lat) * Math.PI) / 180
  const deltaLonRad = ((point2.lon - point1.lon) * Math.PI) / 180

  const a = 
    Math.sin(deltaLatRad / 2) * Math.sin(deltaLatRad / 2) +
    Math.cos(lat1Rad) * Math.cos(lat2Rad) *
    Math.sin(deltaLonRad / 2) * Math.sin(deltaLonRad / 2)

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  return R * c
}

/**
 * Check if a point is inside a geofence
 */
export function isInsideGeofence(location: LocationPoint, geofence: GeofenceConfig): boolean {
  const distance = calculateDistance(location, {
    lat: geofence.lat,
    lon: geofence.lon
  })
  
  return distance <= geofence.radiusMeters
}

/**
 * Get home base geofence configuration from environment variables
 */
export function getHomeBaseConfig(): GeofenceConfig {
  return {
    name: 'Home Base',
    lat: parseFloat(process.env.HOME_BASE_LAT),
    lon: parseFloat(process.env.HOME_BASE_LON),
    radiusMeters: parseInt(process.env.HOME_BASE_RADIUS_METERS)
  }
}

/**
 * Check if officer has left home base
 */
export function hasLeftHomeBase(location: LocationPoint): boolean {
  const homeBase = getHomeBaseConfig()
  return !isInsideGeofence(location, homeBase)
}

/**
 * Get detailed geofence status
 */
export function getGeofenceStatus(location: LocationPoint): GeofenceStatus {
  const homeBase = getHomeBaseConfig()
  const distance = calculateDistance(location, homeBase)
  const isInside = distance <= homeBase.radiusMeters

  return {
    geofence: homeBase,
    distance: Math.round(distance),
    isInside,
    hasLeft: !isInside,
    status: isInside ? 'at_base' : 'in_field'
  }
}