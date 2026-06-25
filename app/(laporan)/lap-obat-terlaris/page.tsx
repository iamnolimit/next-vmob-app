'use client';
import { useCallback } from 'react';
import ReportTable from '@/components/ReportTable';
import { useReportData } from '@/lib/useReportData';
import { formatRupiah } from '@/lib/dummyData';

export default function LapObatTerlarisPage() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const apiNormalizer = useCallback((rawData: any, offset = 0) => {
    const dataArray = rawData?.data?.data || rawData?.data || rawData;
    if (!Array.isArray(dataArray)) return [];

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const validData = dataArray.filter((item: any) => {
      const hasAnyValue = Object.values(item).some(
        (val) => val !== null && val !== undefined && val !== ''
      );
      const hasRequiredFields =
        item.obatid && item.obatnama && item.jmlterjual !== null && item.jmlterjual !== undefined;
      return hasAnyValue && hasRequiredFields;
    });

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return validData.map((item: any, index: number) => ({
      no: offset + index + 1,
      namaObat: item.obatnama || '-',
      jumlahTerjual: `${parseFloat(item.jmlterjual || 0).toLocaleString('id-ID')} ${item.sonama || ''}`,
      jumlahTerjualRaw: parseFloat(item.jmlterjual || 0),
      jumlahTransaksi: parseFloat(item.jmlfaktur || 0),
      nominal: parseFloat(item.nominaltotal || 0),
      rawData: item,
    }));
  }, []);

  const { data, loading, error, hasMore, refetch, loadMore, reset } = useReportData({
    apiEndpoint: 'ap-lapobatlaris/index-v3',
    apiVersion: 'api5',
    apiParams: {
      mn_jenis: 3,
      namaobat: '',
      sorting: '',
      device: 'mobile',
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
      namaobat: filters.search,
      a: filters.cabang,
      reg: filters.cabangReg,
      device: 'mobile',
    });
  }, [refetch]);

  const handleLoadMore = useCallback(() => {
    loadMore();
  }, [loadMore]);

  const totalNominal = data.reduce((s, r) => s + (r.nominal as number), 0);

  return (
    <ReportTable
      title="Obat Terlaris"
      columns={[
        { key: 'no', label: 'No', align: 'center', width: 40 },
        { key: 'namaObat', label: 'Nama Obat', width: 120 },
        { key: 'jumlahTerjual', label: 'Jml Terjual', align: 'right', width: 80 },
        { key: 'jumlahTransaksi', label: 'Jml Transaksi', align: 'right', width: 80,
          render: (r) => Number(r.jumlahTransaksi).toLocaleString('id-ID') },
        { key: 'nominal', label: 'Nominal', align: 'right',
          render: (r) => formatRupiah(r.nominal as number) },
      ]}
      data={data}
      loading={loading}
      error={error}
      hasMore={hasMore}
      onLoadMore={handleLoadMore}
      totalLabel="Total Nominal"
      totalValue={formatRupiah(totalNominal)}
      searchFields={['namaObat']}
      searchPlaceholder="Nama obat"
      onFetchData={handleFetchData}
      onReset={reset}
    />
  );
}
