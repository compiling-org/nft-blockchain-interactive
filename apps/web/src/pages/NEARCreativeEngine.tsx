import React, { useState, useEffect, useCallback, useRef } from 'react';
import { myNearWalletService } from '@/services/myNearWalletService';
import MediaPipeSensors from '../components/MediaPipeSensors';
import LeapMotionSensors from '../components/LeapMotionSensors';
import TypeGPUVisualizer from '../components/TypeGPUVisualizer';
import { HybridAIManager } from '../utils/hybrid-ai-manager';
import { toast } from 'sonner';

export const NEARCreativeEngine: React.FC = () => {
  const [accountId, setAccountId] = useState<string>('');
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [emotionData, setEmotionData] = useState({ valence: 0.5, arousal: 0.5, dominance: 0.5 });
  const [isMinting, setIsMinting] = useState(false);
  const [sensorCounts, setSensorCounts] = useState({ hands: 0, faces: 0, poses: 0 });
  const [sensorFeatures, setSensorFeatures] = useState<any>(null);

  const aiManagerRef = useRef<HybridAIManager | null>(null);

  useEffect(() => {
    if (!aiManagerRef.current) {
      aiManagerRef.current = new HybridAIManager();
    }

    const checkConnection = async () => {
      try {
        await myNearWalletService.initialize();
        if (myNearWalletService.isSignedIn()) {
          setAccountId(myNearWalletService.getAccountId());
          setIsConnected(true);
        }
      } catch (error) {
        console.log('No existing NEAR connection');
      }
    };

    checkConnection();
  }, []);

  const connectNEARWallet = async () => {
    setIsConnecting(true);
    try {
      await myNearWalletService.signIn();
    } catch (error) {
      toast.error('Failed to connect to NEAR wallet');
    } finally {
      setIsConnecting(false);
    }
  };

  const disconnectNEARWallet = () => {
    myNearWalletService.signOut();
    setAccountId('');
    setIsConnected(false);
  };

  const handleSensorMetrics = useCallback(async (metrics: any) => {
    setSensorCounts({ hands: metrics.hands, faces: metrics.faces, poses: metrics.poses });
    if (metrics.features) setSensorFeatures(metrics.features);

    const ai = aiManagerRef.current;
    if (ai) {
      const audioData = ai.getLiveAudioData();
      const eegData = ai.generateSyntheticEEG();
      const result = await ai.detectEmotion(eegData, audioData, metrics.features);

      setEmotionData({
        valence: result.valence,
        arousal: result.arousal,
        dominance: result.dominance
      });
    }
  }, []);

  const mintBiometricNFT = async () => {
    if (!isConnected) {
      toast.error('Please connect your NEAR wallet first');
      return;
    }

    setIsMinting(true);
    toast.loading('Minting Biometric NFT on NEAR...', { id: 'near-mint' });

    try {
      const contractId = 'bio-nft-1764175259.sleeplessmonk-testnet-1764175172.testnet';
      const tokenId = `bio-${Date.now()}`;

      // Call the interactive mint function defined in the architecture
      await myNearWalletService.callMethod(
        contractId,
        'mint_interactive_nft',
        {
          token_id: tokenId,
          receiver_id: accountId,
          metadata: {
            title: `Emotional Fractal #${tokenId}`,
            description: `Real-time biometric NFT driven by VAD emotional state.`,
            media: "ipfs://placeholder", // In a real flow, we'd upload the canvas to IPFS first
          },
          initial_emotional_state: {
            valence: emotionData.valence,
            arousal: emotionData.arousal,
            dominance: emotionData.dominance,
            confidence: 0.9,
            complexity: 0.5
          }
        },
        '30000000000000', // 30 TGas
        '100000000000000000000000' // 0.1 NEAR deposit
      );

      toast.success('🎉 Biometric NFT Minted Successfully!', { id: 'near-mint' });
    } catch (error) {
      console.error('NEAR Mint failed:', error);
      toast.error('Failed to mint NFT on NEAR. Check balance or contract permissions.', { id: 'near-mint' });
    } finally {
      setIsMinting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-teal-900 to-indigo-900 text-white p-6">
      <div className="max-w-6xl mx-auto">
        <header className="flex justify-between items-center mb-10">
          <div>
            <h1 className="text-4xl font-extrabold tracking-tight">NEAR Fractal Studio</h1>
            <p className="text-teal-400 mt-2 italic">Real AI & Biometric Interaction Engine</p>
          </div>

          <div className="flex gap-4">
            {!isConnected ? (
              <button
                onClick={connectNEARWallet}
                disabled={isConnecting}
                className="bg-teal-600 hover:bg-teal-700 px-6 py-2 rounded-full font-bold transition-all shadow-lg shadow-teal-500/20"
              >
                {isConnecting ? 'Connecting...' : 'Connect NEAR'}
              </button>
            ) : (
              <div className="flex items-center gap-4">
                <span className="text-sm font-mono text-teal-300 bg-teal-900/40 px-3 py-1 rounded-full border border-teal-500/30">
                  {accountId}
                </span>
                <button
                  onClick={disconnectNEARWallet}
                  className="text-gray-400 hover:text-white text-sm"
                >
                  Disconnect
                </button>
              </div>
            )}
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Visualizer */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-black/60 rounded-3xl overflow-hidden border border-white/10 shadow-2xl relative group">
              <TypeGPUVisualizer emotionalState={emotionData} />

              <div className="absolute bottom-6 left-6 right-6 flex justify-between items-end">
                <div className="space-y-1">
                  <div className="text-xs uppercase tracking-widest text-white/40">Current VAD Vector</div>
                  <div className="flex gap-3 text-sm font-mono">
                    <span className="text-blue-400">V: {emotionData.valence.toFixed(2)}</span>
                    <span className="text-orange-400">A: {emotionData.arousal.toFixed(2)}</span>
                    <span className="text-green-400">D: {emotionData.dominance.toFixed(2)}</span>
                  </div>
                </div>

                <button
                  onClick={mintBiometricNFT}
                  disabled={isMinting || !isConnected}
                  className="bg-white text-black hover:bg-teal-400 hover:text-white px-8 py-3 rounded-2xl font-black text-lg transition-all transform hover:scale-105 active:scale-95 disabled:opacity-50 disabled:hover:scale-100"
                >
                  {isMinting ? 'MINTING...' : 'MINT ON NEAR'}
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <MediaPipeSensors onMetrics={handleSensorMetrics} className="h-full" />
              <LeapMotionSensors onMetrics={(m) => console.log('Leap:', m)} className="h-full" />
            </div>
          </div>

          {/* Sidebar / Stats */}
          <div className="space-y-6">
            <div className="bg-white/5 rounded-3xl p-6 border border-white/10 backdrop-blur-sm">
              <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                <span className="w-2 h-2 bg-teal-500 rounded-full animate-pulse" />
                Live Engine Stats
              </h3>

              <div className="space-y-4">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-400">Hand Tracking</span>
                  <span className={sensorCounts.hands > 0 ? "text-green-400" : "text-red-400"}>
                    {sensorCounts.hands > 0 ? 'ACTIVE' : 'IDLE'}
                  </span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-400">Face Landmark Confidence</span>
                  <span className="text-blue-400">{(sensorFeatures?.confidence * 100 || 0).toFixed(1)}%</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-400">Audio FFT Resolution</span>
                  <span className="text-purple-400">256 bins</span>
                </div>
              </div>

              <div className="mt-8 pt-8 border-t border-white/10">
                <h4 className="text-sm font-bold text-teal-400 uppercase mb-3">Contract Info</h4>
                <div className="bg-black/40 rounded-xl p-3 text-[10px] font-mono break-all text-gray-400">
                  bio-nft-1764175259.sleeplessmonk-testnet-1764175172.testnet
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-teal-500/20 to-indigo-500/20 rounded-3xl p-6 border border-teal-500/20">
              <h3 className="font-bold mb-2">How it works</h3>
              <p className="text-sm text-gray-300 leading-relaxed">
                Your movements and audio environment are processed by local AI models.
                The resulting emotional vector (VAD) distorts the fractal aura in real-time using WebGPU.
                When you mint, this cryptographic signature is permanently anchored to the NEAR blockchain.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NEARCreativeEngine;
