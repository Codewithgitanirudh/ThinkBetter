import DecisionForm from '@/components/DecisionForm';

export default function Home() {
  return (
    <div className="min-h-screen p-6 md:p-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
            Make Better Decisions
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300">
            Use AI-powered insights to analyze your options and make informed choices
          </p>
        </div>
        <DecisionForm />
      </div>
    </div>
  );
}