'use client';
export const dynamic = 'force-dynamic';

import { useReducer, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createUserWithEmailAndPassword, sendEmailVerification } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import Link from 'next/link';

import AuthButtons from '@/components/AuthButtons';

type FormState = {
  email: string;
  password: string;
  confirmPassword: string;
  showPassword: boolean;
  showConfirmPassword: boolean;
};

type FormAction = 
  | { type: 'SET_EMAIL'; payload: string }
  | { type: 'SET_PASSWORD'; payload: string }
  | { type: 'SET_CONFIRM_PASSWORD'; payload: string }
  | { type: 'TOGGLE_PASSWORD_VISIBILITY' }
  | { type: 'TOGGLE_CONFIRM_PASSWORD_VISIBILITY' };

const formReducer = (state: FormState, action: FormAction): FormState => {
  switch (action.type) {
    case 'SET_EMAIL':
      return { ...state, email: action.payload };
    case 'SET_PASSWORD':
      return { ...state, password: action.payload };
    case 'SET_CONFIRM_PASSWORD':
      return { ...state, confirmPassword: action.payload };
    case 'TOGGLE_PASSWORD_VISIBILITY':
      return { ...state, showPassword: !state.showPassword };
    case 'TOGGLE_CONFIRM_PASSWORD_VISIBILITY':
      return { ...state, showConfirmPassword: !state.showConfirmPassword };
    default:
      return state;
  }
};

const PasswordVisibilityIcon = ({ visible }: { visible: boolean }) => (
  visible ? (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/>
      <circle cx="12" cy="12" r="3"/>
    </svg>
  ) : (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/>
      <line x1="1" y1="1" x2="23" y2="23"/>
    </svg>
  )
);

export default function SignupPage() {
  const [formState, dispatch] = useReducer(formReducer, {
    email: '',
    password: '',
    confirmPassword: '',
    showPassword: false,
    showConfirmPassword: false,
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formState.password !== formState.confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    
    setLoading(true);
    setError('');
    
    try {
      const result = await createUserWithEmailAndPassword(auth, formState.email, formState.password);
      await sendEmailVerification(result.user);
      router.push('/verify-email?status=pending');
    } catch (err) {
      setError('Error creating account. Please try again.');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 p-4">
      <div className="w-full max-w-md space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900 dark:text-white">
            Create a new account
          </h2>
        </div>
        
        {error && (
          <div className="bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-300 p-4 rounded-md">
            {error}
          </div>
        )}
        
        <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-8 space-y-6">
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Email address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={formState.email}
                onChange={(e) => dispatch({ type: 'SET_EMAIL', payload: e.target.value })}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
              />
            </div>

            <div className="relative">
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Password
              </label>
              <input
                id="password"
                name="password"
                type={formState.showPassword ? 'text' : 'password'}
                autoComplete="new-password"
                required
                value={formState.password}
                onChange={(e) => dispatch({ type: 'SET_PASSWORD', payload: e.target.value })}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
              />
              <button
                type="button"
                className="absolute right-3 top-8 text-gray-400 hover:text-gray-500"
                onClick={() => dispatch({ type: 'TOGGLE_PASSWORD_VISIBILITY' })}
              > 
                <PasswordVisibilityIcon visible={formState.showPassword} />
              </button>
            </div>

            <div className="relative">
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Confirm Password
              </label>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type={formState.showConfirmPassword ? 'text' : 'password'}
                autoComplete="new-password"
                required
                value={formState.confirmPassword}
                onChange={(e) => dispatch({ type: 'SET_CONFIRM_PASSWORD', payload: e.target.value })}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
              />
              <button
                type="button"
                className="absolute right-3 top-8 text-gray-400 hover:text-gray-500"
                onClick={() => dispatch({ type: 'TOGGLE_CONFIRM_PASSWORD_VISIBILITY' })}
              >
                <PasswordVisibilityIcon visible={formState.showConfirmPassword} />
              </button>
            </div>

            <div>
              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
              >
                {loading ? 'Creating account...' : 'Sign up'}
              </button>
            </div>
          </form>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300 dark:border-gray-600" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400">
                Or sign up with
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-3">
            <AuthButtons />
          </div>
        </div>

        <div className="text-center text-sm">
          <span className="text-gray-600 dark:text-gray-400">Already have an account? </span>
          <Link href="/login" className="font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300">
            Sign in
          </Link>
        </div>
      </div>
    </div>
  );
}
