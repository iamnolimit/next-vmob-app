'use client';
import { useCallback } from 'react';
import ReportTable from '@/components/ReportTable';
import { useReportData } from '@/lib/useReportData';
import { formatRupiah, formatNumber } from '@/lib/dummyData';

export default function LapPergantianShiftPage() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const apiNormalizer = useCallback((rawData: any, offset = 0) => {
    const dataArray = rawData?.data?.data || rawData?.data || rawData;
    if (!Array.isArray(dataArray)) return [];

    const formatDate = (dateString: string) => {
      if (!dateString) return '-';
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return dateString;
      const months = ['Jan','Feb','Mar','Apr','Mei','Jun','Jul','Agt','Sep','Okt','Nov','Des'];
      const day = String(date.getDate()).padStart(2, '0');
      const month = months[date.getMonth()];
      const year = date.getFullYear();
      const hours = String(date.getHours()).padStart(2, '0');
      const minutes = String(date.getMinutes()).padStart(2, '0');
      return `${day} ${month} ${year} ${hours}:${minutes}`;
    };

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return dataArray.map((item: any, index: number) => ({
      no: offset + index + 1,
      bukaShift: formatDate(item.shfbuka),
      tutupShift: formatDate(item.shftutup),
      kasir: item.username || '-',
      saldoKasir: parseFloat(item.shfakhir || 0),
      rawData: item,
    }));
  }, []);

  const { data, loading, error, hasMore, refetch, loadMore } = useReportData({
    apiEndpoint: 'aplaporangantishift/index',
    apiVersion: 'api7',
    apiParams: {
      cari: '4',
      sorting: '',
      filter: '',
      tgldirect: true,
    },
    apiNormalizer,
  });

  const fmtDateTime = (isoDate: string, isEnd: boolean) => {
    if (!isoDate) return '';
    const [y, m, d] = isoDate.split('-');
    return `${y}-${m}-${d} ${isEnd ? '23:59:59' : '00:00:00'}`;
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleFetchData = useCallback((filters: any) => {
    refetch({
      tglAwal: fmtDateTime(filters.start, false),
      tglAkhir: fmtDateTime(filters.end, true),
      filter: filters.search,
      a: filters.cabang,
      reg: filters.cabangReg,
    });
  }, [refetch]);

  const handleLoadMore = useCallback(() => {
    loadMore();
  }, [loadMore]);

  const total = data.reduce((s, r) => s + (r.saldoKasir as number), 0);

  return (
    <ReportTable
      title="Pergantian Shift"
      columns={[
        { key: 'no', label: 'No', align: 'center', width: 40 },
        { key: 'bukaShift', label: 'Buka Shift', width: 160 },
        { key: 'tutupShift', label: 'Tutup Shift', width: 160 },
        { key: 'kasir', label: 'Kasir', width: 120 },
        { key: 'saldoKasir', label: 'Saldo Kasir', align: 'right', width: 130,
          render: (r) => formatNumber(r.saldoKasir as number) },
      ]}
      data={data}
      loading={loading}
      error={error}
      hasMore={hasMore}
      onLoadMore={handleLoadMore}
      totalLabel="Total Saldo Kasir"
      totalValue={formatRupiah(total)}
      searchFields={['kasir']}
      searchPlaceholder="Kasir"
      dateField="bukaShift"
      onFetchData={handleFetchData}
    />
  );
}
