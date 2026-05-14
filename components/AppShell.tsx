'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/authContext';
import { SidebarProvider, useSidebar } from '@/lib/sidebarContext';
import { NavLoadingProvider } from '@/lib/navLoadingContext';
import { Tabbar, TabbarLink, ToolbarPane, Preloader } from 'konsta/react';
import Sidebar from './Sidebar';
import NavProgressBar from './NavProgressBar';
import { useNavLoading } from '@/lib/navLoadingContext';

interface AppShellProps {
  children: React.ReactNode;
  showBottomNav?: boolean;
}

const bottomTabs = [
  { label: 'Home',  href: '/dashboard', icon: '🏠' },
  { label: 'Obat',  href: '/obat',      icon: '💊' },
  { label: 'Profil', href: '/profil',   icon: '👤' },
];

function BottomNav() {
  const [pathname, setPathname] = useState('');
  const router = useRouter();
  const { startLoading } = useNavLoading();

  useEffect(() => {
    const sync = () => setPathname(window.location.pathname);
    sync();
    window.addEventListener('popstate', sync);
    return () => window.removeEventListener('popstate', sync);
  }, []);

  return (
    <Tabbar
      labels
      icons
      className="left-0 bottom-0 fixed"
      style={{ zIndex: 100 }}
    >
      <ToolbarPane>
        {bottomTabs.map((tab) => (
          <TabbarLink
            key={tab.href}
            active={pathname === tab.href}
            onClick={() => {
              if (pathname !== tab.href) startLoading();
              router.push(tab.href);
              setPathname(tab.href);
            }}
            icon={
              <span className="text-2xl leading-none block">{tab.icon}</span>
            }
            label={tab.label}
          />
        ))}
      </ToolbarPane>
    </Tabbar>
  );
}

function ShellInner({ children, showBottomNav }: AppShellProps) {
  const { open, closeSidebar } = useSidebar();
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.replace('/login');
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="h-full flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <Preloader className="w-10 h-10" />
          <p className="text-sm text-gray-500 mt-3">Memuat...</p>
        </div>
      </div>
    );
  }

  if (!user) return null;

  return (
    <>
      <Sidebar open={open} onClose={closeSidebar} />
      <div
        className="flex flex-col h-full"
        style={{ paddingBottom: showBottomNav ? 'calc(64px + env(safe-area-inset-bottom))' : 0 }}
      >
        {children}
      </div>
      {showBottomNav && <BottomNav />}
    </>
  );
}

export default function AppShell({ children, showBottomNav = true }: AppShellProps) {
  return (
    <NavLoadingProvider>
      <SidebarProvider>
        <NavProgressBar />
        <ShellInner showBottomNav={showBottomNav}>{children}</ShellInner>
      </SidebarProvider>
    </NavLoadingProvider>
  );
}
