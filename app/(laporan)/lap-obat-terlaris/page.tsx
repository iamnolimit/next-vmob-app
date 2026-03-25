'use client';
import ReportTable from '@/components/ReportTable';
import { lapObatTerlaris, totalObatTerlaris, formatRupiah, formatNumber, cabangOptions } from '@/lib/dummyData';

export default function LapObatTerlarisPage() {
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
      data={lapObatTerlaris as unknown as Record<string, unknown>[]}
      totalLabel="Total Nominal"
      totalValue={formatRupiah(totalObatTerlaris.nominal)}
      searchFields={['namaObat']}
      searchPlaceholder="Nama obat"
      cabangOptions={cabangOptions}
    />
  );
}
