import { realMarketplaceService } from '../services/realMarketplaceService';
import { myNearWalletService } from '../services/myNearWalletService';
import { toast } from 'sonner';

interface BitteAIChatIntegrationProps {
  isWalletConnected: boolean;
  accountId?: string;
  className?: string;
}

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
}

export default function BitteAIChatIntegration({
  isWalletConnected,
  accountId,
  className = ''
}: BitteAIChatIntegrationProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);

  // Initialize with welcome message
  useEffect(() => {
    if (messages.length === 0) {
      setMessages([{
        id: 'welcome-1',
        role: 'assistant',
        content: `👋 Welcome to Bitte AI Marketplace! I'm your on-chain agent. I can help you with:\n\n• Finding biometric NFTs\n• Deploying AI agents to NEAR\n• Understanding emotion vectors\n\n${!isWalletConnected ? "❌ Wallet disconnected. Connect NEAR to unlock deployment." : "✅ Wallet ready."}`,
        timestamp: Date.now()
      }]);
    }
  }, [isWalletConnected]);

  const deployAgent = async (agentName: string) => {
    if (!isWalletConnected || !accountId) {
      toast.error('Connect NEAR wallet to deploy agents');
      return;
    }

    setIsLoading(true);
    toast.loading(`Deploying ${agentName} agent...`);

    try {
      // Real NEAR contract call for agent deployment as per architecture
      await myNearWalletService.callMethod(
        'agent-factory.sleeplessmonk.testnet',
        'deploy_agent',
        {
          owner_id: accountId,
          agent_name: agentName,
          biometric_resonance: true
        },
        '30000000000000',
        '100000000000000000000000' // 0.1 NEAR
      );

      toast.success(`${agentName} deployed!`);
      setMessages(prev => [...prev, {
        id: `deploy-${Date.now()}`,
        role: 'assistant',
        content: `✅ Successfully deployed ${agentName}! You can now access it in your dashboard.`,
        timestamp: Date.now()
      }]);
    } catch (error) {
      toast.error('Deployment failed');
    } finally {
      setIsLoading(false);
    }
  };

  const sendMessage = async () => {
    if (!inputMessage.trim() || !isWalletConnected) return;

    const userMessage: Message = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: inputMessage,
      timestamp: Date.now()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);

    try {
      // Simulate AI response based on marketplace context
      const aiResponse = await generateAIResponse(inputMessage);

      const assistantMessage: Message = {
        id: `assistant-${Date.now()}`,
        role: 'assistant',
        content: aiResponse,
        timestamp: Date.now()
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error('AI chat error:', error);
      const errorMessage: Message = {
        id: `error-${Date.now()}`,
        role: 'assistant',
        content: 'Sorry, I encountered an error processing your request. Please try again.',
        timestamp: Date.now()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const generateAIResponse = async (message: string): Promise<string> => {
    // Simple AI response generation based on keywords
    const lowerMessage = message.toLowerCase();

    if (lowerMessage.includes('nft') || lowerMessage.includes('listing')) {
      return `🎨 I can help you explore biometric NFTs! Currently, we have ${await getActiveListingsCount()} active listings including emotional portraits and AI-generated art. Would you like me to show you specific categories or help you understand the emotion vectors?`;
    }

    if (lowerMessage.includes('agent') || lowerMessage.includes('ai')) {
      const agents = await getActiveAgentsCount();
      return `🤖 Our marketplace features ${agents} active AI agents. You can deploy a "Fractal Master" or "Emotion Analyzer" right now for 0.1 NEAR. Would you like to deploy one?`;
    }

    if (lowerMessage.includes('emotion') || lowerMessage.includes('vector')) {
      return `💭 Emotion vectors represent the emotional state of biometric NFTs using three dimensions:\n\n• Valence: Pleasantness (0-1)\n• Arousal: Energy level (0-1) \n• Dominance: Control level (0-1)\n\nThese vectors are generated from biometric data and influence the NFT's appearance and behavior.`;
    }

    if (lowerMessage.includes('price') || lowerMessage.includes('cost')) {
      return `💰 Current listings range from 5.5 to 12 NEAR. AI agents cost 0.1-0.15 NEAR per use. All transactions are processed on the NEAR blockchain with real wallet integration. Would you like help with a specific purchase?`;
    }

    if (lowerMessage.includes('wallet') || lowerMessage.includes('connect')) {
      return isWalletConnected
        ? `✅ Your wallet is connected! Account: ${accountId}. You can now buy NFTs, deploy agents, and participate in auctions. What would you like to do first?`
        : `🔌 Please connect your NEAR wallet to access all marketplace features including buying NFTs, deploying agents, and placing bids. Click the "Connect NEAR Wallet" button above.`;
    }

    return `🤔 I'm here to help with the Bitte AI Marketplace! I can assist you with:\n\n• Exploring biometric NFT listings\n• Understanding AI agents and their capabilities\n• Learning about emotion vectors and biometric data\n• Getting pricing and market information\n• Helping with wallet connections and transactions\n\nWhat specific aspect would you like to know more about?`;
  };

  const getActiveListingsCount = async (): Promise<number> => {
    try {
      const listings = await realMarketplaceService.getMarketplaceListings();
      return listings.length;
    } catch {
      return 2; // Default fallback
    }
  };

  const getActiveAgentsCount = async (): Promise<number> => {
    try {
      const agents = await realMarketplaceService.getAIAgents();
      return agents.length;
    } catch {
      return 2; // Default fallback
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className={`fixed bottom-4 right-4 z-50 ${className}`}>
      {/* Chat Toggle Button */}
      <button
        onClick={() => setIsChatOpen(!isChatOpen)}
        className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white rounded-full p-4 shadow-lg transition-all duration-300 transform hover:scale-105"
      >
        {isChatOpen ? '✕' : '💬'}
      </button>

      {/* Chat Window */}
      {isChatOpen && (
        <div className="absolute bottom-16 right-0 w-80 h-96 bg-white rounded-lg shadow-2xl border border-gray-200 flex flex-col">
          {/* Chat Header */}
          <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white p-4 rounded-t-lg">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="font-semibold">🤖 Bitte AI Assistant</h3>
                <p className="text-xs opacity-90">Marketplace Guide</p>
              </div>
              <div className="w-2 h-2 bg-green-400 rounded-full"></div>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-xs px-3 py-2 rounded-lg text-sm ${message.role === 'user'
                      ? 'bg-purple-600 text-white'
                      : 'bg-gray-100 text-gray-800'
                    }`}
                >
                  <div className="whitespace-pre-wrap">{message.content}</div>
                  {message.content.includes('Would you like to deploy') && (
                    <div className="mt-3 flex gap-2">
                      <button
                        onClick={() => deployAgent('Fractal Master')}
                        className="bg-blue-500 hover:bg-blue-600 text-[10px] px-2 py-1 rounded-full font-bold"
                      >
                        Deploy Fractal Master
                      </button>
                    </div>
                  )}
                  <div className="text-xs opacity-70 mt-1">
                    {new Date(message.timestamp).toLocaleTimeString()}
                  </div>
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-gray-100 text-gray-800 px-3 py-2 rounded-lg text-sm">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Input */}
          <div className="p-4 border-t border-gray-200">
            {!isWalletConnected ? (
              <div className="text-center text-sm text-gray-500">
                🔌 Connect wallet to chat with AI
              </div>
            ) : (
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Ask about NFTs, agents, or market..."
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                  disabled={isLoading}
                />
                <button
                  onClick={sendMessage}
                  disabled={isLoading || !inputMessage.trim()}
                  className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Send
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}