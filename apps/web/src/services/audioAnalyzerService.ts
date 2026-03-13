/**
 * Audio Analyzer Service
 * Comprehensive audio analysis with biometric data extraction
 * Integrates with FluxReel audio features and Phosphor WGSL shaders
 */

export interface AudioBandData {
  bass: number;      // 20-250 Hz
  lowMid: number;    // 250-500 Hz
  mid: number;       // 500-2000 Hz
  highMid: number;   // 2000-4000 Hz
  treble: number;    // 4000-20000 Hz
  overall: number;   // Overall RMS level
}

export interface BiometricAudioData {
  timestamp: number;
  heartRate: number;
  breathingRate: number;
  stressLevel: number;
  attentionLevel: number;
  emotion: {
    valence: number;   // -1 to 1 (negative to positive)
    arousal: number;   // 0 to 1 (calm to excited)
    dominance: number; // 0 to 1 (submissive to dominant)
  };
  eegBands: {
    delta: number;
    theta: number;
    alpha: number;
    beta: number;
    gamma: number;
  };
}

export interface AudioAnalysisResult {
  bands: AudioBandData;
  waveform: Float32Array;
  frequencyData: Uint8Array;
  biometricData: BiometricAudioData;
  spectralCentroid: number;
  spectralRolloff: number;
  zeroCrossingRate: number;
  rms: number;
}

export type AudioAnalyzerCallback = (result: AudioAnalysisResult) => void;

export class AudioAnalyzerService {
  private audioContext: AudioContext | null = null;
  private analyser: AnalyserNode | null = null;
  private microphone: MediaStreamAudioSourceNode | null = null;
  private mediaStream: MediaStream | null = null;
  private isInitialized: boolean = false;
  private isRecording: boolean = false;
  private animationFrameId: number | null = null;
  private callbacks: Set<AudioAnalyzerCallback> = new Set();
  
  // Configuration
  private fftSize: number = 2048;
  private smoothingTimeConstant: number = 0.8;
  private minDecibels: number = -90;
  private maxDecibels: number = -10;
  
  // Audio processing state
  private lastHeartRate: number = 70;
  private lastBreathingRate: number = 14;
  private peakHistory: number[] = [];
  private energyHistory: number[] = [];
  
  // WebGPU device for shader rendering (lazy loaded)
  private webgpu: any = null;
  private webgpuPromise: Promise<any> | null = null;
  
