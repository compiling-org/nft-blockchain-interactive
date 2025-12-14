import { useState, useRef } from 'react';
import { myNearWalletService } from '../services/myNearWalletService';

export interface FractalParameters {
  type: 'mandelbrot' | 'julia' | 'sierpinski' | 'koch' | 'dragon';
  width: number;
  height: number;
  maxIterations: number;
  zoom: number;
  centerX: number;
  centerY: number;
  colorScheme: 'rainbow' | 'fire' | 'ocean' | 'monochrome' | 'neon';
  escapeRadius: number;
  juliaC?: { real: number; imag: number };
}

export default function WorkingFractalRenderer() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState('');
  const [fractalParams, setFractalParams] = useState<FractalParameters>({
    type: 'mandelbrot',
    width: 512,
    height: 512,
    maxIterations: 100,
    zoom: 1.0,
    centerX: 0,
    centerY: 0,
    colorScheme: 'rainbow',
    escapeRadius: 2.0
  });
  const [renderTime, setRenderTime] = useState<number | null>(null);
  const [isRendering, setIsRendering] = useState(false);

  const getColor = (iteration: number, maxIterations: number, scheme: string) => {
    if (iteration === maxIterations) {
      return { r: 0, g: 0, b: 0 };
    }

    const t = iteration / maxIterations;
    
    switch (scheme) {
      case 'rainbow':
        return {
          r: Math.sin(t * Math.PI * 4) * 127 + 128,
          g: Math.sin(t * Math.PI * 4 + 2) * 127 + 128,
          b: Math.sin(t * Math.PI * 4 + 4) * 127 + 128
        };
      case 'fire':
        return {
          r: t * 255,
          g: t * t * 255,
          b: 0
        };
      case 'ocean':
        return {
          r: 0,
          g: t * 128,
          b: t * 255
        };
      case 'monochrome':
        const gray = t * 255;
        return { r: gray, g: gray, b: gray };
      case 'neon':
        return {
          r: t < 0.5 ? 255 : 0,
          g: t > 0.25 && t < 0.75 ? 255 : 0,
          b: t > 0.5 ? 255 : 0
        };
      default:
        return { r: t * 255, g: t * 255, b: t * 255 };
    }
  };

  const renderMandelbrot = (canvas: HTMLCanvasElement, params: FractalParameters) => {
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const imageData = ctx.createImageData(params.width, params.height);
    const data = imageData.data;

    for (let py = 0; py < params.height; py++) {
      for (let px = 0; px < params.width; px++) {
        const x0 = (px - params.width / 2) / (params.width / 4) / params.zoom + params.centerX;
        const y0 = (py - params.height / 2) / (params.height / 4) / params.zoom + params.centerY;
        
        let x = 0;
        let y = 0;
        let iteration = 0;

        while (x * x + y * y <= params.escapeRadius * params.escapeRadius && iteration < params.maxIterations) {
          const xtemp = x * x - y * y + x0;
          y = 2 * x * y + y0;
          x = xtemp;
          iteration++;
        }

        const color = getColor(iteration, params.maxIterations, params.colorScheme);
        const index = (py * params.width + px) * 4;
        data[index] = color.r;
        data[index + 1] = color.g;
        data[index + 2] = color.b;
        data[index + 3] = 255;
      }
    }

    ctx.putImageData(imageData, 0, 0);
  };

  const renderJulia = (canvas: HTMLCanvasElement, params: FractalParameters) => {
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const imageData = ctx.createImageData(params.width, params.height);
    const data = imageData.data;

    const c = params.juliaC || { real: -0.7, imag: 0.27015 };

    for (let py = 0; py < params.height; py++) {
      for (let px = 0; px < params.width; px++) {
        const x = (px - params.width / 2) / (params.width / 4) / params.zoom + params.centerX;
        const y = (py - params.height / 2) / (params.height / 4) / params.zoom + params.centerY;
        
        let zx = x;
        let zy = y;
        let iteration = 0;

        while (zx * zx + zy * zy <= params.escapeRadius * params.escapeRadius && iteration < params.maxIterations) {
          const xtemp = zx * zx - zy * zy + c.real;
          zy = 2 * zx * zy + c.imag;
          zx = xtemp;
          iteration++;
        }

        const color = getColor(iteration, params.maxIterations, params.colorScheme);
        const index = (py * params.width + px) * 4;
        data[index] = color.r;
        data[index + 1] = color.g;
        data[index + 2] = color.b;
        data[index + 3] = 255;
      }
    }

    ctx.putImageData(imageData, 0, 0);
  };

  const renderSierpinski = (canvas: HTMLCanvasElement, params: FractalParameters) => {
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas
    ctx.fillStyle = 'black';
    ctx.fillRect(0, 0, params.width, params.height);

    // Sierpinski triangle vertices
    const vertices = [
      { x: params.width / 2, y: 0 },
      { x: 0, y: params.height },
      { x: params.width, y: params.height }
    ];

    let point = { x: params.width / 2, y: params.height / 2 };

    // Chaos game algorithm
    for (let i = 0; i < params.maxIterations * 100; i++) {
      const vertex = vertices[Math.floor(Math.random() * 3)];
      point = {
        x: (point.x + vertex.x) / 2,
        y: (point.y + vertex.y) / 2
      };

      const color = getColor(Math.floor(i / 100), params.maxIterations, params.colorScheme);
      ctx.fillStyle = `rgb(${color.r}, ${color.g}, ${color.b})`;
      ctx.fillRect(point.x, point.y, 1, 1);
    }
  };

  const renderFractal = async () => {
    const canvas = canvasRef.current;
    if (!canvas) {
      setStatus('❌ Canvas not found');
      return;
    }

    setIsRendering(true);
    setStatus(`🎨 Rendering ${fractalParams.type} fractal...`);
    
    const startTime = performance.now();

    try {
      canvas.width = fractalParams.width;
      canvas.height = fractalParams.height;

      switch (fractalParams.type) {
        case 'mandelbrot':
          renderMandelbrot(canvas, fractalParams);
          break;
        case 'julia':
          renderJulia(canvas, fractalParams);
          break;
        case 'sierpinski':
          renderSierpinski(canvas, fractalParams);
          break;
        default:
          renderMandelbrot(canvas, fractalParams);
      }

      const endTime = performance.now();
      const renderTimeMs = endTime - startTime;
      setRenderTime(renderTimeMs);
      
      setStatus(`✅ ${fractalParams.type} fractal rendered in ${renderTimeMs.toFixed(2)}ms`);
    } catch (error) {
      console.error('Fractal rendering error:', error);
      setStatus(`❌ Fractal rendering failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsRendering(false);
    }
  };

  const mintFractalNFT = async () => {
    if (!myNearWalletService.isSignedIn()) {
      setStatus('❌ Please connect your wallet first');
      return;
    }

    setLoading(true);
    setStatus('🎨 Preparing fractal NFT...');

    try {
      const canvas = canvasRef.current;
      if (!canvas) {
        setStatus('❌ No fractal rendered yet');
        return;
      }

      // Get canvas data
      const dataUrl = canvas.toDataURL('image/png');
      
      setStatus('🔗 Creating blockchain transaction...');
      
      // This would normally call the marketplace service
      // For now, simulate the NFT creation process
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setStatus(`✅ Fractal NFT ready! (Simulated - would be minted on blockchain)`);
      
      // Show the data URL for verification
      console.log('Fractal NFT Data URL:', dataUrl);
      
    } catch (error) {
      console.error('NFT minting error:', error);
      setStatus(`❌ NFT preparation failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setLoading(false);
    }
  };

  const testAllFractals = async () => {
    const fractalTypes = ['mandelbrot', 'julia', 'sierpinski'] as const;
    
    for (const type of fractalTypes) {
      setFractalParams(prev => ({ ...prev, type }));
      await new Promise(resolve => setTimeout(resolve, 100));
      await renderFractal();
      await new Promise(resolve => setTimeout(resolve, 2000));
    }
  };

  return (
    <div className="bg-gray-800 rounded-lg p-6">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-semibold text-white">🧮 Working Fractal Renderer</h3>
        <div className="flex gap-2">
          <button
            onClick={testAllFractals}
            disabled={loading || isRendering}
            className="bg-purple-600 hover:bg-purple-700 disabled:bg-gray-600 text-white px-4 py-2 rounded-lg text-sm transition-colors"
          >
            🧪 Test All
          </button>
          
          <button
            onClick={mintFractalNFT}
            disabled={loading || isRendering || !myNearWalletService.isSignedIn()}
            className="bg-green-600 hover:bg-green-700 disabled:bg-gray-600 text-white px-4 py-2 rounded-lg text-sm transition-colors"
          >
            🎨 Prepare NFT
          </button>
        </div>
      </div>

      {/* Fractal Parameters */}
      <div className="mb-6 p-4 bg-gray-700 rounded-lg">
        <h4 className="text-lg font-semibold text-white mb-4">🎛️ Fractal Parameters</h4>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div>
            <label className="block text-white font-semibold mb-2">Fractal Type</label>
            <select
              value={fractalParams.type}
              onChange={(e) => setFractalParams(prev => ({ ...prev, type: e.target.value as any }))}
              className="w-full p-3 rounded-lg bg-gray-600 text-white border border-gray-500 focus:border-blue-500 focus:outline-none"
            >
              <option value="mandelbrot">Mandelbrot Set</option>
              <option value="julia">Julia Set</option>
              <option value="sierpinski">Sierpinski Triangle</option>
            </select>
          </div>
          
          <div>
            <label className="block text-white font-semibold mb-2">Color Scheme</label>
            <select
              value={fractalParams.colorScheme}
              onChange={(e) => setFractalParams(prev => ({ ...prev, colorScheme: e.target.value as any }))}
              className="w-full p-3 rounded-lg bg-gray-600 text-white border border-gray-500 focus:border-blue-500 focus:outline-none"
            >
              <option value="rainbow">Rainbow</option>
              <option value="fire">Fire</option>
              <option value="ocean">Ocean</option>
              <option value="monochrome">Monochrome</option>
              <option value="neon">Neon</option>
            </select>
          </div>
          
          <div>
            <label className="block text-white font-semibold mb-2">Max Iterations</label>
            <input
              type="range"
              min="50"
              max="1000"
              value={fractalParams.maxIterations}
              onChange={(e) => setFractalParams(prev => ({ ...prev, maxIterations: parseInt(e.target.value) }))}
              className="w-full"
            />
            <div className="text-center text-sm text-gray-400 mt-1">
              {fractalParams.maxIterations}
            </div>
          </div>
          
          <div>
            <label className="block text-white font-semibold mb-2">Zoom Level</label>
            <input
              type="range"
              min="0.1"
              max="10"
              step="0.1"
              value={fractalParams.zoom}
              onChange={(e) => setFractalParams(prev => ({ ...prev, zoom: parseFloat(e.target.value) }))}
              className="w-full"
            />
            <div className="text-center text-sm text-gray-400 mt-1">
              {fractalParams.zoom.toFixed(1)}x
            </div>
          </div>
          
          <div>
            <label className="block text-white font-semibold mb-2">Resolution</label>
            <select
              value={`${fractalParams.width}x${fractalParams.height}`}
              onChange={(e) => {
                const [width, height] = e.target.value.split('x').map(Number);
                setFractalParams(prev => ({ ...prev, width, height }));
              }}
              className="w-full p-3 rounded-lg bg-gray-600 text-white border border-gray-500 focus:border-blue-500 focus:outline-none"
            >
              <option value="256x256">256x256</option>
              <option value="512x512">512x512</option>
              <option value="768x768">768x768</option>
              <option value="1024x1024">1024x1024</option>
            </select>
          </div>
          
          {fractalParams.type === 'julia' && (
            <div>
              <label className="block text-white font-semibold mb-2">Julia C Parameter</label>
              <div className="flex gap-2">
                <input
                  type="number"
                  step="0.01"
                  value={fractalParams.juliaC?.real || -0.7}
                  onChange={(e) => setFractalParams(prev => ({ 
                    ...prev, 
                    juliaC: { ...prev.juliaC, real: parseFloat(e.target.value) } as any
                  }))}
                  className="w-full p-2 rounded bg-gray-600 text-white text-sm"
                  placeholder="Real part"
                />
                <input
                  type="number"
                  step="0.01"
                  value={fractalParams.juliaC?.imag || 0.27015}
                  onChange={(e) => setFractalParams(prev => ({ 
                    ...prev, 
                    juliaC: { ...prev.juliaC, imag: parseFloat(e.target.value) } as any
                  }))}
                  className="w-full p-2 rounded bg-gray-600 text-white text-sm"
                  placeholder="Imaginary part"
                />
              </div>
            </div>
          )}
        </div>
        
        <div className="mt-4 flex gap-2">
          <button
            onClick={renderFractal}
            disabled={loading || isRendering}
            className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 text-white px-6 py-2 rounded-lg font-semibold transition-colors"
          >
            {isRendering ? '🎨 Rendering...' : '🎨 Render Fractal'}
          </button>
          
          <button
            onClick={() => {
              setFractalParams({
                type: 'mandelbrot',
                width: 512,
                height: 512,
                maxIterations: 100,
                zoom: 1.0,
                centerX: 0,
                centerY: 0,
                colorScheme: 'rainbow',
                escapeRadius: 2.0
              });
              setRenderTime(null);
              setStatus('');
            }}
            className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg text-sm transition-colors"
          >
            🔄 Reset
          </button>
        </div>
      </div>

      {/* Fractal Canvas */}
      <div className="mb-6">
        <h4 className="text-lg font-semibold text-white mb-4">🖼️ Fractal Preview</h4>
        
        <div className="flex justify-center">
          <canvas
            ref={canvasRef}
            width={fractalParams.width}
            height={fractalParams.height}
            className="border border-gray-600 rounded-lg bg-black"
            style={{ maxWidth: '100%', height: 'auto' }}
          />
        </div>
        
        {renderTime && (
          <div className="mt-2 text-center">
            <p className="text-green-400 text-sm">Rendered in {renderTime.toFixed(2)}ms</p>
          </div>
        )}
      </div>

      {/* Status */}
      {status && (
        <div className="mt-6 p-4 bg-yellow-900 bg-opacity-50 rounded-lg">
          <p className="text-yellow-100">{status}</p>
        </div>
      )}
    </div>
  );
}