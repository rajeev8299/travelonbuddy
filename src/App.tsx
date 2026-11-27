import React, { useEffect, useRef } from 'react'
import { BrowserRouter, useLocation, useNavigationType } from 'react-router-dom'
import { AppProvider } from './context/AppContext'
import { AppRoutes } from './routes/AppRoutes'

function ScrollToTop() {
  const { pathname, hash } = useLocation()
  const navigationType = useNavigationType()
  const isFirstRender = useRef(true)

  // Disable browser automatic scroll restoration so refreshes always start at (0, 0)
  useEffect(() => {
    if ('scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual'
    }
    if (!hash) {
      window.scrollTo({ top: 0, left: 0, behavior: 'instant' })
    }
  }, [])

  // Scroll to top on internal route changes (PUSH/REPLACE), preserve POP (back/forward)
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false
      return
    }
    if (hash) return
    if (navigationType !== 'POP') {
      window.scrollTo({ top: 0, left: 0, behavior: 'instant' })
    }
  }, [pathname, hash, navigationType])

  return null
}

function getRouterBasename(): string {
  if (typeof window === 'undefined') {
    return '/'
  }

  const isGitHubProjectPages =
    window.location.hostname === 'rajeev8299.github.io'

  return isGitHubProjectPages ? '/travelonbuddy' : '/'
}

export function App() {
  return (
    <BrowserRouter basename={getRouterBasename()}>
      <ScrollToTop />
      <AppProvider>
        <AppRoutes />
      </AppProvider>
    </BrowserRouter>
  )
}

export default App
