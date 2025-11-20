import React, { useEffect, useRef, useState } from 'react';
import init, { ShaderEngine } from '../rust-client/pkg/nft_rust_client';

interface EmotionalState {
  valence: number;
  arousal: number;
  dominance: number;
}

interface FractalParams {
  fractalType: string;
  zoom: number;
  centerX: number;
  centerY: number;
  maxIterations: number;
  timeOffset: number;
}

export default function FractalStudio() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [engine, setEngine] = useState<ShaderEngine | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [emotionalState, setEmotionalState] = useState<EmotionalState>({
    valence: 0.5,
    arousal: 0.5,
    dominance: 0.5
  });
  const [fractalParams, setFractalParams] = useState<FractalParams>({
    fractalType: 'mandelbrot',
    zoom: 1.0,
    centerX: -0.5,
    centerY: 0.0,
    maxIterations: 100,
    timeOffset: 0.0
  });
  const [isAnimating, setIsAnimating] = useState(false);
  const animationRef = useRef<number>();

  useEffect(() => {
    async function initializeEngine() {
      try {
        await init();
        if (canvasRef.current) {
          const shaderEngine = new ShaderEngine('fractal-canvas');
          setEngine(shaderEngine);
          setIsLoading(false);
        }
      } catch (error) {
        console.error('Failed to initialize shader engine:', error);
        setIsLoading(false);
      }
    }

    initializeEngine();
  }, []);

  useEffect(() => {
    if (engine && !isAnimating) {
      try {
        engine.load_fractal_shader(fractalParams.fractalType);
        engine.set_emotional_state(emotionalState.valence, emotionalState.arousal, emotionalState.dominance);
        engine.set_uniform('zoom', fractalParams.zoom);
        engine.set_uniform('center', [fractalParams.centerX, fractalParams.centerY]);
        engine.set_uniform('maxIterations', fractalParams.maxIterations);
        engine.set_uniform('time', fractalParams.timeOffset);
        engine.render(0.016); // 60fps frame time
      } catch (error) {
        console.error('Error updating fractal:', error);
      }
    }
  }, [engine, emotionalState, fractalParams, isAnimating]);

  const startAnimation = () => {
    if (!engine) return;
    
    setIsAnimating(true);
    let startTime = Date.now();
    
    const animate = () => {
      const elapsed = (Date.now() - startTime) / 1000;
      try {
        engine.set_uniform('time', elapsed);
        engine.render(0.016);
        
        if (isAnimating) {
          animationRef.current = requestAnimationFrame(animate);
        }
      } catch (error) {
        console.error('Animation error:', error);
        stopAnimation();
      }
    };
    
    animate();
  };

  const stopAnimation = () => {
    setIsAnimating(false);
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
    }
  };

  const handleEmotionalChange = (dimension: keyof EmotionalState, value: number) => {
    setEmotionalState(prev => ({ ...prev, [dimension]: value }));
  };

  const handleFractalChange = (param: keyof FractalParams, value: any) => {
    setFractalParams(prev => ({ ...prev, [param]: value }));
  };

  const randomizeEmotions = () => {
    setEmotionalState({
      valence: Math.random(),
      arousal: Math.random(),
      dominance: Math.random()
    });
  };

  const resetView = () => {
    setFractalParams({
      fractalType: 'mandelbrot',
      zoom: 1.0,
      centerX: -0.5,
      centerY: 0.0,
      maxIterations: 100,
      timeOffset: 0.0
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-white text-xl">Loading WebGPU Fractal Engine...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="container mx-auto p-4">
        <h1 className="text-3xl font-bold mb-6 text-center">WebGPU Fractal Studio with Emotion Integration</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Canvas */}
          <div className="lg:col-span-2">
            <div className="bg-black rounded-lg p-4">
              <canvas
                ref={canvasRef}
                id="fractal-canvas"
                width={800}
                height={600}
                className="w-full h-auto border border-gray-600 rounded"
              />
              
              <div className="flex justify-center space-x-4 mt-4">
                <button
                  onClick={isAnimating ? stopAnimation : startAnimation}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded transition-colors"
                >
                  {isAnimating ? 'Stop Animation' : 'Start Animation'}
                </button>
                
                <button
                  onClick={randomizeEmotions}
                  className="px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded transition-colors"
                >
                  Randomize Emotions
                </button>
                
                <button
                  onClick={resetView}
                  className="px-4 py-2 bg-gray-600 hover:bg-gray-700 rounded transition-colors"
                >
                  Reset View
                </button>
              </div>
            </div>
          </div>

          {/* Controls */}
          <div className="space-y-6">
            {/* Emotional Controls */}
            <div className="bg-gray-800 rounded-lg p-4">
              <h3 className="text-lg font-semibold mb-4">Emotional Parameters</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Valence (Pleasure)</label>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.01"
                    value={emotionalState.valence}
                    onChange={(e) => handleEmotionalChange('valence', parseFloat(e.target.value))}
                    className="w-full"
                  />
                  <span className="text-xs text-gray-400">{emotionalState.valence.toFixed(2)}</span>
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2">Arousal (Energy)</label>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.01"
                    value={emotionalState.arousal}
                    onChange={(e) => handleEmotionalChange('arousal', parseFloat(e.target.value))}
                    className="w-full"
                  />
                  <span className="text-xs text-gray-400">{emotionalState.arousal.toFixed(2)}</span>
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2">Dominance (Control)</label>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.01"
                    value={emotionalState.dominance}
                    onChange={(e) => handleEmotionalChange('dominance', parseFloat(e.target.value))}
                    className="w-full"
                  />
                  <span className="text-xs text-gray-400">{emotionalState.dominance.toFixed(2)}</span>
                </div>
              </div>
            </div>

            {/* Fractal Controls */}
            <div className="bg-gray-800 rounded-lg p-4">
              <h3 className="text-lg font-semibold mb-4">Fractal Parameters</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Fractal Type</label>
                  <select
                    value={fractalParams.fractalType}
                    onChange={(e) => handleFractalChange('fractalType', e.target.value)}
                    className="w-full px-3 py-2 bg-gray-700 rounded border border-gray-600"
                  >
                    <option value="mandelbrot">Mandelbrot</option>
                    <option value="julia">Julia</option>
                    <option value="burning_ship">Burning Ship</option>
                    <option value="newton">Newton</option>
                    <option value="phoenix">Phoenix</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2">Zoom Level</label>
                  <input
                    type="range"
                    min="0.1"
                    max="10"
                    step="0.1"
                    value={fractalParams.zoom}
                    onChange={(e) => handleFractalChange('zoom', parseFloat(e.target.value))}
                    className="w-full"
                  />
                  <span className="text-xs text-gray-400">{fractalParams.zoom.toFixed(1)}</span>
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2">Max Iterations</label>
                  <input
                    type="range"
                    min="50"
                    max="500"
                    step="10"
                    value={fractalParams.maxIterations}
                    onChange={(e) => handleFractalChange('maxIterations', parseInt(e.target.value))}
                    className="w-full"
                  />
                  <span className="text-xs text-gray-400">{fractalParams.maxIterations}</span>
                </div>
              </div>
            </div>

            {/* Status */}
            <div className="bg-gray-800 rounded-lg p-4">
              <h3 className="text-lg font-semibold mb-2">Status</h3>
              <div className="text-sm space-y-1">
                <div>Engine: {engine ? 'Ready' : 'Not loaded'}</div>
                <div>Animation: {isAnimating ? 'Running' : 'Stopped'}</div>
                <div>Emotional Category: {getEmotionalCategory(emotionalState)}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function getEmotionalCategory(state: EmotionalState): string {
  const { valence, arousal, dominance } = state;
  
  if (valence > 0.7 && arousal > 0.7) return 'Excited';
  if (valence > 0.7 && arousal < 0.3) return 'Content';
  if (valence < 0.3 && arousal > 0.7) return 'Frustrated';
  if (valence < 0.3 && arousal < 0.3) return 'Depressed';
  if (arousal > 0.7) return 'Activated';
  if (arousal < 0.3) return 'Deactivated';
  return 'Neutral';
}