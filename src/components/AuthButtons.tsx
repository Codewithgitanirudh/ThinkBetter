'use client';

import { useAuth } from '@/context/AuthContext';
import { motion } from 'framer-motion';

export default function AuthButtons() {
  const { user, loading, signInWithGoogle, signOutUser } = useAuth();

  if (loading) {
    return (
      <button className="px-4 py-2 rounded-md bg-gray-200 dark:bg-gray-700 animate-pulse" disabled>
        Loading...
      </button>
    );
  }

  if (!user) {
    return (
      <motion.button
        onClick={signInWithGoogle}
        className="px-4 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700"
        whileTap={{ scale: 0.98 }}
      >
        Sign in with Google
      </motion.button>
    );
  }

  return (
    <div className="flex items-center space-x-2">
      <span className="text-sm text-gray-700 dark:text-gray-300">{user.displayName || user.email}</span>
      <motion.button
        onClick={signOutUser}
        className="px-3 py-1.5 rounded-md bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-sm"
        whileTap={{ scale: 0.98 }}
      >
        Sign out
      </motion.button>
    </div>
  );
}


