// WebGPU Engine for WGSL Studio
class WebGPUEngine {
    constructor(canvas) {
        this.canvas = canvas;
        this.device = null;
        this.context = null;
        this.pipeline = null;
        this.uniformBuffer = null;
        this.uniformBindGroup = null;
        this.time = 0;
        this.isSupported = false;
    }

    async initialize() {
        if (!navigator.gpu) {
            console.warn('WebGPU not supported');
            return false;
        }

        try {
            const adapter = await navigator.gpu.requestAdapter();
            if (!adapter) {
                console.warn('No WebGPU adapter available');
                return false;
            }

            this.device = await adapter.requestDevice();
            this.context = this.canvas.getContext('webgpu');
            
            if (!this.context) {
                console.warn('Failed to get WebGPU context');
                return false;
            }

            const format = navigator.gpu.getPreferredCanvasFormat();
            this.context.configure({
                device: this.device,
                format: format,
                alphaMode: 'premultiplied'
            });

            // Create uniform buffer for shader parameters
            this.uniformBuffer = this.device.createBuffer({
                size: 32, // 8 floats (time, resolution.x, resolution.y, zoom, iterations, valence, arousal, dominance)
                usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST
            });

            // Create a default rendering pipeline
            await this.createDefaultPipeline();

            this.isSupported = true;
            return true;
        } catch (error) {
            console.error('WebGPU initialization failed:', error);
            return false;
        }
    }

    async createDefaultPipeline() {
        if (!this.device || !this.context) return false;

        try {
            // Default vertex shader
            const vertexShader = `
                struct VertexOutput {
                    @builtin(position) position: vec4<f32>,
                    @location(0) uv: vec2<f32>,
                };

                @vertex
                fn vs_main(@builtin(vertex_index) vertex_index: u32) -> VertexOutput {
                    var out: VertexOutput;
                    if (vertex_index == 0) {
                        out.position = vec4<f32>(-1.0, -1.0, 0.0, 1.0);
                        out.uv = vec2<f32>(0.0, 0.0);
                    } else if (vertex_index == 1) {
                        out.position = vec4<f32>(3.0, -1.0, 0.0, 1.0);
                        out.uv = vec2<f32>(2.0, 0.0);
                    } else {
                        out.position = vec4<f32>(-1.0, 3.0, 0.0, 1.0);
                        out.uv = vec2<f32>(0.0, 2.0);
                    }
                    return out;
                }
            `;

            // Default fragment shader with emotional modulation
            const fragmentShader = `
                struct Uniforms {
                    time: f32,
                    resolution: vec2<f32>,
                    zoom: f32,
                    iterations: f32,
                    valence: f32,
                    arousal: f32,
                    dominance: f32,
                };

                @group(0) @binding(0) var<uniform> uniforms: Uniforms;

                @fragment
                fn fs_main(in: VertexOutput) -> @location(0) vec4<f32> {
                    let uv = in.uv;
                    
                    // Emotional modulation parameters
                    let time_mod = uniforms.time * (1.0 + uniforms.arousal);
                    let color_shift = uniforms.valence * 0.5;
                    let complexity = uniforms.dominance * 5.0;
                    
                    // Multi-layered visual effect with emotional modulation
                    let wave1 = sin(uv.x * 10.0 + time_mod) * 0.5;
                    let wave2 = cos(uv.y * 15.0 + time_mod * 1.3) * 0.3;
                    let wave3 = sin((uv.x + uv.y) * 7.0 + time_mod * 0.7) * 0.2;
                    
                    let height = (wave1 + wave2 + wave3) * (1.0 + complexity);
                    
                    // Color based on emotional state
                    let color = vec3<f32>(
                        0.5 + height + color_shift,
                        0.5 + height * 0.5 + uniforms.arousal * 0.3,
                        1.0 - abs(height) + uniforms.dominance * 0.4
                    );
                    
                    // Add some sparkle effect based on emotional intensity
                    let sparkle = sin(time_mod * 10.0 + uv.x * 50.0) * sin(time_mod * 7.0 + uv.y * 30.0);
                    let final_color = color + vec3<f32>(sparkle * uniforms.arousal * 0.2);
                    
                    return vec4<f32>(final_color, 1.0);
                }
            `;

            const vertexModule = this.device.createShaderModule({
                code: vertexShader
            });

            const fragmentModule = this.device.createShaderModule({
                code: fragmentShader
            });

            const pipeline = this.device.createRenderPipeline({
                layout: 'auto',
                vertex: {
                    module: vertexModule,
                    entryPoint: 'vs_main',
                },
                fragment: {
                    module: fragmentModule,
                    entryPoint: 'fs_main',
                    targets: [{
                        format: navigator.gpu.getPreferredCanvasFormat()
                    }]
                },
                primitive: {
                    topology: 'triangle-list'
                }
            });

            // Create bind group layout and bind group
            const bindGroupLayout = this.device.createBindGroupLayout({
                entries: [{
                    binding: 0,
                    visibility: GPUShaderStage.FRAGMENT,
                    buffer: {}
                }]
            });

            this.uniformBindGroup = this.device.createBindGroup({
                layout: bindGroupLayout,
                entries: [{
                    binding: 0,
                    resource: { buffer: this.uniformBuffer }
                }]
            });

            this.pipeline = pipeline;
            return true;
        } catch (error) {
            console.error('Pipeline creation failed:', error);
            return false;
        }
    }

