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

  const { data, refetch } = useReportData({
    apiEndpoint: 'kunjungan/index',
    apiVersion: 'api5',
    apiParams: {
      filter: '',
      sorting: '',
      limit: 1000, // Fetch all for client-side filtering
      offset: 0,
      cari: 4,
    },
    apiNormalizer,
  });

  const handleFetchData = useCallback((filters: any) => {
    // Format date to DD MMM YYYY
    const formatDate = (isoDate: string) => {
      if (!isoDate) return '';
      const months = ['Jan','Feb','Mar','Apr','Mei','Jun','Jul','Agt','Sep','Okt','Nov','Des'];
      const [y, m, d] = isoDate.split('-');
      return `${d} ${months[Number(m) - 1]} ${y}`;
    };

    refetch({
      tanggalawal: formatDate(filters.start),
      tanggalakhir: formatDate(filters.end),
      filter: filters.search,
    });
  }, [refetch]);

  return (
    <ReportTable
      title="Laporan Kunjungan Pasien"
      columns={[
        { key: 'no', label: 'No', align: 'center', width: 40 },
        { key: 'tanggal', label: 'Tanggal', width: 100 },
        { key: 'nama', label: 'Nama', width: 140 },
        { key: 'poli', label: 'Poli', width: 110 },
        { key: 'dokter', label: 'Dokter', width: 140 },
      ]}
      data={data}
      totalLabel="Total Kunjungan"
      totalValue={`${data.length} Kunjungan`}
      searchFields={['nama', 'poli', 'dokter', 'noRM']}
      searchPlaceholder="Pasien / No. RM / poli / dokter"
      dateField="tanggal"
      onFetchData={handleFetchData}
    />
  );
}
