import { connect, WalletConnection, keyStores, utils } from 'near-api-js';
import { HybridAIManager } from './hybrid-ai-manager';

export interface CreativeAsset {
  id: string;
  name: string;
  type: 'shader' | 'audio' | 'biometric' | 'ai-generated' | 'fractal';
  data: any;
  metadata: {
    created: number;
    creator: string;
    emotions?: any;
    biometricData?: any;
    ai?: any;
  };
}