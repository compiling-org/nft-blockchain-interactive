import { Wallet } from './near-wallet';

// Real NEAR smart contract integration for soulbound tokens
export interface SoulboundToken {
  token_id: string;
  owner_id: string;
  metadata: {
    title: string;
    description: string;
    media: string;
    media_hash: string;
    issued_at: string;
    expires_at?: string;
    starts_at?: string;
    updated_at?: string;
    extra?: string;
    reference: string;
    reference_hash: string;
  };
  biometric_signature: string;
  shader_cid: string;
  biometric_data_hash: string;
  soulbound: boolean;
  transferable: boolean;
  burnable: boolean;
  created_at: number;
}

export interface BiometricNFTContract {
  nft_tokens_for_owner: (account_id: string) => Promise<SoulboundToken[]>;
  nft_token: (token_id: string) => Promise<SoulboundToken | null>;
  nft_mint: (token_id: string, receiver_id: string, token_metadata: any) => Promise<any>;
  nft_burn: (token_id: string) => Promise<any>;
  nft_transfer: (token_id: string, receiver_id: string, approval_id?: number, memo?: string) => Promise<any>;
  is_soulbound: (token_id: string) => Promise<boolean>;
  get_biometric_signature: (token_id: string) => Promise<string>;
  verify_biometric_binding: (token_id: string, biometric_data: any) => Promise<boolean>;
}

export class RealNearSoulboundContract {
  private wallet: Wallet;
  private contractAddress: string;
  // private contract: BiometricNFTContract; // Available but not used yet

  constructor(wallet: Wallet, contractAddress: string) {
    this.wallet = wallet;
    this.contractAddress = contractAddress;
  }

  async initializeContract() {
    try {
      // Check if contract exists and is accessible
      const contractState = await this.wallet.viewMethod(
        this.contractAddress,
        'nft_total_supply'
      );
      
      console.log('Soulbound contract initialized. Total supply:', contractState);
      return true;
    } catch (error) {
      console.error('Failed to initialize soulbound contract:', error);
      return false;
    }
  }

  async mintSoulboundToken(
    tokenId: string,
    receiverId: string,
    metadata: {
      title: string;
      description: string;
      media: string;
      shader_cid: string;
      biometric_data: any;
      biometric_signature: string;
    }
  ): Promise<string> {
    try {
      // Create comprehensive token metadata
      const tokenMetadata = {
        title: metadata.title,
        description: metadata.description,
        media: metadata.media,
        media_hash: this.generateHash(metadata.media),
        issued_at: Date.now().toString(),
        reference: metadata.shader_cid,
        reference_hash: this.generateHash(metadata.shader_cid),
        extra: JSON.stringify({
          biometric_signature: metadata.biometric_signature,
          biometric_data_hash: this.generateHash(JSON.stringify(metadata.biometric_data)),
          shader_cid: metadata.shader_cid,
          creation_method: 'ai_biometric_synthesis',
          ai_model_version: 'v1.0'
        })
      };

      // Mint the soulbound token
      await this.wallet.callMethod(
        this.contractAddress,
        'nft_mint',
        {
          token_id: tokenId,
          receiver_id: receiverId,
          token_metadata: tokenMetadata
        },
        '300000000000000', // 300 TGas
        '100000000000000000000000' // 0.1 NEAR
      );

      console.log('Soulbound token minted:', tokenId);
      return tokenId;
    } catch (error) {
      console.error('Failed to mint soulbound token:', error);
      throw error;
    }
  }

  async createBiometricSoulboundNFT(
    biometricData: any,
    shaderCode: string,
    filecoinCid: string,
    metadata: {
      title: string;
      description: string;
      prompt?: string;
    }
  ): Promise<SoulboundToken> {
    try {
      // Generate biometric signature
      const biometricSignature = this.generateBiometricSignature(biometricData);
      
      // Generate unique token ID
      const tokenId = `biometric_${Date.now()}_${this.generateHash(biometricSignature).slice(0, 8)}`;
      
      // Get current user account
      const accountId = this.wallet.accountId;
      
      // Create media URL from Filecoin CID
      const mediaUrl = `https://ipfs.io/ipfs/${filecoinCid}`;
      
      // Mint the soulbound token
      await this.mintSoulboundToken(
        tokenId,
        accountId,
        {
          title: metadata.title,
          description: metadata.description,
          media: mediaUrl,
          shader_cid: filecoinCid,
          biometric_data: biometricData,
          biometric_signature: biometricSignature
        }
      );

      // Get the newly created token
      const createdToken = await this.getToken(tokenId);
      
      console.log('Biometric soulbound NFT created:', tokenId);
      return createdToken || ({
        token_id: tokenId,
        owner_id: this.wallet.getAccountId(),
        metadata: {
          title: metadata.title,
          description: metadata.description,
          media: '',
          media_hash: '',
          issued_at: new Date().toISOString(),
          reference: filecoinCid,
          reference_hash: ''
        },
        biometric_signature: biometricSignature
      } as SoulboundToken);
    } catch (error) {
      console.error('Failed to create biometric soulbound NFT:', error);
      throw error;
    }
  }

