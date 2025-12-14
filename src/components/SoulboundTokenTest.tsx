import { useState, useEffect } from 'react';
import { soulboundTokenService, type SoulboundToken, type MintSoulboundParams } from '../services/soulboundTokenService';
import { myNearWalletService } from '../services/myNearWalletService';

export default function SoulboundTokenTest() {
  const [tokens, setTokens] = useState<SoulboundToken[]>([]);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState('');
  const [mintForm, setMintForm] = useState<MintSoulboundParams>({
    title: 'Test Soulbound Token',
    description: 'This token is bound to your account and cannot be transferred',
    media: 'https://trae-api-sg.mchost.guru/api/ide/v1/text_to_image?prompt=soulbound%20token%20locked%20to%20account&image_size=square_hd',
    boundToAccount: ''
  });

  useEffect(() => {
    if (myNearWalletService.isSignedIn()) {
      const accountId = myNearWalletService.getAccountId();
      setMintForm(prev => ({ ...prev, boundToAccount: accountId }));
      loadTokens();
    }
  }, []);

  const loadTokens = async () => {
    if (!myNearWalletService.isSignedIn()) return;
    
    setLoading(true);
    try {
      const accountId = myNearWalletService.getAccountId();
      const userTokens = await soulboundTokenService.getSoulboundTokens(accountId);
      setTokens(userTokens);
      setStatus(`✅ Loaded ${userTokens.length} soulbound tokens`);
    } catch (error) {
      console.error('Failed to load tokens:', error);
      setStatus('❌ Failed to load tokens');
    } finally {
      setLoading(false);
    }
  };

  const handleMintSoulbound = async () => {
    if (!myNearWalletService.isSignedIn()) {
      setStatus('❌ Please connect wallet first');
      return;
    }

    setLoading(true);
    setStatus('🔄 Minting soulbound token...');

    try {
      const result = await soulboundTokenService.mintSoulboundToken(mintForm);
      
      if (result.success) {
        setStatus(`✅ Soulbound token minted! Transaction: ${result.transactionHash?.slice(0, 8)}...`);
        await loadTokens(); // Refresh the list
      } else {
        setStatus(`❌ Failed to mint: ${result.error}`);
      }
    } catch (error) {
      console.error('Mint error:', error);
      setStatus('❌ Mint error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleTestTransfer = async (tokenId: string) => {
    setLoading(true);
    setStatus('🔄 Testing transfer restriction...');

    try {
      // Try to transfer to a different account (this should fail)
      const differentAccount = 'test-account.testnet';
      const result = await soulboundTokenService.transferSoulboundToken(tokenId, differentAccount);
      
      if (result.success) {
        setStatus('⚠️ Token was transferred (unexpected - soulbound tokens should be non-transferable)');
      } else {
        setStatus('✅ Transfer correctly blocked - token is truly soulbound!');
      }
    } catch (error) {
      setStatus('✅ Transfer blocked - token binding is working!');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyBinding = async (tokenId: string) => {
    if (!myNearWalletService.isSignedIn()) return;
    
    setLoading(true);
    setStatus('🔄 Verifying token binding...');

    try {
      const accountId = myNearWalletService.getAccountId();
      const isBound = await soulboundTokenService.verifyTokenBinding(tokenId, accountId);
      
      if (isBound) {
        setStatus('✅ Token is correctly bound to your account!');
      } else {
        setStatus('❌ Token binding verification failed');
      }
    } catch (error) {
      setStatus('❌ Verification error occurred');
    } finally {
      setLoading(false);
    }
  };

  if (!myNearWalletService.isSignedIn()) {
    return (
      <div className="bg-gray-800 rounded-lg p-6 text-center">
        <h3 className="text-xl font-semibold text-white mb-4">🔒 Soulbound Token Test</h3>
        <p className="text-gray-400">Please connect your NEAR wallet to test soulbound tokens</p>
      </div>
    );
  }

  return (
    <div className="bg-gray-800 rounded-lg p-6">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-semibold text-white">🔗 Soulbound Token Test</h3>
        <button
          onClick={loadTokens}
          disabled={loading}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors disabled:opacity-50"
        >
          🔄 Refresh
        </button>
      </div>

      {/* Mint New Soulbound Token */}
      <div className="mb-8 p-4 bg-gray-700 rounded-lg">
        <h4 className="text-lg font-semibold text-white mb-4">Mint Test Soulbound Token</h4>
        
        <div className="space-y-4">
          <div>
            <label className="block text-white font-semibold mb-2">Title</label>
            <input
              type="text"
              value={mintForm.title}
              onChange={(e) => setMintForm(prev => ({ ...prev, title: e.target.value }))}
              className="w-full p-3 rounded-lg bg-gray-600 text-white border border-gray-500 focus:border-blue-500 focus:outline-none"
              placeholder="Enter token title"
            />
          </div>
          
          <div>
            <label className="block text-white font-semibold mb-2">Description</label>
            <textarea
              value={mintForm.description}
              onChange={(e) => setMintForm(prev => ({ ...prev, description: e.target.value }))}
              className="w-full p-3 rounded-lg bg-gray-600 text-white border border-gray-500 focus:border-blue-500 focus:outline-none"
              rows={3}
              placeholder="Enter token description"
            />
          </div>
          
          <div>
            <label className="block text-white font-semibold mb-2">Media URL</label>
            <input
              type="text"
              value={mintForm.media}
              onChange={(e) => setMintForm(prev => ({ ...prev, media: e.target.value }))}
              className="w-full p-3 rounded-lg bg-gray-600 text-white border border-gray-500 focus:border-blue-500 focus:outline-none"
              placeholder="https://example.com/image.jpg"
            />
          </div>
          
          <div>
            <label className="block text-white font-semibold mb-2">Bound to Account</label>
            <input
              type="text"
              value={mintForm.boundToAccount}
              disabled
              className="w-full p-3 rounded-lg bg-gray-600 text-white border border-gray-500 opacity-75"
            />
            <p className="text-sm text-gray-400 mt-1">This token will be permanently bound to your account</p>
          </div>
          
          <button
            onClick={handleMintSoulbound}
            disabled={loading || !mintForm.title || !mintForm.description}
            className="w-full bg-purple-600 hover:bg-purple-700 text-white py-3 rounded-lg font-semibold transition-colors disabled:opacity-50"
          >
            🔗 Mint Soulbound Token
          </button>
        </div>
      </div>

      {/* Existing Tokens */}
      <div>
        <h4 className="text-lg font-semibold text-white mb-4">Your Soulbound Tokens ({tokens.length})</h4>
        
        {tokens.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-400">No soulbound tokens found</p>
            <p className="text-gray-500 text-sm mt-2">Mint your first soulbound token above!</p>
          </div>
        ) : (
          <div className="space-y-4">
            {tokens.map((token) => (
              <div key={token.token_id} className="bg-gray-700 rounded-lg p-4">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h5 className="text-lg font-semibold text-white">{token.metadata.title}</h5>
                    <p className="text-gray-400 text-sm">ID: {token.token_id}</p>
                  </div>
                  <div className="text-green-400 font-bold">🔗 SOULBOUND</div>
                </div>
                
                <p className="text-gray-300 mb-4">{token.metadata.description}</p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div className="bg-gray-600 rounded p-3">
                    <p className="text-gray-400 text-sm">Owner</p>
                    <p className="text-white font-mono text-sm">{token.owner_id}</p>
                  </div>
                  <div className="bg-gray-600 rounded p-3">
                    <p className="text-gray-400 text-sm">Bound to Account</p>
                    <p className="text-white font-mono text-sm">{token.bound_to_account}</p>
                  </div>
                </div>
                
                <div className="flex gap-2">
                  <button
                    onClick={() => handleVerifyBinding(token.token_id)}
                    disabled={loading}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm transition-colors disabled:opacity-50"
                  >
                    ✅ Verify Binding
                  </button>
                  
                  <button
                    onClick={() => handleTestTransfer(token.token_id)}
                    disabled={loading}
                    className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm transition-colors disabled:opacity-50"
                  >
                    🚫 Test Transfer Block
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Status */}
      {status && (
        <div className="mt-6 p-4 bg-yellow-900 bg-opacity-50 rounded-lg">
          <p className="text-yellow-100">{status}</p>
        </div>
      )}
    </div>
  );
}