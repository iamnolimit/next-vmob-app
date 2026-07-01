'use client';
import MaintenancePage from '@/components/MaintenancePage';
import { useCallback } from 'react';
import ReportTable from '@/components/ReportTable';
import { useReportData } from '@/lib/useReportData';

export default function LapObatStokHabisPage() {
  if (process.env.NEXT_PUBLIC_ACTIVE_HIDDEN_MENU !== 'true') return <MaintenancePage title="Laporan Obat Stok Habis" />;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const apiNormalizer = useCallback((rawData: any, offset = 0) => {
    const dataArray = rawData?.data || rawData;
    if (!Array.isArray(dataArray)) return [];

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return dataArray.map((item: any, index: number) => {
      const stok = parseFloat(item.stok || 0);
      const stokMinimal = parseFloat(item.obatminstok || 0);
      const satuan = item.sonama || '-';

      return {
        no: offset + index + 1,
        gudang: item.gudnama || '-',
        namaObat: item.obatnama || '-',
        stokMinimal: `${stokMinimal.toFixed(2)} ${satuan}`,
        stokNyata: `${stok.toFixed(2)} ${satuan}`,
        rawData: item,
      };
    });
  }, []);

  const { data, loading, error, hasMore, refetch, loadMore, reset } = useReportData({
    apiEndpoint: 'my-data-obat/index',
    apiVersion: 'api5',
    apiParams: {
      gudid: 1,
      cari: '4',
      sorting: '',
      reg: 'db',
      obatnama: '',
      obatstatus: 1,
      obathabisnotif: 1,
      jenismenu: 'ObathabisBatchSearch',
    },
    apiNormalizer,
  });

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleFetchData = useCallback((filters: any) => {
    refetch({
      obatnama: filters.search,
      a: filters.cabang,
      reg: filters.cabangReg,
      gudid: filters.gudang || '',
      device: 'mobile',
    });
  }, [refetch]);

  const handleLoadMore = useCallback(() => {
    loadMore();
  }, [loadMore]);

  return (
    <ReportTable
      title="Obat Stok Habis"
      columns={[
        { key: 'no', label: 'No', align: 'center', width: 40 },
        { key: 'gudang', label: 'Gudang', width: 80, sortingField: 'gudnama' },
        { key: 'namaObat', label: 'Nama Obat', width: 120, sortingField: 'obatnama' },
        { key: 'stokMinimal', label: 'Stok Minimal', align: 'right', width: 80, sortingField: 'obatminstok' },
        { key: 'stokNyata', label: 'Stok Nyata', align: 'right', sortingField: 'stok' },
      ]}
      data={data}
      loading={loading}
      error={error}
      hasMore={hasMore}
      onLoadMore={handleLoadMore}
      searchFields={['namaObat', 'gudang']}
      searchPlaceholder="Nama obat / gudang"
      hideDateFilter
      gudangField="gudang"
      onFetchData={handleFetchData}
      onSortChange={(sorting) => refetch({ sorting })}
      onReset={reset}
    />
  );
}
