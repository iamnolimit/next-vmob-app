'use client';
import ReportTable from '@/components/ReportTable';
import { lapObatStokHabis, cabangOptions, gudangOptions } from '@/lib/dummyData';

export default function LapObatStokHabisPage() {
  return (
    <ReportTable
      title="Laporan Obat Stok Habis"
      columns={[
        { key: 'no', label: 'No', align: 'center', width: 40 },
        { key: 'gudang', label: 'Gudang', width: 120 },
        { key: 'namaObat', label: 'Nama Obat', width: 190 },
        { key: 'stokMinimal', label: 'Stok Minimal', align: 'right', width: 120 },
        { key: 'stokNyata', label: 'Stok Nyata', align: 'right', width: 120 },
      ]}
      data={lapObatStokHabis as unknown as Record<string, unknown>[]}
      searchFields={['namaObat', 'gudang']}
      searchPlaceholder="Nama obat / gudang"
      hideDateFilter
      cabangOptions={cabangOptions}
      gudangOptions={gudangOptions}
      gudangField="gudang"
    />
  );
}
