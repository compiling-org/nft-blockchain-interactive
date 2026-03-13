import React, { useEffect, useRef, useState } from 'react'

interface WGSLWebGPUFractalProps {
  width?: number
  height?: number
  audioLevel?: number
  hands?: number
  faces?: number
  gestures?: number
  emotion?: { valence: number; arousal: number; dominance: number }
}

const shaderWGSL = `
struct Uniforms {
  time: f32,
  resolution: vec2<f32>,
  audio: f32,
  hands: f32,
  faces: f32,
  gestures: f32,
  valence: f32,
  arousal: f32,
  dominance: f32,
  // Advanced Audio Features
  sub_bass: f32,
  mid: f32,
  brilliance: f32,
  kick: f32,
};
@group(0) @binding(0) var<uniform> uniforms: Uniforms;

// WGSL Library Imports will be injected here in a real production environment
// For this demo, we'll inline a few high-value functions from our synchronized library

fn palette(t: f32) -> vec3<f32> {
    let a = vec3<f32>(0.5, 0.5, 0.5);
    let b = vec3<f32>(0.5, 0.5, 0.5);
    let c = vec3<f32>(1.0, 1.0, 1.0);
    let d = vec3<f32>(0.263, 0.416, 0.557);
    return a + b * cos(6.28318 * (c * t + d + uniforms.time * 0.05));
}

fn rotate(p: vec2<f32>, a: f32) -> vec2<f32> {
    let s = sin(a);
    let c = cos(a);
    return vec2<f32>(p.x * c - p.y * s, p.x * s + p.y * c);
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
  let pos = positions[vertexIndex];
  return vec4<f32>(pos, 0.0, 1.0);
}

@fragment
fn fs_main(@builtin(position) fragCoord: vec4<f32>) -> @location(0) vec4<f32> {
  let uv_orig = (fragCoord.xy * 2.0 - uniforms.resolution) / min(uniforms.resolution.x, uniforms.resolution.y);
  var uv = uv_orig;
  
  // Audio-reactive distortion using our new "kick" and "sub_bass" uniforms
  let distortion = uniforms.kick * 0.1 + uniforms.sub_bass * 0.05;
  uv = rotate(uv, uniforms.time * 0.1 + distortion);
  
  var finalColor = vec3<f32>(0.0);
  
  // Iterative fractal design mirroring our professional templates
  for (var i: f32 = 0.0; i < 3.0; i = i + 1.0) {
      uv = fract(uv * (1.5 + uniforms.arousal * 0.5)) - 0.5;
      
      let d = length(uv) * exp(-length(uv_orig));
      let col = palette(length(uv_orig) + i * 0.4 + uniforms.time * 0.2);
      
      let s = sin(d * 8.0 + uniforms.time) / 8.0;
      let val = abs(s);
      let power = 0.01 / val;
      
      finalColor = finalColor + col * (power * (1.0 + uniforms.audio * 0.5));
  }
  
  // Vignette and post-processing
  let vignette = 1.0 - length(uv_orig) * 0.5;
  return vec4<f32>(finalColor * vignette, 1.0);
}
`

