import * as tf from '@tensorflow/tfjs';

export interface ShaderTemplate {
  name: string;
  template: string;
  parameters: string[];
  category: 'fractal' | 'audio-reactive' | 'biometric' | 'abstract';
}

export interface ShaderGenerationRequest {
  prompt: string;
  type: 'fractal' | 'audio-reactive' | 'biometric' | 'abstract';
  biometricData?: any;
  audioData?: Float32Array;
}

export class AIShaderGenerator {
  private model: tf.LayersModel | null = null;
  private templates: Map<string, ShaderTemplate> = new Map();

  constructor() {
    this.initializeTemplates();
  }

  private initializeTemplates() {
    // Real WGSL shader templates from Shader Studio reference
    this.templates.set('fractal', {
      name: 'Mandelbrot Fractal',
      template: `
struct Uniforms {
    time: f32,
    resolution: vec2<f32>,
    biometric_data: vec4<f32>,
    audio_bands: vec4<f32>
};

@group(0) @binding(0) var<uniform> uniforms: Uniforms;

@vertex
fn vs_main(@builtin(vertex_index) vertex_index: u32) -> @builtin(position) vec4<f32> {
    const vertices = array<vec2<f32>, 6>(
        vec2<f32>(-1.0, -1.0),
        vec2<f32>( 1.0, -1.0),
        vec2<f32>(-1.0,  1.0),
        vec2<f32>(-1.0,  1.0),
        vec2<f32>( 1.0, -1.0),
        vec2<f32>( 1.0,  1.0)
    );
    return vec4<f32>(vertices[vertex_index], 0.0, 1.0);
}

@fragment
fn fs_main(@builtin(position) frag_coord: vec4<f32>) -> @location(0) vec4<f32> {
    let uv = (frag_coord.xy / uniforms.resolution.xy) * 2.0 - 1.0;
    let aspect = uniforms.resolution.x / uniforms.resolution.y;
    let coord = vec2<f32>(uv.x * aspect, uv.y);
    
    // Mandelbrot set with biometric influence
    var z = vec2<f32>(coord.x * 2.0 + uniforms.biometric_data.x * 0.5, coord.y * 2.0 + uniforms.biometric_data.y * 0.5);
    var c = z;
    var iter = 0.0;
    
    for (var i = 0; i < 100; i = i + 1) {
        if (length(z) > 2.0) {
            break;
        }
        z = vec2<f32>(z.x * z.x - z.y * z.y + c.x, 2.0 * z.x * z.y + c.y);
        iter = f32(i);
    }
    
    let color = vec3<f32>(
        iter / 100.0 + uniforms.audio_bands.x * 0.3,
        iter / 100.0 + uniforms.audio_bands.y * 0.3,
        iter / 100.0 + uniforms.audio_bands.z * 0.3
    );
    
    return vec4<f32>(color, 1.0);
}`,
      parameters: ['time', 'resolution', 'biometric_data', 'audio_bands'],
      category: 'fractal'
    });

    this.templates.set('audio-reactive', {
      name: 'Audio Reactive Waves',
      template: `
struct Uniforms {
    time: f32,
    resolution: vec2<f32>,
    audio_bands: vec4<f32>,
    biometric_data: vec4<f32>
};

@group(0) @binding(0) var<uniform> uniforms: Uniforms;

@vertex
fn vs_main(@builtin(vertex_index) vertex_index: u32) -> @builtin(position) vec4<f32> {
    const vertices = array<vec2<f32>, 6>(
        vec2<f32>(-1.0, -1.0),
        vec2<f32>( 1.0, -1.0),
        vec2<f32>(-1.0,  1.0),
        vec2<f32>(-1.0,  1.0),
        vec2<f32>( 1.0, -1.0),
        vec2<f32>( 1.0,  1.0)
    );
    return vec4<f32>(vertices[vertex_index], 0.0, 1.0);
}

@fragment
fn fs_main(@builtin(position) frag_coord: vec4<f32>) -> @location(0) vec4<f32> {
    let uv = frag_coord.xy / uniforms.resolution.xy;
    let time = uniforms.time;
    
    // Audio-reactive waves
    var wave = 0.0;
    wave = wave + sin(uv.x * 10.0 + time * 2.0) * uniforms.audio_bands.x;
    wave = wave + sin(uv.x * 20.0 + time * 3.0) * uniforms.audio_bands.y;
    wave = wave + sin(uv.x * 30.0 + time * 4.0) * uniforms.audio_bands.z;
    wave = wave + sin(uv.x * 40.0 + time * 5.0) * uniforms.audio_bands.w;
    
    // Biometric influence
    wave = wave + uniforms.biometric_data.x * 0.2;
    
    let intensity = smoothstep(0.0, 1.0, abs(wave));
    
    let color = vec3<f32>(
        intensity + uniforms.audio_bands.x * 0.5,
        intensity + uniforms.audio_bands.y * 0.5,
        intensity + uniforms.audio_bands.z * 0.5
    );
    
    return vec4<f32>(color, 1.0);
}`,
      parameters: ['time', 'resolution', 'audio_bands', 'biometric_data'],
      category: 'audio-reactive'
    });

    this.templates.set('biometric', {
      name: 'Biometric Visualization',
      template: `
struct Uniforms {
    time: f32,
    resolution: vec2<f32>,
    biometric_data: vec4<f32>,
    heart_rate: f32,
    breathing_rate: f32
};

@group(0) @binding(0) var<uniform> uniforms: Uniforms;

@vertex
fn vs_main(@builtin(vertex_index) vertex_index: u32) -> @builtin(position) vec4<f32> {
    const vertices = array<vec2<f32>, 6>(
        vec2<f32>(-1.0, -1.0),
        vec2<f32>( 1.0, -1.0),
        vec2<f32>(-1.0,  1.0),
        vec2<f32>(-1.0,  1.0),
        vec2<f32>( 1.0, -1.0),
        vec2<f32>( 1.0,  1.0)
    );
    return vec4<f32>(vertices[vertex_index], 0.0, 1.0);
}

@fragment
fn fs_main(@builtin(position) frag_coord: vec4<f32>) -> @location(0) vec4<f32> {
    let uv = (frag_coord.xy / uniforms.resolution.xy) * 2.0 - 1.0;
    let time = uniforms.time;
    
    // Heart rate pulse
    let pulse = sin(time * uniforms.heart_rate * 0.1);
    
    // Breathing wave
    let breath = sin(time * uniforms.breathing_rate * 0.05);
    
    // Biometric data visualization
    let valence = uniforms.biometric_data.x;
    let arousal = uniforms.biometric_data.y;
    let dominance = uniforms.biometric_data.z;
    let confidence = uniforms.biometric_data.w;
    
    // Create biometric pattern
    var pattern = 0.0;
    pattern = pattern + sin(uv.x * 20.0 + pulse) * valence;
    pattern = pattern + cos(uv.y * 20.0 + breath) * arousal;
    pattern = pattern + sin(length(uv) * 30.0 + time) * dominance;
    
    let intensity = smoothstep(-1.0, 1.0, pattern) * confidence;
    
    let color = vec3<f32>(
        intensity + valence * 0.5,
        intensity + arousal * 0.5,
        intensity + dominance * 0.5
    );
    
    return vec4<f32>(color, 1.0);
}`,
      parameters: ['time', 'resolution', 'biometric_data', 'heart_rate', 'breathing_rate'],
      category: 'biometric'
    });
  }

