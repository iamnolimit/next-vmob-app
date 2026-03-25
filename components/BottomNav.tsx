'use client';
import { usePathname, useRouter } from 'next/navigation';

const tabs = [
  { label: 'Home', href: '/dashboard', icon: '🏠' },
  { label: 'Obat', href: '/obat', icon: '💊' },
  { label: 'Keuangan', href: '/keuangan', icon: '💰' },
  { label: 'Forecast', href: '/forecast', icon: '📊' },
  { label: 'Customer', href: '/customer', icon: '👥' },
];

export default function BottomNav() {
  const pathname = usePathname();
  const router = useRouter();

  return (
    <div
      className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200"
      style={{ zIndex: 9999, paddingBottom: 'env(safe-area-inset-bottom)' }}
    >
      <div className="flex">
        {tabs.map((tab) => {
          const isActive = pathname === tab.href;
          return (
            <button
              key={tab.href}
              onClick={() => router.push(tab.href)}
              className={`flex-1 flex flex-col items-center justify-center py-2 gap-0.5 transition-colors ${
                isActive ? 'text-blue-600' : 'text-gray-500'
              }`}
            >
              <span className="text-xl leading-none">{tab.icon}</span>
              <span className="text-[10px] font-medium">{tab.label}</span>
              {isActive && (
                <span className="absolute bottom-0 w-6 h-0.5 bg-blue-600 rounded-full" />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
