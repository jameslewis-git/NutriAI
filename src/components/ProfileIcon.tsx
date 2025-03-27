import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';

const ProfileIcon = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  // Don't render anything if there's no user
  if (!user) return null;

  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={() => navigate('/profile')}
      className="fixed top-20 right-4 z-50 flex items-center gap-3 bg-white rounded-full pl-3 pr-4 py-2 shadow-lg border border-gray-100 hover:shadow-xl transition-shadow"
    >
      <div className="w-8 h-8 rounded-full bg-gradient-to-r from-primary to-violet-500 flex items-center justify-center text-white font-semibold">
        {user.name.charAt(0)}
      </div>
      <div className="flex flex-col items-start">
        <span className="text-sm font-medium line-clamp-1">
          {user.name}
        </span>
        <span className="text-xs text-gray-500">View Profile</span>
      </div>
    </motion.button>
  );
};

export default ProfileIcon; 