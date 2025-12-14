import { useState, useEffect } from 'react';
import { realMarketplaceService, type DeployAgentParams, type CreateListingParams } from '../services/realMarketplaceService';
import type { RealNFTListing, RealAIAgent } from '../services/realMarketplaceService';
import MyNearWalletConnectionTest from '../components/MyNearWalletConnectionTest';
import NearFaucetIntegration from '../components/NearFaucetIntegration';
import SoulboundTokenTest from '../components/SoulboundTokenTest';
import InteractiveNFTFilecoinTest from '../components/InteractiveNFTFilecoinTest';
import AIFeaturesTest from '../components/AIFeaturesTest';
import FractalRenderingTest from '../components/FractalRenderingTest';
import MarketplaceTestSummary from '../components/MarketplaceTestSummary';

export default function ComprehensiveBitteMarketplace() {
  const [activeTab, setActiveTab] = useState<'marketplace' | 'mint' | 'agents' | 'wallet'>('marketplace');
  const [isWalletConnected, setIsWalletConnected] = useState(false);
  const [accountId, setAccountId] = useState('');
  const [listings, setListings] = useState<RealNFTListing[]>([]);
  const [agents, setAgents] = useState<RealAIAgent[]>([]);
  const [loading, setLoading] = useState(true);
  const [transactionStatus, setTransactionStatus] = useState<string>('');

  // Minting form state
  const [mintForm, setMintForm] = useState({
    title: '',
    description: '',
    media: '',
    price: '1',
    emotion: { valence: 0.5, arousal: 0.5, dominance: 0.5 }
  });

  // Agent deployment form state
  const [agentForm, setAgentForm] = useState({
    name: '',
    description: '',
    capabilities: '',
    aiModel: 'GPT-4',
    pricePerUse: '0.1'
  });

  // Initialize marketplace
  useEffect(() => {
    initializeMarketplace();
  }, []);

  const initializeMarketplace = async () => {
    try {
      await realMarketplaceService.initialize();
      
      const connected = realMarketplaceService.isWalletConnected();
      setIsWalletConnected(connected);
      
      if (connected) {
        const account = realMarketplaceService.getCurrentAccountId();
        setAccountId(account);
      }

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
    try {
      const success = await realMarketplaceService.connectWallet();
      if (success) {
        const account = realMarketplaceService.getCurrentAccountId();
        setIsWalletConnected(true);
        setAccountId(account);
        setTransactionStatus(`✅ Connected: ${account}`);
      } else {
        setTransactionStatus('❌ Connection failed');
      }
    } catch (error) {
      console.error('Wallet connection failed:', error);
      setTransactionStatus('❌ Connection error');
    }
  };

  const disconnectWallet = () => {
    realMarketplaceService.disconnectWallet();
    setIsWalletConnected(false);
    setAccountId('');
    setTransactionStatus('❌ Disconnected');
  };

  const handleMintNFT = async () => {
    if (!isWalletConnected) {
      setTransactionStatus('❌ Please connect wallet first');
      return;
    }

    try {
      setTransactionStatus('🔄 Minting NFT...');
      
      const params: CreateListingParams = {
        tokenId: `biometric_${Date.now()}`,
        price: mintForm.price,
        metadata: {
          title: mintForm.title,
          description: mintForm.description,
          media: mintForm.media || 'https://trae-api-sg.mchost.guru/api/ide/v1/text_to_image?prompt=biometric%20nft&image_size=square_hd',
          extra: JSON.stringify({
            emotion_vector: mintForm.emotion,
            biometric_verification: true,
            ai_generated: true
          })
        },
        emotionVector: mintForm.emotion
      };

      const result = await realMarketplaceService.createListing(params);
      
      if (result.success) {
        setTransactionStatus(`✅ NFT minted successfully! Transaction: ${result.transactionHash?.slice(0, 8)}...`);
        await loadMarketplaceData(); // Refresh listings
        // Reset form
        setMintForm({
          title: '',
          description: '',
          media: '',
          price: '1',
          emotion: { valence: 0.5, arousal: 0.5, dominance: 0.5 }
        });
      } else {
        setTransactionStatus(`❌ Minting failed: ${result.error}`);
      }
    } catch (error) {
      console.error('Minting error:', error);
      setTransactionStatus('❌ Minting error');
    }
  };

  const handleDeployAgent = async () => {
    if (!isWalletConnected) {
      setTransactionStatus('❌ Please connect wallet first');
      return;
    }

    try {
      setTransactionStatus('🔄 Deploying AI agent...');
      
      const params: DeployAgentParams = {
        name: agentForm.name,
        description: agentForm.description,
        capabilities: agentForm.capabilities.split(',').map(c => c.trim()),
        aiModel: agentForm.aiModel,
        pricePerUse: agentForm.pricePerUse
      };

      const result = await realMarketplaceService.deployAgent(params);
      
      if (result.success) {
        setTransactionStatus(`✅ AI agent deployed! Transaction: ${result.transactionHash?.slice(0, 8)}...`);
        await loadMarketplaceData(); // Refresh agents
        // Reset form
        setAgentForm({
          name: '',
          description: '',
          capabilities: '',
          aiModel: 'GPT-4',
          pricePerUse: '0.1'
        });
      } else {
        setTransactionStatus(`❌ Agent deployment failed: ${result.error}`);
      }
    } catch (error) {
      console.error('Agent deployment error:', error);
      setTransactionStatus('❌ Agent deployment error');
    }
  };

  const handleBuyListing = async (listingId: string, price: string) => {
    if (!isWalletConnected) {
      setTransactionStatus('❌ Please connect wallet first');
      return;
    }

    try {
      setTransactionStatus('🔄 Processing purchase...');
      
      const result = await realMarketplaceService.buyListing(listingId, price);
      
      if (result.success) {
        setTransactionStatus(`✅ Purchase successful! Transaction: ${result.transactionHash?.slice(0, 8)}...`);
        await loadMarketplaceData(); // Refresh listings
      } else {
        setTransactionStatus(`❌ Purchase failed: ${result.error}`);
      }
    } catch (error) {
      console.error('Purchase error:', error);
      setTransactionStatus('❌ Purchase error');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-white mb-4"></div>
          <h2 className="text-2xl font-bold text-white">🎯 Loading Comprehensive Bitte Marketplace...</h2>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
      {/* Header */}
      <div className="container mx-auto px-4 py-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-4xl font-bold text-white mb-2">🎯 Comprehensive Bitte AI Marketplace</h1>
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

        {/* Navigation Tabs */}
        <div className="flex gap-2 mb-6">
          {[
            { id: 'marketplace', label: '🏪 Marketplace', icon: '🏪' },
            { id: 'mint', label: '🎨 Mint NFT', icon: '🎨' },
            { id: 'agents', label: '🤖 AI Agents', icon: '🤖' },
            { id: 'wallet', label: '👛 Wallet', icon: '👛' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-6 py-3 rounded-lg font-semibold transition-colors ${
                activeTab === tab.id
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Transaction Status */}
        {transactionStatus && (
          <div className="mb-6 p-4 bg-yellow-900 bg-opacity-50 rounded-lg">
            <p className="text-yellow-100">{transactionStatus}</p>
          </div>
        )}

        {/* Tab Content */}
        <div className="bg-gray-800 bg-opacity-50 rounded-lg p-6">
          {/* Marketplace Tab */}
          {activeTab === 'marketplace' && (
            <div>
              <h2 className="text-2xl font-bold text-white mb-6">🏪 NFT Marketplace</h2>
              
              {/* Soulbound Token Test Section */}
              <div className="mb-8">
                <SoulboundTokenTest />
              </div>
              
              {/* Interactive NFT Filecoin Test Section */}
              <div className="mb-8">
                <InteractiveNFTFilecoinTest />
              </div>
              
              {/* AI Features Test Section */}
              <div className="mb-8">
                <AIFeaturesTest />
              </div>
              
              {/* Fractal Rendering Test Section */}
              <div className="mb-8">
                <FractalRenderingTest />
              </div>
              
              {/* Test Summary Section */}
              <div className="mb-8">
                <MarketplaceTestSummary />
              </div>
              
              {/* Regular NFT Listings */}
              <h3 className="text-xl font-bold text-white mb-4">Regular NFT Listings</h3>
              
              {listings.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-gray-400 text-lg">No listings available</p>
                  <p className="text-gray-500 mt-2">Create your first NFT in the Mint tab!</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {listings.map(listing => (
                    <div key={listing.listing_id} className="bg-gray-700 rounded-lg p-4">
                      <img
                        src={listing.metadata?.media}
                        alt={listing.metadata?.title}
                        className="w-full h-48 object-cover rounded-lg mb-4"
                      />
                      <h3 className="text-xl font-semibold text-white mb-2">
                        {listing.metadata?.title}
                      </h3>
                      <p className="text-gray-300 mb-4">{listing.metadata?.description}</p>
                      
                      {listing.emotion_vector && (
                        <div className="mb-4">
                          <p className="text-sm text-gray-400 mb-2">Emotion Vector:</p>
                          <div className="grid grid-cols-3 gap-2 text-xs">
                            <div className="bg-blue-600 p-2 rounded">
                              <div>Valence</div>
                              <div className="font-bold">{listing.emotion_vector.valence.toFixed(2)}</div>
                            </div>
                            <div className="bg-green-600 p-2 rounded">
                              <div>Arousal</div>
                              <div className="font-bold">{listing.emotion_vector.arousal.toFixed(2)}</div>
                            </div>
                            <div className="bg-purple-600 p-2 rounded">
                              <div>Dominance</div>
                              <div className="font-bold">{listing.emotion_vector.dominance.toFixed(2)}</div>
                            </div>
                          </div>
                        </div>
                      )}
                      
                      <div className="flex justify-between items-center">
                        <div className="text-white">
                          <span className="text-2xl font-bold">{listing.price}</span>
                          <span className="text-gray-400 ml-1">{listing.currency}</span>
                        </div>
                        <button
                          onClick={() => handleBuyListing(listing.listing_id, listing.price)}
                          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-semibold transition-colors"
                          disabled={!isWalletConnected}
                        >
                          Buy Now
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Mint Tab */}
          {activeTab === 'mint' && (
            <div>
              <h2 className="text-2xl font-bold text-white mb-6">🎨 Mint Biometric NFT</h2>
              
              <div className="max-w-2xl mx-auto space-y-6">
                <div>
                  <label className="block text-white font-semibold mb-2">Title</label>
                  <input
                    type="text"
                    value={mintForm.title}
                    onChange={(e) => setMintForm({...mintForm, title: e.target.value})}
                    className="w-full p-3 rounded-lg bg-gray-700 text-white border border-gray-600 focus:border-blue-500 focus:outline-none"
                    placeholder="Enter NFT title"
                  />
                </div>
                
                <div>
                  <label className="block text-white font-semibold mb-2">Description</label>
                  <textarea
                    value={mintForm.description}
                    onChange={(e) => setMintForm({...mintForm, description: e.target.value})}
                    className="w-full p-3 rounded-lg bg-gray-700 text-white border border-gray-600 focus:border-blue-500 focus:outline-none"
                    rows={3}
                    placeholder="Describe your NFT"
                  />
                </div>
                
                <div>
                  <label className="block text-white font-semibold mb-2">Media URL (optional)</label>
                  <input
                    type="text"
                    value={mintForm.media}
                    onChange={(e) => setMintForm({...mintForm, media: e.target.value})}
                    className="w-full p-3 rounded-lg bg-gray-700 text-white border border-gray-600 focus:border-blue-500 focus:outline-none"
                    placeholder="https://example.com/image.jpg"
                  />
                </div>
                
                <div>
                  <label className="block text-white font-semibold mb-2">Price (NEAR)</label>
                  <input
                    type="number"
                    value={mintForm.price}
                    onChange={(e) => setMintForm({...mintForm, price: e.target.value})}
                    className="w-full p-3 rounded-lg bg-gray-700 text-white border border-gray-600 focus:border-blue-500 focus:outline-none"
                    min="0.1"
                    step="0.1"
                  />
                </div>
                
                <div>
                  <label className="block text-white font-semibold mb-4">Emotion Vector</label>
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <label className="block text-gray-300 text-sm mb-2">Valence (Pleasure)</label>
                      <input
                        type="range"
                        min="0"
                        max="1"
                        step="0.1"
                        value={mintForm.emotion.valence}
                        onChange={(e) => setMintForm({...mintForm, emotion: {...mintForm.emotion, valence: parseFloat(e.target.value)}})}
                        className="w-full"
                      />
                      <div className="text-center text-sm text-gray-400 mt-1">
                        {mintForm.emotion.valence.toFixed(1)}
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-gray-300 text-sm mb-2">Arousal (Energy)</label>
                      <input
                        type="range"
                        min="0"
                        max="1"
                        step="0.1"
                        value={mintForm.emotion.arousal}
                        onChange={(e) => setMintForm({...mintForm, emotion: {...mintForm.emotion, arousal: parseFloat(e.target.value)}})}
                        className="w-full"
                      />
                      <div className="text-center text-sm text-gray-400 mt-1">
                        {mintForm.emotion.arousal.toFixed(1)}
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-gray-300 text-sm mb-2">Dominance (Control)</label>
                      <input
                        type="range"
                        min="0"
                        max="1"
                        step="0.1"
                        value={mintForm.emotion.dominance}
                        onChange={(e) => setMintForm({...mintForm, emotion: {...mintForm.emotion, dominance: parseFloat(e.target.value)}})}
                        className="w-full"
                      />
                      <div className="text-center text-sm text-gray-400 mt-1">
                        {mintForm.emotion.dominance.toFixed(1)}
                      </div>
                    </div>
                  </div>
                </div>
                
                <button
                  onClick={handleMintNFT}
                  className="w-full bg-purple-600 hover:bg-purple-700 text-white py-3 rounded-lg font-semibold transition-colors"
                  disabled={!isWalletConnected || !mintForm.title || !mintForm.description}
                >
                  🎨 Mint NFT
                </button>
              </div>
            </div>
          )}

          {/* Agents Tab */}
          {activeTab === 'agents' && (
            <div>
              <h2 className="text-2xl font-bold text-white mb-6">🤖 AI Agents</h2>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Deploy Agent Form */}
                <div className="bg-gray-700 bg-opacity-50 rounded-lg p-6">
                  <h3 className="text-xl font-semibold text-white mb-4">Deploy New Agent</h3>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-white font-semibold mb-2">Name</label>
                      <input
                        type="text"
                        value={agentForm.name}
                        onChange={(e) => setAgentForm({...agentForm, name: e.target.value})}
                        className="w-full p-3 rounded-lg bg-gray-700 text-white border border-gray-600 focus:border-blue-500 focus:outline-none"
                        placeholder="Agent name"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-white font-semibold mb-2">Description</label>
                      <textarea
                        value={agentForm.description}
                        onChange={(e) => setAgentForm({...agentForm, description: e.target.value})}
                        className="w-full p-3 rounded-lg bg-gray-700 text-white border border-gray-600 focus:border-blue-500 focus:outline-none"
                        rows={3}
                        placeholder="Describe your agent's capabilities"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-white font-semibold mb-2">Capabilities (comma-separated)</label>
                      <input
                        type="text"
                        value={agentForm.capabilities}
                        onChange={(e) => setAgentForm({...agentForm, capabilities: e.target.value})}
                        className="w-full p-3 rounded-lg bg-gray-700 text-white border border-gray-600 focus:border-blue-500 focus:outline-none"
                        placeholder="fractal_generation, emotion_detection, art_generation"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-white font-semibold mb-2">AI Model</label>
                      <select
                        value={agentForm.aiModel}
                        onChange={(e) => setAgentForm({...agentForm, aiModel: e.target.value})}
                        className="w-full p-3 rounded-lg bg-gray-700 text-white border border-gray-600 focus:border-blue-500 focus:outline-none"
                      >
                        <option value="GPT-4">GPT-4</option>
                        <option value="GPT-4 Vision">GPT-4 Vision</option>
                        <option value="WebGPU + Neural Networks">WebGPU + Neural Networks</option>
                        <option value="Biometric NN">Biometric NN</option>
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-white font-semibold mb-2">Price per use (NEAR)</label>
                      <input
                        type="number"
                        value={agentForm.pricePerUse}
                        onChange={(e) => setAgentForm({...agentForm, pricePerUse: e.target.value})}
                        className="w-full p-3 rounded-lg bg-gray-700 text-white border border-gray-600 focus:border-blue-500 focus:outline-none"
                        min="0.01"
                        step="0.01"
                      />
                    </div>
                    
                    <button
                      onClick={handleDeployAgent}
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-semibold transition-colors"
                      disabled={!isWalletConnected || !agentForm.name || !agentForm.description}
                    >
                      🤖 Deploy Agent
                    </button>
                  </div>
                </div>
                
                {/* Available Agents */}
                <div>
                  <h3 className="text-xl font-semibold text-white mb-4">Available Agents</h3>
                  
                  {agents.length === 0 ? (
                    <div className="text-center py-8">
                      <p className="text-gray-400">No agents available</p>
                      <p className="text-gray-500 text-sm mt-1">Deploy your first agent!</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {agents.map(agent => (
                        <div key={agent.agent_id} className="bg-gray-700 bg-opacity-50 rounded-lg p-4">
                          <div className="flex justify-between items-start mb-2">
                            <h4 className="text-lg font-semibold text-white">{agent.name}</h4>
                            <div className="text-green-400 font-bold">{agent.price_per_use} Ⓝ</div>
                          </div>
                          
                          <p className="text-gray-300 text-sm mb-3">{agent.description}</p>
                          
                          <div className="flex flex-wrap gap-2 mb-3">
                            {agent.capabilities.map((capability, index) => (
                              <span key={index} className="bg-blue-600 text-white px-2 py-1 rounded text-xs">
                                {capability}
                              </span>
                            ))}
                          </div>
                          
                          <div className="flex justify-between items-center text-sm text-gray-400">
                            <div>Model: {agent.ai_model}</div>
                            <div className="flex items-center gap-4">
                              <span>⭐ {agent.rating}/5</span>
                              <span>🔄 {agent.usage_count} uses</span>
                            </div>
                          </div>
                          
                          <button
                            className="w-full mt-3 bg-green-600 hover:bg-green-700 text-white py-2 rounded font-semibold transition-colors"
                            disabled={!isWalletConnected}
                          >
                            Use Agent
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Wallet Tab */}
          {activeTab === 'wallet' && (
            <div>
              <h2 className="text-2xl font-bold text-white mb-6">👛 Wallet Info</h2>
              
              <MyNearWalletConnectionTest />
              
              <div className="mt-6 max-w-2xl mx-auto space-y-6">
                <NearFaucetIntegration />
                
                <div className="bg-gray-700 bg-opacity-50 rounded-lg p-6">
                  <h3 className="text-xl font-semibold text-white mb-4">Quick Actions</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <button
                      onClick={() => setActiveTab('mint')}
                      className="bg-purple-600 hover:bg-purple-700 text-white py-3 rounded-lg font-semibold transition-colors"
                      disabled={!isWalletConnected}
                    >
                      🎨 Test NFT Minting
                    </button>
                    
                    <button
                      onClick={() => setActiveTab('agents')}
                      className="bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-semibold transition-colors"
                      disabled={!isWalletConnected}
                    >
                      🤖 Test AI Agents
                    </button>
                    
                    <button
                      className="bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg font-semibold transition-colors"
                      disabled={!isWalletConnected}
                    >
                      🔗 Test Soulbound Tokens
                    </button>
                    
                    <button
                      className="bg-orange-600 hover:bg-orange-700 text-white py-3 rounded-lg font-semibold transition-colors"
                      disabled={!isWalletConnected}
                    >
                      📁 Test Filecoin Integration
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}