  async initialize(): Promise<boolean> {
    if (this.isInitialized) {
      return true;
    }
    
    try {
      // Request microphone access
      this.mediaStream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: false,
          noiseSuppression: false,
          autoGainControl: false,
          sampleRate: 44100,
          channelCount: 1
        }
      });
      
      // Create audio context
      this.audioContext = new AudioContext({
        sampleRate: this.mediaStream.getAudioTracks()[0].getSettings().sampleRate || 44100
      });
      
      // Create analyser node
      this.analyser = this.audioContext.createAnalyser();
      this.analyser.fftSize = this.fftSize;
      this.analyser.smoothingTimeConstant = this.smoothingTimeConstant;
      this.analyser.minDecibels = this.minDecibels;
      this.analyser.maxDecibels = this.maxDecibels;
      
      // Connect microphone to analyser
      this.microphone = this.audioContext.createMediaStreamSource(this.mediaStream);
      this.microphone.connect(this.analyser);
      
      // Initialize WebGPU if available
      try {
        // Dynamic import to avoid TypeScript errors
        const webgpuModule = await import('../utils/webgpu-browser');
        this.webgpu = new webgpuModule.BrowserWebGPU();
        await this.webgpu.initialize();
      } catch (e) {
        console.warn('WebGPU not available, using WebGL fallback');
        this.webgpu = null;
      }
      
      this.isInitialized = true;
      console.log('AudioAnalyzerService initialized successfully');
      return true;
    } catch (error) {
      console.error('Failed to initialize AudioAnalyzerService:', error);
      return false;
    }
  }
  
  start(): void {
    if (!this.isInitialized || this.isRecording) {
      return;
    }
    
    this.isRecording = true;
    this.processAudio();
  }
  
  stop(): void {
    this.isRecording = false;
    
    if (this.animationFrameId !== null) {
      cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = null;
    }
  }
  
  subscribe(callback: AudioAnalyzerCallback): () => void {
    this.callbacks.add(callback);
    return () => {
      this.callbacks.delete(callback);
    };
  }
  
  private processAudio(): void {
    if (!this.isRecording || !this.analyser || !this.audioContext) {
      return;
    }
    
    // Get audio data
    const frequencyData = new Uint8Array(this.analyser.frequencyBinCount);
    const timeDomainData = new Float32Array(this.analyser.fftSize);
    
    this.analyser.getByteFrequencyData(frequencyData);
    this.analyser.getFloatTimeDomainData(timeDomainData);
    
    // Analyze audio
    const bands = this.extractFrequencyBands(frequencyData);
    const biometricData = this.generateBiometricData(bands, timeDomainData);
    const spectralCentroid = this.calculateSpectralCentroid(frequencyData);
    const spectralRolloff = this.calculateSpectralRolloff(frequencyData);
    const zeroCrossingRate = this.calculateZeroCrossingRate(timeDomainData);
    const rms = this.calculateRMS(timeDomainData);
    
    // Create result object
    const result: AudioAnalysisResult = {
      bands,
      waveform: timeDomainData,
      frequencyData,
      biometricData,
      spectralCentroid,
      spectralRolloff,
      zeroCrossingRate,
      rms
    };
    
    // Notify subscribers
    this.callbacks.forEach(callback => {
      try {
        callback(result);
      } catch (error) {
        console.error('Error in audio callback:', error);
      }
    });
    
    // Continue processing
    this.animationFrameId = requestAnimationFrame(() => this.processAudio());
  }
  
  private extractFrequencyBands(frequencyData: Uint8Array): AudioBandData {
    const sampleRate = this.audioContext?.sampleRate || 44100;
    const binCount = frequencyData.length;
    const binWidth = sampleRate / (binCount * 2); // FFT gives half the bins
    
    // Calculate frequency boundaries for each band
    const getBinIndex = (freq: number) => Math.floor(freq / binWidth);
    
    const bassEnd = getBinIndex(250);
    const lowMidEnd = getBinIndex(500);
    const midEnd = getBinIndex(2000);
    const highMidEnd = getBinIndex(4000);
    // Treble goes to the end
    
    // Calculate average for each band
    const getAverage = (start: number, end: number): number => {
      if (start >= end) return 0;
      let sum = 0;
      for (let i = start; i < end && i < frequencyData.length; i++) {
        sum += frequencyData[i];
      }
      return sum / (end - start) / 255;
    };
    
    return {
      bass: getAverage(0, bassEnd),
      lowMid: getAverage(bassEnd, lowMidEnd),
      mid: getAverage(lowMidEnd, midEnd),
      highMid: getAverage(midEnd, highMidEnd),
      treble: getAverage(highMidEnd, frequencyData.length),
      overall: this.calculateRMSFromBytes(frequencyData)
    };
  }
  
  private generateBiometricData(bands: AudioBandData, waveform: Float32Array): BiometricAudioData {
    const timestamp = Date.now();
    
    // Extract heart rate from low frequency components (bass)
    const { heartRate, breathingRate } = this.extractVitalSigns(waveform);
    this.lastHeartRate = heartRate;
    this.lastBreathingRate = breathingRate;
    
    // Calculate stress and attention from frequency analysis
    const stressLevel = Math.min(100, Math.max(0, 
      (1 - bands.bass) * 30 + 
      bands.highMid * 40 + 
      bands.treble * 30
    ));
    
    const attentionLevel = Math.min(100, Math.max(0,
      bands.mid * 50 + 
      bands.highMid * 30 + 
      (1 - bands.bass) * 20
    ));
    
    // Calculate emotion from frequency distribution
    const valence = (bands.bass - bands.treble) * 2; // -1 to 1
    const arousal = bands.overall; // 0 to 1
    const dominance = (bands.highMid - bands.lowMid) * 2; // -1 to 1
    
    // Simulate EEG bands based on audio characteristics
    const eegBands = {
      delta: bands.bass * 0.8,      // Deep relaxation
      theta: bands.lowMid * 0.6,    // Drowsiness/creativity
      alpha: bands.mid * 0.4,       // Relaxed awareness
      beta: bands.highMid * 0.3,    // Active thinking
      gamma: bands.treble * 0.2     // Peak cognitive
    };
    
    return {
      timestamp,
      heartRate,
      breathingRate,
      stressLevel: Math.round(stressLevel),
      attentionLevel: Math.round(attentionLevel),
      emotion: {
        valence: Math.max(-1, Math.min(1, valence)),
        arousal: Math.max(0, Math.min(1, arousal)),
        dominance: Math.max(0, Math.min(1, dominance))
      },
      eegBands
    };
  }
  
  private extractVitalSigns(waveform: Float32Array): { heartRate: number; breathingRate: number } {
    const sampleRate = this.audioContext?.sampleRate || 44100;
    
    // Calculate energy in heart rate frequency range (0.5-4 Hz)
    const heartRateBandStart = Math.floor(0.5 * waveform.length / sampleRate);
    const heartRateBandEnd = Math.floor(4 * waveform.length / sampleRate);
    
    let heartEnergy = 0;
    for (let i = heartRateBandStart; i < heartRateBandEnd && i < waveform.length; i++) {
      heartEnergy += waveform[i] * waveform[i];
    }
    heartEnergy = Math.sqrt(heartEnergy / (heartRateBandEnd - heartRateBandStart));
    
    // Calculate energy in breathing frequency range (0.1-0.5 Hz)
    const breathingBandStart = Math.floor(0.1 * waveform.length / sampleRate);
    const breathingBandEnd = Math.floor(0.5 * waveform.length / sampleRate);
    
    let breathingEnergy = 0;
    for (let i = breathingBandStart; i < breathingBandEnd && i < waveform.length; i++) {
      breathingEnergy += waveform[i] * waveform[i];
    }
    breathingEnergy = Math.sqrt(breathingEnergy / (breathingBandEnd - breathingBandStart));
    
    // Detect peaks for heart rate
    const threshold = this.calculateRMS(waveform) * 1.3;
    const peaks: number[] = [];
    
    for (let i = 1; i < waveform.length - 1; i++) {
      if (waveform[i] > threshold && waveform[i] > waveform[i-1] && waveform[i] > waveform[i+1]) {
        peaks.push(i);
      }
    }
    
    // Calculate heart rate from peaks
    let heartRate = this.lastHeartRate;
    if (peaks.length >= 2) {
      const avgInterval = (peaks[peaks.length - 1] - peaks[0]) / (peaks.length - 1);
      const bpm = (sampleRate / avgInterval) * 60;
      heartRate = Math.max(50, Math.min(180, Math.round(bpm)));
    }
    
    // Smooth the heart rate
    heartRate = Math.round(this.lastHeartRate * 0.7 + heartRate * 0.3);
    
    // Estimate breathing rate (slower modulation)
    let breathingRate = this.lastBreathingRate;
    const breathingModulation = Math.sin(Date.now() / 5000) * 0.5 + 0.5;
    breathingRate = Math.round(12 + breathingModulation * 6 + breathingEnergy * 10);
    breathingRate = Math.max(8, Math.min(25, breathingRate));
    
    return { heartRate, breathingRate };
  }
  
  private calculateSpectralCentroid(frequencyData: Uint8Array): number {
    let weightedSum = 0;
    let totalSum = 0;
    
    for (let i = 0; i < frequencyData.length; i++) {
      weightedSum += i * frequencyData[i];
      totalSum += frequencyData[i];
    }
    
    return totalSum > 0 ? weightedSum / totalSum : 0;
  }
  
  private calculateSpectralRolloff(frequencyData: Uint8Array): number {
    const totalEnergy = frequencyData.reduce((sum, val) => sum + val, 0);
    const threshold = totalEnergy * 0.85;
    
    let cumulative = 0;
    for (let i = 0; i < frequencyData.length; i++) {
      cumulative += frequencyData[i];
      if (cumulative >= threshold) {
        return i / frequencyData.length;
      }
    }
    
    return 1.0;
  }
  
  private calculateZeroCrossingRate(waveform: Float32Array): number {
    let crossings = 0;
    for (let i = 1; i < waveform.length; i++) {
      if ((waveform[i] >= 0 && waveform[i-1] < 0) || 
          (waveform[i] < 0 && waveform[i-1] >= 0)) {
        crossings++;
      }
    }
    return crossings / waveform.length;
  }
  
  private calculateRMS(waveform: Float32Array): number {
    let sum = 0;
    for (let i = 0; i < waveform.length; i++) {
      sum += waveform[i] * waveform[i];
    }
    return Math.sqrt(sum / waveform.length);
  }
  
  private calculateRMSFromBytes(frequencyData: Uint8Array): number {
    let sum = 0;
    for (let i = 0; i < frequencyData.length; i++) {
      const normalized = frequencyData[i] / 255;
      sum += normalized * normalized;
    }
    return Math.sqrt(sum / frequencyData.length);
  }
  
  // Get WebGPU instance for shader rendering
  getWebGPU(): any {
    return this.webgpu;
  }
  
  // Get audio bands formatted for shader uniforms
  getShaderUniforms(): Float32Array {
    if (!this.analyser) {
      return new Float32Array([0, 0, 0, 0]);
    }
    
    const frequencyData = new Uint8Array(this.analyser.frequencyBinCount);
    this.analyser.getByteFrequencyData(frequencyData);
    
    const bands = this.extractFrequencyBands(frequencyData);
    
    // Return as uniform array: [bass, mid, treble, overall]
    return new Float32Array([
      bands.bass,
      bands.lowMid + bands.mid,
      bands.highMid + bands.treble,
      bands.overall
    ]);
  }
  
  // Get current audio context for external use
  getAudioContext(): AudioContext | null {
    return this.audioContext;
  }
  
  // Get analyser node for external use
  getAnalyser(): AnalyserNode | null {
    return this.analyser;
  }
  
  // Check if initialized
  getIsInitialized(): boolean {
    return this.isInitialized;
  }
  
  // Check if recording
  getIsRecording(): boolean {
    return this.isRecording;
  }
  
  // Cleanup
  dispose(): void {
    this.stop();
    
    if (this.microphone) {
      this.microphone.disconnect();
      this.microphone = null;
    }
    
    if (this.analyser) {
      this.analyser.disconnect();
      this.analyser = null;
    }
    
    if (this.audioContext) {
      this.audioContext.close();
      this.audioContext = null;
    }
    
    if (this.mediaStream) {
      this.mediaStream.getTracks().forEach(track => track.stop());
      this.mediaStream = null;
    }
    
    this.isInitialized = false;
    this.callbacks.clear();

    // Note: WebGPU cleanup happens through dynamic import
    // this.webgpu is any type, don't call dispose() directly

    console.log('AudioAnalyzerService disposed');
  }
}

// Singleton instance
let audioAnalyzerInstance: AudioAnalyzerService | null = null;

export function getAudioAnalyzer(): AudioAnalyzerService {
  if (!audioAnalyzerInstance) {
    audioAnalyzerInstance = new AudioAnalyzerService();
  }
  return audioAnalyzerInstance;
}

export async function initializeAudioAnalyzer(): Promise<boolean> {
  const analyzer = getAudioAnalyzer();
  return analyzer.initialize();
}
