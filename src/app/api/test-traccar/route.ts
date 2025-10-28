import { NextResponse } from 'next/server'

/**
 * Test Traccar connection and device status
 * GET /api/test-traccar
 */
export async function GET() {
  const baseUrl = process.env.TRACCAR_BASE_URL
  const username = process.env.TRACCAR_USERNAME
  const password = process.env.TRACCAR_PASSWORD
  const deviceId = process.env.TRACCAR_DEVICE_ID

  // Check if all required env vars are present
  if (!baseUrl || !username || !password || !deviceId) {
    return NextResponse.json({
      status: 'error',
      message: 'Missing Traccar configuration',
      config: {
        baseUrl: baseUrl ? 'Set' : 'Missing',
        username: username ? 'Set' : 'Missing',
        password: password ? 'Set' : 'Missing',
        deviceId: deviceId ? 'Set' : 'Missing'
      }
    }, { status: 400 })
  }

  try {
    const auth = Buffer.from(`${username}:${password}`).toString('base64')
    const cleanBaseUrl = baseUrl.replace(/\/$/, '')

    // Test 1: Check server connection - try multiple endpoints
    console.log('Testing Traccar connection...')
    
    // Try different possible endpoints for Traccar Cloud
    const testEndpoints = [
      '/api/session',
      '/api/server', 
      '/api/devices'
    ]
    
    let sessionResponse: Response | null = null
    let workingEndpoint = ''
    
    for (const endpoint of testEndpoints) {
      try {
        console.log(`Trying endpoint: ${cleanBaseUrl}${endpoint}`)
        sessionResponse = await fetch(`${cleanBaseUrl}${endpoint}`, {
          method: 'GET',
          headers: {
            'Authorization': `Basic ${auth}`,
            'Accept': 'application/json',
            'User-Agent': 'ENP-Patrol-Test/1.0'
          },
          signal: AbortSignal.timeout(5000)
        })
        
        if (sessionResponse.ok) {
          workingEndpoint = endpoint
          break
        }
      } catch (error) {
        console.log(`Endpoint ${endpoint} failed:`, error)
        continue
      }
    }
    
    if (!sessionResponse || !sessionResponse.ok) {
      const statusCode = sessionResponse?.status || 0
      return NextResponse.json({
        status: 'error',
        message: 'Failed to authenticate with Traccar server',
        details: `HTTP ${statusCode} - Tried endpoints: ${testEndpoints.join(', ')}`,
        serverUrl: cleanBaseUrl,
        workingEndpoint: workingEndpoint || 'none',
        troubleshooting: [
          'Traccar Cloud might use different API structure',
          'Try accessing the web interface directly: ' + cleanBaseUrl,
          'Verify your credentials are correct',
          'Check if account is properly activated'
        ]
      }, { status: 401 })
    }

    console.log(`✅ Connected using endpoint: ${workingEndpoint}`)

    // Test 2: Check if device exists
    console.log('Testing device access...')
    const deviceResponse = await fetch(`${cleanBaseUrl}/api/devices?id=${deviceId}`, {
      method: 'GET',
      headers: {
        'Authorization': `Basic ${auth}`,
        'Accept': 'application/json',
        'User-Agent': 'ENP-Patrol-Test/1.0'
      },
      signal: AbortSignal.timeout(10000)
    })

    if (!deviceResponse.ok) {
      return NextResponse.json({
        status: 'error',
        message: 'Cannot access device',
        details: `HTTP ${deviceResponse.status}`,
        deviceId: deviceId
      }, { status: 404 })
    }

    const devices = await deviceResponse.json()
    if (!Array.isArray(devices) || devices.length === 0) {
      return NextResponse.json({
        status: 'error',
        message: 'Device not found',
        deviceId: deviceId,
        suggestion: 'Check if the device ID is correct and the device exists in your Traccar server'
      }, { status: 404 })
    }

    const device = devices[0]

    // Test 3: Try to get latest position
    console.log('Testing position data...')
    const positionResponse = await fetch(`${cleanBaseUrl}/api/positions?deviceId=${deviceId}&latest=true`, {
      method: 'GET',
      headers: {
        'Authorization': `Basic ${auth}`,
        'Accept': 'application/json',
        'User-Agent': 'ENP-Patrol-Test/1.0'
      },
      signal: AbortSignal.timeout(10000)
    })

    let positionData = null
    let positionError = null

    if (positionResponse.ok) {
      const positions = await positionResponse.json()
      if (Array.isArray(positions) && positions.length > 0) {
        const pos = positions[0]
        positionData = {
          latitude: pos.latitude,
          longitude: pos.longitude,
          timestamp: pos.fixTime || pos.serverTime,
          valid: pos.valid,
          speed: pos.speed,
          address: pos.address
        }
      } else {
        positionError = 'No position data available yet'
      }
    } else {
      positionError = `Failed to fetch positions: HTTP ${positionResponse.status}`
    }

    return NextResponse.json({
      status: 'success',
      message: 'Traccar connection test successful',
      server: {
        url: cleanBaseUrl,
        connected: true,
        authenticated: true
      },
      device: {
        id: device.id,
        name: device.name,
        uniqueId: device.uniqueId,
        status: device.status,
        lastUpdate: device.lastUpdate,
        disabled: device.disabled
      },
      position: positionData ? {
        available: true,
        data: positionData
      } : {
        available: false,
        error: positionError,
        note: 'Position data will appear once the iPhone Traccar client starts sending GPS coordinates'
      },
      nextSteps: positionData ? [
        'Your Traccar setup is working!',
        'Your ENP Patrol app should now display live GPS tracking',
        'Consider setting up your own Traccar server for production (see TRACCAR_PRODUCTION_SETUP.md)'
      ] : [
        'Server connection is working ✓',
        'Device is configured ✓', 
        'Start the Traccar Client app on your iPhone',
        'Make sure location permissions are enabled',
        'Wait a few minutes for first GPS data to appear'
      ]
    })

  } catch (error) {
    console.error('Traccar test error:', error)
    
    let errorMessage = 'Unknown error'
    let isDemoServerIssue = false
    
    if (error instanceof Error) {
      if (error.name === 'AbortError' || error.name === 'TimeoutError') {
        errorMessage = 'Connection timeout - server is not responding'
        isDemoServerIssue = baseUrl.includes('demo.traccar.org')
      } else {
        errorMessage = error.message
      }
    }

    const troubleshooting = isDemoServerIssue ? [
      '🚨 The demo.traccar.org server appears to be down or overloaded',
      '📋 This is common with public demo servers - they are not reliable',
      '✅ Your app configuration looks correct',
      '🎯 Next steps:',
      '   1. Try again in a few minutes (demo servers are unreliable)',
      '   2. Set up your own Traccar server for reliable service',
      '   3. Use the fake GPS data for now (works without Traccar)',
      '📖 See TRACCAR_PRODUCTION_SETUP.md for production options'
    ] : [
      'Check if Traccar server URL is correct and accessible',
      'Verify username and password are correct',
      'Ensure device ID exists in the Traccar server',
      'Check if firewall is blocking the connection',
      'Try accessing the Traccar web interface manually'
    ]

    return NextResponse.json({
      status: 'error',
      message: isDemoServerIssue ? 'Demo Traccar server timeout' : 'Traccar connection test failed',
      error: errorMessage,
      serverUrl: baseUrl,
      isDemoServer: isDemoServerIssue,
      recommendation: isDemoServerIssue ? 
        'Demo servers are unreliable. Your app will use fake GPS data for now. Consider setting up production Traccar server.' :
        'Check your server configuration and network connectivity.',
      troubleshooting
    }, { status: 500 })
  }
}