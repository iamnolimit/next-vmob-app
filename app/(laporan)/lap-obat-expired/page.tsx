'use client';
import { useCallback } from 'react';
import ReportTable from '@/components/ReportTable';
import { useReportData } from '@/lib/useReportData';
import { useGudangOptions } from '@/lib/useGudangOptions';

export default function LapObatExpiredPage() {
  const { gudangOptions } = useGudangOptions();
  const formatExpiredDate = (dateString: string) => {
    if (!dateString || dateString === '-') return '-';
    try {
      let date;
      if (dateString.includes('-') && dateString.split('-')[0].length === 4) {
        date = new Date(dateString);
      } else if (dateString.includes('-') && dateString.split('-')[2].length === 4) {
        const [day, month, year] = dateString.split('-');
        date = new Date(`${year}-${month}-${day}`);
      } else {
        date = new Date(dateString);
      }
      if (isNaN(date.getTime())) return dateString;
      const months = ['Jan','Feb','Mar','Apr','Mei','Jun','Jul','Agt','Sep','Okt','Nov','Des'];
      const day = String(date.getDate()).padStart(2, '0');
      const month = months[date.getMonth()];
      const year = date.getFullYear();
      return `${day} ${month} ${year}`;
    } catch (error) {
      return dateString;
    }
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const apiNormalizer = useCallback((rawData: any, offset = 0) => {
    const dataArray = rawData?.data || rawData;
    if (!Array.isArray(dataArray)) return [];

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return dataArray.map((item: any, index: number) => ({
      no: offset + index + 1,
      gudang: item.gudnama || '-',
      namaObat: `${item.obatnama || '-'} (BATCH: ${item.mshnobatch || '-'})`,
      sisaStok: `${item.stokakhir || '0'} ${item.sonama || ''}`.trim(),
      tanggalExpired: formatExpiredDate(item.mshtglexpired),
      rawData: item,
    }));
  }, []);

  const getTodayWIB = () => {
    const now = new Date();
    const wibTime = new Date(now.getTime() + 7 * 60 * 60 * 1000);
    const year = wibTime.getUTCFullYear();
    const month = String(wibTime.getUTCMonth() + 1).padStart(2, '0');
    const day = String(wibTime.getUTCDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const { data, loading, error, hasMore, refetch, loadMore, reset } = useReportData({
    apiEndpoint: 'ap-obatexpired-batch/index-v2',
    apiVersion: 'api7',
    apiParams: {
      date: getTodayWIB(),
      sorting: '',
      gudid: 1,
      carimobile: '',
      custombatch: true,
      mn_jenis: 3,
      cari: 1,
    },
    apiNormalizer,
  });

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleFetchData = useCallback((filters: any) => {
    const cari = filters.interval ?? 1;
    refetch({
      carimobile: filters.search,
      cari,
      a: filters.cabang,
      reg: filters.cabangReg,
      gudid: filters.gudang || '',
    });
  }, [refetch]);

  const handleLoadMore = useCallback(() => {
    loadMore();
  }, [loadMore]);

  return (
    <ReportTable
      title="Obat Expired"
      columns={[
        { key: 'no', label: 'No', align: 'center', width: 40 },
        { key: 'gudang', label: 'Gudang', width: 80 },
        { key: 'namaObat', label: 'Nama Obat', width: 120 },
        { key: 'sisaStok', label: 'Sisa Stok', align: 'right', width: 80 },
        { key: 'tanggalExpired', label: 'Tgl Expired', align: 'center', width: 80 },
      ]}
      data={data}
      loading={loading}
      error={error}
      hasMore={hasMore}
      onLoadMore={handleLoadMore}
      searchFields={['namaObat', 'gudang']}
      searchPlaceholder="Nama obat / Batch / gudang"
      intervalOptions={[
        { label: 'Sudah Expired', value: 1 },
        { label: '30 Hari', value: 2 },
        { label: '15 Hari', value: 3 },
        { label: '7 Hari', value: 4 },
      ]}
      intervalTitle="Berdasarkan Tanggal Expired"
      gudangOptions={gudangOptions}
      gudangField="gudang"
      onFetchData={handleFetchData}
      onReset={reset}
    />
  );
}
