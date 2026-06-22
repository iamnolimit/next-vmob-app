'use client';
import { useCallback } from 'react';
import ReportTable from '@/components/ReportTable';
import { useReportData } from '@/lib/useReportData';

export default function LapRegistrasiPasienPage() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const apiNormalizer = useCallback((rawData: any, offset = 0) => {
    const dataArray = rawData?.data || rawData;
    if (!Array.isArray(dataArray)) return [];

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return dataArray.map((item: any, index: number) => ({
      no: offset + index + 1,
      tanggal: item.tgl || item.pastglreg || '-',
      noRM: item.pasrm || '',
      pasien: item.pasnama || '-',
      alamat: item.pasalamat || '-',
      rawData: item,
    }));
  }, []);

  const { data, loading, error, hasMore, refetch, loadMore, reset } = useReportData({
    apiEndpoint: 'laporanmasterpasien/index',
    apiVersion: 'api5',
    apiParams: {
      filter: '',
      sorting: '',
      reg: 'db',
      pasaktif: 1,
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
      filter: filters.search,
      a: filters.cabang,
      reg: filters.cabangReg,
    });
  }, [refetch]);

  const handleLoadMore = useCallback(() => {
    loadMore();
  }, [loadMore]);

  return (
    <ReportTable
      title="Registrasi Pasien"
      columns={[
        { key: 'no', label: 'No', align: 'center', width: 40 },
        { key: 'tanggal', label: 'Tanggal', width: 80 },
        { key: 'noRM', label: 'No. RM', width: 100 },
        { key: 'pasien', label: 'Pasien', width: 120 },
        { key: 'alamat', label: 'Alamat' },
      ]}
      data={data}
      loading={loading}
      error={error}
      hasMore={hasMore}
      onLoadMore={handleLoadMore}
      totalLabel="Total Registrasi"
      totalValue={`${data.length} Pasien`}
      searchFields={['noRM', 'pasien', 'alamat']}
      searchPlaceholder="No RM / pasien / alamat"
      dateField="tanggal"
      onFetchData={handleFetchData}
      onReset={reset}
    />
  );
}
