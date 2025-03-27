import React, { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, X, ChevronDown, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import ThemeToggle from '@/components/ThemeToggle';
import LoginModal from '@/components/LoginModal';
import { useAuth } from '../contexts/AuthContext';
import { LogoutConfirmDialog } from './LogoutConfirmDialog';
import { motion } from 'framer-motion';
import { toast } from '@/components/ui/use-toast';

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 10;
      if (isScrolled !== scrolled) {
        setScrolled(isScrolled);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [scrolled]);

  const handleGetStarted = async () => {
    setIsLoading(true);
    // Add a small delay to show the loading state
    await new Promise(resolve => setTimeout(resolve, 800));
    navigate('/meal-planner', { state: { fromNav: true } });
    setIsLoading(false);
    setMobileMenuOpen(false);
  };

  const handleLoginClick = () => {
    setIsLoginModalOpen(true);
    setMobileMenuOpen(false);
  };

  const handleLogout = () => {
    setShowLogoutConfirm(true);
  };

  const confirmLogout = () => {
    try {
      logout(); // Call the logout function from auth context
      setShowLogoutConfirm(false); // Close the dialog
      navigate('/'); // Navigate to home page
      
      // Show success toast if you have toast setup
      toast({
        title: "Logged out successfully",
        description: "Come back soon!",
      });
    } catch (error) {
      // Show error toast if something goes wrong
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to logout. Please try again.",
      });
    }
  };

  const handleDashboardClick = () => {
    navigate('/dashboard'); // This ensures navigation to the dashboard page
    setMobileMenuOpen(false); // Close mobile menu if open
  };

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Meal Planner', path: '/meal-planner' },
    { name: 'Groceries', path: '/groceries' },
    { name: 'Dashboard', path: '/dashboard' },
    { name: 'Pricing', path: '/pricing' },
  ];

  return (
    <>
      <nav 
        className={cn(
          'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
          scrolled 
            ? 'bg-white/80 dark:bg-gray-900/80 backdrop-blur-lg shadow-sm py-3' 
            : 'bg-transparent py-5'
        )}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <Link to="/" className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-violet-500 bg-clip-text text-transparent">
                NutriPlan AI
              </Link>
            </div>
            
            <div className="hidden md:flex space-x-8 items-center">
              {navLinks.map((link) => (
                <Link 
                  key={link.name}
                  to={link.path} 
                  className="text-sm font-medium text-gray-700 dark:text-gray-200 hover:text-primary transition-colors"
                >
                  {link.name}
                </Link>
              ))}
            </div>

            <div className="flex items-center space-x-4">
              <ThemeToggle />
              {user ? (
                <>
                  <div className="hidden sm:flex items-center space-x-2 text-sm">
                    <span className="text-gray-600 dark:text-gray-300">Welcome,</span>
                    <span className="font-medium text-primary">{user.name || 'User'}</span>
                  </div>
                  <Button 
                    variant="outline" 
                    className="hidden sm:flex"
                    onClick={handleLogout}
                  >
                    Logout
                  </Button>
                  <Button 
                    onClick={handleDashboardClick}
                    className="hidden sm:inline-flex items-center justify-center min-w-[120px]"
                  >
                    Dashboard
                  </Button>
                </>
              ) : (
                <>
                  <Button 
                    variant="outline" 
                    className="hidden sm:flex"
                    onClick={handleLoginClick}
                  >
                    Login
                  </Button>
                  <Button 
                    onClick={() => navigate('/signup')} 
                    className="hidden sm:inline-flex items-center justify-center min-w-[120px]"
                  >
                    Get Started
                  </Button>
                </>
              )}
              
              <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon" className="md:hidden">
                    <Menu className="h-6 w-6" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="right" className="w-[80%] sm:w-[350px]">
                  <div className="flex flex-col space-y-4 mt-8">
                    {user && (
                      <div className="flex items-center space-x-2 px-4 py-2 text-sm">
                        <span className="text-gray-600 dark:text-gray-300">Welcome,</span>
                        <span className="font-medium text-primary">{user.name || 'User'}</span>
                      </div>
                    )}
                    {navLinks.map((link) => (
                      <Link
                        key={link.name} 
                        to={link.path}
                        className="text-lg font-medium py-2 hover:text-primary transition-colors"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        {link.name}
                      </Link>
                    ))}
                    <div className="flex items-center space-x-3 pt-4">
                      <ThemeToggle />
                      {user ? (
                        <>
                          <Button 
                            variant="outline" 
                            className="w-full"
                            onClick={handleLogout}
                          >
                            Logout
                          </Button>
                          <Button 
                            onClick={handleDashboardClick}
                            className="w-full inline-flex items-center justify-center"
                          >
                            Dashboard
                          </Button>
                        </>
                      ) : (
                        <>
                          <Button 
                            variant="outline" 
                            className="w-full"
                            onClick={handleLoginClick}
                          >
                            Login
                          </Button>
                          <Button 
                            onClick={() => navigate('/signup')} 
                            className="w-full inline-flex items-center justify-center"
                          >
                            Get Started
                          </Button>
                        </>
                      )}
                    </div>
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>
      </nav>

      <LogoutConfirmDialog 
        isOpen={showLogoutConfirm}
        onClose={() => setShowLogoutConfirm(false)}
        onConfirm={confirmLogout}
      />

      <LoginModal 
        isOpen={isLoginModalOpen} 
        onClose={() => setIsLoginModalOpen(false)} 
      />
    </>
  );
};

export default Navbar;
