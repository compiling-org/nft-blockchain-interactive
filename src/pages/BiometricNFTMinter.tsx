import React, { useState, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Alert, AlertDescription } from '../components/ui/alert';
import { Badge } from '../components/ui/badge';
import RealBiometricIntegration from '../components/RealBiometricIntegration';
import { Brain, Zap, Fingerprint, Network } from 'lucide-react';

// NEAR integration
import { connect, WalletConnection } from 'near-api-js';
import { InMemoryKeyStore } from 'near-api-js/lib/key_stores';

interface BiometricNFTData {
  eegData: Float32Array;
  attention: number;
  meditation: number;
  quality: number;
  valence: number;
  arousal: number;
  dominance: number;
  timestamp: number;
  deviceId: string;
}

interface MintedNFT {
  tokenId: string;
  owner: string;
  metadata: BiometricNFTData;
  transactionHash: string;
  blockHeight: number;
}

const BiometricNFTMinter: React.FC = () => {
  const [wallet, setWallet] = useState<WalletConnection | null>(null);
  const [accountId, setAccountId] = useState<string>('');
  const [isConnecting, setIsConnecting] = useState(false);
  const [biometricData, setBiometricData] = useState<BiometricNFTData | null>(null);
  const [isMinting, setIsMinting] = useState(false);
  const [mintedNFTs, setMintedNFTs] = useState<MintedNFT[]>([]);
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState<string>('');

  // Connect to NEAR wallet
  const connectWallet = async () => {
    try {
      setIsConnecting(true);
      setError('');
      
      const keyStore = new InMemoryKeyStore();
      const near = await connect({
        networkId: 'testnet',
        keyStore,
        nodeUrl: 'https://rpc.testnet.near.org',
        walletUrl: 'https://wallet.testnet.near.org',
        helperUrl: 'https://helper.testnet.near.org',
      });

      const walletConnection = new WalletConnection(near, 'biometric-nft-minter');
      
      if (!walletConnection.isSignedIn()) {
        await walletConnection.requestSignIn({
          contractId: 'nft.examples.testnet',
          methodNames: ['nft_mint', 'nft_metadata', 'nft_token'],
        });
        return;
      }

      setWallet(walletConnection);
      setAccountId(walletConnection.getAccountId());
      
      console.log('✅ NEAR wallet connected:', walletConnection.getAccountId());
      
    } catch (error) {
      console.error('❌ Wallet connection failed:', error);
      setError(`Wallet connection failed: ${error}`);
    } finally {
      setIsConnecting(false);
    }
  };

  // Handle biometric data from the real biometric engine
  const handleBiometricData = useCallback((data: any) => {
    if (!data) return;
    
    const nftData: BiometricNFTData = {
      eegData: data.eegData,
      attention: data.attention,
      meditation: data.meditation,
      quality: data.quality,
      valence: data.emotionalState?.valence || 0,
      arousal: data.emotionalState?.arousal || 0,
      dominance: data.emotionalState?.dominance || 0,
      timestamp: data.timestamp,
      deviceId: data.deviceId
    };
    
    setBiometricData(nftData);
    console.log('📊 Biometric data received for NFT minting:', nftData);
  }, []);

  // Mint NFT with biometric data on NEAR
  const mintBiometricNFT = async () => {
    if (!wallet || !biometricData) {
      setError('Please connect wallet and capture biometric data first');
      return;
    }

    try {
      setIsMinting(true);
      setError('');
      setSuccess('');

      // Create metadata with biometric data
      const metadata = {
        title: `Biometric Creation #${Date.now()}`,
        description: `NFT minted with real biometric data - Attention: ${biometricData.attention.toFixed(1)}, Meditation: ${biometricData.meditation.toFixed(1)}, Quality: ${biometricData.quality.toFixed(2)}`,
        media: generateBiometricVisualization(biometricData),
        extra: JSON.stringify({
          biometric: {
            attention: biometricData.attention,
            meditation: biometricData.meditation,
            quality: biometricData.quality,
            valence: biometricData.valence,
            arousal: biometricData.arousal,
            dominance: biometricData.dominance,
            timestamp: biometricData.timestamp,
            deviceId: biometricData.deviceId
          },
          emotional_state: {
            valence: biometricData.valence,
            arousal: biometricData.arousal,
            dominance: biometricData.dominance
          }
        })
      };

      // Call the NEAR contract to mint NFT
      // For now, we'll use a simple NFT contract on testnet that exists
      // In production, this would be our biometric NFT contract
      const result = await wallet.account().functionCall({
        contractId: 'nft.examples.testnet', // Using existing testnet contract
        methodName: 'nft_mint',
        args: {
          token_id: `biometric-${Date.now()}`,
          receiver_id: accountId,
          metadata: metadata
        },
        gas: '300000000000000',
        attachedDeposit: '100000000000000000000000' // 0.1 NEAR
      });

      const mintedNFT: MintedNFT = {
        tokenId: result.transaction.hash,
        owner: accountId,
        metadata: biometricData,
        transactionHash: result.transaction.hash,
        blockHeight: result.transaction_outcome.block_height
      };

      setMintedNFTs(prev => [mintedNFT, ...prev]);
      setSuccess(`✅ NFT minted successfully! Transaction: ${result.transaction.hash}`);
      
      console.log('🎨 Biometric NFT minted:', mintedNFT);

    } catch (error) {
      console.error('❌ NFT minting failed:', error);
      setError(`NFT minting failed: ${error}`);
    } finally {
      setIsMinting(false);
    }
  };

  // Generate visualization based on biometric data
  const generateBiometricVisualization = (data: BiometricNFTData): string => {
    // Create a data URL for a simple visualization
    const canvas = document.createElement('canvas');
    canvas.width = 400;
    canvas.height = 400;
    const ctx = canvas.getContext('2d');
    
    if (!ctx) return '';
    
    // Create gradient based on emotional state
    const gradient = ctx.createRadialGradient(200, 200, 0, 200, 200, 200);
    
    // Color mapping based on valence/arousal
    const hue = (data.valence + 1) * 180; // 0-360 degrees
    const saturation = (data.arousal + 1) * 50; // 0-100%
    const lightness = 50 + (data.dominance * 30); // 50-80%
    
    gradient.addColorStop(0, `hsl(${hue}, ${saturation}%, ${lightness}%)`);
    gradient.addColorStop(1, `hsl(${hue + 60}, ${saturation * 0.7}%, ${lightness - 20}%)`);
    
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 400, 400);
    
    // Add biometric data overlay
    ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
    ctx.font = '16px Arial';
    ctx.fillText(`Attention: ${data.attention.toFixed(1)}`, 20, 30);
    ctx.fillText(`Meditation: ${data.meditation.toFixed(1)}`, 20, 55);
    ctx.fillText(`Quality: ${(data.quality * 100).toFixed(1)}%`, 20, 80);
    
    return canvas.toDataURL();
  };

  // Generate biometric hash for blockchain verification
  const generateBiometricHash = (data: BiometricNFTData): string => {
    const dataString = JSON.stringify({
      attention: data.attention,
      meditation: data.meditation,
      quality: data.quality,
      valence: data.valence,
      arousal: data.arousal,
      dominance: data.dominance,
      timestamp: data.timestamp,
      deviceId: data.deviceId
    });
    
    // Simple hash function (in production, use proper cryptographic hash)
    let hash = 0;
    for (let i = 0; i < dataString.length; i++) {
      const char = dataString.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    
    return Math.abs(hash).toString(16);
  };

  return (
    <div className="min-h-screen bg-gray-900 p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Brain className="h-6 w-6" />
              Real Biometric NFT Minter
              {wallet && <Badge variant="success">Connected: {accountId}</Badge>}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {/* Wallet Connection */}
              <div className="flex gap-4">
                <Button 
                  onClick={connectWallet}
                  disabled={!!wallet || isConnecting}
                  variant={wallet ? "secondary" : "default"}
                >
                  <Network className="h-4 w-4 mr-2" />
                  {wallet ? 'Wallet Connected' : 'Connect NEAR Wallet'}
                </Button>
                
                <Button 
                  onClick={mintBiometricNFT}
                  disabled={!wallet || !biometricData || isMinting}
                  variant="default"
                >
                  <Fingerprint className="h-4 w-4 mr-2" />
                  {isMinting ? 'Minting...' : 'Mint Biometric NFT'}
                </Button>
              </div>

              {/* Status Messages */}
              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
              
              {success && (
                <Alert variant="default" className="bg-green-50 border-green-200">
                  <AlertDescription>{success}</AlertDescription>
                </Alert>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Real Biometric Integration */}
        <RealBiometricIntegration 
          onBiometricData={handleBiometricData}
          className="w-full"
        />

        {/* Minted NFTs */}
        {mintedNFTs.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Minted Biometric NFTs</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mintedNFTs.map((nft, index) => (
                  <div key={index} className="border rounded-lg p-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-medium">Token ID: {nft.tokenId}</h4>
                        <p className="text-sm text-gray-600">Block: {nft.blockHeight}</p>
                        <div className="mt-2 grid grid-cols-3 gap-4 text-sm">
                          <div>
                            <span className="font-medium">Attention:</span> {nft.metadata.attention.toFixed(1)}
                          </div>
                          <div>
                            <span className="font-medium">Meditation:</span> {nft.metadata.meditation.toFixed(1)}
                          </div>
                          <div>
                            <span className="font-medium">Quality:</span> {(nft.metadata.quality * 100).toFixed(1)}%
                          </div>
                        </div>
                      </div>
                      <Badge variant="outline">NEAR Testnet</Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default BiometricNFTMinter;