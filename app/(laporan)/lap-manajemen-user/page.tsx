'use client';
import { useState } from 'react';
import LaporanHeader from '@/components/LaporanHeader';
import { userData } from '@/lib/dummyData';

const groupColors: Record<string, string> = {
  Dokter: 'bg-blue-100 text-blue-700',
  Kasir: 'bg-green-100 text-green-700',
  Admin: 'bg-purple-100 text-purple-700',
  Apoteker: 'bg-orange-100 text-orange-700',
};

export default function LapManajemenUserPage() {
  const [users, setUsers] = useState(userData);
  const [search, setSearch] = useState('');

  const filtered = search.trim()
    ? users.filter((u) => u.nama.toLowerCase().includes(search.toLowerCase()) || u.username.toLowerCase().includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase()))
    : users;

  const toggleAktif = (id: number) => setUsers(users.map((u) => u.id === id ? { ...u, aktif: !u.aktif } : u));

  return (
    <div className="flex flex-col h-full">
      <LaporanHeader title="Manajemen User" />

      <div className="px-4 py-2.5 bg-white border-b border-gray-100 flex-shrink-0">
        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">🔍</span>
          <input type="text" value={search} onChange={(e) => setSearch(e.target.value)}
            placeholder="Cari nama / username / email..."
            className="w-full pl-9 pr-9 py-2 bg-gray-100 rounded-xl text-sm outline-none" />
          {search && <button onClick={() => setSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">✕</button>}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto bg-gray-50 px-4 py-3 space-y-3">
        {filtered.map((user) => (
          <div key={user.id} className="bg-white rounded-2xl p-4 ios-shadow">
            <div className="flex items-start gap-3">
              <div className="w-12 h-12 rounded-full bg-gradient-ios flex items-center justify-center text-white font-bold text-lg flex-shrink-0">
                {user.nama.charAt(0)}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <p className="text-sm font-semibold text-gray-900 truncate">{user.nama}</p>
                  <button onClick={() => toggleAktif(user.id)}
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
    </div>
  );
}
