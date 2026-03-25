'use client';
import LaporanHeader from '@/components/LaporanHeader';
import { dashboardDokterData } from '@/lib/dummyData';

export default function LapDashboardDokterPage() {
  const { dokter, dataKunjungan, dataJanji } = dashboardDokterData;
  const today = new Date().toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

  return (
    <div className="flex flex-col h-full">
      <LaporanHeader title="Dashboard Dokter" subtitle={`${dokter.nama} · ${dokter.spesialis}`} />

      <div className="flex-1 overflow-y-auto bg-gray-50 px-4 py-4 space-y-4">
        <p className="text-xs text-gray-400 text-center">{today}</p>

        {dataKunjungan.map((poli) => (
          <div key={poli.polid} className="bg-white rounded-2xl p-4 ios-shadow">
            <div className="flex items-center justify-between mb-3">
              <div>
                <h3 className="text-sm font-semibold text-gray-900">{poli.polnama}</h3>
                <p className="text-xs text-gray-500">Data Kunjungan Hari Ini</p>
              </div>
              <span className="text-2xl">🏥</span>
            </div>
            <div className="flex gap-3">
              <div className="flex-1 bg-pink-50 rounded-xl p-3 text-center">
                <div className="text-2xl font-extrabold text-pink-600">{poli.jumantrian}</div>
                <div className="text-xs text-pink-500 mt-0.5">Jum. Antrian</div>
              </div>
              <div className="flex-1 bg-purple-50 rounded-xl p-3 text-center">
                <div className="text-2xl font-extrabold text-purple-600">{poli.antrianskrg}</div>
                <div className="text-xs text-purple-500 mt-0.5">Ant. Skrg</div>
              </div>
            </div>
          </div>
        ))}

        <div className="bg-white rounded-2xl p-4 ios-shadow">
          <div className="flex items-center gap-3">
            <div className="w-14 h-14 rounded-2xl bg-green-50 flex items-center justify-center text-3xl">📅</div>
            <div>
              <p className="text-xs text-gray-500">Jumlah Janji dengan Pasien</p>
              <p className="text-3xl font-extrabold text-green-600 leading-none mt-0.5">{dataJanji.jumjanji}</p>
              <p className="text-xs text-gray-400">janji hari ini</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <button className="bg-white rounded-2xl p-4 ios-shadow text-center active:opacity-70">
            <span className="text-2xl block mb-1">📋</span>
            <span className="text-xs font-medium text-gray-700">List Kunjungan</span>
          </button>
          <button className="bg-white rounded-2xl p-4 ios-shadow text-center active:opacity-70">
            <span className="text-2xl block mb-1">📅</span>
            <span className="text-xs font-medium text-gray-700">List Janji</span>
          </button>
        </div>
      </div>
    </div>
  );
}
