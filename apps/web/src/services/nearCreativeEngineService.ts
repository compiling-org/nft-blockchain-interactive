import { Contract } from 'near-api-js';
import { MyNearWalletService } from './myNearWalletService';

export interface CreativeAsset {
  id: string;
  type: 'fractal' | 'shader' | 'audio' | 'biometric' | 'ai' | 'neural';
  data: any;
  emotionalState: EmotionalState;
  timestamp: number;
  owner: string;
  metadata?: CreativeMetadata;
  tokenId?: string;
  transactionHash?: string;
  gasUsed?: string;
}

export interface EmotionalState {
  valence: number;
  arousal: number;
  dominance: number;
  confidence: number;
  primaryEmotion: string;
}

export interface CreativeMetadata {
  title: string;
  description: string;
  media: string;
  media_hash: string;
  issued_at: string;
  expires_at?: string;
  starts_at?: string;
  updated_at?: string;
  extra?: string;
  reference?: string;
  reference_hash?: string;
}

export class NEARCreativeEngineService {
  private walletService: MyNearWalletService;
  private contract: any = null;
  private contractId: string;

  constructor(walletService: MyNearWalletService, contractId: string) {
    this.walletService = walletService;
    this.contractId = contractId;
  }

  async initialize(): Promise<void> {
    if (!this.walletService.isSignedIn()) {
      throw new Error('Wallet not connected');
    }

    const account = await this.walletService.getAccount();
    if (!account) {
      throw new Error('No account available');
    }

    // Use existing contract methods from the deployed contract
    this.contract = new Contract(account, this.contractId, {
      viewMethods: [
        'get_metadata',
        'get_interaction_history',
        'total_supply'
      ],
      changeMethods: [
        'mint_nft',
        'mint_interactive_nft',
        'record_interaction'
      ]
    });
  }

