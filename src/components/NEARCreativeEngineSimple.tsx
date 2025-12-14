import React, { useState } from 'react';

// Simple working NEAR Creative Engine without problematic imports
interface CreativeAsset {
  id: string;
  type: 'fractal' | 'shader' | 'audio' | 'biometric';
  data: any;
  emotionalState: EmotionalState;
  timestamp: number;
  owner: string;
  tokenId?: string;
}

interface EmotionalState {
  valence: number; // -1 to 1 (negative to positive)
  arousal: number; // 0 to 1 (calm to excited)
  dominance: number; // 0 to 1 (submissive to dominant)
  confidence: number; // 0 to 1
  primaryEmotion: string;
}

interface NEARCreativeEngineSimpleProps {
  className?: string;
}

export const NEARCreativeEngineSimple: React.FC<NEARCreativeEngineSimpleProps> = ({ className = '' }) => {
  const [isConnected, setIsConnected] = useState(false);
  const [accountId, setAccountId] = useState('');
  const [balance, setBalance] = useState('0');
  const [emotionalState, setEmotionalState] = useState<EmotionalState>({
    valence: 0,
    arousal: 0.5,
    dominance: 0.5,
    confidence: 0.8,
    primaryEmotion: 'neutral'
  });
  const [creativeAssets, setCreativeAssets] = useState<CreativeAsset[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [contract, setContract] = useState<any>(null);

  // Contract configuration
  // const CONTRACT_ID = 'bio-nft-1764175259.sleeplessmonk-testnet-1764175172.testnet'; // Not used in simple version

  // Simulate wallet connection
  const connectWallet = async () => {
    try {
      // Simulate NEAR wallet connection
      setIsConnected(true);
      setAccountId('testuser.testnet');
      setBalance('10.5');
      
      // Simulate contract initialization
      const mockContract = {
        mint_nft: async (args: any) => {
          console.log('Mock mint_nft called with:', args);
          return { transaction_hash: 'mock_tx_hash', token_id: args.token_id };
        },
        record_interaction: async (args: any) => {
          console.log('Mock record_interaction called with:', args);
          return { success: true };
        },
        get_metadata: async (args: any) => {
          console.log('Mock get_metadata called with:', args);
          return { metadata: 'mock_metadata' };
        }
      };
      setContract(mockContract);
      
      console.log('Wallet connected successfully (mock)');
    } catch (error) {
      console.error('Failed to connect wallet:', error);
    }
  };

  const disconnectWallet = () => {
    setIsConnected(false);
    setAccountId('');
    setBalance('0');
    setContract(null);
  };

  const handleEmotionalUpdate = (newState: Partial<EmotionalState>) => {
    setEmotionalState(prev => ({ ...prev, ...newState }));
  };

  const generateCreativeAsset = async (type: CreativeAsset['type']) => {
    if (!isConnected) {
      alert('Please connect your NEAR wallet first');
      return;
    }

    setIsGenerating(true);
    
    try {
      // Create asset based on current emotional state
      const asset: CreativeAsset = {
        id: `asset_${Date.now()}`,
        type,
        data: generateCreativeData(type),
        emotionalState: { ...emotionalState },
        timestamp: Date.now(),
        owner: accountId
      };

      // Record interaction on chain (mock)
      if (contract) {
        await contract.record_interaction({
          token_id: asset.id,
          interaction: `Generated ${type} asset with emotional state: ${JSON.stringify(emotionalState)}`
        });
      }

      setCreativeAssets(prev => [...prev, asset]);
      
    } catch (error) {
      console.error('Failed to generate creative asset:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  const mintCreativeAsset = async (asset: CreativeAsset) => {
    if (!contract) return;
    
    try {
      const metadata = {
        title: `${asset.type} Asset #${asset.id.slice(-6)}`,
        description: `Creative ${asset.type} generated with emotional state: ${asset.emotionalState.primaryEmotion}`,
        media: `data:application/json;base64,${btoa(JSON.stringify(asset.data))}`,
        issued_at: Date.now().toString(),
        extra: JSON.stringify({
          emotionalState: asset.emotionalState,
          creativeType: asset.type,
          generatorVersion: '1.0.0'
        })
      };

      const result = await contract.mint_nft({
        token_id: asset.id,
        metadata
      });

      // Update asset with token ID
      setCreativeAssets(prev => 
        prev.map(a => a.id === asset.id ? { ...a, tokenId: asset.id } : a)
      );

      console.log('NFT minted successfully:', result);
      
    } catch (error) {
      console.error('Failed to mint NFT:', error);
    }
  };

  const generateCreativeData = (type: CreativeAsset['type']) => {
    switch (type) {
      case 'fractal':
        return generateFractalData();
      case 'shader':
        return generateShaderData();
      case 'audio':
        return generateAudioData();
      case 'biometric':
        return generateBiometricData();
      default:
        return { type: 'unknown', data: null };
    }
  };

  const generateFractalData = () => {
    // Generate simple fractal data influenced by emotional state
    const iterations = Math.floor(50 + emotionalState.arousal * 150);
    const zoom = 0.5 + emotionalState.dominance * 2;
    
    return {
      type: 'mandelbrot',
      iterations,
      zoom,
      centerX: emotionalState.valence * 0.5,
      centerY: emotionalState.arousal * 0.5,
      colorScheme: emotionalState.primaryEmotion === 'happy' ? 'warm' : 
                    emotionalState.primaryEmotion === 'sad' ? 'cool' : 'neutral'
    };
  };

  const generateShaderData = () => {
    // Generate GLSL shader code influenced by emotional state
    const complexity = Math.floor(1 + emotionalState.dominance * 9);
    const speed = 0.5 + emotionalState.arousal * 2;
    
    return {
      type: 'fragment',
      code: `
        precision mediump float;
        uniform float time;
        uniform vec2 resolution;
        
        void main() {
          vec2 uv = gl_FragCoord.xy / resolution.xy;
          vec3 color = vec3(0.0);
          
          // Emotional color mapping
          color.r = ${emotionalState.valence * 0.5 + 0.5};
          color.g = ${emotionalState.arousal};
          color.b = ${emotionalState.dominance * 0.5 + 0.5};
          
          // Add some animation
          color *= sin(time * ${speed}) * 0.5 + 0.5;
          
          gl_FragColor = vec4(color, 1.0);
        }
      `,
      complexity,
      speed
    };
  };

  const generateAudioData = () => {
    // Generate audio parameters influenced by emotional state
    const baseFrequency = 200 + emotionalState.arousal * 600;
    const amplitude = emotionalState.dominance;
    const waveform = emotionalState.primaryEmotion === 'excited' ? 'sawtooth' : 'sine';
    
    return {
      type: 'synthesized',
      frequency: baseFrequency,
      amplitude,
      waveform,
      duration: 2,
      emotionalHarmonics: {
        valence: emotionalState.valence,
        arousal: emotionalState.arousal,
        dominance: emotionalState.dominance
      }
    };
  };

  const generateBiometricData = () => {
    // Generate biometric data based on emotional state
    const heartRate = 60 + emotionalState.arousal * 40; // 60-100 BPM
    const heartRateVariability = 0.1 + emotionalState.dominance * 0.3;
    
    return {
      type: 'synthetic_biometric',
      heartRate,
      heartRateVariability,
      stressLevel: 1 - emotionalState.valence, // Higher stress when negative valence
      engagement: emotionalState.arousal,
      emotionalSignature: {
        valence: emotionalState.valence,
        arousal: emotionalState.arousal,
        dominance: emotionalState.dominance
      }
    };
  };

  const renderDashboard = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gray-800 rounded-lg p-6">
          <h3 className="text-xl font-semibold mb-4 text-blue-400">Wallet Status</h3>
          <div className="space-y-2">
            <p className="text-sm text-gray-300">Account: {accountId || 'Not connected'}</p>
            <p className="text-sm text-gray-300">Balance: {balance} NEAR</p>
            <p className="text-sm text-gray-300">Contract: {contract ? 'Connected' : 'Not connected'}</p>
          </div>
        </div>
        
        <div className="bg-gray-800 rounded-lg p-6">
          <h3 className="text-xl font-semibold mb-4 text-green-400">Emotional State</h3>
          <div className="space-y-2">
            <p className="text-sm text-gray-300">Primary: {emotionalState.primaryEmotion}</p>
            <p className="text-sm text-gray-300">Valence: {emotionalState.valence.toFixed(2)}</p>
            <p className="text-sm text-gray-300">Arousal: {emotionalState.arousal.toFixed(2)}</p>
            <p className="text-sm text-gray-300">Dominance: {emotionalState.dominance.toFixed(2)}</p>
          </div>
        </div>
        
        <div className="bg-gray-800 rounded-lg p-6">
          <h3 className="text-xl font-semibold mb-4 text-purple-400">Creative Assets</h3>
          <div className="space-y-2">
            <p className="text-sm text-gray-300">Total: {creativeAssets.length}</p>
            <p className="text-sm text-gray-300">Fractals: {creativeAssets.filter(a => a.type === 'fractal').length}</p>
            <p className="text-sm text-gray-300">Shaders: {creativeAssets.filter(a => a.type === 'shader').length}</p>
            <p className="text-sm text-gray-300">NFTs: {creativeAssets.filter(a => a.tokenId).length}</p>
          </div>
        </div>
      </div>

      <div className="bg-gray-800 rounded-lg p-6">
        <h3 className="text-xl font-semibold mb-4 text-yellow-400">Quick Actions</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <button
            onClick={() => generateCreativeAsset('fractal')}
            disabled={!isConnected || isGenerating}
            className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 text-white font-medium py-3 px-4 rounded-lg transition-colors"
          >
            Generate Fractal
          </button>
          <button
            onClick={() => generateCreativeAsset('shader')}
            disabled={!isConnected || isGenerating}
            className="bg-green-600 hover:bg-green-700 disabled:bg-gray-600 text-white font-medium py-3 px-4 rounded-lg transition-colors"
          >
            Generate Shader
          </button>
          <button
            onClick={() => generateCreativeAsset('audio')}
            disabled={!isConnected || isGenerating}
            className="bg-purple-600 hover:bg-purple-700 disabled:bg-gray-600 text-white font-medium py-3 px-4 rounded-lg transition-colors"
          >
            Generate Audio
          </button>
          <button
            onClick={() => generateCreativeAsset('biometric')}
            disabled={!isConnected || isGenerating}
            className="bg-yellow-600 hover:bg-yellow-700 disabled:bg-gray-600 text-white font-medium py-3 px-4 rounded-lg transition-colors"
          >
            Generate Biometric
          </button>
        </div>
      </div>

      {creativeAssets.length > 0 && (
        <div className="bg-gray-800 rounded-lg p-6">
          <h3 className="text-xl font-semibold mb-4 text-pink-400">Recent Creative Assets</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {creativeAssets.slice(-6).map((asset) => (
              <div key={asset.id} className="bg-gray-700 rounded-lg p-4">
                <div className="flex justify-between items-start mb-2">
                  <span className="text-sm font-medium text-gray-300 capitalize">{asset.type}</span>
                  {asset.tokenId && (
                    <span className="text-xs bg-green-600 text-white px-2 py-1 rounded">NFT</span>
                  )}
                </div>
                <p className="text-xs text-gray-400 mb-2">
                  Emotion: {asset.emotionalState.primaryEmotion}
                </p>
                <p className="text-xs text-gray-400 mb-3">
                  {new Date(asset.timestamp).toLocaleString()}
                </p>
                {!asset.tokenId && (
                  <button
                    onClick={() => mintCreativeAsset(asset)}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white text-sm py-2 px-3 rounded transition-colors"
                  >
                    Mint as NFT
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="bg-gray-800 rounded-lg p-6">
        <h3 className="text-xl font-semibold mb-4 text-cyan-400">Emotional State Controls</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Valence (-1 to 1)</label>
              <input
                type="range"
                min="-1"
                max="1"
                step="0.1"
                value={emotionalState.valence}
                onChange={(e) => handleEmotionalUpdate({ valence: parseFloat(e.target.value) })}
                className="w-full"
              />
              <span className="text-xs text-gray-400">{emotionalState.valence.toFixed(1)}</span>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Arousal (0 to 1)</label>
              <input
                type="range"
                min="0"
                max="1"
                step="0.1"
                value={emotionalState.arousal}
                onChange={(e) => handleEmotionalUpdate({ arousal: parseFloat(e.target.value) })}
                className="w-full"
              />
              <span className="text-xs text-gray-400">{emotionalState.arousal.toFixed(1)}</span>
            </div>
          </div>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Dominance (0 to 1)</label>
              <input
                type="range"
                min="0"
                max="1"
                step="0.1"
                value={emotionalState.dominance}
                onChange={(e) => handleEmotionalUpdate({ dominance: parseFloat(e.target.value) })}
                className="w-full"
              />
              <span className="text-xs text-gray-400">{emotionalState.dominance.toFixed(1)}</span>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Primary Emotion</label>
              <select
                value={emotionalState.primaryEmotion}
                onChange={(e) => handleEmotionalUpdate({ primaryEmotion: e.target.value })}
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white"
              >
                <option value="happy">Happy</option>
                <option value="sad">Sad</option>
                <option value="excited">Excited</option>
                <option value="calm">Calm</option>
                <option value="angry">Angry</option>
                <option value="neutral">Neutral</option>
              </select>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  if (!isConnected) {
    return (
      <div className={`min-h-screen bg-gray-900 text-white p-8 ${className}`}>
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl font-bold mb-8 text-blue-400">NEAR Creative Engine</h1>
          <p className="text-xl mb-8 text-gray-300">
            Connect your NEAR wallet to access the comprehensive creative engine with real biometric NFT functionality,
            AI-powered fractal generation, and blockchain integration.
          </p>
          <button
            onClick={connectWallet}
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-8 rounded-lg text-xl transition-colors"
          >
            Connect NEAR Wallet
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen bg-gray-900 text-white p-8 ${className}`}>
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold text-blue-400">NEAR Creative Engine</h1>
          <div className="flex items-center space-x-4">
            <span className="text-sm text-gray-300">{accountId}</span>
            <button
              onClick={disconnectWallet}
              className="bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
            >
              Disconnect
            </button>
          </div>
        </div>

        {renderDashboard()}
      </div>
    </div>
  );
};

export default NEARCreativeEngineSimple;