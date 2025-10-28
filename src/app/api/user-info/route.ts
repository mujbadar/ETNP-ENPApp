import { NextRequest, NextResponse } from 'next/server'
import jwt from 'jsonwebtoken'
import { cookies } from 'next/headers'
import { getUserAddress, getUserName, getUserPhone } from '@/lib/google-sheets'

export async function GET(request: NextRequest) {
  try {
    // Verify authentication
    const cookieStore = cookies()
    const token = cookieStore.get('auth-token')?.value

    if (!token) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 })
    }

    let userEmail: string
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { email: string }
      userEmail = decoded.email
    } catch {
      return NextResponse.json({ error: 'Invalid authentication token' }, { status: 401 })
    }

    // Get user data from spreadsheet
    const address = await getUserAddress(userEmail)
    const name = await getUserName(userEmail)
    const phone = await getUserPhone(userEmail)

    return NextResponse.json({
      email: userEmail,
      address: address || '',
      name: name || '',
      phone: phone || ''
    })

  } catch (error) {
    console.error('User info API error:', error)
    return NextResponse.json({ 
      error: 'Failed to fetch user information' 
    }, { status: 500 })
  }
}