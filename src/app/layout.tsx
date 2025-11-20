import type { Metadata } from 'next'
import Script from 'next/script'
import { readFileSync } from 'fs'
import { join } from 'path'

export const metadata: Metadata = {
  title: 'West Inwood Neighborhood Association | Extended Neighborhood Patrol',
  description: 'West Inwood Neighborhood Association - Extended Neighborhood Patrol program connecting neighbors and promoting safety in West Inwood, Dallas.',
  keywords: ['West Inwood', 'neighborhood association', 'neighborhood patrol', 'Dallas', 'safety', 'ENP'],
  authors: [{ name: 'West Inwood Neighborhood Association' }],
  themeColor: '#1a3a5c',
  manifest: '/manifest.json',
  // Icons are auto-detected from src/app/icon.svg and src/app/apple-icon.png
  openGraph: {
    title: 'West Inwood Neighborhood Association',
    description: 'Extended Neighborhood Patrol program connecting neighbors and promoting safety in West Inwood, Dallas.',
    type: 'website',
    locale: 'en_US',
    siteName: 'West Inwood Neighborhood Association',
    images: [
      {
        url: '/logo512.png',
        width: 512,
        height: 512,
        alt: 'West Inwood Logo',
      },
    ],
  },
  twitter: {
    card: 'summary',
    title: 'West Inwood Neighborhood Association',
    description: 'Extended Neighborhood Patrol program connecting neighbors and promoting safety in West Inwood, Dallas.',
    images: ['/logo512.png'],
  },
}

interface RootLayoutProps {
  children: React.ReactNode
}

function getStaticAssets() {
  try {
    const htmlPath = join(process.cwd(), 'public', 'index.html')
    const html = readFileSync(htmlPath, 'utf-8')
    const scriptMatch = html.match(/src="([^"]+)"/)
    const cssMatch = html.match(/href="([^"]+)" rel="stylesheet"/)
    return {
      script: scriptMatch ? scriptMatch[1] : '/js/main.1044b296.js',
      css: cssMatch ? cssMatch[1] : '/css/main.3987566b.css'
    }
  } catch (error) {
    return {
      script: '/js/main.1044b296.js',
      css: '/css/main.3987566b.css'
    }
  }
}

export default function RootLayout({ children }: RootLayoutProps) {
  const assets = getStaticAssets()
  
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
        <link rel="alternate icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/logo192.png" />
        <link rel="manifest" href="/manifest.json" />
        <link href={assets.css} rel="stylesheet" />
      </head>
      <body suppressHydrationWarning>
        {children}
        <Script src={assets.script} defer strategy="lazyOnload" />
      </body>
    </html>
  )
}
