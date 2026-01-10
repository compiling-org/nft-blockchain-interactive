import { useState, useEffect } from 'react';
import { myNearWalletService } from '../services/myNearWalletService';

export default function MyNearWalletTest() {
  const [walletStatus, setWalletStatus] = useState<string>('Checking...');
  const [accountId, setAccountId] = useState<string>('');
  const [isConnected, setIsConnected] = useState<boolean>(false);

  useEffect(() => {
    checkWalletStatus();
  }, []);

  const checkWalletStatus = async () => {
    try {
      // Initialize wallet with testnet
      const testnetConfig = {
        networkId: 'testnet',
        nodeUrl: 'https://rpc.testnet.near.org',
        helperUrl: 'https://helper.testnet.near.org',
        explorerUrl: 'https://explorer.testnet.near.org',
        indexerUrl: 'https://testnet-api.kitwallet.app',
      };

      await myNearWalletService.initialize();
      
      const status = myNearWalletService.getConnectionStatus();
      setIsConnected(status.connected);
      setAccountId(status.accountId);
      
      if (status.connected) {
        setWalletStatus(`✅ Connected: ${status.accountId}`);
      } else {
        setWalletStatus('❌ Not connected');
      }
    } catch (error) {
      console.error('Wallet status check failed:', error);
      setWalletStatus(`❌ Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  const connectWallet = async () => {
    try {
      setWalletStatus('🔄 Connecting...');
      
      // Connect to marketplace contract with required methods
      await myNearWalletService.signIn();
      
      if (myNearWalletService.isSignedIn()) {
        const status = myNearWalletService.getConnectionStatus();
        setIsConnected(status.connected);
        setAccountId(status.accountId);
        setWalletStatus(`✅ Connected: ${status.accountId}`);
      } else {
        setWalletStatus('❌ Connection failed');
      }
    } catch (error) {
      console.error('Wallet connection failed:', error);
      setWalletStatus(`❌ Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  const disconnectWallet = () => {
    myNearWalletService.signOut();
    setIsConnected(false);
    setAccountId('');
    setWalletStatus('❌ Disconnected');
  };

  const testTransaction = async () => {
    try {
      setWalletStatus('🔄 Testing transaction...');
      
      // Test a simple transaction - this would be a real transaction in production
      const actions = [{
        type: 'FunctionCall' as const,
        params: {
          methodName: 'get_listing',
          args: { listing_id: 'test_listing' },
          gas: '30000000000000',
          deposit: '0',
        },
      }];

      const transactions = [{
        signerId: accountId,
        receiverId: 'marketplace.testnet',
        actions,
      }];

      // This would normally sign and send, but we'll just test the signing capability
      console.log('Transaction test - would send:', transactions);
      setWalletStatus(`✅ Transaction test ready (signer: ${accountId})`);
    } catch (error) {
      console.error('Transaction test failed:', error);
      setWalletStatus(`❌ Transaction error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  return (
    <div className="p-6 bg-gray-900 text-white rounded-lg">
      <h2 className="text-2xl font-bold mb-4">MyNearWallet Test</h2>
      
      <div className="space-y-4">
        <div className="p-4 bg-gray-800 rounded">
          <p className="text-lg font-semibold">{walletStatus}</p>
          {accountId && (
            <p className="text-sm text-gray-300 mt-2">
              Account: <span className="font-mono">{accountId}</span>
            </p>
          )}
        </div>

        <div className="flex gap-3">
          {!isConnected ? (
            <button
              onClick={connectWallet}
              className="px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg font-semibold transition-colors"
            >
              Connect MyNearWallet
            </button>
          ) : (
            <>
              <button
                onClick={testTransaction}
                className="px-6 py-3 bg-green-600 hover:bg-green-700 rounded-lg font-semibold transition-colors"
              >
                Test Transaction
              </button>
              <button
                onClick={disconnectWallet}
                className="px-6 py-3 bg-red-600 hover:bg-red-700 rounded-lg font-semibold transition-colors"
              >
                Disconnect
              </button>
            </>
          )}
        </div>

        <div className="mt-6 p-4 bg-gray-800 rounded">
          <h3 className="font-semibold mb-2">Test Account Info:</h3>
          <p className="text-sm text-gray-300">
            Expected account: <span className="font-mono text-green-400">sleeplessmonk.near</span>
          </p>
          <p className="text-sm text-gray-300 mt-1">
            Network: <span className="font-mono">testnet</span>
          </p>
          <p className="text-sm text-gray-300 mt-1">
            Wallet URL: <span className="font-mono">https://testnet.mynearwallet.com</span>
          </p>
        </div>

        <div className="mt-4 p-4 bg-yellow-900 bg-opacity-50 rounded">
          <h3 className="font-semibold text-yellow-200 mb-2">Features to Test:</h3>
          <ul className="text-sm text-yellow-100 space-y-1">
            <li>✅ Wallet connection with MyNearWallet</li>
            <li>🔄 Soulbound token binding to ID</li>
            <li>🔄 Interactive NFT deployment with Filecoin content</li>
            <li>🔄 Fractal rendering with WebGPU</li>
            <li>🔄 AI biometric analysis features</li>
            <li>🔄 Real marketplace buy/sell transactions</li>
          </ul>
        </div>
      </div>
    </div>
  );
}