export interface Message {
  id: string;
  type: 'user' | 'ai';
  content: string;
  timestamp: Date;
  category?: 'meal-planning' | 'nutrition' | 'budget' | 'tracking';
}

export interface UserPreferences {
  name: string;
  age: number;
  weight: number;
  height: number;
  dietaryRestrictions: string[];
  allergies: string[];
  weeklyBudget: number;
  fitnessGoals: string[];
  mealPreferences: {
    breakfast: boolean;
    lunch: boolean;
    dinner: boolean;
    snacks: boolean;
  };
}

export interface NutritionPlan {
  id: string;
  meals: Meal[];
  totalCalories: number;
  totalCost: number;
  nutritionSummary: NutritionInfo;
}

export interface Meal {
  id: string;
  name: string;
  type: 'breakfast' | 'lunch' | 'dinner' | 'snack';
  ingredients: Ingredient[];
  nutrition: NutritionInfo;
  cost: number;
  recipe: string;
}

export interface Ingredient {
  name: string;
  amount: number;
  unit: string;
  cost: number;
}

export interface NutritionInfo {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber: number;
  vitamins: Record<string, number>;
  minerals: Record<string, number>;
} 