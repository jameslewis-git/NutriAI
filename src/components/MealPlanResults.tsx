
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Loader2, ShoppingCart, Utensils, Repeat } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from '@/hooks/use-toast';

interface MealPlanResultsProps {
  isLoading: boolean;
  mealPlan: any;
}

const MealPlanResults: React.FC<MealPlanResultsProps> = ({ isLoading, mealPlan }) => {
  const [selectedMeal, setSelectedMeal] = useState(null);
  
  if (isLoading) {
    return (
      <Card className="h-full flex flex-col items-center justify-center p-12">
        <Loader2 className="h-16 w-16 animate-spin text-primary/50" />
        <p className="mt-4 text-lg text-muted-foreground animate-pulse">
          Our AI is crafting your personalized meal plan...
        </p>
      </Card>
    );
  }
  
  if (!mealPlan) {
    return (
      <Card className="h-full flex flex-col items-center justify-center p-12 bg-muted/30">
        <div className="bg-primary/5 p-8 rounded-full">
          <Utensils className="h-20 w-20 text-primary/40" />
        </div>
        <h3 className="mt-6 text-xl font-medium">Your meal plan will appear here</h3>
        <p className="mt-2 text-center text-muted-foreground">
          Fill out your preferences on the left and click "Generate Meal Plan" to get started
        </p>
      </Card>
    );
  }
  
  const macroData = [
    { name: 'Protein', value: mealPlan.macros.protein, color: '#8b5cf6' },
    { name: 'Carbs', value: mealPlan.macros.carbs, color: '#3b82f6' },
    { name: 'Fat', value: mealPlan.macros.fat, color: '#ec4899' },
  ];
  
  const handleCreateGroceryList = () => {
    toast({
      title: "Grocery List Created!",
      description: "Your grocery list has been created based on this meal plan.",
    });
  };

  const toggleMealDetails = (mealId) => {
    if (selectedMeal === mealId) {
      setSelectedMeal(null);
    } else {
      setSelectedMeal(mealId);
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Your AI-Generated Meal Plan</CardTitle>
          <CardDescription>
            Based on your preferences, we've created a meal plan that balances nutrition and budget
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div className="bg-muted/30 rounded-lg p-4">
              <p className="text-sm text-muted-foreground mb-1">Total Cost</p>
              <p className="text-2xl font-bold">₹{mealPlan.totalCost}</p>
            </div>
            <div className="bg-muted/30 rounded-lg p-4">
              <p className="text-sm text-muted-foreground mb-1">Total Calories</p>
              <p className="text-2xl font-bold">{mealPlan.totalCalories} kcal</p>
            </div>
          </div>
          
          <div className="mb-6">
            <h3 className="text-lg font-medium mb-3">Macronutrient Breakdown</h3>
            <div className="h-[180px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={macroData}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={80}
                    paddingAngle={2}
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  >
                    {macroData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip 
                    formatter={(value) => [`${value}g`, '']}
                    labelFormatter={(name) => `${name}`}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
          
          <h3 className="text-lg font-medium mb-3">Your Meals</h3>
          <div className="space-y-4">
            {mealPlan.meals.map(meal => (
              <motion.div 
                key={meal.id} 
                layoutId={`meal-${meal.id}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <Card className="overflow-hidden hover:shadow-md transition-shadow duration-300">
                  <div className="flex flex-col sm:flex-row">
                    <div className="sm:w-1/3 h-48 sm:h-auto relative">
                      <img 
                        src={meal.image} 
                        alt={meal.name} 
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-3 sm:hidden">
                        <h4 className="text-white font-medium">{meal.name}</h4>
                      </div>
                    </div>
                    <div className="sm:w-2/3 p-4">
                      <h4 className="text-lg font-medium mb-1 hidden sm:block">{meal.name}</h4>
                      <div className="grid grid-cols-2 gap-2 mb-3">
                        <div>
                          <p className="text-xs text-muted-foreground">Calories</p>
                          <p className="font-medium">{meal.calories} kcal</p>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground">Cost</p>
                          <p className="font-medium">₹{meal.cost}</p>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground">Protein</p>
                          <p className="font-medium">{meal.protein}g</p>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground">Carbs</p>
                          <p className="font-medium">{meal.carbs}g</p>
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => toggleMealDetails(meal.id)}
                        >
                          {selectedMeal === meal.id ? 'Hide Details' : 'Show Details'}
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => {
                            toast({
                              title: "Alternative Meals",
                              description: `You can replace this with ${meal.alternatives[0].name} and save ₹${meal.cost - meal.alternatives[0].cost}`,
                            });
                          }}
                        >
                          <Repeat className="h-4 w-4 mr-1" />
                          Alternatives
                        </Button>
                      </div>
                      
                      {selectedMeal === meal.id && (
                        <motion.div 
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          className="mt-3 pt-3 border-t"
                        >
                          <p className="text-sm font-medium mb-1">Ingredients:</p>
                          <ul className="text-sm text-muted-foreground">
                            {meal.ingredients.map((ingredient, index) => (
                              <li key={index}>{ingredient}</li>
                            ))}
                          </ul>
                          
                          <p className="text-sm font-medium mt-3 mb-1">Alternative options:</p>
                          <ul className="text-sm text-muted-foreground">
                            {meal.alternatives.map((alt, index) => (
                              <li key={index} className="flex justify-between">
                                <span>{alt.name}</span>
                                <span>₹{alt.cost}</span>
                              </li>
                            ))}
                          </ul>
                        </motion.div>
                      )}
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </CardContent>
        <CardFooter className="flex justify-end">
          <Button onClick={handleCreateGroceryList}>
            <ShoppingCart className="mr-2 h-4 w-4" />
            Create Grocery List
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default MealPlanResults;
