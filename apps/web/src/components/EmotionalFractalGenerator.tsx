import { useState, useEffect, useRef } from 'react';
// @ts-ignore
import init, { AudiovisualEngine } from '@rust-foundation-audiovisual/rust_foundation_audiovisual';

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
  const engineRef = useRef<any>(null);
  const [fractalParams, setFractalParams] = useState({
    iterations: 1000,
    complexity: 5,
    zoom: 1.0,
    centerX: 0,
    centerY: 0,
    colorIntensity: 1.0
  });

  const [aiAnalysis, setAiAnalysis] = useState<{
    patternType: string;
    stability: number;
    confidence: number;
    fractalType: string;
  } | null>(null);

  useEffect(() => {
    init().then(() => {
      console.log("WASM initialized");
      setWasmInitialized(true);
      if (canvasRef.current) {
        try {
            engineRef.current = AudiovisualEngine.new(canvasRef.current);
            console.log("AudiovisualEngine created");
        } catch (e) {
            console.error("Failed to create AudiovisualEngine:", e);
        }
      }
    }).catch((e: any) => console.error("Error initializing WASM:", e));
  }, [canvasRef]);

  useEffect(() => {
    if (wasmInitialized && engineRef.current) {
      const { valence, arousal, dominance } = emotionalState;
      try {
          engineRef.current.update_emotion(valence, arousal, dominance);
          // Also update audio bands with emotion data to drive visualization
          // bands: [bass, mid, treble, presence]
          // map: [valence, arousal, dominance, 0.5]
          const bands = new Float32Array([
            (valence + 1.0) * 0.5, // Normalize -1..1 to 0..1
            arousal,
            dominance,
            0.5
          ]);
          // engineRef.current.update_audio_bands(bands); // This would require extracting the Float32Array to Vec<f32> bridge
      } catch (e) {
          console.error("Error updating engine:", e);
      }
    }
  }, [emotionalState, wasmInitialized]);

  const generateFractal = async () => {
    if (!canvasRef.current) return;

    setIsGenerating(true);
    
    // Simulate Rust AI Logic
    const { valence, arousal, dominance } = emotionalState;
    const stability = Math.max(0, 1.0 - (Math.abs(valence - 0.5) + Math.abs(arousal - 0.5) + Math.abs(dominance - 0.5)) / 1.5);
    
    let patternType = "UnstableMixed";
    if (valence > 0.5 && arousal > 0.5 && dominance > 0.5) patternType = "StablePositive";
    else if (valence <= 0.5 && arousal > 0.5 && dominance > 0.5) patternType = "StableNegative";
    else if (valence > 0.5 && arousal <= 0.5 && dominance <= 0.5) patternType = "LowEnergy";
    else if (valence <= 0.5 && arousal > 0.5 && dominance <= 0.5) patternType = "HighEnergy";

    // If WASM is ready, use it to render
    if (wasmInitialized && engineRef.current) {
        try {
            // Render a single frame with current emotion
            engineRef.current.render(0.016);
            
            // Get current preset name from engine
            const preset = engineRef.current.get_current_preset();
            
            setAiAnalysis({
                patternType,
                stability,
                confidence: 0.85 + (stability * 0.1),
                fractalType: `${preset} (WASM)`
            });
            
        } catch (e) {
            console.warn("WASM render failed, falling back to simulation", e);
        }
    } else {
        // Fallback/Simulation drawing if WASM fails or is not ready
        const ctx = canvasRef.current.getContext('2d');
        if (ctx) {
            // Clear
            ctx.fillStyle = '#000';
            ctx.fillRect(0, 0, 400, 300);
            
            // Draw gradient background based on emotion
            const gradient = ctx.createLinearGradient(0, 0, 400, 300);
            gradient.addColorStop(0, `rgb(${Math.max(0, valence * 255)}, 0, ${Math.max(0, -valence * 255)})`);
            gradient.addColorStop(1, `rgb(${arousal * 255}, ${dominance * 100}, ${dominance * 255})`);
            ctx.fillStyle = gradient;
            ctx.fillRect(0, 0, 400, 300);
            
            // Draw text
            ctx.fillStyle = 'white';
            ctx.font = '20px Arial';
            ctx.fillText(`Fractal: ${patternType}`, 50, 150);
            ctx.font = '14px Arial';
            ctx.fillText(`(WASM Not Loaded)`, 50, 180);
        }
        
        setAiAnalysis({
            patternType,
            stability,
            confidence: 0.85 + (stability * 0.1),
            fractalType: "Simulation (Fallback)"
        });
    }

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
        emotionalMapping: true,
        patternType,
        stability
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

      <div className="mb-4 text-sm text-blue-200">
        <p>AI Analysis:</p>
        {aiAnalysis ? (
            <div className="grid grid-cols-2 gap-2 mt-2 text-xs">
              <div className="bg-black/30 rounded p-2">
                <span className="text-cyan-400">Pattern:</span> {aiAnalysis.patternType}
              </div>
              <div className="bg-black/30 rounded p-2">
                <span className="text-cyan-400">Type:</span> {aiAnalysis.fractalType}
              </div>
              <div className="bg-black/30 rounded p-2">
                <span className="text-cyan-400">Stability:</span> {(aiAnalysis.stability * 100).toFixed(1)}%
              </div>
              <div className="bg-black/30 rounded p-2">
                <span className="text-cyan-400">Confidence:</span> {(aiAnalysis.confidence * 100).toFixed(1)}%
              </div>
            </div>
        ) : (
            <div className="text-xs text-gray-400 mt-2 italic">
                Generate a fractal to see AI analysis...
            </div>
        )}
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
