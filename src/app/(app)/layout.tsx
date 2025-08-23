import Sidebar from '@/components/Sidebar';
import AuthButtons from '@/components/AuthButtons';
import MobileHeader from '@/components/MobileHeader';
export const dynamic = 'force-dynamic';

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen bg-bgColor text-text flex-col md:flex-row">
      <MobileHeader />
      <Sidebar />
      <main className="flex-1 ml-0 h-screen">
        {children}
      </main>
    </div>
  );
}