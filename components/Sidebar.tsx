'use client';
import { useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '@/lib/authContext';
import { useNavLoading } from '@/lib/navLoadingContext';
import { 
  Pill, Hospital, Flame, ClipboardList, UserCheck, CalendarDays, 
  CreditCard, Stethoscope, ShoppingCart, ClipboardCheck, Package, 
  AlertTriangle, XCircle, RefreshCcw, LayoutDashboard, LineChart, 
  CircleDollarSign, UsersRound, LogOut, ChevronRight, X, Plus
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
          ? 'bg-[#035afc]/10 text-[#035afc] shadow-sm' 
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
  const { user, sessions, logout, switchSession, removeSession } = useAuth();
  const router   = useRouter();
  const pathname = usePathname();
  const normalizedPathname = pathname?.replace(/\/$/, '') || '/';
  const { startLoading } = useNavLoading();
  const [showSessions, setShowSessions] = useState(false);

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
          <div className="flex items-center justify-end px-5 h-16 border-b border-gray-100/50 flex-shrink-0">
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
            <div className="px-4 pb-6 flex-shrink-0 flex flex-col items-center text-center border-b border-gray-100/50">
              <div className={`w-24 h-24 rounded-full flex items-center justify-center text-white font-bold text-3xl shadow-md mb-3 overflow-hidden border-4 border-white ${avatarColors[user.group] ?? 'bg-blue-400'}`}>
                {user.avatar.startsWith('http') ? (
                  <img src={user.avatar} alt={user.nama} className="w-full h-full object-cover" />
                ) : (
                  user.avatar
                )}
              </div>
              <p className="text-gray-900 font-bold text-[16px] truncate w-full px-2">{user.nama}</p>
              <span className="text-gray-500 text-[12px] truncate w-full px-2 mt-0.5">@{user.username}</span>
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
          <div className="border-t border-gray-100 px-3 pt-2.5 pb-3 flex-shrink-0 space-y-2">
            <button
              onClick={() => {
                setShowSessions(true);
              }}
              className="w-full flex items-center justify-center gap-2 bg-blue-50 text-blue-600 text-sm font-semibold py-2.5 rounded-xl active:bg-blue-100 transition-colors"
            >
              <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
                <path d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              Ganti Akun
            </button>
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

      {/* Sessions Bottom Sheet */}
      {showSessions && (
        <div
          className="fixed inset-0 z-[210] flex flex-col justify-end"
          style={{ background: 'rgba(0,0,0,0.45)' }}
          onClick={() => setShowSessions(false)}
        >
          <div
            className="bg-white rounded-t-3xl overflow-hidden max-h-[80vh] flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Handle bar */}
            <div className="flex justify-center pt-3 pb-1 flex-shrink-0">
              <div className="w-10 h-1 rounded-full bg-gray-300" />
            </div>

            {/* Header */}
            <div className="flex items-center justify-between px-5 py-3 border-b border-gray-100 flex-shrink-0">
              <span className="text-base font-bold text-gray-900">Pilih Akun</span>
              <button onClick={() => setShowSessions(false)} className="p-1 text-gray-500 hover:bg-gray-100 rounded-full">
                <X size={20} />
              </button>
            </div>

            <div className="overflow-y-auto p-4 space-y-3">
              {sessions.map((session) => (
                <div key={`${session.domain}-${session.username}`} className="flex items-center justify-between p-3 bg-gray-50 rounded-2xl border border-gray-100">
                  <button
                    className="flex items-center gap-3 flex-1 text-left"
                    onClick={() => {
                      switchSession(session);
                      setShowSessions(false);
                      onClose();
                      router.replace('/dashboard');
                    }}
                  >
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-lg overflow-hidden ${avatarColors[session.group] ?? 'bg-blue-400'}`}>
                      {session.avatar.startsWith('http') ? (
                        <img src={session.avatar} alt={session.nama} className="w-full h-full object-cover" />
                      ) : (
                        session.avatar
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold text-gray-900 truncate">{session.nama}</p>
                      <p className="text-xs text-gray-500 truncate">@{session.username} • {session.domain}</p>
                    </div>
                  </button>
                  <button
                    onClick={() => removeSession(session.username, session.domain)}
                    className="p-2 text-red-500 hover:bg-red-50 rounded-full ml-2"
                  >
                    <X size={18} />
                  </button>
                </div>
              ))}
              
              <button
                onClick={() => {
                  setShowSessions(false);
                  onClose();
                  router.push('/login');
                }}
                className="w-full flex items-center justify-center gap-2 p-4 border-2 border-dashed border-gray-200 rounded-2xl text-gray-500 hover:bg-gray-50 hover:border-gray-300 transition-colors"
              >
                <Plus size={20} />
                <span className="text-sm font-medium">Tambah Akun Baru</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
