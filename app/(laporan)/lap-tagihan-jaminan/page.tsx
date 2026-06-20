'use client';
import ReportTable from '@/components/ReportTable';
import { formatRupiah } from '@/lib/dummyData';
import { useReportData } from '@/lib/useReportData';

export default function LapTagihanJaminanPage() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const apiNormalizer = (rawData: any, offset = 0) => {
    const dataArray = rawData?.data || rawData;
    if (!Array.isArray(dataArray)) return [];

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return dataArray.map((item: any, index: number) => ({
      no: offset + index + 1,
      tanggal: item.tgl || '-',
      noFaktur: item.pemnofaktur || '-',
      noRM: item.pasrm || '-',
      pasien: item.pasnama || '-',
      jaminan: item.katnama || '-',
      totalBiaya: parseFloat(item.pemtunai || '0'),
      rawData: item,
    }));
  };

  const { data, loading, error, hasMore, refetch, loadMore } = useReportData({
    apiEndpoint: '/laporan-tagihan-jaminan-pasien/index',
    apiVersion: 'api7',
    apiParams: {
      filter: '',
      sorting: '',
      reg: 'db',
      cari: 4,
      device: 'mobile',
    },
    apiNormalizer,
  });

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const totalTagihanJaminan = data.reduce((sum: number, item: any) => sum + (item.totalBiaya || 0), 0);

  return (
    <ReportTable
      title="Tagihan Jaminan Pasien"
      columns={[
        { key: 'no', label: 'No', align: 'center', width: 40 },
        { key: 'noFaktur', label: 'No. Faktur', width: 100 },
        { key: 'pasien', label: 'Pasien', width: 100 },
        { key: 'jaminan', label: 'Jaminan', width: 100 },
        { key: 'totalBiaya', label: 'Total', align: 'right',
          render: (r) => formatRupiah(r.totalBiaya as number) },
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
          filter: params.search || '',
        });
      }}
      totalLabel="Total Biaya"
      totalValue={formatRupiah(totalTagihanJaminan)}
      searchFields={['noFaktur', 'pasien', 'jaminan']}
      searchPlaceholder="No. Faktur / Pasien / Jaminan"
      dateField="tanggal"
    />
  );
}
