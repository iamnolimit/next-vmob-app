'use client';
import { useCallback } from 'react';
import ReportTable from '@/components/ReportTable';
import { useReportData } from '@/lib/useReportData';
import { formatRupiah, formatNumber, cabangOptions } from '@/lib/dummyData';

export default function LapObatTerlarisPage() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const apiNormalizer = useCallback((rawData: any, offset = 0) => {
    const dataArray = rawData?.data || rawData;
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

  const { data, refetch } = useReportData({
    apiEndpoint: 'ap-lapobatlaris/index-v3',
    apiVersion: 'api5',
    apiParams: {
      mn_jenis: 3,
      namaobat: '',
      sorting: '',
      limit: 1000,
      offset: 0,
      device: 'mobile',
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
      namaobat: filters.search,
    });
  }, [refetch]);

  const totalNominal = data.reduce((s, r) => s + (r.nominal as number), 0);

  return (
    <ReportTable
      title="Laporan Obat Terlaris"
      columns={[
        { key: 'no', label: 'No', align: 'center', width: 40 },
        { key: 'namaObat', label: 'Nama Obat', width: 180 },
        { key: 'jumlahTerjual', label: 'Jml Terjual', align: 'right', width: 110 },
        { key: 'jumlahTransaksi', label: 'Jml Transaksi', align: 'right', width: 100,
          render: (r) => Number(r.jumlahTransaksi).toLocaleString('id-ID') },
        { key: 'nominal', label: 'Nominal', align: 'right', width: 130,
          render: (r) => formatNumber(r.nominal as number) },
      ]}
      data={data}
      totalLabel="Total Nominal"
      totalValue={formatRupiah(totalNominal)}
      searchFields={['namaObat']}
      searchPlaceholder="Nama obat"
      cabangOptions={cabangOptions}
      onFetchData={handleFetchData}
    />
  );
}
