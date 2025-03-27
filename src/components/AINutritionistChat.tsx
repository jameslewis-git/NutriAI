import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Bot, User, ArrowLeft, Send, Sparkles, X, Loader2 } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';

interface Message {
  id: string;
  type: 'user' | 'ai';
  content: string;
  timestamp: Date;
}

const AINutritionistChat = () => {
  const navigate = useNavigate();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'initial',
      type: 'ai',
      content: "Hi there! I'm your AI Nutritionist. How can I help you with your nutrition questions today?",
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  
  // Suggested questions
  const suggestions = [
    "How much protein should I eat daily?",
    "What are good vegetarian protein sources?",
    "How can I reduce sugar cravings?",
    "What's a balanced breakfast?"
  ];

  useEffect(() => {
    // Focus the input when component mounts
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  useEffect(() => {
    // Scroll to bottom whenever messages change
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSend = async () => {
    if (!input.trim()) return;
    
    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: input,
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);
    
    // Simulate AI response (replace with actual API call)
    setTimeout(() => {
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'ai',
        content: generateDemoResponse(input),
        timestamp: new Date()
      };
      setMessages(prev => [...prev, aiMessage]);
      setIsLoading(false);
    }, 1000);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    setInput(suggestion);
    // Focus the input after selecting a suggestion
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  // Simple demo response generator
  const generateDemoResponse = (query: string): string => {
    const responses = [
      "Based on nutritional guidelines, adults should aim for about 0.8g of protein per kg of body weight daily. If you're physically active, you might need more, around 1.2-2g per kg.",
      "Great vegetarian protein sources include legumes (beans, lentils), tofu, tempeh, seitan, Greek yogurt, cottage cheese, eggs, nuts, and seeds. Quinoa is also a complete protein source.",
      "To reduce sugar cravings, try eating regular meals to maintain blood sugar levels, include protein and fiber in every meal, stay hydrated, get enough sleep, and gradually reduce your sugar intake rather than quitting cold turkey.",
      "A balanced breakfast should include protein (eggs, yogurt), complex carbs (oats, whole grain bread), healthy fats (avocado, nuts), and fruits or vegetables. This combination provides sustained energy throughout the morning."
    ];
    
    if (query.toLowerCase().includes("protein")) return responses[0];
    if (query.toLowerCase().includes("vegetarian")) return responses[1];
    if (query.toLowerCase().includes("sugar") || query.toLowerCase().includes("craving")) return responses[2];
    if (query.toLowerCase().includes("breakfast")) return responses[3];
    
    return "That's an interesting nutrition question. In a fully developed app, I'd provide specific advice based on scientific research. Is there something specific about your diet or nutritional goals you'd like to know more about?";
  };

  return (
    <div className="fixed inset-0 bg-gray-50 z-50 flex flex-col">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigate(-1)}
          className="rounded-full"
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div className="flex items-center gap-2">
          <Bot className="h-5 w-5 text-primary" />
          <h1 className="font-medium">AI Nutritionist</h1>
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigate('/')}
          className="rounded-full"
        >
          <X className="h-5 w-5" />
        </Button>
      </div>
      
      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-4">
        <div className="max-w-3xl mx-auto">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`mb-4 flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`flex max-w-[80%] ${message.type === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                <div 
                  className={`flex items-center justify-center rounded-full w-8 h-8 flex-shrink-0 ${
                    message.type === 'user' ? 'bg-primary ml-2' : 'bg-primary/10 mr-2'
                  }`}
                >
                  {message.type === 'user' ? (
                    <User className="h-4 w-4 text-white" />
                  ) : (
                    <Bot className="h-4 w-4 text-primary" />
                  )}
                </div>
                <div
                  className={`p-3 rounded-lg ${
                    message.type === 'user'
                      ? 'bg-primary text-white rounded-tr-none'
                      : 'bg-white border border-gray-200 shadow-sm rounded-tl-none'
                  }`}
                >
                  <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                  <p className="text-xs mt-1 opacity-70">
                    {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="mb-4 flex justify-start">
              <div className="flex max-w-[80%] flex-row">
                <div className="flex items-center justify-center rounded-full w-8 h-8 flex-shrink-0 bg-primary/10 mr-2">
                  <Bot className="h-4 w-4 text-primary" />
                </div>
                <div className="p-3 rounded-lg bg-white border border-gray-200 shadow-sm rounded-tl-none">
                  <div className="flex items-center">
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    <p className="text-sm">Thinking...</p>
                  </div>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>
      
      {/* Suggestions */}
      {messages.length < 3 && (
        <div className="px-4 pb-2">
          <div className="flex items-center gap-2 mb-2">
            <Sparkles className="h-4 w-4 text-primary" />
            <p className="text-sm text-gray-600 font-medium">Suggested questions</p>
          </div>
          <div className="flex flex-wrap gap-2">
            {suggestions.map((suggestion, index) => (
              <button
                key={index}
                onClick={() => handleSuggestionClick(suggestion)}
                className="px-3 py-1.5 bg-white border border-gray-200 rounded-full text-sm hover:bg-gray-50 transition-colors"
              >
                {suggestion}
              </button>
            ))}
          </div>
        </div>
      )}
      
      {/* Input */}
      <div className="border-t border-gray-200 bg-white p-4">
        <div className="max-w-3xl mx-auto flex items-center gap-2">
          <Input
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask about nutrition, diets, meal plans..."
            className="flex-1 border-gray-200 focus-visible:ring-primary"
          />
          <Button
            onClick={handleSend}
            disabled={!input.trim() || isLoading}
            className="bg-primary hover:bg-primary/90"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AINutritionistChat; 