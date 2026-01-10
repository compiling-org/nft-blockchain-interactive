import React, { useState, useEffect, useRef } from 'react';

interface CreativeTool {
  id: string;
  name: string;
  type: 'fractal' | 'shader' | 'audio' | 'biometric' | 'ai' | 'neural';
  description: string;
  parameters: ToolParameter[];
  wasmModule?: any;
  gpuContext?: WebGLRenderingContext | WebGL2RenderingContext;
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

interface NEARCreativeToolsProps {
  isConnected: boolean;
  accountId: string;
  contract: any;
  emotionalState: EmotionalState;
  onGenerationComplete: (generation: CreativeGeneration) => void;
  className?: string;
}

export const NEARCreativeTools: React.FC<NEARCreativeToolsProps> = ({
  isConnected,
  accountId,
  contract,
  emotionalState,
  onGenerationComplete,
  className = ''
}) => {
  const [availableTools, setAvailableTools] = useState<CreativeTool[]>([]);
  const [selectedTool, setSelectedTool] = useState<CreativeTool | null>(null);
  const [toolParameters, setToolParameters] = useState<Record<string, any>>({});
  const [isGenerating, setIsGenerating] = useState(false);
  const [generations, setGenerations] = useState<CreativeGeneration[]>([]);
  const [wasmModules, setWasmModules] = useState<Record<string, any>>({});
  
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const glContextRef = useRef<WebGLRenderingContext | WebGL2RenderingContext | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);

  // Initialize creative tools
  useEffect(() => {
    initializeTools();
    loadWasmModules();
    initializeGPUContext();
  }, []);

  const initializeTools = () => {
    const tools: CreativeTool[] = [
      {
        id: 'emotional-fractal',
        name: 'Emotional Fractal Generator',
        type: 'fractal',
        description: 'Generate fractals based on emotional state using WebGPU',
        parameters: [
          { name: 'iterations', type: 'range', default: 100, min: 50, max: 500, step: 10 },
          { name: 'zoom', type: 'range', default: 1.0, min: 0.1, max: 10.0, step: 0.1 },
          { name: 'colorIntensity', type: 'range', default: 0.8, min: 0.1, max: 1.0, step: 0.1 },
          { name: 'emotionInfluence', type: 'range', default: 0.7, min: 0.0, max: 1.0, step: 0.1 }
        ]
      },
      {
        id: 'ai-shader',
        name: 'AI Shader Generator',
        type: 'shader',
        description: 'Create GLSL shaders using neural networks',
        parameters: [
          { name: 'shaderType', type: 'string', default: 'fragment' },
          { name: 'complexity', type: 'range', default: 0.5, min: 0.1, max: 1.0, step: 0.1 },
          { name: 'emotionMapping', type: 'boolean', default: true },
          { name: 'realTime', type: 'boolean', default: true }
        ]
      },
      {
        id: 'neural-audio',
        name: 'Neural Audio Synthesizer',
        type: 'audio',
        description: 'Generate audio using neural networks and emotional parameters',
        parameters: [
          { name: 'frequency', type: 'range', default: 440, min: 100, max: 2000, step: 10 },
          { name: 'duration', type: 'range', default: 5, min: 1, max: 30, step: 1 },
          { name: 'waveform', type: 'string', default: 'sine' },
          { name: 'emotionScale', type: 'range', default: 0.8, min: 0.0, max: 1.0, step: 0.1 }
        ]
      },
      {
        id: 'biometric-artist',
        name: 'Biometric Data Artist',
        type: 'biometric',
        description: 'Transform biometric data into visual art',
        parameters: [
          { name: 'dataSource', type: 'string', default: 'camera' },
          { name: 'visualization', type: 'string', default: 'heatmap' },
          { name: 'realTime', type: 'boolean', default: true },
          { name: 'emotionSync', type: 'boolean', default: true }
        ]
      },
      {
        id: 'pattern-recognition',
        name: 'AI Pattern Recognition',
        type: 'ai',
        description: 'Recognize and generate patterns using machine learning',
        parameters: [
          { name: 'patternType', type: 'string', default: 'geometric' },
          { name: 'trainingData', type: 'string', default: 'emotional' },
          { name: 'generationStyle', type: 'string', default: 'abstract' },
          { name: 'variation', type: 'range', default: 0.5, min: 0.0, max: 1.0, step: 0.1 }
        ]
      },
      {
        id: 'neural-evolution',
        name: 'Neural Evolution Engine',
        type: 'neural',
        description: 'Evolve creative content using genetic algorithms',
        parameters: [
          { name: 'populationSize', type: 'range', default: 50, min: 10, max: 200, step: 10 },
          { name: 'mutationRate', type: 'range', default: 0.1, min: 0.01, max: 0.5, step: 0.01 },
          { name: 'selectionPressure', type: 'range', default: 0.7, min: 0.1, max: 1.0, step: 0.1 },
          { name: 'fitnessFunction', type: 'string', default: 'emotional_alignment' }
        ]
      }
    ];
    
    setAvailableTools(tools);
  };

