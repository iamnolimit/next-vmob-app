'use client';
import { useCallback } from 'react';
import ReportTable from '@/components/ReportTable';
import { useReportData } from '@/lib/useReportData';
import { formatRupiah, formatNumber, cabangOptions, gudangOptions } from '@/lib/dummyData';

export default function LapStokOpnamePage() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const apiNormalizer = useCallback((rawData: any, offset = 0) => {
    const dataArray = rawData?.data || rawData;
    if (!Array.isArray(dataArray)) return [];

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return dataArray.map((item: any, index: number) => {
      const selisih = parseFloat(item.sopselisih || 0);
      const hargaPP = parseFloat(item.sophrgpp || 0);
      const nominalSelisih = selisih * hargaPP;
      return {
        no: offset + index + 1,
        namaObat: item.obatnama || '-',
        gudang: item.gudnama || '-',
        selisih,
        nominalSelisih,
        rawData: item,
      };
    });
  }, []);

  const { data, refetch } = useReportData({
    apiEndpoint: 'aplaporanstokopname/index',
    apiVersion: 'api5',
    apiParams: {
      namaobat: '',
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
      tglAwal: formatDate(filters.start),
      tglAkhir: formatDate(filters.end),
      namaobat: filters.search,
    });
  }, [refetch]);

  const total = data.reduce((s, r) => s + (r.nominalSelisih as number), 0);

  return (
    <ReportTable
      title="Laporan Stok Opname"
      columns={[
        { key: 'no', label: 'No', align: 'center', width: 40 },
        { key: 'gudang', label: 'Gudang', width: 120 },
        { key: 'namaObat', label: 'Nama Obat', width: 190 },
        { key: 'selisih', label: 'Selisih', align: 'right', width: 80 },
        { key: 'nominalSelisih', label: 'Nominal Selisih', align: 'right', width: 140,
          render: (r) => formatNumber(r.nominalSelisih as number) },
      ]}
      data={data}
      totalLabel="Total HPP"
      totalValue={formatRupiah(total)}
      searchFields={['namaObat', 'gudang']}
      searchPlaceholder="Nama obat / gudang"
      cabangOptions={cabangOptions}
      gudangOptions={gudangOptions}
      gudangField="gudang"
      onFetchData={handleFetchData}
    />
  );
}
