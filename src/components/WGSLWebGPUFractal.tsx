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
};
@group(0) @binding(0) var<uniform> uniforms: Uniforms;

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

fn mandelbrot(c: vec2<f32>) -> f32 {
  var z = vec2<f32>(0.0, 0.0);
  var iter: i32 = 0;
  let maxIter: i32 = 200;
  loop {
    if (iter >= maxIter) { break; }
    let x = (z.x * z.x - z.y * z.y) + c.x;
    let y = (2.0 * z.x * z.y) + c.y;
    z = vec2<f32>(x, y);
    if (dot(z, z) > 4.0) { break; }
    iter = iter + 1;
  }
  return f32(iter) / f32(maxIter);
}

@fragment
fn fs_main(@builtin(position) fragCoord: vec4<f32>) -> @location(0) vec4<f32> {
  let uv = fragCoord.xy / uniforms.resolution;
  let aspect = uniforms.resolution.x / uniforms.resolution.y;

  let zoom = 1.3 + 0.6 * uniforms.audio + 0.2 * sin(uniforms.time * 0.2);
  let jitter = 0.05 * uniforms.hands + 0.03 * uniforms.faces + 0.02 * uniforms.gestures;
  let center = vec2<f32>(
    -0.5 + 0.25 * uniforms.valence + 0.2 * sin(uniforms.time * 0.1) + jitter,
    0.0 + 0.25 * uniforms.arousal + 0.2 * cos(uniforms.time * 0.13) - jitter
  );
  let p = (uv * 2.0 - vec2<f32>(1.0, 1.0)) * vec2<f32>(aspect, 1.0) / zoom + center;

  let t = mandelbrot(p);
  let hueShift = uniforms.dominance * 0.4;
  let color = vec3<f32>(
    0.5 + 0.5 * sin(6.2831 * t + uniforms.time * 0.1 + hueShift),
    t,
    0.5 + 0.5 * cos(6.2831 * t + uniforms.time * 0.08 + hueShift)
  );
  return vec4<f32>(color, 1.0);
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
          size: (10 * 4),
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
          const val = emotion?.valence ?? 0.5
          const aro = emotion?.arousal ?? 0.5
          const dom = emotion?.dominance ?? 0.5
          const u = new Float32Array([time, resolution[0], resolution[1], audio, hands, faces, gestures, val, aro, dom])
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
      } catch {}
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
