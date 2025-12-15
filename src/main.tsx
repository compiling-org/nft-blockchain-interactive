import React, { Suspense, useEffect, useState } from 'react'
import ReactDOM from 'react-dom/client'
import { HashRouter, Routes, Route, Link, Navigate } from 'react-router-dom'
import './index.css'
const CreativeEngineApp = React.lazy(() => import('./App'))
const NEARCreativeEngine = React.lazy(() => import('./pages/NEARCreativeEngine'))
import SolanaEmotionalNFTWrapper from './pages/SolanaEmotionalNFT'
const ComprehensiveBitteMarketplace = React.lazy(() => import('./pages/ComprehensiveBitteMarketplace'))
const EnhancedBitteMarketplace = React.lazy(() => import('./pages/EnhancedBitteMarketplace'))

function Alive() {
  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center justify-center">
      <div className="text-2xl font-bold">Server is running</div>
      <div className="mt-4 text-gray-300">Open the marketplace below</div>
      <a href="#/marketplace" className="mt-6 bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg">Go to Marketplace</a>
    </div>
  )
}

class ErrorBoundary extends React.Component<{ children: React.ReactNode }, { hasError: boolean; message: string }> {
  constructor(props: { children: React.ReactNode }) {
    super(props)
    this.state = { hasError: false, message: '' }
  }
  static getDerivedStateFromError(error: unknown) {
    return { hasError: true, message: error instanceof Error ? error.message : 'Unknown error' }
  }
  componentDidCatch(error: unknown) {
    console.error('App error:', error)
  }
  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-black text-white flex items-center justify-center">
          <div className="max-w-md text-center">
            <div className="text-xl font-bold mb-2">Runtime error</div>
            <div className="text-sm text-gray-300 mb-6">{this.state.message}</div>
            <a href="/" className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded">Reload</a>
          </div>
        </div>
      )
    }
    return this.props.children
  }
}

function DebugBar() {
  const [status, setStatus] = useState<'ok' | 'fail' | 'loading'>('loading')
  useEffect(() => {
    let cancelled = false
    const check = async () => {
      try {
        const res = await fetch('/api/health')
        if (!cancelled) setStatus(res.ok ? 'ok' : 'fail')
      } catch {
        if (!cancelled) setStatus('fail')
      }
    }
    check()
    const id = setInterval(check, 5000)
    return () => {
      cancelled = true
      clearInterval(id)
    }
  }, [])
  return (
    <div className="fixed top-0 left-0 right-0 z-50">
      <div className="mx-auto max-w-7xl flex items-center justify-between px-4 py-2 bg-black/60 backdrop-blur border-b border-gray-800">
        <div className="text-sm text-gray-300">Route: {typeof window !== 'undefined' ? window.location.pathname : '/'}</div>
        <div className={`text-xs ${status === 'ok' ? 'text-green-400' : status === 'loading' ? 'text-yellow-300' : 'text-red-400'}`}>
          API: {status === 'ok' ? 'healthy' : status === 'loading' ? 'checking...' : 'down'}
        </div>
      </div>
    </div>
  )
}

function RootRouter() {
  return (
    <HashRouter>
      <div className="min-h-screen bg-gray-900 text-white">
        
        <header className="bg-black/40 border-b border-gray-800">
          <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
            <div className="text-xl font-bold">Unified Creative + Marketplace</div>
            <nav className="flex gap-4 text-sm">
              <Link to="/marketplace" className="text-gray-300 hover:text-white">Marketplace</Link>
              <Link to="/near" className="text-gray-300 hover:text-white">NEAR Wallet Test</Link>
              <Link to="/near-engine" className="text-gray-300 hover:text-white">Creative Engine (App)</Link>
              <Link to="/solana" className="text-gray-300 hover:text-white">Solana Emotional NFT</Link>
            </nav>
          </div>
        </header>
        <ErrorBoundary>
          <Suspense fallback={
            <div className="flex items-center justify-center py-16">
              <div className="text-gray-300">Loading...</div>
            </div>
          }>
            <Routes>
              <Route path="/" element={<SolanaEmotionalNFTWrapper />} />
              <Route path="/marketplace" element={<ComprehensiveBitteMarketplace />} />
              <Route path="/near" element={<NEARCreativeEngine />} />
              <Route path="/near-engine" element={<CreativeEngineApp />} />
              <Route path="/enhanced" element={<EnhancedBitteMarketplace />} />
              <Route path="/solana" element={<SolanaEmotionalNFTWrapper />} />
            </Routes>
          </Suspense>
        </ErrorBoundary>
      </div>
    </HashRouter>
  )
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <RootRouter />
  </React.StrictMode>,
)
