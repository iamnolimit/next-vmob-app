'use client';
import { usePathname, useRouter } from 'next/navigation';
import { LayoutDashboard, LineChart, CircleDollarSign, Stethoscope, UsersRound } from 'lucide-react';

const tabs = [
  { label: 'Home', href: '/dashboard', icon: LayoutDashboard },
  { label: 'Forecast', href: '/forecast', icon: LineChart },
  { label: 'Keuangan', href: '/keuangan', icon: CircleDollarSign },
  { label: 'Obat', href: '/obat', icon: Stethoscope },
  { label: 'Customer', href: '/customer', icon: UsersRound },
];

export default function BottomNav() {
  const pathname = usePathname();
  const router = useRouter();

  return (
    <div
      className="fixed bottom-0 left-0 right-0 glass-panel border-t border-gray-200/50"
      style={{ zIndex: 9999, paddingBottom: 'env(safe-area-inset-bottom)' }}
    >
      <div className="flex px-2 pt-2 pb-1">
        {tabs.map((tab) => {
          const isActive = pathname === tab.href;
          const Icon = tab.icon;
          return (
            <button
              key={tab.href}
              onClick={() => router.push(tab.href)}
              className={`flex-1 flex flex-col items-center justify-center py-1 gap-1 transition-all duration-300 ${
                isActive ? 'text-[#0362fc] scale-105' : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <span className={`transition-transform duration-300 ${isActive ? '-translate-y-1' : ''}`}>
                <Icon size={22} strokeWidth={isActive ? 2.5 : 2} />
              </span>
              <span className={`text-[10px] font-medium transition-opacity duration-300 ${isActive ? 'opacity-100' : 'opacity-70'}`}>{tab.label}</span>
              {isActive && (
                <span className="absolute bottom-0 w-8 h-1 bg-[#0362fc] rounded-t-full" />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
