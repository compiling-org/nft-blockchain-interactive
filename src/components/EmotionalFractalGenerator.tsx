import { useState, useEffect, useRef } from 'react';

interface EmotionalFractalGeneratorProps {
  emotionalState: {
    valence: number;
    arousal: number;
    dominance: number;
  };
  onFractalGenerated?: (fractalData: any) => void;
}

export function EmotionalFractalGenerator({ emotionalState, onFractalGenerated }: EmotionalFractalGeneratorProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [fractalParams, setFractalParams] = useState({
    iterations: 100,
    zoom: 1.5,
    centerX: -0.5,
    centerY: 0,
    colorIntensity: 0.8
  });

  // Update fractal parameters based on emotional state
  useEffect(() => {
    const { valence, arousal, dominance } = emotionalState;
    
    setFractalParams(prev => ({
      ...prev,
      iterations: Math.floor(50 + (arousal * 150)), // More iterations with higher arousal
      zoom: 1.5 + (dominance * 2), // Zoom out with higher dominance
      centerX: -0.5 + (valence * 0.3), // Shift center with valence
      centerY: arousal * 0.2, // Vertical shift with arousal
      colorIntensity: 0.5 + (valence * 0.5) // Brighter colors with positive valence
    }));
  }, [emotionalState]);

  const generateFractal = async () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    setIsGenerating(true);
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;
    const imageData = ctx.createImageData(width, height);
    const data = imageData.data;

    const { iterations, zoom, centerX, centerY, colorIntensity } = fractalParams;

    // Generate Mandelbrot set based on emotional parameters
    for (let px = 0; px < width; px++) {
      for (let py = 0; py < height; py++) {
        // Map pixel coordinates to complex plane
        const x0 = (px - width / 2) / (width / 4) / zoom + centerX;
        const y0 = (py - height / 2) / (height / 4) / zoom + centerY;

        let x = 0;
        let y = 0;
        let iteration = 0;

        // Mandelbrot iteration
        while (x * x + y * y <= 4 && iteration < iterations) {
          const xtemp = x * x - y * y + x0;
          y = 2 * x * y + y0;
          x = xtemp;
          iteration++;
        }

        // Color based on iteration count and emotional state
        const index = (py * width + px) * 4;
        const { valence, arousal } = emotionalState;
        
        if (iteration === iterations) {
          // Inside the set - black
          data[index] = 0;
          data[index + 1] = 0;
          data[index + 2] = 0;
        } else {
          // Outside the set - colored based on emotion
          const smooth = iteration + 1 - Math.log(Math.log(Math.sqrt(x * x + y * y))) / Math.log(2);
          const hue = (smooth / iterations * 360 + valence * 180) % 360;
          const saturation = 0.5 + arousal * 0.5;
          const lightness = 0.3 + (iteration / iterations) * 0.7 * colorIntensity;
          
          const rgb = hslToRgb(hue / 360, saturation, lightness);
          data[index] = rgb[0];
          data[index + 1] = rgb[1];
          data[index + 2] = rgb[2];
        }
        data[index + 3] = 255; // Alpha
      }
    }

    ctx.putImageData(imageData, 0, 0);
    setIsGenerating(false);

    // Generate fractal data for saving
    const fractalData = {
      id: Date.now().toString(),
      type: 'fractal',
      timestamp: Date.now(),
      emotionalState,
      parameters: fractalParams,
      imageData: canvas.toDataURL(),
      metadata: {
        width,
        height,
        algorithm: 'mandelbrot',
        emotionalMapping: true
      }
    };

    if (onFractalGenerated) {
      onFractalGenerated(fractalData);
    }
  };

  // HSL to RGB conversion
  function hslToRgb(h: number, s: number, l: number): [number, number, number] {
    let r, g, b;

    if (s === 0) {
      r = g = b = l; // achromatic
    } else {
      const hue2rgb = (p: number, q: number, t: number) => {
        if (t < 0) t += 1;
        if (t > 1) t -= 1;
        if (t < 1/6) return p + (q - p) * 6 * t;
        if (t < 1/2) return q;
        if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
        return p;
      };

      const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
      const p = 2 * l - q;
      r = hue2rgb(p, q, h + 1/3);
      g = hue2rgb(p, q, h);
      b = hue2rgb(p, q, h - 1/3);
    }

    return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)];
  }

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