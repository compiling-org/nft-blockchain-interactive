/**
 * Audio-Biometric NFT Marketplace Page
 * Comprehensive integration of audio-reactive shaders and biometric capture
 * for NFT visualization and minting in the marketplace
 */

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { AudioAnalyzerService, AudioBandData, BiometricAudioData } from '../services/audioAnalyzerService';
import { RealFilecoinStorage } from '../utils/real-filecoin-storage';

// Marketplace NFT interface
interface AudioReactiveNFT {
  id: string;
  title: string;
  description: string;
  mediaUrl: string;
  audioReactiveData?: {
    shaderConfig: string;
    biometricHash: string;
    emotionVector: {
      valence: number;
      arousal: number;
      dominance: number;
    };
    audioFeatures: {
      bass: number;
      mid: number;
      treble: number;
      overall: number;
    };
    eegBands: {
      delta: number;
      theta: number;
      alpha: number;
      beta: number;
      gamma: number;
    };
  };
  price: string;
  creator: string;
  owner: string;
  isAudioReactive: boolean;
  hasBiometricData: boolean;
}

// Sample audio-reactive NFTs for demonstration
const sampleNFTs: AudioReactiveNFT[] = [
  {
    id: '1',
    title: 'Emotional Fractal #1',
    description: 'Audio-reactive fractal generated from biometric data',
    mediaUrl: '',
    audioReactiveData: {
      shaderConfig: 'mandelbrot',
      biometricHash: 'QmHash1...',
      emotionVector: { valence: 0.5, arousal: 0.7, dominance: 0.6 },
      audioFeatures: { bass: 0.3, mid: 0.5, treble: 0.4, overall: 0.4 },
      eegBands: { delta: 0.2, theta: 0.3, alpha: 0.4, beta: 0.3, gamma: 0.2 }
    },
    price: '5 NEAR',
    creator: 'ai-artist.near',
    owner: 'ai-artist.near',
    isAudioReactive: true,
    hasBiometricData: true
  },
  {
    id: '2',
    title: 'Neural Dreamscape',
    description: 'AI-generated visualization of neural patterns',
    mediaUrl: '',
    audioReactiveData: {
      shaderConfig: 'julia',
      biometricHash: 'QmHash2...',
      emotionVector: { valence: 0.8, arousal: 0.3, dominance: 0.4 },
      audioFeatures: { bass: 0.2, mid: 0.3, treble: 0.6, overall: 0.35 },
      eegBands: { delta: 0.4, theta: 0.5, alpha: 0.3, beta: 0.2, gamma: 0.1 }
    },
    price: '10 NEAR',
    creator: 'neuro-art.near',
    owner: 'neuro-art.near',
    isAudioReactive: true,
    hasBiometricData: true
  },
  {
    id: '3',
    title: 'Biometric Pulse',
    description: 'Heart rate synchronized generative art',
    mediaUrl: '',
    audioReactiveData: {
      shaderConfig: 'plasma',
      biometricHash: 'QmHash3...',
      emotionVector: { valence: 0.3, arousal: 0.9, dominance: 0.7 },
      audioFeatures: { bass: 0.8, mid: 0.4, treble: 0.3, overall: 0.55 },
      eegBands: { delta: 0.1, theta: 0.2, alpha: 0.2, beta: 0.6, gamma: 0.4 }
    },
    price: '3 NEAR',
    creator: 'pulse-art.near',
    owner: 'pulse-art.near',
    isAudioReactive: true,
    hasBiometricData: true
  }
];

