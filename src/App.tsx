import React, { useEffect } from 'react';
import { Toaster } from "./components/ui/toaster";
import { Toaster as Sonner } from "./components/ui/sonner";
import { TooltipProvider } from "./components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import MealPlanner from "./pages/MealPlanner";
import Dashboard from "./pages/Dashboard";
import Groceries from "./pages/Groceries";
import Pricing from "./pages/Pricing";
import { AuthProvider } from './contexts/AuthContext';
import { SignupPage } from './pages/SignupPage';
import { AnimatePresence } from 'framer-motion';
import { PageTransition } from './components/PageTransition';
import Navbar from './components/Navbar';
import { LoginPage } from './pages/LoginPage';
import { Layout } from './components/Layout';
import Hero from './components/Hero';
import Profile from './pages/Profile';
import ProfileIcon from './components/ProfileIcon';
import AIChatbot from './components/AIChatbot';

const queryClient = new QueryClient();

const App = () => {
  useEffect(() => {
    // Check for saved theme preference or system preference
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, []);

  return (
    <AuthProvider>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <Router>
            <Layout>
              <Navbar />
              <ProfileIcon />
              <AnimatePresence mode="wait">
                <Routes>
                  <Route path="/" element={<Hero />} />
                  <Route 
                    path="/meal-planner" 
                    element={
                      <PageTransition>
                        <MealPlanner />
                      </PageTransition>
                    } 
                  />
                  <Route 
                    path="/dashboard" 
                    element={
                      <PageTransition>
                        <Dashboard />
                      </PageTransition>
                    } 
                  />
                  <Route 
                    path="/groceries" 
                    element={
                      <PageTransition>
                        <Groceries />
                      </PageTransition>
                    } 
                  />
                  <Route 
                    path="/pricing" 
                    element={
                      <PageTransition>
                        <Pricing />
                      </PageTransition>
                    } 
                  />
                  <Route 
                    path="/signup" 
                    element={
                      <PageTransition>
                        <SignupPage />
                      </PageTransition>
                    } 
                  />
                  <Route 
                    path="/login" 
                    element={
                      <PageTransition>
                        <LoginPage />
                      </PageTransition>
                    } 
                  />
                  <Route 
                    path="/profile" 
                    element={
                      <PageTransition>
                        <Profile />
                      </PageTransition>
                    } 
                  />
                  {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </AnimatePresence>
            </Layout>
          </Router>
        </TooltipProvider>
      </QueryClientProvider>
    </AuthProvider>
  );
};

export default App;
