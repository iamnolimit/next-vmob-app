'use client';
import { useCallback } from 'react';
import ReportTable from '@/components/ReportTable';
import { useReportData } from '@/lib/useReportData';

export default function LapKunjunganPasienPage() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const apiNormalizer = useCallback((rawData: any, offset = 0) => {
    // Handle nested response structure: rawData.data.data or rawData.data
    const responseData = rawData?.data || rawData;
    const dataArray = responseData?.data || responseData;
    
    if (!Array.isArray(dataArray)) return [];

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return dataArray.map((item: any, index: number) => ({
      no: offset + index + 1,
      tanggal: item.kuntgl || '-',
      nama: item.pasnama || '-',
      poli: item.polnama || '-',
      dokter: item.doknama || '-',
      kunid: item.kunid || '',
      nomorKunjungan: item.kunnomer || '-',
      noRM: item.pasrm || '-',
      jenisKelamin: item.pasjk || '-',
      status: item.kunstatus || '',
      rawData: item,
    }));
  }, []);

  const { data, loading, error, hasMore, refetch, loadMore } = useReportData({
    apiEndpoint: 'laporan-transaksi-kunjungan/index',
    apiVersion: 'api7',
    apiParams: {
      filter: '',
      sorting: '',
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

  const handleFetchData = useCallback((filters: any) => {
    refetch({
      tanggalawal: fmtDate(filters.start),
      tanggalakhir: fmtDate(filters.end),
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
      title="Kunjungan Pasien"
      columns={[
        { key: 'no', label: 'No', align: 'center', width: 40 },
        { key: 'tanggal', label: 'Tanggal', width: 80 },
        { key: 'nama', label: 'Nama', width: 120 },
        { key: 'poli', label: 'Poli', width: 100 },
        { key: 'dokter', label: 'Dokter' },
      ]}
      data={data}
      loading={loading}
      error={error}
      hasMore={hasMore}
      onLoadMore={handleLoadMore}
      totalLabel="Total Kunjungan"
      totalValue={`${data.length} Kunjungan`}
      searchFields={['nama', 'poli', 'dokter', 'noRM']}
      searchPlaceholder="Pasien / No. RM / poli / dokter"
      dateField="tanggal"
      onFetchData={handleFetchData}
    />
  );
}