  async mintInteractiveNFT(
    tokenId: string,
    receiverId: string,
    metadata: CreativeMetadata,
    emotionalState: EmotionalState
  ): Promise<{ token_id: string; transaction_hash: string }> {
    if (!this.contract) {
      throw new Error('Contract not initialized');
    }

    try {
      const result = await (this.contract as any).mint_interactive_nft({
        token_id: tokenId,
        receiver_id: receiverId,
        metadata,
        initial_emotional_state: {
          valence: emotionalState.valence,
          arousal: emotionalState.arousal,
          dominance: emotionalState.dominance,
          confidence: emotionalState.confidence,
          complexity: 0.5 // Default complexity
        }
      }, '30000000000000', '100000000000000000000000'); // 30 TGas, 0.1 NEAR

      return {
        token_id: tokenId,
        transaction_hash: result?.transaction?.hash || 'unknown'
      };
    } catch (error) {
      console.error('Failed to mint interactive NFT:', error);
      throw new Error(`Interactive mint failed: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  async mintCreativeAsset(asset: CreativeAsset): Promise<{ token_id: string; transaction_hash: string }> {
    if (!this.contract) {
      throw new Error('Contract not initialized');
    }

    try {
      // Prepare metadata for NFT
      const metadata = this.prepareCreativeMetadata(asset);
      
      // Use existing mint_nft method
      const result = await (this.contract as any).mint_nft({
        token_id: asset.id,
        metadata
      });

      // Update asset with blockchain data
      asset.tokenId = asset.id;
      
      return {
        token_id: asset.id,
        transaction_hash: result?.transaction?.hash || 'unknown'
      };
    } catch (error) {
      console.error('Failed to mint creative asset:', error);
      throw new Error(`Minting failed: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  async recordInteraction(tokenId: string, interaction: string): Promise<void> {
    if (!this.contract) {
      throw new Error('Contract not initialized');
    }

    try {
      await (this.contract as any).record_interaction({
        token_id: tokenId,
        interaction
      });
    } catch (error) {
      console.error('Failed to record interaction:', error);
      throw new Error(`Interaction failed: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  async getCreativeAsset(tokenId: string): Promise<any> {
    if (!this.contract) {
      throw new Error('Contract not initialized');
    }

    try {
      return await (this.contract as any).get_metadata({ token_id: tokenId });
    } catch (error) {
      console.error('Failed to get creative asset:', error);
      return null;
    }
  }

  async getUserAssets(accountId?: string): Promise<any[]> {
    if (!this.contract) {
      throw new Error('Contract not initialized');
    }

    // For now, return empty array as we don't have a method to get user assets
    return [];
  }

  async getTotalSupply(): Promise<number> {
    if (!this.contract) {
      throw new Error('Contract not initialized');
    }

    try {
      const result = await (this.contract as any).total_supply();
      return parseInt(result.toString());
    } catch (error) {
      console.error('Failed to get total supply:', error);
      return 0;
    }
  }

  private prepareCreativeMetadata(asset: CreativeAsset): CreativeMetadata {
    const timestamp = asset.timestamp.toString();
    const mediaData = this.serializeAssetData(asset.data);
    const mediaHash = this.generateHash(mediaData);
    
    return {
      title: `${this.capitalizeFirst(asset.type)} Creative Asset #${asset.id.slice(-8)}`,
      description: `Creative ${asset.type} asset generated with emotional state: ${asset.emotionalState.primaryEmotion}`,
      media: `data:application/json;base64,${btoa(mediaData)}`,
      media_hash: mediaHash,
      issued_at: timestamp,
      extra: JSON.stringify({
        emotionalState: asset.emotionalState,
        creativeType: asset.type,
        generatorVersion: '1.0.0',
        owner: asset.owner
      })
    };
  }

  private serializeAssetData(data: any): string {
    try {
      return JSON.stringify(data, (key, value) => {
        // Handle special data types
        if (value instanceof Uint8Array) {
          return Array.from(value);
        }
        if (value instanceof ArrayBuffer) {
          return Array.from(new Uint8Array(value));
        }
        if (value instanceof HTMLCanvasElement) {
          return '<canvas>';
        }
        if (value instanceof WebGLRenderingContext || value instanceof WebGL2RenderingContext) {
          return '<WebGLContext>';
        }
        return value;
      });
    } catch (error) {
      console.error('Failed to serialize asset data:', error);
      return '{}';
    }
  }

  private generateHash(data: string): string {
    // Simple hash function for metadata
    let hash = 0;
    for (let i = 0; i < data.length; i++) {
      const char = data.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    return Math.abs(hash).toString(16);
  }

  private capitalizeFirst(str: string): string {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

  // Utility methods for gas estimation and transaction optimization
  async estimateGasForOperation(operation: string): Promise<string> {
    // This would typically call a view method to estimate gas
    // For now, return a reasonable estimate
    const baseGas = {
      'mint_nft': '30_000_000_000_000', // 30 TGas
      'record_interaction': '3_000_000_000_000', // 3 TGas
    };
    
    return (baseGas as any)[operation] || '10_000_000_000_000'; // 10 TGas default
  }

  // Analytics and insights
  async getUserAnalytics(accountId?: string): Promise<any> {
    const targetAccount = accountId || this.walletService.getAccountId();
    const assets = await this.getUserAssets(targetAccount);
    
    const analytics = {
      totalAssets: assets.length,
      assetsByType: {} as Record<string, number>,
      emotionalEvolution: [] as any[],
      interactionFrequency: 0,
      gasUsage: {
        total: '0',
        byOperation: {} as Record<string, string>
      }
    };

    // Calculate analytics
    assets.forEach(asset => {
      // Count by type
      analytics.assetsByType[asset.type] = (analytics.assetsByType[asset.type] || 0) + 1;
      
      // Track emotional states
      analytics.emotionalEvolution.push({
        timestamp: asset.timestamp,
        emotion: asset.emotionalState?.primaryEmotion || 'unknown',
        valence: asset.emotionalState?.valence || 0
      });
      
      // Sum gas usage
      if (asset.gasUsed) {
        // Simple string addition for gas
        analytics.gasUsage.total = String(Number(analytics.gasUsage.total) + Number(asset.gasUsed));
      }
    });

    return analytics;
  }
}

export default NEARCreativeEngineService;