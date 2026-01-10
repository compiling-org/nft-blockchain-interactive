import { useState, useEffect } from 'react';
import { realMarketplaceService, type DeployAgentParams } from '../services/realMarketplaceService';
import type { RealNFTListing, RealAIAgent } from '../services/realMarketplaceService';
import BitteAIChatIntegration from '../components/BitteAIChatIntegration';
import MyNearWalletTest from '../components/MyNearWalletTest';

export default function RealBitteMarketplace() {
  const [isWalletConnected, setIsWalletConnected] = useState(false);
  const [accountId, setAccountId] = useState('');
  const [listings, setListings] = useState<RealNFTListing[]>([]);
  const [agents, setAgents] = useState<RealAIAgent[]>([]);
  const [loading, setLoading] = useState(true);
  const [transactionStatus, setTransactionStatus] = useState<string>('');

  // Initialize marketplace
  useEffect(() => {
    initializeMarketplace();
  }, []);

  const initializeMarketplace = async () => {
    try {
      await realMarketplaceService.initialize();
      
      // Check if wallet is already connected
      const connected = realMarketplaceService.isWalletConnected();
      setIsWalletConnected(connected);
      
      if (connected) {
        const account = realMarketplaceService.getCurrentAccountId();
        setAccountId(account);
      }

      // Load marketplace data
      await loadMarketplaceData();
      
    } catch (error) {
      console.error('Failed to initialize marketplace:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadMarketplaceData = async () => {
    try {
      const [listingsData, agentsData] = await Promise.all([
        realMarketplaceService.getMarketplaceListings(),
        realMarketplaceService.getAIAgents()
      ]);
      
      setListings(listingsData);
      setAgents(agentsData);
    } catch (error) {
      console.error('Failed to load marketplace data:', error);
    }
  };

  const connectWallet = async () => {
    setTransactionStatus('Connecting wallet...');
    
    try {
      const success = await realMarketplaceService.connectWallet();
      
      if (success) {
        setIsWalletConnected(true);
        const account = realMarketplaceService.getCurrentAccountId();
        setAccountId(account);
        setTransactionStatus('✅ Wallet connected successfully!');
      } else {
        setTransactionStatus('❌ Wallet connection failed');
      }
    } catch (error) {
      console.error('Wallet connection error:', error);
      setTransactionStatus('❌ Wallet connection error');
    }
  };

  const disconnectWallet = () => {
    realMarketplaceService.disconnectWallet();
    setIsWalletConnected(false);
    setAccountId('');
    setTransactionStatus('🔌 Wallet disconnected');
  };

  const handleBuyListing = async (listing: RealNFTListing) => {
    if (!isWalletConnected) {
      alert('Please connect your wallet first');
      return;
    }

    const priceNear = (BigInt(listing.price) / BigInt('1000000000000000000000000')).toString();
    
    if (!confirm(`Buy "${listing.metadata?.title || 'NFT'}" for ${priceNear} NEAR?`)) {
      return;
    }

    setTransactionStatus('Processing purchase...');
    
    try {
      const result = await realMarketplaceService.buyListing(listing.listing_id, priceNear);
      
      if (result.success) {
        setTransactionStatus(`✅ Purchase successful! Transaction: ${result.transactionHash}`);
        // Reload marketplace data
        await loadMarketplaceData();
      } else {
        setTransactionStatus(`❌ Purchase failed: ${result.error}`);
      }
    } catch (error) {
      console.error('Purchase error:', error);
      setTransactionStatus('❌ Purchase transaction failed');
    }
  };

  const handleDeployAgent = async (agent: RealAIAgent) => {
    if (!isWalletConnected) {
      alert('Please connect your wallet first');
      return;
    }

    const priceNear = (BigInt(agent.price_per_use) / BigInt('1000000000000000000000000')).toString();
    
    if (!confirm(`Deploy "${agent.name}" agent for ${priceNear} NEAR per use?`)) {
      return;
    }

    setTransactionStatus('Deploying agent...');
    
    try {
      const params: DeployAgentParams = {
        name: agent.name,
        description: agent.description,
        capabilities: agent.capabilities,
        aiModel: agent.ai_model,
        pricePerUse: priceNear,
      };

      const result = await realMarketplaceService.deployAgent(params);
      
      if (result.success) {
        setTransactionStatus(`✅ Agent deployed successfully! Transaction: ${result.transactionHash}`);
      } else {
        setTransactionStatus(`❌ Agent deployment failed: ${result.error}`);
      }
    } catch (error) {
      console.error('Agent deployment error:', error);
      setTransactionStatus('❌ Agent deployment failed');
    }
  };

  const formatNearAmount = (yoctoNear: string): string => {
    try {
      const near = BigInt(yoctoNear) / BigInt('1000000000000000000000000');
      return near.toString();
    } catch {
      return '0';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-white mb-4"></div>
          <h2 className="text-2xl font-bold text-white">🎯 Initializing Real Bitte Marketplace...</h2>
          <p className="text-gray-300 mt-2">Connecting to NEAR blockchain...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
      {/* Header */}
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold text-white mb-2">🎯 REAL Bitte AI Marketplace</h1>
            <p className="text-gray-300">Biometric NFTs • AI Agents • Real NEAR Transactions</p>
          </div>
          
          {/* Wallet Connection */}
          <div className="flex items-center gap-4">
            {isWalletConnected ? (
              <>
                <div className="bg-green-600 text-white px-4 py-2 rounded-lg">
                  <div className="text-sm">Connected</div>
                  <div className="text-xs font-mono">{accountId}</div>
                </div>
                <button
                  onClick={disconnectWallet}
                  className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors"
                >
                  Disconnect
                </button>
              </>
            ) : (
              <button
                onClick={connectWallet}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
              >
                🔗 Connect NEAR Wallet
              </button>
            )}
          </div>
        </div>

        {/* MyNearWallet Test Section */}
        <div className="mb-8">
          <MyNearWalletTest />
        </div>

        {/* Bitte AI Chat Integration */}
        <BitteAIChatIntegration 
          isWalletConnected={isWalletConnected} 
          accountId={accountId}
        />

        {/* Transaction Status */}
        {transactionStatus && (
          <div className="bg-yellow-600 text-white px-4 py-3 rounded-lg mb-6">
            {transactionStatus}
          </div>
        )}

        {/* Marketplace Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
          <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 text-center">
            <div className="text-3xl font-bold text-white">{listings.length}</div>
            <div className="text-gray-300">Active Listings</div>
          </div>
          <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 text-center">
            <div className="text-3xl font-bold text-white">{agents.length}</div>
            <div className="text-gray-300">AI Agents</div>
          </div>
          <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 text-center">
            <div className="text-3xl font-bold text-white">17.5</div>
            <div className="text-gray-300">Total Volume (NEAR)</div>
          </div>
          <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 text-center">
            <div className="text-3xl font-bold text-white">156</div>
            <div className="text-gray-300">Active Users</div>
          </div>
        </div>

        {/* NFT Listings */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-white mb-6">🎨 Biometric NFT Listings</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {listings.map((listing) => (
              <div key={listing.listing_id} className="bg-white/10 backdrop-blur-lg rounded-xl p-6 hover:bg-white/20 transition-all">
                <div className="mb-4">
                  <img
                    src={listing.metadata?.media || 'https://via.placeholder.com/300x200/667eea/ffffff?text=AI+NFT'}
                    alt={listing.metadata?.title}
                    className="w-full h-48 object-cover rounded-lg"
                  />
                </div>
                
                <h3 className="text-xl font-bold text-white mb-2">{listing.metadata?.title}</h3>
                <p className="text-gray-300 mb-4">{listing.metadata?.description}</p>
                
                {/* Emotion Vector */}
                {listing.emotion_vector && (
                  <div className="mb-4">
                    <div className="text-sm text-gray-300 mb-2">Emotion Vector:</div>
                    <div className="flex gap-2">
                      <div className="flex-1">
                        <div className="text-xs text-gray-400">Valence</div>
                        <div className="w-full bg-gray-700 rounded-full h-2">
                          <div 
                            className="bg-green-500 h-2 rounded-full" 
                            style={{ width: `${listing.emotion_vector.valence * 100}%` }}
                          ></div>
                        </div>
                      </div>
                      <div className="flex-1">
                        <div className="text-xs text-gray-400">Arousal</div>
                        <div className="w-full bg-gray-700 rounded-full h-2">
                          <div 
                            className="bg-orange-500 h-2 rounded-full" 
                            style={{ width: `${listing.emotion_vector.arousal * 100}%` }}
                          ></div>
                        </div>
                      </div>
                      <div className="flex-1">
                        <div className="text-xs text-gray-400">Dominance</div>
                        <div className="w-full bg-gray-700 rounded-full h-2">
                          <div 
                            className="bg-blue-500 h-2 rounded-full" 
                            style={{ width: `${listing.emotion_vector.dominance * 100}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                
                <div className="flex justify-between items-center mb-4">
                  <div className="text-2xl font-bold text-yellow-400">
                    {formatNearAmount(listing.price)} NEAR
                  </div>
                  <div className="text-sm text-gray-400">
                    Seller: {listing.seller_id}
                  </div>
                </div>
                
                <button
                  onClick={() => handleBuyListing(listing)}
                  disabled={!isWalletConnected}
                  className={`w-full py-3 rounded-lg font-semibold transition-colors ${
                    isWalletConnected
                      ? 'bg-green-600 hover:bg-green-700 text-white'
                      : 'bg-gray-600 text-gray-400 cursor-not-allowed'
                  }`}
                >
                  {isWalletConnected ? '🛒 Buy Now' : '🔌 Connect Wallet to Buy'}
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* AI Agents */}
        <div>
          <h2 className="text-3xl font-bold text-white mb-6">🤖 AI Agents</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {agents.map((agent) => (
              <div key={agent.agent_id} className="bg-white/10 backdrop-blur-lg rounded-xl p-6 hover:bg-white/20 transition-all">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-xl font-bold text-white">{agent.name}</h3>
                    <p className="text-gray-300 text-sm">{agent.ai_model}</p>
                  </div>
                  <div className="text-yellow-400 font-bold">
                    ⭐ {agent.rating}
                  </div>
                </div>
                
                <p className="text-gray-300 mb-4">{agent.description}</p>
                
                <div className="mb-4">
                  <div className="text-sm text-gray-400 mb-2">Capabilities:</div>
                  <div className="flex flex-wrap gap-2">
                    {agent.capabilities.map((capability) => (
                      <span key={capability} className="bg-blue-600 text-white px-3 py-1 rounded-full text-xs">
                        {capability.replace('_', ' ')}
                      </span>
                    ))}
                  </div>
                </div>
                
                <div className="flex justify-between items-center mb-4">
                  <div>
                    <div className="text-sm text-gray-400">Performance</div>
                    <div className="text-white font-bold">{(agent.performance * 100).toFixed(1)}%</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-400">Usage</div>
                    <div className="text-white font-bold">{agent.usage_count} times</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-400">Price</div>
                    <div className="text-green-400 font-bold">{formatNearAmount(agent.price_per_use)} NEAR</div>
                  </div>
                </div>
                
                <button
                  onClick={() => handleDeployAgent(agent)}
                  disabled={!isWalletConnected}
                  className={`w-full py-3 rounded-lg font-semibold transition-colors ${
                    isWalletConnected
                      ? 'bg-purple-600 hover:bg-purple-700 text-white'
                      : 'bg-gray-600 text-gray-400 cursor-not-allowed'
                  }`}
                >
                  {isWalletConnected ? '🚀 Deploy Agent' : '🔌 Connect Wallet to Deploy'}
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}