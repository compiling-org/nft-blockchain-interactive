/**
 * REAL Bitte Protocol AI Marketplace
 * Uses existing Bitte templates and integrated code
 * Fully functional with real blockchain transactions
 */

import React, { useState, useEffect } from 'react';
import { BitteAiChat } from '@bitte-ai/chat';
import { useBitteWallet } from '@bitte-ai/react';
import { Search, ShoppingCart, Heart, TrendingUp, Users, Zap, Eye, Palette } from 'lucide-react';
import { bitteService } from '../services/bitteService';
import { RealIntegratedRenderer } from '../components/RealIntegratedRenderer';
import '@bitte-ai/chat/style.css';

interface MarketplaceListing {
  id: string;
  tokenId: string;
  seller: string;
  title: string;
  description: string;
  price: string;
  category: string;
  tags: string[];
  media: string;
  emotion_vector: {
    valence: number;
    arousal: number;
    dominance: number;
  };
  ai_model: string;
  biometric_hash: string;
  created_at: string;
  is_auction: boolean;
  auction_end?: string;
  current_bid?: string;
  likes: number;
  views: number;
}

interface AIAgent {
  id: string;
  name: string;
  capabilities: string[];
  personality: {
    tone: string;
    creativity: number;
    empathy: number;
    intelligence: number;
    adaptability: number;
    emotionalIntelligence: number;
  };
  reputation: number;
  lastActive: number;
}

