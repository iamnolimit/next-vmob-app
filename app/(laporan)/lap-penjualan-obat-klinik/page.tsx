'use client';
import { useCallback } from 'react';
import ReportTable from '@/components/ReportTable';
import { useReportData } from '@/lib/useReportData';
import { formatRupiah, formatNumber } from '@/lib/dummyData';

export default function LapPenjualanObatKlinikPage() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const apiNormalizer = useCallback((rawData: any, offset = 0) => {
    const dataArray = rawData?.data || rawData;
    if (!Array.isArray(dataArray)) return [];

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return dataArray.map((item: any, index: number) => ({
      no: offset + index + 1,
      tanggal: item.pemtanggal || '-',
      noFaktur: item.pemnofaktur || '-',
      pasien: item.pasnama || '-',
      noRM: item.pasrm || '-',
      jenisPayment: item.pemjenis || '-',
      kategori: item.katnama || '-',
      totalObat: item.totalobat || '0',
      total: parseFloat(item.total || '0'),
      poli: item.polnama || '-',
      dokter: item.doknama || '-',
      rawData: item,
    }));
  }, []);

  const { data, refetch } = useReportData({
    apiEndpoint: 'ki-penjualanobatklinik/index',
    apiVersion: 'api5',
    apiParams: {
      cari: '4',
      sorting: '',
      limit: 1000,
      offset: 0,
      device: 'mobile',
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

  const total = data.reduce((s, r) => s + (r.total as number), 0);

  return (
    <ReportTable
      title="Laporan Penjualan Obat Klinik"
      columns={[
        { key: 'no', label: 'No', align: 'center', width: 40 },
        { key: 'noFaktur', label: 'No Faktur', width: 130 },
        { key: 'pasien', label: 'Pasien', width: 130 },
        { key: 'dokter', label: 'Dokter', width: 130 },
        { key: 'total', label: 'Total', align: 'right', width: 110,
          render: (r) => formatNumber(r.total as number) },
      ]}
      data={data}
      totalLabel="Total Penjualan"
      totalValue={formatRupiah(total)}
      searchFields={['pasien', 'noFaktur', 'dokter']}
      searchPlaceholder="No faktur / pasien / dokter"
      dateField="tanggal"
      onFetchData={handleFetchData}
    />
  );
}
