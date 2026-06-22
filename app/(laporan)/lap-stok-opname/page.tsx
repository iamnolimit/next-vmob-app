'use client';
import { useCallback } from 'react';
import ReportTable from '@/components/ReportTable';
import { useReportData } from '@/lib/useReportData';
import { formatRupiah } from '@/lib/dummyData';
import { useGudangOptions } from '@/lib/useGudangOptions';

export default function LapStokOpnamePage() {
  const { gudangOptions } = useGudangOptions();
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

  const { data, loading, error, hasMore, refetch, loadMore, reset } = useReportData({
    apiEndpoint: 'aplaporanstokopname/index',
    apiVersion: 'api7',
    apiParams: {
      namaobat: '',
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
      tglAwal: fmtDate(filters.start),
      tglAkhir: fmtDate(filters.end),
      namaobat: filters.search,
      a: filters.cabang,
      reg: filters.cabangReg,
      gudid: filters.gudang || '',
    });
  }, [refetch]);

  const handleLoadMore = useCallback(() => {
    loadMore();
  }, [loadMore]);

  const total = data.reduce((s, r) => s + (r.nominalSelisih as number), 0);

  return (
    <ReportTable
      title="Stok Opname"
      columns={[
        { key: 'no', label: 'No', align: 'center', width: 40 },
        { key: 'gudang', label: 'Gudang', width: 80 },
        { key: 'namaObat', label: 'Nama Obat', width: 120 },
        { key: 'selisih', label: 'Selisih', align: 'right', width: 60 },
        { key: 'nominalSelisih', label: 'Nominal Selisih', align: 'right',
          render: (r) => formatRupiah(r.nominalSelisih as number) },
      ]}
      data={data}
      loading={loading}
      error={error}
      hasMore={hasMore}
      onLoadMore={handleLoadMore}
      totalLabel="Total HPP"
      totalValue={formatRupiah(total)}
      searchFields={['namaObat', 'gudang']}
      searchPlaceholder="Nama obat / gudang"
      gudangOptions={gudangOptions}
      gudangField="gudang"
      onFetchData={handleFetchData}
      onReset={reset}
    />
  );
}
