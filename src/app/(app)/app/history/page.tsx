import HistoryList from '@/components/HistoryList';
import Link from 'next/link';

export default function HistoryPage() {
  return (
    <main className="min-h-screen py-8 px-4 !bg-slate-900 z-10">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between gap-2 items-center mb-8 p-4 rounded-lg">
          <h1 className="text-[26px] md:text-3xl font-bold">Decision History</h1>
          <Link href="/app" className="px-4 py-2 md:text-base bg-blue-600 text-white rounded-md hover:bg-blue-700">
            New Decision
          </Link>
        </div>
        <HistoryList />
      </div>
    </main>
  );
}