import React from 'react'
import { BrowserRouter } from 'react-router-dom'
import { AppProvider } from './context/AppContext'
import { AppRoutes } from './routes/AppRoutes'

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
      <AppProvider>
        <AppRoutes />
      </AppProvider>
    </BrowserRouter>
  )
}

export default App
