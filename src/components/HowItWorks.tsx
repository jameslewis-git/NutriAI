import React, { useEffect, useRef, useState } from 'react';
import { PencilLine, Cpu, CheckCircle, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface Step {
  number: number;
  title: string;
  description: string;
  icon: React.ReactNode;
}

const HowItWorks = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const steps: Step[] = [
    {
      number: 1,
      title: 'Input Your Preferences',
      description: 'Tell us about your dietary preferences, health goals, and budget constraints.',
      icon: <PencilLine className="h-6 w-6" />
    },
    {
      number: 2,
      title: 'AI Analysis',
      description: 'Our AI analyzes thousands of recipes to find the perfect match for your needs and budget.',
      icon: <Cpu className="h-6 w-6" />
    },
    {
      number: 3,
      title: 'Get Your Plan',
      description: 'Receive a personalized meal plan with recipes, grocery lists, and nutritional information.',
      icon: <CheckCircle className="h-6 w-6" />
    }
  ];

  const sectionRef = useRef<HTMLDivElement>(null);
  const stepsRef = useRef<(HTMLDivElement | null)[]>([]);

  const handleGetStarted = async () => {
    setIsLoading(true);
    // Add a small delay to show the loading state
    await new Promise(resolve => setTimeout(resolve, 800));
    navigate('/meal-planner', { state: { fromHowItWorks: true } });
  };

  useEffect(() => {
    // Add initial classes to make steps visible even without animation
    stepsRef.current.forEach((step) => {
      if (step) {
        step.classList.add('opacity-100');
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

    if (stepsRef.current) {
      stepsRef.current.forEach((step) => {
        if (step) observer.observe(step);
      });
    }

    return () => {
      if (stepsRef.current) {
        stepsRef.current.forEach((step) => {
          if (step) observer.unobserve(step);
        });
      }
    };
  }, []);

  return (
    <section className="py-20 bg-gray-50" ref={sectionRef}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            How It Works
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Get started with NutriAI in three simple steps
          </p>
        </div>

        <div className="mt-16 grid gap-8 md:grid-cols-3">
          {steps.map((step, index) => (
            <div
              key={step.number}
              ref={el => stepsRef.current[index] = el}
              className="relative p-6 bg-white rounded-xl shadow-sm opacity-0 transition-opacity duration-500"
              style={{ transitionDelay: `${index * 200}ms` }}
            >
              <div className="flex items-center justify-center w-12 h-12 bg-primary/10 text-primary rounded-lg mb-4">
                {step.icon}
              </div>
              <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
              <p className="text-gray-600">{step.description}</p>
            </div>
          ))}
        </div>

        <div className="mt-16 text-center">
          <button 
            onClick={handleGetStarted}
            disabled={isLoading}
            className="button-primary hover:scale-105 transform transition-all duration-200 disabled:opacity-70 disabled:cursor-not-allowed inline-flex items-center justify-center min-w-[200px]"
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Getting Started...
              </>
            ) : (
              'Get Started Now'
            )}
          </button>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
