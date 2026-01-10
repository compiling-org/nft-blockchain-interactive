export declare class RealEmotionDetector {
  constructor();
  
  initialize(): Promise<void>;
  
  detectEmotions(video: HTMLVideoElement): Promise<{
    primaryEmotion: string;
    emotionVector: number[];
    valence: number;
    arousal: number;
    dominance: number;
    confidence: number;
  }>;
  
  getBiometricHash(emotionData: any): Promise<string>;
}