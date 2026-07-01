'use client';
import MaintenancePage from '@/components/MaintenancePage';
import { useCallback } from 'react';
import ReportTable from '@/components/ReportTable';
import { formatRupiah } from '@/lib/dummyData';
import { useReportData } from '@/lib/useReportData';

export default function LapHutangObatPage() {
  if (process.env.NEXT_PUBLIC_ACTIVE_HIDDEN_MENU !== 'true') return <MaintenancePage title="Laporan Hutang Obat" />;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const apiNormalizer = useCallback((rawData: any, offset = 0) => {
    const dataArray = rawData?.data || rawData;
    if (!Array.isArray(dataArray)) return [];

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return dataArray.map((item: any, index: number) => ({
      no: offset + index + 1,
      tanggal: item.tgl || '-',
      noFaktur: item.pemofaktur || '-',
      supplier: item.supnama || '-',
      totalBayar: parseFloat(item.jml_bayar || '0'),
      rawData: item,
    }));
  }, []);

  const fmtDate = (isoDate: string) => {
    if (!isoDate) return '';
    const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
    const [y, m, d] = isoDate.split('-');
    return `${d} ${months[Number(m) - 1]} ${y}`;
  };

  const getTodayWIB = () => {
    const now = new Date();
    const wibTime = new Date(now.getTime() + 7 * 60 * 60 * 1000);
    const year = wibTime.getUTCFullYear();
    const month = String(wibTime.getUTCMonth() + 1).padStart(2, '0');
    const day = String(wibTime.getUTCDate()).padStart(2, '0');
    return `${day}-${month}-${year}`;
  };

  const { data, loading, error, hasMore, refetch, loadMore, reset } = useReportData({
    apiEndpoint: 'hutang-obat/index',
    apiVersion: 'api5',
    apiParams: {
      date: getTodayWIB(),
      tanggalawal: '',
      tanggalakhir: '',
      tahun: '',
      bulan: '',
      pemofaktur: '',
      supnama: '',
      sorting: '',
      deadline: '',
      cari: 4,
      reg: 'db',
    },
    apiNormalizer,
  });

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleFetchData = useCallback((filters: any) => {
    refetch({
      date: getTodayWIB(),
      tanggalawal: fmtDate(filters.start),
      tanggalakhir: fmtDate(filters.end),
      cari: 4,
      bulan: '',
      tahun: '',
      pemofaktur: filters.search || '',
      supnama: filters.search || '',
      a: filters.cabang,
      reg: filters.cabangReg,
      device: 'mobile',
    });
  }, [refetch]);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const total = data.reduce((s, r) => s + (r.totalBayar as number), 0);

  return (
    <ReportTable
      title="Hutang Obat"
      columns={[
        { key: 'no', label: 'No', align: 'center', width: 36 },
        { key: 'tanggal', label: 'Tgl', width: 70, sortingField: 'pemotanggal' },
        { key: 'noFaktur', label: 'No Faktur', width: 90, sortingField: 'pemofaktur' },
        { key: 'supplier', label: 'Supplier', width: 100, sortingField: 'supnama' },
        { key: 'totalBayar', label: 'Total Bayar', align: 'right', width: 90, sortingField: 'jml_bayar',
          render: (r) => formatRupiah(r.totalBayar as number) },
      ]}
      data={data}
      loading={loading}
      error={error}
      hasMore={hasMore}
      onLoadMore={loadMore}
      onFetchData={handleFetchData}
      onSortChange={(sorting) => refetch({ sorting })}
      totalLabel="Total Pembayaran Hutang"
      totalValue={formatRupiah(total)}
      searchFields={['noFaktur', 'supplier']}
      searchPlaceholder="No faktur / supplier"
      dateField="tanggal"
      onReset={reset}
    />
  );
}
