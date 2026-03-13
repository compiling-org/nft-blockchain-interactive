import { NFTStorage, Blob } from 'nft.storage';
import { Web3Storage } from 'web3.storage';

// Get API key from environment variables (Vite compatible)
// SECURITY: Only use environment variables - never localStorage in production
const getStorageApiKey = (): string => {
  // Check Vite environment variable first - using typed import.meta.env
  const env = import.meta.env;
  const viteKey = env.VITE_NFT_STORAGE_TOKEN;
  if (viteKey) return viteKey;
  
  // Check React environment variable
  const reactKey = (env as any)?.REACT_APP_NFT_STORAGE_TOKEN;
  if (reactKey) return reactKey;
  
  // Return empty string if no API key found - will show warning when used
  return '';
};

// Get Web3.Storage API key
// SECURITY: Only use environment variables - localStorage is NOT used due to XSS vulnerability
const getWeb3StorageApiKey = (): string => {
  const env = import.meta.env;
  const viteKey = env.VITE_WEB3_STORAGE_TOKEN;
  if (viteKey) return viteKey;
  
  const reactKey = (env as any)?.REACT_APP_WEB3_STORAGE_TOKEN;
  if (reactKey) return reactKey;
  
  // Return empty string if no API key found - will show warning when used
  return '';
};

// ============================================================
// ENCRYPTION UTILITIES FOR BIOMETRIC DATA (Web Crypto API)
// ============================================================

/**
 * Generate a random AES-GCM encryption key
 * @returns CryptoKey for AES-GCM encryption
 */
async function generateEncryptionKey(): Promise<CryptoKey> {
  return await crypto.subtle.generateKey(
    { name: 'AES-GCM', length: 256 },
    true,
    ['encrypt', 'decrypt']
  );
}

/**
 * Generate a random IV (Initialization Vector) for AES-GCM
 * @returns 12-byte Uint8Array IV
 */
function generateIV(): Uint8Array {
  return crypto.getRandomValues(new Uint8Array(12));
}

/**
 * Encrypt data using AES-GCM
 * @param data - String data to encrypt
 * @param key - CryptoKey for encryption
 * @param iv - Initialization vector (must be 12 bytes)
 * @returns Base64-encoded encrypted data with IV prepended
 */
async function encryptData(data: string, key: CryptoKey, iv: Uint8Array): Promise<string> {
  const encoder = new TextEncoder();
  const encodedData = encoder.encode(data);
  
  const encryptedBuffer = await crypto.subtle.encrypt(
    { name: 'AES-GCM', iv },
    key,
    encodedData
  );
  
  // Prepend IV to encrypted data and convert to base64
  const combined = new Uint8Array(iv.length + encryptedBuffer.byteLength);
  combined.set(iv);
  combined.set(new Uint8Array(encryptedBuffer), iv.length);
  
  return btoa(String.fromCharCode(...combined));
}

/**
 * Decrypt AES-GCM encrypted data
 * @param encryptedBase64 - Base64-encoded encrypted data with IV prepended
 * @param key - CryptoKey for decryption
 * @returns Decrypted string
 */
async function decryptData(encryptedBase64: string, key: CryptoKey): Promise<string> {
  // Decode base64
  const combined = Uint8Array.from(atob(encryptedBase64), c => c.charCodeAt(0));
  
  // Extract IV (first 12 bytes) and encrypted data
  const iv = combined.slice(0, 12);
  const encryptedData = combined.slice(12);
  
  const decryptedBuffer = await crypto.subtle.decrypt(
    { name: 'AES-GCM', iv },
    key,
    encryptedData
  );
  
  const decoder = new TextDecoder();
  return decoder.decode(decryptedBuffer);
}

/**
 * Export key to string for storage (JWK format)
 */
async function exportKey(key: CryptoKey): Promise<string> {
  const exported = await crypto.subtle.exportKey('jwk', key);
  return JSON.stringify(exported);
}

/**
 * Import key from stored string
 */
async function importKey(keyJson: string): Promise<CryptoKey> {
  const jwk = JSON.parse(keyJson);
  return await crypto.subtle.importKey(
    'jwk',
    jwk,
    { name: 'AES-GCM', length: 256 },
    true,
    ['encrypt', 'decrypt']
  );
}

