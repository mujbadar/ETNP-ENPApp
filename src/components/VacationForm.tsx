'use client'

import { useState } from 'react'

interface VacationFormProps {
  isOpen: boolean
  onClose: () => void
}

export default function VacationForm({ isOpen, onClose }: VacationFormProps) {
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [address, setAddress] = useState('')
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [primaryContact, setPrimaryContact] = useState('')
  const [secondaryContact, setSecondaryContact] = useState('')
  const [showSecondaryContact, setShowSecondaryContact] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setSuccess(false)

    try {
      const response = await fetch('/api/vacation', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          firstName,
          lastName,
          address,
          startDate,
          endDate,
          primaryContact,
          secondaryContact: secondaryContact || undefined,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to submit vacation form')
      }

      setSuccess(true)
      // Reset form
      setFirstName('')
      setLastName('')
      setAddress('')
      setStartDate('')
      setEndDate('')
      setPrimaryContact('')
      setSecondaryContact('')
      setShowSecondaryContact(false)
      
      // Auto-close after 2 seconds
      setTimeout(() => {
        onClose()
        setSuccess(false)
      }, 2000)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  const handleClose = () => {
    setFirstName('')
    setLastName('')
    setAddress('')
    setStartDate('')
    setEndDate('')
    setPrimaryContact('')
    setSecondaryContact('')
    setShowSecondaryContact(false)
    setError('')
    setSuccess(false)
    onClose()
  }

  if (!isOpen) return null

  return (
    <div 
      className="modal-overlay"
      onClick={handleClose}
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
          padding: '24px',
          width: '100%',
          maxWidth: '500px',
          boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)'
        }}
      >
        {/* Header */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '20px',
          paddingBottom: '16px',
          borderBottom: '2px solid #e5e7eb'
        }}>
          <h2 style={{
            margin: 0,
            fontSize: '20px',
            fontWeight: '600',
            color: '#1f2937'
          }}>
            🏖️ Vacation Notice Form
          </h2>
          <button
            onClick={handleClose}
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
              justifyContent: 'center'
            }}
            aria-label="Close form"
          >
            ×
          </button>
        </div>

        {/* Info Box */}
        <div style={{
          backgroundColor: '#fef3c7',
          border: '1px solid #fcd34d',
          borderRadius: '8px',
          padding: '12px',
          marginBottom: '20px',
          fontSize: '13px',
          color: '#92400e'
        }}>
          <strong>📋 Note:</strong> This form will add your vacation dates to the neighborhood patrol calendar. Officers will have your contact information in case they need to reach you during your absence.
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit}>
          {/* Name Fields */}
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: '1fr 1fr', 
            gap: '16px',
            marginBottom: '20px'
          }}>
            <div>
              <label 
                htmlFor="firstName"
                style={{
                  display: 'block',
                  fontSize: '14px',
                  fontWeight: '600',
                  color: '#374151',
                  marginBottom: '8px'
                }}
              >
                First Name *
              </label>
              <input
                id="firstName"
                type="text"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                required
                placeholder="John"
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  fontSize: '14px',
                  border: '1px solid #d1d5db',
                  borderRadius: '6px',
                  boxSizing: 'border-box',
                  outline: 'none'
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = '#3b82f6'
                  e.target.style.boxShadow = '0 0 0 3px rgba(59, 130, 246, 0.1)'
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = '#d1d5db'
                  e.target.style.boxShadow = 'none'
                }}
              />
            </div>

            <div>
              <label 
                htmlFor="lastName"
                style={{
                  display: 'block',
                  fontSize: '14px',
                  fontWeight: '600',
                  color: '#374151',
                  marginBottom: '8px'
                }}
              >
                Last Name *
              </label>
              <input
                id="lastName"
                type="text"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                required
                placeholder="Doe"
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  fontSize: '14px',
                  border: '1px solid #d1d5db',
                  borderRadius: '6px',
                  boxSizing: 'border-box',
                  outline: 'none'
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = '#3b82f6'
                  e.target.style.boxShadow = '0 0 0 3px rgba(59, 130, 246, 0.1)'
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = '#d1d5db'
                  e.target.style.boxShadow = 'none'
                }}
              />
            </div>
          </div>

          {/* Address Field */}
          <div style={{ marginBottom: '20px' }}>
            <label 
              htmlFor="address"
              style={{
                display: 'block',
                fontSize: '14px',
                fontWeight: '600',
                color: '#374151',
                marginBottom: '8px'
              }}
            >
              Address *
            </label>
            <input
              id="address"
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              required
              placeholder="e.g., 123 Main Street"
              style={{
                width: '100%',
                padding: '10px 12px',
                fontSize: '14px',
                border: '1px solid #d1d5db',
                borderRadius: '6px',
                boxSizing: 'border-box',
                outline: 'none'
              }}
              onFocus={(e) => {
                e.target.style.borderColor = '#3b82f6'
                e.target.style.boxShadow = '0 0 0 3px rgba(59, 130, 246, 0.1)'
              }}
              onBlur={(e) => {
                e.target.style.borderColor = '#d1d5db'
                e.target.style.boxShadow = 'none'
              }}
            />
          </div>

          {/* Primary Contact Field */}
          <div style={{ marginBottom: '20px' }}>
            <label 
              htmlFor="primaryContact"
              style={{
                display: 'block',
                fontSize: '14px',
                fontWeight: '600',
                color: '#374151',
                marginBottom: '8px'
              }}
            >
              Primary Phone Number *
            </label>
            <input
              id="primaryContact"
              type="tel"
              value={primaryContact}
              onChange={(e) => setPrimaryContact(e.target.value)}
              required
              placeholder="(214) 555-1234"
              style={{
                width: '100%',
                padding: '10px 12px',
                fontSize: '14px',
                border: '1px solid #d1d5db',
                borderRadius: '6px',
                boxSizing: 'border-box',
                outline: 'none'
              }}
              onFocus={(e) => {
                e.target.style.borderColor = '#3b82f6'
                e.target.style.boxShadow = '0 0 0 3px rgba(59, 130, 246, 0.1)'
              }}
              onBlur={(e) => {
                e.target.style.borderColor = '#d1d5db'
                e.target.style.boxShadow = 'none'
              }}
            />
          </div>

          {/* Secondary Contact Expandable Section */}
          <div style={{ marginBottom: '20px' }}>
            <button
              type="button"
              onClick={() => setShowSecondaryContact(!showSecondaryContact)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '10px 12px',
                width: '100%',
                backgroundColor: '#f9fafb',
                border: '1px solid #e5e7eb',
                borderRadius: '6px',
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: '500',
                color: '#374151',
                transition: 'background-color 0.2s'
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.backgroundColor = '#f3f4f6'
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.backgroundColor = '#f9fafb'
              }}
            >
              <span style={{ 
                transition: 'transform 0.2s',
                transform: showSecondaryContact ? 'rotate(90deg)' : 'rotate(0deg)',
                display: 'inline-block'
              }}>
                ▶
              </span>
              <span>Add Secondary Phone Number (Optional)</span>
            </button>

            {showSecondaryContact && (
              <div style={{ 
                marginTop: '12px',
                padding: '16px',
                backgroundColor: '#f9fafb',
                borderRadius: '6px',
                border: '1px solid #e5e7eb'
              }}>
                <label 
                  htmlFor="secondaryContact"
                  style={{
                    display: 'block',
                    fontSize: '14px',
                    fontWeight: '600',
                    color: '#374151',
                    marginBottom: '8px'
                  }}
                >
                  Secondary Phone Number
                </label>
                <input
                  id="secondaryContact"
                  type="tel"
                  value={secondaryContact}
                  onChange={(e) => setSecondaryContact(e.target.value)}
                  placeholder="(214) 555-5678"
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    fontSize: '14px',
                    border: '1px solid #d1d5db',
                    borderRadius: '6px',
                    boxSizing: 'border-box',
                    outline: 'none',
                    backgroundColor: 'white'
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = '#3b82f6'
                    e.target.style.boxShadow = '0 0 0 3px rgba(59, 130, 246, 0.1)'
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = '#d1d5db'
                    e.target.style.boxShadow = 'none'
                  }}
                />
              </div>
            )}
          </div>

          {/* Date Fields */}
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: '1fr 1fr', 
            gap: '16px',
            marginBottom: '20px'
          }}>
            {/* Start Date */}
            <div>
              <label 
                htmlFor="startDate"
                style={{
                  display: 'block',
                  fontSize: '14px',
                  fontWeight: '600',
                  color: '#374151',
                  marginBottom: '8px'
                }}
              >
                Start Date *
              </label>
              <input
                id="startDate"
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                required
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  fontSize: '14px',
                  border: '1px solid #d1d5db',
                  borderRadius: '6px',
                  boxSizing: 'border-box',
                  outline: 'none'
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = '#3b82f6'
                  e.target.style.boxShadow = '0 0 0 3px rgba(59, 130, 246, 0.1)'
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = '#d1d5db'
                  e.target.style.boxShadow = 'none'
                }}
              />
            </div>

            {/* End Date */}
            <div>
              <label 
                htmlFor="endDate"
                style={{
                  display: 'block',
                  fontSize: '14px',
                  fontWeight: '600',
                  color: '#374151',
                  marginBottom: '8px'
                }}
              >
                End Date *
              </label>
              <input
                id="endDate"
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                required
                min={startDate}
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  fontSize: '14px',
                  border: '1px solid #d1d5db',
                  borderRadius: '6px',
                  boxSizing: 'border-box',
                  outline: 'none'
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = '#3b82f6'
                  e.target.style.boxShadow = '0 0 0 3px rgba(59, 130, 246, 0.1)'
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = '#d1d5db'
                  e.target.style.boxShadow = 'none'
                }}
              />
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div style={{
              backgroundColor: '#fee2e2',
              border: '1px solid #fecaca',
              borderRadius: '6px',
              padding: '12px',
              marginBottom: '20px',
              fontSize: '14px',
              color: '#991b1b'
            }}>
              ⚠️ {error}
            </div>
          )}

          {/* Success Message */}
          {success && (
            <div style={{
              backgroundColor: '#d1fae5',
              border: '1px solid #a7f3d0',
              borderRadius: '6px',
              padding: '12px',
              marginBottom: '20px',
              fontSize: '14px',
              color: '#065f46'
            }}>
              ✅ Vacation notice submitted successfully!
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%',
              padding: '12px',
              backgroundColor: loading ? '#9ca3af' : '#3b82f6',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              fontSize: '16px',
              fontWeight: '600',
              cursor: loading ? 'not-allowed' : 'pointer',
              transition: 'background-color 0.2s'
            }}
            onMouseOver={(e) => {
              if (!loading) {
                e.currentTarget.style.backgroundColor = '#2563eb'
              }
            }}
            onMouseOut={(e) => {
              if (!loading) {
                e.currentTarget.style.backgroundColor = '#3b82f6'
              }
            }}
          >
            {loading ? 'Submitting...' : 'Submit Vacation Notice'}
          </button>
        </form>
      </div>
    </div>
  )
}

