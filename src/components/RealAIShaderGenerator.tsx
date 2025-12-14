import React, { useState, useCallback, useRef } from 'react';
import * as tf from '@tensorflow/tfjs';
import { supabase } from '../lib/supabase';

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
  const generateShaderParameters = useCallback(async (biometricInput: any) => {
    if (!modelRef.current) {
      console.warn('AI model not initialized, using default parameters');
      return {
        timeScale: 1.0,
        colorIntensity: 1.0,
        waveFrequency: 3.0,
        complexity: 0.5,
        emotionInfluence: 0.7
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
      const paramsArray = await parameters.array();
      
      const paramVector = paramsArray[0] as number[];
      
      // Convert model output to shader parameters
      const shaderParams = {
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
        emotionInfluence: 0.7
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
        await supabase.from('ai_generated_shaders').insert({
          id: shaderId,
          name: generatedShader.name,
          wgsl_code: wgslCode,
          biometric_inputs: generatedShader.biometricInputs,
          parameters: parameters,
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
    <div className={`real-ai-shader-generator ${className}`}>
      <div className="generator-header">
        <h3>AI Shader Generator</h3>
        <p className="description">Generate WGSL shaders using real AI and biometric data</p>
      </div>
      
      <div className="template-selection">
        <label>Shader Template:</label>
        <select 
          value={selectedTemplate.name} 
          onChange={(e) => {
            const template = SHADER_TEMPLATES.find(t => t.name === e.target.value);
            if (template) setSelectedTemplate(template);
          }}
          disabled={isGenerating}
        >
          {SHADER_TEMPLATES.map(template => (
            <option key={template.name} value={template.name}>
              {template.name} ({template.category})
            </option>
          ))}
        </select>
        <p className="template-description">{selectedTemplate.description}</p>
      </div>
      
      <div className="generation-controls">
        <button 
          onClick={generateWithBiometrics}
          disabled={isGenerating || !biometricData}
          className="generate-button"
        >
          {isGenerating ? 'Generating...' : 'Generate with Biometrics'}
        </button>
        
        <button 
          onClick={() => generateShader(selectedTemplate)}
          disabled={isGenerating}
          className="generate-button secondary"
        >
          Generate Default
        </button>
      </div>
      
      {biometricData && (
        <div className="biometric-status">
          <div className="status-indicator active"></div>
          <span>Biometric data active</span>
          <div className="biometric-summary">
            HR: {Math.round(biometricData.heartRate || 0)} | 
            Stress: {Math.round((biometricData.stressLevel || 0) * 100)}% |
            Valence: {(biometricData.emotion?.valence || 0).toFixed(2)}
          </div>
        </div>
      )}
      
      {generatedShaders.length > 0 && (
        <div className="generated-shaders">
          <h4>Recently Generated Shaders</h4>
          <div className="shader-list">
            {generatedShaders.map(shader => (
              <div key={shader.id} className="shader-item">
                <div className="shader-name">{shader.name}</div>
                <div className="shader-details">
                  <span className="shader-date">
                    {shader.createdAt.toLocaleTimeString()}
                  </span>
                  <span className="shader-params">
                    {Object.keys(shader.parameters).length} parameters
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
      
      <style jsx>{`
        .real-ai-shader-generator {
          background: linear-gradient(135deg, #1a1a2e, #16213e);
          border-radius: 12px;
          padding: 20px;
          color: white;
          font-family: 'Inter', sans-serif;
          border: 1px solid #333;
        }
        
        .generator-header {
          margin-bottom: 20px;
        }
        
        .generator-header h3 {
          margin: 0 0 8px 0;
          font-size: 18px;
          font-weight: 600;
          background: linear-gradient(45deg, #00d4ff, #ff00ff);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }
        
        .description {
          margin: 0;
          color: #aaa;
          font-size: 14px;
        }
        
        .template-selection {
          margin-bottom: 20px;
        }
        
        .template-selection label {
          display: block;
          margin-bottom: 8px;
          font-weight: 500;
          color: #ddd;
        }
        
        .template-selection select {
          width: 100%;
          padding: 10px;
          border: 1px solid #444;
          border-radius: 6px;
          background: #2a2a3e;
          color: white;
          font-size: 14px;
        }
        
        .template-description {
          margin-top: 8px;
          font-size: 12px;
          color: #aaa;
          font-style: italic;
        }
        
        .generation-controls {
          display: flex;
          gap: 10px;
          margin-bottom: 20px;
        }
        
        .generate-button {
          flex: 1;
          padding: 12px 20px;
          border: none;
          border-radius: 6px;
          background: linear-gradient(45deg, #00d4ff, #0099cc);
          color: white;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
        }
        
        .generate-button:hover:not(:disabled) {
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(0, 212, 255, 0.3);
        }
        
        .generate-button:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }
        
        .generate-button.secondary {
          background: linear-gradient(45deg, #666, #888);
        }
        
        .biometric-status {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 10px;
          background: rgba(0, 255, 0, 0.1);
          border: 1px solid rgba(0, 255, 0, 0.3);
          border-radius: 6px;
          margin-bottom: 20px;
        }
        
        .status-indicator {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: #666;
        }
        
        .status-indicator.active {
          background: #00ff00;
          animation: pulse 1.5s infinite;
        }
        
        .biometric-summary {
          margin-left: auto;
          font-size: 12px;
          color: #aaa;
        }
        
        .generated-shaders {
          border-top: 1px solid #333;
          padding-top: 20px;
        }
        
        .generated-shaders h4 {
          margin: 0 0 12px 0;
          font-size: 16px;
          color: #ddd;
        }
        
        .shader-list {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }
        
        .shader-item {
          padding: 10px;
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 6px;
          cursor: pointer;
          transition: all 0.2s ease;
        }
        
        .shader-item:hover {
          background: rgba(255, 255, 255, 0.1);
          border-color: rgba(255, 255, 255, 0.2);
        }
        
        .shader-name {
          font-weight: 500;
          color: #ddd;
          margin-bottom: 4px;
        }
        
        .shader-details {
          display: flex;
          justify-content: space-between;
          font-size: 12px;
          color: #aaa;
        }
        
        @keyframes pulse {
          0% { opacity: 1; }
          50% { opacity: 0.5; }
          100% { opacity: 1; }
        }
      `}</style>
    </div>
  );
};

export default RealAIShaderGenerator;