'use client';
import ReportTable from '@/components/ReportTable';
import { lapPembayaranKasir, totalPembayaranKasir, formatRupiah, formatNumber } from '@/lib/dummyData';

export default function LapPembayaranKasirPage() {
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
      data={lapPembayaranKasir as unknown as Record<string, unknown>[]}
      totalLabel="Total Pembayaran"
      totalValue={formatRupiah(totalPembayaranKasir)}
      searchFields={['pasien', 'noFaktur', 'dokter']}
      searchPlaceholder="Nama Pasien / No Faktur / Dokter"
      dateField="tanggal"
    />
  );
}
