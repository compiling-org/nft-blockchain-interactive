// Real Filecoin/IPFS storage integration
// Based on existing reference implementations from blockchain-ai-ml-references

export interface StorageConfig {
  nftStorageApiKey: string;
  web3StorageApiKey?: string;
  pinataApiKey?: string;
  pinataSecret?: string;
}

export interface StoredAsset {
  cid: string;
  url: string;
  metadata: any;
  size: number;
  timestamp: number;
}

export interface BiometricSessionData {
  sessionId: string;
  userId: string;
  timestamp: number;
  biometricData: {
    heartRate: number[];
    breathingRate: number[];
    emotion: {
      valence: number;
      arousal: number;
      dominance: number;
      confidence: number;
    }[];
    eegBands: {
      delta: number;
      theta: number;
      alpha: number;
      beta: number;
      gamma: number;
    }[];
  };
  shaderCode?: string;
  audioReactive?: boolean;
}

export interface ShaderCodeData {
  name: string;
  description: string;
  code: string;
  type: 'wgsl' | 'glsl' | 'hlsl';
  parameters: Record<string, number>;
  audioReactive: boolean;
  biometricDriven: boolean;
}

export class RealFilecoinStorage {
  private config: StorageConfig;
  private initialized = false;

  constructor(config: StorageConfig) {
    this.config = config;
  }

  async initialize(): Promise<void> {
    if (this.initialized) return;

    try {
      // Test API keys
      if (!this.config.nftStorageApiKey) {
        throw new Error('NFT.Storage API key is required');
      }

      // Test connection to NFT.Storage
      const testResponse = await fetch('https://api.nft.storage/', {
        headers: {
          'Authorization': `Bearer ${this.config.nftStorageApiKey}`
        }
      });

      if (!testResponse.ok) {
        throw new Error('Failed to connect to NFT.Storage');
      }

      this.initialized = true;
      console.log('✅ Real Filecoin storage initialized successfully');
    } catch (error) {
      console.error('Failed to initialize Filecoin storage:', error);
      throw error;
    }
  }

  async storeBiometricSession(sessionData: BiometricSessionData): Promise<StoredAsset> {
    if (!this.initialized) await this.initialize();

    try {
      // Create metadata for biometric session
      const metadata = {
        name: `Biometric Session ${sessionData.sessionId}`,
        description: `AI-generated biometric data session for user ${sessionData.userId}`,
        image: null, // No image for biometric data
        properties: {
          type: 'biometric_session',
          timestamp: sessionData.timestamp,
          biometricSignature: this.generateBiometricSignature(sessionData.biometricData),
          aiModelVersion: 'TensorFlow.js v1.0',
          audioReactive: sessionData.audioReactive || false,
          dataHash: this.generateDataHash(sessionData.biometricData)
        }
      };

      // Store as JSON on NFT.Storage (Filecoin)
      const stored = await this.storeToNFTStorage(metadata, sessionData.biometricData);
      
      console.log(`✅ Biometric session stored on Filecoin: ${stored.cid}`);
      return stored;
    } catch (error) {
      console.error('Failed to store biometric session:', error);
      throw error;
    }
  }

  async storeShaderCode(shaderData: ShaderCodeData): Promise<StoredAsset> {
    if (!this.initialized) await this.initialize();

    try {
      // Create metadata for shader code
      const metadata = {
        name: shaderData.name,
        description: shaderData.description,
        image: null, // No preview image
        properties: {
          type: 'shader_code',
          shaderType: shaderData.type,
          parameters: shaderData.parameters,
          audioReactive: shaderData.audioReactive,
          biometricDriven: shaderData.biometricDriven,
          codeHash: this.generateCodeHash(shaderData.code)
        }
      };

      // Store shader code and metadata
      const shaderPackage = {
        metadata,
        code: shaderData.code,
        compiled: false // Mark as source code
      };

      const stored = await this.storeToNFTStorage(metadata, shaderPackage);
      
      console.log(`✅ Shader code stored on Filecoin: ${stored.cid}`);
      return stored;
    } catch (error) {
      console.error('Failed to store shader code:', error);
      throw error;
    }
  }

  async storeAIFractal(fractalData: any, shaderCode: string): Promise<StoredAsset> {
    if (!this.initialized) await this.initialize();

    try {
      // Create metadata for AI-generated fractal
      const metadata = {
        name: `AI Fractal ${Date.now()}`,
        description: 'AI-generated fractal art with biometric data integration',
        image: null, // Fractals are generated in real-time
        properties: {
          type: 'ai_fractal',
          timestamp: Date.now(),
          shaderType: 'wgsl',
          aiModelVersion: 'TensorFlow.js v1.0',
          biometricData: fractalData.biometric,
          shaderHash: this.generateCodeHash(shaderCode),
          fractalParameters: fractalData.parameters || {}
        }
      };

      const fractalPackage = {
        metadata,
        shaderCode,
        fractalData
      };

      const stored = await this.storeToNFTStorage(metadata, fractalPackage);
      
      console.log(`✅ AI fractal stored on Filecoin: ${stored.cid}`);
      return stored;
    } catch (error) {
      console.error('Failed to store AI fractal:', error);
      throw error;
    }
  }

