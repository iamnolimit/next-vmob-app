'use client';
import ReportTable from '@/components/ReportTable';
import { lapPenjualanObatKlinik, totalPenjualanObatKlinik, formatRupiah, formatNumber } from '@/lib/dummyData';

export default function LapPenjualanObatKlinikPage() {
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
      data={lapPenjualanObatKlinik as unknown as Record<string, unknown>[]}
      totalLabel="Total Penjualan"
      totalValue={formatRupiah(totalPenjualanObatKlinik)}
      searchFields={['pasien', 'noFaktur', 'dokter']}
      searchPlaceholder="No faktur / pasien / dokter"
      dateField="tanggal"
    />
  );
}
