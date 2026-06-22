'use client';
import { useCallback } from 'react';
import ReportTable from '@/components/ReportTable';
import { useReportData } from '@/lib/useReportData';
import { formatRupiah } from '@/lib/dummyData';
import { useGudangOptions } from '@/lib/useGudangOptions';

export default function LapPembelianObatPage() {
  const { gudangOptions } = useGudangOptions();
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
      gudang: item.gudnama || '-',
      total: parseFloat(item.pemograndtotal || 0),
      rawData: item,
    }));
  }, []);

  const { data, loading, error, hasMore, refetch, loadMore, reset } = useReportData({
    apiEndpoint: 'laporan-transaksi-pembelian-obat/index',
    apiVersion: 'api7',
    apiParams: {
      carimobile: '',
      sorting: '',
      reg: 'db',
      cari: 4,
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
  const handleFetchData = useCallback((filters: any) => {
    refetch({
      tanggalawal: fmtDate(filters.start),
      tanggalakhir: fmtDate(filters.end),
      carimobile: filters.search,
      a: filters.cabang,
      reg: filters.cabangReg,
      gudid: filters.gudang || '',
    });
  }, [refetch]);

  const handleLoadMore = useCallback(() => {
    loadMore();
  }, [loadMore]);

  const total = data.reduce((s, r) => s + (r.total as number), 0);

  return (
    <ReportTable
      title="Pembelian Obat"
      columns={[
        { key: 'no', label: 'No', align: 'center', width: 36 },
        { key: 'tanggal', label: 'Tgl', width: 70 },
        { key: 'noFaktur', label: 'No Faktur', width: 90 },
        { key: 'supplier', label: 'Supplier', width: 90 },
        { key: 'gudang', label: 'Gudang', width: 70 },
        { key: 'total', label: 'Total', align: 'right', width: 90,
          render: (r) => formatRupiah(r.total as number) },
      ]}
      data={data}
      loading={loading}
      error={error}
      hasMore={hasMore}
      onLoadMore={handleLoadMore}
      totalLabel="Total Pembelian"
      totalValue={formatRupiah(total)}
      searchFields={['noFaktur', 'supplier', 'gudang']}
      searchPlaceholder="No faktur / supplier / gudang"
      dateField="tanggal"
      gudangOptions={gudangOptions}
      gudangField="gudang"
      onFetchData={handleFetchData}
      onReset={reset}
    />
  );
}