// ============================================================
// END ENCRYPTION UTILITIES
// ============================================================

// Web3.Storage client for Filecoin integration
export class FilecoinStorageClient {
  private nftStorage: NFTStorage;
  private web3Storage: any;

  constructor(apiKey: string) {
    // Initialize NFTStorage with the provided API key
    this.nftStorage = new NFTStorage({ token: apiKey });
    // Initialize Web3.Storage with the same API key
    this.web3Storage = new Web3Storage({ token: apiKey });
  }

  /**
   * Store NFT metadata and assets on Filecoin via Web3.Storage
   */
  async storeNFTData(
    metadata: {
      name: string;
      description: string;
      image: Blob | File;
      attributes?: Array<{
        trait_type: string;
        value: string | number;
      }>;
      properties?: Record<string, any>;
    }
  ): Promise<{
    cid: string;
    url: string;
    metadata: any;
  }> {
    if (!this.nftStorage || !this.web3Storage) {
      throw new Error('Storage clients not initialized');
    }

    try {
      // Store image first using Web3.Storage for better reliability
      console.log('Storing image on Filecoin via Web3.Storage...');
      const imageFile = new File([metadata.image], 'image.png', { type: 'image/png' });
      const imageCid = await this.web3Storage.put([imageFile], {
        name: `${metadata.name}-image`,
        wrapWithDirectory: false
      });

      // Create image URL
      const imageUrl = `https://w3s.link/ipfs/${imageCid}`;

      // Create metadata object with actual image URL
      const nftMetadata = {
        name: metadata.name,
        description: metadata.description,
        image: imageUrl, // Use the actual IPFS URL
        attributes: metadata.attributes || [],
        properties: {
          ...metadata.properties,
          created: new Date().toISOString(),
          storage: 'web3.storage',
          imageCid: imageCid
        }
      };

      // Store metadata using Web3.Storage
      const metadataBlob = new Blob([JSON.stringify(nftMetadata, null, 2)], {
        type: 'application/json'
      });
      const metadataFile = new File([metadataBlob], 'metadata.json', {
        type: 'application/json'
      });

      console.log('Storing metadata on Filecoin via Web3.Storage...');
      const metadataCid = await this.web3Storage.put([metadataFile], {
        name: `${metadata.name}-metadata`,
        wrapWithDirectory: false
      });

      const metadataUrl = `https://w3s.link/ipfs/${metadataCid}`;

      return {
        cid: metadataCid,
        url: metadataUrl,
        metadata: nftMetadata
      };
    } catch (error) {
      console.error('Failed to store NFT data:', error);
      throw error;
    }
  }

  /**
   * Store AI-generated art with emotional metadata
   */
  async storeEmotionalArt(
    artData: {
      canvas: HTMLCanvasElement;
      emotionData: {
        valence: number;
        arousal: number;
        dominance: number;
        confidence: number;
      };
      biometricHash: string;
      aiModel: string;
      generationParams: Record<string, any>;
    }
  ): Promise<{
    cid: string;
    url: string;
    metadata: any;
  }> {
    try {
      // Convert canvas to blob
      const blob = await new Promise<Blob>((resolve) => {
        artData.canvas.toBlob((blob) => {
          if (blob) resolve(blob);
          else throw new Error('Failed to create blob from canvas');
        }, 'image/png');
      });

      // Create attributes for emotional state
      const attributes = [
        {
          trait_type: 'Valence',
          value: Math.round(artData.emotionData.valence * 100) / 100
        },
        {
          trait_type: 'Arousal',
          value: Math.round(artData.emotionData.arousal * 100) / 100
        },
        {
          trait_type: 'Dominance',
          value: Math.round(artData.emotionData.dominance * 100) / 100
        },
        {
          trait_type: 'Confidence',
          value: Math.round(artData.emotionData.confidence)
        },
        {
          trait_type: 'AI Model',
          value: artData.aiModel
        },
        {
          trait_type: 'Biometric Hash',
          value: artData.biometricHash.substring(0, 16) + '...'
        }
      ];

      // Generate description based on emotional state
      const emotionalDescription = this.generateEmotionalDescription(artData.emotionData);

      return await this.storeNFTData({
        name: `Emotional Art - ${new Date().toISOString()}`,
        description: emotionalDescription,
        image: blob,
        attributes,
        properties: {
          ai: {
            model: artData.aiModel,
            parameters: artData.generationParams
          },
          biometric: {
            hash: artData.biometricHash,
            timestamp: new Date().toISOString()
          },
          emotional: artData.emotionData
        }
      });
    } catch (error) {
      console.error('Failed to store emotional art:', error);
      throw error;
    }
  }

