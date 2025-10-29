'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

interface LoginFormData {
  email: string
  code: string
}

interface ApiResponse {
  success: boolean
  message: string
  code?: string
  token?: string
}

export default function LoginPage() {
  const [formData, setFormData] = useState<LoginFormData>({ email: '', code: '' })
  const [step, setStep] = useState<'email' | 'code'>('email')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: formData.email })
      })

      const data: ApiResponse = await response.json()

      if (data.success) {
        setStep('code')
        setError('') // Clear any previous errors
      } else {
        setError(data.message)
      }
    } catch (err) {
      setError('Network error. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleCodeSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const response = await fetch('/api/auth/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          email: formData.email, 
          code: formData.code 
        })
      })

      const data: ApiResponse = await response.json()

      if (data.success) {
        // Redirect to patrol dashboard
        router.push('/patrol')
      } else {
        setError(data.message)
      }
    } catch (err) {
      setError('Network error. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }))
  }

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'linear-gradient(135deg, #0f172a 0%, #1a3a5c 50%, #2c5282 100%)',
      padding: '20px',
      position: 'relative'
    }}>
      <div style={{
        backgroundColor: 'white',
        padding: '48px',
        borderRadius: '16px',
        boxShadow: '0 20px 60px rgba(0, 0, 0, 0.4)',
        width: '100%',
        maxWidth: '440px',
        position: 'relative'
      }}>
        <div style={{
          textAlign: 'center',
          marginBottom: '32px'
        }}>
          <div style={{
            background: 'white',
            padding: '12px',
            borderRadius: '16px',
            boxShadow: '0 4px 12px rgba(26, 58, 92, 0.15)',
            display: 'inline-block',
            marginBottom: '20px'
          }}>
            <img 
              src="/west-inwood-logo.svg" 
              alt="West Inwood" 
              style={{ height: '56px', width: '56px', display: 'block' }}
            />
          </div>
          <h1 style={{
            margin: 0,
            color: '#1a3a5c',
            fontSize: '28px',
            fontFamily: 'Georgia, serif',
            fontWeight: 700,
            letterSpacing: '-0.5px',
            marginBottom: '8px'
          }}>
            West Inwood ENP
          </h1>
          <p style={{
            margin: 0,
            color: '#6b7280',
            fontSize: '15px',
            fontWeight: 500
          }}>
            Member Portal Login
          </p>
        </div>

        {error && (
          <div style={{
            backgroundColor: error.includes('verification code') ? '#d1fae5' : '#fee2e2',
            border: `2px solid ${error.includes('verification code') ? '#16a34a' : '#dc2626'}`,
            color: error.includes('verification code') ? '#16a34a' : '#dc2626',
            padding: '14px 16px',
            borderRadius: '10px',
            marginBottom: '24px',
            fontSize: '14px',
            fontWeight: '500',
            lineHeight: '1.5'
          }}>
            {error}
          </div>
        )}

        {step === 'email' ? (
          <form onSubmit={handleEmailSubmit}>
            <div style={{ marginBottom: '24px' }}>
              <label style={{
                display: 'block',
                marginBottom: '10px',
                fontWeight: '600',
                color: '#1a3a5c',
                fontSize: '14px'
              }}>
                Email Address
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                required
                style={{
                  width: '100%',
                  padding: '14px 16px',
                  border: '2px solid #e5e7eb',
                  borderRadius: '10px',
                  fontSize: '16px',
                  boxSizing: 'border-box',
                  transition: 'all 0.2s ease',
                  outline: 'none'
                }}
                placeholder="your.email@example.com"
                onFocus={(e) => e.target.style.borderColor = '#1976d2'}
                onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              style={{
                width: '100%',
                padding: '14px',
                background: loading ? '#9ca3af' : 'linear-gradient(135deg, #1976d2 0%, #1565c0 100%)',
                color: 'white',
                border: 'none',
                borderRadius: '10px',
                fontSize: '16px',
                fontWeight: '600',
                cursor: loading ? 'not-allowed' : 'pointer',
                boxShadow: loading ? 'none' : '0 4px 16px rgba(25, 118, 210, 0.3)',
                transition: 'all 0.2s ease',
                letterSpacing: '0.3px'
              }}
              onMouseEnter={(e) => {
                if (!loading) e.currentTarget.style.transform = 'translateY(-1px)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)'
              }}
            >
              {loading ? 'Sending...' : 'Send Verification Code'}
            </button>
          </form>
        ) : (
          <form onSubmit={handleCodeSubmit}>
            <div style={{ marginBottom: '24px' }}>
              <label style={{
                display: 'block',
                marginBottom: '10px',
                fontWeight: '600',
                color: '#1a3a5c',
                fontSize: '14px'
              }}>
                Verification Code
              </label>
              <input
                type="text"
                name="code"
                value={formData.code}
                onChange={handleInputChange}
                required
                maxLength={6}
                style={{
                  width: '100%',
                  padding: '14px 16px',
                  border: '2px solid #e5e7eb',
                  borderRadius: '10px',
                  fontSize: '24px',
                  textAlign: 'center',
                  letterSpacing: '8px',
                  boxSizing: 'border-box',
                  fontWeight: '600',
                  transition: 'all 0.2s ease',
                  outline: 'none'
                }}
                placeholder="000000"
                onFocus={(e) => e.target.style.borderColor = '#16a34a'}
                onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
              />
              <p style={{
                fontSize: '13px',
                color: '#6b7280',
                marginTop: '12px',
                textAlign: 'center',
                lineHeight: '1.5'
              }}>
                Check your email for the 6-digit code<br />(expires in 10 minutes)
              </p>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                marginTop: '12px',
                padding: '10px',
                background: '#fef3c7',
                borderRadius: '8px',
                fontSize: '12px',
                color: '#d97706',
                fontWeight: '600'
              }}>
                <span style={{ fontSize: '16px' }}>⚠️</span>
                <span>Check your spam folder!</span>
              </div>
            </div>
            <button
              type="submit"
              disabled={loading}
              style={{
                width: '100%',
                padding: '14px',
                background: loading ? '#9ca3af' : 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                color: 'white',
                border: 'none',
                borderRadius: '10px',
                fontSize: '16px',
                fontWeight: '600',
                cursor: loading ? 'not-allowed' : 'pointer',
                boxShadow: loading ? 'none' : '0 4px 16px rgba(16, 185, 129, 0.3)',
                transition: 'all 0.2s ease',
                letterSpacing: '0.3px'
              }}
              onMouseEnter={(e) => {
                if (!loading) e.currentTarget.style.transform = 'translateY(-1px)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)'
              }}
            >
              {loading ? 'Verifying...' : 'Verify & Login'}
            </button>
            <button
              type="button"
              onClick={() => setStep('email')}
              style={{
                width: '100%',
                padding: '12px',
                backgroundColor: 'transparent',
                color: '#6b7280',
                border: 'none',
                fontSize: '14px',
                fontWeight: '500',
                cursor: 'pointer',
                marginTop: '16px',
                transition: 'all 0.2s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = '#1a3a5c'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = '#6b7280'
              }}
            >
              ← Back to email
            </button>
          </form>
        )}
      </div>
    </div>
  )
}
