/**
 * Menu Access System
 * Ported from vmedismobile iOS app (MenuAccess.swift)
 *
 * Mapping route Next.js → mn_url server (sama seperti MenuURLMapping di iOS)
 */

// Mapping route/href Next.js ke mn_url yang dipakai server
export const ROUTE_TO_MN_URL: Record<string, string> = {
  // Bottom tabs / Dashboard
  '/dashboard':  '/home',
  '/obat':       '/produk',
  '/keuangan':   '/transaksi',
  '/forecast':   '/laporan-super-pareto',  // forecast tab
  '/customer':   '/pasien',

  // Laporan Apotek
  '/lap-pembelian-obat':   '/laporan-transaksi-pembelian-obat',
  '/lap-hutang-obat':      '/laporan-transaksi-bayar-hutang',
  '/lap-penjualan-obat':   '/laporan-penjualan-obat',
  '/lap-piutang-obat':     '/laporan-piutang-obat',
  '/lap-obat-stok-habis':  '/obathabis',
  '/lap-obat-expired':     '/obatexpired',
  '/lap-obat-terlaris':    '/lap-obatlaris',
  '/lap-stok-opname':      '/laporan-stokopname',
  '/lap-stok-obat':        '/lap-stok',
  '/lap-pergantian-shift': '/laporan-gantishift',

  // Laporan Klinik - Pendaftaran
  '/lap-registrasi-pasien': '/laporan-master-pasien',
  '/lap-kunjungan-pasien':  '/laporan-transaksi-kunjungan',

  // Laporan Klinik - Pelayanan
  '/lap-janji-dengan-dokter': '/janji',

  // Laporan Klinik - Billing Kasir
  '/lap-piutang-klinik':           '/kln-piutang',
  '/lap-pembayaran-kasir':         '/kln-lap-bayar-kasir',
  '/lap-penjualan-obat-klinik':    '/laporan-penjualan-obat-klinik',
  '/lap-tagihan-jaminan':          '/laporan-tagihan-jaminan-pasien',
  '/lap-pendapatan-petugas-medis': '/laporan-pendapatan-petugas-medis',

  // Laporan Keuangan
  '/lap-neraca-umum': '/laporan-neraca-normal',
  '/lap-laba-rugi':   '/laporan-laba-rugi',

  // Sistem
  '/lap-manajemen-user':  '/user',
  '/lap-pengaturan-bank': '/pengaturan-bank',

  // Dashboard Dokter
  '/lap-dashboard-dokter': '/dashboard-dokter',
};

// mn_url yang menentukan akses ke tab Obat
const PRODUCTS_MENUS = [
  '/obat', '/pabrik', '/supplier', '/golongan-obat', '/kategori-obat',
  '/satuan', '/penjualan-obat', '/penjualan-obat-kasir-v3',
  '/pembelian-obat', '/lap-stok',
  '/laporan-penjualan-obat', '/laporan-transaksi-pembelian-obat',
  '/apt-lap-penjualanobat-batch-v2', '/stokopname',
];

// mn_url yang menentukan akses ke tab Keuangan
const ORDERS_MENUS = [
  '/laporan-neraca-normal', '/laporan-laba-rugi', '/laporan-jurnal',
  '/kl-pembayarankasir-v2', '/kln-piutang', '/laporan-piutang-klinik',
  '/akun', '/jurnal',
];

// mn_url yang menentukan akses ke tab Forecast
const FORECAST_MENUS = [
  '/laporan-super-pareto',
  '/analisa-penjualan', '/forecast-penjualan',
  '/laporan-trend-penjualan',
];

// mn_url yang menentukan akses ke Customer
const CUSTOMER_MENUS = ['/pasien', '/customer', '/laporan-pareto-pasien'];

/**
 * Cek apakah user punya akses ke route/href tertentu.
 * @param href  - path Next.js, misal '/lap-neraca-umum'
 * @param aksesMenu - array mn_url dari server (userData.aksesMenu)
 * @param lvl - level user (1 = superadmin, full access)
 */
export function hasMenuAccess(href: string, aksesMenu: string[] | undefined, lvl: number | undefined): boolean {
  // Superadmin selalu punya akses
  if (lvl === 1) return true;

  // Jika tidak ada data aksesMenu, izinkan semua (fallback)
  if (!aksesMenu || aksesMenu.length === 0) return true;

  const mnUrl = ROUTE_TO_MN_URL[href];
  if (!mnUrl) return false; // tidak ada mapping = tidak ada akses

  return aksesMenu.includes(mnUrl);
}

/**
 * Cek akses tab bottom nav berdasarkan aksesMenu.
 * Sama persis dengan logika checkTabAccess() di MainTabView.swift
 */
export function getAccessibleTabs(aksesMenu: string[] | undefined, lvl: number | undefined): Set<string> {
  const tabs = new Set<string>();

  // Superadmin: full access
  if (lvl === 1) {
    tabs.add('/dashboard');
    tabs.add('/obat');
    tabs.add('/keuangan');
    tabs.add('/forecast');
    tabs.add('/customer');
    return tabs;
  }

  // Tidak ada aksesMenu = hanya akun (tapi di Next.js tidak ada tab akun, jadi kosong)
  if (!aksesMenu || aksesMenu.length === 0) return tabs;

  // Home: ada menu apapun = ada home access
  if (aksesMenu.length > 0) tabs.add('/dashboard');

  // Obat tab
  if (aksesMenu.some(url => PRODUCTS_MENUS.includes(url))) tabs.add('/obat');

  // Keuangan tab
  if (aksesMenu.some(url => ORDERS_MENUS.includes(url))) tabs.add('/keuangan');

  // Forecast tab
  if (aksesMenu.some(url => FORECAST_MENUS.includes(url))) tabs.add('/forecast');

  // Customer
  if (aksesMenu.some(url => CUSTOMER_MENUS.includes(url))) tabs.add('/customer');

  return tabs;
}