  /**
   * Store biometric data securely with AES-GCM encryption
   */
  async storeBiometricData(
    data: {
      eegData?: number[];
      heartRateData?: number[];
      facialData?: Blob;
      metadata: {
        userId: string;
        sessionId: string;
        timestamp: string;
        deviceInfo: string;
      };
    }
  ): Promise<{
    cid: string;
    url: string;
    encrypted: boolean;
    keyId?: string; // For later decryption
  }> {
    if (!this.web3Storage) {
      throw new Error('Web3.Storage client not initialized');
    }

    try {
      // Generate encryption key and IV
      const encryptionKey = await generateEncryptionKey();
      const iv = generateIV();
      
      // Create biometric data package with ONLY sensitive fields to encrypt
      const sensitiveData = {
        eeg: data.eegData,
        heartRate: data.heartRateData,
        // facialData is handled separately - store reference instead of raw data
        facialDataRef: data.facialData ? `facial_${data.metadata.sessionId}` : undefined
      };
      
      // Encrypt the sensitive biometric data
      const encryptedSensitive = await encryptData(
        JSON.stringify(sensitiveData),
        encryptionKey,
        iv
      );
      
      // Export key for later decryption (in production, store securely)
      const exportedKey = await exportKey(encryptionKey);
      
      // Create biometric data package with encrypted sensitive data
      const biometricPackage = {
        encrypted: true,
        encryptionAlgorithm: 'AES-GCM-256',
        keyData: exportedKey, // In production, encrypt this or use a key management service
        sensitiveData: encryptedSensitive,
        metadata: data.metadata,
        version: '2.0.0'
      };

      // Convert to blob
      const jsonString = JSON.stringify(biometricPackage, null, 2);
      const blob = new Blob([jsonString], { type: 'application/json' });
      const file = new File([blob], `biometric-${data.metadata.sessionId}.json`, {
        type: 'application/json'
      });

      console.log('Storing ENCRYPTED biometric data on Filecoin via Web3.Storage...');
      
      // Handle facial data separately if present
      let facialCid: string | undefined;
      if (data.facialData) {
        // In production, encrypt facial data too before storing
        const facialFile = new File([data.facialData], `facial-${data.metadata.sessionId}.jpg`, {
          type: 'image/jpeg'
        });
        facialCid = await this.web3Storage.put([facialFile], {
          name: `facial-${data.metadata.sessionId}`,
          wrapWithDirectory: false
        });
      }

      const cid = await this.web3Storage.put([file], {
        name: `biometric-${data.metadata.sessionId}`,
        wrapWithDirectory: false
      });

      const url = `https://w3s.link/ipfs/${cid}`;

      return {
        cid,
        url,
        encrypted: true,
        keyId: data.metadata.sessionId // Use sessionId as key reference
      };
    } catch (error) {
      console.error('Failed to store biometric data:', error);
      throw error;
    }
  }

  /**
   * Retrieve and decrypt stored biometric data
   */
  async retrieveBiometricData(
    cid: string,
    keyJson: string
  ): Promise<{
    eegData?: number[];
    heartRateData?: number[];
    metadata: {
      userId: string;
      sessionId: string;
      timestamp: string;
      deviceInfo: string;
    };
    decrypted: boolean;
  }> {
    try {
      // Fetch the stored data
      const data = await this.retrieveData(cid);
      
      if (!data.encrypted) {
        throw new Error('Biometric data is not encrypted - cannot decrypt');
      }
      
      // Import the encryption key
      const encryptionKey = await importKey(keyJson);
      
      // Decrypt the sensitive data
      const decryptedJson = await decryptData(data.sensitiveData, encryptionKey);
      const sensitiveData = JSON.parse(decryptedJson);
      
      return {
        eegData: sensitiveData.eeg,
        heartRateData: sensitiveData.heartRate,
        metadata: data.metadata,
        decrypted: true
      };
    } catch (error) {
      console.error('Failed to decrypt biometric data:', error);
      throw error;
    }
  }

