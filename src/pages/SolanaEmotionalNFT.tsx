import React, { useState, useEffect } from 'react';
import { useWallet, useConnection, WalletProvider } from '@solana/wallet-adapter-react';
import { WalletModalProvider, WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { PhantomWalletAdapter, SolflareWalletAdapter, TorusWalletAdapter } from '@solana/wallet-adapter-wallets';
import BiometricNFTClient, { createAnchorProvider } from '../utils/solana-client';
import '@solana/wallet-adapter-react-ui/styles.css';

interface EmotionData {
  valence: number;
  arousal: number;
  dominance: number;
  biometricHash: string;
}

interface NFTMetadata {
  name: string;
  symbol: string;
  description: string;
  image: string;
  attributes: Array<{
    trait_type: string;
    value: number | string;
  }>;
}

const SolanaEmotionalNFTContent: React.FC = () => {
  const { publicKey, signTransaction, connected, wallet } = useWallet();
  const { connection } = useConnection();
  const [emotionData, setEmotionData] = useState<EmotionData>({
    valence: 0.5,
    arousal: 0.5,
    dominance: 0.5,
    biometricHash: ''
  });
  const [isMinting, setIsMinting] = useState(false);
  const [nftMinted, setNftMinted] = useState(false);
  const [transactionSignature, setTransactionSignature] = useState<string>('');
  const [aiGeneratedArt, setAiGeneratedArt] = useState<string>('');
  const [nftClient, setNftClient] = useState<BiometricNFTClient | null>(null);

  // Initialize NFT client when wallet connects
  useEffect(() => {
    if (connected && wallet && publicKey) {
      const provider = createAnchorProvider(connection, wallet);
      const client = new BiometricNFTClient(connection, provider);
      setNftClient(client);
    }
  }, [connected, wallet, publicKey, connection]);

  // Generate AI art based on emotion data
  const generateEmotionArt = async () => {
    try {
      // This would integrate with the real AI engine
      const artPrompt = `Abstract emotional art with valence ${emotionData.valence}, arousal ${emotionData.arousal}, dominance ${emotionData.dominance}`;
      
      // Simulate AI art generation (in real implementation, this would call the AI engine)
      const mockArtUrl = `https://trae-api-sg.mchost.guru/api/ide/v1/text_to_image?prompt=${encodeURIComponent(artPrompt)}&image_size=square`;
      setAiGeneratedArt(mockArtUrl);
      
      return mockArtUrl;
    } catch (error) {
      console.error('Error generating AI art:', error);
      return '';
    }
  };

  // Mint NFT with emotion data
  const mintEmotionalNFT = async () => {
    if (!publicKey || !signTransaction || !nftClient) {
      alert('Please connect your wallet first');
      return;
    }

    setIsMinting(true);
    
    try {
      // Generate AI art based on emotions
      const artUrl = await generateEmotionArt();
      
      // Create metadata
      const metadata: NFTMetadata = {
        name: `Emotional Soul #${Date.now()}`,
        symbol: 'ESOUL',
        description: `AI-generated emotional NFT with biometric verification. Valence: ${emotionData.valence}, Arousal: ${emotionData.arousal}, Dominance: ${emotionData.dominance}`,
        image: artUrl,
        attributes: [
          { trait_type: 'Valence', value: emotionData.valence },
          { trait_type: 'Arousal', value: emotionData.arousal },
          { trait_type: 'Dominance', value: emotionData.dominance },
          { trait_type: 'Biometric_Verified', value: emotionData.biometricHash ? 'Yes' : 'No' },
          { trait_type: 'AI_Generated', value: 'Yes' }
        ]
      };

      // Calculate quality score
      const qualityScore = nftClient.calculateQualityScore(emotionData);
      
      // Generate biometric hash if not present
      const biometricHash = emotionData.biometricHash || nftClient.generateBiometricHash(emotionData);
      
      // Upload metadata to Arweave/IPFS
      const metadataUrl = await nftClient.uploadMetadata(metadata);
      console.log('Metadata uploaded to:', metadataUrl);
      
      // Initialize NFT on Solana
      const { transactionSignature: txSignature } = await nftClient.initializeNFT(
        publicKey,
        emotionData,
        qualityScore,
        biometricHash
      );
      
      setTransactionSignature(txSignature);
      setNftMinted(true);
      
      alert(`NFT minted successfully! Transaction: ${txSignature}`);
      
    } catch (error) {
      console.error('Error minting NFT:', error);
      alert('Error minting NFT: ' + error);
    } finally {
      setIsMinting(false);
    }
  };

  // Simulate biometric data capture
  const captureBiometricData = () => {
    // In real implementation, this would integrate with biometric sensors
    const mockHash = '0x' + Array.from({length: 64}, () => 
      '0123456789abcdef'[Math.floor(Math.random() * 16)]
    ).join('');
    
    setEmotionData(prev => ({
      ...prev,
      biometricHash: mockHash
    }));
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-8 text-center">
          Solana Emotional NFT Studio
        </h1>
        
        {!connected && (
          <div className="text-center mb-8">
            <p className="text-xl mb-4">Connect your Solana wallet to start minting emotional NFTs</p>
            <WalletMultiButton className="!bg-purple-600 hover:!bg-purple-700" />
          </div>
        )}
        
        {connected && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Emotion Controls */}
            <div className="bg-gray-800 rounded-lg p-6">
              <h2 className="text-2xl font-semibold mb-4">Emotion Parameters</h2>
              
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium mb-2">Valence (Pleasure)</label>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.01"
                    value={emotionData.valence}
                    onChange={(e) => setEmotionData(prev => ({ ...prev, valence: parseFloat(e.target.value) }))}
                    className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
                  />
                  <div className="flex justify-between text-xs text-gray-400 mt-1">
                    <span>Negative</span>
                    <span>Neutral</span>
                    <span>Positive</span>
                  </div>
                  <p className="text-center mt-1">{emotionData.valence.toFixed(2)}</p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2">Arousal (Energy)</label>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.01"
                    value={emotionData.arousal}
                    onChange={(e) => setEmotionData(prev => ({ ...prev, arousal: parseFloat(e.target.value) }))}
                    className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
                  />
                  <div className="flex justify-between text-xs text-gray-400 mt-1">
                    <span>Calm</span>
                    <span>Neutral</span>
                    <span>Excited</span>
                  </div>
                  <p className="text-center mt-1">{emotionData.arousal.toFixed(2)}</p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2">Dominance (Control)</label>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.01"
                    value={emotionData.dominance}
                    onChange={(e) => setEmotionData(prev => ({ ...prev, dominance: parseFloat(e.target.value) }))}
                    className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
                  />
                  <div className="flex justify-between text-xs text-gray-400 mt-1">
                    <span>Submissive</span>
                    <span>Neutral</span>
                    <span>Dominant</span>
                  </div>
                  <p className="text-center mt-1">{emotionData.dominance.toFixed(2)}</p>
                </div>
                
                <button
                  onClick={captureBiometricData}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
                >
                  Capture Biometric Data
                </button>
                
                {emotionData.biometricHash && (
                  <div className="bg-green-900 border border-green-700 rounded-lg p-3">
                    <p className="text-sm font-medium text-green-300">Biometric Verified</p>
                    <p className="text-xs text-green-400 break-all">{emotionData.biometricHash}</p>
                  </div>
                )}
              </div>
            </div>
            
            {/* NFT Preview & Minting */}
            <div className="bg-gray-800 rounded-lg p-6">
              <h2 className="text-2xl font-semibold mb-4">NFT Preview</h2>
              
              {aiGeneratedArt ? (
                <div className="mb-4">
                  <img
                    src={aiGeneratedArt}
                    alt="AI Generated Emotional Art"
                    className="w-full h-64 object-cover rounded-lg"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgZmlsbD0iIzY2NjY2NiIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LXNpemU9IjE0IiBmaWxsPSIjZmZmIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkeT0iLjNlbSI+RW1vdGlvbmFsIEFydDwvdGV4dD48L3N2Zz4=';
                    }}
                  />
                </div>
              ) : (
                <div className="w-full h-64 bg-gray-700 rounded-lg flex items-center justify-center mb-4">
                  <p className="text-gray-400">AI art will appear here</p>
                </div>
              )}
              
              <div className="space-y-4">
                <div className="bg-gray-700 rounded-lg p-4">
                  <h3 className="font-medium mb-2">Emotion Analysis</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Valence:</span>
                      <span className={emotionData.valence > 0.5 ? 'text-green-400' : 'text-red-400'}>
                        {emotionData.valence > 0.5 ? 'Positive' : 'Negative'}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Arousal:</span>
                      <span className={emotionData.arousal > 0.5 ? 'text-yellow-400' : 'text-blue-400'}>
                        {emotionData.arousal > 0.5 ? 'High Energy' : 'Low Energy'}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Dominance:</span>
                      <span className={emotionData.dominance > 0.5 ? 'text-purple-400' : 'text-orange-400'}>
                        {emotionData.dominance > 0.5 ? 'In Control' : 'Submissive'}
                      </span>
                    </div>
                  </div>
                </div>
                
                <button
                  onClick={mintEmotionalNFT}
                  disabled={isMinting}
                  className="w-full bg-purple-600 hover:bg-purple-700 disabled:bg-gray-600 text-white font-medium py-3 px-4 rounded-lg transition-colors"
                >
                  {isMinting ? 'Minting NFT...' : 'Mint Emotional NFT'}
                </button>
                
                {nftMinted && (
                  <div className="bg-green-900 border border-green-700 rounded-lg p-4">
                    <h4 className="font-medium text-green-300 mb-2">NFT Minted Successfully!</h4>
                    <p className="text-xs text-green-400 break-all">Transaction: {transactionSignature}</p>
                    <p className="text-sm text-green-300 mt-2">
                      Your emotional NFT has been created and soulbound to your biometric data!
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
        
        <div className="mt-8 bg-gray-800 rounded-lg p-6">
          <h3 className="text-xl font-semibold mb-4">Integration Status</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-gray-700 rounded-lg p-4">
              <h4 className="font-medium mb-2">Wallet Connection</h4>
              <p className={`text-sm ${connected ? 'text-green-400' : 'text-red-400'}`}>
                {connected ? 'Connected' : 'Not Connected'}
              </p>
            </div>
            <div className="bg-gray-700 rounded-lg p-4">
              <h4 className="font-medium mb-2">Biometric Verification</h4>
              <p className={`text-sm ${emotionData.biometricHash ? 'text-green-400' : 'text-yellow-400'}`}>
                {emotionData.biometricHash ? 'Verified' : 'Pending'}
              </p>
            </div>
            <div className="bg-gray-700 rounded-lg p-4">
              <h4 className="font-medium mb-2">AI Art Generation</h4>
              <p className={`text-sm ${aiGeneratedArt ? 'text-green-400' : 'text-yellow-400'}`}>
                {aiGeneratedArt ? 'Generated' : 'Ready'}
              </p>
            </div>
          </div>
          
          <div className="mt-4 p-4 bg-yellow-900 border border-yellow-700 rounded-lg">
            <h4 className="font-medium text-yellow-300 mb-2">⚠️ Integration Note</h4>
            <p className="text-sm text-yellow-300">
              This is a frontend demonstration. To make it fully functional, integrate with:
            </p>
            <ul className="text-sm text-yellow-300 mt-2 list-disc list-inside">
              <li>Solana biometric NFT program deployment</li>
              <li>Real AI art generation engine</li>
              <li>Biometric data capture hardware/software</li>
              <li>Metadata upload to Arweave/IPFS</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

// Wallet provider wrapper
const SolanaEmotionalNFT: React.FC = () => {
  const wallets = [
    new PhantomWalletAdapter(),
    new SolflareWalletAdapter(),
    new TorusWalletAdapter()
  ];

  return (
    <WalletProvider wallets={wallets} autoConnect>
      <WalletModalProvider>
        <SolanaEmotionalNFTContent />
      </WalletModalProvider>
    </WalletProvider>
  );
};

export default SolanaEmotionalNFT;