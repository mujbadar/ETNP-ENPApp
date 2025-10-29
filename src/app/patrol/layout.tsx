import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Member Patrol Dashboard | West Inwood Community Partnership',
  description: 'Live patrol status and location tracking for West Inwood Extended Neighborhood Patrol members.',
  themeColor: '#1a3a5c',
}

interface RootLayoutProps {
  children: React.ReactNode
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#1a3a5c" />
        <meta name="description" content="Live patrol status and location tracking for West Inwood Extended Neighborhood Patrol members." />
        <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
        <link rel="alternate icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/logo192.png" />
      </head>
      <body>
        {children}
      </body>
    </html>
  )
}
