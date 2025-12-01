'use client'

interface PrivacyPolicyModalProps {
  isOpen: boolean
  onClose: () => void
}

export default function PrivacyPolicyModal({ isOpen, onClose }: PrivacyPolicyModalProps) {
  if (!isOpen) return null

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000,
        padding: '20px'
      }}
      onClick={onClose}
    >
      <div
        style={{
          backgroundColor: 'white',
          padding: '32px',
          borderRadius: '16px',
          boxShadow: '0 20px 60px rgba(0, 0, 0, 0.4)',
          maxWidth: '600px',
          maxHeight: '80vh',
          overflow: 'auto',
          width: '100%'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px' }}>
          <div>
            <h2 style={{
              color: '#1a3a5c',
              fontSize: '24px',
              fontFamily: 'Georgia, serif',
              fontWeight: 700,
              margin: 0
            }}>
              Privacy Policy
            </h2>
            <p style={{
              color: '#6b7280',
              fontSize: '13px',
              margin: '4px 0 0 0'
            }}>
              Last updated: December 2024
            </p>
          </div>
          <button
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              fontSize: '24px',
              cursor: 'pointer',
              color: '#6b7280',
              padding: '4px 8px',
              lineHeight: 1
            }}
            aria-label="Close"
          >
            ×
          </button>
        </div>

        <section style={{ marginBottom: '20px' }}>
          <h3 style={{ color: '#1a3a5c', fontSize: '15px', marginBottom: '8px', marginTop: 0 }}>
            About This Service
          </h3>
          <p style={{ color: '#374151', lineHeight: '1.6', margin: 0, fontSize: '14px' }}>
            This application is provided as a free service to members of the West Inwood
            Extra Neighborhood Patrol (ENP) program. It helps coordinate patrol activities
            and vacation watch requests for our community.
          </p>
        </section>

        <section style={{ marginBottom: '20px' }}>
          <h3 style={{ color: '#1a3a5c', fontSize: '15px', marginBottom: '8px', marginTop: 0 }}>
            Information We Collect
          </h3>
          <ul style={{ color: '#374151', lineHeight: '1.7', paddingLeft: '20px', margin: 0, fontSize: '14px' }}>
            <li>Email address (for login verification)</li>
            <li>Vacation watch requests (address, dates, contact information)</li>
            <li>Session information (to keep you logged in)</li>
          </ul>
        </section>

        <section style={{ marginBottom: '20px' }}>
          <h3 style={{ color: '#1a3a5c', fontSize: '15px', marginBottom: '8px', marginTop: 0 }}>
            How We Use Your Information
          </h3>
          <ul style={{ color: '#374151', lineHeight: '1.7', paddingLeft: '20px', margin: 0, fontSize: '14px' }}>
            <li>Verify your membership in the ENP program</li>
            <li>Send login verification codes to your email</li>
            <li>Communicate vacation watch requests to patrol officers</li>
          </ul>
        </section>

        <section style={{ marginBottom: '20px' }}>
          <h3 style={{ color: '#1a3a5c', fontSize: '15px', marginBottom: '8px', marginTop: 0 }}>
            How We Protect Your Information
          </h3>
          <ul style={{ color: '#374151', lineHeight: '1.7', paddingLeft: '20px', margin: 0, fontSize: '14px' }}>
            <li>Access is restricted to verified ENP members only</li>
            <li>Data is stored in secure, access-controlled systems</li>
            <li>Vacation information is shared only with designated patrol officers</li>
            <li>We do not sell or share your information with third parties</li>
          </ul>
        </section>

        <section style={{ marginBottom: '20px' }}>
          <h3 style={{ color: '#1a3a5c', fontSize: '15px', marginBottom: '8px', marginTop: 0 }}>
            Data Storage
          </h3>
          <p style={{ color: '#374151', lineHeight: '1.6', margin: 0, fontSize: '14px' }}>
            Your information is stored using Google Workspace and Firebase services,
            which provide industry-standard security measures. Access is restricted
            to program administrators only.
          </p>
        </section>

        <section style={{ marginBottom: '20px' }}>
          <h3 style={{ color: '#1a3a5c', fontSize: '15px', marginBottom: '8px', marginTop: 0 }}>
            Your Rights
          </h3>
          <p style={{ color: '#374151', lineHeight: '1.6', margin: 0, fontSize: '14px' }}>
            You may request to view, update, or delete your personal information at any time
            by contacting the ENP program administrator.
          </p>
        </section>

        <section style={{ marginBottom: '24px' }}>
          <h3 style={{ color: '#1a3a5c', fontSize: '15px', marginBottom: '8px', marginTop: 0 }}>
            Disclaimer
          </h3>
          <p style={{ color: '#374151', lineHeight: '1.6', margin: 0, fontSize: '14px' }}>
            This application is provided as-is as a free community service. While we take
            reasonable measures to protect your information, we make no warranties regarding
            the security or availability of this service.
          </p>
        </section>

        <button
          onClick={onClose}
          style={{
            width: '100%',
            padding: '12px',
            background: 'linear-gradient(135deg, #1976d2 0%, #1565c0 100%)',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            fontSize: '14px',
            fontWeight: '600',
            cursor: 'pointer'
          }}
        >
          Close
        </button>
      </div>
    </div>
  )
}