export const WGSLWebGPUFractal: React.FC<WGSLWebGPUFractalProps> = ({ width = 800, height = 600, audioLevel, hands = 0, faces = 0, gestures = 0, emotion }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const [error, setError] = useState('')
  const audioRef = useRef<{ ctx: AudioContext; analyser: AnalyserNode } | null>(null)
  const [micLevel, setMicLevel] = useState(0)

  useEffect(() => {
    let raf = 0
    let device: GPUDevice | null = null
    let context: GPUCanvasContext | null = null
    let pipeline: GPURenderPipeline | null = null
    let uniformBuffer: GPUBuffer | null = null
    let bindGroup: GPUBindGroup | null = null
    let start = performance.now()

    const init = async () => {
      try {
        if (!('gpu' in navigator)) {
          setError('WebGPU not supported')
          return
        }
        const adapter = await (navigator as any).gpu.requestAdapter()
        if (!adapter) {
          setError('No WebGPU adapter')
          return
        }
        device = await adapter.requestDevice()
        const canvas = canvasRef.current!
        context = canvas.getContext('webgpu') as GPUCanvasContext
        const format = (navigator as any).gpu.getPreferredCanvasFormat()
        if (!device || !context) {
          setError('WebGPU device/context not available')
          return
        }
        const dev: GPUDevice = device
        const ctx: GPUCanvasContext = context
        ctx.configure({ device: dev, format, alphaMode: 'opaque' })

        const module = dev.createShaderModule({ code: shaderWGSL })
        pipeline = dev.createRenderPipeline({
          layout: 'auto',
          vertex: { module, entryPoint: 'vs_main' },
          fragment: { module, entryPoint: 'fs_main', targets: [{ format }] },
          primitive: { topology: 'triangle-list' }
        })

        uniformBuffer = dev.createBuffer({
          size: (14 * 4), // time, res(2), audio, hands, faces, gestures, val, aro, dom, sub_bass, mid, bril, kick
          usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST
        })
        bindGroup = dev.createBindGroup({
          layout: pipeline.getBindGroupLayout(0),
          entries: [{ binding: 0, resource: { buffer: uniformBuffer } }]
        })

        const frame = () => {
          const now = performance.now()
          const time = (now - start) / 1000
          const resolution = new Float32Array([canvas.width, canvas.height])
          const audio = typeof audioLevel === 'number' ? audioLevel : micLevel

          // Placeholder advanced audio metrics - will be driven by WASM analyzer later
          const sub_bass = audio * 1.2
          const mid = audio * 0.8
          const bril = audio * 0.5
          const kick = audio > 0.8 ? 1.0 : 0.0

          const val = emotion?.valence ?? 0.5
          const aro = emotion?.arousal ?? 0.5
          const dom = emotion?.dominance ?? 0.5

          const u = new Float32Array([
            time,
            resolution[0], resolution[1],
            audio, hands, faces, gestures,
            val, aro, dom,
            sub_bass, mid, bril, kick
          ])
          dev.queue.writeBuffer(uniformBuffer!, 0, u.buffer)

          const encoder = dev.createCommandEncoder()
          const view = ctx.getCurrentTexture().createView()
          const pass = encoder.beginRenderPass({
            colorAttachments: [{ view, loadOp: 'clear', clearValue: { r: 0, g: 0, b: 0, a: 1 }, storeOp: 'store' }]
          })
          pass.setPipeline(pipeline!)
          pass.setBindGroup(0, bindGroup!)
          pass.draw(6, 1, 0, 0)
          pass.end()
          dev.queue.submit([encoder.finish()])
          raf = requestAnimationFrame(frame)
        }
        raf = requestAnimationFrame(frame)
      } catch (e: any) {
        setError(e?.message || 'WebGPU init failed')
      }
    }
    init()
    const initAudio = async () => {
      try {
        if (typeof audioLevel === 'number') return
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
        const ctx = new (window.AudioContext || (window as any).webkitAudioContext)()
        const src = ctx.createMediaStreamSource(stream)
        const analyser = ctx.createAnalyser()
        analyser.fftSize = 512
        src.connect(analyser)
        audioRef.current = { ctx, analyser }
        const buf = new Uint8Array(analyser.frequencyBinCount)
        const loop = () => {
          analyser.getByteFrequencyData(buf)
          const avg = buf.reduce((a, b) => a + b, 0) / buf.length
          setMicLevel(avg / 255)
          requestAnimationFrame(loop)
        }
        loop()
      } catch { }
    }
    initAudio()
    return () => {
      cancelAnimationFrame(raf)
    }
  }, [])

  return (
    <div className="bg-gray-900 rounded-lg p-4 border border-gray-700">
      <canvas ref={canvasRef} width={width} height={height} className="w-full rounded-lg bg-black" />
      {error && <div className="text-red-400 mt-2 text-sm">{error}</div>}
    </div>
  )
}

export default WGSLWebGPUFractal
