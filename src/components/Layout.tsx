import React from 'react';
import { AIAssistantButton } from './AIAssistantButton';
import { ProfileSection } from './ProfileSection';
import { useAuth } from '../contexts/AuthContext';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  const { user } = useAuth();

  return (
    <div className="relative min-h-screen">
      <ProfileSection />
      {/* Main Content */}
      <main>
        {children}
      </main>
      
      {/* AI Assistant Button - always visible */}
      <AIAssistantButton />
    </div>
  );
};

export default Layout; 