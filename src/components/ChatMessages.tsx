import React, { useRef, useState, useEffect } from 'react';
import { User, Loader2 } from 'lucide-react';
import { BotCharacter } from './BotCharacter';

interface Message {
  id: string;
  type: 'user' | 'ai';
  content: string;
  timestamp: Date;
}

export const ChatMessages = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'initial',
      type: 'ai',
      content: "Hi there! 👋 I'm your AI Nutritionist. How can I help you with your nutrition questions today?",
      timestamp: new Date()
    }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div className="space-y-4">
      {messages.map((message) => (
        <div
          key={message.id}
          className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
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
                <BotCharacter />
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
        <div className="flex justify-start">
          <div className="flex max-w-[80%] flex-row">
            <div className="flex items-center justify-center rounded-full w-8 h-8 flex-shrink-0 bg-primary/10 mr-2">
              <BotCharacter />
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
  );
}; 