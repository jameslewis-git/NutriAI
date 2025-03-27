export interface User {
  id: string;
  name: string;
  email: string;
  age?: number;
  weight?: number;
  height?: number;
  dietaryRestrictions?: string[];
  allergies?: string[];
  weeklyBudget?: number;
  fitnessGoals?: string[];
  mealPreferences?: {
    breakfast: boolean;
    lunch: boolean;
    dinner: boolean;
    snacks: boolean;
  };
} 