import { useState } from 'react';

export default function NearFaucetIntegration() {
  const [accountId, setAccountId] = useState('sleeplessmonk.near');
  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState<string>('');

  const getTestNearFromFaucet = async () => {
    setIsLoading(true);
    setStatus('🔄 Requesting test NEAR from faucet...');

    try {
      // NEAR Testnet Faucet URLs
      const faucetUrls = [
        'https://faucet.paras.id',
        'https://near-faucet.io',
        'https://testnet.near.org/faucet',
        'https://wallet.testnet.near.org/faucet'
      ];

      // Open the most reliable faucet in a new window
      const faucetUrl = 'https://faucet.paras.id';
      
      // Create a popup window for the faucet
      const popup = window.open(
        `${faucetUrl}?accountId=${accountId}`,
        'near-faucet',
        'width=600,height=700,scrollbars=yes,resizable=yes'
      );

      if (!popup) {
        setStatus('❌ Popup blocked. Please allow popups for this site.');
        // Fallback: open in same window
        window.open(`${faucetUrl}?accountId=${accountId}`, '_blank');
        setStatus('🔗 Faucet opened in new tab. Please complete the request there.');
      } else {
        setStatus('🔗 Faucet opened in popup. Please complete the request.');
      }

      // Monitor the popup
      const checkInterval = setInterval(() => {
        if (popup?.closed) {
          clearInterval(checkInterval);
          setStatus('✅ Faucet popup closed. Check your wallet balance.');
          setIsLoading(false);
        }
      }, 1000);

    } catch (error) {
      console.error('Faucet error:', error);
      setStatus(`❌ Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
      setIsLoading(false);
    }
  };

  const openTestnetWallet = () => {
    window.open('https://wallet.testnet.near.org', '_blank');
  };

  const checkAccountBalance = async () => {
    setIsLoading(true);
    setStatus('🔄 Checking account balance...');

    try {
      // Use NEAR testnet RPC to check balance
      const response = await fetch('https://rpc.testnet.near.org', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          jsonrpc: '2.0',
          id: 'dontcare',
          method: 'query',
          params: {
            request_type: 'view_account',
            finality: 'final',
            account_id: accountId,
          },
        }),
      });

      const data = await response.json();
      
      if (data.result) {
        const balance = BigInt(data.result.amount) / BigInt(10**24); // Convert yoctoNEAR to NEAR
        setStatus(`💰 Account balance: ${balance} NEAR`);
      } else {
        setStatus('❓ Account not found or no balance data');
      }
    } catch (error) {
      console.error('Balance check error:', error);
      setStatus(`❌ Error checking balance: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-6 bg-gray-900 text-white rounded-lg border border-gray-700">
      <h2 className="text-2xl font-bold mb-4">🚰 NEAR Testnet Faucet</h2>
      
      <div className="space-y-4">
        {/* Account Input */}
        <div>
          <label className="block text-white font-semibold mb-2">Testnet Account ID</label>
          <input
            type="text"
            value={accountId}
            onChange={(e) => setAccountId(e.target.value)}
            className="w-full p-3 rounded-lg bg-gray-700 text-white border border-gray-600 focus:border-blue-500 focus:outline-none"
            placeholder="your-account.testnet"
          />
        </div>

        {/* Status */}
        {status && (
          <div className={`p-4 rounded-lg ${
            status.includes('❌') ? 'bg-red-900 bg-opacity-50 border border-red-600' :
            status.includes('✅') || status.includes('💰') ? 'bg-green-900 bg-opacity-50 border border-green-600' :
            status.includes('🔗') ? 'bg-blue-900 bg-opacity-50 border border-blue-600' :
            'bg-yellow-900 bg-opacity-50 border border-yellow-600'
          }`}>
            <p className="text-sm">{status}</p>
          </div>
        )}

        {/* Action Buttons */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <button
            onClick={getTestNearFromFaucet}
            disabled={isLoading}
            className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 text-white px-4 py-3 rounded-lg font-semibold transition-colors"
          >
            {isLoading ? '🔄 Loading...' : '🚰 Get Test NEAR'}
          </button>

          <button
            onClick={checkAccountBalance}
            disabled={isLoading}
            className="bg-green-600 hover:bg-green-700 disabled:bg-gray-600 text-white px-4 py-3 rounded-lg font-semibold transition-colors"
          >
            {isLoading ? '🔄 Checking...' : '💰 Check Balance'}
          </button>

          <button
            onClick={openTestnetWallet}
            className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-3 rounded-lg font-semibold transition-colors"
          >
            👛 Open Wallet
          </button>
        </div>

        {/* Faucet Information */}
        <div className="mt-6 p-4 bg-gray-800 rounded-lg">
          <h3 className="font-semibold mb-3">📋 How to get test NEAR:</h3>
          <ol className="text-sm text-gray-300 space-y-2">
            <li>1. Click "Get Test NEAR" to open the faucet</li>
            <li>2. Complete any CAPTCHA or social tasks required</li>
            <li>3. Submit your account ID ({accountId})</li>
            <li>4. Wait for the transaction to complete (usually 1-2 minutes)</li>
            <li>5. Check your balance to confirm receipt</li>
          </ol>
        </div>

        {/* Alternative Faucets */}
        <div className="mt-4 p-4 bg-blue-900 bg-opacity-30 rounded-lg">
          <h3 className="font-semibold text-blue-200 mb-2">🔗 Alternative Faucets:</h3>
          <div className="space-y-2">
            <a
              href="https://faucet.paras.id"
              target="_blank"
              rel="noopener noreferrer"
              className="block text-blue-300 hover:text-blue-200 text-sm"
            >
              🎨 Paras Faucet (NFT focused)
            </a>
            <a
              href="https://near-faucet.io"
              target="_blank"
              rel="noopener noreferrer"
              className="block text-blue-300 hover:text-blue-200 text-sm"
            >
              💧 NEAR Faucet.io
            </a>
            <a
              href="https://wallet.testnet.near.org/faucet"
              target="_blank"
              rel="noopener noreferrer"
              className="block text-blue-300 hover:text-blue-200 text-sm"
            >
              👛 Official NEAR Wallet Faucet
            </a>
          </div>
        </div>

        {/* Test Information */}
        <div className="mt-4 p-4 bg-yellow-900 bg-opacity-30 rounded-lg">
          <h3 className="font-semibold text-yellow-200 mb-2">💡 Tips:</h3>
          <ul className="text-sm text-yellow-100 space-y-1">
            <li>• Each faucet gives 1-10 NEAR per request</li>
            <li>• You can request from multiple faucets</li>
            <li>• Test NEAR has no real value</li>
            <li>• Use test NEAR to test smart contracts and transactions</li>
            <li>• Account must end with .testnet</li>
          </ul>
        </div>
      </div>
    </div>
  );
}