    async createPipeline(vertexShaderCode, fragmentShaderCode) {
        if (!this.device || !this.context) return false;

        try {
            // Create separate shader modules for vertex and fragment shaders
            const vertexModule = this.device.createShaderModule({
                code: vertexShaderCode
            });

            const fragmentModule = this.device.createShaderModule({
                code: fragmentShaderCode
            });

            const pipeline = this.device.createRenderPipeline({
                layout: 'auto',
                vertex: {
                    module: vertexModule,
                    entryPoint: 'vs_main',
                },
                fragment: {
                    module: fragmentModule,
                    entryPoint: 'fs_main',
                    targets: [{
                        format: navigator.gpu.getPreferredCanvasFormat()
                    }]
                },
                primitive: {
                    topology: 'triangle-list'
                }
            });

            // Create bind group layout and bind group
            const bindGroupLayout = this.device.createBindGroupLayout({
                entries: [{
                    binding: 0,
                    visibility: GPUShaderStage.FRAGMENT,
                    buffer: {}
                }]
            });

            this.uniformBindGroup = this.device.createBindGroup({
                layout: bindGroupLayout,
                entries: [{
                    binding: 0,
                    resource: { buffer: this.uniformBuffer }
                }]
            });

            this.pipeline = pipeline;
            return true;
        } catch (error) {
            console.error('Pipeline creation failed:', error);
            return false;
        }
    }

    async createCustomPipeline(vertexShaderCode, fragmentShaderCode, uniformBindings) {
        if (!this.device || !this.context) return false;

        try {
            // Create separate shader modules for vertex and fragment shaders
            const vertexModule = this.device.createShaderModule({
                code: vertexShaderCode
            });

            const fragmentModule = this.device.createShaderModule({
                code: fragmentShaderCode
            });

            const pipeline = this.device.createRenderPipeline({
                layout: 'auto',
                vertex: {
                    module: vertexModule,
                    entryPoint: 'vs_main',
                },
                fragment: {
                    module: fragmentModule,
                    entryPoint: 'fs_main',
                    targets: [{
                        format: navigator.gpu.getPreferredCanvasFormat()
                    }]
                },
                primitive: {
                    topology: 'triangle-list'
                }
            });

            // Create bind group layout and bind group with custom bindings
            const bindGroupLayoutEntries = [];
            for (let i = 0; i < uniformBindings.length; i++) {
                bindGroupLayoutEntries.push({
                    binding: i,
                    visibility: GPUShaderStage.FRAGMENT,
                    buffer: {}
                });
            }

            const bindGroupLayout = this.device.createBindGroupLayout({
                entries: bindGroupLayoutEntries
            });

            const bindGroupEntries = [];
            for (let i = 0; i < uniformBindings.length; i++) {
                bindGroupEntries.push({
                    binding: i,
                    resource: { buffer: uniformBindings[i] }
                });
            }

            this.uniformBindGroup = this.device.createBindGroup({
                layout: bindGroupLayout,
                entries: bindGroupEntries
            });

            this.pipeline = pipeline;
            return true;
        } catch (error) {
            console.error('Custom pipeline creation failed:', error);
            return false;
        }
    }

    updateUniforms(params) {
        if (!this.device || !this.uniformBuffer) return;

        const {
            time = 0,
            resolution = [800, 600],
            zoom = 1.0,
            iterations = 100,
            valence = 0,
            arousal = 0.5,
            dominance = 0.5
        } = params;

        // Create uniform data
        const uniformData = new Float32Array([
            time,
            resolution[0],
            resolution[1],
            zoom,
            iterations,
            valence,
            arousal,
            dominance
        ]);

        this.device.queue.writeBuffer(this.uniformBuffer, 0, uniformData);
    }

    render() {
        if (!this.device || !this.context || !this.pipeline) return;

        const commandEncoder = this.device.createCommandEncoder();
        const textureView = this.context.getCurrentTexture().createView();

        const renderPassDescriptor = {
            colorAttachments: [{
                view: textureView,
                clearValue: { r: 0.0, g: 0.0, b: 0.0, a: 1.0 },
                loadOp: 'clear',
                storeOp: 'store'
            }]
        };

        const passEncoder = commandEncoder.beginRenderPass(renderPassDescriptor);
        passEncoder.setPipeline(this.pipeline);
        passEncoder.setBindGroup(0, this.uniformBindGroup);
        passEncoder.draw(6); // Draw fullscreen quad (2 triangles = 6 vertices)
        passEncoder.end();

        this.device.queue.submit([commandEncoder.finish()]);
    }

    isWebGPUSupported() {
        return this.isSupported;
    }
}

// Export for global use
window.WebGPUEngine = WebGPUEngine;