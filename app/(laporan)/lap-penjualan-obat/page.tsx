'use client';
import { useCallback } from 'react';
import ReportTable from '@/components/ReportTable';
import { useReportData } from '@/lib/useReportData';
import { formatRupiah } from '@/lib/dummyData';


export default function LapPenjualanObatPage() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const apiNormalizer = useCallback((rawData: any, offset = 0) => {
    const dataArray = rawData?.data || rawData;
    if (!Array.isArray(dataArray)) return [];

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return dataArray.map((item: any, index: number) => ({
      no: offset + index + 1,
      noFaktur: item.pjnofaktur || '',
      pasien: item.pasnama || '-',
      dokter: item.doknama || '-',
      total: parseFloat(item.grandtotal || 0),
      tanggal: item.pjtanggal || '',
      rawData: item,
    }));
  }, []);

  const { data, loading, error, hasMore, refetch, loadMore, reset } = useReportData({
    apiEndpoint: 'apt-lap-penjualanobat-batch/indexlaporan',
    apiVersion: 'api5',
    apiParams: {
      cari: '4',
      sorting: '',
    },
    apiNormalizer,
  });

  const fmtDate = (isoDate: string) => {
    if (!isoDate) return '';
    const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
    const [y, m, d] = isoDate.split('-');
    return `${d} ${months[Number(m) - 1]} ${y}`;
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const periodToCari = (p: string) => p === 'tahun' ? '2' : p === 'bulan' ? '3' : '4';

  const handleFetchData = useCallback((filters: any) => {
    const cari = periodToCari(filters.periodType || 'tanggal');
    const [startY, startM] = filters.start.split('-');
    const [endY] = filters.end.split('-');
    refetch({
      tanggalawal: fmtDate(filters.start),
      tanggalakhir: fmtDate(filters.end),
      cari,
      bulan: cari === '3' ? startM : '',
      tahun: cari === '2' ? endY : cari === '3' ? startY : '',
      carimobile: filters.search || '',
      a: filters.cabang,
      reg: filters.cabangReg,
      device: 'mobile',
    });
  }, [refetch]);

  const handleLoadMore = useCallback(() => {
    loadMore();
  }, [loadMore]);

  const total = data.reduce((s, r) => s + (r.total as number), 0);

  return (
    <ReportTable
      title="Penjualan Obat"
      columns={[
        { key: 'no', label: 'No', align: 'center', width: 40 },
        { key: 'noFaktur', label: 'No Faktur', width: 100 },
        { key: 'pasien', label: 'Pasien', width: 100 },
        { key: 'dokter', label: 'Dokter', width: 100 },
        { key: 'total', label: 'Total', align: 'right',
          render: (r) => formatRupiah(r.total as number) },
      ]}
      data={data}
      loading={loading}
      error={error}
      hasMore={hasMore}
      onLoadMore={handleLoadMore}
      totalLabel="Total Penjualan"
      totalValue={formatRupiah(total)}
      searchFields={['noFaktur', 'pasien', 'dokter']}
      searchPlaceholder="No faktur / pasien / dokter"
      dateField="tanggal"
      onFetchData={handleFetchData}
      onReset={reset}
    />
  );
}
