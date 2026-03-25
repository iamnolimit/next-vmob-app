'use client';
import ReportTable from '@/components/ReportTable';
import { lapRegistrasiPasien } from '@/lib/dummyData';

export default function LapRegistrasiPasienPage() {
  return (
    <ReportTable
      title="Laporan Registrasi Pasien"
      columns={[
        { key: 'no', label: 'No', align: 'center', width: 40 },
        { key: 'tanggal', label: 'Tanggal', width: 100 },
        { key: 'noRM', label: 'No. RM', width: 100 },
        { key: 'pasien', label: 'Pasien', width: 140 },
        { key: 'alamat', label: 'Alamat', width: 200 },
      ]}
      data={lapRegistrasiPasien as unknown as Record<string, unknown>[]}
      totalLabel="Total Registrasi"
      totalValue={`${lapRegistrasiPasien.length} Pasien`}
      searchFields={['noRM', 'pasien', 'alamat']}
      searchPlaceholder="No RM / pasien / alamat"
    />
  );
}
