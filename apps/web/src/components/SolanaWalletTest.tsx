import React from 'react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { useWallet } from '@solana/wallet-adapter-react';

const SolanaWalletTest: React.FC = () => {
  const { wallet, connected, publicKey } = useWallet();
  // const { connection } = useConnection(); // Connection available but not used yet

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
          <div className="bg-green-900 border border-green-700 rounded-lg p-6">
            <h2 className="text-2xl font-semibold mb-4 text-green-400">✅ Wallet Connected Successfully!</h2>
            <p className="text-green-300">
              Your Solana wallet is now connected and ready for NFT minting.
            </p>
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