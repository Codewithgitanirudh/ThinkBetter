import DecisionForm from '@/components/DecisionForm';
import ThemeToggle from '@/components/ThemeToggle';

export default function Home() {
  return (
    <main className="min-h-screen py-8 px-4 bg-gray-50 dark:bg-gray-900 dark:text-white">
      <DecisionForm />
      <ThemeToggle />
    </main>
  );
}