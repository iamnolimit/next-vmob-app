'use client';
import MaintenancePage from '@/components/MaintenancePage';
import ReportTable from '@/components/ReportTable';
import { formatRupiah } from '@/lib/dummyData';
import { useReportData } from '@/lib/useReportData';

export default function LapPiutangObatPage() {
  if (process.env.NEXT_PUBLIC_ACTIVE_HIDDEN_MENU !== 'true') return <MaintenancePage title="Laporan Piutang Obat" />;
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

  const fmtDate = (isoDate: string) => {
    if (!isoDate) return '';
    const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
    const [y, m, d] = isoDate.split('-');
    return `${d} ${months[Number(m) - 1]} ${y}`;
  };

  const { data, loading, error, hasMore, refetch, loadMore, reset } = useReportData({
    apiEndpoint: 'appiutang-obat/indexlaporan',
    apiVersion: 'api5',
    apiParams: {
      date: getTodayWIB(),
      tanggalawal: '',
      tanggalakhir: '',
      carimobile: '',
      sorting: '',
      deadline: '',
      cari: 4,
      bulan: '',
      tahun: '',
    },
    apiNormalizer,
  });

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const totalPiutangObat = data.reduce((sum: number, item: any) => sum + (item.total || 0), 0);

  return (
    <ReportTable
      title="Piutang Obat"
      columns={[
        { key: 'no', label: 'No', align: 'center', width: 40 },
        { key: 'noFaktur', label: 'No Faktur', width: 100, sortingField: 'pjnofaktur' },
        { key: 'pasien', label: 'Pasien', width: 100, sortingField: 'pasnama' },
        { key: 'jatuhTempo', label: 'Jatuh Tempo', align: 'center', width: 80, sortingField: 'deadline' },
        { key: 'total', label: 'Total', align: 'right', sortingField: 'kurang',
          render: (r) => formatRupiah(r.total as number) },
      ]}
      data={data}
      loading={loading}
      error={error}
      hasMore={hasMore}
      onLoadMore={loadMore}
      onFetchData={(params) => {
        const [year, month] = params.start.split('-');

        refetch({
          tanggalawal: fmtDate(params.start),
          tanggalakhir: fmtDate(params.end),
          cari: params.periodType === 'bulan' ? '3' : '4',
          bulan: params.periodType === 'bulan' ? month : '',
          tahun: params.periodType === 'bulan' ? year : '',
          carimobile: params.search || '',
          deadline: params.interval !== 'all' ? params.interval : '',
          a: params.cabang,
          reg: params.cabangReg,
          device: 'mobile',
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
      onSortChange={(sorting) => refetch({ sorting })}
      onReset={reset}
    />
  );
}
