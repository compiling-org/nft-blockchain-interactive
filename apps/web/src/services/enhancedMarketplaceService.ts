/**
 * Enhanced Bitte Marketplace Service
 * Connects to the advanced marketplace backend with comprehensive features
 */

const MARKETPLACE_API_URL = '/api';

export interface MarketplaceListing {
  id: string;
  tokenId: string;
  seller: string;
  title: string;
  description: string;
  price: string;
  currency: string;
  category: string;
  tags: string[];
  emotion_vector: {
    valence: number;
    arousal: number;
    dominance: number;
  };
  ai_model: string;
  media_url: string;
  created_at: string;
  updated_at: string;
  status: 'active' | 'sold' | 'cancelled';
  views: number;
  likes: number;
  featured: boolean;
}

export interface MarketplaceAuction {
  id: string;
  tokenId: string;
  seller: string;
  title: string;
  description: string;
  starting_price: string;
  reserve_price: string;
  currency: string;
  category: string;
  emotion_vector: {
    valence: number;
    arousal: number;
    dominance: number;
  };
  ai_model: string;
  media_url: string;
  created_at: string;
  end_time: string;
  status: 'active' | 'ended' | 'cancelled';
  current_bid: string;
  bid_count: number;
  featured: boolean;
  time_remaining?: number;
}

export interface EnhancedAIAgent {
  id: string;
  name: string;
  description: string;
  capabilities: string[];
  wallet_address: string;
  ai_model: string;
  status: 'active' | 'inactive';
  performance: number;
  usage_count: number;
  rating: number;
  price_per_use: string;
  created_by: string;
  created_at: string;
}

export interface Bid {
  id: string;
  auction_id: string;
  bidder: string;
  amount: string;
  created_at: string;
}

export interface MarketAnalytics {
  total_listings: number;
  total_auctions: number;
  total_volume: string;
  average_price: string;
  category_distribution: Record<string, number>;
  emotion_statistics: {
    valence: { avg: number; min: number; max: number };
    arousal: { avg: number; min: number; max: number };
    dominance: { avg: number; min: number; max: number };
  };
  top_categories: Array<{ category: string; count: number }>;
}

export interface SearchFilters {
  category?: string;
  min_price?: string;
  max_price?: string;
  emotion_valence_min?: number;
  emotion_valence_max?: number;
  emotion_arousal_min?: number;
  emotion_arousal_max?: number;
  emotion_dominance_min?: number;
  emotion_dominance_max?: number;
  ai_model?: string;
  seller?: string;
  search?: string;
  status?: string;
}

export interface PaginationParams {
  page?: number;
  limit?: number;
  sort_by?: string;
  sort_order?: 'asc' | 'desc';
}

class EnhancedMarketplaceService {
  private baseUrl: string;

  constructor() {
    this.baseUrl = MARKETPLACE_API_URL;
  }

