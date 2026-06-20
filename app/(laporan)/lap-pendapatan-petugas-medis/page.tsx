'use client';
import { useCallback } from 'react';
import ReportTable from '@/components/ReportTable';
import { useReportData } from '@/lib/useReportData';
import { formatRupiah } from '@/lib/dummyData';

export default function LapPendapatanPetugasMedisPage() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const apiNormalizer = useCallback((rawData: any, offset = 0) => {
    const dataArray = rawData?.data || rawData;
    if (!Array.isArray(dataArray)) return [];

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return dataArray.map((item: any, index: number) => {
      const dpemfeedokter = parseFloat(item.dpemfeedoktertext || 0);
      const dpemretfeedokter = parseFloat(item.dpemretfeedoktertext || 0);
      const feeDokter = dpemfeedokter - dpemretfeedokter;

      return {
        no: offset + index + 1,
        tanggal: item.pemtanggal || '-',
        noFaktur: item.pemnofaktur || '-',
        dokter: item.doknama || '-',
        pemeriksaan: item.bianama || '-',
        feeDokter,
        rawData: item,
      };
    });
  }, []);

  const { data, loading, error, hasMore, refetch, loadMore } = useReportData({
    apiEndpoint: 'laporan-pendapatan-petugas-medis/index',
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
      tglAwal: fmtDate(filters.start),
      tglAkhir: fmtDate(filters.end),
      filter: filters.search,
    });
  }, [refetch]);

  const handleLoadMore = useCallback(() => {
    loadMore();
  }, [loadMore]);

  const total = data.reduce((s, r) => s + (r.feeDokter as number), 0);

  return (
    <ReportTable
      title="Pendapatan Petugas Medis"
      columns={[
        { key: 'no', label: 'No', align: 'center', width: 40 },
        { key: 'dokter', label: 'Dokter', width: 100 },
        { key: 'noFaktur', label: 'No. Faktur', width: 100 },
        { key: 'pemeriksaan', label: 'Pemeriksaan', width: 100 },
        { key: 'feeDokter', label: 'Fee Dokter', align: 'right',
          render: (r) => formatRupiah(r.feeDokter as number) },
      ]}
      data={data}
      loading={loading}
      error={error}
      hasMore={hasMore}
      onLoadMore={handleLoadMore}
      totalLabel="Total Pendapatan Dokter"
      totalValue={formatRupiah(total)}
      searchFields={['dokter', 'noFaktur', 'pemeriksaan']}
      searchPlaceholder="Dokter / No. Faktur / pemeriksaan"
      dateField="tanggal"
      onFetchData={handleFetchData}
    />
  );
}
