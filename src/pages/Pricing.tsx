
import React from 'react';
import { motion } from 'framer-motion';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Check } from 'lucide-react';
import { cn } from '@/lib/utils';
import AIAssistant from '@/components/AIAssistant';
import { toast } from '@/hooks/use-toast';

const Pricing = () => {
  const plans = [
    {
      name: 'Free',
      description: 'Basic meal planning and nutrition tracking',
      price: '₹0',
      duration: 'forever',
      features: [
        'Basic meal plan generation',
        'Simple nutrition tracking',
        'Standard grocery list',
        'Limited AI chat assistance',
      ],
      limitations: [
        'No premium recipes',
        'No cost optimization',
        'No advanced analytics',
      ],
      buttonText: 'Start Free',
      popular: false,
    },
    {
      name: 'Premium',
      description: 'Advanced AI nutrition planning and optimization',
      price: '₹499',
      duration: 'per month',
      features: [
        'Advanced AI meal plans',
        'Budget optimization',
        'Real-time pricing integration',
        'Priority AI assistance',
        'Unlimited recipe customization',
        'Advanced nutrition analytics',
        'Grocery delivery integration',
        'Health condition specialization',
      ],
      limitations: [],
      buttonText: 'Go Premium',
      popular: true,
    },
    {
      name: 'Family',
      description: 'Family-focused meal planning for up to 6 people',
      price: '₹899',
      duration: 'per month',
      features: [
        'Everything in Premium',
        'Multi-person meal planning',
        'Family nutrition analytics',
        'Customized plans for each member',
        'Children & elderly nutrition focus',
        'Advanced dietary restriction handling',
        'Family budget optimization',
      ],
      limitations: [],
      buttonText: 'Choose Family',
      popular: false,
    },
  ];

  const handleSelectPlan = (planName) => {
    toast({
      title: `${planName} Plan Selected`,
      description: "This is a demo. In production, this would redirect to payment.",
    });
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.5, ease: "easeOut" }
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="pt-24 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h1 className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-indigo-600 to-violet-500 bg-clip-text text-transparent">
              Choose Your Plan
            </h1>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Select the perfect plan to match your nutrition goals and budget needs. 
              Upgrade anytime to unlock more powerful AI features.
            </p>
          </div>
          
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
          >
            {plans.map((plan, index) => (
              <motion.div 
                key={plan.name}
                variants={itemVariants}
                className={cn(
                  "relative",
                  plan.popular && "transform md:-translate-y-4"
                )}
              >
                <Card className={cn(
                  "h-full overflow-hidden transition-all duration-300 hover:shadow-lg",
                  plan.popular ? "border-primary" : ""
                )}>
                  {plan.popular && (
                    <div className="absolute top-0 right-0 bg-primary text-primary-foreground text-xs font-bold px-3 py-1 rounded-bl-lg">
                      MOST POPULAR
                    </div>
                  )}
                  <CardHeader className={cn(
                    "pb-4",
                    plan.popular ? "bg-primary/5" : ""
                  )}>
                    <CardTitle>{plan.name}</CardTitle>
                    <CardDescription>{plan.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="pb-4">
                    <div className="mb-6">
                      <p className="text-3xl font-bold">{plan.price}</p>
                      <p className="text-sm text-muted-foreground">{plan.duration}</p>
                    </div>
                    
                    <div className="space-y-4">
                      <p className="font-medium text-sm">Plan includes:</p>
                      <ul className="space-y-2">
                        {plan.features.map((feature, i) => (
                          <li key={i} className="flex items-start">
                            <Check className="h-4 w-4 text-green-500 mr-2 mt-0.5 shrink-0" />
                            <span className="text-sm">{feature}</span>
                          </li>
                        ))}
                      </ul>
                      
                      {plan.limitations.length > 0 && (
                        <>
                          <p className="font-medium text-sm pt-2">Limitations:</p>
                          <ul className="space-y-2">
                            {plan.limitations.map((limitation, i) => (
                              <li key={i} className="flex items-start">
                                <span className="text-muted-foreground text-sm">{limitation}</span>
                              </li>
                            ))}
                          </ul>
                        </>
                      )}
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button 
                      className={cn(
                        "w-full",
                        plan.popular ? "" : "bg-muted-foreground/80 hover:bg-muted-foreground"
                      )}
                      onClick={() => handleSelectPlan(plan.name)}
                    >
                      {plan.buttonText}
                    </Button>
                  </CardFooter>
                </Card>
              </motion.div>
            ))}
          </motion.div>
          
          <div className="mt-16 text-center">
            <h2 className="text-2xl font-bold mb-6">Frequently Asked Questions</h2>
            <div className="max-w-3xl mx-auto grid gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">What payment methods do you accept?</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    We accept all major credit cards, UPI, and select mobile wallets including PayTM and PhonePe.
                  </p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Can I cancel my subscription anytime?</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Yes, you can cancel your subscription at any time. Your benefits will continue until the end of your billing period.
                  </p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Are there any long-term commitments?</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    No long-term commitments. All our plans are month-to-month, though we do offer discounts for annual subscriptions.
                  </p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">What's the difference between the plans?</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    The Free plan offers basic meal planning, while Premium adds advanced AI features, cost optimization, and comprehensive nutrition tracking. Family plan extends these benefits to multiple users.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
      
      <AIAssistant />
      <Footer />
    </div>
  );
};

export default Pricing;
