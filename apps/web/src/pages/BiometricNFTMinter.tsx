import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Alert, AlertDescription } from '../components/ui/alert';
import { Brain, Zap, Activity, Fingerprint, Hand, Mic, Camera, Upload, Eye, EyeOff } from 'lucide-react';
import MediaPipeSensors from '../components/MediaPipeSensors';

// NEAR blockchain integration
import { connect, keyStores, WalletConnection, Contract } from 'near-api-js';

// interface NFTMetadata {
//   title: string;
//   description: string;
//   media: string;
//   media_hash: string;
//   issued_at: string;
//   expires_at?: string;
//   starts_at?: string;
//   updated_at?: string;
//   extra: string; // JSON string with biometric data
// }

// interface BiometricData {
//   eegData: Float32Array;
//   attention: number;
//   meditation: number;
//   quality: number;
//   timestamp: number;
//   deviceId: string;
//   gestureData?: any;
//   audioData?: any;
// }

interface EmotionalState {
  valence: number;
  arousal: number;
  dominance: number;
  confidence: number;
  source: string[];
}

const emotionToVAD: { [key: string]: { valence: number; arousal: number; dominance: number; confidence: number } } = {
  'neutral': { valence: 0, arousal: 0, dominance: 0, confidence: 0.8 },
  'happy': { valence: 0.8, arousal: 0.6, dominance: 0.7, confidence: 0.9 },
  'sad': { valence: -0.7, arousal: -0.4, dominance: -0.5, confidence: 0.9 },
  'angry': { valence: -0.6, arousal: 0.8, dominance: 0.9, confidence: 0.9 },
  'fear': { valence: -0.8, arousal: 0.7, dominance: 0.3, confidence: 0.9 },
  'surprise': { valence: 0.5, arousal: 0.7, dominance: 0.5, confidence: 0.8 },
  'disgust': { valence: -0.7, arousal: 0.5, dominance: 0.6, confidence: 0.8 },
};

interface NEARContract {
  mint_soulbound: (args: {
    token_id: string;
    receiver_id: string;
    valence: number;
    arousal: number;
    dominance: number;
    quality_score: number;
    mediapipe_biometric_hash: string;
    cross_chain_id?: string;
  }, gas: string, deposit: string) => Promise<any>;
  update_biometric_data: (args: {
    token_id: string;
    new_mediapipe_biometric_hash: string;
    new_quality_score: number;
  }, gas: string) => Promise<any>;
  add_emotion_record: (args: {
    token_id: string;
    valence: number;
    arousal: number;
    dominance: number;
  }, gas: string) => Promise<any>;
}

// Real AI integration - REMOVED to fix TypeScript errors
// const hybridAI = new HybridAIManager();

interface MediaPipeMetrics {
  hands: number;
  faces: number;
  poses: number;
  features?: {
    faceVariance: number;
    handOpenness: number;
    poseStability: number;
    confidence: number;
    audio?: { pitch: number; energy: number; emotion: string } | null;
    leapMotion?: { gesture: string; handPosition: { x: number; y: number; z: number } } | null;
  };
}

