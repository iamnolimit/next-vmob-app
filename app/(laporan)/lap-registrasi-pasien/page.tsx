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

  const { data, refetch } = useReportData({
    apiEndpoint: 'laporanmasterpasien/index',
    apiVersion: 'api5',
    apiParams: {
      filter: '',
      sorting: '',
      limit: 1000,
      offset: 0,
      reg: 'db',
      pasaktif: 1,
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
      filter: filters.search,
    });
  }, [refetch]);

  return (
    <ReportTable
      title="Laporan Registrasi Pasien"
      columns={[
        { key: 'no', label: 'No', align: 'center', width: 40 },
        { key: 'tanggal', label: 'Tanggal', width: 100 },
        { key: 'noRM', label: 'No. RM', width: 100 },
        { key: 'pasien', label: 'Pasien', width: 140 },
        { key: 'alamat', label: 'Alamat', width: 200 },
      ]}
      data={data}
      totalLabel="Total Registrasi"
      totalValue={`${data.length} Pasien`}
      searchFields={['noRM', 'pasien', 'alamat']}
      searchPlaceholder="No RM / pasien / alamat"
      dateField="tanggal"
      onFetchData={handleFetchData}
    />
  );
}
