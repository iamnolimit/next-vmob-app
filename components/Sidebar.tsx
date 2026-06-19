'use client';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '@/lib/authContext';
import { useNavLoading } from '@/lib/navLoadingContext';
import { 
  Pill, Hospital, Flame, ClipboardList, UserCheck, CalendarDays, 
  CreditCard, Stethoscope, ShoppingCart, ClipboardCheck, Package, 
  AlertTriangle, XCircle, RefreshCcw, LayoutDashboard, LineChart, 
  CircleDollarSign, UsersRound, LogOut, ChevronRight, X
} from 'lucide-react';

const laporanMenus = [
  {
    category: 'Penjualan',
    icon: <ShoppingCart size={20} />,
    items: [
      { label: 'Penjualan Obat',        href: '/lap-penjualan-obat',        icon: <Pill size={20} /> },
      { label: 'Penjualan Obat Klinik', href: '/lap-penjualan-obat-klinik', icon: <Hospital size={20} /> },
      { label: 'Obat Terlaris',         href: '/lap-obat-terlaris',         icon: <Flame size={20} /> },
    ],
  },
  {
    category: 'Pasien & Klinik',
    icon: <UsersRound size={20} />,
    items: [
      { label: 'Registrasi Pasien',        href: '/lap-registrasi-pasien',        icon: <ClipboardList size={20} /> },
      { label: 'Kunjungan Pasien',         href: '/lap-kunjungan-pasien',         icon: <UserCheck size={20} /> },
      { label: 'Janji Dengan Dokter',      href: '/lap-janji-dengan-dokter',      icon: <CalendarDays size={20} /> },
      { label: 'Pembayaran Kasir',         href: '/lap-pembayaran-kasir',         icon: <CreditCard size={20} /> },
      { label: 'Pendapatan Petugas Medis', href: '/lap-pendapatan-petugas-medis', icon: <Stethoscope size={20} /> },
    ],
  },
  {
    category: 'Obat & Stok',
    icon: <Package size={20} />,
    items: [
      { label: 'Pembelian',       href: '/lap-pembelian-obat',   icon: <ShoppingCart size={20} /> },
      { label: 'Stok Opname',     href: '/lap-stok-opname',      icon: <ClipboardCheck size={20} /> },
      { label: 'Stok Obat',       href: '/lap-stok-obat',        icon: <Package size={20} /> },
      { label: 'Obat Stok Habis', href: '/lap-obat-stok-habis',  icon: <AlertTriangle size={20} /> },
      { label: 'Obat Expired',    href: '/lap-obat-expired',     icon: <XCircle size={20} /> },
    ],
  },
  {
    category: 'Keuangan',
    icon: <CircleDollarSign size={20} />,
    items: [
      { label: 'Pergantian Shift',href: '/lap-pergantian-shift', icon: <RefreshCcw size={20} /> },
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
    <div className="px-5 pt-6 pb-2">
      <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">{label}</span>
    </div>
  );
}

function MenuItem({
  icon, label, active, onClick,
}: { icon: React.ReactNode; label: string; active: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className={`w-[calc(100%-1rem)] mx-2 flex items-center gap-3 px-3 py-3 rounded-xl text-left transition-all duration-200 ${
        active 
          ? 'bg-[#0362fc]/10 text-[#0362fc] shadow-sm' 
          : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
      }`}
    >
      <span className={`w-6 flex justify-center flex-shrink-0 transition-transform duration-200 ${active ? 'scale-110' : 'opacity-70'}`}>{icon}</span>
      <span className={`text-[14px] flex-1 truncate ${active ? 'font-bold' : 'font-medium'}`}>
        {label}
      </span>
    </button>
  );
}

export default function Sidebar({ open, onClose }: SidebarProps) {
  const { user, logout } = useAuth();
  const router   = useRouter();
  const pathname = usePathname();
  const normalizedPathname = pathname?.replace(/\/$/, '') || '/';
  const { startLoading } = useNavLoading();

  const go = (href: string) => {
    if (normalizedPathname !== href) startLoading();
    router.push(href);
    onClose();
  };

  const handleLogout = () => {
    logout();
    router.replace('/login');
    onClose();
  };

  return (
    <>
      {/* Backdrop */}
      {open && (
        <div 
          className="fixed inset-0 bg-black/40 z-[190] transition-opacity duration-300 backdrop-blur-sm"
          onClick={onClose}
        />
      )}

      {/* Sidebar Panel */}
      <div 
        className={`fixed top-4 bottom-4 left-4 w-72 bg-white/95 backdrop-blur-xl z-[200] transform transition-transform duration-300 ease-in-out shadow-[0_8px_40px_rgb(0,0,0,0.12)] rounded-3xl overflow-hidden border border-white/50 ${
          open ? 'translate-x-0' : '-translate-x-[120%]'
        }`}
      >
        {/* Ambient Background Effects */}
        <div className="absolute top-0 left-0 w-full h-64 bg-gradient-to-br from-orange-100/40 via-blue-50/20 to-transparent pointer-events-none" />
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-orange-200/30 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-32 -left-24 w-48 h-48 bg-blue-200/20 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col h-full relative z-10">

          {/* ── Header ── */}
          <div className="flex items-center justify-between px-5 h-16 border-b border-gray-100/50 flex-shrink-0">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-br from-[#0362fc] to-blue-700 rounded-xl flex items-center justify-center shadow-sm">
                <span className="text-white font-bold text-sm">V</span>
              </div>
              <p className="text-[15px] font-bold text-gray-800 tracking-tight">Vmedis Mobile</p>
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-50 text-gray-500 hover:bg-gray-100 transition-colors"
            >
              <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* ── Profile ── */}
          {user && (
            <div className="px-4 py-4 flex-shrink-0">
              <div className="flex items-center gap-3 p-3 rounded-2xl bg-gradient-to-br from-gray-50 to-gray-100/50 border border-gray-100">
                <div className={`w-11 h-11 rounded-xl flex items-center justify-center text-white font-bold text-lg flex-shrink-0 shadow-sm ${avatarColors[user.group] ?? 'bg-blue-400'}`}>
                  {user.avatar}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-gray-900 font-bold text-[14px] truncate">{user.nama}</p>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <span className="text-gray-500 text-[11px] truncate">@{user.username}</span>
                  </div>
                </div>
                <button
                  onClick={() => go('/profil')}
                  className="flex items-center justify-center w-8 h-8 bg-white text-gray-600 rounded-full shadow-sm border border-gray-200/50 hover:bg-gray-50 transition-colors flex-shrink-0"
                >
                  <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
                    <path d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
            </div>
          )}

          {/* ── Nav ── */}
          <div className="flex-1 overflow-y-auto">

            <div>
              <SectionLabel label="Dashboard" />
              <MenuItem
                icon={<LayoutDashboard size={20} />}
                label="Home"
                active={normalizedPathname === '/dashboard'}
                onClick={() => go('/dashboard')}
              />
              <MenuItem
                icon={<LineChart size={20} />}
                label="Smart Forecast"
                active={normalizedPathname === '/forecast'}
                onClick={() => go('/forecast')}
              />
              <MenuItem
                icon={<CircleDollarSign size={20} />}
                label="Keuangan"
                active={normalizedPathname === '/keuangan'}
                onClick={() => go('/keuangan')}
              />
              <MenuItem
                icon={<Stethoscope size={20} />}
                label="Obat"
                active={normalizedPathname === '/obat'}
                onClick={() => go('/obat')}
              />
              <MenuItem
                icon={<UsersRound size={20} />}
                label="Customer"
                active={normalizedPathname === '/customer'}
                onClick={() => go('/customer')}
              />
            </div>

            {laporanMenus.map((group) => (
              <div key={group.category}>
                <SectionLabel label={group.category} />
                {group.items.map((item) => (
                  <MenuItem
                    key={item.href}
                    icon={item.icon}
                    label={item.label}
                    active={normalizedPathname === item.href}
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
      </div>
    </>
  );
}
