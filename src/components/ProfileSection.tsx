import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  LogOut, 
  Bell,
  CreditCard,
  Calendar,
  ChevronDown,
  Settings,
  ChevronRight
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

export const ProfileSection = () => {
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const menu = document.getElementById('profile-menu');
      const trigger = document.getElementById('profile-trigger');
      if (menu && !menu.contains(event.target as Node) && 
          trigger && !trigger.contains(event.target as Node)) {
        setShowProfileMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleProfileClick = () => {
    navigate('/profile');
    setShowProfileMenu(false);
  };

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const menuItems = [
    {
      icon: <Settings className="w-4 h-4" />,
      label: 'Settings',
      onClick: handleProfileClick
    },
    {
      icon: <Calendar className="w-4 h-4" />,
      label: 'Meal Plans',
      onClick: () => navigate('/meal-planner')
    },
    {
      icon: <Bell className="w-4 h-4" />,
      label: 'Notifications',
      onClick: () => navigate('/notifications')
    },
    {
      icon: <CreditCard className="w-4 h-4" />,
      label: 'Billing',
      onClick: () => navigate('/billing')
    }
  ];

  return (
    <>
      {/* Profile Menu */}
      <AnimatePresence>
        {showProfileMenu && (
          <motion.div
            id="profile-menu"
            initial={{ opacity: 0, y: 8, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.98 }}
            transition={{ duration: 0.15, ease: "easeOut" }}
            className="absolute right-0 top-full mt-2 w-64 bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden z-50"
          >
            {/* User Info */}
            <div className="p-4 bg-gradient-to-br from-primary/90 to-violet-500/90">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center">
                  <span className="text-white text-lg font-semibold">
                    {user?.name ? user.name[0].toUpperCase() : 'U'}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-white font-medium truncate">{user?.name || 'User'}</h3>
                  <p className="text-white/80 text-sm truncate">{user?.email || 'guest@example.com'}</p>
                </div>
              </div>
              {user?.weeklyBudget && (
                <div className="mt-3 px-3 py-1.5 rounded-lg bg-white/10 inline-block">
                  <p className="text-white/90 text-sm">
                    Budget: ₹{user.weeklyBudget}/week
                  </p>
                </div>
              )}
            </div>

            {/* Menu Items */}
            <div className="p-2">
              {menuItems.map((item, index) => (
                <button
                  key={index}
                  onClick={item.onClick}
                  className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <span className="text-gray-500">{item.icon}</span>
                  <span className="flex-1 text-left text-sm text-gray-700">{item.label}</span>
                  <ChevronRight className="w-4 h-4 text-gray-400" />
                </button>
              ))}

              {/* Logout Button */}
              <div className="px-2 pt-2 mt-1 border-t border-gray-100">
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-red-50 text-red-600 transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  <span className="flex-1 text-left text-sm">Logout</span>
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

// Add this new component for the welcome text that triggers the profile menu
export const WelcomeText = ({ onProfileClick }: { onProfileClick: () => void }) => {
  return (
    <button
      id="profile-trigger"
      onClick={onProfileClick}
      className="inline-block"
    >
      <div className="px-6 py-3 rounded-full bg-white/80 border border-primary/20 backdrop-blur-sm shadow-xl">
        <span className="text-primary font-medium text-lg flex items-center gap-2">
          <span className="animate-wave">👋</span>
          Welcome back, <span className="font-bold text-primary hover:underline">James Lewis</span>!
        </span>
      </div>
    </button>
  );
}; 