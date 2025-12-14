import React, { useState, useEffect, useCallback, useRef } from 'react';
import { MyNearWalletService } from '../services/myNearWalletService';
import { enhancedMarketplaceService, MarketplaceListing, MarketplaceAuction, EnhancedAIAgent, SearchFilters } from '../services/enhancedMarketplaceService';
import { Search, Filter, Heart, Eye, Clock, TrendingUp, Star, Zap, ShoppingCart, Gavel, MessageCircle, Bookmark } from 'lucide-react';
import { RealBiometricCapture } from '../components/RealBiometricCapture';
import WGSLWebGPUFractal from '../components/WGSLWebGPUFractal';
import FilecoinStorageIntegration from '../components/FilecoinStorageIntegration';
import MediaPipeSensors from '../components/MediaPipeSensors';
import LeapMotionSensors from '../components/LeapMotionSensors';
import InteractiveNFTFilecoinTest from '../components/InteractiveNFTFilecoinTest';
import SoulboundTokenTest from '../components/SoulboundTokenTest';

interface EnhancedBitteMarketplaceProps {
  className?: string;
}

const EnhancedBitteMarketplace: React.FC<EnhancedBitteMarketplaceProps> = ({ className }) => {
  // State management
  const [activeTab, setActiveTab] = useState<'listings' | 'auctions' | 'agents' | 'analytics' | 'studio'>('listings');
  const [listings, setListings] = useState<MarketplaceListing[]>([]);
  const [auctions, setAuctions] = useState<MarketplaceAuction[]>([]);
  const [agents, setAgents] = useState<EnhancedAIAgent[]>([]);
  const [featuredListings, setFeaturedListings] = useState<MarketplaceListing[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  // const [filters, setFilters] = useState<SearchFilters>({});
  const [showFilters, setShowFilters] = useState(false);
  const [loading, setLoading] = useState(false);
  const [walletConnected, setWalletConnected] = useState(false);
  const [accountId, setAccountId] = useState<string>('');
  const [walletService, setWalletService] = useState<MyNearWalletService | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [sortBy] = useState<string>('created_at'); // Used in API calls
  const [sortOrder] = useState<'asc' | 'desc'>('desc'); // Used in API calls
  const [emotionFilter, setEmotionFilter] = useState({
    valence: { min: 0, max: 1 },
    arousal: { min: 0, max: 1 },
    dominance: { min: 0, max: 1 }
  });
  const [priceRange, setPriceRange] = useState({ min: '0', max: '1000' });
  const [selectedAgent, setSelectedAgent] = useState<EnhancedAIAgent | null>(null);
  const [showAgentModal, setShowAgentModal] = useState(false);
  const [showBidModal, setShowBidModal] = useState(false);
  const [selectedAuction, setSelectedAuction] = useState<MarketplaceAuction | null>(null);
  const [bidAmount, setBidAmount] = useState('');
  const [likedItems, setLikedItems] = useState<Set<string>>(new Set());
  const [bookmarkedItems, setBookmarkedItems] = useState<Set<string>>(new Set());

  // Categories
  const categories = [
    { id: 'all', name: 'All Categories', icon: '🎨' },
    { id: 'AI Art', name: 'AI Art', icon: '🤖' },
    { id: 'Identity', name: 'Identity', icon: '🆔' },
    { id: 'Fractal Art', name: 'Fractal Art', icon: '🌀' },
    { id: 'Biometric', name: 'Biometric', icon: '🫀' },
    { id: 'Emotional', name: 'Emotional', icon: '💝' }
  ];

  // Connect wallet
  const connectWallet = async () => {
    try {
      const service = new MyNearWalletService({
        network: 'testnet',
        contractName: 'bio-nft-1764175259.sleeplessmonk-testnet-1764175172.testnet'
      });
      await service.initialize();
      setWalletService(service);
      if (service.isSignedIn()) {
        setAccountId(service.getAccountId());
        setWalletConnected(true);
      } else {
        await service.signIn();
      }
    } catch (error) {
      console.error('Failed to connect wallet:', error);
    }
  };

  const disconnectWallet = async () => {
    try {
      if (walletService) {
        await walletService.signOut();
        setWalletConnected(false);
        setAccountId('');
      }
    } catch (error) {
      console.error('Failed to disconnect wallet:', error);
    }
  };

  // Load marketplace data
  const loadMarketplaceData = useCallback(async () => {
    console.log('EnhancedBitteMarketplace: Loading marketplace data...');
    setLoading(true);
    try {
      // Load listings with current filters
      const listingFilters: SearchFilters = {
        category: selectedCategory === 'all' ? undefined : selectedCategory,
        min_price: priceRange.min,
        max_price: priceRange.max,
        emotion_valence_min: emotionFilter.valence.min,
        emotion_valence_max: emotionFilter.valence.max,
        emotion_arousal_min: emotionFilter.arousal.min,
        emotion_arousal_max: emotionFilter.arousal.max,
        emotion_dominance_min: emotionFilter.dominance.min,
        emotion_dominance_max: emotionFilter.dominance.max,
        search: searchQuery || undefined
      };

      const listingPagination = {
        page: 1,
        limit: 20,
        sort_by: sortBy,
        sort_order: sortOrder
      };

      const listingsData = await enhancedMarketplaceService.getListings(listingFilters, listingPagination);
      console.log('EnhancedBitteMarketplace: Loaded listings:', listingsData.listings.length);
      setListings(listingsData.listings);

      // Load auctions
      const auctionsData = await enhancedMarketplaceService.getAuctions({ status: 'active' }, { page: 1, limit: 10 });
      setAuctions(auctionsData.auctions);

      // Load agents
      const agentsData = await enhancedMarketplaceService.getAgents({ status: 'active' }, { page: 1, limit: 12 });
      setAgents(agentsData.agents);

      // Load trending and featured
      await enhancedMarketplaceService.getTrendingListings(8);
      // trendingListings not used in UI, but keeping the call for data

      const featured = await enhancedMarketplaceService.getFeaturedListings(6);
      setFeaturedListings(featured);

    } catch (error) {
      console.error('EnhancedBitteMarketplace: Error loading marketplace data:', error);
    } finally {
      setLoading(false);
    }
  }, [selectedCategory, priceRange, emotionFilter, searchQuery, sortBy, sortOrder]);

  const [isRecording, setIsRecording] = useState(false);
  const [emotionData, setEmotionData] = useState<{ valence: number; arousal: number; dominance: number; confidence: number }>({
    valence: 0.5,
    arousal: 0.5,
    dominance: 0.5,
    confidence: 1
  });
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const handleBiometricData = useCallback((data: { heartRate: number; breathingRate: number; emotion: { valence: number; arousal: number; dominance: number } }) => {
    setEmotionData({
      valence: data.emotion.valence,
      arousal: data.emotion.arousal,
      dominance: data.emotion.dominance,
      confidence: 1
    });
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      if (ctx) {
        const w = canvas.width;
        const h = canvas.height;
        ctx.fillStyle = '#0f172a';
        ctx.fillRect(0, 0, w, h);
        const r = Math.floor(128 + data.emotion.valence * 127);
        const g = Math.floor(128 + data.emotion.arousal * 127);
        const b = Math.floor(128 + data.emotion.dominance * 127);
        ctx.fillStyle = `rgb(${r},${g},${b})`;
        ctx.beginPath();
        ctx.arc(w / 2, h / 2, 120 + data.breathingRate, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#ffffff';
        ctx.font = '14px monospace';
        ctx.fillText(`HR: ${data.heartRate} BPM`, 20, 30);
        ctx.fillText(`BR: ${data.breathingRate} BPM`, 20, 50);
        ctx.fillText(`V:${data.emotion.valence.toFixed(2)} A:${data.emotion.arousal.toFixed(2)} D:${data.emotion.dominance.toFixed(2)}`, 20, 70);
      }
    }
  }, []);

  // Handle search
  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  // Handle category filter
  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
  };

  const createSampleListing = async () => {
    try {
      const listing = await enhancedMarketplaceService.createListing({
        tokenId: `sample_${Date.now()}`,
        seller: accountId || 'demo-user.testnet',
        title: 'Sample AI NFT',
        description: 'Generated via inline API seed',
        price: '1.0',
        currency: 'NEAR',
        category: 'AI Art',
        tags: [],
        emotion_vector: { valence: 0.6, arousal: 0.5, dominance: 0.5 },
        ai_model: 'Inline API',
        media_url: 'https://images.unsplash.com/photo-1509099871023-38e5cdcf83c9?w=1200&q=80',
        status: 'active',
        featured: false,
      } as any);
      setListings(prev => [listing, ...prev]);
    } catch {}
  };

  // Handle like/unlike
  const handleLike = (itemId: string, type: 'listing' | 'auction') => {
    const newLikedItems = new Set(likedItems);
    if (likedItems.has(itemId)) {
      newLikedItems.delete(itemId);
    } else {
      newLikedItems.add(itemId);
    }
    setLikedItems(newLikedItems);
  };

  // Handle bookmark
  const handleBookmark = (itemId: string, type: 'listing' | 'auction') => {
    const newBookmarkedItems = new Set(bookmarkedItems);
    if (bookmarkedItems.has(itemId)) {
      newBookmarkedItems.delete(itemId);
    } else {
      newBookmarkedItems.add(itemId);
    }
    setBookmarkedItems(newBookmarkedItems);
  };

  // Handle bid placement
  const handlePlaceBid = async (auction: MarketplaceAuction) => {
    if (!walletConnected) {
      alert('Please connect your wallet first');
      return;
    }

    if (!bidAmount || parseFloat(bidAmount) <= parseFloat(auction.current_bid)) {
      alert('Bid amount must be higher than current bid');
      return;
    }

    try {
      await enhancedMarketplaceService.placeBid(auction.id, {
        bid_amount: bidAmount,
        bidder: accountId
      });
      
      alert('Bid placed successfully!');
      setShowBidModal(false);
      setSelectedAuction(null);
      setBidAmount('');
      loadMarketplaceData(); // Refresh data
    } catch (error) {
      alert('Failed to place bid: ' + (error as Error).message);
    }
  };

  // Handle agent deployment
  const handleDeployAgent = async (agent: EnhancedAIAgent) => {
    if (!walletConnected) {
      alert('Please connect your wallet first');
      return;
    }

    try {
      const deployment = await enhancedMarketplaceService.deployAgent(agent.id, {
        user_id: accountId,
        parameters: {
          emotion_sensitivity: 0.8,
          real_time_processing: true,
          gpu_acceleration: true
        }
      });
      
      alert(`Agent deployed successfully! Endpoint: ${deployment.endpoint_url}`);
      setShowAgentModal(false);
      setSelectedAgent(null);
    } catch (error) {
      alert('Failed to deploy agent: ' + (error as Error).message);
    }
  };

  // Format time remaining for auctions
  const formatTimeRemaining = (milliseconds: number): string => {
    const seconds = Math.floor(milliseconds / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (days > 0) return `${days}d ${hours % 24}h`;
    if (hours > 0) return `${hours}h ${minutes % 60}m`;
    if (minutes > 0) return `${minutes}m ${seconds % 60}s`;
    return `${seconds}s`;
  };

  // Initialize on component mount
  useEffect(() => {
    console.log('EnhancedBitteMarketplace: Component mounted, loading data...');
    loadMarketplaceData();
  }, [loadMarketplaceData]);

  // Refresh data periodically
  useEffect(() => {
    const interval = setInterval(() => {
      loadMarketplaceData();
    }, 30000); // Refresh every 30 seconds

    return () => clearInterval(interval);
  }, [loadMarketplaceData]);

  return (
    <div className={`min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 ${className || ''}`}>
      <div className="container mx-auto px-4 py-8">
        {/* Debug info */}
        <div className="bg-yellow-900 bg-opacity-50 border border-yellow-600 rounded-lg p-4 mb-4">
          <p className="text-yellow-200 text-sm">🔄 Marketplace loading... Check console for details</p>
        </div>
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-white mb-4 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
            Bitte AI Marketplace
          </h1>
          <p className="text-xl text-gray-300 mb-8">
            Discover, Trade, and Create AI-Powered Biometric NFTs
          </p>
          
          {/* Wallet Connection */}
          <div className="flex justify-center mb-8">
            {!walletConnected ? (
              <button
                onClick={connectWallet}
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold py-3 px-8 rounded-lg transition duration-200 transform hover:scale-105 flex items-center space-x-2"
              >
                <Zap className="w-5 h-5" />
                <span>Connect MyNearWallet</span>
              </button>
            ) : (
              <div className="bg-gray-800 bg-opacity-50 rounded-lg px-6 py-3 flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                  <span className="text-green-400 font-mono text-sm">{accountId}</span>
                </div>
                <div className="text-gray-400 text-sm">
                  Connected to NEAR via MyNearWallet
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex justify-center mb-8">
          <div className="bg-gray-800 bg-opacity-50 rounded-lg p-1 flex space-x-1">
            {[
              { id: 'listings', label: 'Marketplace', icon: ShoppingCart },
              { id: 'auctions', label: 'Live Auctions', icon: Gavel },
              { id: 'agents', label: 'AI Agents', icon: Zap },
              { id: 'analytics', label: 'Analytics', icon: TrendingUp },
              { id: 'studio', label: 'Studio', icon: Zap }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-6 py-3 rounded-lg font-medium transition duration-200 flex items-center space-x-2 ${
                  activeTab === tab.id
                    ? 'bg-purple-600 text-white'
                    : 'text-gray-300 hover:text-white hover:bg-gray-700'
                }`}
              >
                <tab.icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Search and Filters */}
        <div className="bg-gray-800 bg-opacity-50 rounded-lg p-6 mb-8">
          <div className="flex flex-col lg:flex-row gap-4 mb-4">
            {/* Search Bar */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search AI NFTs, agents, emotions..."
                value={searchQuery}
                onChange={(e) => handleSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>
            
            {/* Filter Toggle */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="px-6 py-3 bg-gray-700 hover:bg-gray-600 border border-gray-600 rounded-lg text-white flex items-center space-x-2 transition duration-200"
            >
              <Filter className="w-5 h-5" />
              <span>Advanced Filters</span>
            </button>
          </div>

          {/* Category Pills */}
          <div className="flex flex-wrap gap-2 mb-4">
            {categories.map(category => (
              <button
                key={category.id}
                onClick={() => handleCategoryChange(category.id)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition duration-200 ${
                  selectedCategory === category.id
                    ? 'bg-purple-600 text-white'
                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600 hover:text-white'
                }`}
              >
                <span className="mr-2">{category.icon}</span>
                {category.name}
              </button>
            ))}
          </div>

          {/* Advanced Filters Panel */}
          {showFilters && (
            <div className="border-t border-gray-700 pt-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Price Range */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Price Range (NEAR)</label>
                  <div className="flex space-x-2">
                    <input
                      type="number"
                      placeholder="Min"
                      value={priceRange.min}
                      onChange={(e) => setPriceRange({...priceRange, min: e.target.value})}
                      className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-purple-500"
                    />
                    <input
                      type="number"
                      placeholder="Max"
                      value={priceRange.max}
                      onChange={(e) => setPriceRange({...priceRange, max: e.target.value})}
                      className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-purple-500"
                    />
                  </div>
                </div>

                {/* Emotion Filters */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Valence (Positivity)</label>
                  <div className="space-y-2">
                    <input
                      type="range"
                      min="0"
                      max="1"
                      step="0.1"
                      value={emotionFilter.valence.min}
                      onChange={(e) => setEmotionFilter({...emotionFilter, valence: {...emotionFilter.valence, min: parseFloat(e.target.value)}})}
                      className="w-full"
                    />
                    <div className="flex justify-between text-xs text-gray-400">
                      <span>Negative</span>
                      <span>Positive</span>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Arousal (Energy)</label>
                  <div className="space-y-2">
                    <input
                      type="range"
                      min="0"
                      max="1"
                      step="0.1"
                      value={emotionFilter.arousal.min}
                      onChange={(e) => setEmotionFilter({...emotionFilter, arousal: {...emotionFilter.arousal, min: parseFloat(e.target.value)}})}
                      className="w-full"
                    />
                    <div className="flex justify-between text-xs text-gray-400">
                      <span>Calm</span>
                      <span>Excited</span>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Dominance (Control)</label>
                  <div className="space-y-2">
                    <input
                      type="range"
                      min="0"
                      max="1"
                      step="0.1"
                      value={emotionFilter.dominance.min}
                      onChange={(e) => setEmotionFilter({...emotionFilter, dominance: {...emotionFilter.dominance, min: parseFloat(e.target.value)}})}
                      className="w-full"
                    />
                    <div className="flex justify-between text-xs text-gray-400">
                      <span>Submissive</span>
                      <span>Dominant</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Content based on active tab */}
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-400"></div>
          </div>
        ) : (
          <div>
            {/* LISTINGS TAB */}
            {activeTab === 'listings' && (
              <div>
                {/* Featured Section */}
                {featuredListings.length > 0 && (
                  <div className="mb-12">
                    <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
                      <Star className="w-6 h-6 mr-2 text-yellow-400" />
                      Featured AI NFTs
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {featuredListings.map(listing => (
                        <div key={listing.id} className="bg-gradient-to-br from-purple-800 to-pink-800 rounded-xl p-6 border border-purple-500">
                          <img src={listing.media_url} alt={listing.title} className="w-full h-48 object-cover rounded-lg mb-4" />
                          <h3 className="text-white font-bold text-lg mb-2">{listing.title}</h3>
                          <p className="text-gray-300 text-sm mb-4">{listing.description}</p>
                          <div className="flex justify-between items-center mb-4">
                            <span className="text-purple-300 font-bold">{listing.price} NEAR</span>
                            <div className="flex items-center space-x-2 text-gray-400 text-sm">
                              <Eye className="w-4 h-4" />
                              <span>{listing.views}</span>
                            </div>
                          </div>
                          <div className="flex space-x-2">
                            <button className="flex-1 bg-purple-600 hover:bg-purple-700 text-white py-2 px-4 rounded-lg transition duration-200">
                              Buy Now
                            </button>
                            <button
                              onClick={() => handleLike(listing.id, 'listing')}
                              className={`p-2 rounded-lg transition duration-200 ${
                                likedItems.has(listing.id) ? 'bg-pink-600 text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                              }`}
                            >
                              <Heart className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* All Listings */}
                <div>
                  <h2 className="text-2xl font-bold text-white mb-6 flex items-center justify-between">
                    <span>All AI NFTs</span>
                    <span className="text-sm font-normal text-gray-400">{listings.length} items</span>
                  </h2>
                  {listings.length === 0 ? (
                    <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
                      <div className="text-gray-300 mb-4">No listings yet</div>
                      <button onClick={createSampleListing} className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg">
                        Create sample listing
                      </button>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                      {listings.map(listing => (
                        <div key={listing.id} className="bg-gray-800 bg-opacity-50 rounded-xl p-4 hover:bg-gray-700 transition duration-200">
                          <img src={listing.media_url} alt={listing.title} className="w-full h-40 object-cover rounded-lg mb-3" />
                          <h3 className="text-white font-semibold mb-2">{listing.title}</h3>
                          <p className="text-gray-400 text-sm mb-3 line-clamp-2">{listing.description}</p>
                          
                          {/* Emotion indicators */}
                          <div className="flex justify-between text-xs text-gray-500 mb-3">
                            <span>V: {listing.emotion_vector.valence.toFixed(2)}</span>
                            <span>A: {listing.emotion_vector.arousal.toFixed(2)}</span>
                            <span>D: {listing.emotion_vector.dominance.toFixed(2)}</span>
                          </div>

                          <div className="flex justify-between items-center mb-3">
                            <span className="text-purple-300 font-bold">{listing.price} NEAR</span>
                            <div className="flex items-center space-x-3 text-gray-400 text-sm">
                              <div className="flex items-center">
                                <Eye className="w-3 h-3 mr-1" />
                                <span>{listing.views}</span>
                              </div>
                              <div className="flex items-center">
                                <Heart className="w-3 h-3 mr-1" />
                                <span>{listing.likes}</span>
                              </div>
                            </div>
                          </div>

                          <div className="flex space-x-2">
                            <button className="flex-1 bg-purple-600 hover:bg-purple-700 text-white py-2 px-3 rounded-lg text-sm transition duration-200">
                              Buy
                            </button>
                            <button
                              onClick={() => handleLike(listing.id, 'listing')}
                              className={`p-2 rounded-lg transition duration-200 ${
                                likedItems.has(listing.id) ? 'bg-pink-600 text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                              }`}
                            >
                              <Heart className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleBookmark(listing.id, 'listing')}
                              className={`p-2 rounded-lg transition duration-200 ${
                                bookmarkedItems.has(listing.id) ? 'bg-yellow-600 text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                              }`}
                            >
                              <Bookmark className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* AUCTIONS TAB */}
            {activeTab === 'auctions' && (
              <div>
                <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
                  <Gavel className="w-6 h-6 mr-2 text-orange-400" />
                  Live Auctions
                </h2>
                {auctions.length === 0 ? (
                  <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
                    <div className="text-gray-300">No auctions running</div>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {auctions.map(auction => (
                      <div key={auction.id} className="bg-gray-800 bg-opacity-50 rounded-xl p-6 border border-orange-500">
                        <div className="flex justify-between items-start mb-4">
                          <h3 className="text-white font-bold text-lg">{auction.title}</h3>
                          <div className="bg-orange-600 text-white px-2 py-1 rounded text-xs font-bold">
                            LIVE
                          </div>
                        </div>
                        
                        <img src={auction.media_url} alt={auction.title} className="w-full h-40 object-cover rounded-lg mb-4" />
                        
                        <p className="text-gray-300 text-sm mb-4">{auction.description}</p>
                        
                        <div className="space-y-2 mb-4">
                          <div className="flex justify-between">
                            <span className="text-gray-400">Current Bid:</span>
                            <span className="text-orange-400 font-bold">{auction.current_bid} NEAR</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-400">Bids:</span>
                            <span className="text-white">{auction.bid_count}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-400">Time Left:</span>
                            <span className="text-red-400 font-bold flex items-center">
                              <Clock className="w-4 h-4 mr-1" />
                              {formatTimeRemaining(auction.time_remaining || 0)}
                            </span>
                          </div>
                        </div>

                        <div className="flex space-x-2">
                          <button
                            onClick={() => {
                              setSelectedAuction(auction);
                              setShowBidModal(true);
                            }}
                            className="flex-1 bg-orange-600 hover:bg-orange-700 text-white py-2 px-4 rounded-lg transition duration-200 flex items-center justify-center space-x-2"
                          >
                            <Gavel className="w-4 h-4" />
                            <span>Place Bid</span>
                          </button>
                          <button
                            onClick={() => handleLike(auction.id, 'auction')}
                            className={`p-2 rounded-lg transition duration-200 ${
                              likedItems.has(auction.id) ? 'bg-pink-600 text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                            }`}
                          >
                            <Heart className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                  ))}
                  </div>
                )}
              </div>
            )}

            {/* AGENTS TAB */}
            {activeTab === 'agents' && (
              <div>
                <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
                  <Zap className="w-6 h-6 mr-2 text-blue-400" />
                  AI Agents
                </h2>
                {agents.length === 0 ? (
                  <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
                    <div className="text-gray-300">No agents available</div>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {agents.map(agent => (
                      <div key={agent.id} className="bg-gray-800 bg-opacity-50 rounded-xl p-6 hover:bg-gray-700 transition duration-200">
                        <div className="flex justify-between items-start mb-4">
                          <h3 className="text-white font-bold">{agent.name}</h3>
                          <div className="flex items-center space-x-1">
                            <Star className="w-4 h-4 text-yellow-400" />
                            <span className="text-yellow-400 text-sm">{agent.rating}</span>
                          </div>
                        </div>
                        
                        <p className="text-gray-300 text-sm mb-4">{agent.description}</p>
                        
                        <div className="mb-4">
                          <div className="flex flex-wrap gap-1">
                            {agent.capabilities.slice(0, 3).map(capability => (
                              <span key={capability} className="bg-blue-600 text-white text-xs px-2 py-1 rounded">
                                {capability.replace('_', ' ')}
                              </span>
                            ))}
                            {agent.capabilities.length > 3 && (
                              <span className="bg-gray-600 text-white text-xs px-2 py-1 rounded">
                                +{agent.capabilities.length - 3}
                              </span>
                            )}
                          </div>
                        </div>

                        <div className="space-y-2 mb-4">
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-400">Performance:</span>
                            <span className="text-green-400">{(agent.performance * 100).toFixed(1)}%</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-400">Usage:</span>
                            <span className="text-white">{agent.usage_count} times</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-400">Price:</span>
                            <span className="text-purple-300">{agent.price_per_use} NEAR/use</span>
                          </div>
                        </div>

                        <div className="flex space-x-2">
                          <button
                            onClick={() => {
                              setSelectedAgent(agent);
                              setShowAgentModal(true);
                            }}
                            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg transition duration-200 text-sm"
                          >
                            Deploy
                          </button>
                          <button className="p-2 bg-gray-700 hover:bg-gray-600 text-gray-300 rounded-lg transition duration-200">
                            <MessageCircle className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                  ))}
                  </div>
                )}
              </div>
            )}

            {/* ANALYTICS TAB */}
            {activeTab === 'analytics' && (
              <div>
                <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
                  <TrendingUp className="w-6 h-6 mr-2 text-green-400" />
                  Marketplace Analytics
                </h2>
                
                {/* Analytics content would go here */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                  <div className="bg-gray-800 bg-opacity-50 rounded-xl p-6">
                    <h3 className="text-gray-400 text-sm font-medium mb-2">Total Listings</h3>
                    <p className="text-3xl font-bold text-white">{listings.length}</p>
                  </div>
                  <div className="bg-gray-800 bg-opacity-50 rounded-xl p-6">
                    <h3 className="text-gray-400 text-sm font-medium mb-2">Live Auctions</h3>
                    <p className="text-3xl font-bold text-white">{auctions.length}</p>
                  </div>
                  <div className="bg-gray-800 bg-opacity-50 rounded-xl p-6">
                    <h3 className="text-gray-400 text-sm font-medium mb-2">AI Agents</h3>
                    <p className="text-3xl font-bold text-white">{agents.length}</p>
                  </div>
                  <div className="bg-gray-800 bg-opacity-50 rounded-xl p-6">
                    <h3 className="text-gray-400 text-sm font-medium mb-2">Total Volume</h3>
                    <p className="text-3xl font-bold text-white">-- NEAR</p>
                  </div>
                </div>
              </div>
            )}

            {/* STUDIO TAB */}
            {activeTab === 'studio' && (
              <div>
                <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
                  <Zap className="w-6 h-6 mr-2 text-purple-400" />
                  AI Studio • Sensors + Biometric + Audio + Filecoin
                </h2>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <MediaPipeSensors onMetrics={(m) => {
                        setEmotionData(e => ({ ...e }))
                        ;(window as any).__mp = m
                      }} />
                      <LeapMotionSensors onMetrics={(m) => {
                        setEmotionData(e => ({ ...e }))
                        ;(window as any).__leap = m
                      }} />
                    </div>
                    <div className="flex items-center justify-between">
                      <button
                        onClick={() => setIsRecording(v => !v)}
                        className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg transition-colors"
                      >
                        {isRecording ? 'Stop Recording' : 'Start Recording'}
                      </button>
                      {walletConnected ? (
                        <button
                          onClick={disconnectWallet}
                          className="bg-gray-700 hover:bg-gray-600 text-white px-3 py-2 rounded-lg"
                        >
                          Disconnect Wallet
                        </button>
                      ) : (
                        <button
                          onClick={connectWallet}
                          className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-lg"
                        >
                          Connect MyNearWallet
                        </button>
                      )}
                    </div>
                    <RealBiometricCapture onBiometricData={handleBiometricData} isRecording={isRecording} />
                    <div className="bg-gray-900 rounded-lg p-4 border border-gray-700">
                      <canvas ref={canvasRef} width={640} height={360} className="w-full rounded-lg" />
                    </div>
                    <div className="space-y-6">
                      <SoulboundTokenTest />
                      <InteractiveNFTFilecoinTest />
                    </div>
                  </div>
                  <div className="space-y-6">
                    <WGSLWebGPUFractal
                      width={800}
                      height={600}
                      hands={(window as any).__mp?.hands || 0}
                      faces={(window as any).__mp?.faces || 0}
                      gestures={(window as any).__leap?.gestures || 0}
                      emotion={emotionData}
                    />
                    <FilecoinStorageIntegration
                      canvas={canvasRef.current}
                      emotionData={emotionData}
                      biometricData={JSON.stringify(emotionData)}
                      onStorageComplete={() => {}}
                      onError={() => {}}
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Bid Modal */}
        {showBidModal && selectedAuction && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-gray-800 rounded-xl p-6 max-w-md w-full mx-4">
              <h3 className="text-xl font-bold text-white mb-4">Place Bid</h3>
              <p className="text-gray-300 mb-4">{selectedAuction.title}</p>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-300 mb-2">Bid Amount (NEAR)</label>
                <input
                  type="number"
                  value={bidAmount}
                  onChange={(e) => setBidAmount(e.target.value)}
                  placeholder={`Minimum: ${selectedAuction.current_bid} NEAR`}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
              <div className="flex space-x-3">
                <button
                  onClick={() => handlePlaceBid(selectedAuction)}
                  className="flex-1 bg-orange-600 hover:bg-orange-700 text-white py-2 px-4 rounded-lg transition duration-200"
                >
                  Place Bid
                </button>
                <button
                  onClick={() => {
                    setShowBidModal(false);
                    setSelectedAuction(null);
                    setBidAmount('');
                  }}
                  className="flex-1 bg-gray-600 hover:bg-gray-700 text-white py-2 px-4 rounded-lg transition duration-200"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Agent Modal */}
        {showAgentModal && selectedAgent && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-gray-800 rounded-xl p-6 max-w-lg w-full mx-4">
              <h3 className="text-xl font-bold text-white mb-4">Deploy AI Agent</h3>
              <div className="mb-4">
                <h4 className="text-white font-semibold mb-2">{selectedAgent.name}</h4>
                <p className="text-gray-300 text-sm mb-4">{selectedAgent.description}</p>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Performance:</span>
                    <span className="text-green-400">{(selectedAgent.performance * 100).toFixed(1)}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Rating:</span>
                    <span className="text-yellow-400">{selectedAgent.rating} ⭐</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Price:</span>
                    <span className="text-purple-300">{selectedAgent.price_per_use} NEAR/use</span>
                  </div>
                </div>
              </div>
              <div className="flex space-x-3">
                <button
                  onClick={() => handleDeployAgent(selectedAgent)}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg transition duration-200"
                >
                  Deploy Agent
                </button>
                <button
                  onClick={() => {
                    setShowAgentModal(false);
                    setSelectedAgent(null);
                  }}
                  className="flex-1 bg-gray-600 hover:bg-gray-700 text-white py-2 px-4 rounded-lg transition duration-200"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default EnhancedBitteMarketplace;
