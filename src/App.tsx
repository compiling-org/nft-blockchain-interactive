import React from 'react';
import { ComprehensiveAIMLBlockchainIntegration } from './components/ComprehensiveAIMLBlockchainIntegration_REAL';

function App() {
  return (
    <div className="min-h-screen bg-gray-900">
      <header className="bg-gray-800 shadow">
        <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-white">
            Blockchain/AI/ML Integration Platform
          </h1>
          <p className="text-gray-300 mt-2">
            Real NEAR Wallet Integration • BrainFlow EEG Processing • ONNX Runtime • Cross-Chain Messaging
          </p>
        </div>
      </header>
      
      <main>
        <ComprehensiveAIMLBlockchainIntegration />
      </main>
      
      <footer className="bg-gray-800">
        <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8">
          <p className="text-center text-gray-400 text-sm">
            Now with REAL wallet connections and smart contract integration!
          </p>
        </div>
      </footer>
    </div>
  );
}

export default App;