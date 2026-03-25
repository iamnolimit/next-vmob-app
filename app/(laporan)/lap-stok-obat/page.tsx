'use client';
import ReportTable from '@/components/ReportTable';
import { lapStokObat } from '@/lib/dummyData';

export default function LapStokObatPage() {
  return (
    <ReportTable
      title="Laporan Stok Obat"
      columns={[
        { key: 'no', label: 'No', align: 'center', width: 40 },
        { key: 'gudang', label: 'Gudang', width: 130 },
        { key: 'kodeObat', label: 'Kode Obat', width: 110 },
        { key: 'namaObat', label: 'Nama Obat', width: 190 },
        { key: 'stok', label: 'Stok', align: 'right', width: 120 },
      ]}
      data={lapStokObat as unknown as Record<string, unknown>[]}
      searchFields={['namaObat', 'kodeObat', 'gudang']}
      searchPlaceholder="Kode Obat / Nama obat"
      hideDateFilter
    />
  );
}
