// src/app/layout.tsx
import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { DecisionProvider } from '@/context/DecisionContext';
import { AuthProvider } from '@/context/AuthContext';
import { SpeedInsights } from "@vercel/speed-insights/next"
import ThemeToggle from '@/components/ThemeToggle';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'ThinkBetter - AI Decision Helper',
  description: 'An intelligent app to help you make better decisions with AI insights',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider>
          <DecisionProvider>
          <ThemeToggle />
            {children}
          </DecisionProvider>
        </AuthProvider>
        <SpeedInsights />
      </body>
    </html>
  );
}