'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/authContext';
import { User, Hospital, Tag } from 'lucide-react';

const groupColors: Record<string, string> = {
  Admin: 'bg-purple-500',
  Dokter: 'bg-[#4f6dfa]',
  Kasir: 'bg-green-500',
  Apoteker: 'bg-orange-500',
};

const getRoleName = (groupId: string | number) => {
  const id = String(groupId);
  if (id === '1') return 'Admin';
  if (id === '2') return 'Kasir';
  if (id === '3') return 'Apoteker';
  if (id === '4') return 'Dokter';
  return `Role ${id}`;
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

  const roleName = getRoleName(user.gr_id || user.group);

  const fields = [
    { label: 'Nama Lengkap', value: user.nama || '-', icon: <User size={20} /> },
    { label: 'Username', value: user.username || '-', icon: <User size={20} /> },
    { label: 'Cabang / Klinik', value: user.cabang || '-', icon: <Hospital size={20} /> },
    { label: 'Grup / Role', value: roleName, icon: <Tag size={20} /> },
  ];

  return (
    <div className="flex flex-col min-h-full bg-gray-50">
      {/* Header */}
      <div className="px-4 pt-8 pb-8 relative overflow-hidden bg-white border-b border-gray-100">
        <button
          onClick={() => router.push('/dashboard')}
          className="absolute top-8 left-6 w-12 h-12 flex items-center justify-center rounded-full bg-white shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] active:scale-95 transition-transform text-gray-700 z-10"
        >
          <svg viewBox="0 0 24 24" className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
            <path d="M15 18l-6-6 6-6" />
          </svg>
        </button>
        <div className="flex flex-col items-center relative mt-4">
          <div
            className={`w-24 h-24 rounded-full flex items-center justify-center text-white font-bold text-3xl shadow-md mb-4 overflow-hidden border-4 border-white ${groupColors[roleName] ?? 'bg-[#4f6dfa]'}`}
          >
            {user.avatar.startsWith('http') ? (
              <img src={user.avatar} alt={user.nama} className="w-full h-full object-cover" />
            ) : (
              user.avatar
            )}
          </div>
          <h1 className="text-xl font-extrabold text-gray-900">{user.nama}</h1>
          <span className="mt-2 inline-block text-xs font-semibold bg-[#4f6dfa]/10 text-[#4f6dfa] px-3 py-1 rounded-full">
            {roleName}
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
              <span className="w-8 flex justify-center text-gray-400">{f.icon}</span>
              <div className="flex-1 min-w-0">
                <p className="text-xs text-gray-500 font-medium">{f.label}</p>
                <p className="text-sm text-gray-900 font-semibold truncate">{f.value}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
