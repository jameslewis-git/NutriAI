# NutriAI - Smart Nutrition and Diet Planning

NutriAI is an AI-powered nutrition and diet planning application that helps users create personalized meal plans based on their dietary preferences, budget constraints, and nutritional goals.

## Features

- 🤖 AI-powered nutrition assistant with personalized recommendations
- 📊 Smart budget optimization for meal planning
- 🥗 Personalized meal plans based on dietary preferences
- 📱 Responsive design for desktop and mobile
- 📈 Nutrition tracking and analysis
- 🔒 User authentication and profile management

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v16 or higher)
- [npm](https://www.npmjs.com/) (v7 or higher)

### Quick Start (Local Development)

For quick local development, you can use these commands:

```bash
# Install dependencies
npm i

# Start frontend development server
npm run dev

# Start backend development server in a new terminal
npm run dev:server
```

The frontend will be available at [http://localhost:3000](http://localhost:3000)
The backend API will be available at [http://localhost:5000](http://localhost:5000)

### Frontend Setup (Detailed)

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/nutriai.git
   cd nutriai
   ```

2. Install frontend dependencies:
   ```bash
   npm install
   ```

3. Create a `.env.local` file in the root directory with the following variables:
   ```
   NEXT_PUBLIC_API_URL=http://localhost:5000
   NEXT_PUBLIC_GEMINI_API_KEY=your_gemini_api_key
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

5. The frontend will be available at [http://localhost:3000](http://localhost:3000)

### Backend Setup (Detailed)

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Install backend dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in the backend directory with the following variables:
   ```
   PORT=5000
   MONGODB_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret
   GEMINI_API_KEY=your_gemini_api_key
   ```

4. Start the backend server:
   ```bash
   npm run start:dev
   ```

5. The backend API will be available at [http://localhost:5000](http://localhost:5000)

## Running in Production

### Build and Start Frontend
```bash
npm run build
npm start
```

### Build and Start Backend
```bash
cd backend
npm run build
npm start
```

## AI Chatbot Integration

The application includes an AI-powered chatbot that assists users with:

- Meal planning based on dietary restrictions and budget
- Nutrition analysis for specific foods
- Budget optimization suggestions
- Health tracking advice

To enable the AI chatbot:

1. Make sure you have a valid Gemini API key in your environment variables
2. Ensure the backend services are running correctly
3. The chatbot interface is accessible from any page via the floating button in the bottom right corner

## Authentication

The application uses JWT-based authentication. To register a new user:

1. Navigate to the signup page
2. Fill in your details and dietary preferences
3. Submit the form to create your account

## Environment Configuration

### Frontend Environment Variables
- `NEXT_PUBLIC_API_URL`: URL of the backend API
- `NEXT_PUBLIC_GEMINI_API_KEY`: Your Google Gemini API key

### Backend Environment Variables
- `PORT`: Port for the backend server (default: 5000)
- `MONGODB_URI`: MongoDB connection string
- `JWT_SECRET`: Secret key for JWT token generation
- `GEMINI_API_KEY`: Your Google Gemini API key

## Development Scripts

```bash
# Install all dependencies
npm i

# Start frontend development server
npm run dev

# Start backend development server
npm run dev:server

# Build frontend for production
npm run build

# Start production frontend server
npm start

# Run tests
npm test

# Lint code
npm run lint

# Format code
npm run format
```

## Technologies Used

### Frontend
- React
- TypeScript
- Tailwind CSS
- Framer Motion
- React Router
- React Query
- Lucide React (icons)

### Backend
- Node.js
- Express
- MongoDB
- Mongoose
- Google Gemini AI API
- JWT Authentication

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Google Gemini AI for powering the nutrition recommendations
- All the contributors who have helped build this project
