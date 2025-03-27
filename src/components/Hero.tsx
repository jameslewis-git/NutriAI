import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

interface MealPlan {
  name: string;
  age: number;
  budget: string;
  meals: {
    day: string;
    meal: string;
    price: string;
    nutrition: string;
  }[];
}

const Hero = () => {
  const heroBgRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuth();
  const [mealPlan, setMealPlan] = useState<MealPlan | null>(null);
  
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!heroBgRef.current) return;
      
      const x = e.clientX / window.innerWidth;
      const y = e.clientY / window.innerHeight;
      
      heroBgRef.current.style.transform = `translate(${x * -20}px, ${y * -20}px)`;
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  // Fetch user's meal plan when component mounts or user changes
  useEffect(() => {
    const fetchUserMealPlan = async () => {
      if (user) {
        try {
          const response = await fetch(`http://localhost:5000/api/meal-plans/user/${user.id}`, {
            headers: {
              'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
          });
          
          if (response.ok) {
            const data = await response.json();
            setMealPlan(data);
          }
        } catch (error) {
          console.error('Error fetching meal plan:', error);
        }
      }
    };

    fetchUserMealPlan();
  }, [user]);

  const handleGeneratePlan = async () => {
    setIsLoading(true);
    if (!user) {
      // If user is not logged in, redirect to login
      navigate('/login');
      return;
    }
    // Add a small delay to show the loading state
    await new Promise(resolve => setTimeout(resolve, 800));
    navigate('/meal-planner', { state: { fromHero: true } });
  };
  
  return (
    <section className="relative min-h-screen flex items-center py-20 overflow-hidden">
      {/* Background Elements */}
      <div 
        ref={heroBgRef} 
        className="absolute inset-0 bg-hero-gradient -z-10"
      >
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-primary/10 rounded-full filter blur-3xl"></div>
        <div className="absolute bottom-1/3 right-1/4 w-96 h-96 bg-accent/10 rounded-full filter blur-3xl"></div>
      </div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 z-10">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="md:pr-8 animate-fade-in-left">
            <div className="inline-block px-3 py-1 mb-6 rounded-full bg-white/30 backdrop-blur-sm border border-white/20 text-sm font-medium text-primary">
              AI-Powered Nutrition & Diet Planner
            </div>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
              Smart Nutrition, 
              <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                {" "}Smarter Savings
              </span>
            </h1>
            
            <p className="text-lg md:text-xl text-gray-700 mb-8 max-w-lg">
              Personalized meal plans that optimize your nutrition while respecting your budget, powered by advanced AI.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <button 
                onClick={handleGeneratePlan}
                disabled={isLoading}
                className="button-primary hover:scale-105 transform transition-all duration-200 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center min-w-[200px]"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Generating...
                  </>
                ) : (
                  'Generate My Diet Plan'
                )}
              </button>
              <button 
                onClick={() => navigate('/pricing')}
                disabled={isLoading}
                className="px-6 py-3 border border-gray-300 text-gray-700 font-semibold rounded-lg transition-all duration-300 hover:bg-gray-50 disabled:opacity-70 disabled:cursor-not-allowed"
              >
                Learn More
              </button>
            </div>
            
            <div className="mt-10 flex items-center text-sm text-gray-500">
              <svg className="h-5 w-5 text-green-500 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span>No credit card required</span>
              <span className="mx-3">•</span>
              <svg className="h-5 w-5 text-green-500 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span>Free personal plan available</span>
            </div>
          </div>
          
          <div className="animate-fade-in-right">
            <div className="glass-panel p-6 relative">
              <div className="absolute -top-3 -right-3 bg-primary text-white text-xs font-bold px-2 py-1 rounded-md">
                AI-Generated
              </div>
              
              <div className="flex items-center mb-4">
                <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center mr-3">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold">Weekly Meal Plan</h3>
                  <p className="text-sm text-gray-500">
                    {mealPlan 
                      ? `For ${mealPlan.name}, ${mealPlan.age} - Budget: ${mealPlan.budget}/week`
                      : 'Create your personalized meal plan'}
                  </p>
                </div>
              </div>
              
              <div className="space-y-4">
                {mealPlan ? (
                  mealPlan.meals.map((item, index) => (
                    <div key={index} className="glass-card p-4 flex justify-between items-center animate-fade-in" style={{ animationDelay: `${index * 0.1}s` }}>
                      <div>
                        <span className="text-sm font-medium text-gray-500">{item.day}</span>
                        <h4 className="font-medium">{item.meal}</h4>
                        <p className="text-xs text-gray-500">{item.nutrition}</p>
                      </div>
                      <div className="text-right">
                        <span className="text-lg font-semibold text-primary">{item.price}</span>
                        <button className="block text-xs text-gray-500 hover:text-primary mt-1">View Recipe</button>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8">
                    <p className="text-gray-500">
                      {user 
                        ? 'Generate your first meal plan!'
                        : 'Login to create your personalized meal plan'}
                    </p>
                  </div>
                )}
              </div>
              
              <div className="mt-4 text-center">
                {mealPlan && (
                  <button className="text-sm text-primary font-medium hover:underline">
                    View Full Weekly Plan →
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
