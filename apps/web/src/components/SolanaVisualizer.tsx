/**
 * Solana Visualizer Component
 * Renders NFT visuals with Solana-specific purple/pink gradient effects
 * Uses AudioReactiveNFTVisualizer as base with faster, more energetic animations
 * Integrates beat detection from FluxReel for BPM-synced visuals
 */

import React, { useEffect, useRef, useState, useCallback } from 'react';
import { AudioAnalyzerService, AudioBandData, BiometricAudioData } from '../services/audioAnalyzerService';
import { detectBeatsEnergy, calculateBPM } from '../../../../libs/fluxreel-shaders/fluxreel-audio';

interface SolanaVisualizerProps {
  width?: number;
  height?: number;
  onBiometricData?: (data: BiometricAudioData) => void;
  onAudioData?: (bands: AudioBandData) => void;
  onBPMChange?: (bpm: number) => void;
  autoStart?: boolean;
}

// Solana-specific shader with purple/pink gradients and faster animations
const solanaShaderWGSL = `
struct Uniforms {
  time: f32,
  resolution: vec2f,
  // Audio bands
  bass: f32,
  low_mid: f32,
  mid: f32,
  high_mid: f32,
  treble: f32,
  overall: f32,
  // Beat detection
  beat: f32,
  beat_intensity: f32,
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
}

@group(0) @binding(0) var<uniform> uniforms: Uniforms;

// Solana color palette
fn solana_palette(t: f32) -> vec3f {
    // Purple to pink gradient - Solana brand colors
    let purple = vec3f(0.545, 0.0, 1.0);    // #8B00FF
    let pink = vec3f(1.0, 0.075, 0.651);    // #FF13A6  
    let cyan = vec3f(0.0, 0.878, 1.0);      // #00E0FF
    let gold = vec3f(0.996, 0.737, 0.0);   // #FEBC00
    
    let phase = fract(t);
    
    if (phase < 0.25) {
        return mix(purple, pink, phase * 4.0);
    } else if (phase < 0.5) {
        return mix(pink, cyan, (phase - 0.25) * 4.0);
    } else if (phase < 0.75) {
        return mix(cyan, gold, (phase - 0.5) * 4.0);
    } else {
        return mix(gold, purple, (phase - 0.75) * 4.0);
    }
}

// Rotation matrix
fn rotate2d(p: vec2f, a: f32) -> vec2f {
    let s = sin(a);
    let c = cos(a);
    return vec2f(p.x * c - p.y * s, p.x * s + p.y * c);
}

// Simplex noise
fn hash(p: vec2f) -> f32 {
    return fract(sin(dot(p, vec2f(127.1, 311.7))) * 43758.5453123);
}

fn noise(p: vec2f) -> f32 {
    let i = floor(p);
    let f = fract(p);
    let u = f * f * (3.0 - 2.0 * f);
    return mix(
        mix(hash(i + vec2f(0.0, 0.0)), hash(i + vec2f(1.0, 0.0)), u.x),
        mix(hash(i + vec2f(0.0, 1.0)), hash(i + vec2f(1.0, 1.0)), u.x),
        u.y
    );
}

fn fbm(p: vec2f) -> f32 {
    var f = 0.0;
    var m = 0.5;
    for (var i = 0; i < 6; i++) {
        f += m * noise(p);
        p *= 2.0;
        m *= 0.5;
    }
    return f;
}

@vertex
fn vs_main(@builtin(vertex_index) vertexIndex: u32) -> @builtin(position) vec4f {
    var positions = array<vec2f, 6>(
        vec2f(-1.0, -1.0),
        vec2f( 1.0, -1.0),
        vec2f(-1.0,  1.0),
        vec2f(-1.0,  1.0),
        vec2f( 1.0, -1.0),
        vec2f( 1.0,  1.0)
    );
    return vec4f(positions[vertexIndex], 0.0, 1.0);
}

@fragment
fn fs_main(@builtin(position) fragCoord: vec4f) -> @location(0) vec4f {
    let uv_orig = (fragCoord.xy * 2.0 - uniforms.resolution) / min(uniforms.resolution.x, uniforms.resolution.y);
    var uv = uv_orig;
    
    // Faster time scaling for Solana energy
    let fast_time = uniforms.time * (1.5 + uniforms.overall * 3.0);
    
    // Beat-synced time burst
    let beat_time = fast_time + uniforms.beat * 0.5;
    
    // Heart rate affects pulse frequency (faster for Solana)
    let pulse_rate = uniforms.heart_rate / 45.0;
    let pulse = sin(beat_time * pulse_rate * 6.28318) * 0.5 + 0.5;
    
    // Breathing affects slow oscillation
    let breathe = sin(beat_time * uniforms.breathing_rate / 30.0 * 6.28318) * 0.2;
    
    // Stress affects chaos/intensity
    let chaos = uniforms.stress_level / 100.0;
    
    // Attention affects detail level
    let detail = 1.5 + uniforms.attention_level / 30.0;
    
    // Rotation based on emotion and beat
    let emotion_rotation = uniforms.valence * 3.14159 + uniforms.arousal * 1.5708;
    let beat_rotation = uniforms.beat * 1.0;
    uv = rotate2d(uv, emotion_rotation + beat_rotation + beat_time * 0.3);
    
    // Audio-reactive zoom with beat burst
    let zoom = 1.8 - uniforms.bass * 0.4 + pulse * 0.3 + uniforms.beat * 0.2;
    uv = uv / zoom;
    
    // Create multiple fractal layers - faster and more energetic
    var finalColor = vec3f(0.0);
    
    // Bass-driven large structures - faster rotation
    let bass_dist = length(uv);
    let bass_pattern = sin(bass_dist * 12.0 - beat_time * 4.0 + uniforms.bass * 15.0);
    
    // Mid-driven medium details
    var mid_uv = fract(uv * detail + vec2f(beat_time * 0.2, beat_time * 0.15));
    let mid_pattern = length(mid_uv - 0.5);
    
    // Treble-driven fine details - faster
    let treble_noise = noise(uv * 30.0 + beat_time * 2.0);
    
    // High frequency sparkles
    let sparkle = pow(noise(uv * 50.0 + beat_time * 3.0), 8.0) * uniforms.treble;
    
    // EEG band influences
    let eeg_influence = uniforms.eeg_delta * 0.3 + uniforms.eeg_theta * 0.2 + 
                        uniforms.eeg_alpha * 0.2 + uniforms.eeg_beta * 0.15 + 
                        uniforms.eeg_gamma * 0.15;
    
    // Combine patterns with Solana palette
    let base_palette_t = length(uv_orig) + beat_time * 0.2 + bass_pattern * 0.3;
    var color = solana_palette(base_palette_t + uniforms.beat * 0.3);
    
    // Beat intensity affects brightness and saturation
    let beat_brightness = 1.0 + uniforms.beat * 0.8 + uniforms.beat_intensity * 0.5;
    color *= beat_brightness;
    
    // Apply emotional coloring
    color = mix(color, color * vec3f(
        1.0 + uniforms.valence * 0.3,
        1.0 - abs(uniforms.valence) * 0.2,
        1.0 - uniforms.valence * 0.3
    ), 0.4);
    
    // Apply arousal intensity
    color = color * (0.8 + uniforms.arousal * 1.0);
    
    // Apply dominance contrast
    color = pow(color, vec3f(1.0 - uniforms.dominance * 0.2));
    
    // Add chaos-induced effects
    if (chaos > 0.3) {
        let chaos_color = solana_palette(base_palette_t * 2.5 + treble_noise);
        color = mix(color, chaos_color, (chaos - 0.3) * 0.6);
    }
    
    // Breathing modulation
    color = color * (0.9 + breathe * 0.3);
    
    // Pulse effect - stronger for Solana
    color = color * (0.7 + pulse * 0.6);
    
    // Add sparkle highlights
    color += vec3f(1.0, 0.8, 0.9) * sparkle;
    
    // EEG influence on glow
    color = color * (1.0 + eeg_influence * 0.4);
    
    // Beat flash effect
    let beat_flash = uniforms.beat * 0.3;
    color += vec3f(0.5, 0.2, 0.8) * beat_flash;
    
    // Vignette
    let vignette = 1.0 - length(uv_orig) * 0.4;
    color = color * vignette;
    
    // Add subtle scanlines for digital feel
    let scanline = sin(fragCoord.y * 3.0) * 0.015 + 1.0;
    color = color * scanline;
    
    // Glow effect at edges
    let edge_glow = pow(length(uv_orig), 2.0) * 0.3;
    color += vec3f(0.545, 0.0, 1.0) * edge_glow * (1.0 + uniforms.beat);
    
    return vec4f(color, 1.0);
}
`;

