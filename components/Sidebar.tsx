'use client';
import { useRouter, usePathname } from 'next/navigation';
import { Panel, Page } from 'konsta/react';
import { useAuth } from '@/lib/authContext';
import { useNavLoading } from '@/lib/navLoadingContext';

const laporanMenus = [
  {
    category: 'Penjualan',
    icon: '📊',
    items: [
      { label: 'Penjualan Obat',        href: '/lap-penjualan-obat',        icon: '💊' },
      { label: 'Penjualan Obat Klinik', href: '/lap-penjualan-obat-klinik', icon: '🏥' },
      { label: 'Obat Terlaris',         href: '/lap-obat-terlaris',         icon: '🔥' },
    ],
  },
  {
    category: 'Pasien & Klinik',
    icon: '👥',
    items: [
      { label: 'Registrasi Pasien',        href: '/lap-registrasi-pasien',        icon: '📋' },
      { label: 'Kunjungan Pasien',         href: '/lap-kunjungan-pasien',         icon: '🚶' },
      { label: 'Janji Dengan Dokter',      href: '/lap-janji-dengan-dokter',      icon: '📅' },
      { label: 'Pembayaran Kasir',         href: '/lap-pembayaran-kasir',         icon: '💳' },
      { label: 'Pendapatan Petugas Medis', href: '/lap-pendapatan-petugas-medis', icon: '👨‍⚕️' },
    ],
  },
  {
    category: 'Obat & Stok',
    icon: '📦',
    items: [
      { label: 'Pembelian Obat',  href: '/lap-pembelian-obat',   icon: '🛒' },
      { label: 'Stok Opname',     href: '/lap-stok-opname',      icon: '📝' },
      { label: 'Stok Obat',       href: '/lap-stok-obat',        icon: '📦' },
      { label: 'Obat Stok Habis', href: '/lap-obat-stok-habis',  icon: '⚠️' },
      { label: 'Obat Expired',    href: '/lap-obat-expired',     icon: '❌' },
    ],
  },
  {
    category: 'Keuangan',
    icon: '💹',
    items: [
      { label: 'Pergantian Shift',href: '/lap-pergantian-shift', icon: '🔄' },
    ],
  },
];

const avatarColors: Record<string, string> = {
  Admin:    'bg-purple-500',
  Dokter:   'bg-blue-500',
  Kasir:    'bg-green-500',
  Apoteker: 'bg-orange-500',
};

const groupBadgeColors: Record<string, string> = {
  Admin:    'bg-purple-100 text-purple-700',
  Dokter:   'bg-blue-100 text-blue-700',
  Kasir:    'bg-green-100 text-green-700',
  Apoteker: 'bg-orange-100 text-orange-700',
};

interface SidebarProps {
  open: boolean;
  onClose: () => void;
}

function SectionLabel({ label }: { label: string }) {
  return (
    <div className="px-3 pt-3 pb-1">
      <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{label}</span>
    </div>
  );
}

function MenuItem({
  icon, label, active, onClick,
}: { icon: string; label: string; active: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center gap-2.5 px-3 py-2 text-left transition-colors active:bg-gray-100 ${
        active ? 'bg-blue-50' : ''
      }`}
    >
      <span className="text-base w-5 text-center flex-shrink-0">{icon}</span>
      <span className={`text-sm flex-1 truncate ${active ? 'font-semibold text-blue-600' : 'font-medium text-gray-800'}`}>
        {label}
      </span>
      {active && <span className="w-1.5 h-1.5 rounded-full bg-blue-500 flex-shrink-0" />}
    </button>
  );
}

export default function Sidebar({ open, onClose }: SidebarProps) {
  const { user, logout } = useAuth();
  const router   = useRouter();
  const pathname = usePathname();
  const { startLoading } = useNavLoading();

  const go = (href: string) => {
    if (pathname !== href) startLoading();
    router.push(href);
    onClose();
  };

  const handleLogout = () => {
    logout();
    router.replace('/login');
    onClose();
  };

  const mainMenus = [
    { label: 'Dashboard', href: '/dashboard', icon: '🏠' },
    { label: 'Obat',      href: '/obat',      icon: '💊' },
    { label: 'Customer',  href: '/customer',  icon: '👥' },
  ];

  return (
    <Panel side="left" opened={open} onBackdropClick={onClose} className="!z-[200]">
      <Page>
        <div className="flex flex-col h-full bg-white">

          {/* ── Header ── */}
          <div className="flex items-center justify-between px-3 h-12 border-b border-gray-100 flex-shrink-0">
            <p className="text-sm font-bold text-gray-900">Vmedis Mobile</p>
            <button
              onClick={onClose}
              className="w-8 h-8 flex items-center justify-center rounded-lg active:bg-gray-100"
            >
              <svg viewBox="0 0 24 24" className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* ── Profile ── */}
          {user && (
            <div
              className="flex items-center gap-2.5 px-3 py-2.5 flex-shrink-0"
              style={{ background: 'linear-gradient(135deg, #1e3a8a 0%, #2563eb 100%)' }}
            >
              <div className={`w-9 h-9 rounded-xl flex items-center justify-center text-white font-bold text-sm flex-shrink-0 ${avatarColors[user.group] ?? 'bg-blue-400'}`}>
                {user.avatar}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-white font-semibold text-xs truncate">{user.nama}</p>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <span className="text-blue-200 text-[10px] truncate">@{user.username}</span>
                  <span className={`text-[9px] font-semibold px-1.5 py-px rounded-full ${groupBadgeColors[user.group] ?? 'bg-white/20 text-white'}`}>
                    {user.group}
                  </span>
                </div>
              </div>
              <button
                onClick={() => go('/profil')}
                className="flex items-center gap-1 bg-white text-gray-700 text-[10px] font-semibold px-2.5 py-1 rounded-lg active:bg-gray-100 shadow-sm flex-shrink-0"
              >
                👤 Profil
              </button>
            </div>
          )}

          {/* ── Nav ── */}
          <div className="flex-1 overflow-y-auto">

            <SectionLabel label="Menu Utama" />
            {mainMenus.map((item) => (
              <MenuItem
                key={item.href}
                icon={item.icon}
                label={item.label}
                active={pathname === item.href}
                onClick={() => go(item.href)}
              />
            ))}

            <div className="mx-3 my-2 border-t border-gray-100" />

            {laporanMenus.map((group) => (
              <div key={group.category}>
                <SectionLabel label={group.category} />
                {group.items.map((item) => (
                  <MenuItem
                    key={item.href}
                    icon={item.icon}
                    label={item.label}
                    active={pathname === item.href}
                    onClick={() => go(item.href)}
                  />
                ))}
              </div>
            ))}

            <div className="h-4" />
          </div>

          {/* ── Footer / Logout ── */}
          <div className="border-t border-gray-100 px-3 pt-2.5 pb-3 flex-shrink-0">
            <button
              onClick={handleLogout}
              className="w-full flex items-center justify-center gap-2 bg-red-50 text-red-600 text-sm font-semibold py-2.5 rounded-xl active:bg-red-100 transition-colors"
            >
              <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4M16 17l5-5-5-5M21 12H9" />
              </svg>
              Logout
            </button>
            <p className="text-center text-[10px] text-gray-300 mt-2">Vmedis Mobile v1.0.0 · © 2025</p>
          </div>
        </div>
      </Page>
    </Panel>
  );
}
