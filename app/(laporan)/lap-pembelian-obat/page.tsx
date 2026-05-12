'use client';
import ReportTable from '@/components/ReportTable';
import { lapPembelianObat, totalPembelianObat, formatRupiah, cabangOptions, gudangOptions } from '@/lib/dummyData';

export default function LapPembelianObatPage() {
  return (
    <ReportTable
      title="Laporan Pembelian Obat"
      columns={[
        { key: 'no', label: 'No', align: 'center', width: 40 },
        { key: 'tanggal', label: 'Tanggal', width: 110 },
        { key: 'noFaktur', label: 'No Faktur', width: 150 },
        { key: 'supplier', label: 'Supplier', width: 150 },
        { key: 'gudang', label: 'Gudang', width: 120 },
        { key: 'total', label: 'Total', align: 'right', width: 130,
          render: (r) => formatRupiah(r.total as number) },
      ]}
      data={lapPembelianObat as unknown as Record<string, unknown>[]}
      totalLabel="Total Pembelian"
      totalValue={formatRupiah(totalPembelianObat)}
      searchFields={['noFaktur', 'supplier', 'gudang']}
      searchPlaceholder="No faktur / supplier / gudang"
      cabangOptions={cabangOptions}
      dateField="tanggal"
      gudangOptions={gudangOptions}
      gudangField="gudang"
    />
  );
}