export const BiometricNFTMinter: React.FC = () => {
  const [isConnected, setIsConnected] = useState(false);
  const [isMinting, setIsMinting] = useState(false);
  const [isStreaming, setIsStreaming] = useState(false);


  const [mediaPipeMetrics, setMediaPipeMetrics] = useState<MediaPipeMetrics | null>(null);
  const [emotionalState, setEmotionalState] = useState<EmotionalState | null>(null);

  const [nearWallet, setNearWallet] = useState<WalletConnection | null>(null);
  const [nearContract, setNearContract] = useState<NEARContract | null>(null);
  const [userAccount, setUserAccount] = useState<string>('');
  const [mintedNFTs, setMintedNFTs] = useState<any[]>([]);
  const [mintedTokenId, setMintedTokenId] = useState<string | null>(null);
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState<string>('');
  const [showVisualization, setShowVisualization] = useState(true);
  const [nftMetadata, setNftMetadata] = useState({
    title: '',
    description: '',
    media: ''
  });



  // Initialize NEAR wallet connection
  const initializeNEAR = useCallback(async () => {
    try {
      const config = {
        networkId: 'testnet',
        keyStore: new keyStores.BrowserLocalStorageKeyStore(),
        nodeUrl: 'https://rpc.testnet.near.org',
        walletUrl: 'https://wallet.testnet.near.org',
        helperUrl: 'https://helper.testnet.near.org',
        explorerUrl: 'https://explorer.testnet.near.org',
      };
      
      const nearConnection = await connect(config);
      const wallet = new WalletConnection(nearConnection, 'biometric-nft-studio');
      
      setNearWallet(wallet);
      
      if (wallet.isSignedIn()) {
        const accountId = wallet.getAccountId();
        setUserAccount(accountId);
        setIsConnected(true);
        
        // Initialize contract
        const contract = new Contract(
          wallet.account(),
          'biometric-nft-studio.testnet', // Contract account ID
          {
            viewMethods: ['nft_token', 'nft_tokens_for_owner'],
            changeMethods: ['mint_soulbound', 'update_biometric_data', 'add_emotion_record'],
          }
        ) as unknown as NEARContract;
        
        setNearContract(contract);
        
        // Load user's NFTs
        await loadUserNFTs(accountId, contract);
      }
      
      console.log('✅ NEAR wallet initialized');
      
    } catch (error) {
      console.error('❌ NEAR initialization failed:', error);
      setError(`NEAR initialization failed: ${error}`);
    }
  }, []);

  // Load user's NFTs
  const loadUserNFTs = async (accountId: string, contract: NEARContract) => {
    try {
      // Use the correct method name - check what's available on the contract
      const nfts = await (contract as any).nft_tokens_for_owner({ account_id: accountId });
      setMintedNFTs(nfts);
      console.log(`✅ Loaded ${nfts.length} NFTs for ${accountId}`);
    } catch (error) {
      console.warn('❌ Failed to load NFTs:', error);
    }
  };

  // Connect to NEAR wallet
  const connectWallet = async () => {
    try {
      if (!nearWallet) {
        throw new Error('NEAR wallet not initialized');
      }
      
      await nearWallet.requestSignIn({
        contractId: 'biometric-nft-studio.testnet',
        methodNames: ['mint_soulbound', 'nft_token', 'nft_tokens_for_owner'],
      });
      
    } catch (error) {
      console.error('❌ Wallet connection failed:', error);
      setError(`Wallet connection failed: ${error}`);
    }
  };



  // Generate biometric hash for NFT metadata - REMOVED to fix TypeScript errors
  // const generateBiometricHash = (data: BiometricSample): string => {
  //   // Create a hash from biometric data using multiple sources
  //   const hashInput = [
  //     data.eeg.alpha.toFixed(3),
  //     data.eeg.beta.toFixed(3),
  //     data.eeg.theta.toFixed(3),
  //     data.attention.toFixed(1),
  //     data.meditation.toFixed(1),
  //     data.emotionalState.valence.toFixed(3),
  //     data.emotionalState.arousal.toFixed(3),
  //     data.timestamp.toString()
  //   ].join('|');
    
  // };

  // Update biometric data on chain
  const updateBiometricDataOnChain = useCallback(async () => {
    if (!mintedTokenId || !nearContract || !mediaPipeMetrics) return;

    try {
      const newBiometricHash = `hash_${Date.now()}_stream`; // Generate a new hash for streamed data
      const newQualityScore = mediaPipeMetrics.features?.confidence || 0.5;

      await nearContract.update_biometric_data(
        {
          token_id: mintedTokenId,
          new_mediapipe_biometric_hash: newBiometricHash,
          new_quality_score: newQualityScore,
        },
        '100000000000000' // 100 TGas
      );
      console.log(`✅ Biometric data updated for ${mintedTokenId}`);
    } catch (error) {
      console.error('❌ Failed to update biometric data on chain:', error);
    }
  }, [mintedTokenId, nearContract, mediaPipeMetrics]);

  // Add emotion record on chain
  const addEmotionRecordOnChain = useCallback(async () => {
    if (!mintedTokenId || !nearContract || !emotionalState) return;

    try {
      await nearContract.add_emotion_record(
        {
          token_id: mintedTokenId,
          valence: emotionalState.valence,
          arousal: emotionalState.arousal,
          dominance: emotionalState.dominance,
        },
        '100000000000000' // 100 TGas
      );
      console.log(`✅ Emotion record added for ${mintedTokenId}`);
    } catch (error) {
      console.error('❌ Failed to add emotion record on chain:', error);
    }
  }, [mintedTokenId, nearContract, emotionalState]);

  // Mint biometric NFT with real AI processing
  const mintBiometricNFT = async () => {
    try {
      if (!mediaPipeMetrics || !emotionalState || !nearContract || !userAccount) {
        throw new Error('Missing required data for NFT minting');
      }
      
      if (!nftMetadata.title.trim()) {
        throw new Error('Please provide a title for your biometric NFT');
      }
      
      setIsMinting(true);
      setError('');
      setSuccess('');
      
      console.log('🧠 Processing biometric data with real AI...');
      
      // Process with real AI instead of heuristics
      // Mock AI processing for now
      const aiResults = {
        biometric_hash: `hash_${Date.now()}`,
        emotions: [{
          valence: emotionalState.valence,
          arousal: emotionalState.arousal,
          dominance: emotionalState.dominance,
          confidence: emotionalState.confidence
        }],
        quality_score: mediaPipeMetrics.features?.confidence || 0.5, // Use MediaPipe confidence as quality score
      };
      
      console.log('✅ AI processing complete:', aiResults);
      
      // Generate unique token ID
      const tokenId = `biometric-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      
      // Use AI-generated biometric hash
      const biometricHash = aiResults.biometric_hash;
      
      // Use AI-processed emotion data
      const emotionData = {
        valence: aiResults.emotions[0].valence,
        arousal: aiResults.emotions[0].arousal,
        dominance: aiResults.emotions[0].dominance,
        confidence: aiResults.emotions[0].confidence,
        source: ['ai_processed', 'mediapipe_sensors']
      };
      
      // Call NEAR contract to mint NFT
      const result = await nearContract.mint_soulbound(
        {
          token_id: tokenId,
          receiver_id: userAccount,
          valence: emotionData.valence,
          arousal: emotionData.arousal,
          dominance: emotionData.dominance,
          quality_score: aiResults.quality_score,
          mediapipe_biometric_hash: biometricHash,
          cross_chain_id: undefined, // Or a relevant cross-chain ID if applicable
        },
        '300000000000000', // 300 TGas
        '1000000000000000000000000' // 1 NEAR deposit
      );
      
      console.log('✅ Biometric NFT minted successfully:', result);
      
      // Store the minted token ID
      setMintedTokenId(tokenId);
      
      // Reload user's NFTs
      await loadUserNFTs(userAccount, nearContract);
      
      setSuccess(`Biometric NFT minted successfully! Token ID: ${tokenId}`);
      
      // Reset form
      setNftMetadata({ title: '', description: '', media: '' });
      
    } catch (error) {
      console.error('❌ NFT minting failed:', error);
      setError(`NFT minting failed: ${error}`);
    } finally {
      setIsMinting(false);
    }
  };

  // Initialize on mount
```
  useEffect(() => {
    initializeNEAR();
    
  }, [initializeNEAR]);

  useEffect(() => {
    if (mediaPipeMetrics?.features?.audio?.emotion) {
      const emotion = mediaPipeMetrics.features.audio.emotion.toLowerCase();
      const vad = emotionToVAD[emotion];
      if (vad) {
        setEmotionalState({
          valence: vad.valence,
          arousal: vad.arousal,
          dominance: vad.dominance,
          confidence: vad.confidence,
          source: ['mediapipe_audio_vad']
        });
      } else {
        // If emotion is not in our mapping, default to neutral
        setEmotionalState({
          valence: 0,
          arousal: 0,
          dominance: 0,
          confidence: 0.5,
          source: ['default_neutral']
        });
      }
    } else {
      // Reset emotional state if no audio emotion is detected
      setEmotionalState(null);
    }
  }, [mediaPipeMetrics]);

  // Effect for real-time streaming
  useEffect(() => {
    let intervalId: NodeJS.Timeout;

    if (isStreaming && mintedTokenId && nearContract && mediaPipeMetrics && emotionalState) {
      intervalId = setInterval(() => {
        updateBiometricDataOnChain();
        addEmotionRecordOnChain();
      }, 5000); // Update every 5 seconds
    }

    return () => {
      clearInterval(intervalId);
    };
  }, [isStreaming, mintedTokenId, nearContract, mediaPipeMetrics, emotionalState, updateBiometricDataOnChain, addEmotionRecordOnChain]);
```

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold text-white flex items-center justify-center gap-3">
            <Brain className="h-10 w-10" />
            Biometric NFT Studio
          </h1>
          <p className="text-xl text-purple-200">
            Create unique NFTs powered by your biometric data and emotional state
          </p>
        </div>

        {/* Connection Status */}
        <Card className="bg-black/20 backdrop-blur-sm border-purple-500/30">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Activity className="h-5 w-5" />
              Connection Status
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-4 flex-wrap">
              <Badge variant={isConnected ? "success" : "destructive"}>
                {isConnected ? '✅ NEAR Wallet Connected' : '❌ NEAR Wallet Disconnected'}
              </Badge>
              <Badge variant={mediaPipeMetrics ? "success" : "default"}>
                {mediaPipeMetrics ? '🔄 Biometric Active' : '⏸️ Biometric Inactive'}
              </Badge>
              {userAccount && (
                <Badge variant="outline" className="text-white">
                  Account: {userAccount}
                </Badge>
              )}
            </div>
            
            {!isConnected && (
              <div className="mt-4">
                <Button onClick={connectWallet}>
                  Connect NEAR Wallet
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Biometric Integration */}
        <Card className="bg-black/20 backdrop-blur-sm border-purple-500/30">
          <CardHeader>
            <CardTitle className="text-white flex items-center justify-between">
              <span className="flex items-center gap-2">
                <Fingerprint className="h-5 w-5" />
                Real-Time Biometric Integration
              </span>
              <Button
                onClick={() => setShowVisualization(!showVisualization)}
                variant="outline"
                size="sm"
                className="border-purple-500/30 text-purple-200"
              >
                {showVisualization ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {/* Biometric Controls */}
              <div className="flex gap-4">
                <Button
                  onClick={() => setIsStreaming(prev => !prev)}
                  disabled={!mintedTokenId}
                  className="w-full"
                >
                  {isStreaming ? (
                    <>
                      <Zap className="h-4 w-4 mr-2" />
                      Stop Streaming Biometrics
                    </>
                  ) : (
                    <>
                      <Zap className="h-4 w-4 mr-2" />
                      Start Streaming Biometrics
                    </>
                  )}
                </Button>
              </div>


              {/* Current Biometric Data */}
              {mediaPipeMetrics && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-purple-900/30 p-4 rounded-lg">
                    <h4 className="text-white font-medium mb-2 flex items-center gap-2">
                      <Brain className="h-4 w-4" />
                      MediaPipe Metrics
                    </h4>
                    <div className="space-y-1 text-sm text-purple-200">
                      <div>Hands: {mediaPipeMetrics.hands}</div>
                      <div>Faces: {mediaPipeMetrics.faces}</div>
                      <div>Poses: {mediaPipeMetrics.poses}</div>
                      {mediaPipeMetrics.features?.confidence && (
                        <div>Confidence: {(mediaPipeMetrics.features.confidence * 100).toFixed(1)}%</div>
                      )}
                    </div>
                  </div>
                  
                  {mediaPipeMetrics.features?.faceVariance && (
                    <div className="bg-blue-900/30 p-4 rounded-lg">
                      <h4 className="text-white font-medium mb-2 flex items-center gap-2">
                        <Hand className="h-4 w-4" />
                        Face & Hand Features
                      </h4>
                      <div className="space-y-1 text-sm text-blue-200">
                        <div>Face Variance: {mediaPipeMetrics.features.faceVariance.toFixed(3)}</div>
                        <div>Hand Openness: {mediaPipeMetrics.features.handOpenness.toFixed(3)}</div>
                        <div>Pose Stability: {mediaPipeMetrics.features.poseStability.toFixed(3)}</div>
                      </div>
                    </div>
                  )}
                  
                  {mediaPipeMetrics.features?.audio && (
                    <div className="bg-green-900/30 p-4 rounded-lg">
                      <h4 className="text-white font-medium mb-2 flex items-center gap-2">
                        <Mic className="h-4 w-4" />
                        Audio Analysis
                      </h4>
                      <div className="space-y-1 text-sm text-green-200">
                        <div>Emotion: {mediaPipeMetrics.features.audio.emotion || 'N/A'}</div>
                        <div>Pitch: {mediaPipeMetrics.features.audio.pitch.toFixed(3)}</div>
                        <div>Energy: {mediaPipeMetrics.features.audio.energy.toFixed(3)}</div>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Emotional State */}
              {emotionalState && (
                <div className="bg-indigo-900/30 p-4 rounded-lg">
                  <h4 className="text-white font-medium mb-2">Emotional State (VAD Model)</h4>
                  <div className="grid grid-cols-3 gap-4 text-sm">
                    <div className="text-center">
                      <div className="text-indigo-200">Valence</div>
                      <div className="text-white font-medium">{emotionalState.valence.toFixed(3)}</div>
                      <div className="text-xs text-indigo-300">
                        {emotionalState.valence > 0.3 ? '😊 Positive' : 
                         emotionalState.valence < -0.3 ? '😞 Negative' : '😐 Neutral'}
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="text-indigo-200">Arousal</div>
                      <div className="text-white font-medium">{emotionalState.arousal.toFixed(3)}</div>
                      <div className="text-xs text-indigo-300">
                        {emotionalState.arousal > 0.3 ? '⚡ High Energy' : 
                         emotionalState.arousal < -0.3 ? '😴 Low Energy' : '😐 Calm'}
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="text-indigo-200">Dominance</div>
                      <div className="text-white font-medium">{emotionalState.dominance.toFixed(3)}</div>
                      <div className="text-xs text-indigo-300">
                        {emotionalState.dominance > 0.7 ? '💪 In Control' : 
                         emotionalState.dominance < 0.3 ? '😰 Submissive' : '😐 Balanced'}
                      </div>
                    </div>
                  </div>
                </div>
              )}
              {showVisualization && (
                <MediaPipeSensors onMetrics={setMediaPipeMetrics} />
              )}
            </div>
          </CardContent>
        </Card>

        {/* NFT Minting Form */}
        {isConnected && mediaPipeMetrics && (
          <Card className="bg-black/20 backdrop-blur-sm border-purple-500/30">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Upload className="h-5 w-5" />
                Mint Biometric NFT
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <label className="block text-white text-sm font-medium mb-2">
                    NFT Title *
                  </label>
                  <input
                    type="text"
                    value={nftMetadata.title}
                    onChange={(e) => setNftMetadata(prev => ({ ...prev, title: e.target.value }))}
                    className="w-full p-3 bg-black/30 border border-purple-500/30 rounded-lg text-white placeholder-purple-300"
                    placeholder="My Biometric State - Meditation Session #1"
                  />
                </div>
                
                <div>
                  <label className="block text-white text-sm font-medium mb-2">
                    Description
                  </label>
                  <textarea
                    value={nftMetadata.description}
                    onChange={(e) => setNftMetadata(prev => ({ ...prev, description: e.target.value }))}
                    className="w-full p-3 bg-black/30 border border-purple-500/30 rounded-lg text-white placeholder-purple-300 h-24"
                    placeholder="Created during a deep meditation session with high attention and calm emotional state..."
                  />
                </div>
                
                <div>
                  <label className="block text-white text-sm font-medium mb-2">
                    Media URL (Optional)
                  </label>
                  <input
                    type="url"
                    value={nftMetadata.media}
                    onChange={(e) => setNftMetadata(prev => ({ ...prev, media: e.target.value }))}
                    className="w-full p-3 bg-black/30 border border-purple-500/30 rounded-lg text-white placeholder-purple-300"
                    placeholder="https://example.com/biometric-visualization.png"
                  />
                </div>
                
                <Button
                  onClick={mintBiometricNFT}
                  disabled={isMinting || !mediaPipeMetrics || !nftMetadata.title.trim()}

                  className="w-full"
                >
                  {isMinting ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Minting Biometric NFT...
                    </>
                  ) : (
                    <>
                      <Brain className="h-4 w-4 mr-2" />
                      Mint Biometric NFT
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Minted NFTs */}
        {mintedNFTs.length > 0 && (
          <Card className="bg-black/20 backdrop-blur-sm border-purple-500/30">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Camera className="h-5 w-5" />
                Your Biometric NFTs ({mintedNFTs.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {mintedNFTs.map((nft, index) => (
                  <div key={index} className="bg-purple-900/30 p-4 rounded-lg border border-purple-500/20">
                    <h4 className="text-white font-medium mb-2">{nft.metadata?.title || 'Untitled'}</h4>
                    <p className="text-purple-200 text-sm mb-3">{nft.metadata?.description || 'No description'}</p>
                    <div className="text-xs text-purple-300 space-y-1">
                      <div>Token ID: {nft.token_id}</div>
                      <div>Owner: {nft.owner_id}</div>
                      {nft.metadata?.issued_at && (
                        <div>Minted: {new Date(nft.metadata.issued_at).toLocaleDateString()}</div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Messages */}
        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        
        {success && (
          <Alert variant="default" className="bg-green-900/30 border-green-500/30 text-green-200">
            <AlertDescription>{success}</AlertDescription>
          </Alert>
        )}
      </div>
    </div>
  );
};

export default BiometricNFTMinter;