'use client';

import { useAuth } from '@/context/AuthContext';
import { motion } from 'framer-motion';

export default function AuthButtons() {
  const { user, loading, signInWithGoogle, signOutUser } = useAuth();

  if (loading) {
    return (
      <button className="px-4 py-2 rounded-md bg-darkSurface animate-pulse text-text" disabled>
        Loading...
      </button>
    );
  }

  if (!user) {
    return (
      <motion.button
        onClick={signInWithGoogle}
        className="px-4 py-2 rounded-md bg-primary text-darkBg hover:bg-primary/90 transition-colors"
        whileTap={{ scale: 0.98 }}
      >
        Sign in with Google
      </motion.button>
    );
  }

  return (
    <div className="flex items-center space-x-2">
      <span className="text-sm text-text">{user.displayName || user.email}</span>
      <motion.button
        onClick={signOutUser}
        className="px-3 py-1.5 rounded-md bg-darkSurface hover:bg-darkBg transition-colors text-sm text-text"
        whileTap={{ scale: 0.98 }}
      >
        Sign out
      </motion.button>
    </div>
  );
}


