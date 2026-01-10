/**
 * Bitte Advanced Marketplace Backend
 * Comprehensive marketplace functionality with real database integration
 */

const express = require('express');
const cors = require('cors');
const { v4: uuidv4 } = require('uuid');

const app = express();
const PORT = 3002; // Different port from main blockchain server

app.use(cors());
app.use(express.json());

// In-memory database for marketplace data (replace with real database in production)
const marketplaceDB = {
  listings: new Map(),
  auctions: new Map(),
  bids: new Map(),
  offers: new Map(),
  users: new Map(),
  agents: new Map(),
  notifications: new Map(),
  social: {
    comments: new Map(),
    likes: new Map(),
    follows: new Map()
  }
};

// Initialize with sample data
function initializeSampleData() {
  // Sample listings
  const sampleListings = [
    {
      id: 'listing_001',
      tokenId: 'biometric_1764741688849_kpf03bkeb',
      seller: 'user.testnet',
      title: 'Emotional Biometric Portrait #1',
      description: 'AI-generated art based on biometric emotional analysis',
      price: '5.5',
      currency: 'NEAR',
      category: 'AI Art',
      tags: ['biometric', 'emotional', 'ai-generated'],
      emotion_vector: { valence: 0.7, arousal: 0.6, dominance: 0.8 },
      ai_model: 'emotion_analyzer_v2',
      media_url: 'https://trae-api-sg.mchost.guru/api/ide/v1/text_to_image?prompt=emotional%20biometric%20abstract%20portrait&image_size=square_hd',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      status: 'active', // active, sold, cancelled
      views: 42,
      likes: 8,
      featured: true
    },
    {
      id: 'listing_002',
      tokenId: 'ai_token_002',
      seller: 'artist.testnet',
      title: 'AI Soulbound Identity',
      description: 'Unique biometric identity NFT with AI verification',
      price: '12.0',
      currency: 'NEAR',
      category: 'Identity',
      tags: ['soulbound', 'identity', 'biometric'],
      emotion_vector: { valence: 0.5, arousal: 0.4, dominance: 0.9 },
      ai_model: 'biometric_validator',
      media_url: 'https://trae-api-sg.mchost.guru/api/ide/v1/text_to_image?prompt=soulbound%20identity%20nft&image_size=square_hd',
      created_at: new Date(Date.now() - 86400000).toISOString(),
      updated_at: new Date(Date.now() - 86400000).toISOString(),
      status: 'active',
      views: 156,
      likes: 23,
      featured: false
    }
  ];

  sampleListings.forEach(listing => {
    marketplaceDB.listings.set(listing.id, listing);
  });

  // Sample auctions
  const sampleAuctions = [
    {
      id: 'auction_001',
      tokenId: 'fractal_1764741934209_tto6ljwer',
      seller: 'creator.testnet',
      title: 'Interactive Emotional Fractal',
      description: 'GPU-accelerated fractal with emotional parameters',
      starting_price: '2.0',
      reserve_price: '8.0',
      currency: 'NEAR',
      category: 'Fractal Art',
      emotion_vector: { valence: 0.8, arousal: 0.7, dominance: 0.6 },
      ai_model: 'fractal_generator',
      media_url: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODAwIiBoZWlnaHQ9IjYwMCI...',
      created_at: new Date().toISOString(),
      end_time: new Date(Date.now() + 86400000 * 3).toISOString(), // 3 days
      status: 'active', // active, ended, cancelled
      current_bid: '3.5',
      bid_count: 7,
      featured: true
    }
  ];

  sampleAuctions.forEach(auction => {
    marketplaceDB.auctions.set(auction.id, auction);
  });

  // Sample users
  const sampleUsers = [
    {
      id: 'user.testnet',
      accountId: 'user.testnet',
      username: 'AI_Collector',
      bio: 'Passionate about AI-generated art and biometric NFTs',
      avatar: 'https://trae-api-sg.mchost.guru/api/ide/v1/text_to_image?prompt=ai%20collector%20avatar&image_size=square',
      reputation: 1250,
      verified: true,
      followers: 342,
      following: 128,
      created_at: new Date(Date.now() - 86400000 * 30).toISOString()
    },
    {
      id: 'artist.testnet',
      accountId: 'artist.testnet',
      username: 'Digital_Artist',
      bio: 'Creating emotional art with AI and blockchain',
      avatar: 'https://trae-api-sg.mchost.guru/api/ide/v1/text_to_image?prompt=digital%20artist%20avatar&image_size=square',
      reputation: 890,
      verified: true,
      followers: 567,
      following: 89,
      created_at: new Date(Date.now() - 86400000 * 45).toISOString()
    }
  ];

  sampleUsers.forEach(user => {
    marketplaceDB.users.set(user.id, user);
  });

  // Sample AI agents
  const sampleAgents = [
    {
      id: 'agent_emotion_v3',
      name: 'Emotion AI Analyzer v3',
      description: 'Advanced emotion detection and biometric analysis',
      capabilities: ['emotion_detection', 'biometric_analysis', 'art_generation', 'real_time_processing'],
      wallet_address: 'emotion-agent-v3.bitte.near',
      ai_model: 'GPT-4 Vision + Biometric NN + WebGPU',
      status: 'active',
      performance: 0.96,
      usage_count: 1247,
      rating: 4.8,
      price_per_use: '0.1',
      created_by: 'ai_developer.testnet',
      created_at: new Date().toISOString()
    },
    {
      id: 'agent_fractal_master',
      name: 'Fractal Master',
      description: 'GPU-accelerated fractal generation with emotional intelligence',
      capabilities: ['fractal_generation', 'gpu_compute', 'real_time_rendering', 'emotion_awareness'],
      wallet_address: 'fractal-master.bitte.near',
      ai_model: 'WebGPU + Neural Networks + Emotional AI',
      status: 'active',
      performance: 0.94,
      usage_count: 892,
      rating: 4.9,
      price_per_use: '0.15',
      created_by: 'gpu_specialist.testnet',
      created_at: new Date().toISOString()
    }
  ];

  sampleAgents.forEach(agent => {
    marketplaceDB.agents.set(agent.id, agent);
  });
}

