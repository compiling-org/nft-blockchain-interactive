import React, { useState, useEffect } from 'react';

// Completely isolated marketplace component with no external dependencies
const IsolatedMarketplace: React.FC = () => {
  const [listings, setListings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadMarketplaceData = async () => {
      try {
        console.log('Loading marketplace data from backend...');
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 8000);
        const response = await fetch('/api/marketplace/listings', { signal: controller.signal });
        clearTimeout(timeout);
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        console.log('Marketplace data received:', data);
        
        if (data.success && data.listings) {
          setListings(data.listings);
        } else {
          throw new Error('Invalid data format received');
        }
        
        setLoading(false);
      } catch (err) {
        console.error('Failed to load marketplace data:', err);
        setError(err instanceof Error ? err.message : 'Failed to load marketplace');
        setLoading(false);
      }
    };

    loadMarketplaceData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
          <div className="text-white text-xl">Loading AI Marketplace...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center">
        <div className="bg-red-900 bg-opacity-50 border border-red-500 rounded-lg p-6 text-center">
          <div className="text-red-200 text-xl mb-2">❌ Error Loading Marketplace</div>
          <div className="text-red-300 text-sm">{error}</div>
          <div className="text-red-400 text-xs mt-2">Make sure the backend is running on port 3002</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-white mb-4 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
            🤖 Bitte AI Marketplace
          </h1>
          <p className="text-xl text-gray-300 mb-8">
            Discover and Trade AI-Powered Biometric NFTs
          </p>
          <div className="bg-green-900 bg-opacity-50 border border-green-500 rounded-lg p-4 inline-block">
            <div className="text-green-200 text-sm">
              ✅ Connected to Backend • {listings.length} Listings Available
            </div>
          </div>
        </div>

        {/* Listings Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {listings.map((listing) => (
            <div key={listing.id} className="bg-gray-800 bg-opacity-50 backdrop-blur-lg rounded-xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105">
              {/* Image */}
              <div className="relative">
                <img 
                  src={listing.media_url} 
                  alt={listing.title}
                  className="w-full h-48 object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = 'https://via.placeholder.com/400x300/8B5CF6/FFFFFF?text=AI+NFT+Art';
                  }}
                />
                <div className="absolute top-2 right-2 bg-purple-600 text-white px-2 py-1 rounded-full text-xs font-semibold">
                  {listing.category}
                </div>
                {listing.featured && (
                  <div className="absolute top-2 left-2 bg-yellow-500 text-black px-2 py-1 rounded-full text-xs font-semibold">
                    ⭐ Featured
                  </div>
                )}
              </div>
              
              {/* Content */}
              <div className="p-6">
                <h3 className="text-xl font-bold text-white mb-2 line-clamp-2">{listing.title}</h3>
                <p className="text-gray-300 text-sm mb-4 line-clamp-3">{listing.description}</p>
                
                {/* Stats */}
                <div className="flex justify-between items-center mb-4 text-sm text-gray-400">
                  <span>👁️ {listing.views} views</span>
                  <span>❤️ {listing.likes} likes</span>
                </div>
                
                {/* AI Model */}
                <div className="bg-blue-900 bg-opacity-30 rounded-lg p-2 mb-4">
                  <div className="text-blue-300 text-xs">AI Model: {listing.ai_model}</div>
                </div>
                
                {/* Emotion Vector */}
                <div className="bg-purple-900 bg-opacity-30 rounded-lg p-2 mb-4">
                  <div className="text-purple-300 text-xs mb-1">Emotion Vector:</div>
                  <div className="flex justify-between text-xs text-purple-200">
                    <span>V: {listing.emotion_vector.valence.toFixed(2)}</span>
                    <span>A: {listing.emotion_vector.arousal.toFixed(2)}</span>
                    <span>D: {listing.emotion_vector.dominance.toFixed(2)}</span>
                  </div>
                </div>
                
                {/* Price and Action */}
                <div className="flex justify-between items-center">
                  <div className="text-2xl font-bold text-green-400">
                    {listing.price} {listing.currency}
                  </div>
                  <button className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-4 py-2 rounded-lg font-semibold transition-all duration-200 transform hover:scale-105">
                    Buy Now
                  </button>
                </div>
                
                {/* Seller */}
                <div className="mt-4 pt-4 border-t border-gray-700">
                  <div className="text-gray-400 text-xs">
                    Seller: <span className="text-blue-400 font-mono">{listing.seller}</span>
                  </div>
                  <div className="text-gray-500 text-xs mt-1">
                    Created: {new Date(listing.created_at).toLocaleDateString()}
                  </div>
                </div>
                
                {/* Tags */}
                <div className="mt-4 flex flex-wrap gap-1">
                  {listing.tags.map((tag: string, index: number) => (
                    <span key={index} className="bg-gray-700 text-gray-300 px-2 py-1 rounded-full text-xs">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
        
        {listings.length === 0 && (
          <div className="text-center text-white text-xl mt-20">
            <div className="bg-yellow-900 bg-opacity-50 border border-yellow-600 rounded-lg p-8 inline-block">
              <div className="text-yellow-200 text-2xl mb-4">📭 No Listings Found</div>
              <div className="text-yellow-300">The marketplace is empty. Check back later!</div>
            </div>
          </div>
        )}
        
        {/* Footer Stats */}
        {listings.length > 0 && (
          <div className="mt-12 text-center">
            <div className="bg-gray-800 bg-opacity-50 rounded-lg p-6 inline-block">
              <div className="text-gray-300 text-lg">
                🎉 Successfully loaded {listings.length} AI-powered NFTs from Bitte Marketplace
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default IsolatedMarketplace;
