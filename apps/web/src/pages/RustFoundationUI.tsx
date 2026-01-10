import React, { useRef, useState, useCallback } from 'react';
import { EmotionalFractalGenerator } from '../components/EmotionalFractalGenerator';
import FilecoinStorageIntegration from '../components/FilecoinStorageIntegration';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/card';
import { Badge } from '../components/ui/badge';

export default function RustFoundationUI() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [emotion, setEmotion] = useState({ valence: 0.3, arousal: 0.5, dominance: 0.4, confidence: 0.9 });
  const [lastResult, setLastResult] = useState<{ cid: string; url: string } | null>(null);
  const [error, setError] = useState<string>('');

  const onStorageComplete = useCallback((res: { cid: string; url: string }) => {
    setLastResult(res);
  }, []);

  const onError = useCallback((msg: string) => {
    setError(msg);
    setTimeout(() => setError(''), 3000);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-indigo-900 text-white">
      <header className="border-b border-purple-600/30 bg-black/40 backdrop-blur">
        <div className="max-w-7xl mx-auto px-4 py-6 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              Rust Foundation Creative UI
            </h1>
            <p className="text-purple-300">Emotion-driven fractals • Filecoin storage • Browser-native</p>
          </div>
          <nav className="flex gap-3 text-sm">
            <a href="#/near-engine" className="text-gray-300 hover:text-white">App</a>
            <a href="#/marketplace" className="text-gray-300 hover:text-white">Marketplace</a>
          </nav>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
        <section className="lg:col-span-2 space-y-6">
          <Card className="bg-black/40 border-purple-600/30">
            <CardHeader>
              <CardTitle className="text-lg text-purple-300">Emotional Modulators</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm text-purple-300 mb-2">Valence</label>
                  <input
                    type="range"
                    min={-1}
                    max={1}
                    step={0.01}
                    value={emotion.valence}
                    onChange={(e) => setEmotion((s) => ({ ...s, valence: parseFloat(e.target.value) }))}
                    className="w-full"
                  />
                  <div className="mt-2 text-center">
                    <Badge variant="outline" className="bg-purple-900/50 text-purple-200">
                      {emotion.valence.toFixed(2)}
                    </Badge>
                  </div>
                </div>
                <div>
                  <label className="block text-sm text-purple-300 mb-2">Arousal</label>
                  <input
                    type="range"
                    min={-1}
                    max={1}
                    step={0.01}
                    value={emotion.arousal}
                    onChange={(e) => setEmotion((s) => ({ ...s, arousal: parseFloat(e.target.value) }))}
                    className="w-full"
                  />
                  <div className="mt-2 text-center">
                    <Badge variant="outline" className="bg-amber-900/50 text-amber-200">
                      {emotion.arousal.toFixed(2)}
                    </Badge>
                  </div>
                </div>
                <div>
                  <label className="block text-sm text-purple-300 mb-2">Dominance</label>
                  <input
                    type="range"
                    min={-1}
                    max={1}
                    step={0.01}
                    value={emotion.dominance}
                    onChange={(e) => setEmotion((s) => ({ ...s, dominance: parseFloat(e.target.value) }))}
                    className="w-full"
                  />
                  <div className="mt-2 text-center">
                    <Badge variant="outline" className="bg-indigo-900/50 text-indigo-200">
                      {emotion.dominance.toFixed(2)}
                    </Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <EmotionalFractalGenerator
            emotionalState={{ valence: emotion.valence, arousal: emotion.arousal, dominance: emotion.dominance }}
            onFractalGenerated={() => { }}
            canvasRef={canvasRef}
          />

          {error && (
            <div className="text-sm text-red-300 bg-red-900/40 border border-red-600/40 rounded p-3">{error}</div>
          )}
        </section>

        <aside className="space-y-6">
          <FilecoinStorageIntegration
            canvas={canvasRef.current}
            emotionData={emotion}
            biometricData={'session:demo'}
            onStorageComplete={onStorageComplete}
            onError={onError}
          />

          {lastResult && (
            <div className="bg-green-900/30 border border-green-600/40 rounded-lg p-4">
              <div className="text-green-300 text-sm">Stored on Filecoin</div>
              <div className="mt-2 text-xs text-white font-mono">
                <div>CID: {lastResult.cid}</div>
                <a className="text-blue-300 hover:text-blue-200" href={lastResult.url} target="_blank" rel="noreferrer">
                  View on IPFS
                </a>
              </div>
            </div>
          )}
        </aside>
      </main>
    </div>
  );
}
