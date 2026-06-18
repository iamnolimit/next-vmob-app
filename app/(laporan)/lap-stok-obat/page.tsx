'use client';
import { useCallback } from 'react';
import ReportTable from '@/components/ReportTable';
import { useReportData } from '@/lib/useReportData';
import { gudangOptions } from '@/lib/dummyData';

export default function LapStokObatPage() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const apiNormalizer = useCallback((rawData: any, offset = 0) => {
    const dataArray = rawData?.data || rawData;
    if (!Array.isArray(dataArray)) return [];

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return dataArray.map((item: any, index: number) => {
      const stokParts = [];
      if (item.sonama1 && item.stok1) stokParts.push(`${parseFloat(item.stok1)} ${item.sonama1}`);
      if (item.sonama2 && item.stok2 && item.stok2 !== '0') stokParts.push(`${parseFloat(item.stok2)} ${item.sonama2}`);
      if (item.sonama3 && item.stok3 && item.stok3 !== '0' && item.stok3 !== '-') stokParts.push(`${parseFloat(item.stok3)} ${item.sonama3}`);
      if (item.sonama4 && item.stok4 && item.stok4 !== '0' && item.stok4 !== '-') stokParts.push(`${parseFloat(item.stok4)} ${item.sonama4}`);
      const stokDisplay = stokParts.length > 0 ? stokParts.join('\n') : '-';

      return {
        no: offset + index + 1,
        gudang: item.gudnama || '-',
        kodeObat: item.obatkode || '-',
        namaObat: item.obatnama || '-',
        stok: stokDisplay,
        rawData: item,
      };
    });
  }, []);

  const { data, refetch } = useReportData({
    apiEndpoint: 'ap-lapstok-batch/kartu3-v2',
    apiVersion: 'api5',
    apiParams: {
      filter: '',
      sorting: '',
      limit: 1000,
      offset: 0,
      reg: 'db',
      cari: 4,
      device: 'mobile',
    },
    apiNormalizer,
  });

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleFetchData = useCallback((filters: any) => {
    refetch({
      filter: filters.search,
    });
  }, [refetch]);

  return (
    <ReportTable
      title="Laporan Stok Obat"
      columns={[
        { key: 'no', label: 'No', align: 'center', width: 40 },
        { key: 'gudang', label: 'Gudang', width: 130 },
        { key: 'kodeObat', label: 'Kode Obat', width: 110 },
        { key: 'namaObat', label: 'Nama Obat', width: 190 },
        { key: 'stok', label: 'Stok', align: 'right', width: 120 },
      ]}
      data={data}
      searchFields={['namaObat', 'kodeObat', 'gudang']}
      searchPlaceholder="Kode Obat / Nama obat"
      hideDateFilter
      gudangOptions={gudangOptions}
      gudangField="gudang"
      onFetchData={handleFetchData}
    />
  );
}
