'use client';
import ReportTable from '@/components/ReportTable';
import { lapStokOpname, totalNominalSelisih, formatRupiah, formatNumber, cabangOptions, gudangOptions } from '@/lib/dummyData';

export default function LapStokOpnamePage() {
  return (
    <ReportTable
      title="Laporan Stok Opname"
      columns={[
        { key: 'no', label: 'No', align: 'center', width: 40 },
        { key: 'gudang', label: 'Gudang', width: 120 },
        { key: 'namaObat', label: 'Nama Obat', width: 190 },
        { key: 'selisih', label: 'Selisih', align: 'right', width: 80 },
        { key: 'nominalSelisih', label: 'Nominal Selisih', align: 'right', width: 140,
          render: (r) => formatNumber(r.nominalSelisih as number) },
      ]}
      data={lapStokOpname as unknown as Record<string, unknown>[]}
      totalLabel="Total HPP"
      totalValue={formatRupiah(totalNominalSelisih)}
      searchFields={['namaObat', 'gudang']}
      searchPlaceholder="Nama obat / gudang"
      hideDateFilter
      cabangOptions={cabangOptions}
      gudangOptions={gudangOptions}
      gudangField="gudang"
    />
  );
}
