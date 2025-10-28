import type { Metadata } from 'next'
import Script from 'next/script'
import { readFileSync } from 'fs'
import { join } from 'path'

export const metadata: Metadata = {
  title: 'West Inwood ENP',
  description: 'Neighborhood Security System',
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
        <link rel="icon" href="/favicon.ico" />
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
