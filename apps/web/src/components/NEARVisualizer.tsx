/**
 * NEAR Visualizer Component
 * Renders fluid smoke effects using phosphor drift.wgsl
 * Audio-reactive domain-warped FBM noise with NEAR brand colors
 * Integrates with AudioAnalyzerService for audio data
 */

import React, { useEffect, useRef, useState, useCallback } from 'react';
import { AudioAnalyzerService, AudioBandData, BiometricAudioData } from '../services/audioAnalyzerService';

interface NEARVisualizerProps {
  width?: number;
  height?: number;
  onBiometricData?: (data: BiometricAudioData) => void;
  onAudioData?: (bands: AudioBandData) => void;
  autoStart?: boolean;
}

// Drift shader - adapted from phosphor drift.wgsl
const driftShaderWGSL = `
struct Uniforms {
  resolution: vec2f,
  time: f32,
  // Audio reactive uniforms
  sub_bass: f32,
  bass: f32,
  mid: f32,
  rms: f32,
  centroid: f32,
  // Additional params
  param: vec4f,
  // Biometric
  heart_rate: f32,
  breathing_rate: f32,
}

@group(0) @binding(0) var<uniform> u: Uniforms;

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
    for (var i = 0; i < 5; i++) {
        f += m * noise(p);
        p *= 2.0;
        m *= 0.5;
    }
    return f;
}

// Domain warped FBM
fn domainWarp(p: vec2f, t: f32) -> vec2f {
    let warp = fbm(p + vec2f(t * 0.1, t * 0.15));
    return p + warp * 0.5;
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
fn fs_main(@builtin(position) frag_coord: vec4f) -> @location(0) vec4f {
    let res = u.resolution;
    let uv = frag_coord.xy / res;
    let aspect = res.x / res.y;
    let p = (uv - 0.5) * vec2f(aspect, 1.0);
    let t = u.time;
    
    // Parameters from uniforms
    let warp_intensity = u.param.x * 2.0 + 0.5 + u.bass;
    let flow_speed = u.param.y * 0.8 + 0.1;
    let density = u.param.w * 1.5 + 0.5;
    
    // Audio modulation
    let bass_warp = (u.sub_bass + u.bass) * 0.5 * warp_intensity;
    let flow_t = t * flow_speed;
    
    // Triple domain warping for fluid look
    var q = p;
    q += vec2f(
        fbm(domainWarp(p + vec2f(0.0, 0.0), flow_t) + bass_warp),
        fbm(domainWarp(p + vec2f(5.2, 1.3), flow_t * 1.1) + bass_warp)
    );
    
    var r = p;
    r += vec2f(
        fbm(domainWarp(q + vec2f(1.7, 9.2), flow_t * 0.8) + bass_warp * 0.5),
        fbm(domainWarp(q + vec2f(8.3, 2.8), flow_t * 0.9) + bass_warp * 0.5)
    );
    
    var s = p;
    s += vec2f(
        fbm(domainWarp(r + vec2f(2.1, 7.5), flow_t * 0.7) + bass_warp * 0.3),
        fbm(domainWarp(r + vec2f(9.4, 3.1), flow_t * 0.75) + bass_warp * 0.3)
    );
    
    // Final FBM
    let f = fbm(s * density + flow_t);
    
    // NEAR brand colors: green (#00EC97) and cyan (#00D1FF)
    let near_green = vec3f(0.0, 0.925, 0.592);
    let near_cyan = vec3f(0.0, 0.82, 1.0);
    let near_dark = vec3f(0.02, 0.08, 0.06);
    
    // Audio-reactive palette
    let pal_t = f * 2.0 + t * 0.05 + u.centroid * 0.5;
    var col = mix(near_dark, near_green, f);
    col = mix(col, near_cyan, f * f * 0.8 + u.mid * 0.3);
    
    // Bass drives brightness
    col *= 0.8 + u.bass * 0.6 + u.rms * 0.4;
    
    // Mid frequencies add detail
    col += vec3f(0.0, u.mid * 0.2, u.mid * 0.15);
    
    // Breathing affects slow oscillation
    let breathe = sin(t * u.breathing_rate / 30.0 * 6.28318) * 0.1;
    col *= 0.95 + breathe;
    
    // Heart rate affects pulse
    let pulse = sin(t * u.heart_rate / 60.0 * 6.28318) * 0.05 + 1.0;
    col *= pulse;
    
    // Add glow effect
    let glow = f * 0.3 * (1.0 + u.bass);
    col += near_green * glow * 0.2;
    
    // Vignette
    let vignette = 1.0 - length(uv - 0.5) * 0.8;
    col *= vignette;
    
    return vec4f(col, 1.0);
}
`;

export const NEARVisualizer: React.FC<NEARVisualizerProps> = ({
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
          code: driftShaderWGSL
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
        
        // Create uniform buffer (8 floats = 32 bytes)
        uniformBuffer = device.createBuffer({
          size: 32,
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
      const uniforms = new Float32Array(8);
      uniforms[0] = width;
      uniforms[1] = height;
      uniforms[2] = time;
      // Audio reactive
      uniforms[3] = audioBands.bass * 0.5; // sub_bass
      uniforms[4] = audioBands.bass; // bass
      uniforms[5] = audioBands.mid; // mid
      uniforms[6] = audioBands.overall; // rms
      uniforms[7] = 0.5; // centroid
      
      // Additional params packed in
      const params = new Float32Array(4);
      params[0] = 1.0; // warp_intensity
      params[1] = 1.0; // flow_speed
      params[2] = 0.0; // color_mode (unused)
      params[3] = 1.5; // density
      
      const fullUniforms = new Float32Array(12);
      fullUniforms.set(uniforms);
      fullUniforms.set(params, 8);
      
      device.queue.writeBuffer(uniformBuffer, 0, fullUniforms);
      
      const encoder = device.createCommandEncoder();
      const textureView = context.getCurrentTexture().createView();
      
      const renderPass = encoder.beginRenderPass({
        colorAttachments: [{
          view: textureView,
          clearValue: { r: 0.02, g: 0.08, b: 0.06, a: 1 },
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
  }, [isInitialized, width, height, audioBands, biometricData]);

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
    <div className="near-visualizer">
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
        
        {/* NEAR branding */}
        <div className="absolute top-4 left-4 bg-black/70 rounded-lg px-4 py-2">
          <p className="text-green-400 font-bold text-lg">
            ⬡ NEAR
          </p>
          <p className="text-cyan-400 text-xs">
            Fluid Smoke Visualizer
          </p>
        </div>
        
        {/* Audio visualization bars */}
        {isRecording && (
          <div className="absolute bottom-4 right-4 flex gap-1">
            {['bass', 'lowMid', 'mid', 'highMid', 'treble'].map((band) => (
              <div
                key={band}
                className="w-3 bg-gradient-to-t from-green-500 to-cyan-500 rounded-sm"
                style={{ 
                  height: `${Math.max(4, (audioBands as any)[band] * 60)}px`,
                  transition: 'height 0.05s ease-out'
                }}
              />
            ))}
          </div>
        )}
        
        {/* Biometric data display */}
        {biometricData && (
          <div className="absolute bottom-4 left-4 bg-black/70 rounded-lg px-3 py-2">
            <div className="flex gap-4 text-xs">
              <span className="text-green-400">
                ♥ {biometricData.heartRate}
              </span>
              <span className="text-cyan-400">
                🌬 {biometricData.breathingRate}
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

export default NEARVisualizer;
