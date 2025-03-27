import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, X, Maximize2, Minimize2, Send, Loader2, User } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { BotCharacter } from './BotCharacter';
import { useAuth } from '../contexts/AuthContext';
import { v4 as uuidv4 } from 'uuid';

// Message types
interface ChatMessage {
  id: string;
  type: 'user' | 'ai';
  content: string;
  timestamp: Date;
  category?: 'meal-planning' | 'nutrition' | 'budget' | 'tracking';
}

const AIChatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [showWelcome, setShowWelcome] = useState(true);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { user } = useAuth();

  // Initialize with personalized welcome message
  useEffect(() => {
    setMessages([
      {
        id: uuidv4(),
        type: 'ai',
        content: user?.name 
          ? `👋 Hi ${user.name}! I'm your AI Nutritionist. I can help you with meal planning, nutrition advice, budget optimization, and health tracking. What would you like to know?`
          : "👋 Hi there! I'm your AI Nutritionist. I can help you with meal planning, nutrition advice, budget optimization, and health tracking. What would you like to know?",
        timestamp: new Date()
      }
    ]);
  }, [user?.name]);

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

  // Generate AI response based on user message and preferences
  const generateResponse = async (userMessage: ChatMessage): Promise<string> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const userContent = userMessage.content.toLowerCase();
    const category = userMessage.category;
    
    // Get userPreferences from auth context
    const userPreferences = {
      name: user?.name || 'there',
      age: user?.age || 30,
      weeklyBudget: user?.weeklyBudget || 4000,
      dietaryRestrictions: user?.dietaryRestrictions || [],
      fitnessGoals: user?.fitnessGoals || []
    };
    
    // Personalized responses based on user details
    if (userContent.includes('hello') || userContent.includes('hi')) {
      return `Hello ${userPreferences.name}! How can I assist with your nutrition needs today?`;
    }
    
    if (category === 'budget') {
      return `Based on your weekly budget of ₹${userPreferences.weeklyBudget}, I recommend allocating about ₹${Math.round(userPreferences.weeklyBudget * 0.3)} for proteins, ₹${Math.round(userPreferences.weeklyBudget * 0.3)} for fresh vegetables and fruits, and the rest for grains and other essentials. Would you like me to suggest some budget-friendly meal options?`;
    }
    
    if (category === 'meal-planning') {
      if (userPreferences.dietaryRestrictions.length > 0) {
        return `I'll create a meal plan that respects your ${userPreferences.dietaryRestrictions.join(', ')} dietary restrictions. Would you like to focus on any specific nutritional goals?`;
      }
      return `I can help create a personalized meal plan for you. Based on your profile, I'd recommend including a good balance of proteins, complex carbs, and healthy fats. Would you like a daily or weekly plan?`;
    }
    
    if (category === 'nutrition') {
      return `Nutrition is essential for overall health. For someone of your profile (${userPreferences.age} years old), I recommend focusing on balanced meals with adequate protein, complex carbohydrates, and healthy fats. Would you like specific nutritional advice for your goals?`;
    }
    
    if (category === 'tracking') {
      if (userPreferences.fitnessGoals.length > 0) {
        return `Tracking your nutrition is a great way to reach your ${userPreferences.fitnessGoals.join(', ')} goals. I recommend monitoring your daily intake of calories, protein, and water. Would you like me to suggest some tracking methods?`;
      }
      return `Tracking your nutrition helps ensure you're meeting your health goals. I suggest monitoring key nutrients like protein, carbs, and fats, along with your overall calorie intake. Would you like some tips for effective tracking?`;
    }
    
    // Generate detailed meal plan if requested
    if (userContent.includes('generate meal plan') || userContent.includes('create meal plan')) {
      // This would be a complex response with a structured meal plan
      return generateMealPlan(userPreferences);
    }
    
    // Analyze specific food if asked
    if (userContent.includes('analyze') || userContent.includes('nutrition in')) {
      const foodItem = userContent.replace(/analyze|what is the nutrition in|tell me about/gi, '').trim();
      return analyzeFood(foodItem);
    }
    
    // Default response
    return `I can help you with meal planning, nutrition advice, budget optimization (₹${userPreferences.weeklyBudget}/week), and health tracking. What specific area would you like to focus on?`;
  };
  
  // Generate a meal plan based on user preferences
  const generateMealPlan = (userPreferences: any): string => {
    const budget = userPreferences.weeklyBudget;
    const restrictions = userPreferences.dietaryRestrictions;
    const isVegetarian = restrictions.includes('vegetarian');
    
    return `# Personalized Weekly Meal Plan

## Budget: ₹${budget}/week
${restrictions.length > 0 ? `## Dietary Restrictions: ${restrictions.join(', ')}` : ''}

### Monday
- **Breakfast**: ${isVegetarian ? 'Oatmeal with fruits and nuts' : 'Eggs and whole grain toast'} (₹${Math.round(budget * 0.02)})
- **Lunch**: ${isVegetarian ? 'Spinach and paneer wrap' : 'Chicken salad sandwich'} (₹${Math.round(budget * 0.04)})
- **Dinner**: ${isVegetarian ? 'Dal tadka with jeera rice' : 'Grilled fish with vegetables'} (₹${Math.round(budget * 0.05)})
- **Snack**: Fruit yogurt (₹${Math.round(budget * 0.01)})
- **Nutritional Value**: Protein: 45g, Carbs: 210g, Fats: 25g

### Tuesday
- **Breakfast**: ${isVegetarian ? 'Vegetable poha' : 'Protein smoothie with fruits'} (₹${Math.round(budget * 0.02)})
- **Lunch**: ${isVegetarian ? 'Rajma chawal' : 'Tuna pasta salad'} (₹${Math.round(budget * 0.04)})
- **Dinner**: ${isVegetarian ? 'Baingan bharta with roti' : 'Baked chicken with quinoa'} (₹${Math.round(budget * 0.05)})
- **Snack**: Mixed nuts (₹${Math.round(budget * 0.01)})
- **Nutritional Value**: Protein: 48g, Carbs: 180g, Fats: 30g

### Wednesday
- **Breakfast**: ${isVegetarian ? 'Upma with vegetables' : 'Egg bhurji with paratha'} (₹${Math.round(budget * 0.02)})
- **Lunch**: ${isVegetarian ? 'Chole with rice' : 'Chicken burrito bowl'} (₹${Math.round(budget * 0.04)})
- **Dinner**: ${isVegetarian ? 'Mixed vegetable curry with roti' : 'Fish curry with rice'} (₹${Math.round(budget * 0.05)})
- **Snack**: Greek yogurt with honey (₹${Math.round(budget * 0.01)})
- **Nutritional Value**: Protein: 42g, Carbs: 195g, Fats: 22g

This meal plan is optimized for your budget of ₹${budget}/week and nutritional needs. The total weekly cost is approximately ₹${Math.round(budget * 0.7)}, which leaves you with ₹${Math.round(budget * 0.3)} for snacks and extras.`;
  };
  
  // Analyze food nutrition
  const analyzeFood = (foodItem: string): string => {
    // Basic food analysis - would be replaced with actual nutritional database lookup
    const commonFoods: Record<string, any> = {
      rice: {
        calories: 130,
        protein: 2.7,
        carbs: 28,
        fat: 0.3,
        fiber: 0.4,
        benefits: "Good source of energy, easily digestible"
      },
      dal: {
        calories: 115,
        protein: 9,
        carbs: 20,
        fat: 0.4,
        fiber: 8,
        benefits: "Excellent protein source, rich in fiber"
      },
      paneer: {
        calories: 265,
        protein: 18,
        carbs: 3,
        fat: 21,
        fiber: 0,
        benefits: "High in protein and calcium"
      },
      roti: {
        calories: 120,
        protein: 3,
        carbs: 25,
        fat: 1,
        fiber: 2,
        benefits: "Complex carbohydrates, sustained energy"
      },
      egg: {
        calories: 155,
        protein: 13,
        carbs: 1,
        fat: 11,
        fiber: 0,
        benefits: "Complete protein source, rich in vitamins"
      }
    };
    
    // Try to match food item to our basic database
    const foods = Object.keys(commonFoods);
    const matchedFood = foods.find(food => foodItem.toLowerCase().includes(food));
    
    if (matchedFood) {
      const food = commonFoods[matchedFood];
      return `## Nutrition Analysis: ${matchedFood.charAt(0).toUpperCase() + matchedFood.slice(1)}

### Macronutrients (per 100g)
- **Calories**: ${food.calories} kcal
- **Protein**: ${food.protein}g
- **Carbohydrates**: ${food.carbs}g
- **Fat**: ${food.fat}g
- **Fiber**: ${food.fiber}g

### Health Benefits
${food.benefits}

### Recommended Portion
A healthy portion would be about ${food.calories < 150 ? '1 cup' : '1/2 cup'} (${food.calories < 150 ? '200-250' : '100-125'}g).

### Nutrition Tips
- ${food.protein > 10 ? 'Great protein source! Ideal post-workout.' : 'Combine with protein sources for a complete meal.'}
- ${food.fiber > 5 ? 'High in fiber, good for digestive health.' : 'Consider adding vegetables to increase fiber intake.'}
- ${food.fat > 10 ? 'Contains healthy fats, consume in moderation.' : 'Low in fat, good for heart health.'}`;
    }
    
    // Generic response if food not found
    return `I don't have specific details for "${foodItem}" in my database, but I'd be happy to discuss its general nutritional properties or suggest alternatives.`;
  };

  // Enhanced message handling
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

    try {
      // Generate AI response based on user message
      const aiResponse = await generateResponse(userMessage);
      
      // Add AI response to messages
      setMessages(prev => [...prev, {
        id: uuidv4(),
        type: 'ai',
        content: aiResponse,
        timestamp: new Date(),
        category: userMessage.category
      }]);
    } catch (err) {
      console.error('Error generating response:', err);
      
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
                    👋 Hi {user?.name ? user.name : 'there'}! Need nutrition advice?
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    Click to chat with your AI nutritionist!
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

export default AIChatbot; 