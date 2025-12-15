import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { MyNearWalletService } from './services/myNearWalletService';
import { TestnetWalletHelper } from './components/TestnetWalletHelper';
import { EmotionalFractalGenerator } from './components/EmotionalFractalGenerator';

function App() {
  const [wallet, setWallet] = useState<MyNearWalletService | null>(null);
  const [isSignedIn, setIsSignedIn] = useState(false);
  const [accountId, setAccountId] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [emotionalState, setEmotionalState] = useState({
    valence: 0.5, // positive/negative emotion
    arousal: 0.5, // energy level
    dominance: 0.5 // control level
  });
  const [balance, setBalance] = useState<string>('0');
  const [connectionError, setConnectionError] = useState<string>('');
  const [debugInfo, setDebugInfo] = useState<string>('');

  useEffect(() => {
    // Initialize MyNearWallet service for creative engine
    const initWallet = async () => {
      try {
        console.log('Initializing NEAR Creative Engine wallet...');
        const myNearWallet = new MyNearWalletService({
          network: 'testnet',
          contractName: 'test.near'
        });
        
        await myNearWallet.initialize();
        setWallet(myNearWallet);
        
        // Check if already signed in (this handles redirect from wallet)
        if (myNearWallet.isSignedIn()) {
          const accountId = myNearWallet.getAccountId();
          console.log('Already signed in with account:', accountId);
          setIsSignedIn(true);
          setAccountId(accountId);
          setDebugInfo(`Already connected: ${accountId}`);
          
          // Check if this is a redirect from wallet sign-in
          if (localStorage.getItem('near-creative-engine-signin') === 'true') {
            localStorage.removeItem('near-creative-engine-signin');
            // Update balance after successful redirect
            setTimeout(() => updateBalance(), 1000);
          }
        } else {
          console.log('No wallet connection found');
          setDebugInfo('No wallet connection found - please connect your wallet');
        }
      } catch (error: any) {
        console.error('NEAR Creative Engine wallet initialization error:', error);
        setConnectionError(`Wallet initialization failed: ${error.message}`);
      } finally {
        setIsLoading(false);
      }
    };

    initWallet();
  }, []);

  const handleSignIn = async () => {
    if (wallet) {
      try {
        console.log('Attempting to sign in with wallet...');
        setConnectionError('');
        
        // Store current state before redirect
        localStorage.setItem('near-creative-engine-signin', 'true');
        
        await wallet.signIn();
        
        // Check if sign in was successful after redirect
        setTimeout(() => {
          if (wallet.isSignedIn()) {
            const accountId = wallet.getAccountId();
            console.log('Sign in successful! Account:', accountId);
            setIsSignedIn(true);
            setAccountId(accountId);
            setDebugInfo(`Successfully connected: ${accountId}`);
            updateBalance();
          } else {
            console.log('Sign in not detected after redirect');
            setConnectionError('Wallet connection not detected. Please try again.');
          }
        }, 1000);
        
      } catch (error: any) {
        console.error('Failed to connect NEAR wallet for creative engine:', error);
        setConnectionError(`Connection failed: ${error.message}`);
        alert('Failed to connect wallet. Please make sure you have a testnet account and try again.');
      }
    } else {
      console.error('Wallet service not initialized');
      setConnectionError('Wallet service not initialized. Please refresh the page.');
    }
  };

  const handleSignOut = async () => {
    if (wallet) {
      await wallet.signOut();
      setIsSignedIn(false);
      setAccountId('');
      setBalance('0');
    }
  };

  // Update emotional state based on user interaction
  const updateEmotionalState = (newState: Partial<typeof emotionalState>) => {
    setEmotionalState(prev => ({
      ...prev,
      ...newState
    }));
  };

  // Get current balance
  const updateBalance = async () => {
    if (wallet && isSignedIn) {
      try {
        const currentBalance = await wallet.getBalance();
        setBalance(currentBalance);
      } catch (error) {
        console.error('Failed to get balance:', error);
      }
    }
  };

  // Handle fractal generation
  const handleFractalGenerated = (fractalData: any) => {
    console.log('Fractal generated:', fractalData);
    // Here you could save the fractal data or update UI
  };

  // Check if specific testnet account exists
  const checkTestnetAccount = async (accountId: string) => {
    if (wallet) {
      try {
        const exists = await wallet.accountExists(accountId);
        console.log(`Account ${accountId} exists:`, exists);
        return exists;
      } catch (error) {
        console.error(`Error checking account ${accountId}:`, error);
        return false;
      }
    }
    return false;
  };

  // Test your specific testnet account
  const testYourAccount = async () => {
    setDebugInfo('Checking sleeplessmonk.testnet account...');
    const exists = await checkTestnetAccount('sleeplessmonk.testnet');
    if (exists) {
      setDebugInfo('✅ sleeplessmonk.testnet account exists!');
    } else {
      setDebugInfo('❌ sleeplessmonk.testnet account not found. You may need to create it first.');
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
                    <p className="text-blue-300 text-xs">Balance: {parseFloat(balance).toFixed(2)} Ⓝ</p>
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
              <>
                <div className="bg-black/30 backdrop-blur-md rounded-2xl p-8 border border-purple-500/30 mb-8">
                  <h3 className="text-2xl font-semibold text-white mb-4">Step 1: Get Test NEAR</h3>
                  <p className="text-purple-300 mb-6">
                    You need test NEAR tokens to use the creative engine. Use the helper below to get your testnet address and tokens.
                  </p>
                  <TestnetWalletHelper />
                </div>
                
                <div className="bg-black/30 backdrop-blur-md rounded-2xl p-8 border border-blue-500/30 mb-8">
                  <h3 className="text-2xl font-semibold text-white mb-4">Step 2: Test Your Account</h3>
                  <p className="text-blue-300 mb-6">
                    Test if your testnet account (sleeplessmonk.testnet) is properly set up.
                  </p>
                  <button
                    onClick={testYourAccount}
                    className="px-6 py-3 bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-500 hover:to-blue-500 rounded-xl font-bold text-lg transition-all duration-200 shadow-xl mr-4"
                  >
                    🔍 Test Account
                  </button>
                </div>
                
                <div className="bg-black/30 backdrop-blur-md rounded-2xl p-8 border border-blue-500/30">
                  <h3 className="text-2xl font-semibold text-white mb-4">Step 3: Connect Wallet</h3>
                  <p className="text-blue-300 mb-6">
                    Connect your NEAR wallet to access the full creative engine with biometric capture, 
                    AI shader generation, neural fractals, and blockchain NFT minting.
                  </p>
                  <button
                    onClick={handleSignIn}
                    className="px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 rounded-xl font-bold text-lg transition-all duration-200 shadow-xl"
                  >
                    🚀 Connect NEAR Wallet
                  </button>
                </div>
              </>
            )}
          </div>
          
          {/* Creative Tools Interface */}
          {isSignedIn && wallet && (
            <div className="bg-black/30 backdrop-blur-md rounded-2xl p-8 border border-purple-500/30">
              <h3 className="text-2xl font-semibold text-white mb-6">🎨 Creative Tools</h3>
              
              {/* Debug Information */}
              {debugInfo && (
                <div className="mb-4 p-4 bg-blue-900/30 rounded-lg border border-blue-500/30">
                  <p className="text-blue-300 text-sm">{debugInfo}</p>
                </div>
              )}
              
              {connectionError && (
                <div className="mb-4 p-4 bg-red-900/30 rounded-lg border border-red-500/30">
                  <p className="text-red-300 text-sm">{connectionError}</p>
                </div>
              )}
              
              {/* Emotional State Controls */}
              <div className="mb-8 p-6 bg-gradient-to-r from-purple-900/50 to-blue-900/50 rounded-xl border border-purple-500/30">
                <h4 className="text-xl font-bold text-purple-300 mb-4">🎭 Emotional State Controls</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-purple-200 text-sm font-medium mb-2">Valence (Positive/Negative)</label>
                    <input
                      type="range"
                      min="0"
                      max="1"
                      step="0.1"
                      value={emotionalState.valence}
                      onChange={(e) => updateEmotionalState({ valence: parseFloat(e.target.value) })}
                      className="w-full h-2 bg-purple-600 rounded-lg appearance-none cursor-pointer"
                    />
                    <div className="text-xs text-purple-300 mt-1">
                      {emotionalState.valence < 0.3 ? '😞 Negative' : emotionalState.valence > 0.7 ? '😊 Positive' : '😐 Neutral'}
                    </div>
                  </div>
                  <div>
                    <label className="block text-blue-200 text-sm font-medium mb-2">Arousal (Energy Level)</label>
                    <input
                      type="range"
                      min="0"
                      max="1"
                      step="0.1"
                      value={emotionalState.arousal}
                      onChange={(e) => updateEmotionalState({ arousal: parseFloat(e.target.value) })}
                      className="w-full h-2 bg-blue-600 rounded-lg appearance-none cursor-pointer"
                    />
                    <div className="text-xs text-blue-300 mt-1">
                      {emotionalState.arousal < 0.3 ? '😴 Low Energy' : emotionalState.arousal > 0.7 ? '⚡ High Energy' : '😌 Medium Energy'}
                    </div>
                  </div>
                  <div>
                    <label className="block text-green-200 text-sm font-medium mb-2">Dominance (Control Level)</label>
                    <input
                      type="range"
                      min="0"
                      max="1"
                      step="0.1"
                      value={emotionalState.dominance}
                      onChange={(e) => updateEmotionalState({ dominance: parseFloat(e.target.value) })}
                      className="w-full h-2 bg-green-600 rounded-lg appearance-none cursor-pointer"
                    />
                    <div className="text-xs text-green-300 mt-1">
                      {emotionalState.dominance < 0.3 ? '😰 Submissive' : emotionalState.dominance > 0.7 ? '💪 Dominant' : '😊 Balanced'}
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                
                {/* Emotional Fractal Generator */}
                <div className="bg-gradient-to-br from-blue-900/50 to-purple-900/50 rounded-xl p-6 border border-blue-500/30">
                  <h4 className="text-xl font-bold text-blue-300 mb-3">🌀 Emotional Fractals</h4>
                  <p className="text-blue-200 text-sm mb-4">
                    Generate fractals based on your emotional state using WebGPU acceleration
                  </p>
                  <EmotionalFractalGenerator
                    emotionalState={emotionalState}
                    onFractalGenerated={handleFractalGenerated}
                  />
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
  );
}

export default App;
