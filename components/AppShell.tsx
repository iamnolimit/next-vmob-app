'use client';
import { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
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
  { label: 'Forecast', href: '/forecast', icon: '📈' },
  { label: 'Keuangan', href: '/keuangan', icon: '💰' },
  { label: 'Obat',  href: '/obat',      icon: '💊' },
  { label: 'Customer', href: '/customer', icon: '👥' },
];

function BottomNav() {
  const rawPathname = usePathname();
  const pathname = rawPathname?.replace(/\/$/, '') || '/';
  const router = useRouter();
  const { startLoading } = useNavLoading();

  return (
    <Tabbar
      labels
      icons
      className="left-0 bottom-0 fixed"
      style={{ zIndex: 100 }}
    >
      <ToolbarPane>
        {bottomTabs.map((tab) => {
          const isActive =
            pathname === tab.href ||
            (tab.href === '/dashboard' && (pathname === '' || pathname === '/'));
          return (
            <TabbarLink
              key={tab.href}
              active={isActive}
              onClick={() => {
                if (!isActive) startLoading();
                router.push(tab.href);
              }}
              icon={<span className="text-2xl leading-none block">{tab.icon}</span>}
              label={tab.label}
            />
          );
        })}
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
