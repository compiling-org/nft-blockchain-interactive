/**
 * Visualizer Test Page
 * Tests all three blockchain visualizers side by side with unified audio source
 * Compares Rust/WASM, NEAR, and Solana visualizers with real-time audio data
 */

import React, { useState, useEffect, useRef } from 'react';
import { RustWASMVisualizer } from '../components/RustWASMVisualizer';
import { NEARVisualizer } from '../components/NEARVisualizer';
import { SolanaVisualizer } from '../components/SolanaVisualizer';
import { AudioAnalyzerService, AudioBandData, BiometricAudioData } from '../services/audioAnalyzerService';

interface VisualizerTestPageProps {
  // Allow individual width/height overrides
  width?: number;
  height?: number;
}

export const VisualizerTestPage: React.FC<VisualizerTestPageProps> = ({
  width = 600,
  height = 400
}) => {
  const [isRecording, setIsRecording] = useState(false);
  const [error, setError] = useState<string>('');
  const [audioAnalyzer, setAudioAnalyzer] = useState<AudioAnalyzerService | null>(null);
  
  // Shared audio state for all visualizers
  const [audioBands, setAudioBands] = useState<AudioBandData>({
    bass: 0, lowMid: 0, mid: 0, highMid: 0, treble: 0, overall: 0
  });
  const [biometricData, setBiometricData] = useState<BiometricAudioData | null>(null);
  const [bpmRust, setBpmRust] = useState<number>(0);
  const [bpmSolana, setBpmSolana] = useState<number>(0);
  
  // Initialize shared audio analyzer
  useEffect(() => {
    const initAudio = async () => {
      try {
        const analyzer = new AudioAnalyzerService();
        const success = await analyzer.initialize();
        
        if (success) {
          setAudioAnalyzer(analyzer);
          
          // Subscribe to audio data
          analyzer.subscribe((result) => {
            setAudioBands(result.bands);
            setBiometricData(result.biometricData);
          });
        } else {
          setError('Failed to initialize audio analyzer');
        }
      } catch (err) {
        console.error('Audio initialization error:', err);
        setError('Audio initialization failed');
      }
    };
    
    initAudio();
    
    return () => {
      if (audioAnalyzer) {
        audioAnalyzer.dispose();
      }
    };
  }, []);
  
  const handleStartRecording = () => {
    if (audioAnalyzer) {
      audioAnalyzer.start();
      setIsRecording(true);
    }
  };
  
  const handleStopRecording = () => {
    if (audioAnalyzer) {
      audioAnalyzer.stop();
      setIsRecording(false);
    }
  };
  
  // Audio band display component
  const AudioBandDisplay: React.FC<{ bands: AudioBandData; label: string; color: string }> = ({ 
    bands, 
    label, 
    color 
  }) => (
    <div className="bg-gray-900 rounded-lg p-3" style={{ borderLeft: `4px solid ${color}` }}>
      <h4 className="text-sm font-bold mb-2" style={{ color }}>{label}</h4>
      <div className="space-y-1 text-xs">
        <div className="flex justify-between">
          <span>Bass:</span>
          <span className="font-mono">{bands.bass.toFixed(2)}</span>
        </div>
        <div className="flex justify-between">
          <span>Low-Mid:</span>
          <span className="font-mono">{bands.lowMid.toFixed(2)}</span>
        </div>
        <div className="flex justify-between">
          <span>Mid:</span>
          <span className="font-mono">{bands.mid.toFixed(2)}</span>
        </div>
        <div className="flex justify-between">
          <span>High-Mid:</span>
          <span className="font-mono">{bands.highMid.toFixed(2)}</span>
        </div>
        <div className="flex justify-between">
          <span>Treble:</span>
          <span className="font-mono">{bands.treble.toFixed(2)}</span>
        </div>
        <div className="flex justify-between">
          <span>Overall:</span>
          <span className="font-mono">{bands.overall.toFixed(2)}</span>
        </div>
      </div>
    </div>
  );
  
  // Biometric display component
  const BiometricDisplay: React.FC<{ data: BiometricAudioData | null }> = ({ data }) => {
    if (!data) {
      return (
        <div className="bg-gray-900 rounded-lg p-3">
          <h4 className="text-sm font-bold mb-2 text-gray-400">Biometric Data</h4>
          <p className="text-xs text-gray-500">Waiting for audio...</p>
        </div>
      );
    }
    
    return (
      <div className="bg-gray-900 rounded-lg p-3">
        <h4 className="text-sm font-bold mb-2 text-purple-400">Biometric Data</h4>
        <div className="space-y-1 text-xs">
          <div className="flex justify-between">
            <span>Heart Rate:</span>
            <span className="font-mono text-red-400">{data.heartRate.toFixed(0)} bpm</span>
          </div>
          <div className="flex justify-between">
            <span>Breathing Rate:</span>
            <span className="font-mono text-cyan-400">{data.breathingRate.toFixed(1)} /min</span>
          </div>
          <div className="flex justify-between">
            <span>Stress Level:</span>
            <span className="font-mono text-orange-400">{data.stressLevel.toFixed(0)}%</span>
          </div>
          <div className="flex justify-between">
            <span>Attention:</span>
            <span className="font-mono text-green-400">{data.attentionLevel.toFixed(0)}%</span>
          </div>
          <div className="mt-2 pt-2 border-t border-gray-700">
            <div className="text-gray-400 mb-1">Emotion:</div>
            <div className="grid grid-cols-3 gap-1 text-center">
              <div>
                <div className="text-[10px] text-gray-500">Valence</div>
                <div className="font-mono text-yellow-400">{data.emotion.valence.toFixed(2)}</div>
              </div>
              <div>
                <div className="text-[10px] text-gray-500">Arousal</div>
                <div className="font-mono text-pink-400">{data.emotion.arousal.toFixed(2)}</div>
              </div>
              <div>
                <div className="text-[10px] text-gray-500">Dominance</div>
                <div className="font-mono text-purple-400">{data.emotion.dominance.toFixed(2)}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };
  
  return (
    <div className="min-h-screen bg-gray-950 text-white p-6">
      <div className="max-w-[1800px] mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-orange-500 via-cyan-500 to-purple-500 bg-clip-text text-transparent mb-2">
            Blockchain Visualizer Integration Test
          </h1>
          <p className="text-gray-400">
            Side-by-side comparison of Rust/WASM, NEAR, and Solana visualizers
          </p>
        </div>
        
        {/* Control Panel */}
        <div className="bg-gray-900 rounded-xl p-4 mb-6 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={isRecording ? handleStopRecording : handleStartRecording}
              className={`px-6 py-2 rounded-lg font-bold transition-all ${
                isRecording 
                  ? 'bg-red-600 hover:bg-red-700' 
                  : 'bg-green-600 hover:bg-green-700'
              }`}
            >
              {isRecording ? 'Stop Microphone' : 'Start Microphone'}
            </button>
            
            <div className="text-sm">
              <span className="text-gray-400">Status: </span>
              <span className={isRecording ? 'text-green-400' : 'text-gray-500'}>
                {isRecording ? 'Recording' : 'Idle'}
              </span>
            </div>
          </div>
          
          {error && (
            <div className="bg-red-900/50 border border-red-500 rounded-lg px-4 py-2 text-red-400 text-sm">
              {error}
            </div>
          )}
        </div>
        
        {/* Audio Data Summary */}
        <div className="grid grid-cols-4 gap-4 mb-6">
          <AudioBandDisplay bands={audioBands} label="Shared Audio Input" color="#f97316" />
          <BiometricDisplay data={biometricData} />
          
          {/* BPM Display */}
          <div className="bg-gray-900 rounded-lg p-3">
            <h4 className="text-sm font-bold mb-2 text-orange-400">Rust BPM</h4>
            <div className="text-2xl font-mono font-bold">{bpmRust || '--'}</div>
          </div>
          
          <div className="bg-gray-900 rounded-lg p-3">
            <h4 className="text-sm font-bold mb-2 text-purple-400">Solana BPM</h4>
            <div className="text-2xl font-mono font-bold">{bpmSolana || '--'}</div>
          </div>
        </div>
        
        {/* Visualizer Grid */}
        <div className="grid grid-cols-3 gap-6">
          {/* Rust/WASM Visualizer */}
          <div className="bg-gray-900 rounded-xl overflow-hidden">
            <div className="bg-gradient-to-r from-orange-600 to-orange-800 px-4 py-2">
              <h2 className="text-lg font-bold text-white">Rust/WASM</h2>
              <p className="text-xs text-orange-200">Phosphor Vortex Particle System</p>
            </div>
            <div className="p-4">
              <RustWASMVisualizer
                width={width}
                height={height}
                autoStart={isRecording}
                onAudioData={(bands) => setAudioBands(bands)}
                onBiometricData={(data) => setBiometricData(data)}
                onBPMChange={(bpm) => setBpmRust(bpm)}
              />
              <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
                <div className="bg-orange-900/30 rounded p-2">
                  <div className="text-orange-400">Style</div>
                  <div className="text-gray-300">Particle vortex / Black hole</div>
                </div>
                <div className="bg-orange-900/30 rounded p-2">
                  <div className="text-orange-400">Audio</div>
                  <div className="text-gray-300">Beat detection + BPM</div>
                </div>
              </div>
            </div>
          </div>
          
          {/* NEAR Visualizer */}
          <div className="bg-gray-900 rounded-xl overflow-hidden">
            <div className="bg-gradient-to-r from-cyan-600 to-green-600 px-4 py-2">
              <h2 className="text-lg font-bold text-white">NEAR</h2>
              <p className="text-xs text-cyan-200">Phosphor Drift Fluid Simulation</p>
            </div>
            <div className="p-4">
              <NEARVisualizer
                width={width}
                height={height}
                autoStart={isRecording}
                onAudioData={(bands) => setAudioBands(bands)}
                onBiometricData={(data) => setBiometricData(data)}
              />
              <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
                <div className="bg-cyan-900/30 rounded p-2">
                  <div className="text-cyan-400">Style</div>
                  <div className="text-gray-300">Domain-warped FBM smoke</div>
                </div>
                <div className="bg-cyan-900/30 rounded p-2">
                  <div className="text-cyan-400">Colors</div>
                  <div className="text-gray-300">NEAR Green (#00EC97) + Cyan</div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Solana Visualizer */}
          <div className="bg-gray-900 rounded-xl overflow-hidden">
            <div className="bg-gradient-to-r from-purple-600 to-pink-600 px-4 py-2">
              <h2 className="text-lg font-bold text-white">Solana</h2>
              <p className="text-xs text-purple-200">Audio-Reactive NFT Fractal</p>
            </div>
            <div className="p-4">
              <SolanaVisualizer
                width={width}
                height={height}
                autoStart={isRecording}
                onAudioData={(bands) => setAudioBands(bands)}
                onBiometricData={(data) => setBiometricData(data)}
                onBPMChange={(bpm) => setBpmSolana(bpm)}
              />
              <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
                <div className="bg-purple-900/30 rounded p-2">
                  <div className="text-purple-400">Style</div>
                  <div className="text-gray-300">Fractal patterns + Sparkle</div>
                </div>
                <div className="bg-purple-900/30 rounded p-2">
                  <div className="text-purple-400">Colors</div>
                  <div className="text-gray-300">Purple/Pink/Gold gradient</div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Technical Details */}
        <div className="mt-8 bg-gray-900 rounded-xl p-6">
          <h3 className="text-xl font-bold mb-4">Integration Test Summary</h3>
          <div className="grid grid-cols-3 gap-6">
            <div>
              <h4 className="font-bold text-orange-400 mb-2">Rust/WASM Visualizer</h4>
              <ul className="text-sm text-gray-400 space-y-1">
                <li>✓ Uses phosphor vortex_sim.wgsl</li>
                <li>✓ 50,000 GPU particles</li>
                <li>✓ Beat detection via FluxReel</li>
                <li>✓ WebGPU with WebGL fallback</li>
                <li>✓ Biometric data integration</li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-cyan-400 mb-2">NEAR Visualizer</h4>
              <ul className="text-sm text-gray-400 space-y-1">
                <li>✓ Uses phosphor drift.wgsl</li>
                <li>✓ Domain-warped FBM noise</li>
                <li>✓ NEAR brand colors</li>
                <li>✓ WebGPU with WebGL fallback</li>
                <li>✓ Heart rate + breathing sync</li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-purple-400 mb-2">Solana Visualizer</h4>
              <ul className="text-sm text-gray-400 space-y-1">
                <li>✓ Custom purple/pink shader</li>
                <li>✓ Extended NFT visualizer</li>
                <li>✓ Fast BPM-synced animations</li>
                <li>✓ WebGPU with WebGL fallback</li>
                <li>✓ Full EEG band support</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VisualizerTestPage;
