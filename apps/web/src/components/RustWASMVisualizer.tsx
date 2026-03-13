/**
 * Rust/WASM Visualizer Component
 * Renders a black hole/gravity well effect with GPU particle simulation
 * Uses phosphor vortex_sim.wgsl for particle effects and FluxReel beat detection
 * Integrates with AudioAnalyzerService for audio data
 */

import React, { useEffect, useRef, useState, useCallback } from 'react';
import { AudioAnalyzerService, AudioBandData, BiometricAudioData } from '../services/audioAnalyzerService';
import { detectBeatsEnergy, calculateBPM } from '../../../../libs/fluxreel-shaders/fluxreel-audio';

interface RustWASMVisualizerProps {
  width?: number;
  height?: number;
  onBiometricData?: (data: BiometricAudioData) => void;
  onAudioData?: (bands: AudioBandData) => void;
  onBPMChange?: (bpm: number) => void;
  autoStart?: boolean;
}

// Vortex compute shader - adapted from phosphor vortex_sim.wgsl
const vortexComputeWGSL = `
struct ParticleUniforms {
    delta_time: f32,
    time: f32,
    max_particles: u32,
    emit_count: u32,

    emitter_pos: vec2f,
    emitter_radius: f32,
    emitter_shape: u32,

    lifetime: f32,
    initial_speed: f32,
    initial_size: f32,
    size_end: f32,

    gravity: vec2f,
    drag: f32,
    turbulence: f32,

    attraction_point: vec2f,
    attraction_strength: f32,
    seed: f32,

    // Audio reactive
    sub_bass: f32,
    bass: f32,
    mid: f32,
    rms: f32,
    kick: f32,
    onset: f32,
    centroid: f32,
    flux: f32,
    beat: f32,
    beat_phase: f32,

    resolution: vec2f,
}

struct Particle {
    pos_life: vec4f,
    vel_size: vec4f,
    color: vec4f,
    flags: vec4f,
}

@group(0) @binding(0) var<uniform> u: ParticleUniforms;
@group(0) @binding(1) var<storage, read> particles_in: array<Particle>;
@group(0) @binding(2) var<storage, read_write> particles_out: array<Particle>;
@group(0) @binding(3) var<storage, read_write> emit_counter: atomic<u32>;

fn hash(n: f32) -> f32 {
    return fract(sin(n) * 43758.5453123);
}

fn aspect() -> f32 {
    return u.resolution.x / u.resolution.y;
}

fn to_screen(p: vec2f) -> vec2f {
    return vec2f(p.x * aspect(), p.y);
}

fn to_clip(v: vec2f) -> vec2f {
    return vec2f(v.x / aspect(), v.y);
}

fn emit_particle(idx: u32) -> Particle {
    var p: Particle;
    let seed_base = u.seed + f32(idx) * 13.37;
    
    let is_jet = select(0.0, select(0.0, 1.0, hash(seed_base + 7.0) < 0.3), u.beat > 0.5);
    
    if is_jet > 0.5 {
        let jet_dir = select(-1.0, 1.0, hash(seed_base + 8.0) > 0.5);
        let spread_x = (hash(seed_base) - 0.5) * 0.05;
        let pos = vec2f(spread_x, 0.0);
        let speed = u.initial_speed * 3.0;
        let vel = vec2f(spread_x * 2.0, jet_dir * speed);
        
        let brightness = 0.5 + u.rms * 0.3;
        let col = vec3f(0.4, 0.6, 1.0) * brightness;
        
        let initial_age = hash(seed_base + 9.0) * u.lifetime * 0.1;
        
        p.pos_life = vec4f(pos, 0.0, 1.0);
        p.vel_size = vec4f(vel, 0.0, u.initial_size * 1.5);
        p.color = vec4f(col, 0.7);
        p.flags = vec4f(initial_age, u.lifetime * 0.5, 1.0, 0.0);
    } else {
        let angle = hash(seed_base) * 6.2831853;
        let r = u.emitter_radius * (0.85 + 0.3 * hash(seed_base + 1.0));
        let screen_offset = vec2f(cos(angle), sin(angle)) * r;
        let pos = u.emitter_pos + to_clip(screen_offset);
        
        let rot_dir = select(-1.0, 1.0, hash(seed_base + 5.0) > 0.35);
        let tangent = vec2f(-sin(angle), cos(angle));
        let inward = vec2f(-cos(angle), -sin(angle));
        let vel_screen = tangent * u.initial_speed * rot_dir + inward * u.initial_speed * 0.08;
        let vel = to_clip(vel_screen);
        
        let hue = fract(angle / 6.2831853 + u.centroid * 0.3);
        let r_c = abs(hue * 6.0 - 3.0) - 1.0;
        let g_c = 2.0 - abs(hue * 6.0 - 2.0);
        let b_c = 2.0 - abs(hue * 6.0 - 4.0);
        let brightness = 0.15 + u.rms * 0.1;
        
        let initial_age = hash(seed_base + 9.0) * u.lifetime * 0.3;
        
        p.pos_life = vec4f(pos, 0.0, 1.0);
        p.vel_size = vec4f(vel, 0.0, u.initial_size * (0.7 + hash(seed_base + 2.0) * 0.6));
        p.color = vec4f(clamp(vec3f(r_c, g_c, b_c), vec3f(0.0), vec3f(1.0)) * brightness, 0.5);
        p.flags = vec4f(initial_age, u.lifetime, 0.0, rot_dir);
    }
    
    return p;
}

@compute @workgroup_size(256)
fn cs_main(@builtin(global_invocation_id) gid: vec3u) {
    let idx = gid.x;
    if idx >= u.max_particles {
        return;
    }
    
    var p = particles_in[idx];
    let life = p.pos_life.w;
    let age = p.flags.x;
    let max_life = p.flags.y;
    let is_jet = p.flags.z;
    
    if life <= 0.0 {
        let slot = atomicAdd(&emit_counter, 1u);
        if slot < u.emit_count {
            p = emit_particle(idx);
        }
        particles_out[idx] = p;
        return;
    }
    
    let new_age = age + u.delta_time;
    if new_age >= max_life {
        p.pos_life.w = 0.0;
        particles_out[idx] = p;
        return;
    }
    
    let life_frac = new_age / max_life;
    let dt = u.delta_time;
    
    var vel = p.vel_size.xy;
    
    if is_jet > 0.5 {
        vel *= 1.0 - 0.01 * dt * 60.0;
    } else {
        let screen_pos = to_screen(p.pos_life.xy);
        let screen_center = to_screen(u.emitter_pos);
        let to_center = screen_center - screen_pos;
        let dist = length(to_center);
        
        let eh_radius = 0.06 + u.sub_bass * 0.02;
        if dist < eh_radius {
            p.pos_life.w = 0.0;
            particles_out[idx] = p;
            return;
        }
        
        let dir = to_center / max(dist, 0.001);
        let min_dist = 0.06;
        let clamped_dist = max(dist, min_dist);
        
        let gravity_force = u.attraction_strength * (1.0 + u.bass) / (clamped_dist * clamped_dist);
        let screen_accel = dir * gravity_force;
        
        vel += to_clip(screen_accel) * dt;
        
        if u.onset > 0.3 {
            let tangent = vec2f(-dir.y, dir.x);
            vel += to_clip(tangent * u.onset * 0.05) * dt;
        }
    }
    
    vel *= 1.0 - (1.0 - u.drag) * dt * 60.0;
    
    let new_pos = p.pos_life.xy + vel * dt;
    
    let screen_new = to_screen(new_pos);
    if length(screen_new) > 2.0 {
        p.pos_life.w = 0.0;
        particles_out[idx] = p;
        return;
    }
    
    let base_size = mix(p.vel_size.w, u.size_end, life_frac);
    let size = base_size * (1.0 + u.rms * 0.15);
    
    let fade = 1.0 - smoothstep(0.6, 1.0, life_frac);
    let alpha = select(0.4, 0.6, is_jet > 0.5) * fade;
    
    var col = p.color.rgb;
    if is_jet < 0.5 {
        let screen_pos = to_screen(new_pos);
        let dist_to_center = length(screen_pos);
        let blue_amount = smoothstep(0.4, 0.05, dist_to_center);
        let blue_tint = vec3f(0.3, 0.5, 1.0) * 0.2;
        col = mix(col, blue_tint, blue_amount * 0.5);
    }
    
    p.pos_life = vec4f(new_pos, 0.0, 1.0);
    p.vel_size = vec4f(vel, 0.0, size);
    p.color = vec4f(col, alpha);
    p.flags.x = new_age;
    
    particles_out[idx] = p;
}
`;

