import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, X, Send, Maximize2, Minimize2 } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { BotCharacter } from './BotCharacter';

interface Message {
  id: string;
  type: 'user' | 'ai';
  content: string;
  timestamp: Date;
  category?: 'meal-planning' | 'nutrition' | 'budget' | 'tracking';
}

const AIChatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      type: 'ai',
      content: "👋 Hi! I'm your AI Nutritionist. I can help you with meal planning, nutrition advice, budget optimization, and health tracking. What would you like to know?",
      timestamp: new Date()
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!inputValue.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: inputValue,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    // Categorize the message and generate appropriate response
    const response = await generateAIResponse(inputValue);
    
    setMessages(prev => [...prev, response]);
    setIsLoading(false);
  };

  const generateAIResponse = async (userInput: string): Promise<Message> => {
    // Simulate AI processing time
    await new Promise(resolve => setTimeout(resolve, 1000));

    const input = userInput.toLowerCase();
    let response: Message = {
      id: Date.now().toString(),
      type: 'ai',
      timestamp: new Date(),
      content: ''
    };

    // Categorize input and generate appropriate response
    if (input.includes('meal') || input.includes('recipe') || input.includes('food')) {
      response.category = 'meal-planning';
      response.content = "I can help you create a personalized meal plan. Would you like me to generate one based on your preferences and budget?";
    } else if (input.includes('nutrition') || input.includes('protein') || input.includes('calories')) {
      response.category = 'nutrition';
      response.content = "Let me provide you with detailed nutritional information. What specific aspects would you like to know about?";
    } else if (input.includes('budget') || input.includes('cost') || input.includes('price')) {
      response.category = 'budget';
      response.content = "I can help optimize your meal plan to fit your budget. What's your weekly budget for meals?";
    } else if (input.includes('track') || input.includes('progress') || input.includes('goal')) {
      response.category = 'tracking';
      response.content = "I can help you track your nutritional goals. Would you like to see your current progress or set new goals?";
    } else {
      response.content = "I can assist you with meal planning, nutrition advice, budget optimization, or progress tracking. What would you like to focus on?";
    }

    return response;
  };

  return (
    <AnimatePresence>
      <div className="fixed bottom-4 right-4 z-50">
        {/* Chat Button */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setIsOpen(!isOpen)}
          className="bg-primary text-white p-4 rounded-full shadow-lg"
        >
          {isOpen ? <X size={24} /> : <MessageCircle size={24} />}
        </motion.button>

        {/* Chat Window */}
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className={`absolute bottom-16 right-0 bg-white rounded-lg shadow-xl border border-gray-200 overflow-hidden ${
              isExpanded ? 'w-[440px] h-[600px]' : 'w-[380px] h-[500px]'
            }`}
          >
            {/* Header */}
            <div className="bg-primary p-4 text-white flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12">
                  <BotCharacter />
                </div>
                <div>
                  <h3 className="font-semibold">AI Nutritionist</h3>
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-green-400 rounded-full"></span>
                    <p className="text-xs opacity-90">Online</p>
                  </div>
                </div>
              </div>
              <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="hover:bg-white/10 p-1 rounded"
              >
                {isExpanded ? <Minimize2 size={18} /> : <Maximize2 size={18} />}
              </button>
            </div>

            {/* Messages */}
            <div className="p-4 overflow-y-auto h-[calc(100%-130px)]">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex mb-4 ${
                    message.type === 'user' ? 'justify-end' : 'justify-start'
                  }`}
                >
                  <div
                    className={`max-w-[80%] rounded-lg p-3 ${
                      message.type === 'user'
                        ? 'bg-primary text-white'
                        : 'bg-gray-100'
                    }`}
                  >
                    <p className="text-sm">{message.content}</p>
                    <p className="text-xs mt-1 opacity-70">
                      {message.timestamp.toLocaleTimeString()}
                    </p>
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex items-center gap-2 text-gray-500">
                  <BotCharacter />
                  <p className="text-sm">Thinking...</p>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="p-4 border-t border-gray-200">
              <div className="flex gap-2">
                <Input
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                  placeholder="Ask about nutrition, meals, or tracking..."
                  className="flex-1"
                />
                <Button
                  onClick={handleSend}
                  disabled={!inputValue.trim() || isLoading}
                >
                  <Send size={18} />
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </AnimatePresence>
  );
};

export default AIChatbot; 