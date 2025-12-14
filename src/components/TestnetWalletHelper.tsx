import { useState, useEffect } from 'react';
import { MyNearWalletService } from '../services/myNearWalletService';

export function TestnetWalletHelper() {
  const [wallet, setWallet] = useState<MyNearWalletService | null>(null);
  const [testnetAddress, setTestnetAddress] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Initialize wallet service
    const initWallet = async () => {
      const myNearWallet = new MyNearWalletService({
        network: 'testnet',
        contractName: 'bio-nft-1764175259.sleeplessmonk-testnet-1764175172.testnet'
      });
      
      try {
        await myNearWallet.initialize();
        setWallet(myNearWallet);
      } catch (error) {
        console.error('Failed to initialize wallet:', error);
      }
    };

    initWallet();
  }, []);

  const getTestnetAddress = async () => {
    if (!wallet) return;
    
    setIsLoading(true);
    try {
      // Sign in to get the testnet account ID
      await wallet.signIn();
      
      if (wallet.isSignedIn()) {
        const accountId = wallet.getAccountId();
        setTestnetAddress(accountId);
      }
    } catch (error) {
      console.error('Failed to get testnet address:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const openTestnetFaucet = () => {
    // Open the official NEAR testnet faucet
    window.open('https://near-faucet.io/', '_blank');
  };

  const openMyNearWalletTestnet = () => {
    // Open MyNearWallet testnet
    window.open('https://testnet.mynearwallet.com/', '_blank');
  };

  return (
    <div className="bg-black/30 backdrop-blur-md rounded-2xl p-8 border border-purple-500/30 max-w-2xl mx-auto">
      <h3 className="text-2xl font-bold text-purple-300 mb-6">🎯 Testnet Wallet Helper</h3>
      
      <div className="space-y-6">
        <div className="bg-gradient-to-r from-blue-900/50 to-purple-900/50 rounded-xl p-6 border border-blue-500/30">
          <h4 className="text-xl font-bold text-blue-300 mb-3">Step 1: Get Your Testnet Address</h4>
          <p className="text-blue-200 text-sm mb-4">
            Your mainnet address (sleeplessmonk.near) is different from testnet. 
            Click below to connect and get your testnet account ID.
          </p>
          
          <button
            onClick={getTestnetAddress}
            disabled={isLoading || !wallet}
            className="w-full px-6 py-3 bg-blue-600 hover:bg-blue-500 disabled:bg-gray-600 rounded-lg text-white transition-colors mb-4"
          >
            {isLoading ? 'Connecting...' : 'Get Testnet Address'}
          </button>
          
          {testnetAddress && (
            <div className="bg-green-900/30 rounded-lg p-4 border border-green-500/30">
              <p className="text-green-300 text-sm font-medium mb-2">Your Testnet Address:</p>
              <p className="text-green-200 font-mono text-sm break-all bg-black/20 rounded px-2 py-1">
                {testnetAddress}
              </p>
            </div>
          )}
        </div>

        <div className="bg-gradient-to-r from-green-900/50 to-teal-900/50 rounded-xl p-6 border border-green-500/30">
          <h4 className="text-xl font-bold text-green-300 mb-3">Step 2: Get Test NEAR from Faucet</h4>
          <p className="text-green-200 text-sm mb-4">
            Use the official NEAR testnet faucet to get free test NEAR tokens for development.
          </p>
          
          <div className="space-y-3">
            <button
              onClick={openTestnetFaucet}
              className="w-full px-6 py-3 bg-green-600 hover:bg-green-500 rounded-lg text-white transition-colors"
            >
              🚰 Open NEAR Testnet Faucet
            </button>
            
            <button
              onClick={openMyNearWalletTestnet}
              className="w-full px-6 py-3 bg-teal-600 hover:bg-teal-500 rounded-lg text-white transition-colors"
            >
              👛 Open MyNearWallet Testnet
            </button>
          </div>
        </div>

        <div className="bg-gradient-to-r from-yellow-900/50 to-orange-900/50 rounded-xl p-6 border border-yellow-500/30">
          <h4 className="text-xl font-bold text-yellow-300 mb-3">💡 Important Notes</h4>
          <ul className="text-yellow-200 text-sm space-y-2">
            <li>• Testnet addresses often end with <code className="bg-black/30 px-1 rounded">.testnet</code></li>
            <li>• Example: <code className="bg-black/30 px-1 rounded">your-account.testnet</code></li>
            <li>• You can create a new testnet account if you don't have one</li>
            <li>• Test NEAR has no real value - it's for testing only</li>
            <li>• Each faucet request gives you 200 test NEAR</li>
          </ul>
        </div>

        <div className="bg-gradient-to-r from-purple-900/50 to-pink-900/50 rounded-xl p-6 border border-purple-500/30">
          <h4 className="text-xl font-bold text-purple-300 mb-3">🎨 Back to Creative Engine</h4>
          <p className="text-purple-200 text-sm mb-4">
            Once you have test NEAR, you can start creating and minting your emotional artworks!
          </p>
          <div className="bg-purple-800/30 rounded-lg p-3 text-center">
            <p className="text-purple-300 text-sm">
              Current Server: <code className="bg-black/30 px-2 py-1 rounded">http://localhost:5174</code>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}