// Vortex render shader - renders particles to screen
const vortexRenderWGSL = `
struct RenderUniforms {
    time: f32,
    resolution: vec2f,
    particle_count: u32,
    beat: f32,
    bass: f32,
    mid: f32,
    rms: f32,
    sub_bass: f32,
    heart_rate: f32,
    breathing_rate: f32,
}

@group(0) @binding(0) var<uniform> u: RenderUniforms;

struct Particle {
    pos_life: vec4f,
    vel_size: vec4f,
    color: vec4f,
    flags: vec4f,
}

@group(0) @binding(1) var<storage, read> particles: array<Particle>;

struct VertexOutput {
    @builtin(position) position: vec4f,
    @location(0) color: vec4f,
    @location(1) size: f32,
}

@vertex
fn vs_main(@builtin(vertex_index) vertexIndex: u32, @builtin(instance_index) instanceIndex: u32) -> VertexOutput {
    var output: VertexOutput;
    
    let particle = particles[instanceIndex];
    
    // Quad vertices
    let quad = array<vec2f, 6>(
        vec2f(-1.0, -1.0),
        vec2f( 1.0, -1.0),
        vec2f(-1.0,  1.0),
        vec2f(-1.0,  1.0),
        vec2f( 1.0, -1.0),
        vec2f( 1.0,  1.0)
    );
    
    let vertexOffset = quad[vertexIndex] * particle.vel_size.w * 0.01;
    let worldPos = particle.pos_life.xy + vertexOffset;
    
    output.position = vec4f(worldPos, 0.0, 1.0);
    output.color = particle.color;
    output.size = particle.vel_size.w;
    
    return output;
}

@fragment
fn fs_main(@location(0) color: vec4f, @location(1) size: f32) -> @location(0) vec4f {
    // Discard dead particles
    if color.a <= 0.0 {
        discard;
    }
    
    // Apply slight glow effect based on beat
    let glow = 1.0 + u.beat * 0.3;
    
    return vec4f(color.rgb * glow, color.a);
}
`;

