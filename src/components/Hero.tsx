import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Loader2, Pencil } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import { UserInfoForm, UserInfoFormValues } from './UserInfoForm';
import { useForm } from 'react-hook-form';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from './ui/dialog';
import { Button } from './ui/button';
import { toast } from './ui/use-toast';
import { Label } from './ui/label';
import { Input } from './ui/input';

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
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMouseX(e.clientX / window.innerWidth * 20 - 10);
      setMouseY(e.clientY / window.innerHeight * 20 - 10);
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Add this effect to fetch user's meal plan when logged in
  useEffect(() => {
    const fetchUserMealPlan = async () => {
      if (user) {
        try {
          setIsLoading(true);
          // Simulating an API call - replace with your actual API endpoint
          const demoData = {
            name: user.name,
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

    const demoData = {
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
    const demoData = {
      name: data.name,
      age: data.age,
      budget: `₹${data.budget}/week`,
      meals: [
        {
          day: "Monday",
          meal: data.budget < 500 ? "Simple Dal Rice" : "Paneer Butter Masala with Naan",
          price: `₹${Math.round(data.budget * 0.15)}`,
          nutrition: { protein: 18, carbs: 22, fat: 14 }
        },
        {
          day: "Tuesday",
          meal: data.budget < 500 ? "Dal Rice" : "Dal Tadka with Jeera Rice",
          price: `₹${Math.round(data.budget * 0.12)}`,
          nutrition: { protein: 15, carbs: 45, fat: 8 }
        },
        {
          day: "Wednesday",
          meal: data.budget < 500 ? "Mixed Veg Roti" : "Mixed Vegetable Curry with Roti",
          price: `₹${Math.round(data.budget * 0.13)}`,
          nutrition: { protein: 12, carbs: 35, fat: 10 }
        },
        {
          day: "Thursday",
          meal: data.budget < 500 ? "Chole Rice" : "Chana Masala with Bhature",
          price: `₹${Math.round(data.budget * 0.14)}`,
          nutrition: { protein: 16, carbs: 42, fat: 12 }
        },
        {
          day: "Friday",
          meal: data.budget < 500 ? "Palak Roti" : "Palak Paneer with Paratha",
          price: `₹${Math.round(data.budget * 0.16)}`,
          nutrition: { protein: 20, carbs: 28, fat: 15 }
        },
        {
          day: "Saturday",
          meal: data.budget < 500 ? "Veg Pulao" : "Vegetable Biryani",
          price: `₹${Math.round(data.budget * 0.15)}`,
          nutrition: { protein: 14, carbs: 48, fat: 16 }
        },
        {
          day: "Sunday",
          meal: data.budget < 500 ? "Plain Dosa" : "Masala Dosa with Sambar",
          price: `₹${Math.round(data.budget * 0.15)}`,
          nutrition: { protein: 12, carbs: 52, fat: 18 }
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
        <motion.div 
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
            
            <Button
              onClick={() => navigate('/dashboard')}
              variant="outline"
              className="px-8 py-4 rounded-xl font-semibold text-lg border-2 border-gray-200 hover:border-primary/30 hover:bg-primary/5 transition-all duration-300 flex items-center justify-center gap-3 shadow-md hover:shadow-lg"
            >
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
                  d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" 
                />
              </svg>
              Go to Dashboard
            </Button>
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
        </motion.div>
      );
    }

    // Return original content for non-logged in users
    return (
      <motion.div 
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
      </motion.div>
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
        
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold text-lg">Weekly Meal Plan</h3>
                <p className="text-sm text-gray-500">
                  For {planToShow?.name}, {planToShow?.age} - Budget: {planToShow?.budget}
                </p>
              </div>
            </div>
            
            {user && (
              <Button
                onClick={() => setIsEditModalOpen(true)}
                variant="ghost"
                className="hover:bg-primary/10 text-primary hover:text-primary/90 rounded-full p-2 h-auto"
              >
                <Pencil className="w-4 h-4" />
                <span className="sr-only">Edit Plan</span>
              </Button>
            )}
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

  // Add this enhanced EditPlanModal component
  const EditPlanModal = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => {
    const form = useForm<PlanSettings>({
      defaultValues: {
        name: mealPlan?.name || '',
        age: mealPlan?.age || 30,
        budget: Number(mealPlan?.budget?.replace(/[^0-9]/g, '')) || 4000
      }
    });

    const onSubmit = async (data: PlanSettings) => {
      try {
        setIsLoading(true);
        
        // Generate new meals based on updated budget and age
        const updatedMeals = generateMealsForBudget(data.budget).map(meal => ({
          ...meal,
          nutrition: adjustNutrition(meal.nutrition, data.age)
        }));

        const updatedPlan = {
          name: data.name,
          age: data.age,
          budget: `₹${data.budget}/week`,
          meals: updatedMeals
        };
        
        setMealPlan(updatedPlan);
        onClose();
        
        toast({
          title: "Success!",
          description: "Your plan has been updated.",
        });
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to update plan settings.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Update Your Plan</DialogTitle>
            <DialogDescription>
              Adjust your details to update your meal plan
            </DialogDescription>
          </DialogHeader>
          
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  {...form.register("name")}
                  className="w-full"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="age">Age</Label>
                <Input
                  id="age"
                  type="number"
                  {...form.register("age", { 
                    valueAsNumber: true,
                    min: { value: 18, message: "Age must be at least 18" },
                    max: { value: 100, message: "Age must be less than 100" }
                  })}
                  className="w-full"
                />
                {form.formState.errors.age && (
                  <p className="text-sm text-red-500">{form.formState.errors.age.message}</p>
                )}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="budget">Weekly Budget (₹)</Label>
                <Input
                  id="budget"
                  type="number"
                  {...form.register("budget", { 
                    valueAsNumber: true,
                    min: { value: 200, message: "Minimum budget is ₹200" }
                  })}
                  className="w-full"
                />
                {form.formState.errors.budget && (
                  <p className="text-sm text-red-500">{form.formState.errors.budget.message}</p>
                )}
                <p className="text-xs text-gray-500">
                  Minimum budget: ₹200/week
                </p>
              </div>
            </div>
            
            <DialogFooter>
              <Button type="button" variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Updating...
                  </>
                ) : (
                  'Update Plan'
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    );
  };

  return (
    <section className="min-h-screen flex flex-col pt-24 relative overflow-hidden">
      {/* Background Molecules */}
      <div 
        ref={heroBgRef} 
        className="absolute inset-0 bg-hero-gradient -z-10"
      >
        {/* Top-left molecule */}
        <motion.div 
          className="absolute top-20 left-[10%] w-72 h-72"
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 90, 0],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear"
          }}
        >
          <div className="w-full h-full bg-primary/10 rounded-full filter blur-3xl" />
        </motion.div>

        {/* Top-right molecule */}
        <motion.div 
          className="absolute top-40 right-[15%] w-64 h-64"
          animate={{
            scale: [1.2, 1, 1.2],
            rotate: [90, 0, 90],
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: "linear"
          }}
        >
          <div className="w-full h-full bg-violet-500/10 rounded-full filter blur-3xl" />
        </motion.div>

        {/* Bottom-left molecule */}
        <motion.div 
          className="absolute bottom-[20%] left-[20%] w-96 h-96"
          animate={{
            scale: [1, 1.1, 1],
            rotate: [-45, 0, -45],
          }}
          transition={{
            duration: 18,
            repeat: Infinity,
            ease: "linear"
          }}
        >
          <div className="w-full h-full bg-accent/10 rounded-full filter blur-3xl" />
        </motion.div>

        {/* Bottom-right molecule */}
        <motion.div 
          className="absolute bottom-[10%] right-[10%] w-80 h-80"
          animate={{
            scale: [1.1, 1, 1.1],
            rotate: [45, 0, 45],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "linear"
          }}
        >
          <div className="w-full h-full bg-primary/10 rounded-full filter blur-3xl" />
        </motion.div>

        {/* Center floating molecule */}
        <motion.div 
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[40rem] h-[40rem]"
          animate={{
            scale: [1, 1.05, 1],
            rotate: [0, 360, 0],
          }}
          transition={{
            duration: 30,
            repeat: Infinity,
            ease: "linear"
          }}
        >
          <div className="w-full h-full bg-gradient-to-r from-primary/5 to-accent/5 rounded-full filter blur-3xl" />
        </motion.div>
      </div>

      {/* Mouse movement effect */}
      <motion.div 
        className="absolute inset-0 pointer-events-none"
        animate={{
          x: mouseX,
          y: mouseY,
        }}
        transition={{
          type: "spring",
          damping: 50,
          stiffness: 100,
        }}
      >
        <div className="w-full h-full bg-gradient-to-r from-primary/5 to-accent/5 filter blur-3xl opacity-50" />
      </motion.div>

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

      <EditPlanModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
      />
    </section>
  );
};

export default Hero;
