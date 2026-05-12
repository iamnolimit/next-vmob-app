'use client';
import ReportTable from '@/components/ReportTable';
import { lapObatExpired, cabangOptions, gudangOptions } from '@/lib/dummyData';

export default function LapObatExpiredPage() {
  return (
    <ReportTable
      title="Laporan Obat Expired"
      columns={[
        { key: 'no', label: 'No', align: 'center', width: 40 },
        { key: 'gudang', label: 'Gudang', width: 120 },
        { key: 'namaObat', label: 'Nama Obat', width: 210 },
        { key: 'sisaStok', label: 'Sisa Stok', align: 'right', width: 110 },
        { key: 'tanggalExpired', label: 'Tgl Expired', align: 'center', width: 110 },
      ]}
      data={lapObatExpired as unknown as Record<string, unknown>[]}
      searchFields={['namaObat', 'gudang']}
      searchPlaceholder="Nama obat / Batch / gudang"
      intervalOptions={[
        { label: 'Sudah Expired', value: 1 },
        { label: '30 Hari', value: 2 },
        { label: '15 Hari', value: 3 },
        { label: '7 Hari', value: 4 },
        { label: 'Tanggal', value: 5 },
      ]}
      intervalTitle="Periode Expired"
      cabangOptions={cabangOptions}
      gudangOptions={gudangOptions}
      gudangField="gudang"
    />
  );
}