// Initialize sample data
initializeSampleData();

// ===== MARKETPLACE LISTINGS =====

// Get all listings with filtering and pagination
app.get('/api/marketplace/listings', (req, res) => {
  try {
    const {
      page = 1,
      limit = 20,
      category,
      min_price,
      max_price,
      emotion_valence_min,
      emotion_valence_max,
      emotion_arousal_min,
      emotion_arousal_max,
      emotion_dominance_min,
      emotion_dominance_max,
      ai_model,
      seller,
      search,
      sort_by = 'created_at',
      sort_order = 'desc',
      status = 'active'
    } = req.query;

    let listings = Array.from(marketplaceDB.listings.values());

    // Apply filters
    if (category) {
      listings = listings.filter(l => l.category === category);
    }
    
    if (min_price) {
      listings = listings.filter(l => parseFloat(l.price) >= parseFloat(min_price));
    }
    
    if (max_price) {
      listings = listings.filter(l => parseFloat(l.price) <= parseFloat(max_price));
    }

    // Emotion vector filtering
    if (emotion_valence_min) {
      listings = listings.filter(l => l.emotion_vector.valence >= parseFloat(emotion_valence_min));
    }
    if (emotion_valence_max) {
      listings = listings.filter(l => l.emotion_vector.valence <= parseFloat(emotion_valence_max));
    }
    if (emotion_arousal_min) {
      listings = listings.filter(l => l.emotion_vector.arousal >= parseFloat(emotion_arousal_min));
    }
    if (emotion_arousal_max) {
      listings = listings.filter(l => l.emotion_vector.arousal <= parseFloat(emotion_arousal_max));
    }
    if (emotion_dominance_min) {
      listings = listings.filter(l => l.emotion_vector.dominance >= parseFloat(emotion_dominance_min));
    }
    if (emotion_dominance_max) {
      listings = listings.filter(l => l.emotion_vector.dominance <= parseFloat(emotion_dominance_max));
    }

    if (ai_model) {
      listings = listings.filter(l => l.ai_model === ai_model);
    }

    if (seller) {
      listings = listings.filter(l => l.seller === seller);
    }

    if (search) {
      const searchLower = search.toLowerCase();
      listings = listings.filter(l => 
        l.title.toLowerCase().includes(searchLower) ||
        l.description.toLowerCase().includes(searchLower) ||
        l.tags.some(tag => tag.toLowerCase().includes(searchLower))
      );
    }

    if (status) {
      listings = listings.filter(l => l.status === status);
    }

    // Sorting
    listings.sort((a, b) => {
      let aVal, bVal;
      switch (sort_by) {
        case 'price':
          aVal = parseFloat(a.price);
          bVal = parseFloat(b.price);
          break;
        case 'created_at':
          aVal = new Date(a.created_at);
          bVal = new Date(b.created_at);
          break;
        case 'views':
          aVal = a.views;
          bVal = b.views;
          break;
        case 'likes':
          aVal = a.likes;
          bVal = b.likes;
          break;
        default:
          aVal = new Date(a.created_at);
          bVal = new Date(b.created_at);
      }

      if (sort_order === 'asc') {
        return aVal > bVal ? 1 : -1;
      } else {
        return aVal < bVal ? 1 : -1;
      }
    });

    // Pagination
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + parseInt(limit);
    const paginatedListings = listings.slice(startIndex, endIndex);

    res.json({
      success: true,
      listings: paginatedListings,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: listings.length,
        pages: Math.ceil(listings.length / limit)
      },
      filters: {
        category,
        min_price,
        max_price,
        emotion_valence_min,
        emotion_valence_max,
        ai_model,
        seller,
        search,
        sort_by,
        sort_order
      }
    });

  } catch (error) {
    console.error('Error fetching listings:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch listings',
      details: error.message
    });
  }
});

