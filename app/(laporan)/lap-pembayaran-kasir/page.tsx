'use client';
import { useCallback } from 'react';
import ReportTable from '@/components/ReportTable';
import { useReportData } from '@/lib/useReportData';
import { formatRupiah } from '@/lib/dummyData';


export default function LapPembayaranKasirPage() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const apiNormalizer = useCallback((rawData: any, offset = 0) => {
    const dataArray = rawData?.data || rawData;
    if (!Array.isArray(dataArray)) return [];

    const months: Record<string, string> = {
      Jan: '01', Feb: '02', Mar: '03', Apr: '04', May: '05', Jun: '06',
      Jul: '07', Aug: '08', Sep: '09', Oct: '10', Nov: '11', Dec: '12',
      Mei: '05', Agt: '08', Okt: '10', Des: '12',
    };
    const toISO = (tgl: string) => {
      if (!tgl || tgl === '-') return '';
      const parts = tgl.trim().split(' ');
      if (parts.length >= 3) {
        const [d, m, y] = parts;
        return `${y}-${months[m] || '01'}-${d.padStart(2, '0')}${parts[3] ? ' ' + parts[3] : ''}`;
      }
      return tgl;
    };
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return dataArray.map((item: any, index: number) => {
      const tgl = item.pemtanggal || '-';
      return {
        no: offset + index + 1,
        tanggal: tgl,
        tanggalISO: toISO(tgl),
        noFaktur: item.pemnofaktur || '-',
        pasien: item.pasnama || '-',
        noRM: item.pasrm || '-',
        jenisPayment: item.pemjenis || '-',
        kategori: item.katnama || '-',
        total: parseFloat(item.total || '0'),
        poli: item.polnama || '-',
        dokter: item.doknama || '-',
        rawData: item,
      };
    });
  }, []);

  const { data, loading, error, hasMore, refetch, loadMore, reset } = useReportData({
    apiEndpoint: 'kl-lap-pembayarankasir-v2/index',
    apiVersion: 'api7',
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
      tanggalawal: fmtDate(filters.start),
      tanggalakhir: fmtDate(filters.end),
      cari: '4',
      bulan: '',
      tahun: '',
      filter: filters.search,
      a: filters.cabang,
      reg: filters.cabangReg,
      device: 'mobile',
    });
  }, [refetch]);

  const handleLoadMore = useCallback(() => {
    loadMore();
  }, [loadMore]);

  const total = data.reduce((s, r) => s + (r.total as number), 0);

  return (
    <ReportTable
      title="Pembayaran Kasir"
      columns={[
        { key: 'no', label: 'No', align: 'center', width: 32 },
        { key: 'tanggalISO', label: 'Tgl', width: 72, sortingField: 'bayar.pemtanggal', render: (r) => String(r.tanggal ?? '-') },
        { key: 'noFaktur', label: 'No Faktur', width: 88, sortingField: 'bayar.pemnofaktur' },
        { key: 'pasien', label: 'Pasien', sortingField: 'pasnama' },
        { key: 'dokter', label: 'Dokter', sortingField: 'doknama' },
        { key: 'total', label: 'Total', align: 'right', width: 88, sortingField: 'total',
          render: (r) => formatRupiah(r.total as number) },
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
      onSortChange={(sorting) => refetch({ sorting })}
      onReset={reset}
    />
  );
}
