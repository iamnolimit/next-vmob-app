'use client';
import { useCallback } from 'react';
import ReportTable from '@/components/ReportTable';
import { useReportData } from '@/lib/useReportData';
import { cabangOptions, gudangOptions } from '@/lib/dummyData';

export default function LapObatStokHabisPage() {
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

  const { data, refetch } = useReportData({
    apiEndpoint: 'ap-lapstok-batch/kartu3-v2',
    apiVersion: 'api5',
    apiParams: {
      gudid: 1,
      cari: '4',
      sorting: '',
      limit: 1000,
      offset: 0,
      reg: 'db',
      namakodemobile: '',
      obatstatus: 1,
      obathabisnotif: 1,
    },
    apiNormalizer,
  });

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleFetchData = useCallback((filters: any) => {
    refetch({
      namakodemobile: filters.search,
    });
  }, [refetch]);

  return (
    <ReportTable
      title="Laporan Obat Stok Habis"
      columns={[
        { key: 'no', label: 'No', align: 'center', width: 40 },
        { key: 'gudang', label: 'Gudang', width: 120 },
        { key: 'namaObat', label: 'Nama Obat', width: 190 },
        { key: 'stokMinimal', label: 'Stok Minimal', align: 'right', width: 120 },
        { key: 'stokNyata', label: 'Stok Nyata', align: 'right', width: 120 },
      ]}
      data={data}
      searchFields={['namaObat', 'gudang']}
      searchPlaceholder="Nama obat / gudang"
      hideDateFilter
      cabangOptions={cabangOptions}
      gudangOptions={gudangOptions}
      gudangField="gudang"
      onFetchData={handleFetchData}
    />
  );
}
