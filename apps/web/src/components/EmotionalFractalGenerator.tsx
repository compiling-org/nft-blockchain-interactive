import { useState, useEffect, useRef } from 'react';
// import init from '@rust-foundation-audiovisual/rust_foundation_audiovisual';

interface EmotionalFractalGeneratorProps {
  emotionalState: {
    valence: number;
    arousal: number;
    dominance: number;
  };
  onFractalGenerated?: (fractalData: any) => void;
  canvasRef?: React.RefObject<HTMLCanvasElement>;
}

export function EmotionalFractalGenerator({ emotionalState, onFractalGenerated, canvasRef: externalCanvasRef }: EmotionalFractalGeneratorProps) {
  const internalCanvasRef = useRef<HTMLCanvasElement>(null);
  const canvasRef = externalCanvasRef || internalCanvasRef;
  const [isGenerating, setIsGenerating] = useState(false);
  const [wasmInitialized, setWasmInitialized] = useState(false);
  // const engineRef = useRef<AudiovisualEngine | null>(null);
  const [fractalParams, setFractalParams] = useState({
    iterations: 1000,
    complexity: 5,
    zoom: 1.0,
    centerX: 0,
    centerY: 0,
    colorIntensity: 1.0
  });

  useEffect(() => {
    // TODO: Re-enable when WASM module is properly built
    // init().then(() => {
    //   console.log("WASM initialized");
    //   setWasmInitialized(true);
    //   if (canvasRef.current) {
    //     engineRef.current = AudiovisualEngine.new(canvasRef.current);
    //     engineRef.current.load_fractal_shader("mandelbrot");
    //   }
    // }).catch(e => console.error("Error initializing WASM:", e));
  }, [canvasRef]);

  useEffect(() => {
    // if (wasmInitialized && engineRef.current) {
    //   const { valence, arousal, dominance } = emotionalState;
    //   engineRef.current.set_emotion(valence, arousal, dominance);
    //   engineRef.current.update_audio_bands(new Float32Array([valence, arousal, dominance, 0]));
    //   generateFractal();
    // }
  }, [emotionalState, wasmInitialized]);

  const generateFractal = async () => {
    // if (!wasmInitialized || !engineRef.current || !canvasRef.current) return;
    if (!canvasRef.current) return;

    setIsGenerating(true);
    // engineRef.current.render(0.016);
    setIsGenerating(false);

    const fractalData = {
      id: Date.now().toString(),
      type: 'fractal',
      timestamp: Date.now(),
      emotionalState,
      imageData: canvasRef.current.toDataURL(),
      metadata: {
        width: canvasRef.current.width,
        height: canvasRef.current.height,
        algorithm: 'mandelbrot',
        emotionalMapping: true
      }
    };

    if (onFractalGenerated) {
      onFractalGenerated(fractalData);
    }
  };

  return (
    <div className="bg-gradient-to-br from-blue-900/50 to-purple-900/50 rounded-xl p-6 border border-blue-500/30">
      <h4 className="text-xl font-bold text-blue-300 mb-4">🌀 Emotional Fractal Generator</h4>

      <div className="mb-4">
        <canvas
          ref={canvasRef}
          width={400}
          height={300}
          className="w-full border border-blue-500/30 rounded-lg bg-black"
        />
      </div>

      <div className="mb-4 text-sm text-blue-200">
        <p>Emotional Parameters:</p>
        <div className="grid grid-cols-3 gap-2 mt-2">
          <div className="bg-black/30 rounded p-2">
            <span className="text-green-400">Valence:</span> {emotionalState.valence.toFixed(2)}
          </div>
          <div className="bg-black/30 rounded p-2">
            <span className="text-orange-400">Arousal:</span> {emotionalState.arousal.toFixed(2)}
          </div>
          <div className="bg-black/30 rounded p-2">
            <span className="text-purple-400">Dominance:</span> {emotionalState.dominance.toFixed(2)}
          </div>
        </div>
      </div>

      <div className="mb-4 text-sm text-blue-200">
        <p>Fractal Parameters:</p>
        <div className="grid grid-cols-2 gap-2 mt-2 text-xs">
          <div className="bg-black/30 rounded p-2">
            Iterations: {fractalParams.iterations}
          </div>
          <div className="bg-black/30 rounded p-2">
            Zoom: {fractalParams.zoom.toFixed(2)}
          </div>
          <div className="bg-black/30 rounded p-2">
            Center: ({fractalParams.centerX.toFixed(2)}, {fractalParams.centerY.toFixed(2)})
          </div>
          <div className="bg-black/30 rounded p-2">
            Color Intensity: {fractalParams.colorIntensity.toFixed(2)}
          </div>
        </div>
      </div>

      <button
        onClick={generateFractal}
        disabled={isGenerating}
        className="w-full px-4 py-3 bg-blue-600 hover:bg-blue-500 disabled:bg-gray-600 rounded-lg text-white transition-colors font-medium"
      >
        {isGenerating ? (
          <span className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
            Generating...
          </span>
        ) : (
          '🎨 Generate Emotional Fractal'
        )}
      </button>
    </div>
  );
}
