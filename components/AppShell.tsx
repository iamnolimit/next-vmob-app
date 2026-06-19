'use client';
import { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '@/lib/authContext';
import { SidebarProvider, useSidebar } from '@/lib/sidebarContext';
import { NavLoadingProvider } from '@/lib/navLoadingContext';
import Sidebar from './Sidebar';
import NavProgressBar from './NavProgressBar';
import { useNavLoading } from '@/lib/navLoadingContext';
import { LayoutDashboard, LineChart, CircleDollarSign, Stethoscope, UsersRound } from 'lucide-react';

interface AppShellProps {
  children: React.ReactNode;
  showBottomNav?: boolean;
}

const bottomTabs = [
  { label: 'Home',  href: '/dashboard', icon: <LayoutDashboard size={22} /> },
  { label: 'Forecast', href: '/forecast', icon: <LineChart size={22} /> },
  { label: 'Keuangan', href: '/keuangan', icon: <CircleDollarSign size={22} /> },
  { label: 'Obat',  href: '/obat',      icon: <Stethoscope size={22} /> },
  { label: 'Customer', href: '/customer', icon: <UsersRound size={22} /> },
];

function BottomNav() {
  const rawPathname = usePathname();
  const pathname = rawPathname?.replace(/\/$/, '') || '/';
  const router = useRouter();
  const { startLoading } = useNavLoading();

  return (
    <>
      {/* Gradient blur background for bottom area */}
      <div className="fixed bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-white/90 via-white/60 to-transparent backdrop-blur-[2px] pointer-events-none z-[90]" />
      
      <div className="fixed z-[100] left-1/2 -translate-x-1/2 bottom-[calc(1.5rem+env(safe-area-inset-bottom))] w-[90%] max-w-md bg-white/80 backdrop-blur-xl border border-gray-100/50 rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.08)] px-2 py-2">
        <div className="flex items-center justify-between">
          {bottomTabs.map((tab) => {
          const isActive =
            pathname === tab.href ||
            (tab.href === '/dashboard' && (pathname === '' || pathname === '/'));
          return (
            <button
              key={tab.href}
              onClick={() => {
                if (!isActive) startLoading();
                router.push(tab.href);
              }}
              className="flex flex-col items-center justify-center flex-1 h-14"
            >
              <div className={`flex flex-col items-center justify-center w-full max-w-[5rem] h-full rounded-full transition-all duration-300 ${
                isActive ? 'bg-[#035afc]/10 text-[#035afc]' : 'bg-transparent text-gray-500'
              }`}>
                <span
                  className={`mb-1 transition-all duration-300 flex justify-center ${
                    isActive ? 'scale-110' : 'scale-100 opacity-70'
                  }`}
                >
                  {tab.icon}
                </span>
                <span
                  className={`text-[10px] font-bold tracking-wide transition-colors duration-300 ${
                    isActive ? 'text-[#035afc]' : 'text-gray-500'
                  }`}
                >
                  {tab.label}
                </span>
              </div>
            </button>
          );
        })}
        </div>
      </div>
    </>
  );
}

function ShellInner({ children, showBottomNav }: AppShellProps) {
  const { open, closeSidebar } = useSidebar();
  const { user, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!loading && !user && pathname !== '/login') {
      router.replace('/login');
    }
  }, [user, loading, router, pathname]);

  if (loading) {
    return (
      <div className="h-full flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="w-10 h-10 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto"></div>
          <p className="text-sm text-gray-500 mt-3">Memuat...</p>
        </div>
      </div>
    );
  }

  if (!user && pathname !== '/login') return null;

  const isLoginPage = pathname === '/login';

  return (
    <>
      {!isLoginPage && <Sidebar open={open} onClose={closeSidebar} />}
      <div className={`flex flex-col h-full ${showBottomNav && user && !isLoginPage ? 'pb-24' : ''}`}>
        {children}
      </div>
      {showBottomNav && user && !isLoginPage && <BottomNav />}
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
