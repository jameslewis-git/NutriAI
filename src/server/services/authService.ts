import jwt from 'jsonwebtoken';
import { User, IUser } from '../models/User';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';
const JWT_EXPIRES_IN = '7d';

export interface AuthResponse {
  user: {
    id: string;
    email: string;
    name?: string;
  };
  token: string;
}

export class AuthService {
  static generateToken(user: IUser): string {
    return jwt.sign(
      { 
        id: user._id,
        email: user.email 
      },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN }
    );
  }

  static async register(email: string, password: string, name?: string): Promise<AuthResponse> {
    try {
      // Check if email already exists
      const existingEmail = await User.findOne({ email: email.toLowerCase() });
      if (existingEmail) {
        throw new Error('Email is already registered');
      }

      // Check if username already exists
      if (name) {
        const existingName = await User.findOne({ name: name.trim() });
        if (existingName) {
          throw new Error('Username is already taken');
        }
      }

      // Create new user
      const user = new User({
        email: email.toLowerCase(),
        password,
        name: name?.trim(),
      });

      await user.save();

      // Generate JWT token
      const token = this.generateToken(user);

      return {
        user: {
          id: user._id,
          email: user.email,
          name: user.name,
        },
        token,
      };
    } catch (error) {
      // Check for MongoDB duplicate key error
      if (error instanceof Error && error.message.includes('duplicate key')) {
        if (error.message.includes('email')) {
          throw new Error('Email is already registered');
        }
        if (error.message.includes('name')) {
          throw new Error('Username is already taken');
        }
      }
      throw error;
    }
  }

  static async login(email: string, password: string): Promise<AuthResponse> {
    try {
      // Find user by email
      const user = await User.findOne({ email });
      if (!user) {
        throw new Error('Invalid email or password');
      }

      // Check password
      const isValidPassword = await user.comparePassword(password);
      if (!isValidPassword) {
        throw new Error('Invalid email or password');
      }

      // Generate JWT token
      const token = this.generateToken(user);

      return {
        user: {
          id: user._id,
          email: user.email,
          name: user.name,
        },
        token,
      };
    } catch (error) {
      throw error;
    }
  }

  static async verifyToken(token: string): Promise<IUser | null> {
    try {
      const decoded = jwt.verify(token, JWT_SECRET) as { id: string };
      const user = await User.findById(decoded.id);
      return user;
    } catch (error) {
      return null;
    }
  }
} 