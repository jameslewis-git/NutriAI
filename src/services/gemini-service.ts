import { GoogleGenerativeAI } from "@google/generative-ai";
import { Message, UserPreferences } from '../types';

// Initialize Gemini
const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY!);

export class GeminiService {
  private static model = genAI.getGenerativeModel({ model: "gemini-pro" });
  private static chat = this.model.startChat({
    history: [],
    generationConfig: {
      maxOutputTokens: 2048,
      temperature: 0.7,
      topP: 0.8,
      topK: 40,
    },
  });

  static async generateResponse(
    messages: Message[],
    userPreferences: UserPreferences
  ): Promise<string> {
    try {
      // Format the context with user preferences
      const context = `You are an AI nutritionist assistant. Consider these user preferences:
        - Name: ${userPreferences.name}
        - Age: ${userPreferences.age}
        - Weight: ${userPreferences.weight}kg
        - Height: ${userPreferences.height}cm
        - Diet Restrictions: ${userPreferences.dietaryRestrictions.join(', ')}
        - Allergies: ${userPreferences.allergies.join(', ')}
        - Weekly Budget: ₹${userPreferences.weeklyBudget}
        - Fitness Goals: ${userPreferences.fitnessGoals.join(', ')}`;

      // Get the last user message
      const userMessage = messages[messages.length - 1].content;

      // Send to Gemini
      const result = await this.chat.sendMessage(userMessage, {
        safetySettings: [
          {
            category: "HARM_CATEGORY_HARASSMENT",
            threshold: "BLOCK_MEDIUM_AND_ABOVE",
          },
          {
            category: "HARM_CATEGORY_HATE_SPEECH",
            threshold: "BLOCK_MEDIUM_AND_ABOVE",
          },
        ],
      });

      const response = await result.response;
      return response.text();
    } catch (error) {
      console.error('Gemini API Error:', error);
      throw new Error('Failed to generate response');
    }
  }

  static async generateMealPlan(
    preferences: UserPreferences
  ): Promise<string> {
    try {
      const prompt = `Generate a weekly meal plan considering:
        - Budget: ₹${preferences.weeklyBudget}
        - Dietary Restrictions: ${preferences.dietaryRestrictions.join(', ')}
        - Allergies: ${preferences.allergies.join(', ')}
        - Meal Preferences: ${Object.entries(preferences.mealPreferences)
          .filter(([_, value]) => value)
          .map(([meal]) => meal)
          .join(', ')}
        
        Format the response as a structured meal plan with nutritional information and costs.`;

      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      return response.text();
    } catch (error) {
      console.error('Meal Plan Generation Error:', error);
      throw new Error('Failed to generate meal plan');
    }
  }

  static async analyzeNutrition(
    mealDescription: string
  ): Promise<string> {
    try {
      const prompt = `Analyze the nutritional content of this meal: ${mealDescription}
        Provide detailed information about:
        - Calories
        - Macronutrients (protein, carbs, fat)
        - Key vitamins and minerals
        - Suggestions for improvement`;

      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      return response.text();
    } catch (error) {
      console.error('Nutrition Analysis Error:', error);
      throw new Error('Failed to analyze nutrition');
    }
  }
} 