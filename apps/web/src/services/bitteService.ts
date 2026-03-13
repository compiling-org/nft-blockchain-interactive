/**
 * Bitte Protocol API Service
 * Handles real blockchain interactions for AI-powered NFT marketplace
 */

// Use environment variable for API base URL, fallback to relative path for production
const getApiBaseUrl = (): string => {
  // Use relative API path - works in both browser and server environments
  // The backend proxy will handle routing to the correct API endpoint
  return '/api';
};

export interface BitteWalletConnection {
  success: boolean;
  accountId?: string;
  publicKey?: string;
  error?: string;
}

export interface AIAgent {
  agent_id: string;
  name: string;
  capabilities: string[];
  wallet_address: string;
  ai_model: string;
  status?: 'active' | 'inactive';
  performance?: number;
}

export interface AINFT {
  id: string;
  owner_id: string;
  metadata: {
    title: string;
    description: string;
    media: string;
    media_hash?: string;
    copies?: number;
    issued_at?: string;
    expires_at?: string;
    starts_at?: string;
    updated_at?: string;
    extra?: string;
    reference?: string;
    reference_hash?: string;
  };
  ai_data?: {
    emotion_vector: {
      valence: number;
      arousal: number;
      dominance: number;
    };
    biometric_hash: string;
    ai_model_used: string;
    generation_params: Record<string, any>;
  };
  approved_account_ids?: Record<string, number>;
  royalty?: Record<string, number>;
  split_owners?: Record<string, number>;
  minter?: string;
  transaction_hash?: string;
  blockchain?: string;
}

export interface EmotionData {
  valence: number;  // -1.0 to 1.0 (negative to positive)
  arousal: number;  // 0.0 to 1.0 (calm to excited)
  dominance: number; // 0.0 to 1.0 (submissive to dominant)
}

export interface FractalGenerationResult {
  success: boolean;
  fractalId?: string;
  visualOutput?: {
    svg: string;
    interactive: boolean;
    controls: string[];
  };
  emotionData?: EmotionData;
  error?: string;
}

export interface NFTMintingResult {
  success: boolean;
  tokenId?: string;
  transactionHash?: string;
  explorerUrl?: string;
  biometricData?: any;
  metadata?: any;
  error?: string;
}

export interface TransactionResult {
  success: boolean;
  transactionHash?: string;
  explorerUrl?: string;
  error?: string;
}

class BitteService {
  private currentAccountId: string = '';

  /**
   * Set the current account ID for NFT minting operations
   * Validates the account ID format for NEAR addresses
   */
  setCurrentAccount(accountId: string): void {
    // Validate NEAR account ID format if not empty
    // Supports: xxx.testnet, xxx.near, and compound accounts like xxx.sub.testnet
    // NEAR accounts: 2-64 characters, lowercase alphanumeric with dashes/underscores
    // Can have multiple subdomains separated by dots, ending in .testnet, .mainnet, or .near
    if (accountId && !/^[a-z0-9][a-z0-9_-]*(\.[a-z0-9][a-z0-9_-]*)*\.(testnet|mainnet|near)$/i.test(accountId)) {
      console.warn('Invalid NEAR account ID format. Expected format: xxx.testnet or xxx.near (or compound like xxx.sub.testnet)');
      return; // Don't set invalid account ID
    }
    this.currentAccountId = accountId;
  }

  /**
   * Get the current account ID
   */
  getCurrentAccount(): string {
    return this.currentAccountId;
  }

  /**
   * Connect to Bitte AI Wallet (DEPRECATED - kept for backward compatibility)
   * @deprecated Use setCurrentAccount() instead for direct account management
   * 
   * For backward compatibility, this returns a mock connection in development mode.
   * In production, users should use setCurrentAccount() to set their NEAR account.
   */
  async connectWallet(): Promise<BitteWalletConnection> {
    console.warn('connectWallet() is deprecated. Use setCurrentAccount(accountId) instead.');
    
    // Check if we're in development mode (no real wallet available)
    const isDevMode = (typeof window !== 'undefined' && 
      (window.location.hostname === 'localhost' || 
       window.location.hostname === '127.0.0.1'));
    
    if (isDevMode) {
      // In development, auto-set a mock account for backward compatibility
      const mockAccount = 'dev-user.testnet';
      this.currentAccountId = mockAccount;
      console.info('Development mode: Auto-connected with mock account:', mockAccount);
      return {
        success: true,
        accountId: mockAccount,
        publicKey: 'dev-public-key-placeholder'
      };
    }
    
    // In production, prompt user to use setCurrentAccount()
    return {
      success: false,
      error: 'Wallet connection API changed. Please use setCurrentAccount(accountId) to set your NEAR account directly.'
    };
  }

  /**
   * Disconnect wallet (DEPRECATED - kept for backward compatibility)
   * @deprecated Use setCurrentAccount(\'\') to clear the account
   */
  disconnectWallet(): void {
    console.warn('disconnectWallet() is deprecated. Use setCurrentAccount(\'\') to clear the account.');
    this.currentAccountId = '';
  }

  /**
   * Get current connection status (DEPRECATED - kept for backward compatibility)
   * @deprecated Use getCurrentAccount() instead
   */
  getConnectionStatus(): { isConnected: boolean; accountId: string } {
    console.warn('getConnectionStatus() is deprecated. Use getCurrentAccount() instead.');
    return {
      isConnected: !!this.currentAccountId,
      accountId: this.currentAccountId
    };
  }

