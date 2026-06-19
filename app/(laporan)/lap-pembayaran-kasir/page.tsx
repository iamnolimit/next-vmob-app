'use client';
import { useCallback } from 'react';
import ReportTable from '@/components/ReportTable';
import { useReportData } from '@/lib/useReportData';
import { formatRupiah, formatNumber } from '@/lib/dummyData';

export default function LapPembayaranKasirPage() {
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
      total: parseFloat(item.total || '0'),
      poli: item.polnama || '-',
      dokter: item.doknama || '-',
      rawData: item,
    }));
  }, []);

  const { data, loading, error, hasMore, refetch, loadMore } = useReportData({
    apiEndpoint: 'kln-lap-bayar-kasir/index',
    apiVersion: 'api7',
    apiParams: {
      filter: '',
      sorting: '',
      reg: 'db',
      cari: 4,
      device: 'mobile',
    },
    apiNormalizer,
  });

  const fmtDate = (isoDate: string) => {
    if (!isoDate) return '';
    const months = ['Jan','Feb','Mar','Apr','Mei','Jun','Jul','Agt','Sep','Okt','Nov','Des'];
    const [y, m, d] = isoDate.split('-');
    return `${d} ${months[Number(m) - 1]} ${y}`;
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
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

  const total = data.reduce((s, r) => s + (r.total as number), 0);

  return (
    <ReportTable
      title="Laporan Pembayaran Kasir"
      columns={[
        { key: 'no', label: 'No', align: 'center', width: 40 },
        { key: 'tanggal', label: 'Tanggal', width: 100 },
        { key: 'noFaktur', label: 'No Faktur', width: 130 },
        { key: 'pasien', label: 'Pasien', width: 130 },
        { key: 'dokter', label: 'Dokter', width: 130 },
        { key: 'total', label: 'Total', align: 'right', width: 110,
          render: (r) => formatNumber(r.total as number) },
      ]}
      data={data}
      loading={loading}
      error={error}
      hasMore={hasMore}
      onLoadMore={handleLoadMore}
      totalLabel="Total Pembayaran"
      totalValue={formatRupiah(total)}
      searchFields={['pasien', 'noFaktur', 'dokter']}
      searchPlaceholder="Nama Pasien / No Faktur / Dokter"
      dateField="tanggal"
      onFetchData={handleFetchData}
    />
  );
}
