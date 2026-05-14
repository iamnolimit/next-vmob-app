'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/authContext';

const groupColors: Record<string, string> = {
  Admin: 'bg-purple-500',
  Dokter: 'bg-blue-500',
  Kasir: 'bg-green-500',
  Apoteker: 'bg-orange-500',
};

export default function ProfilPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.replace('/login');
    }
  }, [user, loading, router]);

  if (loading || !user) return null;

  const fields = [
    { label: 'Nama Lengkap', value: user.nama, icon: '👤' },
    { label: 'Email', value: user.email, icon: '📧' },
    { label: 'Jabatan', value: user.jabatan, icon: '💼' },
    { label: 'Cabang / Klinik', value: user.cabang, icon: '🏥' },
    { label: 'Grup / Role', value: user.group, icon: '🏷️' },
  ];

  return (
    <div className="flex flex-col min-h-full bg-gray-50">
      {/* Header */}
      <div
        className="px-4 pt-12 pb-8 relative overflow-hidden"
        style={{ background: 'linear-gradient(135deg, #1e3a8a 0%, #2563eb 100%)' }}
      >
        <div className="absolute -top-16 -right-16 w-40 h-40 rounded-full bg-white/5" />
        <button
          onClick={() => router.back()}
          className="absolute top-4 left-4 flex items-center gap-0.5 text-white/90 active:opacity-60 pr-1"
        >
          <svg viewBox="0 0 24 24" className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
            <path d="M15 18l-6-6 6-6" />
          </svg>
          <span className="text-base font-medium">Kembali</span>
        </button>
        <div className="flex flex-col items-center relative">
          <div
            className={`w-20 h-20 rounded-2xl flex items-center justify-center text-white font-bold text-3xl shadow-lg mb-3 ${groupColors[user.group] ?? 'bg-blue-400'}`}
          >
            {user.avatar}
          </div>
          <h1 className="text-xl font-extrabold text-white">{user.nama}</h1>
          <span className="mt-2 inline-block text-xs font-semibold bg-white/20 text-white px-3 py-1 rounded-full">
            {user.group}
          </span>
        </div>
      </div>

      {/* Info cards */}
      <div className="px-4 py-4 space-y-3 flex-1">
        <div className="bg-white rounded-2xl overflow-hidden ios-shadow">
          {fields.map((f, i) => (
            <div
              key={f.label}
              className={`flex items-center gap-4 px-4 py-3.5 ${i < fields.length - 1 ? 'border-b border-gray-100' : ''}`}
            >
              <span className="text-xl w-8 text-center">{f.icon}</span>
              <div className="flex-1 min-w-0">
                <p className="text-xs text-gray-500 font-medium">{f.label}</p>
                <p className="text-sm text-gray-900 font-semibold truncate">{f.value}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Change password */}
        <button
          onClick={() => router.push('/ganti-password')}
          className="w-full bg-white rounded-2xl px-4 py-4 ios-shadow flex items-center gap-3 active:bg-gray-50"
        >
          <span className="text-xl">🔑</span>
          <div className="flex-1 text-left">
            <p className="text-sm font-semibold text-gray-800">Ganti Password</p>
            <p className="text-xs text-gray-500">Perbarui kata sandi Anda</p>
          </div>
          <svg viewBox="0 0 24 24" className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
            <path d="M9 18l6-6-6-6" />
          </svg>
        </button>
      </div>
    </div>
  );
}