export const RustWASMVisualizer: React.FC<RustWASMVisualizerProps> = ({
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
  
  // Beat detection state
  const beatHistoryRef = useRef<Float32Array>(new Float32Array(1024));
  const lastBeatTimeRef = useRef<number>(0);

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
          const beats = detectBeatsEnergy(beatHistoryRef.current, 44100, 0.3);
          const detectedBpm = calculateBPM(beats);
          
          if (detectedBpm > 0) {
            setBpm(detectedBpm);
            if (onBPMChange) {
              onBPMChange(detectedBpm);
            }
          }
          
          // Calculate beat intensity
          const now = Date.now();
          if (beats.length > 0 && now - lastBeatTimeRef.current > 200) {
            setBeat(1.0);
            lastBeatTimeRef.current = now;
          } else {
            setBeat(prev => Math.max(0, prev - 0.1));
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

  // WebGPU rendering with particle system
  useEffect(() => {
    if (!isInitialized || !canvasRef.current) return;
    
    let animationFrameId: number;
    let device: GPUDevice | null = null;
    let context: GPUCanvasContext | null = null;
    let computePipeline: GPUComputePipeline | null = null;
    let renderPipeline: GPURenderPipeline | null = null;
    let particleBufferA: GPUBuffer | null = null;
    let particleBufferB: GPUBuffer | null = null;
    let uniformBuffer: GPUBuffer | null = null;
    let renderUniformBuffer: GPUBuffer | null = null;
    let emitCounterBuffer: GPUBuffer | null = null;
    let bindGroupCompute: GPUBindGroup | null = null;
    let bindGroupRender: GPUBindGroup | null = null;
    let currentBufferA = true;
    const startTime = performance.now();
    
    const PARTICLE_COUNT = 50000;
    const PARTICLE_SIZE = 64; // vec4 pos_life + vec4 vel_size + vec4 color + vec4 flags
    
    const initWebGPU = async () => {
      try {
        if (!('gpu' in navigator)) {
          setError('WebGPU not supported, using WebGL fallback');
          initWebGL();
          return;
        }
        
        const gpu = (navigator as any).gpu;
        const adapter = await gpu.requestAdapter();
        if (!adapter) {
          setError('No GPU adapter found');
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
        
        // Create compute shader module
        const computeModule = device.createShaderModule({ code: vortexComputeWGSL });
        
        // Create compute pipeline
        computePipeline = device.createComputePipeline({
          layout: 'auto',
          compute: { module: computeModule, entryPoint: 'cs_main' }
        });
        
        // Create render shader module
        const renderModule = device.createShaderModule({ code: vortexRenderWGSL });
        
        // Create render pipeline
        renderPipeline = device.createRenderPipeline({
          layout: 'auto',
          vertex: {
            module: renderModule,
            entryPoint: 'vs_main'
          },
          fragment: {
            module: renderModule,
            entryPoint: 'fs_main',
            targets: [{ format }]
          },
          primitive: { topology: 'triangle-list' },
          blend: {
            color: {
              srcFactor: 'src-alpha',
              dstFactor: 'one',
              operation: 'add'
            },
            alpha: {
              srcFactor: 'one',
              dstFactor: 'one',
              operation: 'add'
            }
          }
        });
        
        // Create particle buffers (double-buffered)
        const particleDataSize = PARTICLE_COUNT * PARTICLE_SIZE * 4;
        particleBufferA = device.createBuffer({
          size: particleDataSize,
          usage: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_DST | GPUBufferUsage.VERTEX
        });
        particleBufferB = device.createBuffer({
          size: particleDataSize,
          usage: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_DST | GPUBufferUsage.VERTEX
        });
        
        // Create uniform buffer
        uniformBuffer = device.createBuffer({
          size: 176, // ParticleUniforms size
          usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST
        });
        
        // Create render uniform buffer
        renderUniformBuffer = device.createBuffer({
          size: 32,
          usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST
        });
        
        // Create emit counter buffer
        emitCounterBuffer = device.createBuffer({
          size: 4,
          usage: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_DST
        });
        
        // Create bind groups
        bindGroupCompute = device.createBindGroup({
          layout: computePipeline.getBindGroupLayout(0),
          entries: [
            { binding: 0, resource: { buffer: uniformBuffer } },
            { binding: 1, resource: { buffer: particleBufferA } },
            { binding: 2, resource: { buffer: particleBufferB } },
            { binding: 3, resource: { buffer: emitCounterBuffer } }
          ]
        });
        
        bindGroupRender = device.createBindGroup({
          layout: renderPipeline.getBindGroupLayout(0),
          entries: [
            { binding: 0, resource: { buffer: renderUniformBuffer } },
            { binding: 1, resource: { buffer: particleBufferA } }
          ]
        });
        
        // Initialize particles to zero
        const zeroData = new Float32Array(PARTICLE_COUNT * PARTICLE_SIZE);
        device.queue.writeBuffer(particleBufferA, 0, zeroData);
        device.queue.writeBuffer(particleBufferB, 0, zeroData);
        
        // Start render loop
        renderFrame();
      } catch (e) {
        console.error('WebGPU init failed:', e);
        setError('WebGPU initialization failed');
        initWebGL();
      }
    };
    
    // WebGL fallback for simpler rendering
    const initWebGL = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      
      const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
      if (!gl) {
        setError('WebGL not supported');
        return;
      }
      
      // Simple WebGL particle system fallback
      setError('Using WebGL fallback - limited particle effects');
    };
    
    const renderFrame = () => {
      if (!device || !context || !computePipeline || !renderPipeline) return;
      
      const now = performance.now();
      const time = (now - startTime) / 1000;
      const deltaTime = 1 / 60;
      
      // Pack compute uniforms
      const uniforms = new Float32Array(44);
      uniforms[0] = deltaTime;
      uniforms[1] = time;
      uniforms[2] = PARTICLE_COUNT;
      uniforms[3] = 500; // emit_count
      uniforms[4] = 0; // emitter_pos x
      uniforms[5] = 0; // emitter_pos y
      uniforms[6] = 0.15; // emitter_radius
      uniforms[7] = 0; // emitter_shape
      uniforms[8] = 4.0; // lifetime
      uniforms[9] = 0.8; // initial_speed
      uniforms[10] = 0.015; // initial_size
      uniforms[11] = 0.002; // size_end
      uniforms[12] = 0; // gravity x
      uniforms[13] = 0; // gravity y
      uniforms[14] = 0.985; // drag
      uniforms[15] = 0.1; // turbulence
      uniforms[16] = 0; // attraction_point x
      uniforms[17] = 0; // attraction_point y
      uniforms[18] = 2.5; // attraction_strength
      uniforms[19] = time; // seed
      // Audio reactive
      uniforms[20] = audioBands.bass * 0.5; // sub_bass
      uniforms[21] = audioBands.bass; // bass
      uniforms[22] = audioBands.mid; // mid
      uniforms[23] = audioBands.overall; // rms
      uniforms[24] = audioBands.bass > 0.7 ? 1.0 : 0.0; // kick
      uniforms[25] = audioBands.bass > 0.5 ? 1.0 : 0.0; // onset
      uniforms[26] = 0.5; // centroid
      uniforms[27] = 0.3; // flux
      uniforms[28] = beat; // beat
      uniforms[29] = beat > 0.5 ? time : 0; // beat_phase
      uniforms[30] = width;
      uniforms[31] = height;
      
      device.queue.writeBuffer(uniformBuffer!, 0, uniforms);
      
      // Pack render uniforms
      const renderUniforms = new Float32Array(8);
      renderUniforms[0] = time;
      renderUniforms[1] = width;
      renderUniforms[2] = PARTICLE_COUNT;
      renderUniforms[3] = beat;
      renderUniforms[4] = audioBands.bass;
      renderUniforms[5] = audioBands.mid;
      renderUniforms[6] = audioBands.overall;
      renderUniforms[7] = audioBands.bass * 0.5;
      
      device.queue.writeBuffer(renderUniformBuffer!, 0, renderUniforms);
      
      // Reset emit counter
      const zero = new Uint32Array([0]);
      device.queue.writeBuffer(emitCounterBuffer!, 0, zero);
      
      // Compute pass
      const computeEncoder = device.createCommandEncoder();
      const computePass = computeEncoder.beginComputePass();
      computePass.setPipeline(computePipeline!);
      
      // Alternate between buffers
      const srcBuffer = currentBufferA ? particleBufferA! : particleBufferB!;
      const dstBuffer = currentBufferA ? particleBufferB! : particleBufferA!;
      
      computePass.setBindGroup(0, device.createBindGroup({
        layout: computePipeline.getBindGroupLayout(0),
        entries: [
          { binding: 0, resource: { buffer: uniformBuffer! } },
          { binding: 1, resource: { buffer: srcBuffer } },
          { binding: 2, resource: { buffer: dstBuffer } },
          { binding: 3, resource: { buffer: emitCounterBuffer! } }
        ]
      }));
      
      computePass.dispatchWorkgroups(Math.ceil(PARTICLE_COUNT / 256));
      computePass.end();
      
      // Render pass
      const textureView = context.getCurrentTexture().createView();
      const renderPass = computeEncoder.beginRenderPass({
        colorAttachments: [{
          view: textureView,
          clearValue: { r: 0.02, g: 0.02, b: 0.05, a: 1 },
          loadOp: 'clear',
          storeOp: 'store'
        }]
      });
      
      renderPass.setPipeline(renderPipeline);
      
      // Use destination buffer for rendering
      renderPass.setBindGroup(0, device.createBindGroup({
        layout: renderPipeline.getBindGroupLayout(0),
        entries: [
          { binding: 0, resource: { buffer: renderUniformBuffer! } },
          { binding: 1, resource: { buffer: dstBuffer } }
        ]
      }));
      
      renderPass.draw(6, PARTICLE_COUNT, 0, 0);
      renderPass.end();
      
      device.queue.submit([computeEncoder.finish()]);
      
      // Swap buffers
      currentBufferA = !currentBufferA;
      
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
  }, [isInitialized, width, height, audioBands, biometricData, beat]);

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
    <div className="rust-wasm-visualizer">
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
                : 'bg-orange-500 hover:bg-orange-600'
            } text-white transition-colors`}
          >
            {isRecording ? '🛑 Stop Audio' : '🎤 Start Audio'}
          </button>
        </div>
        
        {/* BPM Display */}
        {bpm > 0 && (
          <div className="absolute top-4 left-4 bg-black/70 rounded-lg px-4 py-2">
            <p className="text-orange-400 font-bold text-lg">
              🔥 {Math.round(bpm)} BPM
            </p>
          </div>
        )}
        
        {/* Beat indicator */}
        <div className="absolute bottom-4 left-4">
          <div 
            className={`w-4 h-4 rounded-full transition-all duration-100 ${
              beat > 0.5 
                ? 'bg-orange-500 scale-150 shadow-lg shadow-orange-500' 
                : 'bg-gray-600'
            }`}
          />
        </div>
        
        {/* Audio visualization bars */}
        {isRecording && (
          <div className="absolute bottom-4 right-4 flex gap-1">
            {['bass', 'lowMid', 'mid', 'highMid', 'treble'].map((band) => (
              <div
                key={band}
                className="w-3 bg-gradient-to-t from-orange-500 to-red-500 rounded-sm"
                style={{ 
                  height: `${Math.max(4, (audioBands as any)[band] * 60)}px`,
                  transition: 'height 0.05s ease-out'
                }}
              />
            ))}
          </div>
        )}
        
        {/* Rust/WASM branding */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2">
          <span className="text-orange-400/50 text-xs font-mono">
            RUST/WASM • Black Hole Visualizer
          </span>
        </div>
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

export default RustWASMVisualizer;
