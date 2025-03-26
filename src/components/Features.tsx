
import React, { useEffect, useRef } from 'react';

interface Feature {
  icon: React.ReactNode;
  title: string;
  description: string;
}

const Features = () => {
  const features: Feature[] = [
    {
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
        </svg>
      ),
      title: 'AI-Powered Meal Planning',
      description: 'Advanced algorithms create personalized meal plans based on your dietary preferences and health goals.'
    },
    {
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      title: 'Budget Optimization',
      description: 'Balance nutrition and cost with our intelligent budget optimization tool that finds the best value ingredients for ₹.'
    },
    {
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 8v8m-4-5v5m-4-2v2m-2 4h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      ),
      title: 'Nutrition Tracking',
      description: 'Monitor your daily nutrient intake with detailed breakdowns of macros and essential micronutrients.'
    },
    {
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
        </svg>
      ),
      title: 'Real-time Grocery Pricing',
      description: 'Access up-to-date pricing from local grocery stores to make informed shopping decisions in ₹.'
    },
  ];

  const sectionRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    // Add initial classes to make sure cards are visible even without animation
    cardsRef.current.forEach((card) => {
      if (card) {
        card.classList.add('opacity-100');
      }
    });
    
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('animate-fade-in');
            entry.target.classList.add('opacity-100');
          }
        });
      },
      { threshold: 0.1 }
    );

    if (cardsRef.current) {
      cardsRef.current.forEach((card) => {
        if (card) observer.observe(card);
      });
    }

    return () => {
      if (cardsRef.current) {
        cardsRef.current.forEach((card) => {
          if (card) observer.unobserve(card);
        });
      }
    };
  }, []);

  return (
    <section id="features" className="py-20 relative overflow-hidden" ref={sectionRef}>
      <div className="absolute top-0 inset-x-0 h-40 bg-gradient-to-b from-background to-transparent"></div>
      <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary/5 rounded-full filter blur-3xl"></div>
      <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-accent/5 rounded-full filter blur-3xl"></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            AI-Powered Features
          </h2>
          <p className="text-lg text-muted-foreground">
            Our cutting-edge technology creates the perfect balance between nutrition, taste, and budget.
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div 
              key={index}
              ref={(el) => (cardsRef.current[index] = el)}
              className="glass-card p-6 flex flex-col items-center text-center opacity-100"
              style={{ transitionDelay: `${index * 0.1}s` }}
            >
              <div className="h-16 w-16 rounded-2xl bg-primary/10 flex items-center justify-center mb-5 text-primary">
                {feature.icon}
              </div>
              <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
              <p className="text-muted-foreground text-sm">{feature.description}</p>
            </div>
          ))}
        </div>
        
        <div className="mt-16 text-center">
          <button className="button-primary">
            Explore All Features
          </button>
        </div>
      </div>
    </section>
  );
};

export default Features;
