import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { MyNearWalletService } from './services/myNearWalletService';

function NEARCreativeEngineApp() {
  const [wallet, setWallet] = useState<MyNearWalletService | null>(null);
  const [isSignedIn, setIsSignedIn] = useState(false);
  const [accountId, setAccountId] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Initialize MyNearWallet service for creative engine
    const initWallet = async () => {
      try {
        const myNearWallet = new MyNearWalletService({
          network: 'testnet',
          contractName: 'bio-nft-1764175259.sleeplessmonk-testnet-1764175172.testnet'
        });
        
        await myNearWallet.initialize();
        setWallet(myNearWallet);
        
        // Check if already signed in
        if (myNearWallet.isSignedIn()) {
          setIsSignedIn(true);
          setAccountId(myNearWallet.getAccountId());
        }
      } catch (error) {
        console.log('NEAR Creative Engine wallet initialization error:', error);
      } finally {
        setIsLoading(false);
      }
    };

    initWallet();
  }, []);

  const handleSignIn = async () => {
    if (wallet) {
      try {
        await wallet.signIn();
        if (wallet.isSignedIn()) {
          setIsSignedIn(true);
          setAccountId(wallet.getAccountId());
        }
      } catch (error) {
        console.error('Failed to connect NEAR wallet for creative engine:', error);
      }
    }
  };

  const handleSignOut = async () => {
    if (wallet) {
      await wallet.signOut();
      setIsSignedIn(false);
      setAccountId('');
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-purple-400 mx-auto mb-4"></div>
          <h2 className="text-2xl font-bold text-white mb-2">NEAR Creative Engine</h2>
          <p className="text-purple-300">Initializing creative tools...</p>
        </div>
      </div>
    );
  }

  return (
    <Router>
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
        <header className="bg-black/30 backdrop-blur-md border-b border-purple-500/30">
          <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                  NEAR Creative Engine
                </h1>
                <p className="text-purple-300 mt-2 text-lg">
                  AI-Powered Creative Generation • Biometric Art • Neural Fractals • Blockchain NFTs
                </p>
              </div>
              
              <div className="flex items-center space-x-4">
                {isSignedIn ? (
                  <>
                    <div className="text-right">
                      <p className="text-green-400 text-sm font-medium">{accountId}</p>
                      <p className="text-purple-300 text-xs">Connected to NEAR</p>
                    </div>
                    <button
                      onClick={handleSignOut}
                      className="px-4 py-2 bg-red-600/80 hover:bg-red-600 backdrop-blur-sm rounded-lg text-sm transition-all duration-200 border border-red-500/30"
                    >
                      Disconnect
                    </button>
                  </>
                ) : (
                  <button
                    onClick={handleSignIn}
                    className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 rounded-lg font-medium transition-all duration-200 shadow-lg"
                  >
                    Connect NEAR Wallet
                  </button>
                )}
              </div>
            </div>
          </div>
        </header>
        
        <main className="container mx-auto px-4 py-8">
          <div className="space-y-8">
            {/* Creative Engine Hero */}
            <div className="text-center py-12">
              <h2 className="text-5xl font-bold bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent mb-6">
                Transform Emotions into Digital Art
              </h2>
              <p className="text-xl text-purple-200 max-w-3xl mx-auto mb-8">
                Harness the power of NEAR blockchain, AI, and biometric data to create unique, 
                emotionally-responsive digital artworks. Mint your creations as NFTs and build 
                your creative legacy on the blockchain.
              </p>
              
              {!isSignedIn && (
                <div className="bg-black/30 backdrop-blur-md rounded-2xl p-8 border border-purple-500/30">
                  <h3 className="text-2xl font-semibold text-white mb-4">Ready to Create?</h3>
                  <p className="text-purple-300 mb-6">
                    Connect your NEAR wallet to access the full creative engine with biometric capture, 
                    AI shader generation, neural fractals, and blockchain NFT minting.
                  </p>
                  <button
                    onClick={handleSignIn}
                    className="px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 rounded-xl font-bold text-lg transition-all duration-200 shadow-xl"
                  >
                    🚀 Launch Creative Engine
                  </button>
                </div>
              )}
            </div>
            
            {/* Creative Tools Interface */}
            {isSignedIn && wallet && (
              <div className="bg-black/30 backdrop-blur-md rounded-2xl p-8 border border-purple-500/30">
                <h3 className="text-2xl font-semibold text-white mb-6">🎨 Creative Tools</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  
                  {/* Emotional Fractal Generator */}
                  <div className="bg-gradient-to-br from-blue-900/50 to-purple-900/50 rounded-xl p-6 border border-blue-500/30">
                    <h4 className="text-xl font-bold text-blue-300 mb-3">🌀 Emotional Fractals</h4>
                    <p className="text-blue-200 text-sm mb-4">
                      Generate fractals based on your emotional state using WebGPU acceleration
                    </p>
                    <button className="w-full px-4 py-2 bg-blue-600 hover:bg-blue-500 rounded-lg text-white transition-colors">
                      Generate Fractal
                    </button>
                  </div>
                  
                  {/* AI Shader Generator */}
                  <div className="bg-gradient-to-br from-green-900/50 to-teal-900/50 rounded-xl p-6 border border-green-500/30">
                    <h4 className="text-xl font-bold text-green-300 mb-3">🎨 AI Shader Generator</h4>
                    <p className="text-green-200 text-sm mb-4">
                      Create unique shaders with GLSL code generation powered by AI
                    </p>
                    <button className="w-full px-4 py-2 bg-green-600 hover:bg-green-500 rounded-lg text-white transition-colors">
                      Generate Shader
                    </button>
                  </div>
                  
                  {/* Neural Audio Synthesizer */}
                  <div className="bg-gradient-to-br from-orange-900/50 to-red-900/50 rounded-xl p-6 border border-orange-500/30">
                    <h4 className="text-xl font-bold text-orange-300 mb-3">🎵 Neural Audio</h4>
                    <p className="text-orange-200 text-sm mb-4">
                      Synthesize audio with emotional modulation using neural networks
                    </p>
                    <button className="w-full px-4 py-2 bg-orange-600 hover:bg-orange-500 rounded-lg text-white transition-colors">
                      Generate Audio
                    </button>
                  </div>
                  
                  {/* Biometric Data Artist */}
                  <div className="bg-gradient-to-br from-purple-900/50 to-pink-900/50 rounded-xl p-6 border border-purple-500/30">
                    <h4 className="text-xl font-bold text-purple-300 mb-3">📊 Biometric Art</h4>
                    <p className="text-purple-200 text-sm mb-4">
                      Transform your biometric data into real-time visualizations
                    </p>
                    <button className="w-full px-4 py-2 bg-purple-600 hover:bg-purple-500 rounded-lg text-white transition-colors">
                      Create Biometric Art
                    </button>
                  </div>
                  
                  {/* Pattern Recognition */}
                  <div className="bg-gradient-to-br from-cyan-900/50 to-blue-900/50 rounded-xl p-6 border border-cyan-500/30">
                    <h4 className="text-xl font-bold text-cyan-300 mb-3">🔍 Pattern Recognition</h4>
                    <p className="text-cyan-200 text-sm mb-4">
                      Machine learning pattern recognition in your creative data
                    </p>
                    <button className="w-full px-4 py-2 bg-cyan-600 hover:bg-cyan-500 rounded-lg text-white transition-colors">
                      Analyze Patterns
                    </button>
                  </div>
                  
                  {/* Neural Evolution Engine */}
                  <div className="bg-gradient-to-br from-yellow-900/50 to-orange-900/50 rounded-xl p-6 border border-yellow-500/30">
                    <h4 className="text-xl font-bold text-yellow-300 mb-3">🧬 Neural Evolution</h4>
                    <p className="text-yellow-200 text-sm mb-4">
                      Evolve your creations using genetic algorithms and neural evolution
                    </p>
                    <button className="w-full px-4 py-2 bg-yellow-600 hover:bg-yellow-500 rounded-lg text-white transition-colors">
                      Evolve Creation
                    </button>
                  </div>
                </div>
                
                {/* Mint NFT Section */}
                <div className="mt-8 p-6 bg-gradient-to-r from-indigo-900/50 to-purple-900/50 rounded-xl border border-indigo-500/30">
                  <h4 className="text-xl font-bold text-indigo-300 mb-4">⛓️ Blockchain Integration</h4>
                  <p className="text-indigo-200 text-sm mb-4">
                    Mint your creative works as NFTs on the NEAR blockchain with emotional metadata
                  </p>
                  <div className="flex gap-4">
                    <button className="px-6 py-3 bg-indigo-600 hover:bg-indigo-500 rounded-lg text-white transition-colors">
                      Mint as NFT
                    </button>
                    <button className="px-6 py-3 bg-purple-600 hover:bg-purple-500 rounded-lg text-white transition-colors">
                      View Gallery
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </main>
        
        <footer className="bg-black/30 backdrop-blur-md border-t border-purple-500/30 mt-16">
          <div className="max-w-7xl mx-auto py-8 px-4">
            <div className="text-center">
              <p className="text-purple-300 text-lg mb-2">
                NEAR Creative Engine - Where Art Meets Blockchain
              </p>
              <p className="text-purple-400 text-sm">
                Powered by NEAR Protocol • AI Shader Generation • Biometric Art • Neural Fractals
              </p>
            </div>
          </div>
        </footer>
      </div>
    </Router>
  );
}

export default NEARCreativeEngineApp;
