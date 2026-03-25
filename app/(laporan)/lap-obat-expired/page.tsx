'use client';
import ReportTable from '@/components/ReportTable';
import { lapObatExpired, cabangOptions } from '@/lib/dummyData';

export default function LapObatExpiredPage() {
  return (
    <ReportTable
      title="Laporan Obat Expired"
      columns={[
        { key: 'no', label: 'No', align: 'center', width: 40 },
        { key: 'namaObat', label: 'Nama Obat', width: 220 },
        { key: 'sisaStok', label: 'Sisa Stok', align: 'right', width: 110 },
        { key: 'tanggalExpired', label: 'Tanggal Expired', align: 'center', width: 130 },
      ]}
      data={lapObatExpired as unknown as Record<string, unknown>[]}
      searchFields={['namaObat']}
      searchPlaceholder="Nama obat / Batch"
      intervalOptions={[
        { label: 'Sudah Expired', value: 1 },
        { label: '30 Hari', value: 2 },
        { label: '15 Hari', value: 3 },
        { label: '7 Hari', value: 4 },
        { label: 'Tanggal', value: 5 },
      ]}
      intervalTitle="Periode Expired"
      cabangOptions={cabangOptions}
    />
  );
}
