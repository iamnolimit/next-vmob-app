'use client';
import ReportTable from '@/components/ReportTable';
import { lapPembelianObat, totalPembelianObat, formatRupiah, cabangOptions } from '@/lib/dummyData';

export default function LapPembelianObatPage() {
  return (
    <ReportTable
      title="Laporan Pembelian Obat"
      columns={[
        { key: 'no', label: 'No', align: 'center', width: 40 },
        { key: 'noFaktur', label: 'No Faktur', width: 150 },
        { key: 'supplier', label: 'Supplier', width: 170 },
        { key: 'total', label: 'Total', align: 'right', width: 130,
          render: (r) => formatRupiah(r.total as number) },
      ]}
      data={lapPembelianObat as unknown as Record<string, unknown>[]}
      totalLabel="Total Pembelian"
      totalValue={formatRupiah(totalPembelianObat)}
      searchFields={['noFaktur', 'supplier']}
      searchPlaceholder="No faktur / supplier"
      cabangOptions={cabangOptions}
    />
  );
}
