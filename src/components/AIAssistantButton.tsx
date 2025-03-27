import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Send, Maximize2, Minimize2 } from 'lucide-react';
import { Dialog, DialogContent } from './ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { BotCharacter } from './BotCharacter';
import { ChatMessages } from './ChatMessages';
import { ChatInput } from './ChatInput';

export const AIAssistantButton = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState<string | null>("👋 Need nutrition advice? Ask me anything!");
  const [showDialog, setShowDialog] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  
  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => {
        setMessage(null);
      }, 5000);
      
      return () => clearTimeout(timer);
    }
  }, [message]);
  
  const handleClick = () => {
    setIsOpen(true);
    setShowDialog(true);
  };
  
  const handleMouseEnter = () => {
    if (!showDialog) {
      setMessage("👋 Need nutrition advice? Ask me anything!");
    }
  };

  const handleSendMessage = (message: string) => {
    // Add your message handling logic here
    console.log('Sending message:', message);
  };

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <>
      <div className="fixed bottom-6 right-6 z-50">
        {/* Floating message bubble */}
        <AnimatePresence>
          {message && !showDialog && (
            <motion.div 
              initial={{ opacity: 0, y: 10, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.9 }}
              className="absolute bottom-20 right-0 bg-white rounded-lg shadow-lg p-4 mb-2 w-72"
            >
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0">
                  <BotCharacter />
                </div>
                <div>
                  <p className="text-sm font-medium mb-1">AI Nutritionist</p>
                  <p className="text-sm text-gray-600">{message}</p>
                </div>
              </div>
              <div className="absolute bottom-[-6px] right-4 w-3 h-3 bg-white transform rotate-45"></div>
            </motion.div>
          )}
        </AnimatePresence>
        
        {/* Button */}
        <motion.button
          onClick={handleClick}
          onMouseEnter={handleMouseEnter}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="bg-gradient-to-r from-primary to-primary/90 text-white rounded-full p-4 shadow-lg flex items-center justify-center group relative overflow-hidden w-16 h-16 hover:shadow-xl transition-shadow"
        >
          <BotCharacter />
          <motion.div
            className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 transition-opacity"
            initial={false}
          />
        </motion.button>
      </div>

      {/* Chat Dialog */}
      <AnimatePresence>
        {showDialog && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className={`fixed bottom-24 right-6 z-50 bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden ${
              isExpanded ? 'w-[500px] h-[600px]' : 'w-[380px] h-[500px]'
            }`}
          >
            <div className="flex flex-col h-full">
              {/* Header */}
              <div className="bg-gradient-to-r from-primary to-primary/90 px-4 py-3 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center">
                    <BotCharacter />
                  </div>
                  <div>
                    <h1 className="font-medium text-white">AI Nutritionist</h1>
                    <p className="text-xs text-white/80">Online</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={toggleExpand}
                    className="rounded-full text-white hover:bg-white/10"
                  >
                    {isExpanded ? (
                      <Minimize2 className="h-5 w-5" />
                    ) : (
                      <Maximize2 className="h-5 w-5" />
                    )}
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setShowDialog(false)}
                    className="rounded-full text-white hover:bg-white/10"
                  >
                    <X className="h-5 w-5" />
                  </Button>
                </div>
              </div>

              {/* Chat Content */}
              <div className="flex-1 overflow-y-auto p-4 bg-gray-50/50">
                <ChatMessages />
              </div>

              {/* Input */}
              <div className="border-t border-gray-100 bg-white p-4">
                <ChatInput onSend={handleSendMessage} />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}; 