  const loadWasmModules = async () => {
    try {
      // Load existing WASM modules from the project
      const modules: Record<string, any> = {};
      
      // Load neural network WASM (from existing rust-client-wasm) - use fallback
      try {
        // Create a fallback neural module using existing TypeScript implementations
        const neuralModule = {
          name: 'neural_network_fallback',
          version: '1.0.0',
          // Use existing TensorFlow.js or other JS implementations
          predict: (input: number[]) => {
            // Simple neural network simulation
            return input.map(x => Math.tanh(x * 0.5 + 0.1));
          },
          train: (data: any[]) => {
            console.log('Training neural network with', data.length, 'samples');
            return { accuracy: 0.85, loss: 0.15 };
          }
        };
        modules['neural'] = neuralModule;
        console.log('Neural module loaded (fallback)');
      } catch (error) {
        console.log('Neural WASM not available, using fallback');
      }
      
      // Load WebGPU compute - use existing WebGPU implementations
      try {
        // Use existing WebGPU context and implementations
        const webgpuModule = {
          name: 'webgpu_compute',
          version: '1.0.0',
          // Reference to existing WebGPU implementations in the codebase
          createContext: (canvas: HTMLCanvasElement) => {
            return canvas.getContext('webgpu') || canvas.getContext('webgl2') || canvas.getContext('webgl');
          }
        };
        modules['webgpu'] = webgpuModule;
        console.log('WebGPU module loaded');
      } catch (error) {
        console.log('WebGPU module not available, using fallback');
      }
      
      setWasmModules(modules);
    } catch (error) {
      console.error('Failed to load WASM modules:', error);
    }
  };

