import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Loader2 } from 'lucide-react';

interface MealPlanFormProps {
  onSubmit: (formData: any) => void;
  isLoading: boolean;
}

const MealPlanForm: React.FC<MealPlanFormProps> = ({ onSubmit, isLoading }) => {
  const [budget, setBudget] = useState(500);
  const [dietType, setDietType] = useState('balanced');
  const [healthGoal, setHealthGoal] = useState('maintain');
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ budget, dietType, healthGoal });
  };

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>Customize Your Meal Plan</CardTitle>
        <CardDescription>
          Provide your preferences to generate a personalized meal plan
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="budget" className="font-medium">
              Daily Budget: ₹{budget}
            </Label>
            <Slider
              id="budget"
              min={200}
              max={2000}
              step={50}
              value={[budget]}
              onValueChange={(value) => setBudget(value[0])}
              className="py-4"
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>Budget</span>
              <span>Premium</span>
            </div>
          </div>

          <div className="space-y-3">
            <Label className="font-medium">Diet Type</Label>
            <RadioGroup value={dietType} onValueChange={setDietType} className="grid grid-cols-2 gap-2">
              <div>
                <RadioGroupItem value="balanced" id="balanced" className="peer sr-only" />
                <Label
                  htmlFor="balanced"
                  className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                >
                  <span>Balanced</span>
                </Label>
              </div>
              <div>
                <RadioGroupItem value="vegan" id="vegan" className="peer sr-only" />
                <Label
                  htmlFor="vegan"
                  className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                >
                  <span>Vegan</span>
                </Label>
              </div>
              <div>
                <RadioGroupItem value="keto" id="keto" className="peer sr-only" />
                <Label
                  htmlFor="keto"
                  className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                >
                  <span>Keto</span>
                </Label>
              </div>
              <div>
                <RadioGroupItem value="paleo" id="paleo" className="peer sr-only" />
                <Label
                  htmlFor="paleo"
                  className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                >
                  <span>Paleo</span>
                </Label>
              </div>
            </RadioGroup>
          </div>

          <div className="space-y-3">
            <Label className="font-medium">Health Goal</Label>
            <RadioGroup value={healthGoal} onValueChange={setHealthGoal} className="grid grid-cols-1 gap-2">
              <div>
                <RadioGroupItem value="lose" id="lose" className="peer sr-only" />
                <Label
                  htmlFor="lose"
                  className="flex items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                >
                  <span>Weight Loss</span>
                </Label>
              </div>
              <div>
                <RadioGroupItem value="maintain" id="maintain" className="peer sr-only" />
                <Label
                  htmlFor="maintain"
                  className="flex items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                >
                  <span>Maintain Weight</span>
                </Label>
              </div>
              <div>
                <RadioGroupItem value="gain" id="gain" className="peer sr-only" />
                <Label
                  htmlFor="gain"
                  className="flex items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                >
                  <span>Muscle Gain</span>
                </Label>
              </div>
            </RadioGroup>
          </div>

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Generating...
              </>
            ) : (
              'Generate Meal Plan'
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default MealPlanForm;