export const AudioBiometricMarketplace: React.FC = () => {
  // State management
  const [nfts, setNfts] = useState<AudioReactiveNFT[]>(sampleNFTs);
  const [selectedNFT, setSelectedNFT] = useState<AudioReactiveNFT | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [audioBands, setAudioBands] = useState<AudioBandData | null>(null);
  const [biometricData, setBiometricData] = useState<BiometricAudioData | null>(null);
  const [error, setError] = useState<string>('');
  const [walletConnected, setWalletConnected] = useState(false);
  const [viewMode, setViewMode] = useState<'gallery' | 'create' | 'analyze'>('gallery');
  
  // Audio analyzer reference
  const audioAnalyzerRef = useRef<AudioAnalyzerService | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>(0);

  // Initialize audio analyzer
  useEffect(() => {
    const initAnalyzer = async () => {
      audioAnalyzerRef.current = new AudioAnalyzerService();
      const success = await audioAnalyzerRef.current.initialize();
      
      if (!success) {
        setError('Failed to initialize audio analyzer');
        return;
      }
      
      // Subscribe to audio data
      audioAnalyzerRef.current.subscribe((result) => {
        setAudioBands(result.bands);
        setBiometricData(result.biometricData);
      });
    };
    
    initAnalyzer();
    
    return () => {
      if (audioAnalyzerRef.current) {
        audioAnalyzerRef.current.dispose();
      }
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);

  // Toggle audio recording
  const toggleRecording = useCallback(() => {
    if (!audioAnalyzerRef.current) return;
    
    if (isRecording) {
      audioAnalyzerRef.current.stop();
      setIsRecording(false);
    } else {
      audioAnalyzerRef.current.start();
      setIsRecording(true);
    }
  }, [isRecording]);

  // Render audio-reactive visualization
  useEffect(() => {
    if (!canvasRef.current || viewMode !== 'analyze') return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    let time = 0;
    
    const render = () => {
      if (!audioBands) {
        animationRef.current = requestAnimationFrame(render);
        return;
      }
      
      time += 0.016;
      
      // Clear canvas
      ctx.fillStyle = '#0a0a0f';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      // Draw audio visualization
      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;
      const maxRadius = Math.min(canvas.width, canvas.height) / 2 - 20;
      
      // Bass-reactive outer ring
      ctx.beginPath();
      ctx.arc(centerX, centerY, maxRadius * (0.5 + audioBands.bass * 0.5), 0, Math.PI * 2);
      ctx.strokeStyle = `hsl(${audioBands.bass * 360}, 70%, 50%)`;
      ctx.lineWidth = 3 + audioBands.bass * 10;
      ctx.stroke();
      
      // Mid-reactive middle ring
      ctx.beginPath();
      ctx.arc(centerX, centerY, maxRadius * (0.3 + audioBands.mid * 0.3), 0, Math.PI * 2);
      ctx.strokeStyle = `hsl(${audioBands.mid * 360 + 120}, 70%, 50%)`;
      ctx.lineWidth = 2 + audioBands.mid * 8;
      ctx.stroke();
      
      // Treble-reactive inner ring
      ctx.beginPath();
      ctx.arc(centerX, centerY, maxRadius * (0.15 + audioBands.treble * 0.2), 0, Math.PI * 2);
      ctx.strokeStyle = `hsl(${audioBands.treble * 360 + 240}, 70%, 50%)`;
      ctx.lineWidth = 1 + audioBands.treble * 5;
      ctx.stroke();
      
      // Draw biometric data
      if (biometricData) {
        ctx.fillStyle = '#ffffff';
        ctx.font = '14px monospace';
        ctx.fillText(`❤️ HR: ${biometricData.heartRate} BPM`, 20, 30);
        ctx.fillText(`🌬️ BR: ${biometricData.breathingRate}/min`, 20, 50);
        ctx.fillText(`😰 Stress: ${biometricData.stressLevel}%`, 20, 70);
        ctx.fillText(`🎯 Attention: ${biometricData.attentionLevel}%`, 20, 90);
        
        // Emotion
        ctx.fillText(`Emotion: V=${biometricData.emotion.valence.toFixed(2)} A=${biometricData.emotion.arousal.toFixed(2)} D=${biometricData.emotion.dominance.toFixed(2)}`, 20, 120);
        
        // EEG
        ctx.fillText(`EEG: δ=${biometricData.eegBands.delta.toFixed(2)} θ=${biometricData.eegBands.theta.toFixed(2)} α=${biometricData.eegBands.alpha.toFixed(2)} β=${biometricData.eegBands.beta.toFixed(2)} γ=${biometricData.eegBands.gamma.toFixed(2)}`, 20, 150);
      }
      
      animationRef.current = requestAnimationFrame(render);
    };
    
    render();
    
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [audioBands, biometricData, viewMode]);

  // Create NFT from biometric data
  const createBiometricNFT = useCallback(async () => {
    if (!biometricData) {
      setError('Please record audio/biometric data first');
      return;
    }
    
    setIsProcessing(true);
    
    try {
      // Create NFT data
      const newNFT: AudioReactiveNFT = {
        id: Date.now().toString(),
        title: `Biometric Art #${Date.now()}`,
        description: 'NFT created from real-time biometric data',
        mediaUrl: '',
        audioReactiveData: {
          shaderConfig: 'custom',
          biometricHash: `QmBiometric${Date.now()}`,
          emotionVector: {
            valence: biometricData.emotion.valence,
            arousal: biometricData.emotion.arousal,
            dominance: biometricData.emotion.dominance
          },
          audioFeatures: audioBands ? {
            bass: audioBands.bass,
            mid: audioBands.mid,
            treble: audioBands.treble,
            overall: audioBands.overall
          } : { bass: 0, mid: 0, treble: 0, overall: 0 },
          eegBands: biometricData.eegBands
        },
        price: '1 NEAR',
        creator: 'user.near',
        owner: 'user.near',
        isAudioReactive: true,
        hasBiometricData: true
      };
      
      setNfts(prev => [newNFT, ...prev]);
      setSelectedNFT(newNFT);
      setViewMode('gallery');
    } catch (err) {
      setError('Failed to create NFT');
    } finally {
      setIsProcessing(false);
    }
  }, [biometricData, audioBands]);

  // Render gallery view
  const renderGallery = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {nfts.map((nft) => (
        <div
          key={nft.id}
          className="bg-gray-800 rounded-lg overflow-hidden hover:ring-2 hover:ring-purple-500 cursor-pointer transition-all"
          onClick={() => setSelectedNFT(nft)}
        >
          {/* NFT Preview */}
          <div className="aspect-square bg-gradient-to-br from-purple-900 to-blue-900 relative">
            {nft.isAudioReactive && (
              <div className="absolute top-2 right-2 bg-purple-600 text-white text-xs px-2 py-1 rounded-full">
                🔊 Audio Reactive
              </div>
            )}
            {nft.hasBiometricData && (
              <div className="absolute top-2 left-2 bg-blue-600 text-white text-xs px-2 py-1 rounded-full">
                ❤️ Biometric
              </div>
            )}
            {/* Visualization preview */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-24 h-24 rounded-full border-4 border-purple-500/50 animate-pulse" />
            </div>
          </div>
          
          {/* NFT Info */}
          <div className="p-4">
            <h3 className="text-white font-bold text-lg">{nft.title}</h3>
            <p className="text-gray-400 text-sm mt-1">{nft.description}</p>
            
            {/* Audio features */}
            {nft.audioReactiveData && (
              <div className="mt-3 flex gap-1">
                {['bass', 'mid', 'treble'].map((band) => (
                  <div
                    key={band}
                    className="flex-1 h-2 bg-gray-700 rounded-full overflow-hidden"
                  >
                    <div
                      className="h-full bg-gradient-to-r from-purple-500 to-cyan-500"
                      style={{ width: `${(nft.audioReactiveData!.audioFeatures as any)[band] * 100}%` }}
                    />
                  </div>
                ))}
              </div>
            )}
            
            <div className="mt-3 flex justify-between items-center">
              <span className="text-purple-400 font-bold">{nft.price}</span>
              <span className="text-gray-500 text-sm">by {nft.creator}</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  // Render create/analyze view
  const renderCreate = () => (
    <div className="flex flex-col lg:flex-row gap-8">
      {/* Visualization Canvas */}
      <div className="flex-1">
        <canvas
          ref={canvasRef}
          width={600}
          height={500}
          className="w-full rounded-lg bg-black"
        />
        
        {/* Controls */}
        <div className="mt-4 flex gap-4">
          <button
            onClick={toggleRecording}
            className={`px-6 py-3 rounded-lg font-bold ${
              isRecording 
                ? 'bg-red-500 hover:bg-red-600' 
                : 'bg-green-500 hover:bg-green-600'
            } text-white transition-colors`}
          >
            {isRecording ? '🛑 Stop Recording' : '🎤 Start Audio Capture'}
          </button>
          
          <button
            onClick={createBiometricNFT}
            disabled={!biometricData || isProcessing}
            className="px-6 py-3 rounded-lg font-bold bg-purple-600 hover:bg-purple-700 disabled:bg-gray-600 text-white transition-colors"
          >
            {isProcessing ? '⏳ Processing...' : '🎨 Create NFT'}
          </button>
        </div>
      </div>
      
      {/* Biometric Data Panel */}
      <div className="w-full lg:w-80 bg-gray-800 rounded-lg p-6">
        <h3 className="text-white font-bold text-xl mb-4">📊 Biometric Data</h3>
        
        {biometricData ? (
          <div className="space-y-4">
            {/* Vital Signs */}
            <div className="bg-gray-700 rounded-lg p-4">
              <h4 className="text-gray-400 text-sm mb-2">Vital Signs</h4>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <span className="text-red-400">❤️</span>
                  <span className="text-white ml-2">{biometricData.heartRate} BPM</span>
                </div>
                <div>
                  <span className="text-blue-400">🌬️</span>
                  <span className="text-white ml-2">{biometricData.breathingRate}/min</span>
                </div>
              </div>
            </div>
            
            {/* Stress & Attention */}
            <div className="bg-gray-700 rounded-lg p-4">
              <h4 className="text-gray-400 text-sm mb-2">Mental State</h4>
              <div className="space-y-2">
                <div>
                  <div className="flex justify-between text-white text-sm">
                    <span>Stress Level</span>
                    <span>{biometricData.stressLevel}%</span>
                  </div>
                  <div className="h-2 bg-gray-600 rounded-full mt-1">
                    <div
                      className="h-full bg-red-500 rounded-full"
                      style={{ width: `${biometricData.stressLevel}%` }}
                    />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-white text-sm">
                    <span>Attention</span>
                    <span>{biometricData.attentionLevel}%</span>
                  </div>
                  <div className="h-2 bg-gray-600 rounded-full mt-1">
                    <div
                      className="h-full bg-green-500 rounded-full"
                      style={{ width: `${biometricData.attentionLevel}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>
            
            {/* Emotion */}
            <div className="bg-gray-700 rounded-lg p-4">
              <h4 className="text-gray-400 text-sm mb-2">Emotion (VAD)</h4>
              <div className="space-y-2">
                <div className="flex justify-between text-white text-sm">
                  <span>Valence (Neg→Pos)</span>
                  <span>{biometricData.emotion.valence.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-white text-sm">
                  <span>Arousal (Calm→Excited)</span>
                  <span>{biometricData.emotion.arousal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-white text-sm">
                  <span>Dominance (Sub→Dom)</span>
                  <span>{biometricData.emotion.dominance.toFixed(2)}</span>
                </div>
              </div>
            </div>
            
            {/* EEG Bands */}
            <div className="bg-gray-700 rounded-lg p-4">
              <h4 className="text-gray-400 text-sm mb-2">EEG Bands</h4>
              <div className="space-y-1">
                {['delta', 'theta', 'alpha', 'beta', 'gamma'].map((band) => (
                  <div key={band} className="flex items-center gap-2">
                    <span className="text-purple-400 text-xs w-12">{band}</span>
                    <div className="flex-1 h-2 bg-gray-600 rounded-full">
                      <div
                        className="h-full bg-purple-500 rounded-full"
                        style={{ width: `${(biometricData.eegBands as any)[band] * 100}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="text-gray-500 text-center py-8">
            <p>No biometric data captured yet.</p>
            <p className="mt-2">Click "Start Audio Capture" to begin.</p>
          </div>
        )}
        
        {error && (
          <div className="mt-4 p-3 bg-red-900/50 text-red-300 rounded-lg text-sm">
            {error}
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-900 p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-white mb-2">
          🔊 Audio-Biometric NFT Marketplace
        </h1>
        <p className="text-gray-400">
          Create and trade NFTs generated from your voice and biometric data
        </p>
      </div>
      
      {/* Navigation */}
      <div className="flex gap-4 mb-8">
        <button
          onClick={() => setViewMode('gallery')}
          className={`px-4 py-2 rounded-lg font-semibold ${
            viewMode === 'gallery' ? 'bg-purple-600 text-white' : 'bg-gray-700 text-gray-300'
          }`}
        >
          🖼️ Gallery
        </button>
        <button
          onClick={() => setViewMode('create')}
          className={`px-4 py-2 rounded-lg font-semibold ${
            viewMode === 'create' ? 'bg-purple-600 text-white' : 'bg-gray-700 text-gray-300'
          }`}
        >
          🎨 Create
        </button>
        <button
          onClick={() => setViewMode('analyze')}
          className={`px-4 py-2 rounded-lg font-semibold ${
            viewMode === 'analyze' ? 'bg-purple-600 text-white' : 'bg-gray-700 text-gray-300'
          }`}
        >
          📊 Analyze
        </button>
        
        {/* Connection status */}
        <div className="ml-auto flex items-center gap-4">
          {walletConnected ? (
            <span className="text-green-400">✓ Wallet Connected</span>
          ) : (
            <button
              onClick={() => setWalletConnected(true)}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Connect Wallet
            </button>
          )}
        </div>
      </div>
      
      {/* Main Content */}
      {viewMode === 'gallery' ? renderGallery() : renderCreate()}
      
      {/* Selected NFT Modal */}
      {selectedNFT && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-8" onClick={() => setSelectedNFT(null)}>
          <div className="bg-gray-800 rounded-lg max-w-2xl w-full p-6" onClick={(e) => e.stopPropagation()}>
            <h2 className="text-2xl font-bold text-white mb-4">{selectedNFT.title}</h2>
            <p className="text-gray-400 mb-4">{selectedNFT.description}</p>
            
            {selectedNFT.audioReactiveData && (
              <div className="bg-gray-700 rounded-lg p-4 mb-4">
                <h3 className="text-white font-semibold mb-2">Audio Features</h3>
                <div className="flex gap-2">
                  {['bass', 'mid', 'treble'].map((band) => (
                    <div key={band} className="flex-1">
                      <div className="text-gray-400 text-xs capitalize">{band}</div>
                      <div className="h-4 bg-gray-600 rounded mt-1">
                        <div
                          className="h-full bg-purple-500 rounded"
                          style={{ width: `${(selectedNFT.audioReactiveData!.audioFeatures as any)[band] * 100}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            <div className="flex justify-between items-center">
              <span className="text-2xl font-bold text-purple-400">{selectedNFT.price}</span>
              <button className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">
                Buy Now
              </button>
            </div>
            
            <button
              onClick={() => setSelectedNFT(null)}
              className="mt-4 w-full py-2 bg-gray-700 text-gray-300 rounded-lg hover:bg-gray-600"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AudioBiometricMarketplace;
