'use client';
import MaintenancePage from '@/components/MaintenancePage';
import ReportTable from '@/components/ReportTable';
import { formatRupiah } from '@/lib/dummyData';
import { useReportData } from '@/lib/useReportData';

export default function LapTagihanJaminanPage() {
  if (process.env.NEXT_PUBLIC_ACTIVE_HIDDEN_MENU !== 'true') return <MaintenancePage title="Laporan Tagihan Jaminan" />;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const apiNormalizer = (rawData: any, offset = 0) => {
    const dataArray = rawData?.data || rawData;
    if (!Array.isArray(dataArray)) return [];

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return dataArray.map((item: any, index: number) => ({
      no: offset + index + 1,
      tanggal: item.tgl || '-',
      noFaktur: item.pemnofaktur || '-',
      noRM: item.pasrm || '-',
      pasien: item.pasnama || '-',
      jaminan: item.katnama || '-',
      totalBiaya: parseFloat(item.pemtunai || '0'),
      rawData: item,
    }));
  };

  const fmtDate = (isoDate: string) => {
    if (!isoDate) return '';
    const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
    const [y, m, d] = isoDate.split('-');
    return `${d} ${months[Number(m) - 1]} ${y}`;
  };

  const { data, loading, error, hasMore, refetch, loadMore, reset } = useReportData({
    apiEndpoint: 'laporan-tagihan-jaminan-pasien/index',
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

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const totalTagihanJaminan = data.reduce((sum: number, item: any) => sum + (item.totalBiaya || 0), 0);

  return (
    <ReportTable
      title="Tagihan Jaminan Pasien"
      columns={[
        { key: 'no', label: 'No', align: 'center', width: 40 },
        { key: 'noFaktur', label: 'No. Faktur', width: 100 },
        { key: 'pasien', label: 'Pasien', width: 100 },
        { key: 'jaminan', label: 'Jaminan', width: 100 },
        { key: 'totalBiaya', label: 'Total', align: 'right',
          render: (r) => formatRupiah(r.totalBiaya as number) },
      ]}
      data={data}
      loading={loading}
      error={error}
      hasMore={hasMore}
      onLoadMore={loadMore}
      onFetchData={(params) => {
        const periodToCari = (p: string) => p === 'tahun' ? '2' : p === 'bulan' ? '3' : '4';
        const cari = periodToCari(params.periodType || 'tanggal');
        const [startY, startM] = params.start.split('-');
        const [endY] = params.end.split('-');
        refetch({
          tanggalawal: fmtDate(params.start),
          tanggalakhir: fmtDate(params.end),
          cari,
          bulan: cari === '3' ? startM : '',
          tahun: cari === '2' ? endY : cari === '3' ? startY : '',
          filter: params.search || '',
          a: params.cabang,
          reg: params.cabangReg,
          device: 'mobile',
        });
      }}
      totalLabel="Total Biaya"
      totalValue={formatRupiah(totalTagihanJaminan)}
      searchFields={['noFaktur', 'pasien', 'jaminan']}
      searchPlaceholder="No. Faktur / Pasien / Jaminan"
      dateField="tanggal"
      onReset={reset}
    />
  );
}
