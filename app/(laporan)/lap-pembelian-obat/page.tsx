'use client';
import { useCallback } from 'react';
import ReportTable from '@/components/ReportTable';
import { useReportData } from '@/lib/useReportData';
import { formatRupiah, gudangOptions } from '@/lib/dummyData';

export default function LapPembelianObatPage() {
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

  const { data, loading, error, hasMore, refetch, loadMore } = useReportData({
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
    const months = ['Jan','Feb','Mar','Apr','Mei','Jun','Jul','Agt','Sep','Okt','Nov','Des'];
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
        { key: 'no', label: 'No', align: 'center', width: 40 },
        { key: 'tanggal', label: 'Tanggal', width: 80 },
        { key: 'noFaktur', label: 'No Faktur', width: 100 },
        { key: 'supplier', label: 'Supplier', width: 100 },
        { key: 'gudang', label: 'Gudang', width: 80 },
        { key: 'total', label: 'Total', align: 'right',
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
    />
  );
}
