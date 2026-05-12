'use client';
import ReportTable from '@/components/ReportTable';
import { lapPendapatanPetugasMedis, totalPendapatanPetugasMedis, formatRupiah } from '@/lib/dummyData';

export default function LapPendapatanPetugasMedisPage() {
  return (
    <ReportTable
      title="Laporan Pendapatan Petugas Medis"
      columns={[
        { key: 'no', label: 'No', align: 'center', width: 40 },
        { key: 'dokter', label: 'Dokter', width: 150 },
        { key: 'noFaktur', label: 'No. Faktur', width: 130 },
        { key: 'pemeriksaan', label: 'Pemeriksaan', width: 150 },
        { key: 'feeDokter', label: 'Fee Dokter', align: 'right', width: 120,
          render: (r) => formatRupiah(r.feeDokter as number) },
      ]}
      data={lapPendapatanPetugasMedis as unknown as Record<string, unknown>[]}
      totalLabel="Total Pendapatan Dokter"
      totalValue={formatRupiah(totalPendapatanPetugasMedis)}
      searchFields={['dokter', 'noFaktur', 'pemeriksaan']}
      searchPlaceholder="Dokter / No. Faktur / pemeriksaan"
      dateField="tanggal"
    />
  );
}
