import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Loader2, PencilIcon, X, Save, User, Settings, ChevronRight, LogOut, MessageCircle, Bot } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import { UserInfoForm, UserInfoFormValues } from './UserInfoForm';
import { useForm } from 'react-hook-form';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from './ui/dialog';
import { Button } from './ui/button';
import { toast } from './ui/use-toast';
import { Label } from './ui/label';
import { Input } from './ui/input';
import { Send } from 'lucide-react';

interface User {
  name?: string;
  email?: string;
  age?: number;
  // other user properties
}

interface MealDay {
  day: string;
  meal: string;
  price: string;
  nutrition: {
    protein: number;
    carbs: number;
    fat: number;
  };
  isVisible: boolean;
}

interface MealPlan {
  name: string;
  age: number;
  budget: string;
  meals: MealDay[];
}

// Add this new interface for the edit form
interface PlanSettings {
  name: string;
  age: number;
  budget: number;
}

// Add this interface near the top of the file with other interfaces
interface Message {
  id: string;
  type: 'user' | 'ai';
  content: string;
  timestamp: Date;
}

const MotionDiv = motion.div;

// Add this new component for the simple bot character
const SimpleBotCharacter = () => {
  return (
    <motion.div 
      className="relative w-12 h-12"
      animate={{
        y: [0, -2, 0]
      }}
      transition={{
        duration: 2,
        repeat: Infinity,
        ease: "easeInOut"
      }}
    >
      <svg 
        viewBox="0 0 48 48" 
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full"
      >
        {/* Body */}
        <rect x="12" y="20" width="24" height="20" rx="8" fill="currentColor" />
        
        {/* Head */}
        <circle cx="24" cy="14" r="8" fill="currentColor" />
        
        {/* Eyes */}
        <circle cx="20" cy="13" r="2" fill="white" />
        <circle cx="28" cy="13" r="2" fill="white" />
        
        {/* Smile */}
        <path
          d="M20 16c2 1.5 6 1.5 8 0"
          stroke="white"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
        
        {/* Antenna */}
        <motion.path
          d="M24 6v-2"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          animate={{
            rotate: [-10, 10, -10]
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      </svg>
    </motion.div>
  );
};

// Update the AIAssistantButton component
const AIAssistantButton = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState<string | null>("👋 Need nutrition advice? Ask me anything!");
  const [showDialog, setShowDialog] = useState(false);
  
  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => {
        setMessage(null);
      }, 5000);
      
      return () => clearTimeout(timer);
    }
  }, [message]);
  
  return (
    <>
      <div className="fixed bottom-6 right-6 z-50">
        {/* Floating message bubble */}
        <AnimatePresence>
          {message && (
            <motion.div 
              initial={{ opacity: 0, y: 10, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.9 }}
              className="absolute bottom-16 right-0 bg-white rounded-lg shadow-lg p-3 mb-2 w-64"
            >
              <div className="flex items-start gap-2">
                <SimpleBotCharacter />
                <p className="text-sm text-gray-700 mt-1">{message}</p>
              </div>
              <div className="absolute bottom-[-6px] right-4 w-3 h-3 bg-white transform rotate-45"></div>
            </motion.div>
          )}
        </AnimatePresence>
        
        {/* Button */}
        <motion.button
          onClick={() => setShowDialog(true)}
          onMouseEnter={() => setMessage("👋 Need nutrition advice? Ask me anything!")}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="bg-primary text-white p-2 shadow-lg flex items-center justify-center group relative rounded-xl"
        >
          <SimpleBotCharacter />
        </motion.button>
      </div>

      {/* Chat Dialog */}
      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent className="sm:max-w-[500px] h-[600px] p-0 gap-0">
          <div className="flex flex-col h-full">
            {/* Header */}
            <div className="bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <SimpleBotCharacter />
                <h1 className="font-medium">AI Nutritionist</h1>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setShowDialog(false)}
                className="rounded-full"
              >
                <X className="h-5 w-5" />
              </Button>
            </div>

            {/* Rest of the dialog content remains the same */}
            <div className="flex-1 overflow-y-auto p-4 bg-gray-50">
              <ChatMessages />
            </div>

            <div className="border-t border-gray-200 bg-white p-4">
              <ChatInput onSend={() => {}} />
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

// Add these new components for the chat functionality
const ChatMessages = () => {
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
        <div className="flex justify-start">
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
  );
};

const ChatInput = ({ onSend }: { onSend: (message: string) => void }) => {
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
        className="flex-1 border-gray-200 focus-visible:ring-primary"
      />
      <Button
        onClick={handleSend}
        disabled={!input.trim()}
        className="bg-primary hover:bg-primary/90"
      >
        <Send className="h-4 w-4" />
      </Button>
    </div>
  );
};

