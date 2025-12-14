import React, { useRef, useEffect, useState, useCallback } from 'react';
import { unifiedAIMLPipeline } from '../utils/unified-ai-ml-integration.js';

interface AudioReactiveFractalRendererProps {
  width?: number;
  height?: number;
  shaderType?: 'mandelbrot' | 'julia' | 'burning_ship' | 'newton' | 'audio_wave' | 'plasma' | 'tunnel';
  onBiometricData?: (data: any) => void;
}

export const RealAudioReactiveFractalRenderer: React.FC<AudioReactiveFractalRendererProps> = ({
  width = 800,
  height = 600,
  shaderType = 'mandelbrot',
  onBiometricData
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const animationFrameRef = useRef<number>(0);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  
  const [isAudioActive, setIsAudioActive] = useState(false);
  const [audioBands, setAudioBands] = useState([0, 0, 0, 0]);
  const [isRendering, setIsRendering] = useState(false);
  const [error, setError] = useState<string>('');
  const [biometricData, setBiometricData] = useState<any>(null);

  // Real WebGL shader programs
  const vertexShaderSource = `
    attribute vec2 a_position;
    void main() {
      gl_Position = vec4(a_position, 0.0, 1.0);
    }
  `;

  const getFragmentShaderSource = useCallback(() => {
    const shaders = {
      mandelbrot: `
        precision highp float;
        uniform float u_time;
        uniform vec2 u_resolution;
        uniform vec2 u_mouse;
        uniform vec4 u_audio_bands;
        
        void main() {
          vec2 uv = (gl_FragCoord.xy - 0.5 * u_resolution.xy) / min(u_resolution.x, u_resolution.y);
          
          // Audio-reactive zoom and rotation
          float zoom = 2.0 + u_audio_bands.x * 3.0;
          float rotation = u_time * 0.1 + u_audio_bands.y * 0.5;
          
          vec2 c = uv * zoom;
          c = vec2(c.x * cos(rotation) - c.y * sin(rotation), c.x * sin(rotation) + c.y * cos(rotation));
          
          // Mouse interaction
          c += (u_mouse - 0.5) * 0.5;
          
          vec2 z = vec2(0.0);
          int iter = 0;
          
          for(int i = 0; i < 200; i++) {
            if(dot(z, z) > 4.0) break;
            float x = z.x * z.x - z.y * z.y + c.x;
            float y = 2.0 * z.x * z.y + c.y;
            z = vec2(x, y);
            iter = i;
          }
          
          float t = float(iter) / 200.0;
          
          // Audio-reactive coloring
          vec3 color = vec3(
            t + u_audio_bands.z * 0.5,
            t * (1.0 + u_audio_bands.w),
            t + sin(u_time * 2.0) * u_audio_bands.x * 0.3
          );
          
          gl_FragColor = vec4(color, 1.0);
        }
      `,
      
      julia: `
        precision highp float;
        uniform float u_time;
        uniform vec2 u_resolution;
        uniform vec2 u_mouse;
        uniform vec4 u_audio_bands;
        
        void main() {
          vec2 uv = (gl_FragCoord.xy - 0.5 * u_resolution.xy) / min(u_resolution.x, u_resolution.y);
          
          // Audio-reactive Julia constant
          vec2 c = vec2(-0.8 + u_audio_bands.x * 0.4, 0.156 + u_audio_bands.y * 0.3);
          c += sin(u_time * 0.1) * 0.1;
          
          // Audio-reactive zoom
          float zoom = 1.5 + u_audio_bands.z * 2.0;
          vec2 z = uv * zoom;
          
          // Mouse interaction
          z += (u_mouse - 0.5) * 0.3;
          
          int iter = 0;
          
          for(int i = 0; i < 200; i++) {
            if(dot(z, z) > 4.0) break;
            float x = z.x * z.x - z.y * z.y + c.x;
            float y = 2.0 * z.x * z.y + c.y;
            z = vec2(x, y);
            iter = i;
          }
          
          float t = float(iter) / 200.0;
          
          // Audio-reactive coloring
          vec3 color = vec3(
            t + u_audio_bands.w * 0.6,
            t * (0.8 + u_audio_bands.x * 0.4),
            t + cos(u_time * 3.0) * u_audio_bands.y * 0.4
          );
          
          gl_FragColor = vec4(color, 1.0);
        }
      `,
      
      audio_wave: `
        precision highp float;
        uniform float u_time;
        uniform vec2 u_resolution;
        uniform vec4 u_audio_bands;
        
        void main() {
          vec2 uv = gl_FragCoord.xy / u_resolution.xy;
          
          // Audio-reactive wave parameters
          float wave_speed = 2.0 + u_audio_bands.x * 5.0;
          float wave_amplitude = 0.02 + u_audio_bands.y * 0.1;
          float wave_frequency = 8.0 + u_audio_bands.z * 10.0;
          
          // Create wave distortion
          float wave = sin(uv.x * wave_frequency + u_time * wave_speed) * wave_amplitude;
          float wave2 = sin(uv.x * wave_frequency * 2.0 + u_time * wave_speed * 1.5) * wave_amplitude * 0.5;
          
          vec2 distorted_uv = uv + vec2(0.0, wave + wave2);
          
          // Audio-reactive coloring
          vec3 color = vec3(
            distorted_uv.y + u_audio_bands.w * 0.3,
            sin(distorted_uv.y * 10.0 + u_time) * 0.5 + 0.5 + u_audio_bands.x * 0.2,
            cos(distorted_uv.y * 15.0 + u_time * 2.0) * 0.5 + 0.5 + u_audio_bands.y * 0.2
          );
          
          gl_FragColor = vec4(color, 1.0);
        }
      `,
      
      burning_ship: `
        precision highp float;
        uniform float u_time;
        uniform vec2 u_resolution;
        uniform vec2 u_mouse;
        uniform vec4 u_audio_bands;
        
        void main() {
          vec2 uv = (gl_FragCoord.xy - 0.5 * u_resolution.xy) / min(u_resolution.x, u_resolution.y);
          
          // Audio-reactive zoom and position
          float zoom = 2.0 + u_audio_bands.x * 3.0;
          vec2 offset = vec2(sin(u_time * 0.1) * 0.5, cos(u_time * 0.15) * 0.3) + (u_mouse - 0.5) * 0.5;
          
          vec2 c = uv * zoom + offset;
          vec2 z = vec2(0.0);
          int iter = 0;
          
          for(int i = 0; i < 200; i++) {
            if(dot(z, z) > 4.0) break;
            float x = abs(z.x * z.x - z.y * z.y) + c.x;
            float y = abs(2.0 * z.x * z.y) + c.y;
            z = vec2(x, y);
            iter = i;
          }
          
          float t = float(iter) / 200.0;
          
          // Audio-reactive coloring
          vec3 color = vec3(
            t + u_audio_bands.z * 0.5,
            t * (1.0 + u_audio_bands.w) + sin(u_time) * 0.1,
            t + cos(u_time * 2.0) * u_audio_bands.y * 0.3
          );
          
          gl_FragColor = vec4(color, 1.0);
        }
      `,
      
      newton: `
        precision highp float;
        uniform float u_time;
        uniform vec2 u_resolution;
        uniform vec2 u_mouse;
        uniform vec4 u_audio_bands;
        
        vec2 complex_div(vec2 a, vec2 b) {
          float denom = dot(b, b);
          return vec2(a.x * b.x + a.y * b.y, a.y * b.x - a.x * b.y) / denom;
        }
        
        vec2 complex_mul(vec2 a, vec2 b) {
          return vec2(a.x * b.x - a.y * b.y, a.x * b.y + a.y * b.x);
        }
        
        void main() {
          vec2 uv = (gl_FragCoord.xy - 0.5 * u_resolution.xy) / min(u_resolution.x, u_resolution.y);
          
          // Audio-reactive zoom and offset
          float zoom = 2.0 + u_audio_bands.x * 2.0;
          vec2 offset = (u_mouse - 0.5) * 0.5 + sin(u_time * 0.1) * vec2(0.2, 0.1);
          
          vec2 z = uv * zoom + offset;
          int iter = 0;
          vec2 root = vec2(0.0);
          
          for(int i = 0; i < 100; i++) {
            vec2 f = complex_mul(complex_mul(z, z), z) - vec2(1.0, 0.0);
            vec2 df = complex_mul(z, z) * 3.0;
            
            if(dot(f, f) < 0.0001) {
              iter = i;
              break;
            }
            
            z = z - complex_div(f, df);
            iter = i;
          }
          
          float t = float(iter) / 100.0;
          
          // Audio-reactive coloring based on convergence
          vec3 color = vec3(
            t + u_audio_bands.z * 0.4,
            (1.0 - t) * (0.5 + u_audio_bands.w * 0.5),
            t * 0.7 + u_audio_bands.y * 0.3
          );
          
          gl_FragColor = vec4(color, 1.0);
        }
      `,
      
      plasma: `
        precision highp float;
        uniform float u_time;
        uniform vec2 u_resolution;
        uniform vec4 u_audio_bands;
        
        void main() {
          vec2 uv = gl_FragCoord.xy / u_resolution.xy;
          
          // Audio-reactive plasma effect
          float time = u_time + u_audio_bands.x * 2.0;
          float scale = 10.0 + u_audio_bands.y * 20.0;
          
          float v = 0.0;
          v += sin((uv.x + time) * scale);
          v += sin((uv.y + time * 0.5) * scale * 1.5);
          v += sin(((uv.x + uv.y) + time * 0.25) * scale * 2.0);
          v += sin((sqrt(uv.x * uv.x + uv.y * uv.y) + time * 0.3) * scale * 0.5);
          
          // Audio-reactive color modulation
          vec3 color = vec3(
            sin(v * 0.5 + u_audio_bands.z * 3.14) * 0.5 + 0.5,
            sin(v * 0.3 + u_audio_bands.w * 2.0) * 0.5 + 0.5,
            sin(v * 0.7 + time + u_audio_bands.x * 5.0) * 0.5 + 0.5
          );
          
          gl_FragColor = vec4(color, 1.0);
        }
      `,
      
      tunnel: `
        precision highp float;
        uniform float u_time;
        uniform vec2 u_resolution;
        uniform vec4 u_audio_bands;
        
        void main() {
          vec2 uv = (gl_FragCoord.xy - 0.5 * u_resolution.xy) / min(u_resolution.x, u_resolution.y);
          
          // Convert to polar coordinates
          float r = length(uv);
          float a = atan(uv.y, uv.x);
          
          // Audio-reactive tunnel effect
          float tunnel_speed = 0.5 + u_audio_bands.z * 1.0;
          float tunnel_twist = u_audio_bands.w * 2.0;
          
          // Create tunnel pattern
          float tunnel = sin(1.0 / (r + 0.1) + u_time * tunnel_speed);
          float rings = sin(r * 20.0 + u_time * 3.0 + u_audio_bands.x * 10.0);
          float twist = sin(a * 5.0 + tunnel_twist) * 0.5 + 0.5;
          
          // Combine effects
          float pattern = tunnel * rings * twist;
          
          // Audio-reactive coloring
          vec3 color = vec3(
            pattern * (0.8 + u_audio_bands.x * 0.4),
            pattern * (0.6 + u_audio_bands.y * 0.4),
            pattern * (1.0 + u_audio_bands.z * 0.2)
          );
          
          gl_FragColor = vec4(color, 1.0);
        }
      `
    };
    
    return shaders[shaderType] || shaders.mandelbrot;
  }, [shaderType]);

  // Initialize WebGL and create shader program
  const initializeWebGL = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return null;

    const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
    if (!gl) {
      setError('WebGL not supported');
      return null;
    }

    const webgl = gl as WebGLRenderingContext;

    try {
      // Create vertex shader
      const vertexShader = webgl.createShader(webgl.VERTEX_SHADER);
      if (!vertexShader) throw new Error('Failed to create vertex shader');
      
      webgl.shaderSource(vertexShader, vertexShaderSource);
      webgl.compileShader(vertexShader);
      
      if (!webgl.getShaderParameter(vertexShader, webgl.COMPILE_STATUS)) {
        const error = webgl.getShaderInfoLog(vertexShader);
        throw new Error(`Vertex shader compilation error: ${error}`);
      }

      // Create fragment shader
      const fragmentShader = webgl.createShader(webgl.FRAGMENT_SHADER);
      if (!fragmentShader) throw new Error('Failed to create fragment shader');
      
      const fragmentSource = getFragmentShaderSource();
      webgl.shaderSource(fragmentShader, fragmentSource);
      webgl.compileShader(fragmentShader);
      
      if (!webgl.getShaderParameter(fragmentShader, webgl.COMPILE_STATUS)) {
        const error = webgl.getShaderInfoLog(fragmentShader);
        throw new Error(`Fragment shader compilation error: ${error}`);
      }

      // Create program
      const program = webgl.createProgram();
      if (!program) throw new Error('Failed to create shader program');
      
      webgl.attachShader(program, vertexShader);
      webgl.attachShader(program, fragmentShader);
      webgl.linkProgram(program);
      
      if (!webgl.getProgramParameter(program, webgl.LINK_STATUS)) {
        const error = webgl.getProgramInfoLog(program);
        throw new Error(`Shader program link error: ${error}`);
      }

      // Create fullscreen quad
      const vertices = new Float32Array([
        -1, -1,  1, -1,  -1, 1,
        -1,  1,  1, -1,   1, 1
      ]);
      
      const buffer = webgl.createBuffer();
      webgl.bindBuffer(webgl.ARRAY_BUFFER, buffer);
      webgl.bufferData(webgl.ARRAY_BUFFER, vertices, webgl.STATIC_DRAW);
      
      const positionLocation = webgl.getAttribLocation(program, 'a_position');
      webgl.enableVertexAttribArray(positionLocation);
      webgl.vertexAttribPointer(positionLocation, 2, webgl.FLOAT, false, 0, 0);

      return { gl: webgl, program };
    } catch (error) {
      setError(`WebGL initialization failed: ${error}`);
      return null;
    }
  }, [getFragmentShaderSource]);

  // Initialize audio context and analyser
  const initializeAudio = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: {
          echoCancellation: false,
          noiseSuppression: false,
          autoGainControl: false
        } 
      });
      
      mediaStreamRef.current = stream;
      
      const audioContext = new AudioContext();
      audioContextRef.current = audioContext;
      
      const source = audioContext.createMediaStreamSource(stream);
      const analyser = audioContext.createAnalyser();
      
      analyser.fftSize = 512;
      analyser.smoothingTimeConstant = 0.8;
      
      source.connect(analyser);
      analyserRef.current = analyser;
      
      setIsAudioActive(true);
      return true;
    } catch (error) {
      setError(`Audio initialization failed: ${error}`);
      return false;
    }
  }, []);

  // Process audio and extract frequency bands
  const processAudio = useCallback(() => {
    if (!analyserRef.current) return [0, 0, 0, 0];
    
    const dataArray = new Uint8Array(analyserRef.current.frequencyBinCount);
    analyserRef.current.getByteFrequencyData(dataArray);
    
    // Extract 4 frequency bands
    const bandSize = Math.floor(dataArray.length / 4);
    const bands = [
      dataArray.slice(0, bandSize).reduce((a, b) => a + b, 0) / bandSize / 255,
      dataArray.slice(bandSize, bandSize * 2).reduce((a, b) => a + b, 0) / bandSize / 255,
      dataArray.slice(bandSize * 2, bandSize * 3).reduce((a, b) => a + b, 0) / bandSize / 255,
      dataArray.slice(bandSize * 3).reduce((a, b) => a + b, 0) / (dataArray.length - bandSize * 3) / 255
    ];
    
    return bands;
  }, []);

  // Generate biometric data from audio
  const generateBiometricData = useCallback((audioBands: number[]) => {
    const timestamp = Date.now();
    
    // Simulate biometric data based on audio characteristics
    const biometric = {
      timestamp,
      heartRate: 60 + Math.floor(audioBands[0] * 40), // 60-100 BPM
      breathingRate: 12 + Math.floor(audioBands[1] * 8), // 12-20 breaths/min
      stressLevel: Math.floor(audioBands[2] * 100), // 0-100
      attentionLevel: Math.floor(audioBands[3] * 100), // 0-100
      emotion: {
        valence: (audioBands[0] - 0.5) * 2, // -1 to 1
        arousal: audioBands[1], // 0 to 1
        dominance: audioBands[2] // 0 to 1
      },
      eegBands: {
        delta: audioBands[0] * 0.8,
        theta: audioBands[1] * 0.6,
        alpha: audioBands[2] * 0.4,
        beta: audioBands[3] * 0.3,
        gamma: (audioBands[0] + audioBands[1]) * 0.2
      }
    };
    
    setBiometricData(biometric);
    
    // Send to AI/ML pipeline for analysis
    if (unifiedAIMLPipeline) {
      unifiedAIMLPipeline.processBiometricData(biometric).then((analysis: any) => {
        if (onBiometricData) {
          onBiometricData({
            ...biometric,
            aiAnalysis: analysis
          });
        }
      }).catch((error: any) => {
        console.warn('AI/ML pipeline error:', error);
        if (onBiometricData) {
          onBiometricData(biometric);
        }
      });
    } else {
      if (onBiometricData) {
        onBiometricData(biometric);
      }
    }
  }, [onBiometricData]);

  // Render loop
  const render = useCallback((webglContext: { gl: WebGLRenderingContext; program: WebGLProgram }) => {
    const { gl, program } = webglContext;
    
    const renderFrame = () => {
      if (!gl || !program) return;
      
      // Get audio bands
      const bands = processAudio();
      setAudioBands(bands);
      
      // Generate biometric data
      generateBiometricData(bands);
      
      // Clear canvas
      gl.viewport(0, 0, width, height);
      gl.clearColor(0, 0, 0, 1);
      gl.clear(gl.COLOR_BUFFER_BIT);
      
      // Use shader program
      gl.useProgram(program);
      
      // Set uniforms
      const timeLocation = gl.getUniformLocation(program, 'u_time');
      const resolutionLocation = gl.getUniformLocation(program, 'u_resolution');
      const mouseLocation = gl.getUniformLocation(program, 'u_mouse');
      const audioBandsLocation = gl.getUniformLocation(program, 'u_audio_bands');
      
      gl.uniform1f(timeLocation, performance.now() * 0.001);
      gl.uniform2f(resolutionLocation, width, height);
      gl.uniform2f(mouseLocation, 0.5, 0.5); // Center mouse for now
      gl.uniform4f(audioBandsLocation, bands[0], bands[1], bands[2], bands[3]);
      
      // Draw fullscreen quad
      gl.drawArrays(gl.TRIANGLES, 0, 6);
      
      if (isRendering) {
        animationFrameRef.current = requestAnimationFrame(renderFrame);
      }
    };
    
    renderFrame();
  }, [width, height, processAudio, generateBiometricData, isRendering]);

  // Initialize component
  useEffect(() => {
    const init = async () => {
      // Initialize WebGL
      const webglContext = initializeWebGL();
      if (!webglContext) return;
      
      // Initialize audio
      const audioSuccess = await initializeAudio();
      if (!audioSuccess) return;
      
      // Start rendering
      setIsRendering(true);
      render(webglContext);
    };
    
    init();
    
    // Cleanup
    return () => {
      setIsRendering(false);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      if (mediaStreamRef.current) {
        mediaStreamRef.current.getTracks().forEach(track => track.stop());
      }
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
    };
  }, []);

  return (
    <div className="real-audio-reactive-fractal-renderer">
      <canvas
        ref={canvasRef}
        width={width}
        height={height}
        style={{
          border: '1px solid #333',
          borderRadius: '8px',
          background: 'black'
        }}
      />
      
      {error && (
        <div style={{ color: 'red', marginTop: '10px' }}>
          Error: {error}
        </div>
      )}
      
      {isAudioActive && (
        <div style={{ marginTop: '10px', fontSize: '12px' }}>
          <div>Audio Bands: {audioBands.map((b, i) => `Band ${i+1}: ${(b * 100).toFixed(1)}%`).join(' | ')}</div>
          {biometricData && (
            <div style={{ marginTop: '5px' }}>
              <div>Heart Rate: {biometricData.heartRate} BPM</div>
              <div>Breathing: {biometricData.breathingRate}/min</div>
              <div>Stress: {biometricData.stressLevel}%</div>
              <div>Attention: {biometricData.attentionLevel}%</div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};