  async initialize() {
    try {
      // Load pre-trained model for shader generation
      // This would normally load a real TensorFlow.js model
      console.log('Initializing AI Shader Generator...');
      
      // Create a simple neural network for shader parameter prediction
      this.model = tf.sequential({
        layers: [
          tf.layers.dense({ inputShape: [10], units: 64, activation: 'relu' }),
          tf.layers.dense({ units: 32, activation: 'relu' }),
          tf.layers.dense({ units: 16, activation: 'linear' })
        ]
      });
      
      this.model.compile({
        optimizer: 'adam',
        loss: 'meanSquaredError'
      });
      
      console.log('AI Shader Generator initialized successfully');
    } catch (error) {
      console.error('Failed to initialize AI Shader Generator:', error);
      throw error;
    }
  }

  async generateShader(request: ShaderGenerationRequest): Promise<string> {
    if (!this.model) {
      throw new Error('AI Shader Generator not initialized');
    }

    try {
      // Extract features from prompt
      const promptFeatures = this.extractPromptFeatures(request.prompt);
      
      // Get biometric features if available
      const biometricFeatures = request.biometricData ? 
        this.extractBiometricFeatures(request.biometricData) : 
        new Array(4).fill(0.5);
      
      // Get audio features if available
      const audioFeatures = request.audioData ?
        this.extractAudioFeatures(request.audioData) :
        new Array(4).fill(0.5);
      
      // Combine all features
      const inputFeatures = [...promptFeatures, ...biometricFeatures, ...audioFeatures];
      
      // Predict shader parameters using AI model
      const inputTensor = tf.tensor2d([inputFeatures]);
      const prediction = this.model.predict(inputTensor) as tf.Tensor;
      const parameters = await prediction.array();
      
      // Get appropriate template
      const template = this.templates.get(request.type);
      if (!template) {
        throw new Error(`Unknown shader type: ${request.type}`);
      }
      
      // Generate final shader with AI-predicted parameters
      const paramsArray = Array.isArray(parameters) && Array.isArray(parameters[0]) ? parameters[0] : [0.5, 0.5, 0.5, 0.5, 0.5, 0.5];
      const shader = this.customizeTemplate(template, paramsArray);
      
      // Clean up tensors
      inputTensor.dispose();
      prediction.dispose();
      
      return shader;
    } catch (error) {
      console.error('Shader generation failed:', error);
      throw error;
    }
  }

  private extractPromptFeatures(prompt: string): number[] {
    // Simple feature extraction from prompt
    const features = new Array(6).fill(0);
    
    const keywords = {
      fractal: ['fractal', 'mandelbrot', 'julia', 'complex'],
      audio: ['audio', 'sound', 'music', 'wave', 'frequency'],
      biometric: ['biometric', 'emotion', 'heart', 'brain', 'eeg'],
      colorful: ['colorful', 'vibrant', 'bright', 'rainbow'],
      dark: ['dark', 'moody', 'shadow', 'night'],
      fast: ['fast', 'quick', 'rapid', 'dynamic']
    };
    
    const lowerPrompt = prompt.toLowerCase();
    let featureIndex = 0;
    
    for (const [, words] of Object.entries(keywords)) {
      for (const word of words) {
        if (lowerPrompt.includes(word)) {
          features[featureIndex] = 1.0;
          break;
        }
      }
      featureIndex++;
    }
    
    return features;
  }

  private extractBiometricFeatures(biometricData: any): number[] {
    // Extract key biometric features
    return [
      biometricData.valence || 0.5,
      biometricData.arousal || 0.5,
      biometricData.dominance || 0.5,
      biometricData.confidence || 0.5
    ];
  }

  private extractAudioFeatures(audioData: Float32Array): number[] {
    // Extract audio frequency bands
    const bands = 4;
    const bandSize = Math.floor(audioData.length / bands);
    const features = [];
    
    for (let i = 0; i < bands; i++) {
      const start = i * bandSize;
      const end = (i + 1) * bandSize;
      const band = audioData.slice(start, end);
      const average = band.reduce((a, b) => a + b, 0) / band.length;
      features.push(average);
    }
    
    return features;
  }

  private customizeTemplate(template: ShaderTemplate, parameters: number[]): string {
    // Customize template with AI-predicted parameters
    let shader = template.template;
    
    // Replace template parameters with AI predictions
    template.parameters.forEach((param, index) => {
      const value = parameters[index % parameters.length];
      const regex = new RegExp(`\\b${param}\\b`, 'g');
      shader = shader.replace(regex, value.toString());
    });
    
    return shader;
  }

  getAvailableTemplates(): ShaderTemplate[] {
    return Array.from(this.templates.values());
  }

  dispose() {
    if (this.model) {
      this.model.dispose();
      this.model = null;
    }
  }
}