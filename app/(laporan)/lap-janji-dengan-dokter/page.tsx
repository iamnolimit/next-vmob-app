'use client';
import ReportTable from '@/components/ReportTable';
import { lapJanjiDenganDokter } from '@/lib/dummyData';

export default function LapJanjiDenganDokterPage() {
  return (
    <ReportTable
      title="Laporan Janji Dengan Dokter"
      columns={[
        { key: 'no', label: 'No', align: 'center', width: 40 },
        { key: 'tanggal', label: 'Tanggal', width: 150 },
        { key: 'pasien', label: 'Pasien', width: 130 },
        { key: 'dokter', label: 'Dokter', width: 140 },
        { key: 'keterangan', label: 'Keterangan', width: 170 },
      ]}
      data={lapJanjiDenganDokter as unknown as Record<string, unknown>[]}
      totalLabel="Total Janji"
      totalValue={`${lapJanjiDenganDokter.length} Janji`}
      searchFields={['pasien', 'dokter', 'keterangan', 'noRM']}
      searchPlaceholder="Pasien / No. RM / dokter / keterangan"
    />
  );
}
