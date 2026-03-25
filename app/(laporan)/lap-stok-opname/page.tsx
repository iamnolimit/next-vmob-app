'use client';
import ReportTable from '@/components/ReportTable';
import { lapStokOpname, totalNominalSelisih, formatRupiah, formatNumber, cabangOptions } from '@/lib/dummyData';

export default function LapStokOpnamePage() {
  return (
    <ReportTable
      title="Laporan Stok Opname"
      columns={[
        { key: 'no', label: 'No', align: 'center', width: 40 },
        { key: 'namaObat', label: 'Nama Obat', width: 200 },
        { key: 'selisih', label: 'Selisih', align: 'right', width: 80 },
        { key: 'nominalSelisih', label: 'Nominal Selisih', align: 'right', width: 140,
          render: (r) => formatNumber(r.nominalSelisih as number) },
      ]}
      data={lapStokOpname as unknown as Record<string, unknown>[]}
      totalLabel="Total HPP"
      totalValue={formatRupiah(totalNominalSelisih)}
      searchFields={['namaObat']}
      searchPlaceholder="Nama obat"
      hideDateFilter
      cabangOptions={cabangOptions}
    />
  );
}
