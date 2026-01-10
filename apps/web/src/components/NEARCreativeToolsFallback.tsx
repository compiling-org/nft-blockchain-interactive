import React, { useState, useRef } from 'react';

interface CreativeTool {
  id: string;
  name: string;
  type: 'fractal' | 'shader' | 'audio' | 'biometric' | 'ai' | 'neural';
  description: string;
  parameters: ToolParameter[];
}

interface ToolParameter {
  name: string;
  type: 'number' | 'string' | 'boolean' | 'color' | 'range';
  default: any;
  min?: number;
  max?: number;
  step?: number;
}

interface CreativeGeneration {
  id: string;
  toolId: string;
  parameters: Record<string, any>;
  result: any;
  emotionalState: EmotionalState;
  timestamp: number;
  gasUsed?: string;
  transactionHash?: string;
}

interface EmotionalState {
  valence: number;
  arousal: number;
  dominance: number;
  confidence: number;
  primaryEmotion: string;
}

interface NEARCreativeToolsFallbackProps {
  isConnected: boolean;
  accountId: string;
  contract: any;
  emotionalState: EmotionalState;
  onGenerationComplete: (generation: CreativeGeneration) => void;
  className?: string;
}

export const NEARCreativeToolsFallback: React.FC<NEARCreativeToolsFallbackProps> = ({
  isConnected,
  accountId,
  contract,
  emotionalState,
  onGenerationComplete,
  className = ''
}) => {
  const [selectedTool, setSelectedTool] = useState<CreativeTool | null>(null);
  const [toolParameters, setToolParameters] = useState<Record<string, any>>({});
  const [isGenerating, setIsGenerating] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Available creative tools with fallback implementations
  const availableTools: CreativeTool[] = [
    {
      id: 'emotional-fractals',
      name: 'Emotional Fractals',
      type: 'fractal',
      description: 'Generate fractals influenced by emotional state',
      parameters: [
        { name: 'iterations', type: 'range', default: 100, min: 50, max: 500, step: 10 },
        { name: 'zoom', type: 'range', default: 1, min: 0.1, max: 5, step: 0.1 },
        { name: 'colorIntensity', type: 'range', default: 0.8, min: 0, max: 1, step: 0.1 }
      ]
    },
    {
      id: 'ai-shaders',
      name: 'AI Shader Generator',
      type: 'shader',
      description: 'Create GLSL shaders with AI assistance',
      parameters: [
        { name: 'complexity', type: 'range', default: 3, min: 1, max: 10, step: 1 },
        { name: 'colorPalette', type: 'string', default: 'vibrant' },
        { name: 'animationSpeed', type: 'range', default: 1, min: 0.1, max: 5, step: 0.1 }
      ]
    },
    {
      id: 'neural-audio',
      name: 'Neural Audio Synthesis',
      type: 'audio',
      description: 'Synthesize audio using neural networks',
      parameters: [
        { name: 'frequency', type: 'range', default: 440, min: 200, max: 2000, step: 10 },
        { name: 'duration', type: 'range', default: 2, min: 0.5, max: 10, step: 0.5 },
        { name: 'waveform', type: 'string', default: 'sine' }
      ]
    },
    {
      id: 'biometric-art',
      name: 'Biometric Data Artist',
      type: 'biometric',
      description: 'Create art from biometric data',
      parameters: [
        { name: 'heartRateInfluence', type: 'range', default: 0.5, min: 0, max: 1, step: 0.1 },
        { name: 'emotionColor', type: 'color', default: '#ff6b6b' },
        { name: 'dataSmoothing', type: 'range', default: 0.8, min: 0, max: 1, step: 0.1 }
      ]
    },
    {
      id: 'pattern-recognition',
      name: 'Pattern Recognition',
      type: 'ai',
      description: 'ML-powered pattern recognition',
      parameters: [
        { name: 'sensitivity', type: 'range', default: 0.7, min: 0, max: 1, step: 0.1 },
        { name: 'featureCount', type: 'range', default: 5, min: 1, max: 20, step: 1 },
        { name: 'learningRate', type: 'range', default: 0.01, min: 0.001, max: 0.1, step: 0.001 }
      ]
    },
    {
      id: 'neural-evolution',
      name: 'Neural Evolution Engine',
      type: 'neural',
      description: 'Evolutionary algorithms for creative generation',
      parameters: [
        { name: 'populationSize', type: 'range', default: 50, min: 10, max: 200, step: 10 },
        { name: 'mutationRate', type: 'range', default: 0.1, min: 0.01, max: 0.5, step: 0.01 },
        { name: 'generations', type: 'range', default: 100, min: 10, max: 500, step: 10 }
      ]
    }
  ];

  const selectTool = (tool: CreativeTool) => {
    setSelectedTool(tool);
    // Initialize parameters with defaults
    const params: Record<string, any> = {};
    tool.parameters.forEach(param => {
      params[param.name] = param.default;
    });
    setToolParameters(params);
  };

  const updateParameter = (name: string, value: any) => {
    setToolParameters(prev => ({ ...prev, [name]: value }));
  };

  const generateWithTool = async () => {
    if (!selectedTool || !isConnected || !contract) {
      alert('Please connect your NEAR wallet first');
      return;
    }

    setIsGenerating(true);
    
    try {
      // Generate creative content based on tool type
      const result = await generateCreativeContent(selectedTool, toolParameters);
      
      // Create generation record
      const generation: CreativeGeneration = {
        id: `gen_${Date.now()}`,
        toolId: selectedTool.id,
        parameters: { ...toolParameters },
        result,
        emotionalState: { ...emotionalState },
        timestamp: Date.now(),
        gasUsed: '0.001', // Simulated gas usage
        transactionHash: `tx_${Math.random().toString(36).substr(2, 9)}`
      };

      // Record on blockchain
      await (contract as any).record_interaction({
        token_id: generation.id,
        interaction: `Generated ${selectedTool.name} with parameters: ${JSON.stringify(toolParameters)}`
      });

      // Notify parent component
      onGenerationComplete(generation);
      
    } catch (error) {
      console.error('Failed to generate creative content:', error);
      alert('Generation failed: ' + (error as Error).message);
    } finally {
      setIsGenerating(false);
    }
  };

  const generateCreativeContent = async (tool: CreativeTool, params: Record<string, any>) => {
    switch (tool.type) {
      case 'fractal':
        return generateEmotionalFractal(params);
      case 'shader':
        return generateAIShader(params);
      case 'audio':
        return generateNeuralAudio(params);
      case 'biometric':
        return generateBiometricArt(params);
      case 'ai':
        return generatePatternRecognition(params);
      case 'neural':
        return generateNeuralEvolution(params);
      default:
        throw new Error(`Unknown tool type: ${tool.type}`);
    }
  };

  const generateEmotionalFractal = (params: Record<string, any>) => {
    // Simple fractal generation using canvas
    if (!canvasRef.current) return null;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return null;

    const width = canvas.width;
    const height = canvas.height;
    const imageData = ctx.createImageData(width, height);
    
    // Generate fractal influenced by emotional state
    for (let x = 0; x < width; x++) {
      for (let y = 0; y < height; y++) {
        const zx = (x - width / 2) / (width / 4) * params.zoom;
        const zy = (y - height / 2) / (height / 4) * params.zoom;
        
        let cx = zx + emotionalState.valence * 0.5;
        let cy = zy + emotionalState.arousal * 0.5;
        
        let i = 0;
        for (; i < params.iterations; i++) {
          const tmp = cx * cx - cy * cy + zx;
          cy = 2 * cx * cy + zy;
          cx = tmp;
          
          if (cx * cx + cy * cy > 4) break;
        }
        
        const idx = (y * width + x) * 4;
        const color = i / params.iterations * 255 * params.colorIntensity;
        
        // Color influenced by emotional state
        imageData.data[idx] = color * (1 + emotionalState.valence); // Red
        imageData.data[idx + 1] = color * emotionalState.arousal; // Green  
        imageData.data[idx + 2] = color * (1 + emotionalState.dominance); // Blue
        imageData.data[idx + 3] = 255; // Alpha
      }
    }
    
    ctx.putImageData(imageData, 0, 0);
    return canvas.toDataURL();
  };

  const generateAIShader = (params: Record<string, any>) => {
    // Generate GLSL shader code
    const shaderCode = `
      precision mediump float;
      uniform float time;
      uniform vec2 resolution;
      
      void main() {
        vec2 uv = gl_FragCoord.xy / resolution.xy;
        vec3 color = vec3(0.0);
        
        // Complex pattern based on parameters
        for (int i = 0; i < ${params.complexity}; i++) {
          uv += sin(uv * ${params.animationSpeed.toFixed(1)} * time) * 0.1;
        }
        
        color = vec3(uv.x, uv.y, sin(time) * 0.5 + 0.5);
        gl_FragColor = vec4(color, 1.0);
      }
    `;
    
    return {
      shaderCode,
      type: 'fragment',
      complexity: params.complexity,
      animationSpeed: params.animationSpeed
    };
  };

  const generateNeuralAudio = (params: Record<string, any>) => {
    // Create audio context and generate sound
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    const duration = params.duration;
    const sampleRate = audioContext.sampleRate;
    const length = sampleRate * duration;
    
    const buffer = audioContext.createBuffer(1, length, sampleRate);
    const data = buffer.getChannelData(0);
    
    // Generate waveform influenced by emotional state
    for (let i = 0; i < length; i++) {
      const t = i / sampleRate;
      const frequency = params.frequency + emotionalState.valence * 100;
      
      switch (params.waveform) {
        case 'sine':
          data[i] = Math.sin(2 * Math.PI * frequency * t) * emotionalState.arousal;
          break;
        case 'square':
          data[i] = (Math.sin(2 * Math.PI * frequency * t) > 0 ? 1 : -1) * emotionalState.arousal;
          break;
        case 'sawtooth':
          data[i] = ((t * frequency) % 1) * 2 - 1;
          break;
        default:
          data[i] = Math.sin(2 * Math.PI * frequency * t) * emotionalState.arousal;
      }
      
      // Add emotional modulation
      data[i] *= (1 + emotionalState.dominance * 0.5);
    }
    
    return {
      buffer,
      duration,
      frequency: params.frequency,
      waveform: params.waveform,
      audioContext
    };
  };

  const generateBiometricArt = (params: Record<string, any>) => {
    // Create biometric-inspired art
    const heartRate = 60 + emotionalState.arousal * 40; // 60-100 BPM
    const colors = params.emotionColor;
    
    return {
      heartRate,
      emotionInfluence: params.heartRateInfluence,
      colorPalette: colors,
      smoothing: params.dataSmoothing,
      emotionalState: {
        primary: emotionalState.primaryEmotion,
        valence: emotionalState.valence,
        arousal: emotionalState.arousal,
        dominance: emotionalState.dominance
      }
    };
  };

  const generatePatternRecognition = (params: Record<string, any>) => {
    // Simulate ML pattern recognition
    const patterns = [
      { type: 'spiral', confidence: 0.8 * params.sensitivity },
      { type: 'grid', confidence: 0.6 * params.sensitivity },
      { type: 'fractal', confidence: 0.9 * params.sensitivity },
      { type: 'wave', confidence: 0.7 * params.sensitivity }
    ];
    
    return {
      detectedPatterns: patterns.filter(p => p.confidence > 0.5),
      featureCount: params.featureCount,
      sensitivity: params.sensitivity,
      learningRate: params.learningRate
    };
  };

  const generateNeuralEvolution = (params: Record<string, any>) => {
    // Simulate evolutionary algorithm
    const population = [];
    for (let i = 0; i < params.populationSize; i++) {
      population.push({
        id: i,
        fitness: Math.random() * emotionalState.confidence,
        genes: Array.from({ length: 10 }, () => Math.random()),
        generation: 0
      });
    }
    
    // Simulate evolution
    for (let gen = 0; gen < params.generations; gen++) {
      population.forEach(individual => {
        if (Math.random() < params.mutationRate) {
          individual.genes = individual.genes.map(gene => 
            gene + (Math.random() - 0.5) * 0.1
          );
        }
        individual.fitness = Math.random() * emotionalState.confidence;
        individual.generation = gen;
      });
    }
    
    return {
      population: population.sort((a, b) => b.fitness - a.fitness).slice(0, 10),
      bestIndividual: population[0],
      totalGenerations: params.generations,
      mutationRate: params.mutationRate
    };
  };

  return (
    <div className={`space-y-6 ${className}`}>
      <div className="bg-gray-800 rounded-lg p-6">
        <h3 className="text-2xl font-semibold mb-4 text-blue-400">NEAR Creative Tools (Fallback)</h3>
        
        {!isConnected && (
          <div className="bg-yellow-900 border border-yellow-700 rounded-lg p-4 mb-4">
            <p className="text-yellow-200">⚠️ Connect your NEAR wallet to use creative tools</p>
          </div>
        )}
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
          {availableTools.map((tool) => (
            <div
              key={tool.id}
              className={`p-4 rounded-lg border cursor-pointer transition-all ${
                selectedTool?.id === tool.id
                  ? 'bg-blue-900 border-blue-500'
                  : 'bg-gray-700 border-gray-600 hover:bg-gray-600'
              }`}
              onClick={() => selectTool(tool)}
            >
              <h4 className="font-semibold text-white mb-2">{tool.name}</h4>
              <p className="text-sm text-gray-300 mb-3">{tool.description}</p>
              <div className="text-xs text-gray-400">
                <span className="bg-gray-800 px-2 py-1 rounded">{tool.type}</span>
              </div>
            </div>
          ))}
        </div>

        {selectedTool && (
          <div className="bg-gray-700 rounded-lg p-4">
            <h4 className="font-semibold text-white mb-4">{selectedTool.name} Parameters</h4>
            
            <div className="space-y-4 mb-6">
              {selectedTool.parameters.map((param) => (
                <div key={param.name} className="space-y-2">
                  <label className="block text-sm font-medium text-gray-300">
                    {param.name}: {(toolParameters[param.name] || param.default).toString()}
                  </label>
                  
                  {param.type === 'range' && (
                    <div className="flex items-center space-x-4">
                      <input
                        type="range"
                        min={param.min}
                        max={param.max}
                        step={param.step}
                        value={toolParameters[param.name] || param.default}
                        onChange={(e) => updateParameter(param.name, parseFloat(e.target.value))}
                        className="flex-1"
                      />
                      <span className="text-sm text-gray-400 w-16 text-right">
                        {(toolParameters[param.name] || param.default).toFixed((param.step || 1) < 1 ? 2 : 0)}
                      </span>
                    </div>
                  )}
                  
                  {param.type === 'number' && (
                    <input
                      type="number"
                      value={toolParameters[param.name] || param.default}
                      onChange={(e) => updateParameter(param.name, parseFloat(e.target.value))}
                      className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded text-white"
                    />
                  )}
                  
                  {param.type === 'string' && (
                    <input
                      type="text"
                      value={toolParameters[param.name] || param.default}
                      onChange={(e) => updateParameter(param.name, e.target.value)}
                      className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded text-white"
                    />
                  )}
                  
                  {param.type === 'color' && (
                    <input
                      type="color"
                      value={toolParameters[param.name] || param.default}
                      onChange={(e) => updateParameter(param.name, e.target.value)}
                      className="w-full h-10 bg-gray-800 border border-gray-600 rounded"
                    />
                  )}
                  
                  {param.type === 'boolean' && (
                    <label className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={toolParameters[param.name] || param.default}
                        onChange={(e) => updateParameter(param.name, e.target.checked)}
                        className="rounded"
                      />
                      <span className="text-sm text-gray-300">Enable</span>
                    </label>
                  )}
                </div>
              ))}
            </div>
            
            <button
              onClick={generateWithTool}
              disabled={!isConnected || isGenerating}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 text-white font-medium py-3 px-4 rounded-lg transition-colors"
            >
              {isGenerating ? 'Generating...' : `Generate ${selectedTool.name}`}
            </button>
          </div>
        )}
        
        {/* Canvas for fractal rendering */}
        {selectedTool?.type === 'fractal' && (
          <div className="mt-6">
            <canvas
              ref={canvasRef}
              width={400}
              height={400}
              className="border border-gray-600 rounded-lg bg-black"
            />
          </div>
        )}
      </div>
    </div>
  );
};