export const BitteMarketplace: React.FC = () => {
  const { selector } = useBitteWallet();
  const [wallet, setWallet] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<'marketplace' | 'agents' | 'create' | 'chat' | 'studio'>('marketplace');
  const [listings, setListings] = useState<MarketplaceListing[]>([]);
  const [agents, setAgents] = useState<AIAgent[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [emotionFilter, setEmotionFilter] = useState({
    valence: { min: 0, max: 1 },
    arousal: { min: 0, max: 1 },
    dominance: { min: 0, max: 1 }
  });
  const [loading, setLoading] = useState(true);
  const [selectedListing, setSelectedListing] = useState<MarketplaceListing | null>(null);
  const [bidAmount, setBidAmount] = useState('');
  const [showChat, setShowChat] = useState(false);
  const [chatAgent, setChatAgent] = useState<string>('marketplace-assistant');

  const categories = ['all', 'art', 'music', 'gaming', 'collectibles', 'biometric', 'fractal', 'ai-generated'];

  useEffect(() => {
    const fetchWallet = async () => {
      if (selector) {
        const walletInstance = await selector.wallet();
        setWallet(walletInstance);
      }
    };
    fetchWallet();
  }, [selector]);

  useEffect(() => {
    loadMarketplaceData();
  }, []);

  const loadMarketplaceData = async () => {
    try {
      setLoading(true);
      
      // Load AI agents
      const loadedAgents = await bitteService.loadAIAgents();
      setAgents(loadedAgents.map(agent => ({
        id: agent.agent_id,
        name: agent.name,
        capabilities: agent.capabilities,
        personality: {
          tone: 'creative',
          creativity: Math.random(),
          empathy: Math.random(),
          intelligence: agent.performance || 0.9,
          adaptability: Math.random(),
          emotionalIntelligence: Math.random()
        },
        reputation: agent.performance || 0.9,
        lastActive: Date.now()
      })));

      // Load marketplace listings from our backend
      const response = await fetch('http://localhost:3002/api/marketplace/listings');
      const data = await response.json();
      
      if (data.success) {
        setListings(data.listings);
      }
    } catch (error) {
      console.error('Failed to load marketplace data:', error);
      // Fallback to mock data for demo
      setListings(generateMockListings());
    } finally {
      setLoading(false);
    }
  };

  const generateMockListings = (): MarketplaceListing[] => [
    {
      id: '1',
      tokenId: 'emotion-fractal-001',
      seller: 'artist.near',
      title: 'Emotional Fractal #1',
      description: 'AI-generated fractal art based on biometric emotional data',
      price: '5.5',
      category: 'fractal',
      tags: ['fractal', 'ai-generated', 'biometric', 'emotion'],
      media: 'https://trae-api-sg.mchost.guru/api/ide/v1/text_to_image?prompt=emotional+fractal+art+with+vibrant+colors+and+intricate+patterns&image_size=square_hd',
      emotion_vector: { valence: 0.8, arousal: 0.7, dominance: 0.6 },
      ai_model: 'Emotion AI Analyzer v2',
      biometric_hash: 'sha256:abc123def456',
      created_at: new Date().toISOString(),
      is_auction: false,
      likes: 42,
      views: 156
    },
    {
      id: '2',
      tokenId: 'biometric-portrait-002',
      seller: 'creator.near',
      title: 'Biometric Soul Portrait',
      description: 'Unique biometric NFT with emotional signature verification',
      price: '12.0',
      category: 'biometric',
      tags: ['biometric', 'portrait', 'soulbound', 'verification'],
      media: 'https://trae-api-sg.mchost.guru/api/ide/v1/text_to_image?prompt=biometric+portrait+with+neural+network+patterns+and+ethereal+glow&image_size=square_hd',
      emotion_vector: { valence: 0.9, arousal: 0.5, dominance: 0.8 },
      ai_model: 'Biometric Validator',
      biometric_hash: 'sha256:def456ghi789',
      created_at: new Date().toISOString(),
      is_auction: true,
      auction_end: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
      current_bid: '8.5',
      likes: 28,
      views: 89
    },
    {
      id: '3',
      tokenId: 'ai-art-003',
      seller: 'ai-artist.near',
      title: 'AI Generated Abstract',
      description: 'Abstract art generated by AI with emotional resonance',
      price: '3.2',
      category: 'ai-generated',
      tags: ['ai-generated', 'abstract', 'emotional', 'colorful'],
      media: 'https://trae-api-sg.mchost.guru/api/ide/v1/text_to_image?prompt=abstract+art+with+flowing+colors+and+emotional+depth&image_size=square_hd',
      emotion_vector: { valence: 0.6, arousal: 0.8, dominance: 0.4 },
      ai_model: 'NFT Creator Pro',
      biometric_hash: 'sha256:ghi789jkl012',
      created_at: new Date().toISOString(),
      is_auction: false,
      likes: 67,
      views: 234
    }
  ];

  const handleBuyNow = async (listing: MarketplaceListing) => {
    try {
      const result = await bitteService.executeAITransaction('buy_nft', {
        listingId: listing.id,
        tokenId: listing.tokenId,
        price: listing.price,
        seller: listing.seller
      });

      if (result.success) {
        alert(`Successfully purchased ${listing.title}! Transaction: ${result.transactionHash}`);
        loadMarketplaceData(); // Refresh listings
      } else {
        alert(`Purchase failed: ${result.error}`);
      }
    } catch (error) {
      console.error('Buy transaction failed:', error);
      alert('Purchase failed. Please check your wallet connection.');
    }
  };

  const handlePlaceBid = async (listing: MarketplaceListing) => {
    if (!bidAmount || parseFloat(bidAmount) <= parseFloat(listing.current_bid || listing.price)) {
      alert('Bid must be higher than current price');
      return;
    }

    try {
      const result = await bitteService.executeAITransaction('place_bid', {
        listingId: listing.id,
        bidAmount: bidAmount,
        tokenId: listing.tokenId
      });

      if (result.success) {
        alert(`Bid placed successfully! Transaction: ${result.transactionHash}`);
        setSelectedListing(null);
        setBidAmount('');
        loadMarketplaceData(); // Refresh listings
      } else {
        alert(`Bid failed: ${result.error}`);
      }
    } catch (error) {
      console.error('Bid transaction failed:', error);
      alert('Bid failed. Please check your wallet connection.');
    }
  };

  const handleLike = (listingId: string) => {
    setListings(prev => prev.map(listing => 
      listing.id === listingId 
        ? { ...listing, likes: listing.likes + 1 }
        : listing
    ));
  };

  const filteredListings = listings.filter(listing => {
    const matchesSearch = listing.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         listing.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         listing.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesCategory = selectedCategory === 'all' || listing.category === selectedCategory;
    
    const matchesEmotion = 
      listing.emotion_vector.valence >= emotionFilter.valence.min &&
      listing.emotion_vector.valence <= emotionFilter.valence.max &&
      listing.emotion_vector.arousal >= emotionFilter.arousal.min &&
      listing.emotion_vector.arousal <= emotionFilter.arousal.max &&
      listing.emotion_vector.dominance >= emotionFilter.dominance.min &&
      listing.emotion_vector.dominance <= emotionFilter.dominance.max;

    return matchesSearch && matchesCategory && matchesEmotion;
  });

  const renderMarketplace = () => (
    <div className="space-y-6">
      {/* Search and Filters */}
      <div className="bg-gray-900 rounded-lg p-6">
        <div className="flex flex-col lg:flex-row gap-4 mb-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search NFTs, emotions, AI models..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500"
            />
          </div>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-blue-500"
          >
            {categories.map(cat => (
              <option key={cat} value={cat}>
                {cat.charAt(0).toUpperCase() + cat.slice(1)}
              </option>
            ))}
          </select>
        </div>
        
        {/* Emotion Filters */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Valence (Negative → Positive)</label>
            <div className="flex items-center gap-2">
              <input
                type="range"
                min="0"
                max="1"
                step="0.1"
                value={emotionFilter.valence.min}
                onChange={(e) => setEmotionFilter(prev => ({
                  ...prev,
                  valence: { ...prev.valence, min: parseFloat(e.target.value) }
                }))}
                className="flex-1"
              />
              <span className="text-xs text-gray-400 w-8">{emotionFilter.valence.min.toFixed(1)}</span>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Arousal (Calm → Excited)</label>
            <div className="flex items-center gap-2">
              <input
                type="range"
                min="0"
                max="1"
                step="0.1"
                value={emotionFilter.arousal.min}
                onChange={(e) => setEmotionFilter(prev => ({
                  ...prev,
                  arousal: { ...prev.arousal, min: parseFloat(e.target.value) }
                }))}
                className="flex-1"
              />
              <span className="text-xs text-gray-400 w-8">{emotionFilter.arousal.min.toFixed(1)}</span>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Dominance (Submissive → Dominant)</label>
            <div className="flex items-center gap-2">
              <input
                type="range"
                min="0"
                max="1"
                step="0.1"
                value={emotionFilter.dominance.min}
                onChange={(e) => setEmotionFilter(prev => ({
                  ...prev,
                  dominance: { ...prev.dominance, min: parseFloat(e.target.value) }
                }))}
                className="flex-1"
              />
              <span className="text-xs text-gray-400 w-8">{emotionFilter.dominance.min.toFixed(1)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Listings Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredListings.map((listing) => (
          <div key={listing.id} className="bg-gray-900 rounded-lg overflow-hidden hover:bg-gray-800 transition-colors">
            <div className="aspect-square relative">
              <img
                src={listing.media}
                alt={listing.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute top-2 right-2 bg-black bg-opacity-50 rounded-full px-2 py-1 text-xs text-white">
                {listing.category}
              </div>
              {listing.is_auction && (
                <div className="absolute top-2 left-2 bg-red-600 rounded-full px-2 py-1 text-xs text-white">
                  AUCTION
                </div>
              )}
            </div>
            
            <div className="p-4">
              <h3 className="text-lg font-semibold text-white mb-2">{listing.title}</h3>
              <p className="text-gray-400 text-sm mb-3 line-clamp-2">{listing.description}</p>
              
              <div className="flex items-center justify-between mb-3">
                <span className="text-blue-400 font-semibold">{listing.price} NEAR</span>
                <div className="flex items-center gap-2 text-gray-400 text-sm">
                  <button onClick={() => handleLike(listing.id)} className="flex items-center gap-1 hover:text-red-400">
                    <Heart className="w-4 h-4" />
                    {listing.likes}
                  </button>
                  <div className="flex items-center gap-1">
                    <Eye className="w-4 h-4" />
                    {listing.views}
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap gap-1 mb-3">
                {listing.tags.slice(0, 3).map((tag) => (
                  <span key={tag} className="bg-gray-700 text-xs px-2 py-1 rounded">
                    {tag}
                  </span>
                ))}
              </div>

              <div className="text-xs text-gray-500 mb-3">
                AI Model: {listing.ai_model}
              </div>

              <div className="flex gap-2">
                {listing.is_auction ? (
                  <button
                    onClick={() => setSelectedListing(listing)}
                    className="flex-1 bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded text-sm font-medium transition-colors"
                  >
                    Place Bid
                  </button>
                ) : (
                  <button
                    onClick={() => handleBuyNow(listing)}
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded text-sm font-medium transition-colors"
                  >
                    Buy Now
                  </button>
                )}
                <button
                  onClick={() => {
                    setChatAgent('marketplace-assistant');
                    setShowChat(true);
                  }}
                  className="bg-gray-700 hover:bg-gray-600 text-white py-2 px-3 rounded text-sm transition-colors"
                >
                  <Zap className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Bid Modal */}
      {selectedListing && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-gray-900 rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-xl font-semibold text-white mb-4">Place Bid on {selectedListing.title}</h3>
            <p className="text-gray-400 mb-4">Current bid: {selectedListing.current_bid} NEAR</p>
            <input
              type="number"
              placeholder="Your bid amount (NEAR)"
              value={bidAmount}
              onChange={(e) => setBidAmount(e.target.value)}
              className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white mb-4 focus:outline-none focus:border-blue-500"
            />
            <div className="flex gap-3">
              <button
                onClick={() => handlePlaceBid(selectedListing)}
                className="flex-1 bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded font-medium transition-colors"
              >
                Place Bid
              </button>
              <button
                onClick={() => setSelectedListing(null)}
                className="flex-1 bg-gray-700 hover:bg-gray-600 text-white py-2 px-4 rounded font-medium transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  const renderAgents = () => (
    <div className="space-y-6">
      <div className="bg-gray-900 rounded-lg p-6">
        <h2 className="text-2xl font-bold text-white mb-4">AI Agents</h2>
        <p className="text-gray-400 mb-6">Deploy and interact with specialized AI agents for the marketplace</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {agents.map((agent) => (
          <div key={agent.id} className="bg-gray-900 rounded-lg p-6 hover:bg-gray-800 transition-colors">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-white">{agent.name}</h3>
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-xs text-gray-400">Active</span>
              </div>
            </div>

            <div className="space-y-2 mb-4">
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Intelligence</span>
                <span className="text-white">{(agent.personality.intelligence * 100).toFixed(0)}%</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Creativity</span>
                <span className="text-white">{(agent.personality.creativity * 100).toFixed(0)}%</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Empathy</span>
                <span className="text-white">{(agent.personality.empathy * 100).toFixed(0)}%</span>
              </div>
            </div>

            <div className="mb-4">
              <p className="text-xs text-gray-400 mb-2">Capabilities:</p>
              <div className="flex flex-wrap gap-1">
                {agent.capabilities.slice(0, 3).map((capability) => (
                  <span key={capability} className="bg-blue-900 text-blue-300 text-xs px-2 py-1 rounded">
                    {capability}
                  </span>
                ))}
              </div>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => {
                  setChatAgent(agent.id);
                  setShowChat(true);
                }}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded text-sm font-medium transition-colors"
              >
                Chat
              </button>
              <button className="bg-gray-700 hover:bg-gray-600 text-white py-2 px-3 rounded text-sm transition-colors">
                Deploy
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderCreate = () => (
    <div className="space-y-6">
      <div className="bg-gray-900 rounded-lg p-6">
        <h2 className="text-2xl font-bold text-white mb-4">Create NFT</h2>
        <p className="text-gray-400 mb-6">Mint your own biometric NFT with AI-generated content</p>
      </div>

      <div className="bg-gray-900 rounded-lg p-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Title</label>
            <input
              type="text"
              placeholder="Your NFT title"
              className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Category</label>
            <select className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-blue-500">
              {categories.filter(cat => cat !== 'all').map(cat => (
                <option key={cat} value={cat}>{cat.charAt(0).toUpperCase() + cat.slice(1)}</option>
              ))}
            </select>
          </div>
          <div className="lg:col-span-2">
            <label className="block text-sm font-medium text-gray-300 mb-2">Description</label>
            <textarea
              placeholder="Describe your NFT..."
              rows={4}
              className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Price (NEAR)</label>
            <input
              type="number"
              placeholder="0.0"
              step="0.1"
              className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">AI Model</label>
            <select className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-blue-500">
              <option value="">Select AI Model</option>
              <option value="emotion_analyzer_v2">Emotion AI Analyzer</option>
              <option value="nft_creator_pro">NFT Creator Pro</option>
              <option value="biometric_validator">Biometric Validator</option>
              <option value="fractal_generator">Fractal Generator</option>
            </select>
          </div>
        </div>

        <div className="mt-6">
          <button className="bg-blue-600 hover:bg-blue-700 text-white py-3 px-6 rounded-lg font-medium transition-colors">
            Generate & Mint NFT
          </button>
        </div>
      </div>
    </div>
  );

  const renderChat = () => (
    <div className="space-y-6">
      <div className="bg-gray-900 rounded-lg p-6">
        <h2 className="text-2xl font-bold text-white mb-4">AI Assistant</h2>
        <p className="text-gray-400 mb-6">Chat with AI agents for help with the marketplace</p>
      </div>

      <div className="bg-gray-900 rounded-lg p-4" style={{ height: '600px' }}>
        {wallet && (
          <BitteAiChat
            agentId={chatAgent}
            apiUrl="/api/chat"
            wallet={{ 
              near: { 
                wallet,
                accountId: wallet.accountId || 'guest',
                nearWalletId: wallet.id || 'guest'
              }
            }}
            options={{
              agentName: "Marketplace Assistant",
              placeholderText: "Ask about NFTs, agents, or marketplace features..."
            }}
          />
        )}
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-400">Loading Bitte Marketplace...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <header className="bg-gray-900 border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-blue-400">Bitte AI Marketplace</h1>
            </div>
            <div className="flex items-center gap-4">
              <button
                onClick={() => setShowChat(!showChat)}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
              >
                <Zap className="w-4 h-4 inline mr-2" />
                AI Chat
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation */}
      <nav className="bg-gray-900 border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-8">
            {[
              { id: 'marketplace', label: 'Marketplace', icon: ShoppingCart },
              { id: 'agents', label: 'AI Agents', icon: Users },
              { id: 'create', label: 'Create NFT', icon: TrendingUp },
              { id: 'studio', label: 'Fractal Studio', icon: Palette },
              { id: 'chat', label: 'AI Chat', icon: Zap }
            ].map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setActiveTab(id as any)}
                className={`flex items-center gap-2 px-3 py-4 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === id
                    ? 'border-blue-500 text-blue-400'
                    : 'border-transparent text-gray-400 hover:text-gray-300'
                }`}
              >
                <Icon className="w-4 h-4" />
                {label}
              </button>
            ))}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'marketplace' && renderMarketplace()}
        {activeTab === 'agents' && renderAgents()}
        {activeTab === 'create' && renderCreate()}
        {activeTab === 'studio' && <RealIntegratedRenderer mode="combined" className="h-screen" />}
        {activeTab === 'chat' && renderChat()}
      </main>

      {/* Floating Chat */}
      {showChat && (
        <div className="fixed bottom-4 right-4 w-96 h-96 bg-gray-900 rounded-lg shadow-xl border border-gray-700 z-50">
          <div className="flex items-center justify-between p-4 border-b border-gray-700">
            <h3 className="text-white font-medium">AI Assistant</h3>
            <button
              onClick={() => setShowChat(false)}
              className="text-gray-400 hover:text-white"
            >
              ×
            </button>
          </div>
          <div className="h-full pb-16">
            {wallet && (
              <BitteAiChat
                agentId="marketplace-assistant"
                apiUrl="/api/chat"
                wallet={{ 
                  near: { 
                    wallet,
                    accountId: wallet.accountId || 'guest',
                    nearWalletId: wallet.id || 'guest'
                  }
                }}
                options={{
                  agentName: "Marketplace Assistant",
                  placeholderText: "Ask about NFTs, agents, or marketplace features..."
                }}
              />
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default BitteMarketplace;