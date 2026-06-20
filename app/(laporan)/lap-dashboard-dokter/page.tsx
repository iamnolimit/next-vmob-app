'use client';
import LaporanHeader from '@/components/LaporanHeader';
import LiquidPullToRefresh from '@/components/LiquidPullToRefresh';
import { ListSkeleton } from '@/components/SkeletonLoader';
import { useAuth } from '@/lib/authContext';
import { useReportData } from '@/lib/useReportData';

export default function LapDashboardDokterPage() {
  const { user } = useAuth();
  const today = new Date().toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const apiNormalizer = (rawData: any) => {
    if (!rawData || rawData.status === 0) {
      return [{ dataKunjungan: [], dataJanji: null }];
    }
    const data = rawData.data || rawData;
    return [{
      dataKunjungan: data.dataKun || [],
      dataJanji: data.dataJan?.[0] || null,
    }];
  };

  const { data, loading, error, refetch } = useReportData({
    apiEndpoint: 'mob-dashboard/dashboard-dokter',
    apiVersion: 'api7',
    apiParams: {
      dokid: user?.dokid || '',
      tgl: new Date().toISOString().split('T')[0],
      device: 'mobile',
    },
    apiNormalizer,
  });

  const dashboardData = data[0] || { dataKunjungan: [], dataJanji: null };
  const { dataKunjungan, dataJanji } = dashboardData;

  const headerNode = <LaporanHeader title="Dashboard Dokter" />;

  return (
    <LiquidPullToRefresh header={headerNode} onRefresh={refetch} className="flex-1">
      <div className="bg-gray-50 px-4 pt-4 pb-24 space-y-4">
        <p className="text-xs text-gray-400 text-center">{today}</p>

        {loading ? (
          <ListSkeleton rows={4} />
        ) : error ? (
          <p className="text-center text-sm text-red-500">{error}</p>
        ) : (
          <div className="space-y-4 animate-content-in">
            {dataKunjungan.map((poli: any) => (
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
                    <div className="text-2xl font-extrabold text-pink-600">{poli.jumantrian || 0}</div>
                    <div className="text-xs text-pink-500 mt-0.5">Jum. Antrian</div>
                  </div>
                  <div className="flex-1 bg-purple-50 rounded-xl p-3 text-center">
                    <div className="text-2xl font-extrabold text-purple-600">{poli.antrianskrg || '000'}</div>
                    <div className="text-xs text-purple-500 mt-0.5">Ant. Skrg</div>
                  </div>
                </div>
              </div>
            ))}

            {dataJanji && (
              <div className="bg-white rounded-2xl p-4 ios-shadow">
                <div className="flex items-center gap-3">
                  <div className="w-14 h-14 rounded-2xl bg-green-50 flex items-center justify-center text-3xl">📅</div>
                  <div>
                    <p className="text-xs text-gray-500">Jumlah Janji dengan Pasien</p>
                    <p className="text-3xl font-extrabold text-green-600 leading-none mt-0.5">{dataJanji.jumjanji || 0}</p>
                    <p className="text-xs text-gray-400">janji hari ini</p>
                  </div>
                </div>
              </div>
            )}

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
        )}
      </div>
    </LiquidPullToRefresh>
  );
}
