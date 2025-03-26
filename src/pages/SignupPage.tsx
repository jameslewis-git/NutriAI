import React from 'react';
import { SignupForm } from '../components/SignupForm';

export function SignupPage() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12 bg-gray-50 dark:bg-gray-900">
      <SignupForm />
    </div>
  );
} 