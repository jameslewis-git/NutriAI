import type { NextApiRequest, NextApiResponse } from 'next';
import { GeminiService } from '../../../services/gemini-service';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { messages, userPreferences } = req.body;
    
    const response = await GeminiService.generateResponse(
      messages,
      userPreferences
    );

    res.status(200).json({ message: response });
  } catch (error) {
    console.error('AI Chat Error:', error);
    res.status(500).json({ message: 'Error processing request' });
  }
} 