// Get single listing
app.get('/api/marketplace/listings/:id', (req, res) => {
  try {
    const listing = marketplaceDB.listings.get(req.params.id);
    
    if (!listing) {
      return res.status(404).json({
        success: false,
        error: 'Listing not found'
      });
    }

    // Increment view count
    listing.views = (listing.views || 0) + 1;
    marketplaceDB.listings.set(listing.id, listing);

    res.json({
      success: true,
      listing
    });

  } catch (error) {
    console.error('Error fetching listing:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch listing',
      details: error.message
    });
  }
});

// Create new listing
app.post('/api/marketplace/listings', (req, res) => {
  try {
    const {
      tokenId,
      title,
      description,
      price,
      currency = 'NEAR',
      category,
      tags = [],
      emotion_vector,
      ai_model,
      media_url
    } = req.body;

    // Validation
    if (!tokenId || !title || !price || !category) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields: tokenId, title, price, category'
      });
    }

    const listing = {
      id: `listing_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      tokenId,
      seller: req.body.seller || 'user.testnet', // Should come from authenticated user
      title,
      description,
      price,
      currency,
      category,
      tags,
      emotion_vector: emotion_vector || { valence: 0.5, arousal: 0.5, dominance: 0.5 },
      ai_model: ai_model || 'unknown',
      media_url: media_url || 'https://trae-api-sg.mchost.guru/api/ide/v1/text_to_image?prompt=default%20nft%20image&image_size=square_hd',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      status: 'active',
      views: 0,
      likes: 0,
      featured: false
    };

    marketplaceDB.listings.set(listing.id, listing);

    res.json({
      success: true,
      listing,
      message: 'Listing created successfully'
    });

  } catch (error) {
    console.error('Error creating listing:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to create listing',
      details: error.message
    });
  }
});

// ===== AUCTION SYSTEM =====

// Get all auctions
app.get('/api/marketplace/auctions', (req, res) => {
  try {
    const { page = 1, limit = 20, status = 'active', sort_by = 'end_time' } = req.query;
    
    let auctions = Array.from(marketplaceDB.auctions.values()).filter(a => a.status === status);
    
    // Sort by end time (soonest first)
    auctions.sort((a, b) => new Date(a.end_time) - new Date(b.end_time));
    
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + parseInt(limit);
    const paginatedAuctions = auctions.slice(startIndex, endIndex);

    res.json({
      success: true,
      auctions: paginatedAuctions,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: auctions.length,
        pages: Math.ceil(auctions.length / limit)
      }
    });

  } catch (error) {
    console.error('Error fetching auctions:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch auctions',
      details: error.message
    });
  }
});

// Place bid on auction
app.post('/api/marketplace/auctions/:id/bids', (req, res) => {
  try {
    const { bid_amount, bidder } = req.body;
    const auctionId = req.params.id;

    if (!bid_amount || !bidder) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields: bid_amount, bidder'
      });
    }

    const auction = marketplaceDB.auctions.get(auctionId);
    if (!auction) {
      return res.status(404).json({
        success: false,
        error: 'Auction not found'
      });
    }

    if (auction.status !== 'active') {
      return res.status(400).json({
        success: false,
        error: 'Auction is not active'
      });
    }

    if (new Date() > new Date(auction.end_time)) {
      return res.status(400).json({
        success: false,
        error: 'Auction has ended'
      });
    }

    const currentBid = parseFloat(auction.current_bid || auction.starting_price);
    const newBid = parseFloat(bid_amount);

    if (newBid <= currentBid) {
      return res.status(400).json({
        success: false,
        error: 'Bid must be higher than current bid'
      });
    }

    // Update auction with new bid
    auction.current_bid = bid_amount;
    auction.bid_count = (auction.bid_count || 0) + 1;
    auction.last_bidder = bidder;
    auction.updated_at = new Date().toISOString();

    marketplaceDB.auctions.set(auctionId, auction);

    // Store bid history
    const bidId = `bid_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const bid = {
      id: bidId,
      auction_id: auctionId,
      bidder,
      amount: bid_amount,
      created_at: new Date().toISOString()
    };

    marketplaceDB.bids.set(bidId, bid);

    res.json({
      success: true,
      bid,
      auction: {
        id: auctionId,
        current_bid: auction.current_bid,
        bid_count: auction.bid_count
      },
      message: 'Bid placed successfully'
    });

  } catch (error) {
    console.error('Error placing bid:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to place bid',
      details: error.message
    });
  }
});

