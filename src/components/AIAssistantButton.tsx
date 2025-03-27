import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, X, Maximize2, Minimize2, Send, Loader2 } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { BotCharacter } from './BotCharacter';
import { AIService } from '../services/ai-service';
import { useAuth } from '../contexts/AuthContext';
import { v4 as uuidv4 } from 'uuid';

// Simple message type for component use
interface ChatMessage {
  id: string;
  type: 'user' | 'ai';
  content: string;
  timestamp: Date;
  category?: 'meal-planning' | 'nutrition' | 'budget' | 'tracking';
}

export const AIAssistantButton = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [showWelcome, setShowWelcome] = useState(true);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: uuidv4(),
      type: 'ai',
      content: "👋 Hi! I'm your AI Nutritionist. I can help you with meal planning, nutrition advice, budget optimization, and health tracking. What would you like to know?",
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { user } = useAuth();

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Hide welcome message when chat is opened
  useEffect(() => {
    if (isOpen) {
      setShowWelcome(false);
    }
  }, [isOpen]);

  // Show welcome message again after chat is closed (with delay)
  useEffect(() => {
    if (!isOpen) {
      const timer = setTimeout(() => {
        setShowWelcome(true);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  // Function to categorize user input
  const categorizeMessage = (content: string): ChatMessage['category'] => {
    const keywords = {
      'meal-planning': ['meal', 'plan', 'diet', 'food', 'eat', 'recipe', 'breakfast', 'lunch', 'dinner'],
      'nutrition': ['nutrition', 'protein', 'calories', 'vitamins', 'carbs', 'fat', 'fiber', 'healthy'],
      'budget': ['budget', 'cost', 'price', 'money', 'expensive', 'cheap', 'afford'],
      'tracking': ['track', 'progress', 'goal', 'weight', 'measure', 'monitor', 'record']
    };

    for (const [category, words] of Object.entries(keywords)) {
      if (words.some(word => content.toLowerCase().includes(word))) {
        return category as ChatMessage['category'];
      }
    }
    return undefined;
  };

  // Enhanced message handling with AI integration
  const handleSend = async () => {
    if (!input.trim() || isProcessing) return;
    
    const userMessage: ChatMessage = {
      id: uuidv4(),
      type: 'user',
      content: input.trim(),
      timestamp: new Date(),
      category: categorizeMessage(input)
    };

    // Add user message immediately
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsProcessing(true);
    setError(null);

    try {
      // Get user preferences from context
      const userPreferences = {
        name: user?.name || 'Guest',
        age: user?.age || 30,
        weight: user?.weight || 70,
        height: user?.height || 170,
        dietaryRestrictions: user?.dietaryRestrictions || [],
        allergies: user?.allergies || [],
        weeklyBudget: user?.weeklyBudget || 4000,
        fitnessGoals: user?.fitnessGoals || ['Stay healthy'],
        mealPreferences: user?.mealPreferences || {
          breakfast: true,
          lunch: true,
          dinner: true,
          snacks: true
        }
      };

      // Send all messages to get context-aware responses
      const aiResponse = await AIService.generateResponse(
        messages as any, // Type conversion
        userPreferences
      );
      
      // Special handling for meal planning requests
      if (userMessage.category === 'meal-planning' && 
          input.toLowerCase().includes('generate') || 
          input.toLowerCase().includes('create')) {
        
        // Show an interim message
        setMessages(prev => [...prev, {
          id: uuidv4(),
          type: 'ai',
          content: "I'm creating a personalized meal plan for you. This might take a moment...",
          timestamp: new Date()
        }]);
        
        // Generate the meal plan
        const mealPlan = await AIService.generateMealPlan(userPreferences);
        
        // Add the meal plan response
        setMessages(prev => [...prev, {
          id: uuidv4(),
          type: 'ai',
          content: mealPlan,
          timestamp: new Date(),
          category: 'meal-planning'
        }]);
      } else if (userMessage.category === 'nutrition' && 
                (input.toLowerCase().includes('analyze') || 
                 input.toLowerCase().includes('what is in'))) {
        
        // Extract the meal to analyze - basic extraction, can be improved
        const mealToAnalyze = input.replace(/analyze|what is in|nutrition in|tell me about/gi, '').trim();
        
        // Show interim message
        setMessages(prev => [...prev, {
          id: uuidv4(),
          type: 'ai',
          content: "Analyzing the nutritional content of this meal...",
          timestamp: new Date()
        }]);
        
        // Get nutritional analysis
        const nutritionAnalysis = await AIService.analyzeNutrition(mealToAnalyze);
        
        // Add the nutrition analysis response
        setMessages(prev => [...prev, {
          id: uuidv4(),
          type: 'ai',
          content: nutritionAnalysis,
          timestamp: new Date(),
          category: 'nutrition'
        }]);
      } else {
        // Add standard AI response for general queries
        setMessages(prev => [...prev, {
          id: uuidv4(),
          type: 'ai',
          content: aiResponse,
          timestamp: new Date(),
          category: userMessage.category
        }]);
      }
    } catch (err: any) {
      console.error('Error processing message:', err);
      setError(`Sorry, I encountered an error: ${err.message || 'Please try again.'}`);
      
      // Add error message
      setMessages(prev => [...prev, {
        id: uuidv4(),
        type: 'ai',
        content: "I'm sorry, I encountered an error processing your request. Please try again.",
        timestamp: new Date()
      }]);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <>
      {/* Enhanced Chat Button with Welcome Message */}
      <motion.div
        className="fixed bottom-6 right-6 z-[9999]"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        transition={{ duration: 0.2 }}
        onHoverStart={() => setShowWelcome(true)}
        onHoverEnd={() => !isOpen && setShowWelcome(false)}
      >
        {/* Welcome Message Bubble */}
        <AnimatePresence>
          {showWelcome && !isOpen && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.8, y: 20 }}
              transition={{ duration: 0.2 }}
              className="absolute bottom-20 right-0 bg-white rounded-2xl shadow-lg border border-gray-100 p-4 w-64"
            >
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 flex-shrink-0">
                  <motion.div
                    animate={{
                      rotate: [0, 15, 0, 15, 0]
                    }}
                    transition={{
                      duration: 1.5,
                      repeat: Infinity,
                      repeatDelay: 2
                    }}
                    className="origin-bottom-right"
                  >
                    <BotCharacter />
                  </motion.div>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-800">
                    👋 Hi there! Need help with nutrition or meal planning?
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    Click to chat with me!
                  </p>
                </div>
              </div>
              {/* Triangle pointer */}
              <div className="absolute bottom-[-8px] right-6 w-4 h-4 bg-white border-r border-b border-gray-100 transform rotate-45" />
            </motion.div>
          )}
        </AnimatePresence>

        <div className="relative">
          {/* Pulse effect behind the button */}
          <div className="absolute inset-0 rounded-full bg-primary/20 animate-ping" />
          <div className="absolute inset-0 rounded-full bg-primary/10 animate-pulse" />
          
          {/* Main button */}
          <Button
            onClick={() => setIsOpen(true)}
            className="relative w-14 h-14 rounded-full bg-primary hover:bg-primary/90 text-white 
                     shadow-[0_8px_30px_rgb(0,0,0,0.12)] hover:shadow-[0_8px_30px_rgba(79,70,229,0.3)]
                     transform hover:scale-105 transition-all duration-300
                     flex items-center justify-center"
          >
            <motion.div
              animate={{
                scale: [1, 1.1, 1],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            >
              <MessageCircle size={26} />
            </motion.div>
          </Button>

          {/* Online indicator */}
          <div className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-green-500 border-2 border-white" />
        </div>
      </motion.div>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className={`fixed bottom-24 right-6 bg-white rounded-2xl shadow-2xl 
                       border border-gray-100 overflow-hidden z-[9998] ${
              isExpanded ? 'w-[80vw] h-[80vh]' : 'w-[380px] h-[600px]'
            }`}
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.9 }}
            transition={{ duration: 0.2 }}
          >
            {/* Header with Gradient */}
            <div className="bg-gradient-to-r from-primary to-primary/90 p-4 text-white">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-white/10 rounded-full p-1 backdrop-blur-sm">
                    <BotCharacter />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">AI Nutritionist</h3>
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
                      <p className="text-sm text-white/90">Online</p>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setIsExpanded(!isExpanded)}
                    className="hover:bg-white/10 p-2 rounded-full transition-colors"
                  >
                    {isExpanded ? <Minimize2 size={20} /> : <Maximize2 size={20} />}
                  </button>
                  <button
                    onClick={() => setIsOpen(false)}
                    className="hover:bg-white/10 p-2 rounded-full transition-colors"
                  >
                    <X size={20} />
                  </button>
                </div>
              </div>
            </div>

            {/* Messages with Better Styling */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6 h-[calc(100%-180px)] bg-gray-50/50">
              {messages.map((message) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  {message.type === 'ai' && (
                    <div className="w-8 h-8 mr-2 flex-shrink-0">
                      <BotCharacter />
                    </div>
                  )}
                  <div
                    className={`max-w-[80%] p-4 rounded-2xl shadow-sm ${
                      message.type === 'user'
                        ? 'bg-primary text-white rounded-br-none'
                        : 'bg-white rounded-bl-none'
                    }`}
                  >
                    <div className="text-[15px] leading-relaxed whitespace-pre-wrap">
                      {message.content}
                    </div>
                    <div className={`text-xs mt-1 ${message.type === 'user' ? 'text-white/70' : 'text-gray-400'}`}>
                      {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </div>
                  </div>
                </motion.div>
              ))}
              
              {isProcessing && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-start"
                >
                  <div className="w-8 h-8 mr-2 flex-shrink-0">
                    <BotCharacter />
                  </div>
                  <div className="bg-white p-4 rounded-2xl shadow-sm rounded-bl-none">
                    <div className="flex items-center gap-2">
                      <Loader2 className="w-4 h-4 animate-spin text-primary" />
                      <p className="text-sm text-gray-500">Thinking...</p>
                    </div>
                  </div>
                </motion.div>
              )}

              {error && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-red-500 text-sm text-center p-2 bg-red-50 rounded-lg"
                >
                  {error}
                </motion.div>
              )}
              
              <div ref={messagesEndRef} />
            </div>

            {/* Input with Modern Styling */}
            <div className="p-4 bg-white border-t border-gray-100">
              <div className="flex gap-3 items-center">
                <Input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                  placeholder="Ask about nutrition, meals, or tracking..."
                  className="flex-1 rounded-full border-gray-200 focus:border-primary focus:ring-primary px-4 py-3 text-[15px]"
                  disabled={isProcessing}
                />
                <Button
                  onClick={handleSend}
                  disabled={!input.trim() || isProcessing}
                  className="rounded-full w-12 h-12 bg-primary hover:bg-primary/90 text-white shadow-md hover:shadow-lg transition-all duration-300 flex items-center justify-center"
                >
                  {isProcessing ? (
                    <Loader2 className="h-5 w-5 animate-spin" />
                  ) : (
                    <Send size={20} />
                  )}
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}; 