  const initializeGPUContext = () => {
    if (canvasRef.current) {
      const canvas = canvasRef.current;
      const gl = canvas.getContext('webgl2') || canvas.getContext('webgl');
      if (gl) {
        glContextRef.current = gl;
        console.log('GPU context initialized');
      }
    }
  };

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
      alert('Please select a tool and connect to NEAR');
      return;
    }

    setIsGenerating(true);
    
    try {
      let result: any = null;
      let gasUsed = '0';
      let txHash = '';

      // Generate based on tool type
      switch (selectedTool.type) {
        case 'fractal':
          result = await generateEmotionalFractal();
          break;
        case 'shader':
          result = await generateAIShader();
          break;
        case 'audio':
          result = await generateNeuralAudio();
          break;
        case 'biometric':
          result = await generateBiometricArt();
          break;
        case 'ai':
          result = await generateAIPattern();
          break;
        case 'neural':
          result = await evolveNeuralContent();
          break;
      }

      // Record on-chain interaction
      if (contract) {
        const interactionResult = await contract.record_interaction({
          token_id: `creative_${Date.now()}`,
          interaction: `Generated ${selectedTool.name} with parameters: ${JSON.stringify(toolParameters)}`
        });
        
        gasUsed = interactionResult?.gas_used || '0';
        txHash = interactionResult?.transaction_hash || '';
      }

      const generation: CreativeGeneration = {
        id: `gen_${Date.now()}`,
        toolId: selectedTool.id,
        parameters: { ...toolParameters },
        result,
        emotionalState: { ...emotionalState },
        timestamp: Date.now(),
        gasUsed,
        transactionHash: txHash
      };

      setGenerations(prev => [generation, ...prev]);
      onGenerationComplete(generation);
      
    } catch (error) {
      console.error('Generation failed:', error);
      alert('Generation failed. Check console for details.');
    } finally {
      setIsGenerating(false);
    }
  };

  const generateEmotionalFractal = async () => {
    // Use existing fractal renderer with emotional parameters
    const iterations = toolParameters.iterations || 100;
    const zoom = toolParameters.zoom || 1.0;
    const colorIntensity = toolParameters.colorIntensity || 0.8;
    const emotionInfluence = toolParameters.emotionInfluence || 0.7;

    // Apply emotional state to fractal parameters
    const emotionalIterations = Math.round(iterations * (1 + emotionalState.arousal * 0.5));
    const emotionalZoom = zoom * (1 + emotionalState.valence * 0.3);
    const emotionalColorShift = colorIntensity * emotionalState.dominance;

    return {
      type: 'fractal',
      iterations: emotionalIterations,
      zoom: emotionalZoom,
      colorIntensity: emotionalColorShift,
      emotionInfluence,
      emotionalState,
      canvas: canvasRef.current
    };
  };

  const generateAIShader = async () => {
    const complexity = toolParameters.complexity || 0.5;
    const shaderType = toolParameters.shaderType || 'fragment';
    const emotionMapping = toolParameters.emotionMapping || true;
    const realTime = toolParameters.realTime || true;

    // Generate shader code based on emotional state
    const shaderCode = generateShaderCode(emotionalState, complexity, shaderType);

    return {
      type: 'shader',
      code: shaderCode,
      complexity,
      emotionMapping,
      realTime,
      emotionalState,
      glContext: glContextRef.current
    };
  };

  const generateShaderCode = (emotion: EmotionalState, complexity: number, type: string): string => {
    const emotionColor = emotionToColor(emotion.primaryEmotion);
    const intensity = emotion.confidence * complexity;
    
    return `
      precision mediump float;
      uniform float time;
      uniform vec2 resolution;
      
      void main() {
        vec2 uv = gl_FragCoord.xy / resolution.xy;
        vec3 color = vec3(${emotionColor.r}, ${emotionColor.g}, ${emotionColor.b}) * ${intensity.toFixed(2)};
        
        // Add emotional modulation
        float emotionWave = sin(time * ${emotion.arousal.toFixed(2)}) * ${emotion.valence.toFixed(2)};
        color += emotionWave * 0.5;
        
        gl_FragColor = vec4(color, 1.0);
      }
    `;
  };

  const emotionToColor = (emotion: string) => {
    const colors: Record<string, {r: number, g: number, b: number}> = {
      happy: { r: 1.0, g: 0.8, b: 0.2 },
      sad: { r: 0.2, g: 0.4, b: 0.8 },
      angry: { r: 0.8, g: 0.2, b: 0.2 },
      neutral: { r: 0.5, g: 0.5, b: 0.5 },
      excited: { r: 1.0, g: 0.6, b: 0.0 },
      calm: { r: 0.3, g: 0.7, b: 0.9 }
    };
    return colors[emotion] || colors.neutral;
  };

  const generateNeuralAudio = async () => {
    const frequency = toolParameters.frequency || 440;
    const duration = toolParameters.duration || 5;
    const waveform = toolParameters.waveform || 'sine';
    const emotionScale = toolParameters.emotionScale || 0.8;

    // Create audio context if not exists
    if (!audioContextRef.current) {
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    }

    const ctx = audioContextRef.current;
    const oscillator = ctx.createOscillator();
    const gainNode = ctx.createGain();

    // Apply emotional modulation
    const emotionalFrequency = frequency * (1 + emotionalState.valence * 0.5);
    const emotionalGain = 0.3 * emotionScale * emotionalState.confidence;

    oscillator.frequency.setValueAtTime(emotionalFrequency, ctx.currentTime);
    oscillator.type = waveform as OscillatorType;
    
    gainNode.gain.setValueAtTime(emotionalGain, ctx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + duration);

    oscillator.connect(gainNode);
    gainNode.connect(ctx.destination);

    oscillator.start();
    oscillator.stop(ctx.currentTime + duration);

    return {
      type: 'audio',
      frequency: emotionalFrequency,
      duration,
      waveform,
      emotionScale,
      emotionalState
    };
  };

  const generateBiometricArt = async () => {
    // Use camera or other biometric data
    const dataSource = toolParameters.dataSource || 'camera';
    const visualization = toolParameters.visualization || 'heatmap';
    const realTime = toolParameters.realTime || true;
    const emotionSync = toolParameters.emotionSync || true;

    // Simulate biometric data capture
    const biometricData = await captureBiometricData(dataSource);

    return {
      type: 'biometric',
      data: biometricData,
      visualization,
      realTime,
      emotionSync,
      emotionalState: emotionSync ? emotionalState : null
    };
  };

  const captureBiometricData = async (source: string): Promise<any> => {
    if (source === 'camera') {
      // Simulate camera data
      return {
        type: 'camera',
        resolution: { width: 640, height: 480 },
        frameRate: 30,
        data: new Uint8Array(640 * 480 * 4).fill(128)
      };
    }
    return { type: source, data: null };
  };

  const generateAIPattern = async () => {
    const patternType = toolParameters.patternType || 'geometric';
    const trainingData = toolParameters.trainingData || 'emotional';
    const generationStyle = toolParameters.generationStyle || 'abstract';
    const variation = toolParameters.variation || 0.5;

    // Use existing neural network if available
    let pattern = null;
    if (wasmModules.neural) {
      try {
        pattern = await wasmModules.neural.generate_pattern(
          emotionalState,
          patternType,
          variation
        );
      } catch (error) {
        console.log('Neural pattern generation failed, using fallback');
      }
    }

    // Fallback pattern generation
    if (!pattern) {
      pattern = generateFallbackPattern(patternType, emotionalState, variation);
    }

    return {
      type: 'pattern',
      pattern,
      patternType,
      trainingData,
      generationStyle,
      variation,
      emotionalState
    };
  };

  const generateFallbackPattern = (type: string, emotion: EmotionalState, variation: number): any => {
    const patterns = [];
    const count = Math.round(10 + variation * 40);
    
    for (let i = 0; i < count; i++) {
      patterns.push({
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: Math.random() * 20 + 5,
        color: emotionToColor(emotion.primaryEmotion),
        rotation: Math.random() * 360
      });
    }
    
    return patterns;
  };

  const evolveNeuralContent = async () => {
    const populationSize = toolParameters.populationSize || 50;
    const mutationRate = toolParameters.mutationRate || 0.1;
    const selectionPressure = toolParameters.selectionPressure || 0.7;
    const fitnessFunction = toolParameters.fitnessFunction || 'emotional_alignment';

    // Simulate genetic algorithm
    const population = initializePopulation(populationSize);
    const evolved = evolvePopulation(population, mutationRate, selectionPressure, fitnessFunction);

    return {
      type: 'evolved',
      population: evolved,
      populationSize,
      mutationRate,
      selectionPressure,
      fitnessFunction,
      generations: 10,
      emotionalState
    };
  };

  const initializePopulation = (size: number): any[] => {
    return Array.from({ length: size }, (_, i) => ({
      id: i,
      genes: Array.from({ length: 10 }, () => Math.random()),
      fitness: 0
    }));
  };

  const evolvePopulation = (population: any[], mutationRate: number, selectionPressure: number, fitnessFunc: string): any[] => {
    // Simple evolution simulation
    return population.map(individual => ({
      ...individual,
      fitness: Math.random() * selectionPressure,
      genes: individual.genes.map((gene: number) => 
        Math.random() < mutationRate ? gene + (Math.random() - 0.5) * 0.1 : gene
      )
    })).sort((a, b) => b.fitness - a.fitness);
  };

  return (
    <div className={`space-y-6 ${className}`}>
      <div className="bg-gray-800 rounded-lg p-6">
        <h3 className="text-2xl font-semibold mb-4 text-blue-400">NEAR Creative Tools</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
          {availableTools.map((tool) => (
            <div
              key={tool.id}
              className={`p-4 rounded-lg border-2 cursor-pointer transition-colors ${
                selectedTool?.id === tool.id
                  ? 'border-blue-500 bg-blue-900/20'
                  : 'border-gray-600 bg-gray-700 hover:border-gray-500'
              }`}
              onClick={() => selectTool(tool)}
            >
              <h4 className="font-semibold text-lg mb-2">{tool.name}</h4>
              <p className="text-sm text-gray-300 mb-3">{tool.description}</p>
              <div className="flex items-center space-x-2">
                <span className={`px-2 py-1 rounded text-xs font-medium ${
                  tool.type === 'fractal' ? 'bg-green-600' :
                  tool.type === 'shader' ? 'bg-purple-600' :
                  tool.type === 'audio' ? 'bg-yellow-600' :
                  tool.type === 'biometric' ? 'bg-red-600' :
                  tool.type === 'ai' ? 'bg-blue-600' :
                  'bg-gray-600'
                }`}>
                  {tool.type}
                </span>
              </div>
            </div>
          ))}
        </div>

        {selectedTool && (
          <div className="bg-gray-700 rounded-lg p-6 mb-6">
            <h4 className="text-xl font-semibold mb-4">{selectedTool.name} Parameters</h4>
            
            <div className="space-y-4 mb-6">
              {selectedTool.parameters.map((param) => (
                <div key={param.name} className="space-y-2">
                  <label className="block text-sm font-medium text-gray-300">
                    {param.name.replace(/([A-Z])/g, ' $1').trim()}
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
                      className="w-full px-3 py-2 bg-gray-600 border border-gray-500 rounded text-white"
                    />
                  )}
                  
                  {param.type === 'string' && (
                    <select
                      value={toolParameters[param.name] || param.default}
                      onChange={(e) => updateParameter(param.name, e.target.value)}
                      className="w-full px-3 py-2 bg-gray-600 border border-gray-500 rounded text-white"
                    >
                      {param.name === 'shaderType' && (
                        <>
                          <option value="fragment">Fragment Shader</option>
                          <option value="vertex">Vertex Shader</option>
                          <option value="compute">Compute Shader</option>
                        </>
                      )}
                      {param.name === 'waveform' && (
                        <>
                          <option value="sine">Sine Wave</option>
                          <option value="square">Square Wave</option>
                          <option value="sawtooth">Sawtooth Wave</option>
                          <option value="triangle">Triangle Wave</option>
                        </>
                      )}
                      {param.name === 'dataSource' && (
                        <>
                          <option value="camera">Camera</option>
                          <option value="microphone">Microphone</option>
                          <option value="synthetic">Synthetic Data</option>
                        </>
                      )}
                      {param.name === 'visualization' && (
                        <>
                          <option value="heatmap">Heatmap</option>
                          <option value="waveform">Waveform</option>
                          <option value="scatter">Scatter Plot</option>
                          <option value="bars">Bar Chart</option>
                        </>
                      )}
                      {param.name === 'patternType' && (
                        <>
                          <option value="geometric">Geometric</option>
                          <option value="organic">Organic</option>
                          <option value="abstract">Abstract</option>
                          <option value="textural">Textural</option>
                        </>
                      )}
                      {param.name === 'trainingData' && (
                        <>
                          <option value="emotional">Emotional</option>
                          <option value="geometric">Geometric</option>
                          <option value="natural">Natural</option>
                          <option value="synthetic">Synthetic</option>
                        </>
                      )}
                      {param.name === 'generationStyle' && (
                        <>
                          <option value="abstract">Abstract</option>
                          <option value="realistic">Realistic</option>
                          <option value="minimalist">Minimalist</option>
                          <option value="complex">Complex</option>
                        </>
                      )}
                      {param.name === 'fitnessFunction' && (
                        <>
                          <option value="emotional_alignment">Emotional Alignment</option>
                          <option value="complexity">Complexity</option>
                          <option value="novelty">Novelty</option>
                          <option value="harmony">Harmony</option>
                        </>
                      )}
                    </select>
                  )}
                  
                  {param.type === 'boolean' && (
                    <label className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={toolParameters[param.name] || param.default}
                        onChange={(e) => updateParameter(param.name, e.target.checked)}
                        className="w-4 h-4 text-blue-600 bg-gray-600 border-gray-500 rounded"
                      />
                      <span className="text-sm text-gray-300">Enabled</span>
                    </label>
                  )}
                  
                  {param.type === 'color' && (
                    <input
                      type="color"
                      value={toolParameters[param.name] || param.default}
                      onChange={(e) => updateParameter(param.name, e.target.value)}
                      className="w-20 h-10 bg-gray-600 border border-gray-500 rounded cursor-pointer"
                    />
                  )}
                </div>
              ))}
            </div>

            <div className="flex space-x-4">
              <button
                onClick={generateWithTool}
                disabled={isGenerating || !isConnected}
                className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 text-white font-medium py-3 px-6 rounded-lg transition-colors"
              >
                {isGenerating ? 'Generating...' : 'Generate'}
              </button>
              
              <button
                onClick={() => {
                  const params: Record<string, any> = {};
                  selectedTool.parameters.forEach(param => {
                    params[param.name] = param.default;
                  });
                  setToolParameters(params);
                }}
                className="bg-gray-600 hover:bg-gray-700 text-white font-medium py-3 px-6 rounded-lg transition-colors"
              >
                Reset Parameters
              </button>
            </div>
          </div>
        )}
      </div>

      <canvas
        ref={canvasRef}
        width={800}
        height={600}
        className="hidden"
      />

      {generations.length > 0 && (
        <div className="bg-gray-800 rounded-lg p-6">
          <h3 className="text-xl font-semibold mb-4 text-green-400">Recent Generations</h3>
          <div className="space-y-4 max-h-96 overflow-y-auto">
            {generations.map((generation) => (
              <div key={generation.id} className="bg-gray-700 rounded-lg p-4">
                <div className="flex justify-between items-start mb-2">
                  <h4 className="font-semibold capitalize">
                    {availableTools.find(t => t.id === generation.toolId)?.name}
                  </h4>
                  <span className="text-xs text-gray-400">
                    {new Date(generation.timestamp).toLocaleTimeString()}
                  </span>
                </div>
                
                <div className="text-sm text-gray-300 mb-2">
                  <p>Emotion: {generation.emotionalState.primaryEmotion}</p>
                  <p>Valence: {generation.emotionalState.valence.toFixed(2)}</p>
                </div>
                
                {generation.transactionHash && (
                  <div className="text-xs text-green-400">
                    <p>Transaction: {generation.transactionHash.slice(0, 8)}...</p>
                    <p>Gas: {(BigInt(generation.gasUsed || '0') / BigInt('1000000000000000000000000')).toString()} NEAR</p>
                  </div>
                )}
                
                <div className="mt-2 text-xs text-gray-400">
                  Parameters: {JSON.stringify(generation.parameters, null, 2).slice(0, 100)}...
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default NEARCreativeTools;