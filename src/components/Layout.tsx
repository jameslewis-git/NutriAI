import React from 'react';
import { AIAssistantButton } from './AIAssistantButton';
import { ProfileSection } from './ProfileSection';
import { useAuth } from '../contexts/AuthContext';

export const Layout = ({ children }: { children: React.ReactNode }) => {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Your existing header/navigation here */}
      
      {/* Main content */}
      <main className="flex-1">
        {children}
      </main>
      
      {/* Footer if you have one */}
      
      {/* AI Assistant Button - always visible */}
      <AIAssistantButton />
      
      {/* ProfileSection if needed */}
      {user && <ProfileSection />}
    </div>
  );
};

export default Layout; 