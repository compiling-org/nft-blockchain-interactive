/**
 * Audio-Reactive NFT Visualizer Component
 * Renders NFTs with audio-reactive visual effects using WebGPU WGSL shaders
 * Integrates with the AudioAnalyzerService for real-time audio analysis
 */

import React, { useEffect, useRef, useState, useCallback } from 'react';
import { AudioAnalyzerService, AudioBandData, BiometricAudioData } from '../services/audioAnalyzerService';

interface AudioReactiveNFTVisualizerProps {
  nftId: string;
  nftImageUrl?: string;
  width?: number;
  height?: number;
  onBiometricData?: (data: BiometricAudioData) => void;
  onAudioData?: (bands: AudioBandData) => void;
  autoStart?: boolean;
}

// Extended WGSL shader with full audio reactivity
const audioReactiveShaderWGSL = `
struct Uniforms {
  time: f32,
  resolution: vec2<f32>,
  // Audio bands
  bass: f32,
  low_mid: f32,
  mid: f32,
  high_mid: f32,
  treble: f32,
  overall: f32,
  // Biometric data
  heart_rate: f32,
  breathing_rate: f32,
  stress_level: f32,
  attention_level: f32,
  // Emotion
  valence: f32,
  arousal: f32,
  dominance: f32,
  // EEG bands
  eeg_delta: f32,
  eeg_theta: f32,
  eeg_alpha: f32,
  eeg_beta: f32,
  eeg_gamma: f32,
};

@group(0) @binding(0) var<uniform> uniforms: Uniforms;

// Palette function from Phosphor
fn palette(t: f32, a: vec3<f32>, b: vec3<f32>, c: vec3<f32>, d: vec3<f32>) -> vec3<f32> {
    return a + b * cos(6.28318 * (c * t + d));
}

// Audio-reactive palette
fn audio_palette(t: f32) -> vec3<f32> {
    let a = vec3<f32>(0.5, 0.5, 0.5);
    let b = vec3<f32>(0.5, 0.5, 0.5);
    let c = vec3<f32>(1.0, 1.0, 1.0);
    // Audio-reactive color shift
    let d = vec3<f32>(
        0.263 + uniforms.bass * 0.2,
        0.416 + uniforms.mid * 0.2,
        0.557 + uniforms.treble * 0.2
    );
    return a + b * cos(6.28318 * (c * t + d));
}

// Rotation matrix
fn rotate2d(p: vec2<f32>, a: f32) -> vec2<f32> {
    let s = sin(a);
    let c = cos(a);
    return vec2<f32>(p.x * c - p.y * s, p.x * s + p.y * c);
}

// Simplex noise placeholder
fn hash(p: vec2<f32>) -> f32 {
    return fract(sin(dot(p, vec2<f32>(127.1, 311.7))) * 43758.5453123);
}

fn noise(p: vec2<f32>) -> f32 {
    let i = floor(p);
    let f = fract(p);
    let u = f * f * (3.0 - 2.0 * f);
    return mix(
        mix(hash(i + vec2<f32>(0.0, 0.0)), hash(i + vec2<f32>(1.0, 0.0)), u.x),
        mix(hash(i + vec2<f32>(0.0, 1.0)), hash(i + vec2<f32>(1.0, 1.0)), u.x),
        u.y
    );
}

@vertex
fn vs_main(@builtin(vertex_index) vertexIndex: u32) -> @builtin(position) vec4<f32> {
    var positions = array<vec2<f32>, 6>(
        vec2<f32>(-1.0, -1.0),
        vec2<f32>( 1.0, -1.0),
        vec2<f32>(-1.0,  1.0),
        vec2<f32>(-1.0,  1.0),
        vec2<f32>( 1.0, -1.0),
        vec2<f32>( 1.0,  1.0)
    );
    return vec4<f32>(positions[vertexIndex], 0.0, 1.0);
}

@fragment
fn fs_main(@builtin(position) fragCoord: vec4<f32>) -> @location(0) vec4<f32> {
    let uv_orig = (fragCoord.xy * 2.0 - uniforms.resolution) / min(uniforms.resolution.x, uniforms.resolution.y);
    var uv = uv_orig;
    
    // Audio-reactive time scaling
    let audio_time = uniforms.time * (0.5 + uniforms.overall * 2.0);
    
    // Heart rate affects pulse frequency
    let pulse_rate = uniforms.heart_rate / 60.0;
    let pulse = sin(audio_time * pulse_rate * 6.28318) * 0.5 + 0.5;
    
    // Breathing affects slow oscillation
    let breathe = sin(audio_time * uniforms.breathing_rate / 30.0 * 6.28318) * 0.3;
    
    // Stress affects chaos/intensity
    let chaos = uniforms.stress_level / 100.0;
    
    // Attention affects detail level
    let detail = 1.0 + uniforms.attention_level / 50.0;
    
    // Rotation based on emotion
    let emotion_rotation = uniforms.valence * 3.14159 + uniforms.arousal * 1.5708;
    uv = rotate2d(uv, emotion_rotation + audio_time * 0.1);
    
    // Audio-reactive zoom
    let zoom = 1.5 - uniforms.bass * 0.3 + pulse * 0.2;
    uv = uv / zoom;
    
    // Create multiple fractal layers based on frequency bands
    var finalColor = vec3<f32>(0.0);
    
    // Bass-driven large structures
    let bass_dist = length(uv);
    let bass_pattern = sin(bass_dist * 8.0 - audio_time * 2.0 + uniforms.bass * 10.0);
    
    // Mid-driven medium details
    var mid_uv = fract(uv * detail + vec2<f32>(audio_time * 0.1));
    let mid_pattern = length(mid_uv - 0.5);
    
    // Treble-driven fine details
    let treble_noise = noise(uv * 20.0 + audio_time);
    
    // EEG band influences
    let eeg_influence = uniforms.eeg_delta * 0.3 + uniforms.eeg_theta * 0.2 + 
                        uniforms.eeg_alpha * 0.2 + uniforms.eeg_beta * 0.15 + 
                        uniforms.eeg_gamma * 0.15;
    
    // Combine patterns with emotion-weighted colors
    let base_palette_t = length(uv_orig) + audio_time * 0.1 + bass_pattern * 0.2;
    var color = audio_palette(base_palette_t);
    
    // Apply emotional coloring
    color = mix(color, color * vec3<f32>(
        1.0 + uniforms.valence * 0.5,
        1.0 - abs(uniforms.valence) * 0.3,
        1.0 - uniforms.valence * 0.5
    ), 0.5);
    
    // Apply arousal intensity
    color = color * (0.8 + uniforms.arousal * 0.8);
    
    // Apply dominance contrast
    color = pow(color, vec3<f32>(1.0 - uniforms.dominance * 0.3));
    
    // Add stress-induced chaos
    if (chaos > 0.3) {
        let chaos_color = audio_palette(base_palette_t * 2.0 + treble_noise);
        color = mix(color, chaos_color, (chaos - 0.3) * 0.5);
    }
    
    // Breathing modulation
    color = color * (0.9 + breathe * 0.2);
    
    // Pulse effect
    color = color * (0.8 + pulse * 0.4);
    
    // EEG influence on glow
    color = color * (1.0 + eeg_influence * 0.5);
    
    // Vignette
    let vignette = 1.0 - length(uv_orig) * 0.5;
    color = color * vignette;
    
    // Add subtle scanlines for digital feel
    let scanline = sin(fragCoord.y * 2.0) * 0.02 + 1.0;
    color = color * scanline;
    
    return vec4<f32>(color, 1.0);
}
`;

