import { useState, useEffect } from 'react';
import { myNearWalletService } from '../services/myNearWalletService';

export default function MyNearWalletConnectionTest() {
  const [connectionStatus, setConnectionStatus] = useState<'checking' | 'connected' | 'disconnected' | 'error'>('checking');
  const [accountId, setAccountId] = useState<string>('');
  const [error, setError] = useState<string>('');

  useEffect(() => {
    testWalletConnection();
  }, []);

  const testWalletConnection = async () => {
    try {
      console.log('🧪 Testing MyNearWallet connection...');
      
      // Initialize wallet with testnet
      const testnetConfig = {
        networkId: 'testnet',
        nodeUrl: 'https://rpc.testnet.near.org',
        helperUrl: 'https://helper.testnet.near.org',
        explorerUrl: 'https://explorer.testnet.near.org',
        indexerUrl: 'https://testnet-api.kitwallet.app',
      };

      await myNearWalletService.initialize();
      console.log('✅ Wallet service initialized');
      
      const status = myNearWalletService.getConnectionStatus();
      console.log('📊 Connection status:', status);
      
      if (status.connected) {
        setConnectionStatus('connected');
        setAccountId(status.accountId);
        console.log('✅ Already connected:', status.accountId);
      } else {
        setConnectionStatus('disconnected');
        console.log('🔌 Not connected, ready to connect');
      }
    } catch (err) {
      console.error('❌ Wallet test failed:', err);
      setConnectionStatus('error');
      setError(err instanceof Error ? err.message : 'Unknown error');
    }
  };

  const connectWallet = async () => {
    try {
      console.log('🔌 Connecting to MyNearWallet...');
      console.log('📍 Expected account: sleeplessmonk.near');
      console.log('🔗 Contract: marketplace.testnet');
      console.log('🌐 Network: testnet');
      setConnectionStatus('checking');
      
      await myNearWalletService.signIn();
      
      console.log('📤 Sign-in request completed');
      
      if (myNearWalletService.isSignedIn()) {
        const status = myNearWalletService.getConnectionStatus();
        console.log('📊 Post-connection status:', status);
        setConnectionStatus('connected');
        setAccountId(status.accountId);
        console.log('✅ Connected successfully:', status.accountId);
        
        if (status.accountId === 'sleeplessmonk.near') {
          console.log('🎯 Perfect! Connected with expected account');
        } else {
          console.log('⚠️  Connected with different account:', status.accountId);
        }
      } else {
        setConnectionStatus('disconnected');
        console.log('❌ Connection failed - user cancelled or error');
      }
    } catch (err) {
      console.error('❌ Connection error:', err);
      setConnectionStatus('error');
      setError(err instanceof Error ? err.message : 'Connection failed');
    }
  };

  const disconnectWallet = () => {
    myNearWalletService.signOut();
    setConnectionStatus('disconnected');
    setAccountId('');
    console.log('🔌 Disconnected');
  };

  return (
    <div className="p-6 bg-gray-900 text-white rounded-lg border border-gray-700">
      <h2 className="text-2xl font-bold mb-4">🧪 MyNearWallet Connection Test</h2>
      
      <div className="space-y-4">
        {/* Status Display */}
        <div className={`p-4 rounded-lg border ${
          connectionStatus === 'connected' ? 'bg-green-900 bg-opacity-50 border-green-600' :
          connectionStatus === 'error' ? 'bg-red-900 bg-opacity-50 border-red-600' :
          connectionStatus === 'checking' ? 'bg-yellow-900 bg-opacity-50 border-yellow-600' :
          'bg-gray-800 border-gray-600'
        }`}>
          <div className="flex items-center gap-3">
            <div className={`w-3 h-3 rounded-full ${
              connectionStatus === 'connected' ? 'bg-green-400' :
              connectionStatus === 'error' ? 'bg-red-400' :
              connectionStatus === 'checking' ? 'bg-yellow-400' :
              'bg-gray-400'
            }`}></div>
            <span className="font-semibold">
              {connectionStatus === 'connected' ? '✅ Connected' :
               connectionStatus === 'error' ? '❌ Error' :
               connectionStatus === 'checking' ? '🔄 Checking...' :
               '🔌 Disconnected'}
            </span>
          </div>
          
          {accountId && (
            <div className="mt-2 text-sm">
              <div>Account: <span className="font-mono text-green-400">{accountId}</span></div>
              <div className="mt-1">Expected: <span className="font-mono text-yellow-400">sleeplessmonk.near</span></div>
            </div>
          )}
          
          {error && (
            <div className="mt-2 text-sm text-red-300">
              Error: {error}
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3">
          {connectionStatus === 'disconnected' ? (
            <button
              onClick={connectWallet}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
            >
              🔗 Connect MyNearWallet
            </button>
          ) : connectionStatus === 'connected' ? (
            <button
              onClick={disconnectWallet}
              className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
            >
              🔌 Disconnect
            </button>
          ) : null}
        </div>

        {/* Test Information */}
        <div className="mt-6 p-4 bg-gray-800 rounded-lg">
          <h3 className="font-semibold mb-2">📋 Test Information</h3>
          <div className="text-sm text-gray-300 space-y-1">
            <div>Network: <span className="font-mono">testnet</span></div>
            <div>Wallet URL: <span className="font-mono">https://testnet.mynearwallet.com</span></div>
            <div>Contract: <span className="font-mono">marketplace.testnet</span></div>
            <div className="mt-2 text-yellow-400">
              💡 Please connect with your testnet account: <span className="font-mono">sleeplessmonk.near</span>
            </div>
          </div>
        </div>

        {/* Features to Test */}
        <div className="mt-4 p-4 bg-blue-900 bg-opacity-30 rounded-lg">
          <h3 className="font-semibold text-blue-200 mb-2">🎯 Features Ready to Test</h3>
          <ul className="text-sm text-blue-100 space-y-1">
            <li>✅ MyNearWallet connection</li>
            <li>🔄 Soulbound token binding to ID</li>
            <li>🔄 Interactive NFT deployment with Filecoin content</li>
            <li>🔄 WebGPU fractal rendering</li>
            <li>🔄 AI biometric analysis</li>
            <li>🔄 Real marketplace buy/sell transactions</li>
          </ul>
        </div>
      </div>
    </div>
  );
}