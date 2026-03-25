import AppShell from '@/components/AppShell';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <AppShell showBottomNav>
      {/* flex-col + overflow-hidden agar navbar fix di atas, konten scroll di bawah */}
      <main className="flex-1 flex flex-col overflow-hidden bg-gray-50">
        {children}
      </main>
    </AppShell>
  );
}
