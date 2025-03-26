import express from 'express';
import { AuthService } from '../services/authService';
import { User } from '../models/User';

const router = express.Router();

router.post('/register', async (req, res) => {
  try {
    const { email, password, name } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    const result = await AuthService.register(email, password, name);
    res.status(201).json(result);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
});

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    const result = await AuthService.login(email, password);
    res.json(result);
  } catch (error: any) {
    res.status(401).json({ message: error.message });
  }
});

// Add new endpoint for checking username availability
router.get('/check-username/:username', async (req, res) => {
  try {
    const username = req.params.username.trim();
    
    // Validate username length
    if (username.length < 2) {
      return res.status(400).json({
        available: false,
        message: 'Username must be at least 2 characters long'
      });
    }

    // Check if username exists
    const existingUser = await User.findOne({ name: username });
    
    res.json({
      available: !existingUser,
      message: existingUser ? 'Username is already taken' : 'Username is available'
    });
  } catch (error) {
    res.status(500).json({
      available: false,
      message: 'Error checking username availability'
    });
  }
});

export default router; 