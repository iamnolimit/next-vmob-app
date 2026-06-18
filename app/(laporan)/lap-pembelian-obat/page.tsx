'use client';
import { useCallback } from 'react';
import ReportTable from '@/components/ReportTable';
import { useReportData } from '@/lib/useReportData';
import { formatRupiah, cabangOptions, gudangOptions } from '@/lib/dummyData';

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

  const { data, refetch } = useReportData({
    apiEndpoint: 'laporan-transaksi-pembelian-obat/index',
    apiVersion: 'api5',
    apiParams: {
      carimobile: '',
      sorting: '',
      limit: 1000,
      offset: 0,
      reg: 'db',
      cari: 4,
    },
    apiNormalizer,
  });

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleFetchData = useCallback((filters: any) => {
    const formatDate = (isoDate: string) => {
      if (!isoDate) return '';
      const months = ['Jan','Feb','Mar','Apr','Mei','Jun','Jul','Agt','Sep','Okt','Nov','Des'];
      const [y, m, d] = isoDate.split('-');
      return `${d} ${months[Number(m) - 1]} ${y}`;
    };

    refetch({
      tanggalawal: formatDate(filters.start),
      tanggalakhir: formatDate(filters.end),
      carimobile: filters.search,
    });
  }, [refetch]);

  const total = data.reduce((s, r) => s + (r.total as number), 0);

  return (
    <ReportTable
      title="Laporan Pembelian Obat"
      columns={[
        { key: 'no', label: 'No', align: 'center', width: 40 },
        { key: 'tanggal', label: 'Tanggal', width: 110 },
        { key: 'noFaktur', label: 'No Faktur', width: 150 },
        { key: 'supplier', label: 'Supplier', width: 150 },
        { key: 'gudang', label: 'Gudang', width: 120 },
        { key: 'total', label: 'Total', align: 'right', width: 130,
          render: (r) => formatRupiah(r.total as number) },
      ]}
      data={data}
      totalLabel="Total Pembelian"
      totalValue={formatRupiah(total)}
      searchFields={['noFaktur', 'supplier', 'gudang']}
      searchPlaceholder="No faktur / supplier / gudang"
      cabangOptions={cabangOptions}
      dateField="tanggal"
      gudangOptions={gudangOptions}
      gudangField="gudang"
      onFetchData={handleFetchData}
    />
  );
}
