
import React, { useEffect, useRef } from 'react';
import { PencilLine, Cpu, CheckCircle } from 'lucide-react';

interface Step {
  number: number;
  title: string;
  description: string;
  icon: React.ReactNode;
}

const HowItWorks = () => {
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
    <section id="how-it-works" className="py-20 bg-gradient-to-b from-transparent via-primary/5 to-transparent">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            How It Works
          </h2>
          <p className="text-lg text-muted-foreground">
            Three simple steps to create your personalized, budget-friendly meal plan
          </p>
        </div>
        
        <div className="relative">
          {/* Connecting line for desktop */}
          <div className="absolute top-1/3 left-0 right-0 h-px bg-primary/20 hidden lg:block"></div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-8 relative z-10">
            {steps.map((step, index) => (
              <div 
                key={index}
                ref={(el) => (stepsRef.current[index] = el)}
                className="opacity-100 transition-all duration-500 ease-out flex flex-col items-center"
                style={{ transitionDelay: `${index * 0.2}s` }}
              >
                <div className="mb-5">
                  <div className="bg-primary/10 text-primary rounded-full px-4 py-1 text-sm font-medium">
                    Step {step.number}
                  </div>
                </div>
                
                <div className="mb-6 h-24 w-24 rounded-full bg-white dark:bg-primary/5 border border-primary/20 shadow-lg flex items-center justify-center text-primary">
                  {step.icon}
                </div>
                
                <div className="text-center max-w-xs">
                  <h3 className="text-xl font-semibold mb-3">{step.title}</h3>
                  <p className="text-muted-foreground">{step.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        <div className="mt-16 text-center">
          <button className="button-primary">
            Get Started Now
          </button>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
