import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, X, Maximize2, Minimize2, Send } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { BotCharacter } from './BotCharacter';

export const AIAssistantButton = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [messages, setMessages] = useState([
    {
      type: 'ai',
      content: "👋 Hi! I'm your AI Nutritionist. I can help you with meal planning, nutrition advice, budget optimization, and health tracking. What would you like to know?"
    }
  ]);
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = () => {
    if (!input.trim()) return;
    
    // Add user message
    setMessages(prev => [...prev, { type: 'user', content: input }]);
    setInput('');

    // Simulate AI response
    setTimeout(() => {
      setMessages(prev => [...prev, {
        type: 'ai',
        content: "I can assist you with meal planning, nutrition advice, budget optimization, or progress tracking. What would you like to focus on?"
      }]);
    }, 1000);
  };

  return (
    <>
      {/* Chat Button with Hover Effect */}
      <motion.div
        className="fixed bottom-6 right-6 z-50"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.3 }}
      >
        <Button
          onClick={() => setIsOpen(true)}
          className="w-14 h-14 rounded-full bg-primary hover:bg-primary/90 text-white shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
        >
          <MessageCircle size={26} />
        </Button>
      </motion.div>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className={`fixed bottom-24 right-6 bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden z-50 ${
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
              {messages.map((message, index) => (
                <motion.div
                  key={index}
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
                    <p className="text-[15px] leading-relaxed">{message.content}</p>
                    <div className={`text-xs mt-1 ${message.type === 'user' ? 'text-white/70' : 'text-gray-400'}`}>
                      {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </div>
                  </div>
                </motion.div>
              ))}
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
                />
                <Button
                  onClick={handleSend}
                  disabled={!input.trim()}
                  className="rounded-full w-12 h-12 bg-primary hover:bg-primary/90 text-white shadow-md hover:shadow-lg transition-all duration-300 flex items-center justify-center"
                >
                  <Send size={20} />
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}; 