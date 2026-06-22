'use client';
import ReportTable from '@/components/ReportTable';
import { formatRupiah } from '@/lib/dummyData';
import { useReportData } from '@/lib/useReportData';

export default function LapPiutangKlinikPage() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const apiNormalizer = (rawData: any, offset = 0) => {
    const dataArray = rawData?.data || rawData;
    if (!Array.isArray(dataArray)) return [];

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return dataArray.map((item: any, index: number) => ({
      no: offset + index + 1,
      noFaktur: item.pemnofaktur || '-',
      pasien: item.pasnama || '-',
      jatuhTempo: item.tanggaldeadline || '-',
      total: parseFloat(item.kekurangan || '0'),
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
    apiEndpoint: '/kln-piutang/index',
    apiVersion: 'api5',
    apiParams: {
      date: getTodayWIB(),
      tanggalawal: '',
      tanggalakhir: '',
      carimobile: '',
      sorting: '',
      deadline: '',
      reg: 'db',
      cari: 3,
      filter: '',
    },
    apiNormalizer,
  });

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const totalPiutangKlinik = data.reduce((sum: number, item: any) => sum + (item.total || 0), 0);

  return (
    <ReportTable
      title="Piutang Klinik"
      columns={[
        { key: 'no', label: 'No', align: 'center', width: 40 },
        { key: 'noFaktur', label: 'No Faktur', width: 100 },
        { key: 'pasien', label: 'Pasien', width: 100 },
        { key: 'jatuhTempo', label: 'Jatuh Tempo', align: 'center', width: 80 },
        { key: 'total', label: 'Total', align: 'right',
          render: (r) => formatRupiah(r.total as number) },
      ]}
      data={data}
      loading={loading}
      error={error}
      hasMore={hasMore}
      onLoadMore={loadMore}
      onFetchData={(params) => {
        refetch({
          tanggalawal: fmtDate(params.start),
          tanggalakhir: fmtDate(params.end),
          filter: params.search || '',
          deadline: params.interval !== 'all' ? params.interval : '',
          a: params.cabang,
          reg: params.cabangReg,
        });
      }}
      totalLabel="Total Kekurangan"
      totalValue={formatRupiah(totalPiutangKlinik)}
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
      onReset={reset}
    />
  );
}
