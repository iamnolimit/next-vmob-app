export const STATS_TO_ROUTE_MAP: Record<string, string | null> = {
  // Dashboard Stats -> Laporan
  'Penjualan Kasir': '/lap-penjualan-obat',
  'Penjualan Online': '/lap-penjualan-obat',
  'Pemeriksaan Klinik': null,
  'Pendapatan HomeCare': null,
  'Total Pendapatan': null,

  // Forecast Stats -> Laporan
  'Pareto A': '/lap-penjualan-obat',
  'Pareto B': '/lap-penjualan-obat',
  'Pareto C': '/lap-penjualan-obat',
  'Dibawah Pareto C (Stok Mati)': '/lap-penjualan-obat',
  'Stock On Hand': '/lap-stok-opname',
  'Over Stock': '/lap-stok-opname',
  'Under Stock': '/lap-stok-opname',
  'Potential Lost': '/lap-obat-stok-habis',
  'Kategori Obat Terlaris': '/lap-obat-terlaris',

  // Customer Stats -> Laporan
  'Pasien Baru': '/lap-registrasi-pasien',
  'Kunjungan Pasien': '/lap-kunjungan-pasien',

  // Obat Stats -> Laporan
  'Nilai Stok Obat': null,
  'Obat Expired': '/lap-obat-expired',
  'Obat Stok Habis': '/lap-obat-stok-habis',
  'Obat Hilang': '/lap-stok-opname',
  'Pembelian Obat Terbanyak': '/lap-pembelian-obat',
  'Obat Terlaris': '/lap-obat-terlaris',

  // Keuangan Stats -> Laporan
  'Total Aset': null,
  'Total Cash': null,
  'Total Pasiva': null,
  'Total Pengeluaran': null,
  'Laba Rugi': null,
  'Hutang Obat Jatuh Tempo': '/lap-hutang-obat',
  'Piutang Apotek Jatuh Tempo': '/lap-piutang-obat',
  'Piutang Klinik Jatuh Tempo': '/lap-piutang-klinik',
};

export const getStatsRoute = (label: string): string | null => {
  return STATS_TO_ROUTE_MAP[label] || null;
};
