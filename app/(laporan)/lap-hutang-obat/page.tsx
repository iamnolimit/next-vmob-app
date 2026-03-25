'use client';
import ReportTable from '@/components/ReportTable';
import { lapHutangObat, totalHutangObat, formatRupiah, formatNumber } from '@/lib/dummyData';

export default function LapHutangObatPage() {
  return (
    <ReportTable
      title="Laporan Hutang Obat"
      columns={[
        { key: 'no', label: 'No', align: 'center', width: 40 },
        { key: 'noFaktur', label: 'No Faktur', width: 150 },
        { key: 'supplier', label: 'Supplier', width: 150 },
        { key: 'jatuhTempo', label: 'Jatuh Tempo', align: 'center', width: 110 },
        { key: 'total', label: 'Total', align: 'right', width: 130,
          render: (r) => formatNumber(r.total as number) },
      ]}
      data={lapHutangObat as unknown as Record<string, unknown>[]}
      totalLabel="Total Kekurangan"
      totalValue={formatRupiah(totalHutangObat)}
      searchFields={['noFaktur', 'supplier']}
      searchPlaceholder="No faktur / supplier"
      intervalOptions={[
        { label: 'Semua Data', value: 'all' },
        { label: 'Jatuh Tempo', value: 0 },
        { label: '7 Hari', value: 7 },
        { label: '15 Hari', value: 15 },
        { label: '30 Hari', value: 30 },
      ]}
      intervalTitle="Jatuh Tempo"
    />
  );
}
