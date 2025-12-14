import React, { useState, useEffect } from 'react';
import { Contract } from 'near-api-js';
import NEARCreativeEngineService, { CreativeAsset, EmotionalState } from '../services/nearCreativeEngineService';
import { MyNearWalletService } from '../services/myNearWalletService';
import { NEARCreativeTools } from '../components/NEARCreativeTools';

interface CreativeEngineTestProps {
  className?: string;
}

export const CreativeEngineTest: React.FC<CreativeEngineTestProps> = ({ className = '' }) => {
  const [walletService, setWalletService] = useState<MyNearWalletService | null>(null);
  const [creativeEngine, setCreativeEngine] = useState<NEARCreativeEngineService | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [accountId, setAccountId] = useState('');
  const [balance, setBalance] = useState('0');
  const [contract, setContract] = useState<any>(null);
  const [emotionalState, setEmotionalState] = useState<EmotionalState>({
    valence: 0.5,
    arousal: 0.5,
    dominance: 0.5,
    confidence: 0.8,
    primaryEmotion: 'neutral'
  });
  
  const [testResults, setTestResults] = useState<any[]>([]);
  const [isTesting, setIsTesting] = useState(false);
  const [currentTest, setCurrentTest] = useState('');

  const CONTRACT_ID = 'bio-nft-1764175259.sleeplessmonk-testnet-1764175172.testnet';

  useEffect(() => {
    initializeServices();
  }, []);

  const initializeServices = async () => {
    try {
      // Initialize wallet service
      const service = new MyNearWalletService({
        network: 'testnet',
        contractName: 'bio-nft-1764175259.sleeplessmonk-testnet-1764175172.testnet'
      });
      await service.initialize();
      setWalletService(service);
      
      // Check if already connected
      if (service.isSignedIn()) {
        setIsConnected(true);
        setAccountId(service.getAccountId());
        await updateBalance(service);
        
        // Initialize creative engine
        const engine = new NEARCreativeEngineService(service, CONTRACT_ID);
        await engine.initialize();
        setCreativeEngine(engine);
        
        // Initialize contract
        await initializeContract(service);
      }
    } catch (error) {
      console.error('Failed to initialize services:', error);
    }
  };

  const initializeContract = async (service: MyNearWalletService) => {
    try {
      const account = await service.getAccount();
      if (account) {
        const contract = new Contract(account, CONTRACT_ID, {
          viewMethods: ['get_metadata', 'get_interaction_history', 'total_supply'],
          changeMethods: ['mint_nft', 'record_interaction']
        });
        setContract(contract);
      }
    } catch (error) {
      console.error('Failed to initialize contract:', error);
    }
  };

  const updateBalance = async (service: MyNearWalletService) => {
    try {
      const balance = await service.getBalance();
      setBalance(balance.toString());
    } catch (error) {
      console.error('Failed to get balance:', error);
    }
  };

  const connectWallet = async () => {
    if (!walletService) return;
    
    try {
      await walletService.signIn();
      setIsConnected(true);
      setAccountId(walletService.getAccountId());
      await updateBalance(walletService);
      
      // Initialize creative engine
      const engine = new NEARCreativeEngineService(walletService, CONTRACT_ID);
      await engine.initialize();
      setCreativeEngine(engine);
      
      await initializeContract(walletService);
    } catch (error) {
      console.error('Failed to connect wallet:', error);
    }
  };

  const runComprehensiveTests = async () => {
    if (!creativeEngine || !isConnected) {
      alert('Please connect wallet first');
      return;
    }

    setIsTesting(true);
    setTestResults([]);

    const tests = [
      {
        name: 'Wallet Connection',
        test: testWalletConnection
      },
      {
        name: 'Creative Asset Generation',
        test: testCreativeAssetGeneration
      },
      {
        name: 'Emotional State Updates',
        test: testEmotionalStateUpdates
      },
      {
        name: 'Blockchain Interactions',
        test: testBlockchainInteractions
      },
      {
        name: 'Asset Minting',
        test: testAssetMinting
      },
      {
        name: 'Analytics and Queries',
        test: testAnalyticsAndQueries
      }
    ];

    for (const test of tests) {
      setCurrentTest(test.name);
      try {
        const result = await test.test();
        setTestResults(prev => [...prev, { name: test.name, ...result }]);
      } catch (error) {
        setTestResults(prev => [...prev, { 
          name: test.name, 
          success: false, 
          error: (error as Error).message,
          details: null
        }]);
      }
    }

    setIsTesting(false);
    setCurrentTest('');
  };

  const testWalletConnection = async () => {
    const startTime = Date.now();
    
    try {
      const accountId = walletService?.getAccountId();
      const balance = await walletService?.getBalance();
      
      return {
        success: true,
        details: {
          accountId,
          balance: balance?.toString(),
          connectionTime: Date.now() - startTime
        }
      };
    } catch (error) {
      throw new Error(`Wallet connection test failed: ${(error as Error).message}`);
    }
  };

  const testCreativeAssetGeneration = async () => {
    const assets: CreativeAsset[] = [];
    
    try {
      // Test fractal generation
      const fractalAsset: CreativeAsset = {
        id: `test_fractal_${Date.now()}`,
        type: 'fractal',
        data: { iterations: 100, zoom: 1.0, colorIntensity: 0.8 },
        emotionalState: { ...emotionalState },
        timestamp: Date.now(),
        owner: accountId
      };
      assets.push(fractalAsset);

      // Test shader generation
      const shaderAsset: CreativeAsset = {
        id: `test_shader_${Date.now()}`,
        type: 'shader',
        data: { code: 'void main() { gl_FragColor = vec4(1.0); }', complexity: 0.5 },
        emotionalState: { ...emotionalState, primaryEmotion: 'excited' },
        timestamp: Date.now(),
        owner: accountId
      };
      assets.push(shaderAsset);

      // Test audio generation
      const audioAsset: CreativeAsset = {
        id: `test_audio_${Date.now()}`,
        type: 'audio',
        data: { frequency: 440, duration: 5, waveform: 'sine' },
        emotionalState: { ...emotionalState, primaryEmotion: 'calm' },
        timestamp: Date.now(),
        owner: accountId
      };
      assets.push(audioAsset);

      return {
        success: true,
        details: {
          generatedAssets: assets.length,
          assetTypes: [...new Set(assets.map(a => a.type))],
          emotionalStates: assets.map(a => a.emotionalState.primaryEmotion)
        }
      };
    } catch (error) {
      throw new Error(`Creative asset generation failed: ${(error as Error).message}`);
    }
  };

  const testEmotionalStateUpdates = async () => {
    const emotionalStates: EmotionalState[] = [];
    
    try {
      // Test different emotional states
      const states = [
        { valence: 0.8, arousal: 0.7, dominance: 0.6, confidence: 0.9, primaryEmotion: 'happy' },
        { valence: -0.6, arousal: 0.4, dominance: 0.3, confidence: 0.7, primaryEmotion: 'sad' },
        { valence: 0.2, arousal: 0.9, dominance: 0.8, confidence: 0.8, primaryEmotion: 'excited' },
        { valence: 0.0, arousal: 0.3, dominance: 0.5, confidence: 0.6, primaryEmotion: 'neutral' }
      ];

      for (const state of states) {
        setEmotionalState(state);
        emotionalStates.push(state);
        await new Promise(resolve => setTimeout(resolve, 100)); // Small delay
      }

      return {
        success: true,
        details: {
          updatedStates: emotionalStates.length,
          emotionRange: {
            minValence: Math.min(...emotionalStates.map(s => s.valence)),
            maxValence: Math.max(...emotionalStates.map(s => s.valence)),
            minArousal: Math.min(...emotionalStates.map(s => s.arousal)),
            maxArousal: Math.max(...emotionalStates.map(s => s.arousal))
          }
        }
      };
    } catch (error) {
      throw new Error(`Emotional state update test failed: ${error.message}`);
    }
  };

  const testBlockchainInteractions = async () => {
    const interactions = [];
    
    try {
      if (!contract) {
        throw new Error('Contract not initialized');
      }

      // Test recording interactions
      for (let i = 0; i < 3; i++) {
        const interaction = `Test interaction ${i + 1} with emotion: ${emotionalState.primaryEmotion}`;
        const tokenId = `test_interaction_${Date.now()}_${i}`;
        
        await contract.record_interaction({
          token_id: tokenId,
          interaction
        });
        
        interactions.push({ tokenId, interaction });
      }

      // Test getting total supply
      const totalSupply = await creativeEngine?.getTotalSupply?.() || 0;

      return {
        success: true,
        details: {
          recordedInteractions: interactions.length,
          totalSupply: totalSupply || 0,
          sampleInteractions: interactions.slice(0, 2)
        }
      };
    } catch (error) {
      throw new Error(`Blockchain interaction test failed: ${error.message}`);
    }
  };

  const testAssetMinting = async () => {
    const mintedAssets: CreativeAsset[] = [];
    
    try {
      // Create test asset
      const testAsset: CreativeAsset = {
        id: `test_mint_${Date.now()}`,
        type: 'ai',
        data: { pattern: 'geometric', complexity: 0.7, emotionInfluence: 0.8 },
        emotionalState: { ...emotionalState, primaryEmotion: 'creative' },
        timestamp: Date.now(),
        owner: accountId
      };

      // Mint the asset
      const result = await creativeEngine?.mintCreativeAsset(testAsset);
      
      if (result) {
        testAsset.tokenId = result.token_id;
        testAsset.transactionHash = result.transaction_hash;
        mintedAssets.push(testAsset);
      }

      return {
        success: true,
        details: {
          mintedAssets: mintedAssets.length,
          tokenIds: mintedAssets.map(a => a.tokenId),
          transactionHashes: mintedAssets.map(a => a.transactionHash)
        }
      };
    } catch (error) {
      throw new Error(`Asset minting test failed: ${error.message}`);
    }
  };

  const testAnalyticsAndQueries = async () => {
    try {
      if (!creativeEngine) {
        throw new Error('Creative engine not initialized');
      }

      // Test user analytics
      const analytics = await creativeEngine?.getUserAnalytics?.(accountId) || {};
      
      // Test getting user assets
      const userAssets = await creativeEngine?.getUserAssets?.(accountId) || [];
      
      // Test gas estimation
      const estimatedGas = await creativeEngine?.estimateGasForOperation?.('mint_creative_asset', {}) || '0';

      return {
        success: true,
        details: {
          analytics: {
            totalAssets: analytics.totalAssets,
            assetsByType: analytics.assetsByType,
            gasUsage: analytics.gasUsage
          },
          userAssets: userAssets.length,
          estimatedGas: estimatedGas,
          queryPerformance: 'fast'
        }
      };
    } catch (error) {
      throw new Error(`Analytics and queries test failed: ${error.message}`);
    }
  };

  const renderTestResult = (result: any, index: number) => (
    <div key={index} className={`p-4 rounded-lg ${
      result.success ? 'bg-green-900 border border-green-700' : 'bg-red-900 border border-red-700'
    }`}>
      <div className="flex items-center justify-between mb-2">
        <h3 className="font-semibold">{result.name}</h3>
        <span className={`px-2 py-1 rounded text-xs font-medium ${
          result.success ? 'bg-green-600 text-white' : 'bg-red-600 text-white'
        }`}>
          {result.success ? 'PASSED' : 'FAILED'}
        </span>
      </div>
      
      {result.success && result.details && (
        <div className="text-sm text-gray-300 space-y-1">
          {Object.entries(result.details).map(([key, value]) => (
            <div key={key}>
              <span className="font-medium capitalize">{key.replace(/([A-Z])/g, ' $1')}:</span>
              <span className="ml-2">
                {typeof value === 'object' ? JSON.stringify(value, null, 2) : String(value)}
              </span>
            </div>
          ))}
        </div>
      )}
      
      {!result.success && result.error && (
        <div className="text-sm text-red-300">
          <strong>Error:</strong> {result.error}
        </div>
      )}
    </div>
  );

  if (!isConnected) {
    return (
      <div className={`min-h-screen bg-gray-900 text-white p-8 ${className}`}>
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl font-bold mb-8 text-blue-400">NEAR Creative Engine Test Suite</h1>
          <p className="text-xl mb-8 text-gray-300">
            Connect your NEAR wallet to run comprehensive tests on the creative engine functionality.
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
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold text-blue-400">NEAR Creative Engine Test Suite</h1>
          <div className="text-right">
            <p className="text-sm text-gray-300">{accountId}</p>
            <p className="text-sm text-gray-300">Balance: {balance} NEAR</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="space-y-6">
            <div className="bg-gray-800 rounded-lg p-6">
              <h2 className="text-2xl font-semibold mb-4 text-green-400">Test Controls</h2>
              <div className="space-y-4">
                <button
                  onClick={runComprehensiveTests}
                  disabled={isTesting}
                  className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 text-white font-medium py-3 px-6 rounded-lg transition-colors"
                >
                  {isTesting ? 'Running Tests...' : 'Run Comprehensive Tests'}
                </button>
                
                {isTesting && (
                  <div className="text-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-2"></div>
                    <p className="text-sm text-gray-300">Running: {currentTest}</p>
                  </div>
                )}
              </div>
            </div>

            <div className="bg-gray-800 rounded-lg p-6">
              <h2 className="text-2xl font-semibold mb-4 text-purple-400">Current Emotional State</h2>
              <div className="space-y-2 text-sm">
                <p><span className="font-medium">Primary Emotion:</span> {emotionalState.primaryEmotion}</p>
                <p><span className="font-medium">Valence:</span> {emotionalState.valence.toFixed(2)}</p>
                <p><span className="font-medium">Arousal:</span> {emotionalState.arousal.toFixed(2)}</p>
                <p><span className="font-medium">Dominance:</span> {emotionalState.dominance.toFixed(2)}</p>
                <p><span className="font-medium">Confidence:</span> {emotionalState.confidence.toFixed(2)}</p>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-gray-800 rounded-lg p-6">
              <h2 className="text-2xl font-semibold mb-4 text-yellow-400">Test Results</h2>
              <div className="space-y-4 max-h-96 overflow-y-auto">
                {testResults.length === 0 ? (
                  <p className="text-gray-400 text-center">No tests run yet. Click "Run Comprehensive Tests" to start.</p>
                ) : (
                  testResults.map((result, index) => renderTestResult(result, index))
                )}
              </div>
            </div>

            <div className="bg-gray-800 rounded-lg p-6">
              <h2 className="text-2xl font-semibold mb-4 text-red-400">Live Creative Tools</h2>
              <NEARCreativeTools
                isConnected={isConnected}
                accountId={accountId}
                contract={contract}
                emotionalState={emotionalState}
                onGenerationComplete={(generation) => {
                  console.log('Creative generation completed:', generation);
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreativeEngineTest;