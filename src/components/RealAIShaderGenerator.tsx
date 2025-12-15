import React, { useState, useCallback, useRef } from 'react';
import * as tf from '@tensorflow/tfjs';
import { supabase } from '../lib/supabase';

type ShaderParams = {
  timeScale: number;
  colorIntensity: number;
  waveFrequency: number;
  complexity: number;
  emotionInfluence: number;
  neuralActivation: number;
  fractalDetail: number;
  colorShift: number;
  waveAmplitude: number;
  speedVariation: number;
};

interface ShaderTemplate {
  name: string;
  template: string;
  description: string;
  category: 'fractal' | 'neural' | 'biometric' | 'audio' | 'abstract';
}

interface GeneratedShader {
  id: string;
  name: string;
  wgslCode: string;
  biometricInputs: string[];
  parameters: Record<string, number>;
  createdAt: Date;
}

interface RealAIShaderGeneratorProps {
  biometricData?: any;
  onShaderGenerated?: (shader: GeneratedShader) => void;
  className?: string;
}

const SHADER_TEMPLATES: ShaderTemplate[] = [
  {
    name: "Biometric Fractal",
    category: "fractal",
    description: "Fractal patterns that respond to biometric data",
    template: `
@group(0) @binding(0) var<uniform> uniforms: Uniforms;
@group(0) @binding(1) var<uniform> biometrics: BiometricUniforms;

struct Uniforms {
  time: f32,
  resolution: vec2<f32>,
  mouse: vec2<f32>
};

struct BiometricUniforms {
  heartRate: f32,
  stressLevel: f32,
  valence: f32,
  arousal: f32,
  dominance: f32,
  eeg_delta: f32,
  eeg_theta: f32,
  eeg_alpha: f32,
  eeg_beta: f32,
  eeg_gamma: f32
};

@vertex
fn vs_main(@builtin(vertex_index) vertexIndex: u32) -> @builtin(position) vec4<f32> {
  var pos = array<vec2<f32>, 6>(
    vec2<f32>(-1.0, -1.0),
    vec2<f32>( 1.0, -1.0),
    vec2<f32>(-1.0,  1.0),
    vec2<f32>(-1.0,  1.0),
    vec2<f32>( 1.0, -1.0),
    vec2<f32>( 1.0,  1.0)
  );
  return vec4<f32>(pos[vertexIndex], 0.0, 1.0);
}

@fragment
fn fs_main(@builtin(position) fragCoord: vec4<f32>) -> @location(0) vec4<f32> {
  let uv = (fragCoord.xy / uniforms.resolution.xy) * 2.0 - 1.0;
  let t = uniforms.time + biometrics.heartRate * 0.1;
  
  // Mandelbrot set with biometric modulation
  var z = vec2<f32>(uv.x * (1.0 + biometrics.stressLevel), uv.y * (1.0 + biometrics.valence * 0.3));
  var c = vec2<f32>(
    biometrics.eeg_alpha * 0.5 - 0.8,
    biometrics.eeg_beta * 0.5 - 0.2 + sin(t * 0.1) * 0.1
  );
  
  var iterations = 0;
  for (var i = 0; i < 100; i = i + 1) {
    if (length(z) > 2.0) {
      break;
    }
    z = vec2<f32>(
      z.x * z.x - z.y * z.y + c.x,
      2.0 * z.x * z.y + c.y
    );
    iterations = i;
  }
  
  let color = f32(iterations) / 100.0;
  let r = color * (1.0 + biometrics.eeg_delta * 0.5);
  let g = color * (1.0 + biometrics.eeg_theta * 0.5);
  let b = color * (1.0 + biometrics.eeg_gamma * 0.5);
  
  return vec4<f32>(r, g, b, 1.0);
}
`
  },
  {
    name: "Neural Network Visualization",
    category: "neural",
    description: "Real-time neural network visualization with biometric inputs",
    template: `
@group(0) @binding(0) var<uniform> uniforms: Uniforms;
@group(0) @binding(1) var<uniform> biometrics: BiometricUniforms;

struct Uniforms {
  time: f32,
  resolution: vec2<f32>,
  mouse: vec2<f32>
};

struct BiometricUniforms {
  heartRate: f32,
  stressLevel: f32,
  valence: f32,
  arousal: f32,
  dominance: f32,
  eeg_delta: f32,
  eeg_theta: f32,
  eeg_alpha: f32,
  eeg_beta: f32,
  eeg_gamma: f32
};

@fragment
fn fs_main(@builtin(position) fragCoord: vec4<f32>) -> @location(0) vec4<f32> {
  let uv = fragCoord.xy / uniforms.resolution.xy;
  let t = uniforms.time + biometrics.heartRate * 0.05;
  
  // Neural network pattern
  let gridSize = 20.0 + biometrics.stressLevel * 10.0;
  let gridPos = floor(uv * gridSize) / gridSize;
  let center = gridPos + vec2<f32>(0.5 / gridSize);
  
  // Node activation based on biometric data
  let activation = sin(t + length(center - vec2<f32>(0.5)) * 10.0 + 
                    biometrics.eeg_alpha * 5.0 + biometrics.valence * 3.0);
  
  // Connection weights
  let weight = cos(length(uv - center) * 50.0 + biometrics.eeg_beta * 10.0);
  
  // Combine for final color
  let intensity = (activation * 0.5 + 0.5) * (weight * 0.3 + 0.7);
  
  let r = intensity * (1.0 + biometrics.arousal * 0.5);
  let g = intensity * (1.0 + biometrics.dominance * 0.3);
  let b = intensity * (1.0 + biometrics.eeg_gamma * 0.4);
  
  return vec4<f32>(r, g, b, 1.0);
}
`
  },
  {
    name: "Audio-Reactive Waves",
    category: "audio",
    description: "Wave patterns that respond to audio and biometric data",
    template: `
@group(0) @binding(0) var<uniform> uniforms: Uniforms;
@group(0) @binding(1) var<uniform> biometrics: BiometricUniforms;

struct Uniforms {
  time: f32,
  resolution: vec2<f32>,
  mouse: vec2<f32>
};

struct BiometricUniforms {
  heartRate: f32,
  stressLevel: f32,
  valence: f32,
  arousal: f32,
  dominance: f32,
  eeg_delta: f32,
  eeg_theta: f32,
  eeg_alpha: f32,
  eeg_beta: f32,
  eeg_gamma: f32
};

@fragment
fn fs_main(@builtin(position) fragCoord: vec4<f32>) -> @location(0) vec4<f32> {
  let uv = (fragCoord.xy / uniforms.resolution.xy) * 2.0 - 1.0;
  let t = uniforms.time + biometrics.heartRate * 0.1;
  
  // Wave parameters modulated by biometrics
  let waveSpeed = 1.0 + biometrics.stressLevel * 2.0;
  let waveFreq = 3.0 + biometrics.eeg_alpha * 5.0;
  let waveAmp = 0.3 + biometrics.arousal * 0.4;
  
  // Multiple wave layers
  let wave1 = sin(uv.x * waveFreq + t * waveSpeed) * waveAmp;
  let wave2 = sin(uv.y * waveFreq * 1.5 + t * waveSpeed * 0.7) * waveAmp * 0.7;
  let wave3 = sin(length(uv) * waveFreq * 2.0 + t * waveSpeed * 1.3) * waveAmp * 0.5;
  
  let combinedWave = wave1 + wave2 + wave3;
  
  // Color based on biometric emotional state
  let r = (combinedWave + 1.0) * 0.5 * (1.0 + biometrics.valence * 0.5);
  let g = (combinedWave + 1.0) * 0.5 * (1.0 + biometrics.dominance * 0.3);
  let b = abs(combinedWave) * (1.0 + biometrics.eeg_beta * 0.4);
  
  return vec4<f32>(r, g, b, 1.0);
}
`
  }
];

export const RealAIShaderGenerator: React.FC<RealAIShaderGeneratorProps> = ({
  biometricData,
  onShaderGenerated,
  className = ''
}) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<ShaderTemplate>(SHADER_TEMPLATES[0]);
  const [generatedShaders, setGeneratedShaders] = useState<GeneratedShader[]>([]);
  const [customPrompt, setCustomPrompt] = useState('');
  const modelRef = useRef<tf.LayersModel | null>(null);

  // Initialize TensorFlow.js model for shader generation
  const initializeModel = useCallback(async () => {
    try {
      // Create a simple neural network for shader parameter generation
      const model = tf.sequential({
        layers: [
          tf.layers.dense({ inputShape: [15], units: 64, activation: 'relu' }),
          tf.layers.dense({ units: 128, activation: 'relu' }),
          tf.layers.dense({ units: 64, activation: 'relu' }),
          tf.layers.dense({ units: 32, activation: 'tanh' }) // Output shader parameters
        ]
      });

      model.compile({
        optimizer: 'adam',
        loss: 'meanSquaredError'
      });

      modelRef.current = model;
      console.log('AI shader generation model initialized');
    } catch (error) {
      console.error('Failed to initialize AI model:', error);
    }
  }, []);

  // Generate shader parameters from biometric data using AI
  const generateShaderParameters = useCallback(async (biometricInput: any): Promise<ShaderParams> => {
    if (!modelRef.current) {
      console.warn('AI model not initialized, using default parameters');
      return {
        timeScale: 1.0,
        colorIntensity: 1.0,
        waveFrequency: 3.0,
        complexity: 0.5,
        emotionInfluence: 0.7,
        neuralActivation: 0.5,
        fractalDetail: 120,
        colorShift: 0,
        waveAmplitude: 0.4,
        speedVariation: 1.2
      };
    }

    try {
      // Convert biometric data to tensor input
      const inputTensor = tf.tensor2d([[
        biometricInput.heartRate / 100,
        biometricInput.stressLevel,
        biometricInput.emotion?.valence || 0,
        biometricInput.emotion?.arousal || 0.5,
        biometricInput.emotion?.dominance || 0.5,
        biometricInput.eegBands?.delta || 0.3,
        biometricInput.eegBands?.theta || 0.2,
        biometricInput.eegBands?.alpha || 0.4,
        biometricInput.eegBands?.beta || 0.3,
        biometricInput.eegBands?.gamma || 0.1,
        biometricInput.breathingRate / 20,
        Math.random(), // Random variation
        Date.now() / 10000, // Time-based variation
        biometricInput.facialExpression?.joy || 0,
        biometricInput.gestureConfidence || 0.8
      ]]);

      // Generate parameters using the model
      const parameters = await modelRef.current.predict(inputTensor) as tf.Tensor;
      const paramsArray = await parameters.array() as number[][];
      const paramVector = paramsArray[0] as number[];
      
      // Convert model output to shader parameters
      const shaderParams: ShaderParams = {
        timeScale: 0.5 + (paramVector[0] + 1) * 2.0, // 0.5 to 4.5
        colorIntensity: 0.5 + (paramVector[1] + 1) * 0.75, // 0.5 to 2.0
        waveFrequency: 1.0 + (paramVector[2] + 1) * 4.0, // 1.0 to 9.0
        complexity: 0.1 + (paramVector[3] + 1) * 0.45, // 0.1 to 1.0
        emotionInfluence: 0.2 + (paramVector[4] + 1) * 0.4, // 0.2 to 1.0
        neuralActivation: 0.3 + (paramVector[5] + 1) * 0.35, // 0.3 to 1.0
        fractalDetail: 50 + Math.floor((paramVector[6] + 1) * 75), // 50 to 200
        colorShift: paramVector[7] * Math.PI, // -π to π
        waveAmplitude: 0.1 + (paramVector[8] + 1) * 0.4, // 0.1 to 0.9
        speedVariation: 0.5 + (paramVector[9] + 1) * 2.0 // 0.5 to 4.5
      };

      // Clean up tensors
      inputTensor.dispose();
      parameters.dispose();

      return shaderParams;
    } catch (error) {
      console.error('Failed to generate shader parameters:', error);
      return {
        timeScale: 1.0,
        colorIntensity: 1.0,
        waveFrequency: 3.0,
        complexity: 0.5,
        emotionInfluence: 0.7,
        neuralActivation: 0.5,
        fractalDetail: 120,
        colorShift: 0,
        waveAmplitude: 0.4,
        speedVariation: 1.2
      };
    }
  }, []);

  // Generate WGSL shader code with AI-modified parameters
  const generateShader = useCallback(async (template: ShaderTemplate, biometricInput?: any) => {
    setIsGenerating(true);
    
    try {
      // Generate parameters using AI
      const parameters = await generateShaderParameters(biometricInput || {});
      
      // Modify template with AI-generated parameters
      let wgslCode = template.template;
      
      // Replace parameter placeholders with AI-generated values
      wgslCode = wgslCode.replace(/\/\/ AI_PARAM_TIME_SCALE/g, `${parameters.timeScale.toFixed(3)}`);
      wgslCode = wgslCode.replace(/\/\/ AI_PARAM_COLOR_INTENSITY/g, `${parameters.colorIntensity.toFixed(3)}`);
      wgslCode = wgslCode.replace(/\/\/ AI_PARAM_WAVE_FREQ/g, `${parameters.waveFrequency.toFixed(3)}`);
      wgslCode = wgslCode.replace(/\/\/ AI_PARAM_COMPLEXITY/g, `${parameters.complexity.toFixed(3)}`);
      wgslCode = wgslCode.replace(/\/\/ AI_PARAM_EMOTION_INFLUENCE/g, `${parameters.emotionInfluence.toFixed(3)}`);
      
      // Add AI-generated variations to the shader
      if (template.category === 'fractal') {
        wgslCode = wgslCode.replace('var iterations = 0;', `var iterations = 0;\n  let maxIterations = ${parameters.fractalDetail};`);
        wgslCode = wgslCode.replace('for (var i = 0; i < 100; i = i + 1)', `for (var i = 0; i < maxIterations; i = i + 1)`);
      }
      
      if (template.category === 'neural') {
        wgslCode = wgslCode.replace('let gridSize = 20.0', `let gridSize = ${(20.0 + parameters.complexity * 30.0).toFixed(1)}`);
      }
      
      if (template.category === 'audio') {
        wgslCode = wgslCode.replace('let waveAmp = 0.3', `let waveAmp = ${parameters.waveAmplitude.toFixed(3)}`);
        wgslCode = wgslCode.replace('let waveSpeed = 1.0', `let waveSpeed = ${parameters.speedVariation.toFixed(3)}`);
      }

      // Create unique shader ID
      const shaderId = `ai-shader-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      
      const generatedShader: GeneratedShader = {
        id: shaderId,
        name: `${template.name} - AI Generated`,
        wgslCode,
        biometricInputs: ['heartRate', 'stressLevel', 'emotion', 'eegBands'],
        parameters,
        createdAt: new Date()
      };

      // Store in Supabase
      try {
        const sb: any = supabase as any;
        await sb.from('ai_generated_shaders').insert({
          id: shaderId,
          name: generatedShader.name,
          wgsl_code: wgslCode,
          biometric_inputs: generatedShader.biometricInputs,
          time_scale: parameters.timeScale,
          color_intensity: parameters.colorIntensity,
          wave_frequency: parameters.waveFrequency,
          complexity: parameters.complexity,
          emotion_influence: parameters.emotionInfluence,
          neural_activation: parameters.neuralActivation,
          fractal_detail: parameters.fractalDetail,
          color_shift: parameters.colorShift,
          wave_amplitude: parameters.waveAmplitude,
          speed_variation: parameters.speedVariation,
          template_category: template.category,
          created_at: generatedShader.createdAt.toISOString()
        });
      } catch (error) {
        console.warn('Failed to store shader in Supabase:', error);
      }

      setGeneratedShaders(prev => [generatedShader, ...prev.slice(0, 9)]);
      
      if (onShaderGenerated) {
        onShaderGenerated(generatedShader);
      }
      
      return generatedShader;
    } catch (error) {
      console.error('Failed to generate shader:', error);
      throw error;
    } finally {
      setIsGenerating(false);
    }
  }, [generateShaderParameters, onShaderGenerated]);

  // Generate shader with current biometric data
  const generateWithBiometrics = useCallback(async () => {
    if (!biometricData) {
      console.warn('No biometric data available');
      return;
    }
    
    try {
      const shader = await generateShader(selectedTemplate, biometricData);
      console.log('Generated shader with biometrics:', shader);
    } catch (error) {
      console.error('Failed to generate shader with biometrics:', error);
    }
  }, [biometricData, selectedTemplate, generateShader]);

  // Initialize model on mount
  React.useEffect(() => {
    initializeModel();
    
    return () => {
      if (modelRef.current) {
        modelRef.current.dispose();
      }
    };
  }, [initializeModel]);

  // Auto-generate shader when biometric data updates
  React.useEffect(() => {
    if (biometricData && modelRef.current) {
      generateWithBiometrics();
    }
  }, [biometricData, generateWithBiometrics]);

  return (
    <div className={`bg-gradient-to-br from-indigo-900 to-indigo-950 rounded-xl p-5 text-white border border-gray-700 ${className}`}>
      <div className="mb-5">
        <h3 className="text-lg font-semibold bg-gradient-to-r from-cyan-400 to-fuchsia-500 bg-clip-text text-transparent">AI Shader Generator</h3>
        <p className="text-sm text-gray-300">Generate WGSL shaders using real AI and biometric data</p>
      </div>
      
      <div className="mb-5">
        <label className="block mb-2 font-medium text-gray-200">Shader Template:</label>
        <select 
          value={selectedTemplate.name} 
          onChange={(e) => {
            const template = SHADER_TEMPLATES.find(t => t.name === e.target.value);
            if (template) setSelectedTemplate(template);
          }}
          disabled={isGenerating}
          className="w-full px-3 py-2 bg-indigo-950/50 border border-gray-700 rounded-md text-white"
        >
          {SHADER_TEMPLATES.map(template => (
            <option key={template.name} value={template.name}>
              {template.name} ({template.category})
            </option>
          ))}
        </select>
        <p className="mt-2 text-xs text-gray-400 italic">{selectedTemplate.description}</p>
      </div>
      
      <div className="flex gap-3 mb-5">
        <button 
          onClick={generateWithBiometrics}
          disabled={isGenerating || !biometricData}
          className="flex-1 px-4 py-2 rounded-md bg-gradient-to-r from-cyan-500 to-blue-600 disabled:opacity-60"
        >
          {isGenerating ? 'Generating...' : 'Generate with Biometrics'}
        </button>
        
        <button 
          onClick={() => generateShader(selectedTemplate)}
          disabled={isGenerating}
          className="flex-1 px-4 py-2 rounded-md bg-gradient-to-r from-gray-500 to-gray-600 disabled:opacity-60"
        >
          Generate Default
        </button>
      </div>
      
      {biometricData && (
        <div className="flex items-center gap-2 p-3 bg-emerald-900/20 border border-emerald-500/30 rounded-md mb-5">
          <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span>Biometric data active</span>
          <div className="ml-auto text-xs text-gray-300">
            HR: {Math.round(biometricData.heartRate || 0)} | 
            Stress: {Math.round((biometricData.stressLevel || 0) * 100)}% |
            Valence: {(biometricData.emotion?.valence || 0).toFixed(2)}
          </div>
        </div>
      )}
      
      {generatedShaders.length > 0 && (
        <div className="mt-5 pt-5 border-t border-gray-700">
          <h4 className="text-base text-gray-200 mb-3">Recently Generated Shaders</h4>
          <div className="flex flex-col gap-2">
            {generatedShaders.map(shader => (
              <div key={shader.id} className="p-3 bg-white/5 border border-white/10 rounded-md">
                <div className="font-medium text-gray-200 mb-1">{shader.name}</div>
                <div className="flex justify-between text-xs text-gray-400">
                  <span>{shader.createdAt.toLocaleTimeString()}</span>
                  <span>{Object.keys(shader.parameters).length} parameters</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default RealAIShaderGenerator;
