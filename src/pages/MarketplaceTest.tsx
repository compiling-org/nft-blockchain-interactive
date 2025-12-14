import React, { useState, useEffect } from 'react';
import { enhancedMarketplaceService } from '../services/enhancedMarketplaceService';

const MarketplaceTest: React.FC = () => {
  const [listings, setListings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const testMarketplace = async () => {
      try {
        console.log('Testing marketplace connection...');
        const result = await enhancedMarketplaceService.getListings({}, { page: 1, limit: 5 });
        console.log('Marketplace test result:', result);
        setListings(result.listings);
        setLoading(false);
      } catch (err) {
        console.error('Marketplace test failed:', err);
        setError(err instanceof Error ? err.message : 'Unknown error');
        setLoading(false);
      }
    };

    testMarketplace();
  }, []);

  if (loading) return <div className="text-white">Loading marketplace data...</div>;
  if (error) return <div className="text-red-400">Error: {error}</div>;

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold text-white mb-4">Marketplace Test</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {listings.map((listing) => (
          <div key={listing.id} className="bg-gray-800 p-4 rounded-lg">
            <h3 className="text-white font-bold">{listing.title}</h3>
            <p className="text-gray-300 text-sm">{listing.description}</p>
            <p className="text-green-400 font-semibold">{listing.price} {listing.currency}</p>
            <p className="text-blue-400 text-xs">Seller: {listing.seller}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MarketplaceTest;