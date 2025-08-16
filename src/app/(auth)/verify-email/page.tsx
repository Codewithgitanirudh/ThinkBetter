
'use client';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { applyActionCode } from 'firebase/auth';
import { auth } from '@/lib/firebase';

export default function VerifyEmailPage({
  searchParams,
}: {
  searchParams: { oobCode?: string };
}) {
  const router = useRouter();
  const { user } = useAuth();

  useEffect(() => {
    if (searchParams.oobCode) {
      // Apply the verification code
      applyActionCode(auth, searchParams.oobCode)
        .then(() => {
          // Redirect to app after successful verification
          router.push('/app');
        })
        .catch((error) => {
          console.error('Error verifying email:', error);
          router.push('/login?error=invalid_verification');
        });
    } else if (user?.emailVerified) {
      // Skip if already verified
      router.push('/app');
    } else {
      // No code provided
      router.push('/login?error=missing_verification');
    }
  }, [searchParams.oobCode, user, router]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <h1 className="text-2xl font-bold mb-4">Verifying your email...</h1>
        <p>Please wait while we confirm your email address.</p>
      </div>
    </div>
  );
}