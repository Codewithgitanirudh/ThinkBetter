
'use client';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';

export default function VerifyEmailPage() {
  const router = useRouter();
  const { user, checkEmailVerification } = useAuth();

  useEffect(() => {
    if (!user) {
      router.push('/login');
      return;
    }

    // Initial check
    checkEmailVerification().then((isVerified: boolean) => {
      if (isVerified) router.push('/app');
    });

    // Set up polling every 5 seconds
    const interval = setInterval(async () => {
      const isVerified = await checkEmailVerification();
      if (isVerified) {
        clearInterval(interval);
        router.push('/app');
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [user, router, checkEmailVerification]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <h1 className="text-2xl font-bold mb-4">Verifying your email...</h1>
        <p>Please wait while we confirm your email address.</p>
      </div>
    </div>
  );
}