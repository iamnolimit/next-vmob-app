'use client';
import ReportTable from '@/components/ReportTable';
import { lapKunjunganPasien } from '@/lib/dummyData';

export default function LapKunjunganPasienPage() {
  return (
    <ReportTable
      title="Laporan Kunjungan Pasien"
      columns={[
        { key: 'no', label: 'No', align: 'center', width: 40 },
        { key: 'tanggal', label: 'Tanggal', width: 100 },
        { key: 'nama', label: 'Nama', width: 140 },
        { key: 'poli', label: 'Poli', width: 110 },
        { key: 'dokter', label: 'Dokter', width: 140 },
      ]}
      data={lapKunjunganPasien as unknown as Record<string, unknown>[]}
      totalLabel="Total Kunjungan"
      totalValue={`${lapKunjunganPasien.length} Kunjungan`}
      searchFields={['nama', 'poli', 'dokter', 'noRM']}
      searchPlaceholder="Pasien / No. RM / poli / dokter"
    />
  );
}
