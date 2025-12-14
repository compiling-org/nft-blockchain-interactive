export declare class WASMMLBridge {
  constructor();
  
  // Core ML methods
  analyzeEmotion(imageData: ImageData): Promise<{
    predictions: Array<{label: string, confidence: number}>;
    emotionClassification: {
      primary: string;
      secondary: string[];
      confidence: number;
      valence: number;
      arousal: number;
      dominance: number;
    };
  }>;
  
  generateBiometricHash(emotionData: any): Promise<string>;
  
  // LanceDB methods
  queryLanceDB(query: string, limit?: number): Promise<any[]>;
  insertIntoLanceDB(data: any): Promise<void>;
  
  // Vector operations
  storeEmotionVectors(vectors: number[]): Promise<void>;
  searchSimilarEmotions(vector: number[], limit?: number): Promise<any[]>;
  
  // Cross-chain methods
  getCrossChainMetrics(): Promise<any>;
  bridgeEmotionData(data: any, targetChain: string): Promise<any>;
  
  // Additional methods that are being used
  initialize(): Promise<void>;
  cleanup(): Promise<void>;
  
  // IronLearn methods
  processWithIronLearn(data: any): Promise<any>;
  processWithCandle(data: any): Promise<any>;
  
  // Creative AI methods
  classifyCreativeStyle(data: any): Promise<any>;
  generateCreativeContent(params: any): Promise<any>;
  
  // Analysis methods
  analyzeUserPatterns(userId: string): Promise<any>;
  getEmotionBasedRecommendations(emotion: any): Promise<any>;
  analyzeCreativePatterns(data: any): Promise<any>;
}