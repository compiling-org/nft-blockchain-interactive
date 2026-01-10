import React, { useState, useEffect, useCallback } from 'react';
import { RealIntegratedRenderer } from './RealIntegratedRenderer';
import { AIShaderGenerator } from '../utils/ai-shader-generator';
import { RealFilecoinStorage } from '../utils/real-filecoin-storage';

interface RealBitteMarketplaceProps {
  wallet: any; // UnifiedWalletConnector
  isSignedIn: boolean;
}

export const RealBitteMarketplace: React.FC<RealBitteMarketplaceProps> = ({ wallet, isSignedIn }) => {
  const [aiShaderGenerator, setAiShaderGenerator] = useState<AIShaderGenerator | null>(null);
  const [filecoinStorage, setFilecoinStorage] = useState<RealFilecoinStorage | null>(null);
  const [biometricSession, setBiometricSession] = useState<any>(null);
  const [generatedShader, setGeneratedShader] = useState<string>('');
  const [storedAsset, setStoredAsset] = useState<any>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [status, setStatus] = useState<string>('');

  // Initialize real services
  useEffect(() => {
    const initializeServices = async () => {
      try {
        setStatus('Initializing AI services...');
        
        // Initialize AI Shader Generator
        const shaderGen = new AIShaderGenerator();
        await shaderGen.initialize();
        setAiShaderGenerator(shaderGen);
        
        // Initialize Filecoin Storage (requires NFT.Storage token)
        const storage = new RealFilecoinStorage({
          nftStorageApiKey: process.env.REACT_APP_NFT_STORAGE_TOKEN || 'your-nft-storage-token'
        });
        setFilecoinStorage(storage);
        
        setStatus('AI services initialized successfully!');
      } catch (error) {
        console.error('Failed to initialize services:', error);
        setStatus('Failed to initialize services');
      }
    };

    if (isSignedIn) {
      initializeServices();
    }

    return () => {
      // Cleanup
      if (aiShaderGenerator) {
        aiShaderGenerator.dispose();
      }
    };
  }, [isSignedIn]);

  // Handle biometric session completion
  const handleBiometricSessionComplete = useCallback(async (sessionData: any) => {
    if (!aiShaderGenerator || !filecoinStorage) {
      setStatus('Services not initialized');
      return;
    }

    setIsProcessing(true);
    setStatus('Processing biometric data...');

    try {
      setBiometricSession(sessionData);
      
      // Generate AI shader from biometric data
      setStatus('Generating AI shader...');
      const shaderRequest = {
        prompt: `Biometric visualization based on ${sessionData.dominantEmotion} emotion with ${sessionData.confidence} confidence`,
        type: 'biometric' as const,
        biometricData: sessionData
      };
      
      const shader = await aiShaderGenerator.generateShader(shaderRequest);
      setGeneratedShader(shader);
      
      // Store shader and biometric data on Filecoin
      setStatus('Storing on Filecoin...');
      const stored = await filecoinStorage.storeBiometricSession(sessionData);
      
      setStoredAsset(stored);
      
      // Create soulbound NFT if user is signed in
      if (isSignedIn) {
        // For now, just store the biometric data without NEAR contract
        setStatus('Biometric session completed and stored on Filecoin!');
      } else {
        setStatus('Biometric session completed and stored!');
      }
    } catch (error) {
      console.error('Biometric processing failed:', error);
      setStatus('Failed to process biometric data');
    } finally {
      setIsProcessing(false);
    }
  }, [aiShaderGenerator, filecoinStorage, isSignedIn]);

  // Handle AI shader generation from prompt
  const handleGenerateShader = useCallback(async (prompt: string, type: 'fractal' | 'audio-reactive' | 'biometric' | 'abstract') => {
    if (!aiShaderGenerator) {
      setStatus('AI Shader Generator not initialized');
      return;
    }

    setIsProcessing(true);
    setStatus('Generating AI shader...');

    try {
      const shaderRequest = {
        prompt,
        type,
        biometricData: biometricSession
      };
      
      const shader = await aiShaderGenerator.generateShader(shaderRequest);
      setGeneratedShader(shader);
      
      // Store on Filecoin if available
      if (filecoinStorage) {
        const shaderData = {
          name: `AI Shader ${Date.now()}`,
          description: prompt,
          code: shader,
          type: 'wgsl' as const,
          parameters: {},
          audioReactive: true,
          biometricDriven: true
        };
        const stored = await filecoinStorage.storeShaderCode(shaderData);
        setStoredAsset(stored);
      }
      
      setStatus('AI shader generated successfully!');
    } catch (error) {
      console.error('Shader generation failed:', error);
      setStatus('Failed to generate shader');
    } finally {
      setIsProcessing(false);
    }
  }, [aiShaderGenerator, filecoinStorage, biometricSession, isSignedIn]);

  // Handle wallet connection
  const handleConnectWallet = async () => {
    try {
      await wallet.signIn();
    } catch (error) {
      console.error('Failed to connect wallet:', error);
      setStatus('Failed to connect wallet');
    }
  };

  // Get user's existing tokens
  const loadUserTokens = useCallback(async () => {
    // For now, just show a message since we don't have NEAR contract integration
    setStatus('NEAR contract integration coming soon...');
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 text-white">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent">
            Real Bitte AI Marketplace
          </h1>
          <p className="text-lg text-gray-300">
            Create AI-generated shaders from biometric data, store on Filecoin, mint as soulbound NFTs
          </p>
        </div>

        {/* Wallet Connection */}
        {!isSignedIn && (
          <div className="text-center mb-8">
            <button
              onClick={handleConnectWallet}
              className="bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white font-bold py-3 px-8 rounded-lg transition-all duration-300 transform hover:scale-105"
            >
              Connect MyNearWallet
            </button>
            <p className="text-sm text-gray-400 mt-2">
              Connect your wallet to access all features
            </p>
          </div>
        )}

        {/* Status */}
        {status && (
          <div className="text-center mb-8">
            <div className="inline-flex items-center px-4 py-2 bg-blue-900/50 rounded-lg border border-blue-500">
              {isProcessing && (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-400 mr-2"></div>
              )}
              <span className="text-blue-300">{status}</span>
            </div>
          </div>
        )}

        {/* Main Content */}
        {isSignedIn && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Left Panel - Biometric Capture */}
            <div className="space-y-6">
              <div className="bg-gray-900/50 rounded-lg p-6 border border-gray-700">
                <h2 className="text-2xl font-bold mb-4 text-center">
                  Biometric Data Capture
                </h2>
                <RealIntegratedRenderer 
                  onSessionComplete={handleBiometricSessionComplete}
                  className="w-full h-96 rounded-lg overflow-hidden"
                />
              </div>

              {/* AI Shader Generator */}
              <div className="bg-gray-900/50 rounded-lg p-6 border border-gray-700">
                <h3 className="text-xl font-bold mb-4">AI Shader Generator</h3>
                <div className="space-y-4">
                  <input
                    type="text"
                    placeholder="Enter shader prompt..."
                    className="w-full px-4 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-purple-500"
                    onKeyPress={(e) => {
                      if (e.key === 'Enter' && e.currentTarget.value) {
                        handleGenerateShader(e.currentTarget.value, 'abstract');
                      }
                    }}
                  />
                  <div className="grid grid-cols-2 gap-2">
                    {['fractal', 'audio-reactive', 'biometric', 'abstract'].map((type) => (
                      <button
                        key={type}
                        onClick={() => {
                          const input = document.querySelector('input[placeholder="Enter shader prompt..."]') as HTMLInputElement;
                          if (input?.value) {
                            handleGenerateShader(input.value, type as any);
                          }
                        }}
                        className="px-3 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg text-sm transition-colors"
                        disabled={isProcessing}
                      >
                        {type.charAt(0).toUpperCase() + type.slice(1)}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Right Panel - Results */}
            <div className="space-y-6">
              {/* Generated Shader */}
              {generatedShader && (
                <div className="bg-gray-900/50 rounded-lg p-6 border border-gray-700">
                  <h3 className="text-xl font-bold mb-4">Generated Shader</h3>
                  <div className="bg-gray-800 rounded-lg p-4 max-h-64 overflow-auto">
                    <pre className="text-xs text-green-400 whitespace-pre-wrap">
                      {generatedShader}
                    </pre>
                  </div>
                  <div className="mt-4 flex gap-2">
                    <button
                      onClick={() => navigator.clipboard.writeText(generatedShader)}
                      className="px-4 py-2 bg-green-600 hover:bg-green-700 rounded-lg text-sm transition-colors"
                    >
                      Copy Shader
                    </button>
                    {storedAsset && (
                      <a
                        href={storedAsset.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-sm transition-colors"
                      >
                        View on Filecoin
                      </a>
                    )}
                  </div>
                </div>
              )}

              {/* Biometric Session Data */}
              {biometricSession && (
                <div className="bg-gray-900/50 rounded-lg p-6 border border-gray-700">
                  <h3 className="text-xl font-bold mb-4">Biometric Session</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-400">Dominant Emotion:</span>
                      <span className="text-purple-400">{biometricSession.dominantEmotion}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Confidence:</span>
                      <span className="text-blue-400">{(biometricSession.confidence * 100).toFixed(1)}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Heart Rate:</span>
                      <span className="text-red-400">{biometricSession.heartRate} BPM</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Breathing Rate:</span>
                      <span className="text-green-400">{biometricSession.breathingRate} BPM</span>
                    </div>
                    {biometricSession.signature && (
                      <div className="mt-4 p-2 bg-gray-800 rounded text-xs">
                        <span className="text-gray-400">Biometric Signature:</span>
                        <div className="text-purple-300 break-all">
                          {biometricSession.signature}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Soulbound Token - Coming Soon */}
              {isSignedIn && (
                <div className="bg-gray-900/50 rounded-lg p-6 border border-gray-700">
                  <h3 className="text-xl font-bold mb-4">NEAR Integration</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-400">Status:</span>
                      <span className="text-yellow-400">Coming Soon</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Account:</span>
                      <span className="text-green-400">{wallet?.accounts?.near?.accountId || 'Not connected'}</span>
                    </div>
                  </div>
                  <div className="mt-4">
                    <button
                      onClick={loadUserTokens}
                      className="px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg text-sm transition-colors"
                    >
                      Check NEAR Integration
                    </button>
                  </div>
                </div>
              )}

              {/* User Tokens */}
              <div className="bg-gray-900/50 rounded-lg p-6 border border-gray-700">
                <h3 className="text-xl font-bold mb-4">My Soulbound Tokens</h3>
                <button
                  onClick={loadUserTokens}
                  className="w-full px-4 py-2 bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors"
                >
                  Load My Tokens
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Instructions */}
        <div className="mt-12 text-center text-gray-400">
          <p className="mb-2">
            1. Connect your MyNearWallet to access all features
          </p>
          <p className="mb-2">
            2. Use the biometric capture to generate real emotional data
          </p>
          <p className="mb-2">
            3. AI will generate shaders based on your biometric data
          </p>
          <p>
            4. Store everything on Filecoin and mint as soulbound NFTs
          </p>
        </div>
      </div>
    </div>
  );
};