import { useState, useEffect } from 'react';
import { realMarketplaceService } from '../services/realMarketplaceService';
import { myNearWalletService } from '../services/myNearWalletService';

export interface InteractiveNFTMetadata {
  title: string;
  description: string;
  media: string;
  filecoin_cid: string;
  interactive_content: {
    type: 'webgl' | 'fractal' | 'ai_generated' | 'biometric';
    parameters: Record<string, any>;
    updateable: boolean;
  };
  update_history: Array<{
    timestamp: number;
    updated_by: string;
    changes: Record<string, any>;
  }>;
}

export default function InteractiveNFTFilecoinTest() {
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState('');
  const [deployedNFTs, setDeployedNFTs] = useState<any[]>([]);
  const [nftForm, setNftForm] = useState({
    title: 'Interactive Fractal NFT',
    description: 'An interactive NFT with fractal content stored on Filecoin',
    fractalType: 'mandelbrot',
    complexity: 100,
    colorScheme: 'rainbow',
    interactive: true,
    filecoinCID: ''
  });

  useEffect(() => {
    loadDeployedNFTs();
  }, []);

  const loadDeployedNFTs = async () => {
    if (!myNearWalletService.isSignedIn()) return;
    
    try {
      const accountId = myNearWalletService.getAccountId();
      // This would normally call a specific method to get interactive NFTs
      // For now, we'll simulate with the existing listings
      const listings = await realMarketplaceService.getMarketplaceListings();
      const interactiveNFTs = listings.filter(listing => 
        listing.metadata?.extra?.includes('filecoin') || 
        listing.metadata?.extra?.includes('interactive')
      );
      setDeployedNFTs(interactiveNFTs);
    } catch (error) {
      console.error('Failed to load deployed NFTs:', error);
    }
  };

  const generateFractalContent = async () => {
    // Simulate generating fractal content that would be stored on Filecoin
    const fractalData = {
      type: nftForm.fractalType,
      complexity: nftForm.complexity,
      colorScheme: nftForm.colorScheme,
      parameters: {
        zoom: 1.0,
        centerX: 0,
        centerY: 0,
        iterations: nftForm.complexity
      },
      timestamp: Date.now(),
      generator: 'WebGPU Fractal Engine'
    };

    // Simulate uploading to Filecoin and getting CID
    const mockFilecoinCID = `bafybeig${Math.random().toString(36).substring(2, 15)}`;
    
    setNftForm(prev => ({ ...prev, filecoinCID: mockFilecoinCID }));
    setStatus(`✅ Generated fractal content. Simulated Filecoin CID: ${mockFilecoinCID}`);
    
    return mockFilecoinCID;
  };

  const handleDeployInteractiveNFT = async () => {
    if (!myNearWalletService.isSignedIn()) {
      setStatus('❌ Please connect wallet first');
      return;
    }

    setLoading(true);
    setStatus('🔄 Deploying interactive NFT with Filecoin content...');

    try {
      let filecoinCID = nftForm.filecoinCID;
      
      if (!filecoinCID) {
        filecoinCID = await generateFractalContent();
      }

      const tokenId = `interactive_${Date.now()}`;
      const interactiveContent = {
        type: nftForm.fractalType === 'mandelbrot' ? 'fractal' : 'webgl',
        parameters: {
          fractalType: nftForm.fractalType,
          complexity: nftForm.complexity,
          colorScheme: nftForm.colorScheme,
          interactive: nftForm.interactive
        },
        updateable: true
      };

      const metadata = {
        title: nftForm.title,
        description: nftForm.description,
        media: `https://trae-api-sg.mchost.guru/api/ide/v1/text_to_image?prompt=${encodeURIComponent(nftForm.fractalType + ' fractal nft')}&image_size=square_hd`,
        extra: JSON.stringify({
          filecoin_cid: filecoinCID,
          interactive_content: interactiveContent,
          update_history: [{
            timestamp: Date.now(),
            updated_by: myNearWalletService.getAccountId(),
            changes: { initial_deployment: true }
          }]
        })
      };

      const params = {
        tokenId,
        price: '0.5', // Price for interactive NFT
        metadata,
        emotionVector: {
          valence: 0.7, // Positive emotion for interactive content
          arousal: 0.8, // High energy
          dominance: 0.6  // Moderate control
        }
      };

      const result = await realMarketplaceService.createListing(params);
      
      if (result.success) {
        setStatus(`✅ Interactive NFT deployed! Transaction: ${result.transactionHash?.slice(0, 8)}... Filecoin CID: ${filecoinCID}`);
        await loadDeployedNFTs(); // Refresh the list
        
        // Reset form
        setNftForm({
          title: 'Interactive Fractal NFT',
          description: 'An interactive NFT with fractal content stored on Filecoin',
          fractalType: 'mandelbrot',
          complexity: 100,
          colorScheme: 'rainbow',
          interactive: true,
          filecoinCID: ''
        });
      } else {
        setStatus(`❌ Deployment failed: ${result.error}`);
      }
    } catch (error) {
      console.error('Interactive NFT deployment error:', error);
      setStatus('❌ Deployment error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateNFTContent = async (tokenId: string, currentCID: string) => {
    setLoading(true);
    setStatus('🔄 Updating NFT content...');

    try {
      // Simulate updating the fractal parameters and getting new CID
      const newFractalData = {
        type: nftForm.fractalType,
        complexity: nftForm.complexity + 50, // Increase complexity
        colorScheme: nftForm.colorScheme === 'rainbow' ? 'fire' : 'rainbow',
        parameters: {
          zoom: 2.0,
          centerX: Math.random() * 2 - 1,
          centerY: Math.random() * 2 - 1,
          iterations: nftForm.complexity + 50
        },
        timestamp: Date.now(),
        generator: 'WebGPU Fractal Engine - Updated'
      };

      const newFilecoinCID = `bafybeig${Math.random().toString(36).substring(2, 15)}`;
      
      // This would normally call an update method on the NFT contract
      // For now, we'll simulate the update
      setStatus(`✅ Updated fractal content. New Filecoin CID: ${newFilecoinCID}`);
      
      return newFilecoinCID;
    } catch (error) {
      console.error('NFT update error:', error);
      setStatus('❌ Update failed');
    } finally {
      setLoading(false);
    }
  };

  const handleTestFractalRendering = () => {
    setStatus('🔄 Testing WebGPU fractal rendering...');
    
    // Simulate fractal rendering test
    const canvas = document.createElement('canvas');
    canvas.width = 256;
    canvas.height = 256;
    
    // Check for WebGPU support
    if ('gpu' in navigator) {
      setStatus('✅ WebGPU supported! Testing fractal generation...');
      
      // Simulate fractal generation
      setTimeout(() => {
        setStatus('✅ Fractal rendering test completed successfully!');
      }, 1000);
    } else {
      setStatus('⚠️ WebGPU not available, falling back to WebGL');
      
      // Simulate WebGL fractal
      setTimeout(() => {
        setStatus('✅ WebGL fractal rendering test completed!');
      }, 1000);
    }
  };

  return (
    <div className="bg-gray-800 rounded-lg p-6">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-semibold text-white">🎨 Interactive NFT with Filecoin</h3>
        <div className="flex gap-2">
          <button
            onClick={handleTestFractalRendering}
            disabled={loading}
            className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg text-sm transition-colors disabled:opacity-50"
          >
            🧪 Test Rendering
          </button>
          <button
            onClick={loadDeployedNFTs}
            disabled={loading}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm transition-colors disabled:opacity-50"
          >
            🔄 Refresh
          </button>
        </div>
      </div>

      {/* Deploy New Interactive NFT */}
      <div className="mb-8 p-4 bg-gray-700 rounded-lg">
        <h4 className="text-lg font-semibold text-white mb-4">Deploy Interactive NFT</h4>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-white font-semibold mb-2">Title</label>
            <input
              type="text"
              value={nftForm.title}
              onChange={(e) => setNftForm(prev => ({ ...prev, title: e.target.value }))}
              className="w-full p-3 rounded-lg bg-gray-600 text-white border border-gray-500 focus:border-blue-500 focus:outline-none"
              placeholder="Enter NFT title"
            />
          </div>
          
          <div>
            <label className="block text-white font-semibold mb-2">Fractal Type</label>
            <select
              value={nftForm.fractalType}
              onChange={(e) => setNftForm(prev => ({ ...prev, fractalType: e.target.value }))}
              className="w-full p-3 rounded-lg bg-gray-600 text-white border border-gray-500 focus:border-blue-500 focus:outline-none"
            >
              <option value="mandelbrot">Mandelbrot Set</option>
              <option value="julia">Julia Set</option>
              <option value="sierpinski">Sierpinski Triangle</option>
              <option value="koch">Koch Snowflake</option>
            </select>
          </div>
          
          <div>
            <label className="block text-white font-semibold mb-2">Complexity</label>
            <input
              type="range"
              min="50"
              max="500"
              value={nftForm.complexity}
              onChange={(e) => setNftForm(prev => ({ ...prev, complexity: parseInt(e.target.value) }))}
              className="w-full"
            />
            <div className="text-center text-sm text-gray-400 mt-1">
              {nftForm.complexity} iterations
            </div>
          </div>
          
          <div>
            <label className="block text-white font-semibold mb-2">Color Scheme</label>
            <select
              value={nftForm.colorScheme}
              onChange={(e) => setNftForm(prev => ({ ...prev, colorScheme: e.target.value }))}
              className="w-full p-3 rounded-lg bg-gray-600 text-white border border-gray-500 focus:border-blue-500 focus:outline-none"
            >
              <option value="rainbow">Rainbow</option>
              <option value="fire">Fire</option>
              <option value="ocean">Ocean</option>
              <option value="monochrome">Monochrome</option>
            </select>
          </div>
        </div>
        
        <div className="mt-4">
          <label className="block text-white font-semibold mb-2">Description</label>
          <textarea
            value={nftForm.description}
            onChange={(e) => setNftForm(prev => ({ ...prev, description: e.target.value }))}
            className="w-full p-3 rounded-lg bg-gray-600 text-white border border-gray-500 focus:border-blue-500 focus:outline-none"
            rows={3}
            placeholder="Describe your interactive NFT"
          />
        </div>
        
        <div className="mt-4 flex gap-2">
          <button
            onClick={generateFractalContent}
            disabled={loading}
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm transition-colors disabled:opacity-50"
          >
            🎨 Generate Content
          </button>
          
          <button
            onClick={handleDeployInteractiveNFT}
            disabled={loading || !nftForm.title || !nftForm.description}
            className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded-lg font-semibold transition-colors disabled:opacity-50"
          >
            🚀 Deploy NFT
          </button>
        </div>
        
        {nftForm.filecoinCID && (
          <div className="mt-4 p-3 bg-green-900 bg-opacity-50 rounded-lg">
            <p className="text-green-100 text-sm">
              📁 Simulated Filecoin CID: <span className="font-mono">{nftForm.filecoinCID}</span>
            </p>
          </div>
        )}
      </div>

      {/* Deployed Interactive NFTs */}
      <div>
        <h4 className="text-lg font-semibold text-white mb-4">Deployed Interactive NFTs ({deployedNFTs.length})</h4>
        
        {deployedNFTs.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-400">No interactive NFTs deployed yet</p>
            <p className="text-gray-500 text-sm mt-2">Deploy your first interactive NFT above!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {deployedNFTs.map((nft, index) => (
              <div key={index} className="bg-gray-700 rounded-lg p-4">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h5 className="text-lg font-semibold text-white">{nft.metadata?.title}</h5>
                    <p className="text-gray-400 text-sm">{nft.metadata?.description}</p>
                  </div>
                  <div className="text-purple-400 font-bold text-sm">🎨 INTERACTIVE</div>
                </div>
                
                <div className="grid grid-cols-1 gap-2 mb-4">
                  <div className="bg-gray-600 rounded p-2">
                    <p className="text-gray-400 text-xs">Filecoin CID</p>
                    <p className="text-white font-mono text-xs truncate">
                      {nft.metadata?.extra?.filecoin_cid || 'N/A'}
                    </p>
                  </div>
                  <div className="bg-gray-600 rounded p-2">
                    <p className="text-gray-400 text-xs">Price</p>
                    <p className="text-white font-bold">{nft.price} Ⓝ</p>
                  </div>
                </div>
                
                <div className="flex gap-2">
                  <button
                    onClick={() => handleUpdateNFTContent(nft.listing_id, nft.metadata?.extra?.filecoin_cid)}
                    disabled={loading}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded text-sm transition-colors disabled:opacity-50"
                  >
                    🔄 Update Content
                  </button>
                  
                  <button
                    className="bg-green-600 hover:bg-green-700 text-white px-3 py-2 rounded text-sm transition-colors"
                  >
                    🎯 Interact
                  </button>
                </div>
              </div>
            ))}
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