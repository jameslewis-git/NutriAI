export interface User {
  id: string;
  name: string;
  email: string;
  age: number;
  height?: number;
  weight?: number;
  weeklyBudget: number;
  activityLevel: 'sedentary' | 'light' | 'moderate' | 'very' | 'extra';
  mealsPerDay: number;
  dietaryPreferences: {
    id: string;
    name: string;
    selected: boolean;
  }[];
  healthMetrics: {
    date: string;
    weight: number;
    calories: number;
    protein: number;
    carbs: number;
    fats: number;
  }[];
  allergies: string[];
  favoriteIngredients: string[];
  dislikedIngredients: string[];
  // other user properties
} 