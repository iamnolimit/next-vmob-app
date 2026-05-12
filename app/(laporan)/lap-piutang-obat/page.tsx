'use client';
import ReportTable from '@/components/ReportTable';
import { lapPiutangObat, totalPiutangObat, formatRupiah, formatNumber } from '@/lib/dummyData';

export default function LapPiutangObatPage() {
  return (
    <ReportTable
      title="Laporan Piutang Obat"
      columns={[
        { key: 'no', label: 'No', align: 'center', width: 40 },
        { key: 'noFaktur', label: 'No Faktur', width: 150 },
        { key: 'pasien', label: 'Pasien', width: 140 },
        { key: 'jatuhTempo', label: 'Jatuh Tempo', align: 'center', width: 110 },
        { key: 'total', label: 'Total', align: 'right', width: 130,
          render: (r) => formatNumber(r.total as number) },
      ]}
      data={lapPiutangObat as unknown as Record<string, unknown>[]}
      totalLabel="Total Kekurangan"
      totalValue={formatRupiah(totalPiutangObat)}
      searchFields={['noFaktur', 'pasien']}
      searchPlaceholder="No faktur / pasien"
      intervalOptions={[
        { label: 'Semua Data', value: 'all' },
        { label: 'Jatuh Tempo', value: 0 },
        { label: '7 Hari', value: 7 },
        { label: '15 Hari', value: 15 },
        { label: '30 Hari', value: 30 },
      ]}
      intervalTitle="Jatuh Tempo"
      dateField="jatuhTempo"
    />
  );
}
