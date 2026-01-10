import { useState, useEffect } from 'react';
import { myNearWalletService } from '../services/myNearWalletService';

export default function WorkingWalletConnection() {
  const [accountId, setAccountId] = useState('');
  const [isConnected, setIsConnected] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    // Check if already connected
    checkConnection();
  }, []);

  const checkConnection = async () => {
    try {
      const connected = myNearWalletService.isSignedIn();
      setIsConnected(connected);
      
      if (connected) {
        const account = myNearWalletService.getAccountId();
        setAccountId(account);
      }
    } catch (err) {
      console.error('Connection check failed:', err);
      setError('Failed to check wallet connection');
    }
  };

  const connectWallet = async () => {
    setLoading(true);
    setError('');
    
    try {
      console.log('Starting wallet connection...');
      
      // Initialize wallet first
      await myNearWalletService.initialize();
      
      console.log('Wallet initialized, requesting sign in...');
      
      // Request sign in with proper contract
      await myNearWalletService.signIn();
      
      console.log('Sign in completed');
      
      if (myNearWalletService.isSignedIn()) {
        const account = myNearWalletService.getAccountId();
        console.log('Connected account:', account);
        setIsConnected(true);
        setAccountId(account);
        setError('');
      } else {
        setError('Wallet connection was cancelled or failed');
      }
    } catch (err) {
      console.error('Wallet connection error:', err);
      setError(err instanceof Error ? err.message : 'Wallet connection failed');
    } finally {
      setLoading(false);
    }
  };

  const disconnectWallet = () => {
    try {
      myNearWalletService.signOut();
      setIsConnected(false);
      setAccountId('');
      setError('');
    } catch (err) {
      console.error('Disconnect error:', err);
      setError('Failed to disconnect wallet');
    }
  };

  const getTestTokens = async () => {
    setLoading(true);
    setError('');
    
    try {
      // Open NEAR testnet faucet
      window.open('https://near-faucet.io/', '_blank');
      setError('Faucet opened in new tab - get test NEAR there');
    } catch (err) {
      console.error('Faucet error:', err);
      setError('Failed to open faucet');
    } finally {
      setLoading(false);
    }
  };

  const checkBalance = async () => {
    if (!isConnected) return;
    
    setLoading(true);
    setError('');
    
    try {
      // This would normally check balance
      setError('Balance check: Connect to NEAR testnet explorer');
    } catch (err) {
      console.error('Balance check error:', err);
      setError('Failed to check balance');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gray-800 rounded-lg p-6">
      <h3 className="text-xl font-semibold text-white mb-4">🔑 Working Wallet Connection</h3>
      
      {error && (
        <div className="mb-4 p-3 bg-red-900 bg-opacity-50 rounded-lg">
          <p className="text-red-100 text-sm">{error}</p>
        </div>
      )}
      
      <div className="space-y-4">
        {!isConnected ? (
          <div className="text-center">
            <p className="text-gray-400 mb-4">Connect your NEAR wallet to test all features</p>
            <button
              onClick={connectWallet}
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 text-white py-3 px-4 rounded-lg font-semibold transition-colors"
            >
              {loading ? '🔄 Connecting...' : '🔗 Connect MyNearWallet'}
            </button>
          </div>
        ) : (
          <div>
            <div className="bg-green-900 bg-opacity-50 rounded-lg p-4 mb-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-100 font-semibold">✅ Connected</p>
                  <p className="text-green-200 text-sm font-mono">{accountId}</p>
                </div>
                <button
                  onClick={disconnectWallet}
                  className="bg-red-600 hover:bg-red-700 text-white py-2 px-3 rounded text-sm transition-colors"
                >
                  Disconnect
                </button>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={getTestTokens}
                disabled={loading}
                className="bg-purple-600 hover:bg-purple-700 disabled:bg-gray-600 text-white py-2 px-3 rounded text-sm transition-colors"
              >
                🚰 Get Test NEAR
              </button>
              
              <button
                onClick={checkBalance}
                disabled={loading}
                className="bg-green-600 hover:bg-green-700 disabled:bg-gray-600 text-white py-2 px-3 rounded text-sm transition-colors"
              >
                💰 Check Balance
              </button>
            </div>
          </div>
        )}
        
        <div className="mt-6 p-3 bg-gray-700 rounded-lg">
          <p className="text-gray-300 text-sm">
            <strong>Next Steps:</strong>
            {isConnected ? (
              <>
                <br />• Get test NEAR from the faucet
                <br />• Test soulbound token minting
                <br />• Deploy interactive NFTs
                <br />• Try fractal rendering
              </>
            ) : (
              <>
                <br />• Connect your wallet first
                <br />• Use sleeplessmonk.near account
                <br />• Get test NEAR from faucet
              </>
            )}
          </p>
        </div>
      </div>
    </div>
  );
}