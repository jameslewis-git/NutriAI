import React from 'react';
import { useForm } from 'react-hook-form';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { useNavigate } from 'react-router-dom';

export interface UserInfoFormValues {
  name: string;
  age: number;
  budget: number;
}

interface UserInfoFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: UserInfoFormValues) => void;
}

export function UserInfoForm({ isOpen, onClose, onSubmit }: UserInfoFormProps) {
  const navigate = useNavigate();
  const form = useForm<UserInfoFormValues>({
    defaultValues: {
      name: '',
      age: 25,
      budget: 4000
    }
  });

  const handleSignIn = () => {
    onClose();
    setTimeout(() => {
      navigate('/login');
    }, 100);
  };

  return (
    <Dialog open={isOpen} onOpenChange={() => {}} modal={true}>
      <DialogContent className="sm:max-w-[425px]" onPointerDownOutside={(e) => e.preventDefault()}>
        <DialogHeader>
          <DialogTitle>Create Your Meal Plan</DialogTitle>
          <DialogDescription>
            Enter your details to get a personalized meal plan
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 mt-4">
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              {...form.register("name", {
                required: "Name is required"
              })}
              placeholder="Enter your name"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="age">Age</Label>
            <Input
              id="age"
              type="number"
              {...form.register("age", {
                required: "Age is required",
                min: { value: 18, message: "Must be at least 18" },
                max: { value: 100, message: "Must be under 100" }
              })}
              placeholder="Enter your age"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="budget">Weekly Budget (₹)</Label>
            <Input
              id="budget"
              type="number"
              {...form.register("budget", {
                required: "Budget is required",
                min: { value: 200, message: "Minimum budget is ₹200" }
              })}
              placeholder="Enter your weekly budget"
            />
            <p className="text-xs text-gray-500">Minimum budget: ₹200/week</p>
          </div>

          <div className="flex flex-col gap-4 mt-6">
            <Button type="submit" className="w-full">
              Generate Plan
            </Button>
            
            <div className="text-center text-sm text-gray-500">
              Already have an account?{' '}
              <Button
                variant="link"
                className="p-0 h-auto font-semibold text-primary hover:text-primary/90"
                onClick={handleSignIn}
              >
                Sign in
              </Button>
            </div>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
} 