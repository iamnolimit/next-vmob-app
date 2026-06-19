'use client';
import ReportTable from '@/components/ReportTable';
import { formatRupiah, formatNumber } from '@/lib/dummyData';
import { useReportData } from '@/lib/useReportData';

export default function LapPiutangObatPage() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const apiNormalizer = (rawData: any, offset = 0) => {
    const dataArray = rawData?.data || rawData;
    if (!Array.isArray(dataArray)) return [];

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return dataArray.map((item: any, index: number) => ({
      no: offset + index + 1,
      noFaktur: item.pjnofaktur || '-',
      pasien: item.pasnama || '-',
      jatuhTempo: item.deadline || '-',
      total: parseFloat(item.kurang || '0'),
      rawData: item,
    }));
  };

  const getTodayWIB = () => {
    const now = new Date();
    const wibTime = new Date(now.getTime() + 7 * 60 * 60 * 1000);
    const year = wibTime.getUTCFullYear();
    const month = String(wibTime.getUTCMonth() + 1).padStart(2, '0');
    const day = String(wibTime.getUTCDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const { data, loading, error, hasMore, refetch, loadMore } = useReportData({
    apiEndpoint: '/appiutang-obat/index-v2',
    apiVersion: 'api5',
    apiParams: {
      date: getTodayWIB(),
      tanggalawal: '',
      tanggalakhir: '',
      carimobile: '',
      sorting: '',
      deadline: '',
      reg: 'db',
      cari: 4,
    },
    apiNormalizer,
  });

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const totalPiutangObat = data.reduce((sum: number, item: any) => sum + (item.total || 0), 0);

  return (
    <ReportTable
      title="Laporan Piutang Obat"
      columns={[
        { key: 'no', label: 'No', align: 'center', width: 40 },
        { key: 'noFaktur', label: 'No Faktur', width: 150 },
        { key: 'pasien', label: 'Pasien', width: 140 },
        { key: 'jatuhTempo', label: 'Jatuh Tempo', align: 'center', width: 110 },
        { key: 'total', label: 'Total', align: 'right', width: 130,
          render: (r) => formatNumber(r.total as number) },
      ]}
      data={data}
      loading={loading}
      error={error}
      hasMore={hasMore}
      onLoadMore={loadMore}
      onFetchData={(params) => {
        refetch({
          tanggalawal: params.start || '',
          tanggalakhir: params.end || '',
          carimobile: params.search || '',
          deadline: params.interval !== 'all' ? params.interval : '',
        });
      }}
      totalLabel="Total Kekurangan"
      totalValue={formatRupiah(totalPiutangObat)}
      searchFields={['noFaktur', 'pasien']}
      searchPlaceholder="No faktur / pasien"
      intervalOptions={[
        { label: 'Semua Data', value: 'all' },
        { label: 'Jatuh Tempo', value: 0 },
        { label: '7 Hari', value: 7 },
        { label: '15 Hari', value: 15 },
        { label: '30 Hari', value: 30 },
      ]}
      intervalTitle="Jatuh Tempo"
      dateField="jatuhTempo"
    />
  );
}
