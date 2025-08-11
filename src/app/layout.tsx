import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { DecisionProvider } from '@/context/DecisionContext';
import Sidebar from '@/components/Sidebar';
import AIAssistant from '@/components/AIAssistant';

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
        <DecisionProvider>
          <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
            <Sidebar />
            <main className="flex-1 overflow-y-auto md:ml-0">
              {children}
            </main>
            <AIAssistant />
          </div>
        </DecisionProvider>
      </body>
    </html>
  );
}
