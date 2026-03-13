import React, { useState, useEffect } from 'react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { useWallet, useConnection, useAnchorWallet } from '@solana/wallet-adapter-react';
import { PublicKey } from '@solana/web3.js';
import { BiometricNFTClient, createAnchorProvider } from '../utils/solana-client';

const SolanaWalletTest: React.FC = () => {
  const { wallet, connected, publicKey } = useWallet();
  const { connection } = useConnection();
  const anchorWallet = useAnchorWallet();
  
  const [client, setClient] = useState<BiometricNFTClient | null>(null);
  const [collectionPda, setCollectionPda] = useState<PublicKey | null>(null);
  const [nftPda, setNftPda] = useState<PublicKey | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [logs, setLogs] = useState<string[]>([]);

  useEffect(() => {
    if (anchorWallet && connection) {
      const provider = createAnchorProvider(connection, anchorWallet);
      const newClient = new BiometricNFTClient(connection, provider);
      setClient(newClient);
    }
  }, [anchorWallet, connection]);

  const addLog = (msg: string) => setLogs(prev => [...prev, `${new Date().toLocaleTimeString()}: ${msg}`]);

  const handleInitialize = async () => {
    if (!client || !publicKey) return;
    setLoading(true);
    setError(null);
    try {
      addLog("Initializing collection...");
      const { collectionPda, signature } = await client.initializeCollection(
        "Biometric Art",
        "BIO",
        "https://example.com/collection.json",
        publicKey
      );
      setCollectionPda(collectionPda);
      addLog(`Collection initialized! PDA: ${collectionPda.toString()}`);
      addLog(`Signature: ${signature}`);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Failed to initialize collection");
      addLog(`Error: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleMint = async () => {
    if (!client || !publicKey || !collectionPda) {
        setError("Please initialize collection first");
        return;
    }
    setLoading(true);
    setError(null);
    try {
      addLog("Minting Biometric NFT...");
      
      // Mock biometric data
      const biometricHash = Array(32).fill(0).map(() => Math.floor(Math.random() * 256));
      const emotionData = {
        valence: Math.random(),
        arousal: Math.random(),
        dominance: Math.random(),
        confidence: 0.95
      };

      const { nftPda, signature } = await client.mintBiometricNFT(
        publicKey,
        collectionPda,
        biometricHash,
        emotionData,
        "https://example.com/nft.json"
      );
      
      setNftPda(nftPda);
      addLog(`NFT Minted! PDA: ${nftPda.toString()}`);
      addLog(`Signature: ${signature}`);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Failed to mint NFT");
      addLog(`Error: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-8 text-center">Solana Wallet Integration Test</h1>
        
        <div className="bg-gray-800 rounded-lg p-6 mb-6">
          <h2 className="text-2xl font-semibold mb-4">Wallet Connection Status</h2>
          
          <div className="mb-4">
            <WalletMultiButton className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded" />
          </div>
          
          <div className="space-y-2">
            <p><strong>Connected:</strong> {connected ? '✅ Yes' : '❌ No'}</p>
            <p><strong>Wallet Name:</strong> {wallet?.adapter.name || 'None'}</p>
            <p><strong>Public Key:</strong> {publicKey?.toString() || 'Not connected'}</p>
            <p><strong>Network:</strong> Devnet</p>
          </div>
        </div>
        
        {connected && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-gray-800 rounded-lg p-6">
                <h2 className="text-xl font-semibold mb-4">Actions</h2>
                
                <div className="space-y-4">
                    <button
                        onClick={handleInitialize}
                        disabled={loading}
                        className={`w-full py-3 px-4 rounded font-bold ${
                            loading ? 'bg-gray-600 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
                        }`}
                    >
                        {loading ? 'Processing...' : '1. Initialize Collection'}
                    </button>

                    <button
                        onClick={handleMint}
                        disabled={loading || !collectionPda}
                        className={`w-full py-3 px-4 rounded font-bold ${
                            loading || !collectionPda ? 'bg-gray-600 cursor-not-allowed' : 'bg-green-600 hover:bg-green-700'
                        }`}
                    >
                        {loading ? 'Processing...' : '2. Mint Biometric NFT'}
                    </button>
                </div>

                {error && (
                    <div className="mt-4 p-3 bg-red-900/50 border border-red-700 rounded text-red-200 text-sm">
                        {error}
                    </div>
                )}
            </div>

            <div className="bg-gray-800 rounded-lg p-6">
                <h2 className="text-xl font-semibold mb-4">Transaction Logs</h2>
                <div className="bg-black/50 p-4 rounded h-64 overflow-y-auto font-mono text-xs">
                    {logs.length === 0 ? (
                        <span className="text-gray-500">No logs yet...</span>
                    ) : (
                        logs.map((log, i) => (
                            <div key={i} className="mb-1 border-b border-gray-700/50 pb-1 last:border-0">
                                {log}
                            </div>
                        ))
                    )}
                </div>
                {collectionPda && (
                    <div className="mt-4 text-xs">
                        <p className="text-gray-400">Collection PDA:</p>
                        <p className="break-all font-mono text-blue-300">{collectionPda.toString()}</p>
                    </div>
                )}
                {nftPda && (
                    <div className="mt-2 text-xs">
                        <p className="text-gray-400">Latest NFT PDA:</p>
                        <p className="break-all font-mono text-green-300">{nftPda.toString()}</p>
                    </div>
                )}
            </div>
          </div>
        )}
        
        {!connected && (
          <div className="bg-yellow-900 border border-yellow-700 rounded-lg p-6">
            <h2 className="text-2xl font-semibold mb-4 text-yellow-400">🔌 Connect Your Wallet</h2>
            <p className="text-yellow-300">
              Click the "Select Wallet" button above to connect your Phantom, Solflare, or Torus wallet.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SolanaWalletTest;
