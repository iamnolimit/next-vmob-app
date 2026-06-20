'use client';
import { useState } from 'react';
import LaporanHeader from '@/components/LaporanHeader';
import LiquidPullToRefresh from '@/components/LiquidPullToRefresh';
import { ListSkeleton } from '@/components/SkeletonLoader';
import { useReportData } from '@/lib/useReportData';

const groupColors: Record<string, string> = {
  Dokter: 'bg-primary-accent/10 text-primary-accent',
  Kasir: 'bg-green-100 text-green-700',
  Admin: 'bg-purple-100 text-purple-700',
  Apoteker: 'bg-orange-100 text-orange-700',
};

export default function LapManajemenUserPage() {
  const [search, setSearch] = useState('');

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const apiNormalizer = (rawData: any) => {
    const userData = rawData?.data || [];
    if (!Array.isArray(userData)) return [];

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const transformed = userData.map((item: any, index: number) => ({
      id: item.user_id || item.id || index,
      nama: item.nama_lengkap || item.nama || '-',
      username: item.username || '-',
      email: item.email || '-',
      alamat: item.alamat || item.alamatuser || '-',
      group: item.gr_nama || item.grup || 'Other',
      fotoProfil: item.logo || item.foto || '',
      aktif: (item.status ?? 10) === 10,
      hp: item.user_wa || '-',
      rawData: item,
    }));

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    transformed.sort((a: any, b: any) => {
      const nameA = (a.nama || '').toLowerCase();
      const nameB = (b.nama || '').toLowerCase();
      return nameA.localeCompare(nameB);
    });

    return transformed;
  };

  const { data: users, loading, error, refetch } = useReportData({
    apiEndpoint: '/sys/index',
    apiVersion: 'api5',
    apiParams: {},
    apiNormalizer,
  });

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const filtered = search.trim()
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ? users.filter((u: any) => u.nama.toLowerCase().includes(search.toLowerCase()) || u.username.toLowerCase().includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase()))
    : users;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const toggleAktif = async (id: number, currentAktif: boolean) => {
    // In a real app, we would call the API to toggle status here
    // For now, we just log it since we don't have the globalMutation setup for this specific action in useReportData
    console.log('Toggle status for user', id, 'to', !currentAktif);
    // Optimistic update could be implemented here if we managed state locally
  };

  const headerNode = <LaporanHeader title="Manajemen User" />;

  const searchBar = (
    <div className="px-4 py-2.5 bg-white border-b border-gray-100">
      <div className="relative">
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">🔍</span>
        <input type="text" value={search} onChange={(e) => setSearch(e.target.value)}
          placeholder="Cari nama / username / email..."
          className="w-full pl-9 pr-9 py-2 bg-gray-100 rounded-xl text-sm outline-none" />
        {search && <button onClick={() => setSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">✕</button>}
      </div>
    </div>
  );

  return (
    <LiquidPullToRefresh header={headerNode} onRefresh={refetch} className="flex-1">
      {searchBar}
      <div className="bg-gray-50 px-4 py-3 space-y-3">
        {loading ? (
          <ListSkeleton rows={6} />
        ) : error ? (
          <p className="text-center text-sm text-red-500">{error}</p>
        ) : (
          <div className="space-y-3 animate-content-in">
            {filtered.map((user: any) => (
              <div key={user.id} className="bg-white rounded-2xl p-4 ios-shadow">
                <div className="flex items-start gap-3">
                  <div className="w-12 h-12 rounded-full bg-gradient-ios flex items-center justify-center text-white font-bold text-lg flex-shrink-0">
                    {user.nama.charAt(0)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <p className="text-sm font-semibold text-gray-900 truncate">{user.nama}</p>
                      <button onClick={() => toggleAktif(user.id, user.aktif)}
                        className={`relative w-12 h-6 rounded-full transition-colors flex-shrink-0 ${user.aktif ? 'bg-green-500' : 'bg-gray-300'}`}>
                        <span className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform ${user.aktif ? 'translate-x-6' : 'translate-x-0.5'}`} />
                      </button>
                    </div>
                    <p className="text-xs text-gray-500">@{user.username}</p>
                    <p className="text-xs text-gray-500">{user.email}</p>
                    <p className="text-xs text-gray-400 mt-0.5">📱 {user.hp}</p>
                    <p className="text-xs text-gray-400 truncate">📍 {user.alamat}</p>
                    <div className="mt-1.5 flex items-center gap-2">
                      <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${groupColors[user.group] ?? 'bg-gray-100 text-gray-600'}`}>{user.group}</span>
                      <span className={`text-[10px] font-medium ${user.aktif ? 'text-green-600' : 'text-red-500'}`}>{user.aktif ? '● Aktif' : '● Tidak Aktif'}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </LiquidPullToRefresh>
  );
}
