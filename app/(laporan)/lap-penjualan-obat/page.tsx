'use client';
import ReportTable from '@/components/ReportTable';
import { lapPenjualanObat, formatRupiah, formatNumber, cabangOptions } from '@/lib/dummyData';

const total = lapPenjualanObat.reduce((s, r) => s + r.total, 0);

export default function LapPenjualanObatPage() {
  return (
    <ReportTable
      title="Laporan Penjualan Obat"
      columns={[
        { key: 'no', label: 'No', align: 'center', width: 40 },
        { key: 'noFaktur', label: 'No Faktur', width: 130 },
        { key: 'pasien', label: 'Pasien', width: 130 },
        { key: 'dokter', label: 'Dokter', width: 130 },
        { key: 'total', label: 'Total', align: 'right', width: 110,
          render: (r) => formatNumber(r.total as number) },
      ]}
      data={lapPenjualanObat as unknown as Record<string, unknown>[]}
      totalLabel="Total Penjualan"
      totalValue={formatRupiah(total)}
      searchFields={['noFaktur', 'pasien', 'dokter']}
      searchPlaceholder="No faktur / pasien / dokter"
      cabangOptions={cabangOptions}
      dateField="tanggal"
    />
  );
}