export const AudioReactiveNFTVisualizer: React.FC<AudioReactiveNFTVisualizerProps> = ({
  nftId,
  nftImageUrl,
  width = 800,
  height = 600,
  onBiometricData,
  onAudioData,
  autoStart = false
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const audioAnalyzerRef = useRef<AudioAnalyzerService | null>(null);
  
  const [isInitialized, setIsInitialized] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [error, setError] = useState<string>('');
  const [audioBands, setAudioBands] = useState<AudioBandData>({
    bass: 0, lowMid: 0, mid: 0, highMid: 0, treble: 0, overall: 0
  });
  const [biometricData, setBiometricData] = useState<BiometricAudioData | null>(null);

  // Initialize audio analyzer
  useEffect(() => {
    const initAnalyzer = async () => {
      audioAnalyzerRef.current = new AudioAnalyzerService();
      const success = await audioAnalyzerRef.current.initialize();
      
      if (success) {
        setIsInitialized(true);
        
        // Subscribe to audio data
        audioAnalyzerRef.current.subscribe((result) => {
          setAudioBands(result.bands);
          setBiometricData(result.biometricData);
          
          if (onAudioData) {
            onAudioData(result.bands);
          }
          if (onBiometricData) {
            onBiometricData(result.biometricData);
          }
        });
        
        if (autoStart) {
          audioAnalyzerRef.current.start();
          setIsRecording(true);
        }
      } else {
        setError('Failed to initialize audio analyzer');
      }
    };
    
    initAnalyzer();
    
    return () => {
      if (audioAnalyzerRef.current) {
        audioAnalyzerRef.current.dispose();
      }
    };
  }, [autoStart, onAudioData, onBiometricData]);

  // WebGPU rendering
  useEffect(() => {
    if (!isInitialized || !canvasRef.current) return;
    
    let animationFrameId: number;
    let device: any = null;
    let context: any = null;
    let pipeline: any = null;
    let uniformBuffer: any = null;
    let bindGroup: any = null;
    const startTime = performance.now();

    const initWebGPU = async () => {
      try {
        if (!('gpu' in navigator)) {
          // Fallback to WebGL
          initWebGL();
          return;
        }
        
        const gpu = (navigator as any).gpu;
        const adapter = await gpu.requestAdapter();
        if (!adapter) {
          initWebGL();
          return;
        }
        
        device = await adapter.requestDevice();
        const canvas = canvasRef.current!;
        context = canvas.getContext('webgpu');
        
        if (!device || !context) {
          initWebGL();
          return;
        }
        
        const format = gpu.getPreferredCanvasFormat();
        context.configure({ device, format, alphaMode: 'premultiplied' });
        
        // Create shader module
        const shaderModule = device.createShaderModule({
          code: audioReactiveShaderWGSL
        });
        
        // Create pipeline
        pipeline = device.createRenderPipeline({
          layout: 'auto',
          vertex: { module: shaderModule, entryPoint: 'vs_main' },
          fragment: { 
            module: shaderModule, 
            entryPoint: 'fs_main', 
            targets: [{ format }] 
          },
          primitive: { topology: 'triangle-list' }
        });
        
        // Create uniform buffer (24 floats = 96 bytes)
        uniformBuffer = device.createBuffer({
          size: 96,
          usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST
        });
        
        // Create bind group
        bindGroup = device.createBindGroup({
          layout: pipeline.getBindGroupLayout(0),
          entries: [{ binding: 0, resource: { buffer: uniformBuffer } }]
        });
        
        // Start render loop
        renderFrame();
      } catch (e) {
        console.error('WebGPU init failed, falling back to WebGL:', e);
        initWebGL();
      }
    };

    // WebGL fallback
    const initWebGL = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      
      const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
      if (!gl) {
        setError('WebGL not supported');
        return;
      }
      
      // Use the RealAudioReactiveFractalRenderer for WebGL fallback
      // For now, just show a simple placeholder
      setError('Using WebGL fallback - limited audio reactivity');
    };

    const renderFrame = () => {
      if (!device || !context || !pipeline || !uniformBuffer || !bindGroup) return;
      
      const now = performance.now();
      const time = (now - startTime) / 1000;
      
      // Pack uniforms
      const uniforms = new Float32Array(24);
      uniforms[0] = time;
      uniforms[1] = width;
      uniforms[2] = height;
      // Audio bands
      uniforms[3] = audioBands.bass;
      uniforms[4] = audioBands.lowMid;
      uniforms[5] = audioBands.mid;
      uniforms[6] = audioBands.highMid;
      uniforms[7] = audioBands.treble;
      uniforms[8] = audioBands.overall;
      // Biometric data
      uniforms[9] = biometricData?.heartRate || 70;
      uniforms[10] = biometricData?.breathingRate || 14;
      uniforms[11] = biometricData?.stressLevel || 0;
      uniforms[12] = biometricData?.attentionLevel || 50;
      // Emotion
      uniforms[13] = biometricData?.emotion.valence || 0;
      uniforms[14] = biometricData?.emotion.arousal || 0.5;
      uniforms[15] = biometricData?.emotion.dominance || 0.5;
      // EEG bands
      uniforms[16] = biometricData?.eegBands.delta || 0;
      uniforms[17] = biometricData?.eegBands.theta || 0;
      uniforms[18] = biometricData?.eegBands.alpha || 0;
      uniforms[19] = biometricData?.eegBands.beta || 0;
      uniforms[20] = biometricData?.eegBands.gamma || 0;
      
      device.queue.writeBuffer(uniformBuffer, 0, uniforms);
      
      const encoder = device.createCommandEncoder();
      const textureView = context.getCurrentTexture().createView();
      
      const renderPass = encoder.beginRenderPass({
        colorAttachments: [{
          view: textureView,
          clearValue: { r: 0, g: 0, b: 0, a: 1 },
          loadOp: 'clear',
          storeOp: 'store'
        }]
      });
      
      renderPass.setPipeline(pipeline);
      renderPass.setBindGroup(0, bindGroup);
      renderPass.draw(6, 1, 0, 0);
      renderPass.end();
      
      device.queue.submit([encoder.finish()]);
      
      animationFrameId = requestAnimationFrame(renderFrame);
    };

    initWebGPU();

    return () => {
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
      if (device) {
        device.destroy();
      }
    };
  }, [isInitialized, width, height]);

  // Toggle audio recording
  const toggleRecording = useCallback(() => {
    if (!audioAnalyzerRef.current) return;
    
    if (isRecording) {
      audioAnalyzerRef.current.stop();
      setIsRecording(false);
    } else {
      audioAnalyzerRef.current.start();
      setIsRecording(true);
    }
  }, [isRecording]);

  return (
    <div className="audio-reactive-nft-visualizer">
      <div className="relative">
        <canvas 
          ref={canvasRef} 
          width={width} 
          height={height}
          className="rounded-lg bg-black"
        />
        
        {/* Overlay controls */}
        <div className="absolute top-4 right-4 flex flex-col gap-2">
          <button
            onClick={toggleRecording}
            disabled={!isInitialized}
            className={`px-4 py-2 rounded-lg font-semibold ${
              isRecording 
                ? 'bg-red-500 hover:bg-red-600' 
                : 'bg-green-500 hover:bg-green-600'
            } text-white transition-colors`}
          >
            {isRecording ? '🛑 Stop Audio' : '🎤 Start Audio'}
          </button>
        </div>
        
        {/* NFT Info Overlay */}
        {nftImageUrl && (
          <div className="absolute bottom-4 left-4 bg-black/70 rounded-lg p-3">
            <p className="text-white text-sm">NFT: {nftId}</p>
          </div>
        )}
        
        {/* Audio visualization bars */}
        {isRecording && (
          <div className="absolute bottom-4 right-4 flex gap-1">
            {['bass', 'lowMid', 'mid', 'highMid', 'treble'].map((band) => (
              <div
                key={band}
                className="w-3 bg-gradient-to-t from-purple-500 to-cyan-500 rounded-sm"
                style={{ 
                  height: `${Math.max(4, (audioBands as any)[band] * 60)}px`,
                  transition: 'height 0.05s ease-out'
                }}
              />
            ))}
          </div>
        )}
      </div>
      
      {/* Error display */}
      {error && (
        <div className="mt-2 text-yellow-400 text-sm">
          ⚠️ {error}
        </div>
      )}
      
      {/* Status */}
      <div className="mt-2 flex items-center gap-2 text-sm text-gray-400">
        <span className={`w-2 h-2 rounded-full ${isRecording ? 'bg-green-500' : 'bg-gray-500'}`} />
        <span>{isInitialized ? (isRecording ? 'Recording & Analyzing' : 'Ready') : 'Initializing...'}</span>
      </div>
    </div>
  );
};

export default AudioReactiveNFTVisualizer;
