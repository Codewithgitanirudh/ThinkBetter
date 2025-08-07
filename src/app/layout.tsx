import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { DecisionProvider } from '@/context/DecisionContext';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Decision Helper App',
  description: 'An app to help you make better decisions',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <DecisionProvider>
          {children}
        </DecisionProvider>
      </body>
    </html>
  );
}
