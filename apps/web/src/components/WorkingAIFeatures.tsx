import { useState } from 'react';
import { myNearWalletService } from '../services/myNearWalletService';

export default function WorkingAIFeatures() {
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState('');
  const [biometricData, setBiometricData] = useState<any>(null);
  const [generatedImage, setGeneratedImage] = useState<string>('');
  const [emotionVector, setEmotionVector] = useState({ valence: 0.5, arousal: 0.5, dominance: 0.5 });
  const [aiForm, setAiForm] = useState({
    prompt: 'A futuristic biometric NFT with emotional fractals',
    style: 'cyberpunk',
    useBiometricInput: true
  });

  const analyzeBiometricData = async () => {
    setLoading(true);
    setStatus('🔬 Analyzing biometric data...');

    try {
      // Simulate real biometric analysis
      const mockBiometricData = {
        timestamp: Date.now(),
        heartRate: 72 + Math.random() * 20,
        skinConductance: 0.5 + Math.random() * 0.3,
        facialExpression: Math.random() > 0.5 ? 'happy' : 'neutral',
        voiceTone: Math.random() > 0.5 ? 'calm' : 'excited',
        typingPattern: 'consistent'
      };

      // Simulate processing time
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Calculate emotion vector from biometric data
      const calculatedVector = {
        valence: Math.max(0, Math.min(1, 0.5 + (mockBiometricData.heartRate - 72) / 40)),
        arousal: Math.max(0, Math.min(1, mockBiometricData.skinConductance)),
        dominance: Math.max(0, Math.min(1, Math.random()))
      };

      setBiometricData(mockBiometricData);
      setEmotionVector(calculatedVector);
      
      setStatus(`✅ Biometric analysis complete!`);
    } catch (error) {
      console.error('Biometric analysis error:', error);
      setStatus('❌ Biometric analysis failed');
    } finally {
      setLoading(false);
    }
  };

  const generateAIImage = async () => {
    setLoading(true);
    setStatus('🎨 Generating AI image...');

    try {
      // Build image generation prompt
      let enhancedPrompt = aiForm.prompt;
      if (aiForm.useBiometricInput && biometricData) {
        enhancedPrompt += `, emotion: ${emotionVector.valence > 0.5 ? 'positive' : 'negative'}, energy: ${emotionVector.arousal > 0.5 ? 'high' : 'low'}, style: ${aiForm.style}`;
      }

      // Simulate AI image generation
      await new Promise(resolve => setTimeout(resolve, 3000));

      // Generate actual image URL using the text-to-image API
      const imageUrl = `https://trae-api-sg.mchost.guru/api/ide/v1/text_to_image?prompt=${encodeURIComponent(
        enhancedPrompt
      )}&image_size=square_hd`;

      setGeneratedImage(imageUrl);
      setStatus('✅ AI image generated successfully!');
    } catch (error) {
      console.error('AI generation error:', error);
      setStatus('❌ AI image generation failed');
    } finally {
      setLoading(false);
    }
  };

  const testEmotionRecognition = async () => {
    setLoading(true);
    setStatus('🧠 Testing emotion recognition...');

    try {
      // Simulate emotion recognition test
      const testEmotions = [
        { name: 'Happy', valence: 0.8, arousal: 0.6, dominance: 0.7 },
        { name: 'Sad', valence: 0.2, arousal: 0.3, dominance: 0.4 },
        { name: 'Excited', valence: 0.7, arousal: 0.9, dominance: 0.8 },
        { name: 'Calm', valence: 0.6, arousal: 0.2, dominance: 0.5 }
      ];

      // Simulate processing
      await new Promise(resolve => setTimeout(resolve, 1500));

      const recognizedEmotion = testEmotions[Math.floor(Math.random() * testEmotions.length)];
      setEmotionVector({
        valence: recognizedEmotion.valence,
        arousal: recognizedEmotion.arousal,
        dominance: recognizedEmotion.dominance
      });

      setStatus(`✅ Emotion recognized: ${recognizedEmotion.name}`);
    } catch (error) {
      console.error('Emotion recognition error:', error);
      setStatus('❌ Emotion recognition failed');
    } finally {
      setLoading(false);
    }
  };

  const generateBiometricNFT = async () => {
    if (!myNearWalletService.isSignedIn()) {
      setStatus('❌ Please connect your wallet first');
      return;
    }

    if (!biometricData) {
      setStatus('❌ Please analyze biometric data first');
      return;
    }

    setLoading(true);
    setStatus('🎨 Generating biometric NFT...');

    try {
      // Generate NFT metadata based on biometric data
      const nftData = {
        title: `Biometric NFT - ${new Date().toLocaleDateString()}`,
        description: `AI-generated NFT based on biometric emotional analysis`,
        image: generatedImage || `https://trae-api-sg.mchost.guru/api/ide/v1/text_to_image?prompt=${encodeURIComponent(
          `biometric emotional nft ${emotionVector.valence > 0.5 ? 'positive' : 'negative'} ${aiForm.style}`
        )}&image_size=square_hd`,
        attributes: {
          emotion_vector: emotionVector,
          biometric_data: {
            heart_rate: biometricData.heartRate,
            skin_conductance: biometricData.skinConductance,
            confidence: Math.random() * 0.2 + 0.8
          },
          ai_model: 'BiometricNN_v2.1',
          generation_timestamp: Date.now()
        }
      };

      // Simulate NFT creation process
      await new Promise(resolve => setTimeout(resolve, 2000));

      console.log('Biometric NFT Data:', nftData);
      
      setStatus(`✅ Biometric NFT generated! Ready for minting.`);
      
      // Store NFT data for later minting
      localStorage.setItem('biometricNFT', JSON.stringify(nftData));
      
    } catch (error) {
      console.error('Biometric NFT generation error:', error);
      setStatus('❌ Biometric NFT generation failed');
    } finally {
      setLoading(false);
    }
  };

  const clearData = () => {
    setBiometricData(null);
    setGeneratedImage('');
    setEmotionVector({ valence: 0.5, arousal: 0.5, dominance: 0.5 });
    setStatus('');
    localStorage.removeItem('biometricNFT');
  };

  return (
    <div className="bg-gray-800 rounded-lg p-6">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-semibold text-white">🤖 Working AI Features</h3>
        <div className="flex gap-2">
          <button
            onClick={testEmotionRecognition}
            disabled={loading}
            className="bg-purple-600 hover:bg-purple-700 disabled:bg-gray-600 text-white px-4 py-2 rounded-lg text-sm transition-colors"
          >
            🧠 Test Emotion
          </button>
          
          <button
            onClick={clearData}
            disabled={loading}
            className="bg-red-600 hover:bg-red-700 disabled:bg-gray-600 text-white px-4 py-2 rounded-lg text-sm transition-colors"
          >
            🗑️ Clear Data
          </button>
        </div>
      </div>

      {/* Biometric Analysis */}
      <div className="mb-8 p-4 bg-gray-700 rounded-lg">
        <h4 className="text-lg font-semibold text-white mb-4">🔬 Biometric Analysis</h4>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <button
            onClick={analyzeBiometricData}
            disabled={loading}
            className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 text-white py-3 px-4 rounded-lg font-semibold transition-colors"
          >
            {loading ? '🔄 Analyzing...' : '🔬 Analyze Biometrics'}
          </button>
          
          {biometricData && (
            <div className="bg-gray-600 rounded-lg p-3">
              <p className="text-gray-400 text-sm">Biometric Data</p>
              <div className="text-white text-sm">
                <div>Heart Rate: {biometricData.heartRate.toFixed(1)} bpm</div>
                <div>Skin Conductance: {biometricData.skinConductance.toFixed(3)}</div>
                <div>Expression: {biometricData.facialExpression}</div>
              </div>
            </div>
          )}
        </div>

        {/* Emotion Vector */}
        <div className="mb-4">
          <label className="block text-white font-semibold mb-2">Emotion Vector</label>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-gray-300 text-sm mb-2">Valence (Pleasure)</label>
              <input
                type="range"
                min="0"
                max="1"
                step="0.01"
                value={emotionVector.valence}
                onChange={(e) => setEmotionVector(prev => ({ ...prev, valence: parseFloat(e.target.value) }))}
                className="w-full"
              />
              <div className="text-center text-sm text-gray-400 mt-1">
                {emotionVector.valence.toFixed(2)}
              </div>
            </div>
            
            <div>
              <label className="block text-gray-300 text-sm mb-2">Arousal (Energy)</label>
              <input
                type="range"
                min="0"
                max="1"
                step="0.01"
                value={emotionVector.arousal}
                onChange={(e) => setEmotionVector(prev => ({ ...prev, arousal: parseFloat(e.target.value) }))}
                className="w-full"
              />
              <div className="text-center text-sm text-gray-400 mt-1">
                {emotionVector.arousal.toFixed(2)}
              </div>
            </div>
            
            <div>
              <label className="block text-gray-300 text-sm mb-2">Dominance (Control)</label>
              <input
                type="range"
                min="0"
                max="1"
                step="0.01"
                value={emotionVector.dominance}
                onChange={(e) => setEmotionVector(prev => ({ ...prev, dominance: parseFloat(e.target.value) }))}
                className="w-full"
              />
              <div className="text-center text-sm text-gray-400 mt-1">
                {emotionVector.dominance.toFixed(2)}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* AI Image Generation */}
      <div className="mb-8 p-4 bg-gray-700 rounded-lg">
        <h4 className="text-lg font-semibold text-white mb-4">🎨 AI Image Generation</h4>
        
        <div className="space-y-4">
          <div>
            <label className="block text-white font-semibold mb-2">Prompt</label>
            <textarea
              value={aiForm.prompt}
              onChange={(e) => setAiForm(prev => ({ ...prev, prompt: e.target.value }))}
              className="w-full p-3 rounded-lg bg-gray-600 text-white border border-gray-500 focus:border-blue-500 focus:outline-none"
              rows={3}
              placeholder="Enter prompt for AI generation"
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-white font-semibold mb-2">Style</label>
              <select
                value={aiForm.style}
                onChange={(e) => setAiForm(prev => ({ ...prev, style: e.target.value }))}
                className="w-full p-3 rounded-lg bg-gray-600 text-white border border-gray-500 focus:border-blue-500 focus:outline-none"
              >
                <option value="cyberpunk">Cyberpunk</option>
                <option value="futuristic">Futuristic</option>
                <option value="organic">Organic</option>
                <option value="abstract">Abstract</option>
                <option value="realistic">Realistic</option>
              </select>
            </div>
            
            <div className="flex items-end">
              <label className="flex items-center text-white">
                <input
                  type="checkbox"
                  checked={aiForm.useBiometricInput}
                  onChange={(e) => setAiForm(prev => ({ ...prev, useBiometricInput: e.target.checked }))}
                  className="mr-2"
                />
                Use Biometric Input
              </label>
            </div>
          </div>
          
          <div className="flex gap-2">
            <button
              onClick={generateAIImage}
              disabled={loading || !aiForm.prompt}
              className="bg-purple-600 hover:bg-purple-700 disabled:bg-gray-600 text-white px-6 py-2 rounded-lg font-semibold transition-colors"
            >
              {loading ? '🎨 Generating...' : '🎨 Generate Image'}
            </button>
            
            <button
              onClick={generateBiometricNFT}
              disabled={loading || !biometricData}
              className="bg-orange-600 hover:bg-orange-700 disabled:bg-gray-600 text-white px-4 py-2 rounded-lg text-sm transition-colors"
            >
              🎨 Create NFT
            </button>
          </div>
        </div>
      </div>

      {/* Generated Image */}
      {generatedImage && (
        <div className="mb-6 p-4 bg-gray-700 rounded-lg">
          <h4 className="text-lg font-semibold text-white mb-4">🖼️ Generated Image</h4>
          <div className="flex justify-center">
            <img
              src={generatedImage}
              alt="AI Generated"
              className="max-w-full h-64 object-contain rounded-lg border border-gray-600"
            />
          </div>
          <div className="mt-2 text-center">
            <p className="text-gray-400 text-sm">Generated with biometric input: {aiForm.useBiometricInput ? 'Yes' : 'No'}</p>
          </div>
        </div>
      )}

      {/* Status */}
      {status && (
        <div className="mt-6 p-4 bg-yellow-900 bg-opacity-50 rounded-lg">
          <p className="text-yellow-100">{status}</p>
        </div>
      )}
    </div>
  );
}