export const SolanaVisualizer: React.FC<SolanaVisualizerProps> = ({
  width = 800,
  height = 600,
  onBiometricData,
  onAudioData,
  onBPMChange,
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
  const [bpm, setBpm] = useState<number>(0);
  const [beat, setBeat] = useState<number>(0);
  const [beatIntensity, setBeatIntensity] = useState<number>(0);
  
  // Beat detection state
  const beatHistoryRef = useRef<Float32Array>(new Float32Array(1024));
  const lastBeatTimeRef = useRef<number>(0);
  const beatDecayRef = useRef<number>(0);

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
          
          // Perform beat detection using FluxReel
          const timeDomainData = result.waveform;
          beatHistoryRef.current.set(timeDomainData.subarray(0, Math.min(1024, timeDomainData.length)));
          const beats = detectBeatsEnergy(beatHistoryRef.current, 44100, 0.25);
          const detectedBpm = calculateBPM(beats);
          
          if (detectedBpm > 0) {
            setBpm(detectedBpm);
            if (onBPMChange) {
              onBPMChange(detectedBpm);
            }
          }
          
          // Calculate beat intensity with faster decay for Solana
          const now = Date.now();
          if (beats.length > 0 && now - lastBeatTimeRef.current > 150) {
            setBeat(1.0);
            setBeatIntensity(result.bands.bass * 1.5);
            lastBeatTimeRef.current = now;
            beatDecayRef.current = 1.0;
          } else {
            // Faster beat decay
            beatDecayRef.current = Math.max(0, beatDecayRef.current - 0.08);
            setBeat(beatDecayRef.current);
            setBeatIntensity(prev => Math.max(0, prev - 0.1));
          }
          
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
  }, [autoStart, onAudioData, onBiometricData, onBPMChange]);

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
          code: solanaShaderWGSL
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
        
        // Create uniform buffer (28 floats = 112 bytes)
        uniformBuffer = device.createBuffer({
          size: 112,
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
        console.error('WebGPU init failed:', e);
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
      
      setError('Using WebGL fallback - limited effects');
    };

    const renderFrame = () => {
      if (!device || !context || !pipeline || !uniformBuffer || !bindGroup) return;
      
      const now = performance.now();
      const time = (now - startTime) / 1000;
      
      // Pack uniforms
      const uniforms = new Float32Array(28);
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
      // Beat detection
      uniforms[9] = beat;
      uniforms[10] = beatIntensity;
      // Biometric data
      uniforms[11] = biometricData?.heartRate || 70;
      uniforms[12] = biometricData?.breathingRate || 14;
      uniforms[13] = biometricData?.stressLevel || 0;
      uniforms[14] = biometricData?.attentionLevel || 50;
      // Emotion
      uniforms[15] = biometricData?.emotion.valence || 0;
      uniforms[16] = biometricData?.emotion.arousal || 0.5;
      uniforms[17] = biometricData?.emotion.dominance || 0.5;
      // EEG bands
      uniforms[18] = biometricData?.eegBands.delta || 0;
      uniforms[19] = biometricData?.eegBands.theta || 0;
      uniforms[20] = biometricData?.eegAlpha || 0;
      uniforms[21] = biometricData?.eegBands.beta || 0;
      uniforms[22] = biometricData?.eegBands.gamma || 0;
      
      device.queue.writeBuffer(uniformBuffer, 0, uniforms);
      
      const encoder = device.createCommandEncoder();
      const textureView = context.getCurrentTexture().createView();
      
      const renderPass = encoder.beginRenderPass({
        colorAttachments: [{
          view: textureView,
          clearValue: { r: 0.05, g: 0.0, b: 0.1, a: 1 },
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
  }, [isInitialized, width, height, audioBands, biometricData, beat, beatIntensity]);

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
    <div className="solana-visualizer">
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
                : 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500'
            } text-white transition-colors`}
          >
            {isRecording ? '🛑 Stop Audio' : '🎤 Start Audio'}
          </button>
        </div>
        
        {/* BPM Display */}
        {bpm > 0 && (
          <div className="absolute top-4 left-4 bg-black/70 rounded-lg px-4 py-2">
            <p className="text-pink-400 font-bold text-lg">
              ⚡ {Math.round(bpm)} BPM
            </p>
          </div>
        )}
        
        {/* Beat indicator with Solana colors */}
        <div className="absolute bottom-4 left-4">
          <div 
            className={`w-4 h-4 rounded-full transition-all duration-75 ${
              beat > 0.3 
                ? 'bg-gradient-to-r from-purple-500 to-pink-500 scale-150 shadow-lg shadow-purple-500' 
                : 'bg-gray-600'
            }`}
          />
        </div>
        
        {/* Audio visualization bars - Solana gradient */}
        {isRecording && (
          <div className="absolute bottom-4 right-4 flex gap-1">
            {['bass', 'lowMid', 'mid', 'highMid', 'treble'].map((band) => (
              <div
                key={band}
                className="w-3 bg-gradient-to-t from-purple-500 to-pink-500 rounded-sm"
                style={{ 
                  height: `${Math.max(4, (audioBands as any)[band] * 60)}px`,
                  transition: 'height 0.05s ease-out'
                }}
              />
            ))}
          </div>
        )}
        
        {/* Solana branding */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2">
          <span className="text-pink-400/50 text-xs font-mono">
            ◎ Solana • High Energy Visualizer
          </span>
        </div>
        
        {/* Biometric data display */}
        {biometricData && (
          <div className="absolute top-20 left-4 bg-black/70 rounded-lg px-3 py-2">
            <div className="flex gap-3 text-xs">
              <span className="text-purple-400">
                ♥ {biometricData.heartRate}
              </span>
              <span className="text-pink-400">
                🌬 {biometricData.breathingRate}
              </span>
              <span className="text-cyan-400">
                ⚡ {biometricData.attentionLevel}%
              </span>
            </div>
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

export default SolanaVisualizer;