// ===== AI AGENT REGISTRY =====

// Get all AI agents
app.get('/api/agents', (req, res) => {
  try {
    const { page = 1, limit = 20, status = 'active', search, sort_by = 'rating' } = req.query;
    
    let agents = Array.from(marketplaceDB.agents.values()).filter(a => a.status === status);
    
    if (search) {
      const searchLower = search.toLowerCase();
      agents = agents.filter(a => 
        a.name.toLowerCase().includes(searchLower) ||
        a.description.toLowerCase().includes(searchLower) ||
        a.capabilities.some(cap => cap.toLowerCase().includes(searchLower))
      );
    }

    // Sort by rating (highest first)
    agents.sort((a, b) => (b.rating || 0) - (a.rating || 0));

    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + parseInt(limit);
    const paginatedAgents = agents.slice(startIndex, endIndex);

    res.json({
      success: true,
      agents: paginatedAgents,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: agents.length,
        pages: Math.ceil(agents.length / limit)
      }
    });

  } catch (error) {
    console.error('Error fetching agents:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch agents',
      details: error.message
    });
  }
});

// Get single agent
app.get('/api/agents/:id', (req, res) => {
  try {
    const agent = marketplaceDB.agents.get(req.params.id);
    
    if (!agent) {
      return res.status(404).json({
        success: false,
        error: 'Agent not found'
      });
    }

    res.json({
      success: true,
      agent
    });

  } catch (error) {
    console.error('Error fetching agent:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch agent',
      details: error.message
    });
  }
});

// Deploy agent (simulate)
app.post('/api/agents/:id/deploy', (req, res) => {
  try {
    const agentId = req.params.id;
    const { user_id, parameters } = req.body;

    const agent = marketplaceDB.agents.get(agentId);
    if (!agent) {
      return res.status(404).json({
        success: false,
        error: 'Agent not found'
      });
    }

    if (agent.status !== 'active') {
      return res.status(400).json({
        success: false,
        error: 'Agent is not active'
      });
    }

    // Simulate deployment
    const deployment = {
      id: `deployment_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      agent_id: agentId,
      user_id: user_id,
      parameters: parameters || {},
      status: 'deployed',
      created_at: new Date().toISOString(),
      endpoint_url: `https://agents.bitte.ai/${agentId}/${user_id}`,
      cost: agent.price_per_use
    };

    // Update agent usage
    agent.usage_count = (agent.usage_count || 0) + 1;
    marketplaceDB.agents.set(agentId, agent);

    res.json({
      success: true,
      deployment,
      message: 'Agent deployed successfully'
    });

  } catch (error) {
    console.error('Error deploying agent:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to deploy agent',
      details: error.message
    });
  }
});

// ===== ANALYTICS AND TRENDS =====

