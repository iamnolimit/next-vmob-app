'use client';
import ReportTable from '@/components/ReportTable';
import { lapPergantianShift, totalSaldoKasir, formatRupiah, formatNumber } from '@/lib/dummyData';

export default function LapPergantianShiftPage() {
  return (
    <ReportTable
      title="Laporan Pergantian Shift"
      columns={[
        { key: 'no', label: 'No', align: 'center', width: 40 },
        { key: 'bukaShift', label: 'Buka Shift', width: 160 },
        { key: 'tutupShift', label: 'Tutup Shift', width: 160 },
        { key: 'kasir', label: 'Kasir', width: 120 },
        { key: 'saldoKasir', label: 'Saldo Kasir', align: 'right', width: 130,
          render: (r) => formatNumber(r.saldoKasir as number) },
      ]}
      data={lapPergantianShift as unknown as Record<string, unknown>[]}
      totalLabel="Total Saldo Kasir"
      totalValue={formatRupiah(totalSaldoKasir)}
      searchFields={['kasir']}
      searchPlaceholder="Kasir"
    />
  );
}
