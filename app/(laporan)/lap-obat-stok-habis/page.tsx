'use client';
import ReportTable from '@/components/ReportTable';
import { lapObatStokHabis, cabangOptions } from '@/lib/dummyData';

export default function LapObatStokHabisPage() {
  return (
    <ReportTable
      title="Laporan Obat Stok Habis"
      columns={[
        { key: 'no', label: 'No', align: 'center', width: 40 },
        { key: 'namaObat', label: 'Nama Obat', width: 200 },
        { key: 'stokMinimal', label: 'Stok Minimal', align: 'right', width: 130 },
        { key: 'stokNyata', label: 'Stok Nyata', align: 'right', width: 130 },
      ]}
      data={lapObatStokHabis as unknown as Record<string, unknown>[]}
      searchFields={['namaObat']}
      searchPlaceholder="Nama obat"
      hideDateFilter
      cabangOptions={cabangOptions}
    />
  );
}