  /**
   * Get all marketplace listings with advanced filtering
   */
  async getListings(filters: SearchFilters = {}, pagination: PaginationParams = {}): Promise<{
    listings: MarketplaceListing[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      pages: number;
    };
  }> {
    try {
      const params = new URLSearchParams();
      
      // Add filters
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          params.append(key, value.toString());
        }
      });

      // Add pagination
      Object.entries(pagination).forEach(([key, value]) => {
        if (value !== undefined) {
          params.append(key, value.toString());
        }
      });

      const response = await fetch(`${this.baseUrl}/marketplace/listings?${params}`);
      const data = await response.json();

      if (!data.success) {
        throw new Error(data.error || 'Failed to fetch listings');
      }

      return data;
    } catch (error) {
      console.error('Error fetching listings:', error);
      throw error;
    }
  }

  /**
   * Get single listing by ID
   */
  async getListing(id: string): Promise<MarketplaceListing> {
    try {
      const response = await fetch(`${this.baseUrl}/marketplace/listings/${id}`);
      const data = await response.json();

      if (!data.success) {
        throw new Error(data.error || 'Failed to fetch listing');
      }

      return data.listing;
    } catch (error) {
      console.error('Error fetching listing:', error);
      throw error;
    }
  }

  /**
   * Create new listing
   */
  async createListing(listing: Omit<MarketplaceListing, 'id' | 'created_at' | 'updated_at' | 'views' | 'likes'>): Promise<MarketplaceListing> {
    try {
      const response = await fetch(`${this.baseUrl}/marketplace/listings`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(listing),
      });

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.error || 'Failed to create listing');
      }

      return data.listing;
    } catch (error) {
      console.error('Error creating listing:', error);
      throw error;
    }
  }

  /**
   * Get all active auctions
   */
  async getAuctions(filters: { status?: string } = {}, pagination: PaginationParams = {}): Promise<{
    auctions: MarketplaceAuction[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      pages: number;
    };
  }> {
    try {
      const params = new URLSearchParams();
      
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined) {
          params.append(key, value);
        }
      });

      Object.entries(pagination).forEach(([key, value]) => {
        if (value !== undefined) {
          params.append(key, value.toString());
        }
      });

      const response = await fetch(`${this.baseUrl}/marketplace/auctions?${params}`);
      const data = await response.json();

      if (!data.success) {
        throw new Error(data.error || 'Failed to fetch auctions');
      }

      // Add time remaining calculation
      const auctionsWithTime = data.auctions.map((auction: MarketplaceAuction) => ({
        ...auction,
        time_remaining: Math.max(0, new Date(auction.end_time).getTime() - Date.now())
      }));

      return {
        ...data,
        auctions: auctionsWithTime
      };
    } catch (error) {
      console.error('Error fetching auctions:', error);
      throw error;
    }
  }

  /**
   * Place bid on auction
   */
  async placeBid(auctionId: string, bid: { bid_amount: string; bidder: string }): Promise<Bid> {
    try {
      const response = await fetch(`${this.baseUrl}/marketplace/auctions/${auctionId}/bids`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(bid),
      });

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.error || 'Failed to place bid');
      }

      return data.bid;
    } catch (error) {
      console.error('Error placing bid:', error);
      throw error;
    }
  }

  /**
   * Get all AI agents
   */
  async getAgents(filters: { status?: string; search?: string } = {}, pagination: PaginationParams = {}): Promise<{
    agents: EnhancedAIAgent[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      pages: number;
    };
  }> {
    try {
      const params = new URLSearchParams();
      
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined) {
          params.append(key, value);
        }
      });

      Object.entries(pagination).forEach(([key, value]) => {
        if (value !== undefined) {
          params.append(key, value.toString());
        }
      });

      const response = await fetch(`${this.baseUrl}/agents?${params}`);
      const data = await response.json();

      if (!data.success) {
        throw new Error(data.error || 'Failed to fetch agents');
      }

      return data;
    } catch (error) {
      console.error('Error fetching agents:', error);
      throw error;
    }
  }

  /**
   * Get single agent by ID
   */
  async getAgent(id: string): Promise<EnhancedAIAgent> {
    try {
      const response = await fetch(`${this.baseUrl}/agents/${id}`);
      const data = await response.json();

      if (!data.success) {
        throw new Error(data.error || 'Failed to fetch agent');
      }

      return data.agent;
    } catch (error) {
      console.error('Error fetching agent:', error);
      throw error;
    }
  }

  /**
   * Deploy AI agent
   */
  async deployAgent(agentId: string, deployment: { user_id: string; parameters?: any }): Promise<{
    id: string;
    agent_id: string;
    user_id: string;
    parameters: any;
    status: string;
    created_at: string;
    endpoint_url: string;
    cost: string;
  }> {
    try {
      const response = await fetch(`${this.baseUrl}/agents/${agentId}/deploy`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(deployment),
      });

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.error || 'Failed to deploy agent');
      }

      return data.deployment;
    } catch (error) {
      console.error('Error deploying agent:', error);
      throw error;
    }
  }

  /**
   * Get marketplace analytics
   */
  async getAnalytics(): Promise<MarketAnalytics> {
    try {
      const response = await fetch(`${this.baseUrl}/analytics/market-trends`);
      const data = await response.json();

      if (!data.success) {
        throw new Error(data.error || 'Failed to fetch analytics');
      }

      return data.analytics;
    } catch (error) {
      console.error('Error fetching analytics:', error);
      throw error;
    }
  }

  /**
   * Get top agents by usage and rating
   */
  async getTopAgents(): Promise<{
    top_agents: {
      by_usage: EnhancedAIAgent[];
      by_rating: EnhancedAIAgent[];
    };
  }> {
    try {
      const response = await fetch(`${this.baseUrl}/analytics/top-agents`);
      const data = await response.json();

      if (!data.success) {
        throw new Error(data.error || 'Failed to fetch top agents');
      }

      return data;
    } catch (error) {
      console.error('Error fetching top agents:', error);
      throw error;
    }
  }

  /**
   * Search listings with advanced filters
   */
  async searchListings(query: string, filters: SearchFilters = {}, pagination: PaginationParams = {}): Promise<{
    listings: MarketplaceListing[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      pages: number;
    };
  }> {
    return this.getListings({ ...filters, search: query }, pagination);
  }

  /**
   * Get emotion-based recommendations
   */
  async getEmotionRecommendations(emotionVector: {
    valence: number;
    arousal: number;
    dominance: number;
  }): Promise<MarketplaceListing[]> {
    try {
      // Search for listings with similar emotion vectors
      const valenceRange = 0.2; // ±0.2 tolerance
      const arousalRange = 0.2;
      const dominanceRange = 0.2;

      const filters: SearchFilters = {
        emotion_valence_min: Math.max(0, emotionVector.valence - valenceRange),
        emotion_valence_max: Math.min(1, emotionVector.valence + valenceRange),
        emotion_arousal_min: Math.max(0, emotionVector.arousal - arousalRange),
        emotion_arousal_max: Math.min(1, emotionVector.arousal + arousalRange),
        emotion_dominance_min: Math.max(0, emotionVector.dominance - dominanceRange),
        emotion_dominance_max: Math.min(1, emotionVector.dominance + dominanceRange),
      };

      const result = await this.getListings(filters, { limit: 10 });
      return result.listings;
    } catch (error) {
      console.error('Error getting emotion recommendations:', error);
      return [];
    }
  }

  /**
   * Get trending listings (high views + recent)
   */
  async getTrendingListings(limit: number = 10): Promise<MarketplaceListing[]> {
    try {
      const result = await this.getListings({}, { 
        limit, 
        sort_by: 'views',
        sort_order: 'desc'
      });
      
      // Filter for recent listings (last 7 days)
      const oneWeekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
      return result.listings.filter(l => new Date(l.created_at) > oneWeekAgo);
    } catch (error) {
      console.error('Error getting trending listings:', error);
      return [];
    }
  }

  /**
   * Get featured listings
   */
  async getFeaturedListings(limit: number = 6): Promise<MarketplaceListing[]> {
    try {
      const allListings = await this.getListings({}, { limit: 100 });
      return allListings.listings.filter(l => l.featured).slice(0, limit);
    } catch (error) {
      console.error('Error getting featured listings:', error);
      return [];
    }
  }
}

export const enhancedMarketplaceService = new EnhancedMarketplaceService();
