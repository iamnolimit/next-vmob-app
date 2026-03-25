import AppShell from '@/components/AppShell';

export default function LaporanLayout({ children }: { children: React.ReactNode }) {
  return (
    <AppShell showBottomNav={false}>
      <div className="flex flex-col h-full overflow-hidden bg-gray-50">
        {children}
      </div>
    </AppShell>
  );
}
