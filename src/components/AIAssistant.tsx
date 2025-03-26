
import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, X, Send, Mic, User, Bot } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

const AIAssistant = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { type: 'bot', content: 'Hi there! I\'m your personal nutrition assistant. How can I help you today?' }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  const toggleChat = () => {
    setIsOpen(!isOpen);
  };

  const handleSendMessage = (e?: React.FormEvent) => {
    e?.preventDefault();
    
    if (!inputValue.trim()) return;
    
    const userMessage = { type: 'user', content: inputValue };
    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);
    
    // Simulate AI response
    setTimeout(() => {
      const demoResponses = [
        "I recommend increasing your protein intake. Try adding Greek yogurt to your breakfast.",
        "Based on your budget, lentils would be a more cost-effective protein source than chicken.",
        "For your weight loss goal, I suggest focusing on high-fiber, low-calorie foods like vegetables and lean proteins.",
        "Your current meal plan is well-balanced, but you might want to add more leafy greens for additional vitamins."
      ];
      
      const randomResponse = demoResponses[Math.floor(Math.random() * demoResponses.length)];
      setMessages(prev => [...prev, { type: 'bot', content: randomResponse }]);
      setIsTyping(false);
    }, 2000);
  };

  const handleQuickOption = (question: string) => {
    setInputValue(question);
    handleSendMessage();
  };

  const quickOptions = [
    "What foods should I eat for weight loss?",
    "How can I reduce my grocery bill?",
    "Suggest a high-protein vegetarian meal"
  ];

  return (
    <div className="fixed right-5 bottom-5 z-50">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            transition={{ duration: 0.2 }}
            className="mb-4"
          >
            <Card className="w-[350px] sm:w-[400px] shadow-xl border border-primary/10">
              <CardHeader className="bg-primary/5 p-4 flex flex-row items-center justify-between">
                <div className="flex items-center">
                  <Bot className="h-5 w-5 text-primary mr-2" />
                  <h3 className="font-medium">AI Nutritionist</h3>
                </div>
                <Button variant="ghost" size="icon" onClick={toggleChat}>
                  <X className="h-4 w-4" />
                </Button>
              </CardHeader>
              <CardContent className="p-0">
                <div className="h-[300px] overflow-y-auto p-4">
                  {messages.map((message, index) => (
                    <div
                      key={index}
                      className={cn(
                        "mb-3 max-w-[85%] rounded-lg p-3",
                        message.type === 'user'
                          ? "ml-auto bg-primary text-primary-foreground"
                          : "bg-muted"
                      )}
                    >
                      <div className="flex items-start">
                        {message.type === 'bot' && (
                          <Bot className="h-4 w-4 mr-2 mt-0.5 shrink-0" />
                        )}
                        <p className="text-sm">{message.content}</p>
                      </div>
                    </div>
                  ))}
                  {isTyping && (
                    <div className="mb-3 max-w-[85%] rounded-lg p-3 bg-muted">
                      <div className="flex items-center space-x-1">
                        <div className="h-2 w-2 bg-muted-foreground/40 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                        <div className="h-2 w-2 bg-muted-foreground/40 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                        <div className="h-2 w-2 bg-muted-foreground/40 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                      </div>
                    </div>
                  )}
                  <div ref={messagesEndRef} />
                </div>
                
                <div className="p-3 border-t">
                  <div className="flex flex-wrap gap-2 mb-3">
                    {quickOptions.map((option, index) => (
                      <button
                        key={index}
                        onClick={() => handleQuickOption(option)}
                        className="text-xs bg-primary/10 hover:bg-primary/20 text-primary rounded-full px-3 py-1 transition-colors"
                      >
                        {option}
                      </button>
                    ))}
                  </div>
                </div>
              </CardContent>
              <CardFooter className="p-3 pt-0">
                <form onSubmit={handleSendMessage} className="flex w-full gap-2">
                  <Input
                    placeholder="Ask me anything about nutrition..."
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    className="flex-1"
                  />
                  <Button type="submit" size="icon" disabled={!inputValue.trim()}>
                    <Send className="h-4 w-4" />
                  </Button>
                  <Button type="button" variant="outline" size="icon">
                    <Mic className="h-4 w-4" />
                  </Button>
                </form>
              </CardFooter>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
      
      <motion.div
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <Button
          onClick={toggleChat}
          className="w-14 h-14 rounded-full shadow-lg"
        >
          <MessageSquare className="h-6 w-6" />
        </Button>
      </motion.div>
    </div>
  );
};

export default AIAssistant;