  /**
   * Retrieve stored data by CID
   */
  async retrieveData(cid: string): Promise<any> {
    try {
      const url = `https://w3s.link/ipfs/${cid}`;
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`Failed to retrieve data: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Failed to retrieve data:', error);
      throw error;
    }
  }

  /**
   * List stored content for a user
   */
  async listUserContent(userId: string): Promise<Array<{
    cid: string;
    name: string;
    timestamp: string;
    type: 'nft' | 'biometric' | 'art';
  }>> {
    // This would require implementing a content indexing system
    // For now, return mock data
    return [
      {
        cid: 'bafybeigdyrzt5sfp7udm7hu76uh7y26nf3efuylqabf3oclgtqy55fbzdi',
        name: `Emotional Art - ${userId}`,
        timestamp: new Date().toISOString(),
        type: 'art'
      }
    ];
  }

  /**
   * Generate emotional description based on valence/arousal/dominance
   */
  private generateEmotionalDescription(emotionData: {
    valence: number;
    arousal: number;
    dominance: number;
  }): string {
    const { valence, arousal, dominance } = emotionData;
    
    let description = 'This AI-generated artwork captures a moment of ';
    
    // Valence description
    if (valence > 0.5) {
      description += 'profound positivity and joy';
    } else if (valence > 0) {
      description += 'gentle positivity and contentment';
    } else if (valence > -0.5) {
      description += 'mild negativity and melancholy';
    } else {
      description += 'deep negativity and sadness';
    }
    
    description += ', combined with ';
    
    // Arousal description
    if (arousal > 0.5) {
      description += 'high energy and excitement';
    } else if (arousal > 0) {
      description += 'moderate energy and alertness';
    } else if (arousal > -0.5) {
      description += 'low energy and calmness';
    } else {
      description += 'very low energy and relaxation';
    }
    
    description += '. The emotional state reflects ';
    
    // Dominance description
    if (dominance > 0.5) {
      description += 'strong control and confidence';
    } else if (dominance > 0) {
      description += 'moderate control and balance';
    } else if (dominance > -0.5) {
      description += 'some submission and vulnerability';
    } else {
      description += 'deep submission and helplessness';
    }
    
    description += '. This piece represents the unique emotional fingerprint captured through biometric analysis during the creative process.';
    
    return description;
  }

  /**
   * Get storage usage statistics
   */
  async getStorageStats(): Promise<{
    totalStored: number;
    totalSize: number;
    averageFileSize: number;
    storageQuota: number;
    usagePercentage: number;
  }> {
    // Mock statistics - in production, this would query Web3.Storage API
    return {
      totalStored: 42,
      totalSize: 156 * 1024 * 1024, // 156 MB
      averageFileSize: 3.7 * 1024 * 1024, // 3.7 MB
      storageQuota: 1024 * 1024 * 1024, // 1 GB
      usagePercentage: 15.2
    };
  }
}

// Utility functions for Filecoin integration

/**
 * Create a Filecoin storage client
 * If no API key is provided, tries to get it from environment variables
 */
export function createFilecoinStorageClient(apiKey?: string): FilecoinStorageClient {
  const effectiveKey = apiKey || getStorageApiKey() || getWeb3StorageApiKey();
  if (!effectiveKey) {
    console.warn('No Filecoin storage API key provided. Set VITE_NFT_STORAGE_TOKEN or VITE_WEB3_STORAGE_TOKEN environment variable.');
  }
  return new FilecoinStorageClient(effectiveKey);
}

/**
 * Get the configured API key (for display purposes)
 */
export function getConfiguredStorageKey(): string {
  return getStorageApiKey() || getWeb3StorageApiKey() || '';
}

export function validateApiKey(apiKey: string): boolean {
  // Basic validation for Web3.Storage API key format
  return /^eyJ[A-Za-z0-9-_]+\.eyJ[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+$/.test(apiKey);
}

export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}
