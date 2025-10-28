'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function RootPage() {
  const router = useRouter()

  useEffect(() => {
    // Fetch the built static HTML
    fetch('/index.html')
      .then(res => res.text())
      .then(html => {
        // Parse and inject the HTML
        const parser = new DOMParser()
        const doc = parser.parseFromString(html, 'text/html')
        const scripts = doc.querySelectorAll('script[src]')
        const links = doc.querySelectorAll('link[href]')
        
        // Insert stylesheets
        links.forEach(link => {
          if (link.getAttribute('rel') === 'stylesheet') {
            const href = link.getAttribute('href')
            const linkEl = document.createElement('link')
            linkEl.rel = 'stylesheet'
            linkEl.href = href || ''
            document.head.appendChild(linkEl)
          }
        })
        
        // Insert scripts
        scripts.forEach(script => {
          const src = script.getAttribute('src')
          if (src) {
            const scriptEl = document.createElement('script')
            scriptEl.src = src
            scriptEl.defer = true
            document.body.appendChild(scriptEl)
          }
        })
      })
      .catch(console.error)
  }, [])

  return <div id="root"></div>
}
