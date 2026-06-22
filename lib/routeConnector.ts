export const STATS_TO_ROUTE_MAP: Record<string, string | null> = {
  // Dashboard Stats -> Laporan
  'Penjualan Kasir': '/lap-penjualan-obat',
  'Penjualan Online': '/lap-penjualan-obat',
  'Pemeriksaan Klinik': '/lap-pembayaran-kasir',
  'Pendapatan HomeCare': null,

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
  'Pasien Baru Bulan Ini': '/lap-registrasi-pasien',
  'Kunjungan Pasien': '/lap-kunjungan-pasien',
  'Kunjungan Pasien Bulan Ini': '/lap-kunjungan-pasien',
  'Loyal Customer Bulan Ini': null,
  'Potensial Customer Bulan Ini': null,
  'Prospek Customer Bulan Ini': null,
  'Belum Prospek Bulan Ini': null,
  'Total Customer Bulan Ini': null,

  // Obat Stats -> Laporan
  'Nilai Stok Obat': null,
  'Obat Expired': '/lap-obat-expired',
  'Obat Stok Habis': '/lap-obat-stok-habis',
  'Obat Hilang': '/lap-stok-opname',
  'Pembelian Obat Terbanyak': '/lap-pembelian-obat',
  'Obat Terlaris': '/lap-obat-terlaris',

  // Keuangan Stats -> Laporan
  'Total Aset': '/lap-neraca-umum',
  'Total Cash': '/lap-neraca-umum',
  'Total Pasiva': '/lap-neraca-umum',
  'Total Pendapatan': '/lap-laba-rugi',
  'Total Pengeluaran': '/lap-laba-rugi',
  'Laba Rugi': '/lap-laba-rugi',
  'Hutang Obat Jatuh Tempo': '/lap-hutang-obat',
  'Piutang Apotek Jatuh Tempo': '/lap-piutang-obat',
  'Piutang Klinik Jatuh Tempo': '/lap-piutang-klinik',
};

export const getStatsRoute = (label: string): string | null => {
  return STATS_TO_ROUTE_MAP[label] || null;
};