  async getToken(tokenId: string): Promise<SoulboundToken | null> {
    try {
      const token = await this.wallet.viewMethod(
        this.contractAddress,
        'nft_token',
        { token_id: tokenId }
      );
      
      return token as SoulboundToken;
    } catch (error) {
      console.error('Failed to get token:', error);
      return null;
    }
  }

  async getUserTokens(accountId?: string): Promise<SoulboundToken[]> {
    try {
      const userId = accountId || this.wallet.accountId;
      
      const tokens = await this.wallet.viewMethod(
        this.contractAddress,
        'nft_tokens_for_owner',
        { account_id: userId }
      );
      
      return tokens as SoulboundToken[];
    } catch (error) {
      console.error('Failed to get user tokens:', error);
      return [];
    }
  }

  async verifyBiometricBinding(tokenId: string, biometricData: any): Promise<boolean> {
    try {
      const isValid = await this.wallet.viewMethod(
        this.contractAddress,
        'verify_biometric_binding',
        {
          token_id: tokenId,
          biometric_data: biometricData
        }
      );
      
      return isValid as boolean;
    } catch (error) {
      console.error('Failed to verify biometric binding:', error);
      return false;
    }
  }

  async isSoulbound(tokenId: string): Promise<boolean> {
    try {
      const isSoulbound = await this.wallet.viewMethod(
        this.contractAddress,
        'is_soulbound',
        { token_id: tokenId }
      );
      
      return isSoulbound as boolean;
    } catch (error) {
      console.error('Failed to check if token is soulbound:', error);
      return false;
    }
  }

  async getBiometricSignature(tokenId: string): Promise<string> {
    try {
      const signature = await this.wallet.viewMethod(
        this.contractAddress,
        'get_biometric_signature',
        { token_id: tokenId }
      );
      
      return signature as string;
    } catch (error) {
      console.error('Failed to get biometric signature:', error);
      return '';
    }
  }

  async burnToken(tokenId: string): Promise<boolean> {
    try {
      // Only the owner can burn their soulbound token
      await this.wallet.callMethod(
        this.contractAddress,
        'nft_burn',
        { token_id: tokenId },
        '300000000000000', // 300 TGas
        '1' // 1 yoctoNEAR
      );
      
      console.log('Soulbound token burned:', tokenId);
      return true;
    } catch (error) {
      console.error('Failed to burn token:', error);
      return false;
    }
  }

  // Interactive NFT functions
  async updateTokenMetadata(tokenId: string, newMetadata: any): Promise<boolean> {
    try {
      await this.wallet.callMethod(
        this.contractAddress,
        'update_token_metadata',
        {
          token_id: tokenId,
          metadata: newMetadata
        },
        '300000000000000', // 300 TGas
        '100000000000000000000000' // 0.1 NEAR
      );
      
      console.log('Token metadata updated:', tokenId);
      return true;
    } catch (error) {
      console.error('Failed to update token metadata:', error);
      return false;
    }
  }

  async addTokenInteraction(tokenId: string, interaction: any): Promise<boolean> {
    try {
      await this.wallet.callMethod(
        this.contractAddress,
        'add_token_interaction',
        {
          token_id: tokenId,
          interaction: interaction
        },
        '300000000000000', // 300 TGas
        '10000000000000000000000' // 0.01 NEAR
      );
      
      console.log('Token interaction added:', tokenId);
      return true;
    } catch (error) {
      console.error('Failed to add token interaction:', error);
      return false;
    }
  }

  private generateHash(data: string): string {
    // Simple hash function for generating token IDs and hashes
    let hash = 0;
    for (let i = 0; i < data.length; i++) {
      const char = data.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    return Math.abs(hash).toString(16);
  }

  private generateBiometricSignature(biometricData: any): string {
    // Generate unique biometric signature from data
    const dataString = JSON.stringify(biometricData);
    const timestamp = Date.now().toString();
    return this.generateHash(dataString + timestamp);
  }

  // Contract deployment helper (for testing)
  static async deployContract(wallet: Wallet, contractWasm: Uint8Array): Promise<string> {
    try {
      const result = await wallet.callMethod(
        'testnet', // Deploy to testnet
        'deploy_contract',
        {
          code: Array.from(contractWasm),
          contract_name: 'biometric_soulbound_nft'
        },
        '1000000000000000', // 1000 TGas
        '1000000000000000000000000' // 1 NEAR
      );
      
      console.log('Contract deployed successfully');
      return result.transaction.hash as string;
    } catch (error) {
      console.error('Failed to deploy contract:', error);
      throw error;
    }
  }
}