  async storeAIModel(modelData: any, modelName: string): Promise<StoredAsset> {
    if (!this.initialized) await this.initialize();

    try {
      // Create metadata for AI model
      const metadata = {
        name: modelName,
        description: `AI model for biometric analysis and shader generation`,
        image: null,
        properties: {
          type: 'ai_model',
          timestamp: Date.now(),
          modelType: 'TensorFlow.js',
          modelVersion: '1.0',
          modelHash: this.generateDataHash(modelData),
          parameters: modelData.parameters || {},
          trainingData: modelData.trainingInfo || {}
        }
      };

      const stored = await this.storeToNFTStorage(metadata, modelData);
      
      console.log(`✅ AI model stored on Filecoin: ${stored.cid}`);
      return stored;
    } catch (error) {
      console.error('Failed to store AI model:', error);
      throw error;
    }
  }

  async retrieveAsset(cid: string): Promise<any> {
    if (!this.initialized) await this.initialize();

    try {
      // Retrieve from IPFS gateway
      const response = await fetch(`https://ipfs.io/ipfs/${cid}`);
      
      if (!response.ok) {
        throw new Error(`Failed to retrieve asset: ${response.statusText}`);
      }

      const data = await response.json();
      console.log(`✅ Asset retrieved from Filecoin/IPFS: ${cid}`);
      return data;
    } catch (error) {
      console.error('Failed to retrieve asset:', error);
      throw error;
    }
  }

  private async storeToNFTStorage(metadata: any, data: any): Promise<StoredAsset> {
    try {
      // Create a Blob with the data
      const jsonData = JSON.stringify({
        metadata,
        data,
        timestamp: Date.now()
      }, null, 2);

      const blob = new Blob([jsonData], { type: 'application/json' });
      
      // Create FormData for upload
      const formData = new FormData();
      formData.append('file', blob, 'data.json');

      // Upload to NFT.Storage (Filecoin)
      const response = await fetch('https://api.nft.storage/upload', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.config.nftStorageApiKey}`,
          'Accept': 'application/json'
        },
        body: formData
      });

      if (!response.ok) {
        throw new Error(`NFT.Storage upload failed: ${response.statusText}`);
      }

      const result = await response.json();
      
      if (result.ok) {
        return {
          cid: result.value.cid,
          url: `https://ipfs.io/ipfs/${result.value.cid}`,
          metadata,
          size: blob.size,
          timestamp: Date.now()
        };
      } else {
        throw new Error(`NFT.Storage error: ${result.error?.message || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('NFT.Storage upload error:', error);
      throw error;
    }
  }

  private generateBiometricSignature(biometricData: any): string {
    // Generate a simple hash of biometric data
    const dataString = JSON.stringify(biometricData);
    let hash = 0;
    for (let i = 0; i < dataString.length; i++) {
      const char = dataString.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    return Math.abs(hash).toString(16);
  }

  private generateDataHash(data: any): string {
    // Simple hash generation
    const dataString = JSON.stringify(data);
    let hash = 0;
    for (let i = 0; i < dataString.length; i++) {
      const char = dataString.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash;
    }
    return Math.abs(hash).toString(16);
  }

  private generateCodeHash(code: string): string {
    // Hash for shader code
    let hash = 0;
    for (let i = 0; i < code.length; i++) {
      const char = code.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash;
    }
    return Math.abs(hash).toString(16);
  }
}

// Export the singleton instance

export const realFilecoinStorage = new RealFilecoinStorage({
  nftStorageApiKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkaWQ6ZXRocjoweDkzNTE0OTg3QjE0MkI1NEY1MjI5MjdFQ0I0NjhDMzQwN0I0NDY4NjIiLCJpc3MiOiJuZnQtc3RvcmFnZSIsImlhdCI6MTcwMTU3MzQ5MDY4OSwibmFtZSI6IkJpdHRlIEFJIEF1ZGlvLVJlYWN0aXZlIEZyYWN0YWxzIn0.Q-hYV0F7I0Q1yQ5Z3yF5Z3yF5Z3yF5Z3yF5Z3yF5Z3yF5Z3yF5Z3yF5Z3yF5Z3yF5' // Demo key - replace with real one
});