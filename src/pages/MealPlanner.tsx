
import React, { useState } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import MealPlanForm from '@/components/MealPlanForm';
import MealPlanResults from '@/components/MealPlanResults';
import AIAssistant from '@/components/AIAssistant';
import { toast } from '@/hooks/use-toast';

const MealPlanner = () => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [mealPlan, setMealPlan] = useState(null);

  const handleGenerateMealPlan = (formData) => {
    setIsGenerating(true);
    
    // Simulate AI generating meal plan
    setTimeout(() => {
      const generatedMealPlan = {
        meals: [
          {
            id: 1,
            name: 'Avocado & Spinach Protein Bowl',
            image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2340&q=80',
            calories: 450,
            protein: 25,
            carbs: 30,
            fat: 15,
            cost: 120,
            ingredients: ['Avocado', 'Spinach', 'Quinoa', 'Chickpeas', 'Olive Oil', 'Lemon Juice'],
            alternatives: [
              { name: 'Kale & Tofu Bowl', cost: 95 },
              { name: 'Lentil & Vegetable Bowl', cost: 80 }
            ]
          },
          {
            id: 2,
            name: 'Berry Protein Smoothie',
            image: 'https://images.unsplash.com/photo-1619898804188-e7e390b3b469?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2340&q=80',
            calories: 320,
            protein: 20,
            carbs: 40,
            fat: 6,
            cost: 80,
            ingredients: ['Berries', 'Banana', 'Protein Powder', 'Almond Milk', 'Chia Seeds'],
            alternatives: [
              { name: 'Peanut Butter Smoothie', cost: 70 },
              { name: 'Green Detox Smoothie', cost: 85 }
            ]
          },
          {
            id: 3,
            name: 'Mediterranean Chickpea Salad',
            image: 'https://images.unsplash.com/photo-1529059997568-3d847b1154f0?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2340&q=80',
            calories: 380,
            protein: 15,
            carbs: 45,
            fat: 12,
            cost: 95,
            ingredients: ['Chickpeas', 'Cucumber', 'Cherry Tomatoes', 'Red Onion', 'Feta Cheese', 'Olive Oil', 'Lemon Juice'],
            alternatives: [
              { name: 'Greek Pasta Salad', cost: 110 },
              { name: 'Quinoa Tabbouleh', cost: 105 }
            ]
          }
        ],
        totalCost: 295,
        totalCalories: 1150,
        macros: {
          protein: 60,
          carbs: 115,
          fat: 33
        }
      };
      
      setMealPlan(generatedMealPlan);
      setIsGenerating(false);
      toast({
        title: "Meal Plan Generated!",
        description: "Your personalized meal plan is ready.",
      });
    }, 3000);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-24 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h1 className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-indigo-600 to-violet-500 bg-clip-text text-transparent">
              Your AI Nutritionist
            </h1>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Tell us your dietary preferences, health goals, and budget constraints. 
              Our AI will create a personalized meal plan optimized just for you.
            </p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-5">
              <MealPlanForm onSubmit={handleGenerateMealPlan} isLoading={isGenerating} />
            </div>
            
            <div className="lg:col-span-7">
              <MealPlanResults isLoading={isGenerating} mealPlan={mealPlan} />
            </div>
          </div>
        </div>
      </div>
      
      <AIAssistant />
      <Footer />
    </div>
  );
};

export default MealPlanner;
