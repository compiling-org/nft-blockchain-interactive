import React, { Suspense } from 'react'
import ReactDOM from 'react-dom/client'
import { HashRouter, Routes, Route, Link } from 'react-router-dom'
import './index.css'

// Lazy loaded components - Fix paths to include src/
const CreativeEngineApp = React.lazy(() => import('./App')) // App.tsx is in root
const NEARCreativeEngine = React.lazy(() => import('./src/pages/NEARCreativeEngine'))
const ComprehensiveBitteMarketplace = React.lazy(() => import('./src/pages/ComprehensiveBitteMarketplace'))
const EnhancedBitteMarketplace = React.lazy(() => import('./src/pages/EnhancedBitteMarketplace'))
const SolanaEmotionalNFTWrapper = React.lazy(() => import('./src/pages/SolanaEmotionalNFT'))
const RustFoundationUI = React.lazy(() => import('./src/pages/RustFoundationUI'))
const FilecoinStorageIntegration = React.lazy(() => import('./src/components/FilecoinStorageIntegration'))
const PolkadotInfo = React.lazy(() => import('./src/components/PolkadotInfo'))

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

function RootRouter() {
  return (
    <HashRouter>
      <div className="min-h-screen bg-gray-900 text-white">
        <header className="bg-black/40 border-b border-gray-800">
          <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
            <div className="text-xl font-bold">Unified Creative + Marketplace</div>
            <nav className="flex gap-4 text-sm items-center">
              <Link to="/marketplace" className="text-gray-300 hover:text-white">Marketplace</Link>
              <Link to="/near" className="text-gray-300 hover:text-white">NEAR Test</Link>
              <Link to="/near-engine" className="text-gray-300 hover:text-white">Creative Engine</Link>
              <Link to="/enhanced" className="text-gray-300 hover:text-white">Enhanced</Link>
              <Link to="/solana" className="text-gray-300 hover:text-white">Solana NFT</Link>
              <Link to="/polkadot-info" className="text-gray-300 hover:text-white">Polkadot</Link>
              <Link to="/rust-foundation" className="text-gray-300 hover:text-white">Rust</Link>
              <Link to="/filecoin" className="text-gray-300 hover:text-white">Filecoin</Link>
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
              <Route path="/" element={<ComprehensiveBitteMarketplace />} />
              <Route path="/marketplace" element={<ComprehensiveBitteMarketplace />} />
              <Route path="/near" element={<NEARCreativeEngine />} />
              <Route path="/near-engine" element={<CreativeEngineApp />} />
              <Route path="/enhanced" element={<EnhancedBitteMarketplace />} />
              <Route path="/solana" element={<SolanaEmotionalNFTWrapper />} />
              <Route path="/solana-nft" element={<SolanaEmotionalNFTWrapper />} />
              <Route path="/polkadot-info" element={<PolkadotInfo />} />
              <Route path="/rust-foundation" element={<RustFoundationUI />} />
              <Route path="/filecoin" element={<FilecoinStorageIntegration canvas={null} emotionData={{ valence: 0.5, arousal: 0.5, dominance: 0.5, confidence: 1.0 }} biometricData="" onStorageComplete={() => { }} onError={() => { }} />} />
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