const Hero = () => {
  const heroBgRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [mealPlan, setMealPlan] = useState<MealPlan | null>(null);
  const [demoMealPlan, setDemoMealPlan] = useState<MealPlan | null>(null);
  const [showUserInfoForm, setShowUserInfoForm] = useState(false);
  const [editingMeal, setEditingMeal] = useState<number | null>(null);
  const [selectedDays, setSelectedDays] = useState<string[]>(['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']);
  const [isEditing, setIsEditing] = useState(false);
  const [mouseX, setMouseX] = useState(0);
  const [mouseY, setMouseY] = useState(0);
  const [isMealGenerated, setIsMealGenerated] = useState(false);
  const [isEditingInfo, setIsEditingInfo] = useState(false);
  const [modalOpenCount, setModalOpenCount] = useState(0);
  const [editableInfo, setEditableInfo] = useState({
    name: user?.name || '',
    age: user?.age || 30,
    budget: 4000
  });
  const [editPopoverAnchor, setEditPopoverAnchor] = useState<{x: number, y: number} | null>(null);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const timeoutIdRef = useRef<NodeJS.Timeout | null>(null);
  
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      // Reduce sensitivity and add throttling
      const newX = e.clientX / window.innerWidth * 10 - 5;
      const newY = e.clientY / window.innerHeight * 10 - 5;
      
      // Only update if there's a significant change
      if (Math.abs(newX - mouseX) > 0.5 || Math.abs(newY - mouseY) > 0.5) {
        setMouseX(newX);
        setMouseY(newY);
      }
    };
    
    // Throttle mouse move events using useRef for timeout
    const throttledHandleMouseMove = (e: MouseEvent) => {
      if (!timeoutIdRef.current) {
        timeoutIdRef.current = setTimeout(() => {
          handleMouseMove(e);
          timeoutIdRef.current = null;
        }, 50);
      }
    };
    
    window.addEventListener('mousemove', throttledHandleMouseMove);
    return () => {
      window.removeEventListener('mousemove', throttledHandleMouseMove);
      if (timeoutIdRef.current) clearTimeout(timeoutIdRef.current);
    };
  }, [mouseX, mouseY]);

  // Add this effect to fetch user's meal plan when logged in
  useEffect(() => {
    const fetchUserMealPlan = async () => {
      if (user) {
        try {
          setIsLoading(true);
          // Simulating an API call - replace with your actual API endpoint
          const demoData: MealPlan = {
            name: user.name || 'User',
            age: user.age || 30,
            budget: "₹4000/week",
            meals: [
              {
                day: "Monday",
                meal: "Paneer Butter Masala with Naan",
                price: "₹600",
                nutrition: { protein: 18, carbs: 22, fat: 14 },
                isVisible: true
              },
              {
                day: "Tuesday",
                meal: "Dal Tadka with Jeera Rice",
                price: "₹480",
                nutrition: { protein: 15, carbs: 45, fat: 8 },
                isVisible: true
              },
              {
                day: "Wednesday",
                meal: "Mixed Vegetable Curry with Roti",
                price: "₹520",
                nutrition: { protein: 12, carbs: 35, fat: 10 },
                isVisible: true
              },
              {
                day: "Thursday",
                meal: "Chana Masala with Bhature",
                price: "₹560",
                nutrition: { protein: 16, carbs: 42, fat: 12 },
                isVisible: true
              },
              {
                day: "Friday",
                meal: "Palak Paneer with Paratha",
                price: "₹640",
                nutrition: { protein: 20, carbs: 28, fat: 15 },
                isVisible: true
              },
              {
                day: "Saturday",
                meal: "Vegetable Biryani",
                price: "₹580",
                nutrition: { protein: 14, carbs: 48, fat: 16 },
                isVisible: true
              },
              {
                day: "Sunday",
                meal: "Masala Dosa with Sambar",
                price: "₹450",
                nutrition: { protein: 12, carbs: 52, fat: 18 },
                isVisible: true
              }
            ]
          };

          setMealPlan(demoData);
          setIsLoading(false);
        } catch (error) {
          console.error('Error fetching meal plan:', error);
          setIsLoading(false);
        }
      }
    };

    fetchUserMealPlan();
  }, [user]);

  const generateDemoMealPlan = () => {
    setIsLoading(true);
    console.log('Generating demo plan...');

    const demoData: MealPlan = {
      name: "Guest",
      age: 30,
      budget: "₹4000/week",
      meals: [
        {
          day: "Monday",
          meal: "Paneer Butter Masala",
          price: "₹180",
          nutrition: { protein: 18, carbs: 22, fat: 14 },
          isVisible: true
        },
        {
          day: "Tuesday",
          meal: "Dal Tadka with Jeera Rice",
          price: "₹150",
          nutrition: { protein: 15, carbs: 45, fat: 8 },
          isVisible: true
        },
        {
          day: "Wednesday",
          meal: "Mixed Vegetable Curry",
          price: "₹160",
          nutrition: { protein: 12, carbs: 35, fat: 10 },
          isVisible: true
        },
        {
          day: "Thursday",
          meal: "Chana Masala with Bhature",
          price: "₹170",
          nutrition: { protein: 16, carbs: 42, fat: 12 },
          isVisible: true
        },
        {
          day: "Friday",
          meal: "Palak Paneer with Paratha",
          price: "₹190",
          nutrition: { protein: 20, carbs: 28, fat: 15 },
          isVisible: true
        },
        {
          day: "Saturday",
          meal: "Vegetable Biryani",
          price: "₹180",
          nutrition: { protein: 14, carbs: 48, fat: 16 },
          isVisible: true
        },
        {
          day: "Sunday",
          meal: "Masala Dosa with Sambar",
          price: "₹150",
          nutrition: { protein: 12, carbs: 52, fat: 18 },
          isVisible: true
        }
      ]
    };

    setTimeout(() => {
      setDemoMealPlan(demoData);
      setIsLoading(false);
      console.log('Demo plan generated!');
    }, 1000);
  };

  const handleGeneratePlan = async () => {
    if (isMealGenerated) {
      navigate('/signup');
      return;
    }
    setShowUserInfoForm(true);
  };

  const handleUserInfoSubmit = (data: UserInfoFormValues) => {
    setIsLoading(true);
    // Generate meal plan with user data
    const demoData: MealPlan = {
      name: data.name,
      age: data.age,
      budget: `₹${data.budget}/week`,
      meals: [
        {
          day: "Monday",
          meal: data.budget < 500 ? "Simple Dal Rice" : "Paneer Butter Masala with Naan",
          price: `₹${Math.round(data.budget * 0.15)}`,
          nutrition: { protein: 18, carbs: 22, fat: 14 },
          isVisible: true
        },
        {
          day: "Tuesday",
          meal: data.budget < 500 ? "Dal Rice" : "Dal Tadka with Jeera Rice",
          price: `₹${Math.round(data.budget * 0.12)}`,
          nutrition: { protein: 15, carbs: 45, fat: 8 },
          isVisible: true
        },
        {
          day: "Wednesday",
          meal: data.budget < 500 ? "Mixed Veg Roti" : "Mixed Vegetable Curry with Roti",
          price: `₹${Math.round(data.budget * 0.13)}`,
          nutrition: { protein: 12, carbs: 35, fat: 10 },
          isVisible: true
        },
        {
          day: "Thursday",
          meal: data.budget < 500 ? "Chole Rice" : "Chana Masala with Bhature",
          price: `₹${Math.round(data.budget * 0.14)}`,
          nutrition: { protein: 16, carbs: 42, fat: 12 },
          isVisible: true
        },
        {
          day: "Friday",
          meal: data.budget < 500 ? "Palak Roti" : "Palak Paneer with Paratha",
          price: `₹${Math.round(data.budget * 0.16)}`,
          nutrition: { protein: 20, carbs: 28, fat: 15 },
          isVisible: true
        },
        {
          day: "Saturday",
          meal: data.budget < 500 ? "Veg Pulao" : "Vegetable Biryani",
          price: `₹${Math.round(data.budget * 0.15)}`,
          nutrition: { protein: 14, carbs: 48, fat: 16 },
          isVisible: true
        },
        {
          day: "Sunday",
          meal: data.budget < 500 ? "Plain Dosa" : "Masala Dosa with Sambar",
          price: `₹${Math.round(data.budget * 0.15)}`,
          nutrition: { protein: 12, carbs: 52, fat: 18 },
          isVisible: true
        }
      ]
    };

    setTimeout(() => {
      setDemoMealPlan(demoData);
      setIsLoading(false);
      setShowUserInfoForm(false);
      setIsMealGenerated(true);
    }, 1500);
  };
  
  // Update the hero section content based on login status
  const renderHeroContent = () => {
    if (user) {
      return (
        <MotionDiv 
          className="md:pr-8 space-y-8 max-w-3xl"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Welcome Badge */}
          <motion.div 
            className="inline-block"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.3 }}
          >
            <div className="px-6 py-3 rounded-full bg-white/80 border border-primary/20 backdrop-blur-sm shadow-xl">
              <span className="text-primary font-medium text-lg flex items-center gap-2">
                <span className="animate-wave">👋</span>
                Welcome back, <span className="font-bold text-primary">{user.name}</span>!
              </span>
            </div>
          </motion.div>
          
          {/* Main Content */}
          <div className="space-y-6">
            <motion.h1 
              className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.5 }}
            >
              Your Personal{' '}
              <div className="bg-gradient-to-r from-primary to-violet-500 bg-clip-text text-transparent inline-block">
                Nutrition Plan
              </div>
            </motion.h1>
            
            <motion.p 
              className="text-xl text-gray-600 max-w-2xl leading-relaxed"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.5 }}
            >
              Continue your journey to better health with your personalized meal plans, designed specifically for your nutritional needs and preferences.
            </motion.p>
          </div>

          {/* Action Buttons */}
          <motion.div 
            className="flex flex-col sm:flex-row gap-4 pt-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.5 }}
          >
            <Button
              onClick={() => navigate('/meal-planner')}
              className="relative group overflow-hidden bg-primary hover:bg-primary/90 text-white px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
            >
              <motion.span
                className="absolute inset-0 bg-gradient-to-r from-violet-600 to-primary opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                initial={false}
              />
              <span className="relative flex items-center justify-center gap-3">
                <svg 
                  className="w-6 h-6" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={2} 
                    d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" 
                  />
                </svg>
                View My Meal Plan
              </span>
            </Button>
            
            <div className="flex items-center gap-4">
              <Button
                onClick={() => navigate('/dashboard')}
                variant="outline"
                className="px-4 py-2 rounded-lg font-medium border-2 border-gray-200 hover:border-primary/30 hover:bg-primary/5 transition-all duration-300 flex items-center justify-center gap-2"
              >
                <svg 
                  className="w-5 h-5" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={2} 
                    d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" 
                  />
                </svg>
                Dashboard
              </Button>
              
              {/* Profile Button & Dropdown */}
              <ProfileSection />
            </div>
          </motion.div>

          {/* Stats and Features */}
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.5 }}
          >
            <div className="bg-white/50 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-gray-100">
              <div className="text-primary/80 mb-2">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold">Nutrition Tracking</h3>
              <p className="text-gray-600">Monitor your daily intake and nutritional balance</p>
            </div>

            <div className="bg-white/50 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-gray-100">
              <div className="text-primary/80 mb-2">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold">Meal Scheduling</h3>
              <p className="text-gray-600">Plan your meals ahead with smart scheduling</p>
            </div>
            
            <div className="bg-white/50 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-gray-100">
              <div className="text-primary/80 mb-2">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold">Personalized Plans</h3>
              <p className="text-gray-600">AI-powered meal suggestions based on your preferences</p>
            </div>
          </motion.div>
        </MotionDiv>
      );
    }

    // Return original content for non-logged in users
    return (
      <MotionDiv 
        className="space-y-8 max-w-3xl"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Top Badge */}
        <motion.div 
          className="inline-block"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2, duration: 0.3 }}
        >
          <div className="px-4 py-2 rounded-full bg-primary/10 backdrop-blur-sm border border-primary/20">
            <span className="text-primary font-medium">
              AI-Powered Nutrition & Diet Planner
            </span>
          </div>
        </motion.div>
        
        {/* Main Heading */}
        <div className="space-y-6">
          <motion.h1 
            className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
          >
            Smart Nutrition,{' '}
            <span className="bg-gradient-to-r from-primary to-violet-500 bg-clip-text text-transparent block md:inline-block">
              Smarter Savings
            </span>
          </motion.h1>
          
          <motion.p 
            className="text-xl text-gray-600 max-w-2xl leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.5 }}
          >
              Personalized meal plans that optimize your nutrition while respecting your budget, powered by advanced AI.
          </motion.p>
        </div>
        
        {/* Action Buttons */}
        <motion.div 
          className="flex flex-col sm:flex-row gap-4 pt-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.5 }}
        >
          <Button
            onClick={handleGeneratePlan}
            disabled={isLoading}
            className="relative group overflow-hidden bg-primary hover:bg-primary/90 text-white px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                <span>Generating...</span>
              </>
            ) : isMealGenerated ? (
              <>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
                <span>Get Started</span>
              </>
            ) : (
              <>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                <span>Generate My Diet Plan</span>
              </>
            )}
          </Button>
          
          <Button
            onClick={() => navigate('/pricing')}
            variant="outline"
            className="px-8 py-4 rounded-xl font-semibold text-lg border-2 border-gray-200 hover:border-primary/30 hover:bg-primary/5 transition-all duration-300 flex items-center justify-center gap-2 shadow-md hover:shadow-lg"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
                Learn More
          </Button>
        </motion.div>

        {/* Features Grid */}
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-12"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.5 }}
        >
          <div className="bg-white/50 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-gray-100">
            <div className="text-primary/80 mb-2">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold">Budget Friendly</h3>
            <p className="text-gray-600">Optimize your meal costs without compromising nutrition</p>
          </div>
          
          <div className="bg-white/50 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-gray-100">
            <div className="text-primary/80 mb-2">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold">Personalized Plans</h3>
            <p className="text-gray-600">AI-generated meal plans tailored to your preferences</p>
          </div>

          <div className="bg-white/50 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-gray-100">
            <div className="text-primary/80 mb-2">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold">Instant Generation</h3>
            <p className="text-gray-600">Get your meal plan in seconds with our AI technology</p>
          </div>
        </motion.div>

        {/* Trust Indicators */}
        <motion.div 
          className="flex flex-wrap items-center gap-6 pt-8 text-sm text-gray-500"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7, duration: 0.5 }}
        >
          <div className="flex items-center gap-2">
            <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            <span>No credit card required</span>
          </div>
          <div className="flex items-center gap-2">
            <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            <span>Free personal plan available</span>
          </div>
          <div className="flex items-center gap-2">
            <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            <span>Instant access</span>
          </div>
        </motion.div>
      </MotionDiv>
    );
  };

  // Update the meal plan card content
  const renderMealPlanCard = () => {
    const planToShow = user ? mealPlan : demoMealPlan;

    return (
            <div className="glass-panel p-6 relative">
              <div className="absolute -top-3 -right-3 bg-primary text-white text-xs font-bold px-2 py-1 rounded-md">
                AI-Generated
              </div>
              
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center">
                <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center mr-3">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                </div>
                  <div className="relative">
                  <h3 className="font-semibold">Weekly Meal Plan</h3>
                    <div className="flex items-center gap-2">
                      <p className="text-sm text-gray-500">
                        For {planToShow?.name}, {planToShow?.age} - Budget: {planToShow?.budget}
                      </p>
                      {user && (
                        <button 
                          onClick={handleEditClick}
                          className="inline-flex items-center justify-center w-6 h-6 rounded-full hover:bg-gray-100 transition-colors"
                          title="Edit budget"
                        >
                          <svg 
                            xmlns="http://www.w3.org/2000/svg" 
                            viewBox="0 0 24 24" 
                            fill="none" 
                            stroke="currentColor" 
                            className="w-3.5 h-3.5 text-gray-400 hover:text-primary"
                            strokeWidth="2" 
                            strokeLinecap="round" 
                            strokeLinejoin="round"
                          >
                            <path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z" />
                          </svg>
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>

        {/* Day Selection Pills */}
        {user && (
          <div className="flex flex-wrap gap-2 mb-4">
            {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map((day) => (
              <button
                key={day}
                onClick={() => handleDayToggle(day)}
                className={`px-3 py-1 rounded-full text-sm font-medium transition-all ${
                  selectedDays.includes(day)
                    ? 'bg-primary text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {day}
              </button>
            ))}
          </div>
        )}
              
              <div className="space-y-4">
          {planToShow?.meals
            .filter(meal => selectedDays.includes(meal.day))
            .map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                className="glass-card p-4"
              >
                {editingMeal === index ? (
                  <div className="space-y-2">
                    <input
                      type="text"
                      value={item.meal}
                      onChange={(e) => handleEditMeal(index, { meal: e.target.value })}
                      className="w-full p-2 border rounded"
                    />
                    <div className="flex gap-2">
                      <input
                        type="number"
                        value={item.nutrition.protein}
                        onChange={(e) => handleEditMeal(index, {
                          nutrition: { ...item.nutrition, protein: Number(e.target.value) }
                        })}
                        className="w-20 p-2 border rounded"
                        placeholder="Protein"
                      />
                      <input
                        type="number"
                        value={item.nutrition.carbs}
                        onChange={(e) => handleEditMeal(index, {
                          nutrition: { ...item.nutrition, carbs: Number(e.target.value) }
                        })}
                        className="w-20 p-2 border rounded"
                        placeholder="Carbs"
                      />
                      <input
                        type="number"
                        value={item.nutrition.fat}
                        onChange={(e) => handleEditMeal(index, {
                          nutrition: { ...item.nutrition, fat: Number(e.target.value) }
                        })}
                        className="w-20 p-2 border rounded"
                        placeholder="Fat"
                      />
                    </div>
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() => setEditingMeal(null)}
                        className="px-3 py-1 text-sm text-gray-600 hover:text-gray-800"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={() => setEditingMeal(null)}
                        className="px-3 py-1 text-sm bg-primary text-white rounded hover:bg-primary/90"
                      >
                        Save
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="flex justify-between items-center">
                    <div>
                      <span className="text-sm font-medium text-gray-500">{item.day}</span>
                      <h4 className="font-medium">{item.meal}</h4>
                      <p className="text-xs text-gray-500">
                        Protein: {item.nutrition.protein}g • Carbs: {item.nutrition.carbs}g • Fat: {item.nutrition.fat}g
                      </p>
                    </div>
                    <div className="text-right">
                      <span className="text-lg font-semibold text-primary">{item.price}</span>
                      <div className="flex gap-2 mt-1">
                        <button 
                          className="text-xs text-gray-500 hover:text-primary"
                          onClick={() => window.open('#', '_blank')}
                        >
                          View Recipe
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </motion.div>
                ))}
              </div>
              
        {!user && planToShow && (
              <div className="mt-4 text-center">
            <p className="text-sm text-gray-500 mb-2">
              Sign up to save and customize your meal plan
            </p>
            <button 
              onClick={() => navigate('/signup')}
              className="text-sm text-primary font-medium hover:underline"
            >
                  View Full Weekly Plan →
                </button>
          </div>
        )}
        </div>
    );
  };

  // Add edit meal function
  const handleEditMeal = (index: number, updatedMeal: Partial<MealDay>) => {
    if (!mealPlan) return;
    
    const updatedMeals = [...mealPlan.meals];
    updatedMeals[index] = { ...updatedMeals[index], ...updatedMeal };
    
    setMealPlan({
      ...mealPlan,
      meals: updatedMeals
    });
    setEditingMeal(null);
  };

  // Add day selection handler
  const handleDayToggle = (day: string) => {
    if (selectedDays.includes(day)) {
      setSelectedDays(selectedDays.filter(d => d !== day));
    } else {
      setSelectedDays([...selectedDays, day]);
    }
  };

  // Update the meal generation function with new budget calculations
  const generateMealsForBudget = (budget: number) => {
    // Ensure minimum budget is enforced
    const safeBudget = Math.max(200, budget);
    
    const weeklyMeals = [
      {
        day: "Monday",
        meal: "Paneer Butter Masala with Naan",
        price: `₹${Math.round(safeBudget * 0.15)}`, // 15% of budget
        nutrition: { protein: 18, carbs: 22, fat: 14 },
        isVisible: true
      },
      {
        day: "Tuesday",
        meal: budget < 500 ? "Dal Rice" : "Dal Tadka with Jeera Rice",
        price: `₹${Math.round(safeBudget * 0.12)}`, // 12% of budget
        nutrition: { protein: 15, carbs: 45, fat: 8 },
        isVisible: true
      },
      {
        day: "Wednesday",
        meal: budget < 500 ? "Mixed Veg Roti" : "Mixed Vegetable Curry with Roti",
        price: `₹${Math.round(safeBudget * 0.13)}`, // 13% of budget
        nutrition: { protein: 12, carbs: 35, fat: 10 },
        isVisible: true
      },
      {
        day: "Thursday",
        meal: budget < 500 ? "Chole Bhature" : "Chana Masala with Bhature",
        price: `₹${Math.round(safeBudget * 0.14)}`, // 14% of budget
        nutrition: { protein: 16, carbs: 42, fat: 12 },
        isVisible: true
      },
      {
        day: "Friday",
        meal: budget < 500 ? "Palak Roti" : "Palak Paneer with Paratha",
        price: `₹${Math.round(safeBudget * 0.16)}`, // 16% of budget
        nutrition: { protein: 20, carbs: 28, fat: 15 },
        isVisible: true
      },
      {
        day: "Saturday",
        meal: budget < 500 ? "Veg Pulao" : "Vegetable Biryani",
        price: `₹${Math.round(safeBudget * 0.15)}`, // 15% of budget
        nutrition: { protein: 14, carbs: 48, fat: 16 },
        isVisible: true
      },
      {
        day: "Sunday",
        meal: budget < 500 ? "Plain Dosa" : "Masala Dosa with Sambar",
        price: `₹${Math.round(safeBudget * 0.15)}`, // 15% of budget
        nutrition: { protein: 12, carbs: 52, fat: 18 },
        isVisible: true
      }
    ];

    return weeklyMeals;
  };

  // Add this CSS for the wave animation
  const styles = `
    @keyframes wave {
      0% { transform: rotate(0deg); }
      20% { transform: rotate(14deg); }
      40% { transform: rotate(-8deg); }
      60% { transform: rotate(14deg); }
      80% { transform: rotate(-4deg); }
      100% { transform: rotate(10deg); }
    }
    .animate-wave {
      animation: wave 1.5s infinite;
      transform-origin: 70% 70%;
      display: inline-block;
    }
  `;

  const handleInfoUpdate = () => {
    try {
      // Validate inputs
      if (!editableInfo.name.trim()) {
        toast({
          title: "Error",
          description: "Name cannot be empty",
          variant: "destructive",
        });
        return;
      }
      
      if (editableInfo.age < 18 || editableInfo.age > 100) {
        toast({
          title: "Error",
          description: "Age must be between 18 and 100",
          variant: "destructive",
        });
        return;
      }
      
      if (editableInfo.budget < 200) {
        toast({
          title: "Error",
          description: "Minimum budget is ₹200",
          variant: "destructive",
        });
        return;
      }
      
      // Update the meal plan with new details
      setMealPlan(prevPlan => {
        if (!prevPlan) return null;
        
        // Recalculate meal prices based on new budget
        const updatedMeals = prevPlan.meals.map(meal => ({
          ...meal,
          price: `₹${Math.round(editableInfo.budget * 0.15)}` // Simplified for example
        }));
        
        return {
          ...prevPlan,
          name: editableInfo.name,
          age: editableInfo.age,
          budget: `₹${editableInfo.budget}/week`,
          meals: updatedMeals
        };
      });
      
      setIsEditingInfo(false);
      
      toast({
        title: "Success",
        description: "Your plan details have been updated",
      });
    } catch (error) {
      console.error("Error updating plan:", error);
      toast({
        title: "Error",
        description: "Failed to update plan details",
        variant: "destructive",
      });
    }
  };

  // Update how we open the modal
  const openEditModal = () => {
    // Only open if not already opening (prevents rapid multiple opens)
    if (!isEditingInfo) {
      setEditableInfo({
        name: mealPlan?.name || user?.name || '',
        age: mealPlan?.age || user?.age || 30,
        budget: Number(mealPlan?.budget?.replace(/[^0-9]/g, '')) || 4000
      });
      setIsEditingInfo(true);
    }
  };

  // Effect to handle body scrolling and prevent glitches
  useEffect(() => {
    if (isEditingInfo) {
      // Prevent scrolling on the body when modal is open
      document.body.style.overflow = 'hidden';
      
      // Create a specific class for the fixed body to avoid style inheritance issues
      document.body.classList.add('modal-open-fixed-body');
      
      return () => {
        // Clean up all modal-related body styles
        document.body.style.overflow = '';
        document.body.classList.remove('modal-open-fixed-body');
      };
    }
  }, [isEditingInfo]);

  // Fix the handleEditClick function and make it simpler
  const handleEditClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    // Get the position of the click
    const rect = e.currentTarget.getBoundingClientRect();
    const position = {
      x: rect.left + rect.width/2, 
      y: rect.top + rect.height/2
    };
    
    // Set the anchor position
    setEditPopoverAnchor(position);
    
    // Prevent closing the popover when clicking elsewhere initially
    setTimeout(() => {
      const handleClickOutside = (e: MouseEvent) => {
        const popover = document.querySelector('.budget-popover');
        if (popover && !popover.contains(e.target as Node)) {
          setEditPopoverAnchor(null);
          document.removeEventListener('mousedown', handleClickOutside);
        }
      };
      document.addEventListener('mousedown', handleClickOutside);
    }, 100);
  };

  // Simple function to update the meal prices based on budget
  const recalculateMealPrices = (budget: number, meals: MealDay[]): MealDay[] => {
    return meals.map((meal, index) => {
      // Different percentage of budget for different days
      const percentages = [0.15, 0.12, 0.13, 0.14, 0.16, 0.15, 0.15];
      const percentage = percentages[index % percentages.length];
      
      // Also update meal type based on budget
      let updatedMeal = meal.meal;
      if (budget < 500) {
        // Simpler meals for lower budgets
        if (meal.day === "Monday") updatedMeal = "Simple Dal Rice";
        if (meal.day === "Tuesday") updatedMeal = "Dal Rice";
        if (meal.day === "Wednesday") updatedMeal = "Mixed Veg Roti";
        if (meal.day === "Thursday") updatedMeal = "Chole Rice";
        if (meal.day === "Friday") updatedMeal = "Palak Roti";
        if (meal.day === "Saturday") updatedMeal = "Veg Pulao";
        if (meal.day === "Sunday") updatedMeal = "Plain Dosa";
      } else {
        // More elaborate meals for higher budgets
        if (meal.day === "Monday") updatedMeal = "Paneer Butter Masala with Naan";
        if (meal.day === "Tuesday") updatedMeal = "Dal Tadka with Jeera Rice";
        if (meal.day === "Wednesday") updatedMeal = "Mixed Vegetable Curry with Roti";
        if (meal.day === "Thursday") updatedMeal = "Chana Masala with Bhature";
        if (meal.day === "Friday") updatedMeal = "Palak Paneer with Paratha";
        if (meal.day === "Saturday") updatedMeal = "Vegetable Biryani";
        if (meal.day === "Sunday") updatedMeal = "Masala Dosa with Sambar";
      }
      
      return {
        ...meal,
        meal: updatedMeal,
        price: `₹${Math.round(budget * percentage)}`
      };
    });
  };

  // Make the BudgetEditPopover component more reliable
  const BudgetEditPopover = () => {
    // Use refs to maintain stable position
    const popoverRef = useRef<HTMLDivElement>(null);
    const [position, setPosition] = useState({ top: 0, left: 0 });
    
    // Local state for budget that won't be affected by re-renders
    const [localBudget, setLocalBudget] = useState(() => {
      return Number(mealPlan?.budget?.replace(/[^0-9]/g, '')) || 4000;
    });
    
    // Set position once on mount
    useEffect(() => {
      if (editPopoverAnchor && popoverRef.current) {
        setPosition({
          top: editPopoverAnchor.y + 30,
          left: editPopoverAnchor.x - 150
        });
      }
    }, []);

    if (!editPopoverAnchor) return null;

    const handleSave = () => {
      if (!mealPlan) return;
      
      try {
        const safeBudget = Math.max(200, localBudget);
        
        // Create a stable copy of the meal plan
        const stableMealPlan = { ...mealPlan };
        
        // Calculate updated meals with new budget
        const updatedMeals = stableMealPlan.meals.map(meal => {
          // Use a simpler approach that avoids re-renders
          let updatedMeal = meal.meal;
          
          // Percentage of budget based on day
          let percentage = 0.15; // Default
          if (meal.day === "Tuesday") percentage = 0.12;
          if (meal.day === "Wednesday") percentage = 0.13;
          if (meal.day === "Thursday") percentage = 0.14;
          if (meal.day === "Friday") percentage = 0.16;
          
          // Update meal name based on budget tier
          if (safeBudget < 500) {
            // Simple meals for low budget
            const simpleMeals = {
              "Monday": "Simple Dal Rice",
              "Tuesday": "Dal Rice",
              "Wednesday": "Mixed Veg Roti", 
              "Thursday": "Chole Rice",
              "Friday": "Palak Roti",
              "Saturday": "Veg Pulao",
              "Sunday": "Plain Dosa"
            };
            updatedMeal = simpleMeals[meal.day as keyof typeof simpleMeals] || meal.meal;
          } else {
            // Premium meals for higher budget
            const premiumMeals = {
              "Monday": "Paneer Butter Masala with Naan",
              "Tuesday": "Dal Tadka with Jeera Rice",
              "Wednesday": "Mixed Vegetable Curry with Roti",
              "Thursday": "Chana Masala with Bhature", 
              "Friday": "Palak Paneer with Paratha",
              "Saturday": "Vegetable Biryani",
              "Sunday": "Masala Dosa with Sambar"
            };
            updatedMeal = premiumMeals[meal.day as keyof typeof premiumMeals] || meal.meal;
          }
          
          return {
            ...meal,
            meal: updatedMeal,
            price: `₹${Math.round(safeBudget * percentage)}`
          };
        });
        
        // Update meal plan with new meals
        setMealPlan({
          ...stableMealPlan,
          budget: `₹${safeBudget}/week`,
          meals: updatedMeals
        });
        
        // Hide popover
        setEditPopoverAnchor(null);
        
        toast({
          title: "Success",
          description: "Budget updated to ₹" + safeBudget + "/week",
        });
      } catch (error) {
        console.error("Error updating budget:", error);
        toast({
          title: "Error",
          description: "Failed to update budget",
          variant: "destructive",
        });
      }
    };

    return (
      <div 
        ref={popoverRef}
        className="fixed z-50 bg-white rounded-lg shadow-lg p-4 w-[300px] border border-gray-200 budget-popover"
        style={{ 
          top: `${position.top}px`, 
          left: `${position.left}px`
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-3">
          <h4 className="font-medium text-sm">Update Weekly Budget</h4>
          <button 
            onClick={() => setEditPopoverAnchor(null)}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X size={16} />
          </button>
        </div>
        
        <div className="space-y-3">
          <div>
            <Label htmlFor="budget" className="text-xs font-medium mb-1 block">
              Weekly Budget (₹)
            </Label>
            <div className="relative">
              <Input
                id="budget"
                type="number"
                value={localBudget}
                onChange={(e) => setLocalBudget(Math.max(200, Number(e.target.value)))}
                className="pr-16 border-gray-200"
                min={200}
              />
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-sm">
                ₹/week
              </div>
            </div>
            <p className="text-xs text-gray-500 mt-1">Minimum: ₹200/week</p>
          </div>
          
          <div className="pt-2 flex justify-end gap-2">
            <button
              onClick={() => setEditPopoverAnchor(null)}
              className="px-3 py-1.5 text-xs rounded-md border border-gray-200 text-gray-600 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="px-3 py-1.5 text-xs rounded-md bg-primary text-white hover:bg-primary/90"
            >
              Update
            </button>
          </div>
        </div>
        
        {/* Little arrow pointing to the pencil */}
        <div 
          className="absolute w-3 h-3 bg-white border-t border-l border-gray-200 transform rotate-45"
          style={{ top: "-6px", right: "130px" }}
        />
      </div>
    );
  };

  // First, let's modify the mouse movement effect to prevent unnecessary re-renders

  // 1. Isolate the mouse movement effect to its own component
  const BackgroundEffect = () => {
    const [mouseX, setMouseX] = useState(0);
    const [mouseY, setMouseY] = useState(0);
    
    useEffect(() => {
      const handleMouseMove = (e: MouseEvent) => {
        // Reduce sensitivity and add throttling
        const newX = e.clientX / window.innerWidth * 10 - 5;
        const newY = e.clientY / window.innerHeight * 10 - 5;
        
        // Only update if there's a significant change
        if (Math.abs(newX - mouseX) > 0.5 || Math.abs(newY - mouseY) > 0.5) {
          setMouseX(newX);
          setMouseY(newY);
        }
      };
      
      // Throttle mouse move events using useRef for timeout
      const throttledHandleMouseMove = (e: MouseEvent) => {
        if (!timeoutIdRef.current) {
          timeoutIdRef.current = setTimeout(() => {
            handleMouseMove(e);
            timeoutIdRef.current = null;
          }, 50);
        }
      };
      
      window.addEventListener('mousemove', throttledHandleMouseMove);
      return () => {
        window.removeEventListener('mousemove', throttledHandleMouseMove);
        if (timeoutIdRef.current) clearTimeout(timeoutIdRef.current);
      };
    }, [mouseX, mouseY]);

    return (
      <motion.div 
        className="absolute inset-0 pointer-events-none"
        animate={{
          x: mouseX,
          y: mouseY,
        }}
        transition={{
          type: "spring",
          damping: 50,
          stiffness: 50,
        }}
      >
        <div className="w-full h-full bg-gradient-to-r from-primary/5 to-accent/5 filter blur-3xl opacity-30" />
      </motion.div>
    );
  };

  // Add this function to handle profile menu toggle
  const toggleProfileMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setShowProfileMenu(!showProfileMenu);
  };

  // Add a useEffect to handle closing menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const profileMenu = document.getElementById('profile-menu');
      if (profileMenu && !profileMenu.contains(event.target as Node)) {
        setShowProfileMenu(false);
      }
    };

    if (showProfileMenu) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showProfileMenu]);

  // Add the EditInfoModal component
  const EditInfoModal = () => {
    return (
      <Dialog open={isEditingInfo} onOpenChange={setIsEditingInfo}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit Plan Settings</DialogTitle>
            <DialogDescription>
              Update your personal details and budget preferences.
            </DialogDescription>
          </DialogHeader>
          
          <div className="py-4 space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                value={editableInfo.name}
                onChange={(e) => setEditableInfo({...editableInfo, name: e.target.value})}
                placeholder="Your name"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="age">Age</Label>
              <Input
                id="age"
                type="number"
                value={editableInfo.age}
                onChange={(e) => setEditableInfo({...editableInfo, age: Number(e.target.value)})}
                placeholder="Your age"
                min={18}
                max={100}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="budget">Weekly Budget (₹)</Label>
              <Input
                id="budget"
                type="number"
                value={editableInfo.budget}
                onChange={(e) => setEditableInfo({...editableInfo, budget: Number(e.target.value)})}
                placeholder="Weekly budget in rupees"
                min={200}
              />
              <p className="text-xs text-gray-500">Minimum budget: ₹200/week</p>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditingInfo(false)}>
              Cancel
            </Button>
            <Button onClick={handleInfoUpdate}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  };

  // Here's the updated profile section with proper TypeScript types
  const ProfileSection = () => {
    return (
      <div className="relative">
        <button 
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            setShowProfileMenu(!showProfileMenu);
          }}
          className="w-10 h-10 rounded-full bg-primary/10 hover:bg-primary/20 flex items-center justify-center transition-all duration-300"
          title="User Profile"
        >
          <User className="w-5 h-5 text-primary" />
        </button>
        
        {showProfileMenu && (
          <div 
            id="profile-menu"
            className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-xl border border-gray-100 overflow-hidden z-50"
          >
            {/* User Info Header */}
            <div className="bg-gradient-to-r from-primary/10 to-violet-500/10 p-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center">
                  <User className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800">{user?.name || 'User'}</h3>
                  <p className="text-sm text-gray-500">{user?.email || 'user@example.com'}</p>
                </div>
              </div>
            </div>
            
            {/* User Details */}
            <div className="p-3 border-b border-gray-100">
              <div className="text-sm text-gray-500 mb-2">Personal Details</div>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div className="font-medium text-gray-600">Age:</div>
                <div className="text-gray-800">{user?.age || 30} years</div>
                
                <div className="font-medium text-gray-600">Budget:</div>
                <div className="text-gray-800">₹{Number(mealPlan?.budget?.replace(/[^0-9]/g, '')) || 4000}/week</div>
              </div>
            </div>
            
            {/* Menu Items */}
            <div className="divide-y divide-gray-100">
              <button 
                onClick={() => setIsEditingInfo(true)}
                className="w-full px-4 py-3 flex items-center justify-between hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <Settings className="w-4 h-4 text-gray-500" />
                  <span className="text-sm font-medium">Edit Plan Settings</span>
                </div>
                <ChevronRight className="w-4 h-4 text-gray-400" />
              </button>
              
              <button 
                onClick={() => navigate('/account-settings')}
                className="w-full px-4 py-3 flex items-center justify-between hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <User className="w-4 h-4 text-gray-500" />
                  <span className="text-sm font-medium">Account Settings</span>
                </div>
                <ChevronRight className="w-4 h-4 text-gray-400" />
              </button>
              
              <button 
                onClick={() => navigate('/logout')}
                className="w-full px-4 py-3 flex items-center justify-between hover:bg-red-50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <LogOut className="w-4 h-4 text-red-500" />
                  <span className="text-sm font-medium text-red-500">Logout</span>
                </div>
                <ChevronRight className="w-4 h-4 text-gray-400" />
              </button>
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <section className="min-h-screen flex flex-col pt-24 relative overflow-hidden">
      {/* Background Molecules with reduced animation */}
      <div 
        ref={heroBgRef} 
        className="absolute inset-0 bg-hero-gradient -z-10"
      >
        {/* Slowed down animations */}
        <motion.div 
          className="absolute top-20 left-[10%] w-72 h-72"
          animate={{
            scale: [1, 1.1, 1],
            rotate: [0, 45, 0],
          }}
          transition={{
            duration: 40, // Much slower animation
            repeat: Infinity,
            ease: "linear"
          }}
        >
          <div className="w-full h-full bg-primary/10 rounded-full filter blur-3xl" />
        </motion.div>
        
        {/* Other background molecules with similar slowed animation... */}
      </div>

      {/* Isolated mouse movement effect */}
      <BackgroundEffect />

      <AnimatePresence mode="wait">
        <motion.div 
          className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full"
          initial={{ opacity: 1 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div className="grid md:grid-cols-2 gap-12">
            {renderHeroContent()}
            <motion.div 
              className="animate-fade-in-right"
              initial={{ x: 20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              {renderMealPlanCard()}
            </motion.div>
          </div>
        </motion.div>
      </AnimatePresence>
      
      <UserInfoForm 
        isOpen={showUserInfoForm}
        onClose={() => setShowUserInfoForm(false)}
        onSubmit={handleUserInfoSubmit}
      />
      {editPopoverAnchor && <BudgetEditPopover />}
      <EditInfoModal />
      
      {/* Add the AI Assistant button */}
      <AIAssistantButton />
    </section>
  );
};

export default Hero;
