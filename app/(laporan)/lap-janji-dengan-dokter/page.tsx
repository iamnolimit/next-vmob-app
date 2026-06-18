'use client';
import { useCallback } from 'react';
import ReportTable from '@/components/ReportTable';
import { useReportData } from '@/lib/useReportData';

export default function LapJanjiDenganDokterPage() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const apiNormalizer = useCallback((rawData: any, offset = 0) => {
    const dataArray = rawData?.data || rawData;
    if (!Array.isArray(dataArray)) return [];

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return dataArray.map((item: any, index: number) => ({
      no: offset + index + 1,
      tanggal: item.jantanggal || '-',
      pasien: item.pasnama || '-',
      dokter: item.doknama || '-',
      keterangan: item.janketerangan || '-',
      noRM: item.pasrm || '-',
      rawData: item,
    }));
  }, []);

  const { data, refetch } = useReportData({
    apiEndpoint: 'laporan-janji/index',
    apiVersion: 'api5',
    apiParams: {
      filter: '',
      sorting: '',
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
      tanggalawal: formatDate(filters.start),
      tanggalakhir: formatDate(filters.end),
      filter: filters.search,
    });
  }, [refetch]);

  return (
    <ReportTable
      title="Laporan Janji Dengan Dokter"
      columns={[
        { key: 'no', label: 'No', align: 'center', width: 40 },
        { key: 'tanggal', label: 'Tanggal', width: 150 },
        { key: 'pasien', label: 'Pasien', width: 130 },
        { key: 'dokter', label: 'Dokter', width: 140 },
        { key: 'keterangan', label: 'Keterangan', width: 170 },
      ]}
      data={data}
      totalLabel="Total Janji"
      totalValue={`${data.length} Janji`}
      searchFields={['pasien', 'dokter', 'keterangan', 'noRM']}
      searchPlaceholder="Pasien / No. RM / dokter / keterangan"
      dateField="tanggal"
      onFetchData={handleFetchData}
    />
  );
}
