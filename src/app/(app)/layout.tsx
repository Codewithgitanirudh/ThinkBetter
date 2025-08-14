import Sidebar from '@/components/Sidebar';
import AuthButtons from '@/components/AuthButtons';
import ThemeToggle from '@/components/ThemeToggle';
import AIAssistant from '@/components/AIAssistant';

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen bg-bg text-text">
      <Sidebar />
      <main className="flex-1 overflow-y-auto md:ml-0">
        {children}
      </main>
      <div className="fixed top-6 right-24 z-50">
        <AuthButtons />
      </div>
      <ThemeToggle />
      <AIAssistant />
    </div>
  );
}