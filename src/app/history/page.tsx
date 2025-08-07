import HistoryList from '@/components/HistoryList';
import ThemeToggle from '@/components/ThemeToggle';
import Link from 'next/link';

export default function HistoryPage() {
  return (
    <main className="min-h-screen py-8 px-4 bg-gray-50 dark:bg-gray-900 dark:text-white">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Decision History</h1>
          <Link href="/" className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
            New Decision
          </Link>
        </div>
        <HistoryList />
      </div>
      <ThemeToggle />
    </main>
  );
}