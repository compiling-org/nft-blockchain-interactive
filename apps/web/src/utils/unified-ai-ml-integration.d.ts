/**
 * Configuration for unified AI/ML pipeline
 */
export const AIMLPipelineConfig: {
  ironLearn: {
    learningRate: number;
    epochs: number;
    useGPU: boolean;
    regularization: number;
    batchSize: number;
  };
  lanceDB: {
    vectorDimension: number;
    indexType: string;
    distanceMetric: string;
    similarityThreshold: number;
  };
  biometric: {
    emotionDimensions: string[];
    signalTypes: string[];
    samplingRate: number;
    frequencyBands: string[];
  };
};

export class WASMMLBridge {
  initialized: boolean;
  initialize(): Promise<void>;
  processWithIronLearn(biometricData: any, modelType?: string): Promise<any>;
  processWithLanceDB(vectorData: any, operation?: string): Promise<any>;
  extractBiometricFeatures(biometricData: any): any[];
}

export class UnifiedAIMLPipeline {
  wasmBridge: WASMMLBridge;
  initialized: boolean;
  initialize(): Promise<void>;
  processBiometricData(biometricData: any, options?: any): Promise<any>;
  searchSimilarBiometricPatterns(queryData: any, options?: any): Promise<any>;
  generateBiometricHash(aiResults: any): string;
  getPipelineStats(): any;
}

export const unifiedAIMLPipeline: UnifiedAIMLPipeline;