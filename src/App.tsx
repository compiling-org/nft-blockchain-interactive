import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { ComprehensiveAIMLBlockchainIntegration } from './components/ComprehensiveAIMLBlockchainIntegration_REAL';
import FractalStudio from './pages/FractalStudio';
import AIFractalStudio from './pages/AIFractalStudio';
import SolanaEmotionalNFT from './pages/SolanaEmotionalNFT';
import BitteAIMarketplace from './pages/BitteAIMarketplace';
import PolkadotSoulboundIdentity from './pages/PolkadotSoulboundIdentity';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-900">
        <header className="bg-gray-800 shadow">
          <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
            <h1 className="text-3xl font-bold text-white">
              Blockchain/AI/ML Integration Platform
            </h1>
            <p className="text-gray-300 mt-2">
              Real NEAR Wallet Integration • BrainFlow EEG Processing • ONNX Runtime • Cross-Chain Messaging
            </p>
            <nav className="mt-4">
              <Link to="/" className="text-blue-400 hover:text-blue-300 mr-6">Home</Link>
              <Link to="/fractal-studio" className="text-blue-400 hover:text-blue-300 mr-6">Fractal Studio</Link>
              <Link to="/ai-fractal-studio" className="text-blue-400 hover:text-blue-300 mr-6">AI Fractal Studio</Link>
              <Link to="/solana-nft" className="text-blue-400 hover:text-blue-300 mr-6">Solana NFT</Link>
              <Link to="/bitte-marketplace" className="text-blue-400 hover:text-blue-300 mr-6">Bitte AI Marketplace</Link>
              <Link to="/polkadot-identity" className="text-blue-400 hover:text-blue-300">Polkadot Identity</Link>
            </nav>
          </div>
        </header>
        
        <main>
          <Routes>
            <Route path="/" element={<ComprehensiveAIMLBlockchainIntegration />} />
            <Route path="/fractal-studio" element={<FractalStudio />} />
            <Route path="/ai-fractal-studio" element={<AIFractalStudio />} />
            <Route path="/solana-nft" element={<SolanaEmotionalNFT />} />
            <Route path="/bitte-marketplace" element={<BitteAIMarketplace />} />
            <Route path="/polkadot-identity" element={<PolkadotSoulboundIdentity />} />
          </Routes>
        </main>
        
        <footer className="bg-gray-800">
          <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8">
            <p className="text-center text-gray-400 text-sm">
              Now with REAL wallet connections and smart contract integration!
            </p>
          </div>
        </footer>
      </div>
    </Router>
  );
}

export default App;