import React, { useEffect, useRef } from 'react';
import tgpu from 'typegpu';
import * as d from 'typegpu/data';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

interface TypeGPUVisualizerProps {
    emotionalState: {
        valence: number;
        arousal: number;
        dominance: number;
        creativity: number;
        focus: number;
    };
}

export const TypeGPUVisualizer: React.FC<TypeGPUVisualizerProps> = ({ emotionalState }) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        let active = true;
        let root: any = null;

        const initWebGPU = async () => {
            if (!canvasRef.current) return;

            try {
                // Initialize TypeGPU root
                root = await tgpu.init();

                const context = (canvasRef.current.getContext('webgpu') as any);
                if (!context) {
                    console.error("WebGPU not supported");
                    return;
                }

                const presentationFormat = navigator.gpu.getPreferredCanvasFormat();
                context.configure({
                    device: root.device,
                    format: presentationFormat,
                    alphaMode: 'premultiplied',
                });

                // Vertex Shader: Full-screen quad
                const vertexShader = `
                @vertex
                fn main(@builtin(vertex_index) vertexIndex: u32) -> @builtin(position) vec4f {
                    const pos = array(
                        vec2f(-1, -1), vec2f(1, -1), vec2f(-1, 1),
                        vec2f(-1, 1), vec2f(1, -1), vec2f(1, 1)
                    );
                    return vec4f(pos[vertexIndex], 0.0, 1.0);
                }
                `;

                // Fragment Shader: Emotional Aura
                const fragmentShader = `
                @group(0) @binding(0) var<uniform> data: EmotionData;

                struct EmotionData {
                    valence: f32,
                    arousal: f32,
                    dominance: f32,
                    creativity: f32,
                    focus: f32,
                    time: f32,
                };

                @fragment
                fn main(@builtin(position) fragCoord: vec4f) -> @location(0) vec4f {
                    let res = vec2f(300.0, 200.0); // Canvas resolution
                    let uv = (fragCoord.xy * 2.0 - res) / min(res.x, res.y);
                    
                    let dist = length(uv);
                    let angle = atan2(uv.y, uv.x);
                    
                    // Base color driven by valence, arousal, dominance, creativity, and focus
                    let r = (data.valence + 1.0) * 0.5 + data.creativity * 0.3;
                    let g = (data.arousal + 1.0) * 0.5 + data.focus * 0.3;
                    let b = (data.dominance + 1.0) * 0.5;
                    
                    // Harmonic distortion and movement driven by arousal, creativity, and time
                    let wave = sin(dist * 10.0 - data.time * 5.0 * data.arousal + angle * 3.0 + data.creativity * 2.0) * 0.1 * data.arousal;
                    let mask = smoothstep(0.6 + wave, 0.5 + wave, dist);
                    
                    let aura = vec3f(r, g, b) * mask;
                    let glow = vec3f(r, g, b) * (0.2 / (dist + 0.1));
                    
                    return vec4f(aura + glow * 0.5, mask);
                }
                `;

                const shaderModule = root.device.createShaderModule({
                    code: vertexShader + fragmentShader,
                });

                // Uniform Buffer for emotional state
                const uniformBufferSize = 24; // 6 floats
                const uniformBuffer = root.device.createBuffer({
                    size: uniformBufferSize,
                    usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
                });

                const pipeline = root.device.createRenderPipeline({
                    layout: 'auto',
                    vertex: {
                        module: shaderModule,
                        entryPoint: 'main',
                    },
                    fragment: {
                        module: shaderModule,
                        entryPoint: 'main',
                        targets: [{
                            format: presentationFormat, blend: {
                                color: { srcFactor: 'src-alpha', dstFactor: 'one-minus-src-alpha' },
                                alpha: { srcFactor: 'one', dstFactor: 'one' }
                            }
                        }],
                    },
                    primitive: { topology: 'triangle-list' },
                });

                const bindGroup = root.device.createBindGroup({
                    layout: pipeline.getBindGroupLayout(0),
                    entries: [{ binding: 0, resource: { buffer: uniformBuffer } }],
                });

                let startTime = Date.now();

                const render = () => {
                    if (!active || !canvasRef.current) return;

                    const time = (Date.now() - startTime) / 1000;
                    const { valence, arousal, dominance, creativity, focus } = emotionalState;

                    // Update Uniforms
                    const uniformData = new Float32Array([valence, arousal, dominance, creativity, focus, time]);
                    root.device.queue.writeBuffer(uniformBuffer, 0, uniformData);

                    const commandEncoder = root.device.createCommandEncoder();
                    const textureView = context.getCurrentTexture().createView();

                    const renderPassDescriptor: GPURenderPassDescriptor = {
                        colorAttachments: [
                            {
                                view: textureView,
                                clearValue: { r: 0, g: 0, b: 0, a: 0 },
                                loadOp: 'clear',
                                storeOp: 'store',
                            },
                        ],
                    };

                    const passEncoder = commandEncoder.beginRenderPass(renderPassDescriptor);
                    passEncoder.setPipeline(pipeline);
                    passEncoder.setBindGroup(0, bindGroup);
                    passEncoder.draw(6);
                    passEncoder.end();
                    root.device.queue.submit([commandEncoder.finish()]);

                    requestAnimationFrame(render);
                };

                render();
            } catch (err) {
                console.error("TypeGPU initialization error:", err);
            }
        };

        initWebGPU();

        return () => {
            active = false;
        };
    }, [emotionalState]);

    return (
        <Card className="bg-black/40 border border-blue-500/20">
            <CardHeader>
                <CardTitle className="text-blue-300">⚡ TypeGPU Emotional Aura</CardTitle>
            </CardHeader>
            <CardContent>
                <canvas
                    ref={canvasRef}
                    width={300}
                    height={200}
                    className="w-full h-40 rounded-lg shadow-inner bg-transparent"
                />
                <CardDescription className="mt-2 text-xs text-blue-200/60 text-center italic">
                    Real-time WGSL Render Pipeline modulated by VAD
                </CardDescription>
            </CardContent>
        </Card>
    );
};

export default TypeGPUVisualizer;
