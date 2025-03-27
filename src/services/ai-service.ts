import { Message, NutritionPlan, UserPreferences } from '../types';
import { GeminiService } from './gemini-service';

export class AIService {
  private static async query(endpoint: string, payload: any) {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/ai/${endpoint}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });
    
    if (!response.ok) {
      throw new Error('AI Service error');
    }
    
    return response.json();
  }

  static async generateResponse(
    messages: any[], 
    userPreferences: any
  ): Promise<string> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Get the last user message
    const lastMessage = messages[messages.length - 1];
    
    // Demo responses based on message content
    const userInput = lastMessage.content.toLowerCase();
    
    if (userInput.includes('hello') || userInput.includes('hi')) {
      return `Hello ${userPreferences.name}! How can I assist with your nutrition needs today?`;
    }
    
    if (userInput.includes('budget')) {
      return `Based on your weekly budget of ₹${userPreferences.weeklyBudget}, I can suggest affordable meal options that provide good nutrition. Would you like me to create a budget-friendly meal plan for you?`;
    }
    
    if (userInput.includes('diet') || userInput.includes('weight loss')) {
      return `I see your fitness goals include: ${userPreferences.fitnessGoals.join(', ')}. For weight management, I recommend focusing on protein-rich foods and controlled portions. Would you like specific meal suggestions?`;
    }
    
    // Default response
    return "I can help you with nutrition advice, meal planning, budget optimization, and health tracking. What specific area would you like to focus on?";
  }

  static async generateMealPlan(userPreferences: any): Promise<string> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Simple example meal plan based on budget
    const budget = userPreferences.weeklyBudget;
    const hasDietaryRestrictions = userPreferences.dietaryRestrictions.length > 0;
    
    return `# Personalized Weekly Meal Plan

## Budget: ₹${budget}/week

### Monday
- **Breakfast**: Oatmeal with banana and honey (₹40)
- **Lunch**: Lentil soup with rice (₹60)
- **Dinner**: Mixed vegetable curry with 2 rotis (₹80)
- **Nutritional Value**: Protein: 45g, Carbs: 210g, Fats: 25g

### Tuesday
- **Breakfast**: Whole wheat toast with peanut butter (₹50)
- **Lunch**: Rajma chawal (₹65)
- **Dinner**: Palak paneer with jeera rice (₹90)
- **Nutritional Value**: Protein: 48g, Carbs: 180g, Fats: 30g

### Wednesday
- **Breakfast**: Vegetable poha (₹35)
- **Lunch**: Chole with 2 chapatis (₹70)
- **Dinner**: Mixed dal with rice (₹75)
- **Nutritional Value**: Protein: 42g, Carbs: 195g, Fats: 22g

This meal plan is optimized for your budget and nutritional needs. The total weekly cost is approximately ₹${Math.round(budget * 0.7)}, which leaves you with ₹${Math.round(budget * 0.3)} for snacks and extras.`;
  }

  static async analyzeNutrition(mealDescription: string): Promise<string> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Demo nutrition analysis
    return `## Nutrition Analysis: ${mealDescription}

### Macronutrients
- **Calories**: ~450 kcal
- **Protein**: 18g (16% of daily value)
- **Carbohydrates**: 62g (23% of daily value)
- **Fat**: 15g (19% of daily value)
- **Fiber**: 8g (28% of daily value)

### Micronutrients
- High in Vitamin A, C, and Iron
- Moderate in Calcium and B vitamins
- Low in Vitamin D

### Health Insights
This meal provides a good balance of nutrients with a moderate calorie count. The fiber content supports digestive health, while the protein content helps with muscle maintenance.

### Suggestions
- Consider adding a source of healthy fats like avocado or nuts
- If you're looking to reduce calories, decrease the portion of carbohydrates
- For more protein, add a serving of Greek yogurt or legumes`;
  }
} 