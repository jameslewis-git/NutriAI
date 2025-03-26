const WeeklyMealPlan = () => {
  return (
    <div className="glass-panel p-6 relative">
      <div className="absolute -top-3 -right-3 bg-primary text-white text-xs font-bold px-2 py-1 rounded-md">
        AI-Generated
      </div>
      
      <div className="flex items-center mb-4">
        <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center mr-3">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
        </div>
        <div>
          <h3 className="font-semibold">Weekly Meal Plan</h3>
          <p className="text-sm text-gray-500">For Priya, 28 - Budget: ₹4000/week</p>
        </div>
      </div>
      
      <div className="space-y-4">
        {[
          { 
            day: 'Monday', 
            meal: 'Paneer Butter Masala', 
            price: '₹180', 
            nutrition: 'Protein: 18g • Carbs: 22g • Fat: 14g' 
          },
          { 
            day: 'Tuesday', 
            meal: 'Dal Tadka with Jeera Rice', 
            price: '₹150', 
            nutrition: 'Protein: 15g • Carbs: 45g • Fat: 8g' 
          },
          { 
            day: 'Wednesday', 
            meal: 'Chicken Biryani', 
            price: '₹220', 
            nutrition: 'Protein: 25g • Carbs: 48g • Fat: 12g' 
          }
        ].map((item, index) => (
          <div key={index} className="glass-card p-4 flex justify-between items-center animate-fade-in" style={{ animationDelay: `${index * 0.1}s` }}>
            <div>
              <span className="text-sm font-medium text-gray-500">{item.day}</span>
              <h4 className="font-medium">{item.meal}</h4>
              <p className="text-xs text-gray-500">{item.nutrition}</p>
            </div>
            <div className="text-right">
              <span className="text-lg font-semibold text-primary">{item.price}</span>
              <button className="block text-xs text-gray-500 hover:text-primary mt-1">View Recipe</button>
            </div>
          </div>
        ))}
      </div>
      
      <div className="mt-4 text-center">
        <button className="text-sm text-primary font-medium hover:underline">
          View Full Weekly Plan →
        </button>
      </div>
    </div>
  );
}; 