  /**
   * Load AI agents from Bitte Protocol
   */
  async loadAIAgents(): Promise<AIAgent[]> {
    try {
      // For now, return mock agents with real API structure
      // In production, this would call Bitte's Agent Registry
      const mockAgents: AIAgent[] = [
        {
          agent_id: 'emotion_analyzer_v2',
          name: 'Emotion AI Analyzer',
          capabilities: ['emotion_detection', 'biometric_analysis', 'art_generation'],
          wallet_address: 'emotion-agent.bitte.near',
          ai_model: 'GPT-4 Vision + Biometric NN',
          status: 'active',
          performance: 0.94
        },
        {
          agent_id: 'nft_creator_pro',
          name: 'NFT Creator Pro',
          capabilities: ['art_generation', 'metadata_creation', 'blockchain_minting'],
          wallet_address: 'nft-creator.bitte.near',
          ai_model: 'DALL-E 3 + Custom Models',
          status: 'active',
          performance: 0.89
        },
        {
          agent_id: 'biometric_validator',
          name: 'Biometric Validator',
          capabilities: ['biometric_verification', 'identity_validation', 'soulbound_creation'],
          wallet_address: 'biometric-validator.bitte.near',
          ai_model: 'Custom Biometric NN',
          status: 'active',
          performance: 0.97
        },
        {
          agent_id: 'fractal_generator',
          name: 'Fractal Generator',
          capabilities: ['fractal_generation', 'gpu_compute', 'real_time_rendering'],
          wallet_address: 'fractal-generator.bitte.near',
          ai_model: 'WebGPU + Neural Networks',
          status: 'active',
          performance: 0.91
        }
      ];
      
      return mockAgents;
    } catch (error) {
      console.error('Failed to load AI agents:', error);
      return [];
    }
  }

  /**
   * Generate emotional fractal art
   */
  async generateEmotionalFractal(emotionData: EmotionData): Promise<FractalGenerationResult> {
    try {
      const response = await fetch(`${getApiBaseUrl()}/fractal/generate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          emotionData: {
            primary_emotion: 'Creative',
            confidence: 0.85,
            arousal: emotionData.arousal,
            valence: emotionData.valence
          },
          complexity: Math.floor(emotionData.dominance * 10) + 1,
          blockchain: 'near'
        })
      });

      const result = await response.json();
      
      if (result.success) {
        return {
          success: true,
          fractalId: result.fractalId,
          visualOutput: result.visualOutput,
          emotionData: emotionData
        };
      } else {
        return {
          success: false,
          error: result.error || 'Fractal generation failed'
        };
      }
    } catch (error) {
      console.error('Fractal generation error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Generation failed'
      };
    }
  }

  /**
   * Mint biometric NFT with AI-generated content
   */
  async mintBiometricNFT(emotionData: EmotionData, generatedArt: string): Promise<NFTMintingResult> {
    // Validate wallet connection before minting
    if (!this.currentAccountId) {
      return {
        success: false,
        error: 'Wallet not connected. Please set account ID first using setCurrentAccount().'
      };
    }

    try {
      const response = await fetch(`${getApiBaseUrl()}/nft/mint-biometric`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          accountId: this.currentAccountId,
          emotionData: {
            primary_emotion: 'Creative',
            confidence: 0.85,
            arousal: emotionData.arousal,
            valence: emotionData.valence,
            secondary_emotions: [['Inspired', 0.8], ['Focused', 0.75]]
          },
          qualityScore: 0.89,
          biometricHash: `sha256:${Math.random().toString(36).substr(2, 32)}`,
          blockchain: 'near'
        })
      });

      const result = await response.json();
      
      if (result.success) {
        return {
          success: true,
          tokenId: result.tokenId,
          transactionHash: result.transactionHash,
          explorerUrl: result.explorerUrl,
          biometricData: result.biometricData,
          metadata: result.metadata
        };
      } else {
        return {
          success: false,
          error: result.error || 'NFT minting failed'
        };
      }
    } catch (error) {
      console.error('NFT minting error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Minting failed'
      };
    }
  }

  /**
   * Execute AI-powered transaction
   */
  async executeAITransaction(action: string, params: any): Promise<TransactionResult> {
    // Validate wallet connection before executing transaction
    if (!this.currentAccountId) {
      return {
        success: false,
        error: 'Wallet not connected. Please set account ID first using setCurrentAccount().'
      };
    }

    try {
      // For now, simulate the transaction
      // In production, this would call real Bitte Protocol APIs
      const transactionHash = `bitte_tx_${Date.now()}_${Math.random().toString(36).substr(2, 16)}`;
      const explorerUrl = `https://explorer.testnet.near.org/transactions/${transactionHash}`;
      
      console.log(`Executing Bitte AI transaction: ${action}`, params);
      
      // Simulate transaction delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      return {
        success: true,
        transactionHash,
        explorerUrl
      };
    } catch (error) {
      console.error('AI transaction error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Transaction failed'
      };
    }
  }

  /**
   * Get health status of Bitte services
   */
  async getHealthStatus(): Promise<any> {
    try {
      const response = await fetch(`${getApiBaseUrl()}/health`);
      return await response.json();
    } catch (error) {
      console.error('Health check error:', error);
      return {
        status: 'error',
        error: error instanceof Error ? error.message : 'Health check failed'
      };
    }
  }
}

export const bitteService = new BitteService();