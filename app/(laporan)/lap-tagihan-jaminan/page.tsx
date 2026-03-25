'use client';
import ReportTable from '@/components/ReportTable';
import { lapTagihanJaminan, totalTagihanJaminan, formatRupiah } from '@/lib/dummyData';

export default function LapTagihanJaminanPage() {
  return (
    <ReportTable
      title="Laporan Tagihan Jaminan Pasien"
      columns={[
        { key: 'no', label: 'No', align: 'center', width: 40 },
        { key: 'noFaktur', label: 'No. Faktur', width: 130 },
        { key: 'pasien', label: 'Pasien', width: 130 },
        { key: 'jaminan', label: 'Jaminan', width: 140 },
        { key: 'totalBiaya', label: 'Total', align: 'right', width: 120,
          render: (r) => formatRupiah(r.totalBiaya as number) },
      ]}
      data={lapTagihanJaminan as unknown as Record<string, unknown>[]}
      totalLabel="Total Biaya"
      totalValue={formatRupiah(totalTagihanJaminan)}
      searchFields={['noFaktur', 'pasien', 'jaminan']}
      searchPlaceholder="No. Faktur / Pasien / Jaminan"
    />
  );
}
