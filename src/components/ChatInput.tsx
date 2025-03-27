import React, { useState, useRef } from 'react';
import { Send } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';

interface ChatInputProps {
  onSend: (message: string) => void;
}

export const ChatInput: React.FC<ChatInputProps> = ({ onSend }) => {
  const [input, setInput] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSend = () => {
    if (!input.trim()) return;
    onSend(input);
    setInput('');
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex items-center gap-2">
      <Input
        ref={inputRef}
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Ask about nutrition, diets, meal plans..."
        className="flex-1 border-gray-200 focus-visible:ring-primary/20 focus-visible:ring-offset-0 bg-gray-50/50"
      />
      <Button
        onClick={handleSend}
        disabled={!input.trim()}
        className="bg-primary hover:bg-primary/90 rounded-full px-3 h-10 transition-colors"
      >
        <Send className="h-4 w-4" />
      </Button>
    </div>
  );
}; 