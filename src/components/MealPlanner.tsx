import { useProtectedRoute } from '../hooks/useProtectedRoute';

const MealPlanner = () => {
  const { user, isAuthenticated } = useProtectedRoute();
  
  if (!isAuthenticated) {
    return null; // or a loading spinner
  }

  return (
    // Your meal planner content
  );
}; 