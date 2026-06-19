'use client';
import ReportTable from '@/components/ReportTable';
import { formatRupiah, formatNumber } from '@/lib/dummyData';
import { useReportData } from '@/lib/useReportData';

export default function LapHutangObatPage() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const apiNormalizer = (rawData: any, offset = 0) => {
    const dataArray = rawData?.data || rawData;
    if (!Array.isArray(dataArray)) return [];

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return dataArray.map((item: any, index: number) => ({
      no: offset + index + 1,
      noFaktur: item.pemofaktur || '-',
      supplier: item.supnama || '-',
      jatuhTempo: item.deadline || '-',
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
    return `${day}-${month}-${year}`;
  };

  const { data, loading, error, hasMore, refetch, loadMore } = useReportData({
    apiEndpoint: '/hutang-obat/index',
    apiVersion: 'api5',
    apiParams: {
      date: getTodayWIB(),
      tanggalawal: '',
      tanggalakhir: '',
      carimobile: '',
      sorting: '',
      deadline: '',
      reg: 'db',
    },
    apiNormalizer,
  });

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const totalHutangObat = data.reduce((sum: number, item: any) => sum + (item.total || 0), 0);

  return (
    <ReportTable
      title="Laporan Hutang Obat"
      columns={[
        { key: 'no', label: 'No', align: 'center', width: 40 },
        { key: 'noFaktur', label: 'No Faktur', width: 150 },
        { key: 'supplier', label: 'Supplier', width: 150 },
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
      totalValue={formatRupiah(totalHutangObat)}
      searchFields={['noFaktur', 'supplier']}
      searchPlaceholder="No faktur / supplier"
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
