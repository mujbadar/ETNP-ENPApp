export default function PrivacyPolicyPage() {
  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #0f172a 0%, #1a3a5c 50%, #2c5282 100%)',
      padding: '40px 20px'
    }}>
      <div style={{
        backgroundColor: 'white',
        padding: '48px',
        borderRadius: '16px',
        boxShadow: '0 20px 60px rgba(0, 0, 0, 0.4)',
        maxWidth: '800px',
        margin: '0 auto'
      }}>
        <h1 style={{
          color: '#1a3a5c',
          fontSize: '28px',
          fontFamily: 'Georgia, serif',
          fontWeight: 700,
          marginBottom: '8px',
          marginTop: 0
        }}>
          Privacy Policy
        </h1>
        <p style={{
          color: '#6b7280',
          fontSize: '14px',
          marginBottom: '32px'
        }}>
          Last updated: December 2024
        </p>

        <section style={{ marginBottom: '28px' }}>
          <h2 style={{ color: '#1a3a5c', fontSize: '18px', marginBottom: '12px' }}>
            About This Service
          </h2>
          <p style={{ color: '#374151', lineHeight: '1.7', margin: 0 }}>
            This application is provided as a free service to members of the West Inwood
            Extra Neighborhood Patrol (ENP) program. It helps coordinate patrol activities
            and vacation watch requests for our community.
          </p>
        </section>

        <section style={{ marginBottom: '28px' }}>
          <h2 style={{ color: '#1a3a5c', fontSize: '18px', marginBottom: '12px' }}>
            Information We Collect
          </h2>
          <p style={{ color: '#374151', lineHeight: '1.7', marginBottom: '12px' }}>
            To provide this service, we collect and process:
          </p>
          <ul style={{ color: '#374151', lineHeight: '1.8', paddingLeft: '24px', margin: 0 }}>
            <li>Email address (for login verification)</li>
            <li>Vacation watch requests (address, dates, contact information)</li>
            <li>Session information (to keep you logged in)</li>
          </ul>
        </section>

        <section style={{ marginBottom: '28px' }}>
          <h2 style={{ color: '#1a3a5c', fontSize: '18px', marginBottom: '12px' }}>
            How We Use Your Information
          </h2>
          <ul style={{ color: '#374151', lineHeight: '1.8', paddingLeft: '24px', margin: 0 }}>
            <li>Verify your membership in the ENP program</li>
            <li>Send login verification codes to your email</li>
            <li>Communicate vacation watch requests to patrol officers</li>
          </ul>
        </section>

        <section style={{ marginBottom: '28px' }}>
          <h2 style={{ color: '#1a3a5c', fontSize: '18px', marginBottom: '12px' }}>
            How We Protect Your Information
          </h2>
          <ul style={{ color: '#374151', lineHeight: '1.8', paddingLeft: '24px', margin: 0 }}>
            <li>Access is restricted to verified ENP members only</li>
            <li>Data is stored in secure, access-controlled systems</li>
            <li>Vacation information is shared only with designated patrol officers</li>
            <li>We do not sell or share your information with third parties</li>
          </ul>
        </section>

        <section style={{ marginBottom: '28px' }}>
          <h2 style={{ color: '#1a3a5c', fontSize: '18px', marginBottom: '12px' }}>
            Data Storage
          </h2>
          <p style={{ color: '#374151', lineHeight: '1.7', margin: 0 }}>
            Your information is stored using Google Workspace and Firebase services,
            which provide industry-standard security measures. Access is restricted
            to program administrators only.
          </p>
        </section>

        <section style={{ marginBottom: '28px' }}>
          <h2 style={{ color: '#1a3a5c', fontSize: '18px', marginBottom: '12px' }}>
            Your Rights
          </h2>
          <p style={{ color: '#374151', lineHeight: '1.7', margin: 0 }}>
            You may request to view, update, or delete your personal information at any time
            by contacting the ENP program administrator.
          </p>
        </section>

        <section style={{ marginBottom: '32px' }}>
          <h2 style={{ color: '#1a3a5c', fontSize: '18px', marginBottom: '12px' }}>
            Disclaimer
          </h2>
          <p style={{ color: '#374151', lineHeight: '1.7', margin: 0 }}>
            This application is provided as-is as a free community service. While we take
            reasonable measures to protect your information, we make no warranties regarding
            the security or availability of this service.
          </p>
        </section>

        <div style={{
          borderTop: '1px solid #e5e7eb',
          paddingTop: '24px',
          textAlign: 'center'
        }}>
          <a
            href="/patrol/login"
            style={{
              color: '#1976d2',
              textDecoration: 'none',
              fontWeight: '500',
              fontSize: '14px'
            }}
          >
            ← Back to Login
          </a>
        </div>
      </div>
    </div>
  )
}