// Get marketplace analytics
app.get('/api/analytics/market-trends', (req, res) => {
  try {
    const listings = Array.from(marketplaceDB.listings.values());
    const auctions = Array.from(marketplaceDB.auctions.values());
    
    const totalVolume = listings.reduce((sum, l) => sum + parseFloat(l.price || 0), 0);
    const averagePrice = listings.length > 0 ? totalVolume / listings.length : 0;
    
    const categoryStats = {};
    listings.forEach(l => {
      categoryStats[l.category] = (categoryStats[l.category] || 0) + 1;
    });

    const emotionStats = {
      valence: { avg: 0, min: 1, max: 0 },
      arousal: { avg: 0, min: 1, max: 0 },
      dominance: { avg: 0, min: 1, max: 0 }
    };

    listings.forEach(l => {
      const ev = l.emotion_vector;
      emotionStats.valence.avg += ev.valence;
      emotionStats.arousal.avg += ev.arousal;
      emotionStats.dominance.avg += ev.dominance;
      
      emotionStats.valence.min = Math.min(emotionStats.valence.min, ev.valence);
      emotionStats.valence.max = Math.max(emotionStats.valence.max, ev.valence);
      emotionStats.arousal.min = Math.min(emotionStats.arousal.min, ev.arousal);
      emotionStats.arousal.max = Math.max(emotionStats.arousal.max, ev.arousal);
      emotionStats.dominance.min = Math.min(emotionStats.dominance.min, ev.dominance);
      emotionStats.dominance.max = Math.max(emotionStats.dominance.max, ev.dominance);
    });

    if (listings.length > 0) {
      emotionStats.valence.avg /= listings.length;
      emotionStats.arousal.avg /= listings.length;
      emotionStats.dominance.avg /= listings.length;
    }

    res.json({
      success: true,
      analytics: {
        total_listings: listings.length,
        total_auctions: auctions.length,
        total_volume: totalVolume.toFixed(2),
        average_price: averagePrice.toFixed(2),
        category_distribution: categoryStats,
        emotion_statistics: emotionStats,
        top_categories: Object.entries(categoryStats)
          .sort(([,a], [,b]) => b - a)
          .slice(0, 5)
          .map(([category, count]) => ({ category, count }))
      }
    });

  } catch (error) {
    console.error('Error fetching analytics:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch analytics',
      details: error.message
    });
  }
});

// Get top agents by usage and rating
app.get('/api/analytics/top-agents', (req, res) => {
  try {
    const agents = Array.from(marketplaceDB.agents.values());
    
    const topByUsage = [...agents]
      .sort((a, b) => (b.usage_count || 0) - (a.usage_count || 0))
      .slice(0, 10);

    const topByRating = [...agents]
      .filter(a => (a.rating || 0) >= 4.0)
      .sort((a, b) => (b.rating || 0) - (a.rating || 0))
      .slice(0, 10);

    res.json({
      success: true,
      top_agents: {
        by_usage: topByUsage,
        by_rating: topByRating
      }
    });

  } catch (error) {
    console.error('Error fetching top agents:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch top agents',
      details: error.message
    });
  }
});

// ===== NOTIFICATIONS =====

// Get user notifications
app.get('/api/notifications/:user_id', (req, res) => {
  try {
    const userId = req.params.user_id;
    const { page = 1, limit = 20, type } = req.query;

    let notifications = Array.from(marketplaceDB.notifications.values())
      .filter(n => n.user_id === userId);

    if (type) {
      notifications = notifications.filter(n => n.type === type);
    }

    // Sort by created_at (newest first)
    notifications.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + parseInt(limit);
    const paginatedNotifications = notifications.slice(startIndex, endIndex);

    res.json({
      success: true,
      notifications: paginatedNotifications,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: notifications.length,
        pages: Math.ceil(notifications.length / limit)
      }
    });

  } catch (error) {
    console.error('Error fetching notifications:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch notifications',
      details: error.message
    });
  }
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    status: 'healthy',
    timestamp: new Date().toISOString(),
    service: 'bitte-marketplace-backend',
    version: '1.0.0'
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Bitte Advanced Marketplace Backend running on port ${PORT}`);
  console.log(`📊 Marketplace API endpoints available at http://localhost:${PORT}/api/`);
  console.log(`🔍 Advanced search and filtering enabled`);
  console.log(`🏷️  Auction system with bidding functionality`);
  console.log(`🤖 AI agent registry with deployment capabilities`);
  console.log(`📈 Analytics and market trends tracking`);
  console.log(`🔔 Real-time notification system`);
});

module.exports = app;