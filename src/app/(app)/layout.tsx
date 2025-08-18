import Sidebar from '@/components/Sidebar';
import AuthButtons from '@/components/AuthButtons';
import AIAssistant from '@/components/AIAssistant';
export const dynamic = 'force-dynamic';

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen bg-darkBg text-text">
      <Sidebar />
      <main className="flex-1 overflow-y-auto md:ml-0">
        {children}
      </main>
      <div className="fixed top-6 right-24 z-50">
        {/* <AuthButtons /> */}
      </div>
      <AIAssistant />
    </div>
  );
}