'use client';
import { useState, useEffect } from 'react';
import LaporanHeader from '@/components/LaporanHeader';
import { useAuth } from '@/lib/authContext';
import { useReportData } from '@/lib/useReportData';

export default function LapPengaturanBankPage() {
  const { user } = useAuth();
  const [showForm, setShowForm] = useState(false);
  const [alert, setAlert] = useState('');

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const apiNormalizer = (rawData: any) => {
    if (rawData?.status === 1) {
      return rawData.data || [];
    }
    return [];
  };

  const { data: banks, loading, error, refetch } = useReportData({
    apiEndpoint: '/mobile-bank/index',
    apiVersion: 'apivmart',
    apiParams: {
      user_id: user?.user_id || '',
      appid: user?.cabang || '', // Using cabang as app_id fallback
    },
    apiNormalizer,
  });

  useEffect(() => {
    refetch();
  }, [refetch]);

  const enkrip = (norek: string) => {
    if (!norek) return 'Tidak ada';
    const len = norek.length;
    return '*'.repeat(Math.max(0, len - 4)) + norek.slice(-4);
  };

  const setDefault = (id: number) => { setAlert('Rekening berhasil dijadikan default. (Dummy)'); };
  const deleteBank = (id: number) => { setAlert('Rekening berhasil dihapus. (Dummy)'); };

  return (
    <div className="flex flex-col h-full">
      <LaporanHeader title="Pengaturan Bank" />

      <div className="flex-1 overflow-y-auto bg-gray-50 pt-4">
        <div className="px-4 pt-3 flex justify-end">
          <button onClick={() => setShowForm(true)} className="text-sm font-semibold text-blue-600 bg-blue-50 px-4 py-2 rounded-xl">
            + Tambah Rekening
          </button>
        </div>

        {alert && (
          <div className="mx-4 mt-2 bg-green-50 border border-green-200 rounded-xl px-4 py-2.5 flex justify-between items-center">
            <span className="text-sm text-green-700">{alert}</span>
            <button onClick={() => setAlert('')} className="text-green-500 font-bold">×</button>
          </div>
        )}

        {showForm && (
          <div className="mx-4 mt-3 bg-white rounded-2xl p-4 ios-shadow">
            <h3 className="text-sm font-bold text-gray-800 mb-3">Tambah Rekening Bank</h3>
            <div className="space-y-2">
              <input className="w-full bg-gray-100 rounded-xl px-3 py-2 text-sm outline-none" placeholder="Nama Bank" />
              <input className="w-full bg-gray-100 rounded-xl px-3 py-2 text-sm outline-none" placeholder="Nomor Rekening" />
              <input className="w-full bg-gray-100 rounded-xl px-3 py-2 text-sm outline-none" placeholder="Atas Nama" />
            </div>
            <div className="flex gap-2 mt-3">
              <button onClick={() => setShowForm(false)} className="flex-1 bg-gray-100 text-gray-700 rounded-xl py-2 text-sm font-medium">Batal</button>
              <button onClick={() => { setShowForm(false); setAlert('Rekening berhasil ditambahkan.'); }} className="flex-1 bg-blue-600 text-white rounded-xl py-2 text-sm font-medium">Simpan</button>
            </div>
          </div>
        )}

        <div className="px-4 py-3 space-y-3">
          {loading && <p className="text-center text-sm text-gray-500">Memuat data...</p>}
          {error && <p className="text-center text-sm text-red-500">{error}</p>}
          {!loading && !error && banks.length === 0 && (
            <p className="text-center text-sm text-gray-500">Belum ada rekening bank.</p>
          )}

          {!loading && !error && banks.map((bank: any) => (
            <div key={bank.id} className="bg-white rounded-2xl p-4 ios-shadow">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className="text-sm font-bold text-gray-900">{bank.bank_nama}</span>
                    {bank.is_default === '1' && <span className="text-[10px] font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">DEFAULT</span>}
                  </div>
                  <p className="text-sm font-mono text-gray-700">{enkrip(bank.bank_norek)}</p>
                  <p className="text-xs text-gray-500">{bank.bank_atasnama}</p>
                </div>
                <span className="text-2xl">🏦</span>
              </div>
              <div className="flex gap-2">
                {bank.is_default !== '1' && (
                  <button onClick={() => setDefault(bank.id)} className="flex-1 bg-blue-50 text-blue-600 rounded-xl py-1.5 text-xs font-semibold">Set Default</button>
                )}
                <button onClick={() => setAlert('Form edit dibuka. (Dummy)')} className="flex-1 bg-gray-100 text-gray-700 rounded-xl py-1.5 text-xs font-semibold">Edit</button>
                <button onClick={() => deleteBank(bank.id)} className="flex-1 bg-red-50 text-red-600 rounded-xl py-1.5 text-xs font-semibold">Hapus</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
