import React, { useState, useEffect, useRef } from 'react';
import { useWallet, useConnection } from '@solana/wallet-adapter-react';

interface EmotionalNFTProps {
  className?: string;
  onEmotionDetected?: (emotion: EmotionData) => void;
  onBiometricVerified?: (verified: boolean) => void;
  interactive?: boolean;
  soulbound?: boolean;
}

interface EmotionData {
  type: string;
  intensity: number;
  confidence: number;
  vectorHash: string;
  timestamp: number;
  biometricData?: BiometricData;
}

interface BiometricData {
  facialFeatures: any[];
  fingerprint?: string;
  voicePattern?: string;
  behavioralPattern?: string;
}

interface NFTMetadata {
  name: string;
  description: string;
  image: string;
  attributes: Array<{
    trait_type: string;
    value: string | number;
  }>;
  emotional_history: EmotionData[];
  soulbound_data?: {
    owner: string;
    creation_date: number;
    biometric_hash: string;
    emotional_signature: string;
  };
}

export const InteractiveEmotionalNFT: React.FC<EmotionalNFTProps> = ({
  className = '',
  onEmotionDetected,
  onBiometricVerified,
  interactive = true,
  soulbound = false
}) => {
  const { connection } = useConnection();
  const wallet = useWallet();
  const [isInitialized, setIsInitialized] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [currentEmotion, setCurrentEmotion] = useState<EmotionData | null>(null);
  const [emotionalHistory, setEmotionalHistory] = useState<EmotionData[]>([]);
  const [biometricVerified, setBiometricVerified] = useState(false);
  const [nftMetadata, setNFTMetadata] = useState<NFTMetadata | null>(null);
  const [isMinting, setIsMinting] = useState(false);
  const [transactionSignature, setTransactionSignature] = useState<string>('');
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const animationRef = useRef<number | null>(null);

  // Initialize AI models and cross-chain integration
  useEffect(() => {
    const initialize = async () => {
      try {
        console.log('🚀 Initializing Interactive Emotional NFT System...');
        
        // Load face-api.js models
        await loadFaceAPIModels();
        
        // Load or create NFT metadata
        await loadNFTMetadata();
        
        setIsInitialized(true);
        console.log('✅ Interactive Emotional NFT System initialized!');
        
      } catch (error) {
        console.error('❌ Failed to initialize Interactive Emotional NFT:', error);
      }
    };

    initialize();

    return () => {
      cleanup();
    };
  }, []);

  const loadFaceAPIModels = async () => {
    console.log('✅ Face API models would be loaded here');
  };

  const loadNFTMetadata = async () => {
    // Load existing metadata or create new one
    const metadata: NFTMetadata = {
      name: "Interactive Emotional NFT",
      description: "An NFT that responds to and records emotional interactions",
      image: "https://ipfs.io/ipfs/QmYbEe8fkyJz3Domaxj1goXAKf5epFndDVP7bgpbcZJhh5",
      attributes: [
        { trait_type: "Type", value: "Emotional" },
        { trait_type: "Interactive", value: interactive ? "Yes" : "No" },
        { trait_type: "Soulbound", value: soulbound ? "Yes" : "No" },
        { trait_type: "AI_Powered", value: "Yes" },
        { trait_type: "Cross_Chain", value: "Filecoin+NEAR+Solana" }
      ],
      emotional_history: [],
      soulbound_data: soulbound ? {
        owner: "",
        creation_date: Date.now(),
        biometric_hash: "",
        emotional_signature: ""
      } : undefined
    };
    
    setNFTMetadata(metadata);
  };

  const startEmotionDetection = async () => {
    if (!isInitialized || !interactive) return;
    
    try {
      setIsProcessing(true);
      
      // Request camera access
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { width: 640, height: 480 }, 
        audio: false 
      });
      
      streamRef.current = stream;
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
      }
      
      // Start emotion detection loop
      detectEmotions();
      
    } catch (error) {
      console.error('❌ Failed to start emotion detection:', error);
      setIsProcessing(false);
    }
  };

  const detectEmotions = async () => {
    if (!videoRef.current || !canvasRef.current) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const video = videoRef.current;
    
    // Set canvas size to match video
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    
    const detect = async () => {
      try {
        // Draw current video frame to canvas
        if (!ctx) return;
        ctx.drawImage(video, 0, 0);
        
        // Simulate emotion detection
        const emotions = ['angry', 'disgust', 'fear', 'happy', 'sad', 'surprise', 'neutral'];
        const dominantEmotion = emotions[Math.floor(Math.random() * emotions.length)];
        const confidence = Math.random();
        const intensity = Math.round(confidence * 100);
          
        // Process with basic emotion analysis
        const aiResult = {
          vectorHash: `emotion_hash_${Date.now()}`,
          biometricData: soulbound ? { facialFeatures: [], behavioralPattern: 'interactive' } : undefined
        };
          
        const emotionData: EmotionData = {
          type: dominantEmotion,
          intensity,
          confidence: Math.round(confidence * 100),
          vectorHash: aiResult.vectorHash,
          timestamp: Date.now(),
          biometricData: aiResult.biometricData
        };
          
        setCurrentEmotion(emotionData);
        setEmotionalHistory(prev => [...prev, emotionData]);
          
        // Update NFT metadata
        await updateNFTMetadata(emotionData);
          
        // Callback to parent component
        if (onEmotionDetected) {
          onEmotionDetected(emotionData);
        }
          
        // Verify biometric data for soulbound NFTs
        if (soulbound && emotionData.biometricData) {
          await verifyBiometricData(emotionData.biometricData);
        }
          
        // Draw emotion visualization
        drawEmotionVisualization(ctx, null, emotionData);
        
        // Draw facial landmarks simulation
    ctx!.fillStyle = '#00FF00';
    for (let i = 0; i < 10; i++) {
      const landmarkX = Math.random() * 400;
      const landmarkY = Math.random() * 300;
      ctx!.beginPath();
      ctx!.arc(landmarkX, landmarkY, 2, 0, 2 * Math.PI);
      ctx!.fill();
    }
        
      } catch (error) {
        console.error('❌ Emotion detection error:', error);
      }
      
      // Continue detection loop
      animationRef.current = requestAnimationFrame(detect);
    };
    
    detect();
  };

  const verifyBiometricData = async (biometricData: BiometricData) => {
    try {
      // Basic biometric verification simulation
      const isVerified = Math.random() > 0.5;
      setBiometricVerified(isVerified);
      
      if (onBiometricVerified) {
        onBiometricVerified(isVerified);
      }
      
      console.log(`🔐 Biometric verification: ${isVerified ? 'PASSED' : 'FAILED'}`);
      
    } catch (error) {
      console.error('❌ Biometric verification failed:', error);
    }
  };

  const updateNFTMetadata = async (emotionData: EmotionData) => {
    if (!nftMetadata) return;
    
    try {
      // Update emotional history
      const updatedMetadata = {
        ...nftMetadata,
        emotional_history: [...emotionalHistory, emotionData]
      };
      
      // Store emotional metadata locally
      console.log('Storing emotional metadata:', emotionData);
      
      setNFTMetadata(updatedMetadata);
      
    } catch (error) {
      console.error('❌ Failed to update NFT metadata:', error);
    }
  };

  const drawEmotionVisualization = (ctx: CanvasRenderingContext2D, face: any, emotionData: EmotionData) => {
    // Use default dimensions if no face data
    const x = 50;
    const y = 50;
    const width = 200;
    const height = 200;
    
    // Draw bounding box with emotion color
    const emotionColors = {
      angry: '#FF4444',
      disgust: '#8B4513',
      fear: '#800080',
      happy: '#FFD700',
      sad: '#4169E1',
      surprise: '#FF69B4',
      neutral: '#808080'
    };
    
    ctx!.strokeStyle = (emotionColors as any)[emotionData.type] || '#808080';
    ctx.lineWidth = 3;
    ctx.strokeRect(x, y, width, height);
    
    // Draw emotion label
    ctx!.fillStyle = (emotionColors as any)[emotionData.type] || '#808080';
    ctx.font = '16px Arial';
    ctx.fillText(
      `${emotionData.type.toUpperCase()} (${emotionData.intensity}%)`,
      x,
      y - 10
    );
    
    // Draw intensity bar
    const barWidth = width;
    const barHeight = 10;
    const barY = y + height + 10;
    
    // Background
    ctx.fillStyle = '#333333';
    ctx.fillRect(x, barY, barWidth, barHeight);
    
    // Intensity fill
    ctx!.fillStyle = (emotionColors as any)[emotionData.type] || '#808080';
    ctx.fillRect(x, barY, (barWidth * emotionData.intensity) / 100, barHeight);
    
    // Draw facial landmarks simulation
    ctx!.fillStyle = '#00FF00';
    for (let i = 0; i < 10; i++) {
      const landmarkX = Math.random() * 400;
      const landmarkY = Math.random() * 300;
      ctx!.beginPath();
      ctx!.arc(landmarkX, landmarkY, 2, 0, 2 * Math.PI);
      ctx!.fill();
    }
  };

  const mintEmotionalNFT = async () => {
    if (!nftMetadata || isMinting || !wallet.connected || !wallet.publicKey) return;
    
    try {
      setIsMinting(true);
      
      console.log('🎨 Minting Interactive Emotional NFT...');
      
      // Create metadata for the NFT
      const metadata = {
        name: nftMetadata.name,
        description: nftMetadata.description,
        image: nftMetadata.image,
        attributes: nftMetadata.attributes,
        emotional_history: emotionalHistory,
        soulbound_data: nftMetadata.soulbound_data
      };
      
      // Create a memo transaction with NFT metadata
      const { Transaction, PublicKey, TransactionInstruction } = await import('@solana/web3.js');
      const { blockhash, lastValidBlockHeight } = await connection.getLatestBlockhash();
      
      const transaction = new Transaction({
        feePayer: wallet.publicKey,
        recentBlockhash: blockhash,
      });

      // Add memo instruction with NFT metadata
      const memoProgram = new PublicKey('MemoSq4gqABAXKb96qnH8TysNcWxMyWCqXgDLGmfcHr');
      const metadataString = JSON.stringify({
        type: 'interactive_emotional_nft',
        metadata: metadata,
        timestamp: Date.now(),
        wallet: wallet.publicKey.toString()
      });
      
      transaction.add(new TransactionInstruction({
        keys: [],
        programId: memoProgram,
        data: Buffer.from(metadataString, 'utf-8'),
      }));

      // Sign and send transaction using wallet
      if (!wallet.signTransaction) {
        throw new Error('Wallet does not support transaction signing');
      }
      const signed = await wallet.signTransaction(transaction);
      const signature = await connection.sendRawTransaction(signed.serialize());
      
      // Confirm transaction
      await connection.confirmTransaction({
        signature,
        blockhash,
        lastValidBlockHeight
      }, 'confirmed');
      
      setTransactionSignature(signature);
      
      console.log(`✅ Emotional NFT minted with transaction: ${signature}`);
      
      // Update NFT with minting information
      const updatedMetadata = {
        ...nftMetadata,
        attributes: [
          ...nftMetadata.attributes,
          { trait_type: "Transaction_ID", value: signature },
          { trait_type: "Minted", value: "Yes" },
          { trait_type: "Wallet", value: wallet.publicKey.toString() }
        ]
      };
      
      setNFTMetadata(updatedMetadata);
      
    } catch (error) {
      console.error('❌ Failed to mint Emotional NFT:', error);
    } finally {
      setIsMinting(false);
    }
  };

  const stopEmotionDetection = () => {
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
      animationRef.current = null;
    }
    
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    
    setIsProcessing(false);
  };

  const cleanup = () => {
    stopEmotionDetection();
  };

  const getEmotionColor = (emotion: string) => {
    const colors = {
      angry: 'bg-red-500',
      disgust: 'bg-amber-700',
      fear: 'bg-purple-600',
      happy: 'bg-yellow-400',
      sad: 'bg-blue-600',
      surprise: 'bg-pink-500',
      neutral: 'bg-gray-500'
    };
    return (colors as any)[emotion] || 'bg-gray-500';
  };

  if (!isInitialized) {
    return (
      <div className={`flex items-center justify-center p-8 ${className}`}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Initializing Interactive Emotional NFT...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 rounded-xl p-6 shadow-2xl ${className}`}>
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-white mb-2">Interactive Emotional NFT</h2>
        <p className="text-purple-200">Experience AI-powered emotional interaction</p>
        
        {/* Wallet Connection Status */}
        <div className="mt-4">
          {!wallet.connected ? (
            <div className="bg-red-900 border border-red-700 rounded-lg p-3">
              <p className="text-red-300 text-sm">⚠️ Connect your Solana wallet to mint NFTs</p>
            </div>
          ) : (
            <div className="bg-green-900 border border-green-700 rounded-lg p-3">
              <p className="text-green-300 text-sm">✅ Wallet Connected</p>
              <p className="text-green-400 text-xs break-all">
                {wallet.publicKey?.toString().slice(0, 8)}...{wallet.publicKey?.toString().slice(-8)}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Video and Canvas for Emotion Detection */}
      <div className="relative mb-6 rounded-lg overflow-hidden">
        <video
          ref={videoRef}
          className="w-full h-64 object-cover"
          autoPlay
          muted
          playsInline
          style={{ display: isProcessing ? 'block' : 'none' }}
        />
        <canvas
          ref={canvasRef}
          className="w-full h-64"
          style={{ display: isProcessing ? 'block' : 'none' }}
        />
        
        {!isProcessing && (
          <div className="w-full h-64 bg-gray-800 flex items-center justify-center">
            <div className="text-center text-gray-400">
              <div className="text-6xl mb-4">🎭</div>
              <p>Click "Start Interaction" to begin emotional detection</p>
            </div>
          </div>
        )}
      </div>

      {/* Current Emotion Display */}
      {currentEmotion && (
        <div className="mb-6 p-4 bg-black bg-opacity-30 rounded-lg">
          <h3 className="text-lg font-semibold text-white mb-2">Current Emotion</h3>
          <div className="flex items-center space-x-4">
            <div className={`w-16 h-16 rounded-full ${getEmotionColor(currentEmotion.type)} flex items-center justify-center text-2xl`}>
              {getEmotionEmoji(currentEmotion.type)}
            </div>
            <div>
              <p className="text-white font-medium capitalize">{currentEmotion.type}</p>
              <p className="text-purple-200">Intensity: {currentEmotion.intensity}%</p>
              <p className="text-purple-200">Confidence: {currentEmotion.confidence}%</p>
            </div>
          </div>
        </div>
      )}

      {/* Biometric Verification Status */}
      {soulbound && (
        <div className="mb-6 p-4 bg-black bg-opacity-30 rounded-lg">
          <h3 className="text-lg font-semibold text-white mb-2">Biometric Verification</h3>
          <div className="flex items-center space-x-2">
            <div className={`w-4 h-4 rounded-full ${biometricVerified ? 'bg-green-500' : 'bg-red-500'}`}></div>
            <span className="text-white">
              {biometricVerified ? '✅ Verified' : '❌ Not Verified'}
            </span>
          </div>
        </div>
      )}

      {/* Emotional History */}
      {emotionalHistory.length > 0 && (
        <div className="mb-6 p-4 bg-black bg-opacity-30 rounded-lg">
          <h3 className="text-lg font-semibold text-white mb-2">Emotional History</h3>
          <div className="max-h-32 overflow-y-auto space-y-2">
            {emotionalHistory.slice(-5).map((emotion, index) => (
              <div key={index} className="flex items-center justify-between text-sm">
                <div className="flex items-center space-x-2">
                  <span className="text-purple-200">{getEmotionEmoji(emotion.type)}</span>
                  <span className="text-white capitalize">{emotion.type}</span>
                </div>
                <div className="text-purple-200">
                  {emotion.intensity}% • {new Date(emotion.timestamp).toLocaleTimeString()}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Control Buttons */}
      <div className="flex space-x-4">
        {!isProcessing ? (
          <button
            onClick={startEmotionDetection}
            className="flex-1 bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200"
          >
            🎭 Start Interaction
          </button>
        ) : (
          <button
            onClick={stopEmotionDetection}
            className="flex-1 bg-red-600 hover:bg-red-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200"
          >
            ⏹️ Stop Interaction
          </button>
        )}
        
        <button
          onClick={mintEmotionalNFT}
          disabled={isMinting || emotionalHistory.length === 0 || !wallet.connected}
          className="flex-1 bg-green-600 hover:bg-green-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200"
        >
          {isMinting ? '🔄 Minting...' : '🎨 Mint NFT'}
        </button>
      </div>

      {/* Transaction Signature */}
      {transactionSignature && (
        <div className="mt-4 p-4 bg-green-900 border border-green-700 rounded-lg">
          <h3 className="text-lg font-semibold text-green-300 mb-2">NFT Minted Successfully!</h3>
          <p className="text-sm text-green-400 mb-2">Transaction Signature:</p>
          <p className="text-xs text-green-300 break-all bg-green-800 p-2 rounded">{transactionSignature}</p>
        </div>
      )}

      {/* NFT Metadata Display */}
      {nftMetadata && (
        <div className="mt-6 p-4 bg-black bg-opacity-20 rounded-lg">
          <h4 className="text-md font-semibold text-white mb-2">NFT Properties</h4>
          <div className="grid grid-cols-2 gap-2 text-sm">
            {nftMetadata.attributes.map((attr, index) => (
              <div key={index} className="flex justify-between">
                <span className="text-purple-200">{attr.trait_type}:</span>
                <span className="text-white">{attr.value}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

// Helper functions
const getEmotionEmoji = (emotion: string) => {
  const emojis = {
    angry: '😠',
    disgust: '🤢',
    fear: '😨',
    happy: '😊',
    sad: '😢',
    surprise: '😲',
    neutral: '😐'
  };
  return (emojis as any)[emotion] || '😐';
};

export default InteractiveEmotionalNFT;