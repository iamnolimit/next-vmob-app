// ============================================================
// DUMMY STATIC DATA untuk semua halaman mobile Vmedis
// ============================================================

// ---- DASHBOARD PAGE DATA ----
export const dashboardStats = {
  hariIni: [
    { label: "Penjualan Kasir",      value: "Rp 2.450.000",       change: 12.5,  icon: "🏪", color: "#1A73E8", invoiceCount: "48 faktur" },
    { label: "Penjualan Online",     value: "Rp 1.320.000",       change: 8.3,   icon: "🛒", color: "#1A73E8", invoiceCount: "27 faktur" },
    { label: "Pemeriksaan Klinik",   value: "Rp 3.180.000",       change: -3.2,  icon: "🏥", color: "#1A73E8", invoiceCount: "31 faktur" },
    { label: "Pendapatan HomeCare",  value: "Rp 640.000",         change: 5.1,   icon: "🏠", color: "#1A73E8", invoiceCount: "6 faktur"  },
    { label: "Total Pendapatan",     value: "Rp 7.590.000",       change: 9.7,   icon: "💰", color: "#1A73E8", invoiceCount: "112 faktur" },
  ],
  bulanIni: [
    { label: "Penjualan Kasir",      value: "Rp 48.750.000",      change: 9.2,   icon: "🏪", color: "#1A73E8", invoiceCount: "1.240 faktur" },
    { label: "Penjualan Online",     value: "Rp 26.400.000",      change: 14.7,  icon: "🛒", color: "#1A73E8", invoiceCount: "680 faktur"  },
    { label: "Pemeriksaan Klinik",   value: "Rp 81.200.000",      change: 6.8,   icon: "🏥", color: "#1A73E8", invoiceCount: "820 faktur"  },
    { label: "Pendapatan HomeCare",  value: "Rp 14.500.000",      change: -2.1,  icon: "🏠", color: "#1A73E8", invoiceCount: "145 faktur"  },
    { label: "Total Pendapatan",     value: "Rp 170.850.000",     change: 11.3,  icon: "💰", color: "#1A73E8", invoiceCount: "2.885 faktur" },
  ],
  tahunIni: [
    { label: "Penjualan Kasir",      value: "Rp 580.200.000",     change: 21.4,  icon: "🏪", color: "#1A73E8", invoiceCount: "14.820 faktur" },
    { label: "Penjualan Online",     value: "Rp 312.400.000",     change: 28.6,  icon: "🛒", color: "#1A73E8", invoiceCount: "8.120 faktur"  },
    { label: "Pemeriksaan Klinik",   value: "Rp 945.000.000",     change: 17.3,  icon: "🏥", color: "#1A73E8", invoiceCount: "9.840 faktur"  },
    { label: "Pendapatan HomeCare",  value: "Rp 172.800.000",     change: 13.7,  icon: "🏠", color: "#1A73E8", invoiceCount: "1.740 faktur"  },
    { label: "Total Pendapatan",     value: "Rp 2.010.400.000",   change: 24.6,  icon: "💰", color: "#1A73E8", invoiceCount: "34.520 faktur" },
  ],
};

// Multi-key chart data — digunakan oleh ChartCarousel
export const dashboardChartData = [
  { name: "Sen", totalPendapatan: 7590000, penjualanKasir: 2450000, penjualanOnline: 1320000, pemeriksaanKlinik: 3180000, pendapatanHomecare: 640000 },
  { name: "Sel", totalPendapatan: 8210000, penjualanKasir: 3120000, penjualanOnline: 1540000, pemeriksaanKlinik: 3180000, pendapatanHomecare: 370000 },
  { name: "Rab", totalPendapatan: 7340000, penjualanKasir: 2890000, penjualanOnline: 1100000, pemeriksaanKlinik: 2960000, pendapatanHomecare: 390000 },
  { name: "Kam", totalPendapatan: 9820000, penjualanKasir: 3540000, penjualanOnline: 1980000, pemeriksaanKlinik: 3780000, pendapatanHomecare: 520000 },
  { name: "Jum", totalPendapatan:11240000, penjualanKasir: 4210000, penjualanOnline: 2320000, pemeriksaanKlinik: 4240000, pendapatanHomecare: 470000 },
  { name: "Sab", totalPendapatan: 8160000, penjualanKasir: 2980000, penjualanOnline: 1670000, pemeriksaanKlinik: 3120000, pendapatanHomecare: 390000 },
  { name: "Min", totalPendapatan: 4890000, penjualanKasir: 1870000, penjualanOnline:  820000, pemeriksaanKlinik: 1900000, pendapatanHomecare: 300000 },
];

export const dashboardChartItems = [
  { title: "Total Pendapatan",    dataKey: "totalPendapatan",    color: "#2196F3", icon: "💰" },
  { title: "Penjualan Kasir",     dataKey: "penjualanKasir",     color: "#FF9800", icon: "🏪" },
  { title: "Penjualan Online",    dataKey: "penjualanOnline",    color: "#4CAF50", icon: "🛒" },
  { title: "Pemeriksaan Klinik",  dataKey: "pemeriksaanKlinik",  color: "#9C27B0", icon: "🏥" },
  { title: "Pendapatan HomeCare", dataKey: "pendapatanHomecare", color: "#F44336", icon: "🏠" },
];

// ---- KEUANGAN CHART DATA ----
export const keuanganChartData = [
  { name: "Sep", totalAset: 420000000, totalCash: 48000000, totalPasiva: 165000000, totalPendapatan: 52000000, totalPengeluaran: 35000000, labaRugi: 17000000, totalHutangObat: 24000000, totalPiutangApotek: 12000000, totalPiutangKlinik: 8000000 },
  { name: "Okt", totalAset: 435000000, totalCash: 51000000, totalPasiva: 168000000, totalPendapatan: 55000000, totalPengeluaran: 37000000, labaRugi: 18000000, totalHutangObat: 26000000, totalPiutangApotek: 13500000, totalPiutangKlinik: 9200000 },
  { name: "Nov", totalAset: 428000000, totalCash: 46000000, totalPasiva: 163000000, totalPendapatan: 50000000, totalPengeluaran: 34000000, labaRugi: 16000000, totalHutangObat: 22000000, totalPiutangApotek: 11800000, totalPiutangKlinik: 7600000 },
  { name: "Des", totalAset: 445000000, totalCash: 55000000, totalPasiva: 171000000, totalPendapatan: 63000000, totalPengeluaran: 40000000, labaRugi: 23000000, totalHutangObat: 28000000, totalPiutangApotek: 14200000, totalPiutangKlinik: 10100000 },
  { name: "Jan", totalAset: 452000000, totalCash: 58000000, totalPasiva: 174000000, totalPendapatan: 67000000, totalPengeluaran: 42000000, labaRugi: 25000000, totalHutangObat: 29500000, totalPiutangApotek: 15600000, totalPiutangKlinik: 11200000 },
  { name: "Feb", totalAset: 461000000, totalCash: 62000000, totalPasiva: 178000000, totalPendapatan: 71000000, totalPengeluaran: 44000000, labaRugi: 27000000, totalHutangObat: 31000000, totalPiutangApotek: 16800000, totalPiutangKlinik: 12400000 },
  { name: "Mar", totalAset: 475000000, totalCash: 67000000, totalPasiva: 182000000, totalPendapatan: 76000000, totalPengeluaran: 46000000, labaRugi: 30000000, totalHutangObat: 32800000, totalPiutangApotek: 18200000, totalPiutangKlinik: 13500000 },
];

export const keuanganChartItems = [
  { title: "Total Aset",          dataKey: "totalAset",         color: "#2196F3", icon: "🏦" },
  { title: "Total Cash",          dataKey: "totalCash",         color: "#4CAF50", icon: "💵" },
  { title: "Total Pasiva",        dataKey: "totalPasiva",       color: "#FF9800", icon: "⚖️" },
  { title: "Total Pendapatan",    dataKey: "totalPendapatan",   color: "#4CAF50", icon: "📈" },
  { title: "Total Pengeluaran",   dataKey: "totalPengeluaran",  color: "#F44336", icon: "📉" },
  { title: "Laba Rugi",           dataKey: "labaRugi",          color: "#9C27B0", icon: "💹" },
  { title: "Total Hutang Obat",   dataKey: "totalHutangObat",   color: "#F44336", icon: "📋" },
  { title: "Total Piutang Apotek",dataKey: "totalPiutangApotek",color: "#FF9800", icon: "📄" },
  { title: "Total Piutang Klinik",dataKey: "totalPiutangKlinik",color: "#9C27B0", icon: "🏥" },
];

// ---- OBAT PAGE DATA ----
export const obatStats = {
  hariIni: [
    { label: "Nilai Stok Obat",  value: "Rp 87.500.000",  icon: "💊", color: "#1A73E8", invoiceCount: "1.248 Obat" },
    { label: "Obat Expired",     value: "Rp 1.240.000",   icon: "⚠️", color: "#1A73E8", invoiceCount: "7 Obat"     },
    { label: "Obat Stok Habis",  value: "6 Obat",         icon: "📦", color: "#1A73E8" },
    { label: "Obat Hilang",      value: "Rp 320.000",     change: 4.2, icon: "🔍", color: "#1A73E8", invoiceCount: "3 Obat" },
  ],
  bulanIni: [
    { label: "Nilai Stok Obat",  value: "Rp 87.500.000",  icon: "💊", color: "#1A73E8", invoiceCount: "1.248 Obat" },
    { label: "Obat Expired",     value: "Rp 3.840.000",   icon: "⚠️", color: "#1A73E8", invoiceCount: "23 Obat"    },
    { label: "Obat Stok Habis",  value: "18 Obat",        icon: "📦", color: "#1A73E8" },
    { label: "Obat Hilang",      value: "Rp 1.280.000",   change: 7.5, icon: "🔍", color: "#1A73E8", invoiceCount: "12 Obat" },
  ],
  tahunIni: [
    { label: "Nilai Stok Obat",  value: "Rp 87.500.000",  icon: "💊", color: "#1A73E8", invoiceCount: "1.248 Obat" },
    { label: "Obat Expired",     value: "Rp 18.200.000",  icon: "⚠️", color: "#1A73E8", invoiceCount: "74 Obat"    },
    { label: "Obat Stok Habis",  value: "42 Obat",        icon: "📦", color: "#1A73E8" },
    { label: "Obat Hilang",      value: "Rp 9.640.000",   change: -8.3, icon: "🔍", color: "#1A73E8", invoiceCount: "48 Obat" },
  ],
};

export const obatChartData = [
  { name: "Sep", obatHilang:  420000, pembelianObat:  8200000 },
  { name: "Okt", obatHilang:  650000, pembelianObat:  9400000 },
  { name: "Nov", obatHilang:  280000, pembelianObat:  7800000 },
  { name: "Des", obatHilang:  910000, pembelianObat: 11200000 },
  { name: "Jan", obatHilang:  340000, pembelianObat:  9800000 },
  { name: "Feb", obatHilang:  520000, pembelianObat: 10500000 },
  { name: "Mar", obatHilang:  320000, pembelianObat:  8750000 },
];

export const obatChartItems = [
  { title: "Data Obat Hilang", dataKey: "obatHilang",    color: "#FF5722", icon: "🔍" },
  { title: "Pembelian Obat",   dataKey: "pembelianObat", color: "#4CAF50", icon: "🛒" },
];

export const pembelianObatTerbanyak = [
  { rank: 1, name: "Amoxicillin 500mg", satuan: "Tablet", jumlah: 5000, nilai: 2500000 },
  { rank: 2, name: "Paracetamol 500mg", satuan: "Tablet", jumlah: 4200, nilai: 1260000 },
  { rank: 3, name: "Omeprazole 20mg", satuan: "Kapsul", jumlah: 3800, nilai: 3040000 },
  { rank: 4, name: "Metformin 500mg", satuan: "Tablet", jumlah: 3200, nilai: 1280000 },
  { rank: 5, name: "Amlodipine 5mg", satuan: "Tablet", jumlah: 2900, nilai: 1450000 },
];

export const obatTerlaris = [
  { rank: 1, name: "Paracetamol 500mg", satuan: "Tablet", jumlah: 3800, nilai: 1140000 },
  { rank: 2, name: "Vitamin C 500mg", satuan: "Tablet", jumlah: 3200, nilai: 960000 },
  { rank: 3, name: "Antasida Doen", satuan: "Tablet", jumlah: 2900, nilai: 1015000 },
  { rank: 4, name: "Amoxicillin 500mg", satuan: "Kapsul", jumlah: 2400, nilai: 1200000 },
  { rank: 5, name: "Ibuprofen 400mg", satuan: "Tablet", jumlah: 2100, nilai: 945000 },
];

// ---- KEUANGAN PAGE DATA ----
export const keuanganStats = {
  hariIni: [
    { label: "Total Aset",                value: "Rp 523.000.000",   change: 2.4,   icon: "🏦", color: "#1A73E8", invoiceCount: "Total aset perusahaan"  },
    { label: "Total Cash",                value: "Rp 67.000.000",    change: 5.1,   icon: "💵", color: "#1A73E8", invoiceCount: "Kas dan setara kas"      },
    { label: "Total Pasiva",              value: "Rp 182.000.000",   change: -1.3,  icon: "⚖️", color: "#1A73E8", invoiceCount: "Total kewajiban"         },
    { label: "Total Pendapatan",          value: "Rp 76.000.000",    change: 11.3,  icon: "📈", color: "#1A73E8", invoiceCount: "Pendapatan operasional"   },
    { label: "Total Pengeluaran",         value: "Rp 46.000.000",    change: 7.8,   icon: "📉", color: "#1A73E8", invoiceCount: "Biaya operasional"        },
    { label: "Laba Rugi",                 value: "Rp 30.000.000",    change: 18.7,  icon: "💹", color: "#1A73E8", invoiceCount: "Laba bersih periode"      },
    { label: "Hutang Obat Jatuh Tempo",   value: "Rp 32.800.000",    change: -4.2,  icon: "📋", color: "#1A73E8", invoiceCount: "5 faktur"                 },
    { label: "Piutang Apotek Jatuh Tempo",value: "Rp 18.200.000",    change: 3.5,   icon: "📄", color: "#1A73E8", invoiceCount: "6 faktur"                 },
    { label: "Piutang Klinik Jatuh Tempo",value: "Rp 13.500.000",    change: 9.2,   icon: "🏥", color: "#1A73E8", invoiceCount: "4 faktur"                 },
  ],
  bulanIni: [
    { label: "Total Aset",                value: "Rp 523.000.000",   change: 3.1,   icon: "🏦", color: "#1A73E8", invoiceCount: "Total aset perusahaan"  },
    { label: "Total Cash",                value: "Rp 67.000.000",    change: 8.3,   icon: "💵", color: "#1A73E8", invoiceCount: "Kas dan setara kas"      },
    { label: "Total Pasiva",              value: "Rp 182.000.000",   change: -2.1,  icon: "⚖️", color: "#1A73E8", invoiceCount: "Total kewajiban"         },
    { label: "Total Pendapatan",          value: "Rp 510.000.000",   change: 14.6,  icon: "📈", color: "#1A73E8", invoiceCount: "Pendapatan operasional"   },
    { label: "Total Pengeluaran",         value: "Rp 312.000.000",   change: 9.4,   icon: "📉", color: "#1A73E8", invoiceCount: "Biaya operasional"        },
    { label: "Laba Rugi",                 value: "Rp 198.000.000",   change: 22.4,  icon: "💹", color: "#1A73E8", invoiceCount: "Laba bersih periode"      },
    { label: "Hutang Obat Jatuh Tempo",   value: "Rp 32.800.000",    change: -6.8,  icon: "📋", color: "#1A73E8", invoiceCount: "5 faktur"                 },
    { label: "Piutang Apotek Jatuh Tempo",value: "Rp 18.200.000",    change: 4.7,   icon: "📄", color: "#1A73E8", invoiceCount: "6 faktur"                 },
    { label: "Piutang Klinik Jatuh Tempo",value: "Rp 13.500.000",    change: 11.3,  icon: "🏥", color: "#1A73E8", invoiceCount: "4 faktur"                 },
  ],
  tahunIni: [
    { label: "Total Aset",                value: "Rp 523.000.000",   change: 12.8,  icon: "🏦", color: "#1A73E8", invoiceCount: "Total aset perusahaan"  },
    { label: "Total Cash",                value: "Rp 67.000.000",    change: 18.4,  icon: "💵", color: "#1A73E8", invoiceCount: "Kas dan setara kas"      },
    { label: "Total Pasiva",              value: "Rp 182.000.000",   change: -5.3,  icon: "⚖️", color: "#1A73E8", invoiceCount: "Total kewajiban"         },
    { label: "Total Pendapatan",          value: "Rp 2.010.400.000", change: 24.6,  icon: "📈", color: "#1A73E8", invoiceCount: "Pendapatan operasional"   },
    { label: "Total Pengeluaran",         value: "Rp 394.100.000",   change: 8.3,   icon: "📉", color: "#1A73E8", invoiceCount: "Biaya operasional"        },
    { label: "Laba Rugi",                 value: "Rp 1.616.300.000", change: 31.2,  icon: "💹", color: "#1A73E8", invoiceCount: "Laba bersih periode"      },
    { label: "Hutang Obat Jatuh Tempo",   value: "Rp 32.800.000",    change: -11.4, icon: "📋", color: "#1A73E8", invoiceCount: "5 faktur"                 },
    { label: "Piutang Apotek Jatuh Tempo",value: "Rp 18.200.000",    change: 7.2,   icon: "📄", color: "#1A73E8", invoiceCount: "6 faktur"                 },
    { label: "Piutang Klinik Jatuh Tempo",value: "Rp 13.500.000",    change: 14.8,  icon: "🏥", color: "#1A73E8", invoiceCount: "4 faktur"                 },
  ],
};

// ---- FORECAST PAGE DATA ----
export const forecastStats = {
  tigaBulan: [
    { label: "Pareto A",                  value: "Rp 48.200.000",   change: 5.4,  icon: "⭐", color: "#1A73E8", invoiceCount: "124 Obat" },
    { label: "Pareto B",                  value: "Rp 21.800.000",   change: 3.2,  icon: "🌟", color: "#1A73E8", invoiceCount: "87 Obat"  },
    { label: "Pareto C",                  value: "Rp 9.400.000",    change: -1.8, icon: "✨", color: "#1A73E8", invoiceCount: "56 Obat"  },
    { label: "Dibawah Pareto C (Stok Mati)", value: "Rp 3.200.000", change: -6.3, icon: "⚠️", color: "#1A73E8", invoiceCount: "34 Obat"  },
    { label: "Stock On Hand",             value: "Rp 87.500.000",   change: 2.1,  icon: "📦", color: "#1A73E8", invoiceCount: "185 Obat" },
    { label: "Over Stock",                value: "Rp 14.200.000",   change: -4.7, icon: "📈", color: "#1A73E8", invoiceCount: "28 Obat"  },
    { label: "Under Stock",               value: "Rp 6.800.000",    change: 8.3,  icon: "📉", color: "#1A73E8", invoiceCount: "19 Obat"  },
    { label: "Potential Lost",            value: "Rp 2.100.000",    change: -9.4, icon: "💸", color: "#1A73E8", invoiceCount: "12 Obat"  },
  ],
  enamBulan: [
    { label: "Pareto A",                  value: "Rp 96.400.000",   change: 8.7,  icon: "⭐", color: "#1A73E8", invoiceCount: "124 Obat" },
    { label: "Pareto B",                  value: "Rp 43.600.000",   change: 6.4,  icon: "🌟", color: "#1A73E8", invoiceCount: "87 Obat"  },
    { label: "Pareto C",                  value: "Rp 18.800.000",   change: -2.6, icon: "✨", color: "#1A73E8", invoiceCount: "56 Obat"  },
    { label: "Dibawah Pareto C (Stok Mati)", value: "Rp 6.400.000", change: -8.1, icon: "⚠️", color: "#1A73E8", invoiceCount: "34 Obat"  },
    { label: "Stock On Hand",             value: "Rp 87.500.000",   change: 3.8,  icon: "📦", color: "#1A73E8", invoiceCount: "185 Obat" },
    { label: "Over Stock",                value: "Rp 14.200.000",   change: -6.2, icon: "📈", color: "#1A73E8", invoiceCount: "28 Obat"  },
    { label: "Under Stock",               value: "Rp 6.800.000",    change: 11.4, icon: "📉", color: "#1A73E8", invoiceCount: "19 Obat"  },
    { label: "Potential Lost",            value: "Rp 2.100.000",    change:-12.7, icon: "💸", color: "#1A73E8", invoiceCount: "12 Obat"  },
  ],
  satTahun: [
    { label: "Pareto A",                  value: "Rp 192.800.000",  change: 14.2, icon: "⭐", color: "#1A73E8", invoiceCount: "124 Obat" },
    { label: "Pareto B",                  value: "Rp 87.200.000",   change: 11.8, icon: "🌟", color: "#1A73E8", invoiceCount: "87 Obat"  },
    { label: "Pareto C",                  value: "Rp 37.600.000",   change: -4.3, icon: "✨", color: "#1A73E8", invoiceCount: "56 Obat"  },
    { label: "Dibawah Pareto C (Stok Mati)", value: "Rp 12.800.000",change:-14.6, icon: "⚠️", color: "#1A73E8", invoiceCount: "34 Obat"  },
    { label: "Stock On Hand",             value: "Rp 87.500.000",   change: 6.7,  icon: "📦", color: "#1A73E8", invoiceCount: "185 Obat" },
    { label: "Over Stock",                value: "Rp 14.200.000",   change: -9.4, icon: "📈", color: "#1A73E8", invoiceCount: "28 Obat"  },
    { label: "Under Stock",               value: "Rp 6.800.000",    change: 17.2, icon: "📉", color: "#1A73E8", invoiceCount: "19 Obat"  },
    { label: "Potential Lost",            value: "Rp 2.100.000",    change:-18.3, icon: "💸", color: "#1A73E8", invoiceCount: "12 Obat"  },
  ],
};

export const forecastChartData = {
  paretoAnalysis: [
    { name: "Pareto A", paretoAnalysis: 192800000 },
    { name: "Pareto B", paretoAnalysis:  87200000 },
    { name: "Pareto C", paretoAnalysis:  37600000 },
    { name: "Under C",  paretoAnalysis:  12800000 },
  ],
  statusPengadaan: [
    { name: "Stock On Hand",  statusPengadaan: 185 },
    { name: "Over Stock",     statusPengadaan:  28 },
    { name: "Under Stock",    statusPengadaan:  19 },
    { name: "Potential Lost", statusPengadaan:  12 },
  ],
};

export const forecastChartItems = [
  { title: "Kategori Pareto",   dataKey: "paretoAnalysis",  color: "#2196F3", icon: "📊" },
  { title: "Status Pengadaan",  dataKey: "statusPengadaan", color: "#FF9800", icon: "📦" },
];

export const katlarisData = [
  { name: "Obat Generik",       persen: 35.2, nilai: 17500000 },
  { name: "Vitamin & Suplemen", persen: 22.8, nilai: 11340000 },
  { name: "Antibiotik",         persen: 18.5, nilai:  9200000 },
  { name: "Antidiabetes",       persen: 12.4, nilai:  6170000 },
  { name: "Antihipertensi",     persen: 11.1, nilai:  5520000 },
];

// ---- CUSTOMER PAGE DATA ----
export const customerStats = {
  tigaBulan: [
    { label: "Loyal Customer",     value: "1.240 Pelanggan", change: 7.4,  icon: "⭐", color: "#1A73E8" },
    { label: "Potensial Customer", value: "820 Pelanggan",   change: 9.2,  icon: "📈", color: "#1A73E8" },
    { label: "Prospek Customer",   value: "560 Pelanggan",   change: 4.8,  icon: "👤", color: "#1A73E8" },
    { label: "Belum Prospek",      value: "1.220 Pelanggan", change: -3.1, icon: "👥", color: "#1A73E8" },
    { label: "Total Customer",     value: "3.840 Pelanggan", change: 9.4,  icon: "🏢", color: "#1A73E8" },
    { label: "Pasien Baru",        value: "428 Pelanggan",   change: 14.2, icon: "🆕", color: "#1A73E8" },
    { label: "Kunjungan Pasien",   value: "1.248 Pelanggan", change: 8.7,  icon: "🏥", color: "#1A73E8" },
  ],
  enamBulan: [
    { label: "Loyal Customer",     value: "2.480 Pelanggan", change: 11.3, icon: "⭐", color: "#1A73E8" },
    { label: "Potensial Customer", value: "1.640 Pelanggan", change: 13.8, icon: "📈", color: "#1A73E8" },
    { label: "Prospek Customer",   value: "1.120 Pelanggan", change: 7.4,  icon: "👤", color: "#1A73E8" },
    { label: "Belum Prospek",      value: "2.440 Pelanggan", change: -5.2, icon: "👥", color: "#1A73E8" },
    { label: "Total Customer",     value: "7.680 Pelanggan", change: 11.7, icon: "🏢", color: "#1A73E8" },
    { label: "Pasien Baru",        value: "856 Pelanggan",   change: 18.3, icon: "🆕", color: "#1A73E8" },
    { label: "Kunjungan Pasien",   value: "2.496 Pelanggan", change: 12.4, icon: "🏥", color: "#1A73E8" },
  ],
  satTahun: [
    { label: "Loyal Customer",     value: "4.960 Pelanggan", change: 18.7, icon: "⭐", color: "#1A73E8" },
    { label: "Potensial Customer", value: "3.280 Pelanggan", change: 22.4, icon: "📈", color: "#1A73E8" },
    { label: "Prospek Customer",   value: "2.240 Pelanggan", change: 14.2, icon: "👤", color: "#1A73E8" },
    { label: "Belum Prospek",      value: "4.880 Pelanggan", change: -8.4, icon: "👥", color: "#1A73E8" },
    { label: "Total Customer",     value: "15.360 Pelanggan",change: 21.4, icon: "🏢", color: "#1A73E8" },
    { label: "Pasien Baru",        value: "1.720 Pelanggan", change: 25.8, icon: "🆕", color: "#1A73E8" },
    { label: "Kunjungan Pasien",   value: "4.992 Pelanggan", change: 19.6, icon: "🏥", color: "#1A73E8" },
  ],
};

// Customer chart — data per periode
export const customerChartItems = [
  { title: "Loyal Customer",     dataKey: "loyalCustomer",     color: "#4CAF50", icon: "⭐" },
  { title: "Potensial Customer", dataKey: "potensialCustomer", color: "#2196F3", icon: "📈" },
  { title: "Prospek Customer",   dataKey: "prospekCustomer",   color: "#FF9800", icon: "👤" },
  { title: "Belum Prospek",      dataKey: "belumProspek",      color: "#F44336", icon: "👥" },
  { title: "Total Customer",     dataKey: "totalCustomer",     color: "#9C27B0", icon: "🏢" },
  { title: "Pasien Baru",        dataKey: "pasienBaru",        color: "#607D8B", icon: "🆕" },
  { title: "Kunjungan Pasien",   dataKey: "kunjunganPasien",   color: "#795548", icon: "🏥" },
];

export const customerChartData: Record<string, { name: string; loyalCustomer: number; potensialCustomer: number; prospekCustomer: number; belumProspek: number; totalCustomer: number; pasienBaru: number; kunjunganPasien: number }[]> = {
  tigaBulan: [
    { name: "Jan", loyalCustomer: 400, potensialCustomer: 265, prospekCustomer: 181, belumProspek: 394, totalCustomer: 1240, pasienBaru: 138, kunjunganPasien: 402 },
    { name: "Feb", loyalCustomer: 420, potensialCustomer: 278, prospekCustomer: 190, belumProspek: 412, totalCustomer: 1300, pasienBaru: 145, kunjunganPasien: 421 },
    { name: "Mar", loyalCustomer: 420, potensialCustomer: 277, prospekCustomer: 189, belumProspek: 414, totalCustomer: 1300, pasienBaru: 145, kunjunganPasien: 425 },
  ],
  enamBulan: [
    { name: "Okt", loyalCustomer: 390, potensialCustomer: 258, prospekCustomer: 176, belumProspek: 384, totalCustomer: 1208, pasienBaru: 132, kunjunganPasien: 388 },
    { name: "Nov", loyalCustomer: 400, potensialCustomer: 265, prospekCustomer: 181, belumProspek: 394, totalCustomer: 1240, pasienBaru: 138, kunjunganPasien: 402 },
    { name: "Des", loyalCustomer: 385, potensialCustomer: 255, prospekCustomer: 174, belumProspek: 378, totalCustomer: 1192, pasienBaru: 128, kunjunganPasien: 378 },
    { name: "Jan", loyalCustomer: 408, potensialCustomer: 271, prospekCustomer: 185, belumProspek: 402, totalCustomer: 1266, pasienBaru: 142, kunjunganPasien: 410 },
    { name: "Feb", loyalCustomer: 420, potensialCustomer: 278, prospekCustomer: 190, belumProspek: 412, totalCustomer: 1300, pasienBaru: 145, kunjunganPasien: 421 },
    { name: "Mar", loyalCustomer: 457, potensialCustomer: 313, prospekCustomer: 214, belumProspek: 470, totalCustomer: 1454, pasienBaru: 171, kunjunganPasien: 477 },
  ],
  satTahun: [
    { name: "Apr", loyalCustomer: 365, potensialCustomer: 242, prospekCustomer: 165, belumProspek: 360, totalCustomer: 1132, pasienBaru: 120, kunjunganPasien: 356 },
    { name: "Mei", loyalCustomer: 375, potensialCustomer: 249, prospekCustomer: 170, belumProspek: 371, totalCustomer: 1165, pasienBaru: 125, kunjunganPasien: 370 },
    { name: "Jun", loyalCustomer: 383, potensialCustomer: 254, prospekCustomer: 173, belumProspek: 380, totalCustomer: 1190, pasienBaru: 130, kunjunganPasien: 384 },
    { name: "Jul", loyalCustomer: 380, potensialCustomer: 252, prospekCustomer: 172, belumProspek: 376, totalCustomer: 1180, pasienBaru: 128, kunjunganPasien: 379 },
    { name: "Agt", loyalCustomer: 388, potensialCustomer: 258, prospekCustomer: 176, belumProspek: 385, totalCustomer: 1207, pasienBaru: 133, kunjunganPasien: 392 },
    { name: "Sep", loyalCustomer: 394, potensialCustomer: 261, prospekCustomer: 178, belumProspek: 390, totalCustomer: 1223, pasienBaru: 136, kunjunganPasien: 399 },
    { name: "Okt", loyalCustomer: 390, potensialCustomer: 258, prospekCustomer: 176, belumProspek: 384, totalCustomer: 1208, pasienBaru: 132, kunjunganPasien: 388 },
    { name: "Nov", loyalCustomer: 400, potensialCustomer: 265, prospekCustomer: 181, belumProspek: 394, totalCustomer: 1240, pasienBaru: 138, kunjunganPasien: 402 },
    { name: "Des", loyalCustomer: 385, potensialCustomer: 255, prospekCustomer: 174, belumProspek: 378, totalCustomer: 1192, pasienBaru: 128, kunjunganPasien: 378 },
    { name: "Jan", loyalCustomer: 408, potensialCustomer: 271, prospekCustomer: 185, belumProspek: 402, totalCustomer: 1266, pasienBaru: 142, kunjunganPasien: 410 },
    { name: "Feb", loyalCustomer: 420, potensialCustomer: 278, prospekCustomer: 190, belumProspek: 412, totalCustomer: 1300, pasienBaru: 145, kunjunganPasien: 421 },
    { name: "Mar", loyalCustomer: 457, potensialCustomer: 313, prospekCustomer: 214, belumProspek: 470, totalCustomer: 1454, pasienBaru: 171, kunjunganPasien: 477 },
  ],
};

// ---- LAPORAN REPORT TABLE DATA ----

export const lapPenjualanObat = [
  { no: 1, noFaktur: "PJ/2026/05/0001", pasien: "Ahmad Fauzi", dokter: "dr. Budi Santoso", total: 185000, tanggal: "10 Mei 2026" },
  { no: 2, noFaktur: "PJ/2026/05/0002", pasien: "Siti Rahayu", dokter: "dr. Dewi Lestari", total: 342000, tanggal: "09 Mei 2026" },
  { no: 3, noFaktur: "PJ/2026/05/0003", pasien: "Budi Hartono", dokter: "dr. Ahmad Rizki", total: 127500, tanggal: "08 Mei 2026" },
  { no: 4, noFaktur: "PJ/2026/05/0004", pasien: "Rina Wulandari", dokter: "dr. Budi Santoso", total: 560000, tanggal: "07 Mei 2026" },
  { no: 5, noFaktur: "PJ/2026/05/0005", pasien: "Hendra Gunawan", dokter: "dr. Dewi Lestari", total: 89500, tanggal: "05 Mei 2026" },
  { no: 6, noFaktur: "PJ/2026/05/0006", pasien: "Yuli Astuti", dokter: "dr. Ahmad Rizki", total: 275000, tanggal: "03 Mei 2026" },
  { no: 7, noFaktur: "PJ/2026/04/0007", pasien: "Doni Permana", dokter: "dr. Sri Mulyani", total: 145000, tanggal: "25 Apr 2026" },
  { no: 8, noFaktur: "PJ/2026/04/0008", pasien: "Maya Sari", dokter: "dr. Budi Santoso", total: 420000, tanggal: "20 Apr 2026" },
  { no: 9, noFaktur: "PJ/2026/04/0009", pasien: "Roni Susanto", dokter: "dr. Dewi Lestari", total: 63000, tanggal: "15 Apr 2026" },
  { no: 10, noFaktur: "PJ/2026/04/0010", pasien: "Fitri Handayani", dokter: "dr. Ahmad Rizki", total: 312500, tanggal: "10 Apr 2026" },
];

export const lapRegistrasiPasien = [
  { no: 1, tanggal: "10 Mei 2026", noRM: "RM-260001", pasien: "Ahmad Fauzi", alamat: "Jl. Merdeka No. 12, Jakarta" },
  { no: 2, tanggal: "09 Mei 2026", noRM: "RM-260002", pasien: "Siti Rahayu", alamat: "Jl. Sudirman No. 45, Jakarta" },
  { no: 3, tanggal: "08 Mei 2026", noRM: "RM-260003", pasien: "Budi Hartono", alamat: "Jl. Gatot Subroto No. 8, Jakarta" },
  { no: 4, tanggal: "07 Mei 2026", noRM: "RM-260004", pasien: "Rina Wulandari", alamat: "Jl. Kebon Jeruk No. 21, Jakarta" },
  { no: 5, tanggal: "05 Mei 2026", noRM: "RM-260005", pasien: "Hendra Gunawan", alamat: "Jl. Pahlawan No. 33, Bandung" },
  { no: 6, tanggal: "03 Mei 2026", noRM: "RM-260006", pasien: "Yuli Astuti", alamat: "Jl. Diponegoro No. 17, Surabaya" },
  { no: 7, tanggal: "25 Apr 2026", noRM: "RM-260007", pasien: "Doni Permana", alamat: "Jl. Ahmad Yani No. 5, Bekasi" },
  { no: 8, tanggal: "20 Apr 2026", noRM: "RM-260008", pasien: "Maya Sari", alamat: "Jl. Veteran No. 29, Depok" },
  { no: 9, tanggal: "15 Apr 2026", noRM: "RM-260009", pasien: "Roni Susanto", alamat: "Jl. Pemuda No. 42, Tangerang" },
  { no: 10, tanggal: "10 Apr 2026", noRM: "RM-260010", pasien: "Fitri Handayani", alamat: "Jl. Cempaka No. 7, Bogor" },
];

export const lapKunjunganPasien = [
  { no: 1, tanggal: "10 Mei 2026", nama: "Ahmad Fauzi", poli: "Poli Umum", dokter: "dr. Budi Santoso" },
  { no: 2, tanggal: "09 Mei 2026", nama: "Siti Rahayu", poli: "Poli Gigi", dokter: "dr. Dewi Lestari" },
  { no: 3, tanggal: "08 Mei 2026", nama: "Budi Hartono", poli: "Poli Anak", dokter: "dr. Ahmad Rizki" },
  { no: 4, tanggal: "07 Mei 2026", nama: "Rina Wulandari", poli: "Poli Umum", dokter: "dr. Sri Mulyani" },
  { no: 5, tanggal: "05 Mei 2026", nama: "Hendra Gunawan", poli: "Poli Mata", dokter: "dr. Budi Santoso" },
  { no: 6, tanggal: "03 Mei 2026", nama: "Yuli Astuti", poli: "Poli Umum", dokter: "dr. Dewi Lestari" },
  { no: 7, tanggal: "25 Apr 2026", nama: "Doni Permana", poli: "Poli THT", dokter: "dr. Ahmad Rizki" },
  { no: 8, tanggal: "20 Apr 2026", nama: "Maya Sari", poli: "Poli Gigi", dokter: "dr. Sri Mulyani" },
  { no: 9, tanggal: "15 Apr 2026", nama: "Roni Susanto", poli: "Poli Umum", dokter: "dr. Budi Santoso" },
  { no: 10, tanggal: "10 Apr 2026", nama: "Fitri Handayani", poli: "Poli Anak", dokter: "dr. Dewi Lestari" },
];

export const lapJanjiDenganDokter = [
  { no: 1, tanggal: "12 Mei 2026 09:00", pasien: "Ahmad Fauzi", dokter: "dr. Budi Santoso", keterangan: "Kontrol tekanan darah" },
  { no: 2, tanggal: "12 Mei 2026 10:30", pasien: "Siti Rahayu", dokter: "dr. Dewi Lestari", keterangan: "Cabut gigi bungsu" },
  { no: 3, tanggal: "11 Mei 2026 08:00", pasien: "Budi Hartono", dokter: "dr. Ahmad Rizki", keterangan: "Imunisasi anak" },
  { no: 4, tanggal: "10 Mei 2026 11:00", pasien: "Rina Wulandari", dokter: "dr. Sri Mulyani", keterangan: "Konsultasi penyakit dalam" },
  { no: 5, tanggal: "08 Mei 2026 09:30", pasien: "Hendra Gunawan", dokter: "dr. Budi Santoso", keterangan: "Kontrol rutin" },
  { no: 6, tanggal: "05 Mei 2026 14:00", pasien: "Yuli Astuti", dokter: "dr. Dewi Lestari", keterangan: "Periksa gigi" },
  { no: 7, tanggal: "25 Apr 2026 10:00", pasien: "Doni Permana", dokter: "dr. Ahmad Rizki", keterangan: "Konsultasi THT" },
  { no: 8, tanggal: "20 Apr 2026 13:00", pasien: "Maya Sari", dokter: "dr. Sri Mulyani", keterangan: "Kontrol penyakit dalam" },
];

export const lapPembayaranKasir = [
  { no: 1, tanggal: "10 Mei 2026", noFaktur: "KS/2026/05/0001", pasien: "Ahmad Fauzi", dokter: "dr. Budi Santoso", total: 285000 },
  { no: 2, tanggal: "09 Mei 2026", noFaktur: "KS/2026/05/0002", pasien: "Siti Rahayu", dokter: "dr. Dewi Lestari", total: 450000 },
  { no: 3, tanggal: "08 Mei 2026", noFaktur: "KS/2026/05/0003", pasien: "Budi Hartono", dokter: "dr. Ahmad Rizki", total: 175000 },
  { no: 4, tanggal: "07 Mei 2026", noFaktur: "KS/2026/05/0004", pasien: "Rina Wulandari", dokter: "dr. Sri Mulyani", total: 620000 },
  { no: 5, tanggal: "05 Mei 2026", noFaktur: "KS/2026/05/0005", pasien: "Hendra Gunawan", dokter: "dr. Budi Santoso", total: 95000 },
  { no: 6, tanggal: "03 Mei 2026", noFaktur: "KS/2026/05/0006", pasien: "Yuli Astuti", dokter: "dr. Dewi Lestari", total: 380000 },
  { no: 7, tanggal: "25 Apr 2026", noFaktur: "KS/2026/04/0007", pasien: "Doni Permana", dokter: "dr. Ahmad Rizki", total: 215000 },
  { no: 8, tanggal: "20 Apr 2026", noFaktur: "KS/2026/04/0008", pasien: "Maya Sari", dokter: "dr. Sri Mulyani", total: 510000 },
  { no: 9, tanggal: "15 Apr 2026", noFaktur: "KS/2026/04/0009", pasien: "Roni Susanto", dokter: "dr. Budi Santoso", total: 75000 },
  { no: 10, tanggal: "10 Apr 2026", noFaktur: "KS/2026/04/0010", pasien: "Fitri Handayani", dokter: "dr. Dewi Lestari", total: 440000 },
];
export const totalPembayaranKasir = lapPembayaranKasir.reduce((s, r) => s + r.total, 0);

export const lapPendapatanPetugasMedis = [
  { no: 1, tanggal: "10 Mei 2026", noFaktur: "KS/2026/05/0001", dokter: "dr. Budi Santoso", pemeriksaan: "Konsultasi Umum", feeDokter: 75000 },
  { no: 2, tanggal: "09 Mei 2026", noFaktur: "KS/2026/05/0002", dokter: "dr. Dewi Lestari", pemeriksaan: "Cabut Gigi", feeDokter: 150000 },
  { no: 3, tanggal: "08 Mei 2026", noFaktur: "KS/2026/05/0003", dokter: "dr. Ahmad Rizki", pemeriksaan: "Imunisasi", feeDokter: 85000 },
  { no: 4, tanggal: "07 Mei 2026", noFaktur: "KS/2026/05/0004", dokter: "dr. Sri Mulyani", pemeriksaan: "Penyakit Dalam", feeDokter: 120000 },
  { no: 5, tanggal: "05 Mei 2026", noFaktur: "KS/2026/05/0005", dokter: "dr. Budi Santoso", pemeriksaan: "Kontrol Rutin", feeDokter: 75000 },
  { no: 6, tanggal: "03 Mei 2026", noFaktur: "KS/2026/05/0006", dokter: "dr. Dewi Lestari", pemeriksaan: "Periksa Gigi", feeDokter: 100000 },
  { no: 7, tanggal: "25 Apr 2026", noFaktur: "KS/2026/04/0007", dokter: "dr. Ahmad Rizki", pemeriksaan: "THT", feeDokter: 95000 },
  { no: 8, tanggal: "20 Apr 2026", noFaktur: "KS/2026/04/0008", dokter: "dr. Sri Mulyani", pemeriksaan: "Penyakit Dalam", feeDokter: 120000 },
];
export const totalPendapatanPetugasMedis = lapPendapatanPetugasMedis.reduce((s, r) => s + r.feeDokter, 0);

export const lapPenjualanObatKlinik = [
  { no: 1, tanggal: "10 Mei 2026", noFaktur: "OK/2026/05/0001", pasien: "Ahmad Fauzi", dokter: "dr. Budi Santoso", total: 145000 },
  { no: 2, tanggal: "09 Mei 2026", noFaktur: "OK/2026/05/0002", pasien: "Siti Rahayu", dokter: "dr. Dewi Lestari", total: 280000 },
  { no: 3, tanggal: "08 Mei 2026", noFaktur: "OK/2026/05/0003", pasien: "Budi Hartono", dokter: "dr. Ahmad Rizki", total: 95000 },
  { no: 4, tanggal: "07 Mei 2026", noFaktur: "OK/2026/05/0004", pasien: "Rina Wulandari", dokter: "dr. Sri Mulyani", total: 375000 },
  { no: 5, tanggal: "05 Mei 2026", noFaktur: "OK/2026/05/0005", pasien: "Hendra Gunawan", dokter: "dr. Budi Santoso", total: 62000 },
  { no: 6, tanggal: "25 Apr 2026", noFaktur: "OK/2026/04/0006", pasien: "Yuli Astuti", dokter: "dr. Dewi Lestari", total: 198000 },
  { no: 7, tanggal: "20 Apr 2026", noFaktur: "OK/2026/04/0007", pasien: "Doni Permana", dokter: "dr. Ahmad Rizki", total: 127500 },
];
export const totalPenjualanObatKlinik = lapPenjualanObatKlinik.reduce((s, r) => s + r.total, 0);

export const lapTagihanJaminan = [
  { no: 1, tanggal: "10 Mei 2026", noFaktur: "TJ/2026/05/0001", pasien: "Ahmad Fauzi", jaminan: "BPJS Kesehatan", totalBiaya: 425000 },
  { no: 2, tanggal: "09 Mei 2026", noFaktur: "TJ/2026/05/0002", pasien: "Siti Rahayu", jaminan: "Asuransi Prudential", totalBiaya: 680000 },
  { no: 3, tanggal: "08 Mei 2026", noFaktur: "TJ/2026/05/0003", pasien: "Budi Hartono", jaminan: "BPJS Kesehatan", totalBiaya: 195000 },
  { no: 4, tanggal: "07 Mei 2026", noFaktur: "TJ/2026/05/0004", pasien: "Rina Wulandari", jaminan: "Jasa Raharja", totalBiaya: 920000 },
  { no: 5, tanggal: "03 Mei 2026", noFaktur: "TJ/2026/05/0005", pasien: "Hendra Gunawan", jaminan: "BPJS Kesehatan", totalBiaya: 340000 },
  { no: 6, tanggal: "25 Apr 2026", noFaktur: "TJ/2026/04/0006", pasien: "Yuli Astuti", jaminan: "Asuransi AXA", totalBiaya: 785000 },
];
export const totalTagihanJaminan = lapTagihanJaminan.reduce((s, r) => s + r.totalBiaya, 0);

export const lapPembelianObat = [
  { no: 1, tanggal: "10 Mei 2026", noFaktur: "PO/2026/05/0001", supplier: "PT Kimia Farma", gudang: "Gudang Utama", total: 5420000 },
  { no: 2, tanggal: "09 Mei 2026", noFaktur: "PO/2026/05/0002", supplier: "PT Kalbe Farma", gudang: "Gudang Utama", total: 8750000 },
  { no: 3, tanggal: "07 Mei 2026", noFaktur: "PO/2026/05/0003", supplier: "PT Dexa Medica", gudang: "Gudang Cabang", total: 3240000 },
  { no: 4, tanggal: "05 Mei 2026", noFaktur: "PO/2026/05/0004", supplier: "PT Phapros", gudang: "Gudang Cabang", total: 6180000 },
  { no: 5, tanggal: "03 Mei 2026", noFaktur: "PO/2026/05/0005", supplier: "PT Kimia Farma", gudang: "Gudang Utama", total: 4920000 },
  { no: 6, tanggal: "25 Apr 2026", noFaktur: "PO/2026/04/0006", supplier: "PT Indofarma", gudang: "Gudang Utama", total: 7340000 },
  { no: 7, tanggal: "20 Apr 2026", noFaktur: "PO/2026/04/0007", supplier: "PT Kalbe Farma", gudang: "Gudang Cabang", total: 2870000 },
  { no: 8, tanggal: "10 Apr 2026", noFaktur: "PO/2026/04/0008", supplier: "PT Soho Industri", gudang: "Gudang Cabang", total: 4560000 },
];
export const totalPembelianObat = lapPembelianObat.reduce((s, r) => s + r.total, 0);

export const lapStokOpname = [
  { no: 1, gudang: "Gudang Utama", namaObat: "Amoxicillin 500mg", selisih: -5, nominalSelisih: 37500 },
  { no: 2, gudang: "Gudang Utama", namaObat: "Paracetamol 500mg", selisih: 12, nominalSelisih: 48000 },
  { no: 3, gudang: "Gudang Utama", namaObat: "Omeprazole 20mg", selisih: -3, nominalSelisih: 45000 },
  { no: 4, gudang: "Gudang Cabang", namaObat: "Metformin 500mg", selisih: 8, nominalSelisih: 24000 },
  { no: 5, gudang: "Gudang Cabang", namaObat: "Amlodipine 5mg", selisih: -2, nominalSelisih: 15000 },
  { no: 6, gudang: "Gudang Utama", namaObat: "Vitamin C 500mg", selisih: 20, nominalSelisih: 40000 },
  { no: 7, gudang: "Gudang Cabang", namaObat: "Antasida Doen", selisih: -7, nominalSelisih: 14000 },
  { no: 8, gudang: "Gudang Utama", namaObat: "Ibuprofen 400mg", selisih: 4, nominalSelisih: 22000 },
];
export const totalNominalSelisih = lapStokOpname.reduce((s, r) => s + Math.abs(r.nominalSelisih), 0);

export const lapHutangObat = [
  { no: 1, noFaktur: "PO/2026/04/0015", supplier: "PT Kimia Farma", jatuhTempo: "30 Mei 2026", total: 5420000 },
  { no: 2, noFaktur: "PO/2026/04/0018", supplier: "PT Kalbe Farma", jatuhTempo: "05 Jun 2026", total: 8750000 },
  { no: 3, noFaktur: "PO/2026/04/0022", supplier: "PT Dexa Medica", jatuhTempo: "10 Jun 2026", total: 3240000 },
  { no: 4, noFaktur: "PO/2026/05/0003", supplier: "PT Phapros", jatuhTempo: "25 Jun 2026", total: 6180000 },
  { no: 5, noFaktur: "PO/2026/05/0007", supplier: "PT Indofarma", jatuhTempo: "30 Jun 2026", total: 4920000 },
];
export const totalHutangObat = lapHutangObat.reduce((s, r) => s + r.total, 0);

export const lapPiutangObat = [
  { no: 1, noFaktur: "PJ/2026/04/0012", pasien: "Ahmad Fauzi", jatuhTempo: "10 Mei 2026", total: 285000 },
  { no: 2, noFaktur: "PJ/2026/04/0015", pasien: "Siti Rahayu", jatuhTempo: "08 Mei 2026", total: 450000 },
  { no: 3, noFaktur: "PJ/2026/04/0021", pasien: "Budi Hartono", jatuhTempo: "05 Mei 2026", total: 175000 },
  { no: 4, noFaktur: "PJ/2026/05/0002", pasien: "Rina Wulandari", jatuhTempo: "20 Mei 2026", total: 620000 },
  { no: 5, noFaktur: "PJ/2026/05/0005", pasien: "Hendra Gunawan", jatuhTempo: "25 Mei 2026", total: 95000 },
  { no: 6, noFaktur: "PJ/2026/05/0009", pasien: "Yuli Astuti", jatuhTempo: "30 Mei 2026", total: 380000 },
];
export const totalPiutangObat = lapPiutangObat.reduce((s, r) => s + r.total, 0);

export const lapObatExpired = [
  { no: 1, gudang: "Gudang Utama", namaObat: "Amoxicillin 500mg (BATCH: B2025001)", sisaStok: "50 Tablet", tanggalExpired: "31 Mei 2026" },
  { no: 2, gudang: "Gudang Utama", namaObat: "Vitamin C 1000mg (BATCH: V2025042)", sisaStok: "120 Tablet", tanggalExpired: "15 Jun 2026" },
  { no: 3, gudang: "Gudang Cabang", namaObat: "Paracetamol 500mg (BATCH: P2025018)", sisaStok: "80 Tablet", tanggalExpired: "30 Jun 2026" },
  { no: 4, gudang: "Gudang Cabang", namaObat: "Antasida Doen (BATCH: A2025007)", sisaStok: "45 Tablet", tanggalExpired: "10 Jul 2026" },
  { no: 5, gudang: "Gudang Utama", namaObat: "Ibuprofen 400mg (BATCH: I2025033)", sisaStok: "60 Tablet", tanggalExpired: "20 Jul 2026" },
  { no: 6, gudang: "Gudang Cabang", namaObat: "Cetirizine 10mg (BATCH: C2025019)", sisaStok: "30 Tablet", tanggalExpired: "30 Jul 2026" },
  { no: 7, gudang: "Gudang Utama", namaObat: "Omeprazole 20mg (BATCH: O2025055)", sisaStok: "25 Kapsul", tanggalExpired: "15 Agt 2026" },
];

export const lapPiutangKlinik = [
  { no: 1, noFaktur: "KS/2026/04/0015", pasien: "Ahmad Fauzi", jatuhTempo: "10 Mei 2026", total: 340000 },
  { no: 2, noFaktur: "KS/2026/04/0018", pasien: "Siti Rahayu", jatuhTempo: "08 Mei 2026", total: 520000 },
  { no: 3, noFaktur: "KS/2026/04/0024", pasien: "Budi Hartono", jatuhTempo: "05 Mei 2026", total: 195000 },
  { no: 4, noFaktur: "KS/2026/05/0003", pasien: "Rina Wulandari", jatuhTempo: "20 Mei 2026", total: 740000 },
  { no: 5, noFaktur: "KS/2026/05/0007", pasien: "Hendra Gunawan", jatuhTempo: "25 Mei 2026", total: 280000 },
];
export const totalPiutangKlinik = lapPiutangKlinik.reduce((s, r) => s + r.total, 0);

export const lapObatStokHabis = [
  { no: 1, gudang: "Gudang Utama", namaObat: "Amoxicillin 500mg", stokMinimal: "100.00 Tablet", stokNyata: "45.00 Tablet" },
  { no: 2, gudang: "Gudang Utama", namaObat: "Metformin 850mg", stokMinimal: "200.00 Tablet", stokNyata: "80.00 Tablet" },
  { no: 3, gudang: "Gudang Cabang", namaObat: "Amlodipine 10mg", stokMinimal: "150.00 Tablet", stokNyata: "30.00 Tablet" },
  { no: 4, gudang: "Gudang Cabang", namaObat: "Glimepiride 2mg", stokMinimal: "100.00 Tablet", stokNyata: "15.00 Tablet" },
  { no: 5, gudang: "Gudang Utama", namaObat: "Captopril 25mg", stokMinimal: "200.00 Tablet", stokNyata: "90.00 Tablet" },
  { no: 6, gudang: "Gudang Cabang", namaObat: "Simvastatin 20mg", stokMinimal: "150.00 Tablet", stokNyata: "60.00 Tablet" },
];

export const lapStokObat = [
  { no: 1, gudang: "Gudang Utama", kodeObat: "OBT-001", namaObat: "Amoxicillin 500mg", stok: "450 Tablet\n45 Strip" },
  { no: 2, gudang: "Gudang Utama", kodeObat: "OBT-002", namaObat: "Paracetamol 500mg", stok: "1200 Tablet\n60 Kotak" },
  { no: 3, gudang: "Gudang Utama", kodeObat: "OBT-003", namaObat: "Omeprazole 20mg", stok: "380 Kapsul\n38 Strip" },
  { no: 4, gudang: "Gudang Cabang", kodeObat: "OBT-004", namaObat: "Metformin 500mg", stok: "820 Tablet" },
  { no: 5, gudang: "Gudang Cabang", kodeObat: "OBT-005", namaObat: "Amlodipine 5mg", stok: "640 Tablet" },
  { no: 6, gudang: "Gudang Utama", kodeObat: "OBT-006", namaObat: "Vitamin C 500mg", stok: "950 Tablet\n95 Strip" },
  { no: 7, gudang: "Gudang Utama", kodeObat: "OBT-007", namaObat: "Antasida Doen", stok: "720 Tablet\n48 Kotak" },
  { no: 8, gudang: "Gudang Cabang", kodeObat: "OBT-008", namaObat: "Ibuprofen 400mg", stok: "580 Tablet" },
];

export const lapObatTerlaris = [
  { no: 1, namaObat: "Paracetamol 500mg", jumlahTerjual: "3.800 Tablet", jumlahTerjualRaw: 3800, jumlahTransaksi: 420, nominal: 1140000 },
  { no: 2, namaObat: "Vitamin C 500mg", jumlahTerjual: "3.200 Tablet", jumlahTerjualRaw: 3200, jumlahTransaksi: 380, nominal: 960000 },
  { no: 3, namaObat: "Antasida Doen", jumlahTerjual: "2.900 Tablet", jumlahTerjualRaw: 2900, jumlahTransaksi: 310, nominal: 1015000 },
  { no: 4, namaObat: "Amoxicillin 500mg", jumlahTerjual: "2.400 Kapsul", jumlahTerjualRaw: 2400, jumlahTransaksi: 285, nominal: 1200000 },
  { no: 5, namaObat: "Ibuprofen 400mg", jumlahTerjual: "2.100 Tablet", jumlahTerjualRaw: 2100, jumlahTransaksi: 240, nominal: 945000 },
  { no: 6, namaObat: "Omeprazole 20mg", jumlahTerjual: "1.850 Kapsul", jumlahTerjualRaw: 1850, jumlahTransaksi: 198, nominal: 1480000 },
  { no: 7, namaObat: "Metformin 500mg", jumlahTerjual: "1.720 Tablet", jumlahTerjualRaw: 1720, jumlahTransaksi: 175, nominal: 688000 },
  { no: 8, namaObat: "Amlodipine 5mg", jumlahTerjual: "1.580 Tablet", jumlahTerjualRaw: 1580, jumlahTransaksi: 162, nominal: 790000 },
];
export const totalObatTerlaris = { jumlahTerjual: lapObatTerlaris.reduce((s, r) => s + r.jumlahTerjualRaw, 0), jumlahTransaksi: lapObatTerlaris.reduce((s, r) => s + r.jumlahTransaksi, 0), nominal: lapObatTerlaris.reduce((s, r) => s + r.nominal, 0) };

export const lapPergantianShift = [
  { no: 1, bukaShift: "10 Mei 2026 07:00", tutupShift: "10 Mei 2026 14:00", kasir: "Ani Susanti", saldoKasir: 2450000 },
  { no: 2, bukaShift: "10 Mei 2026 14:00", tutupShift: "10 Mei 2026 21:00", kasir: "Budi Pranoto", saldoKasir: 3120000 },
  { no: 3, bukaShift: "09 Mei 2026 07:00", tutupShift: "09 Mei 2026 14:00", kasir: "Ani Susanti", saldoKasir: 2890000 },
  { no: 4, bukaShift: "09 Mei 2026 14:00", tutupShift: "09 Mei 2026 21:00", kasir: "Citra Dewi", saldoKasir: 3540000 },
  { no: 5, bukaShift: "08 Mei 2026 07:00", tutupShift: "08 Mei 2026 14:00", kasir: "Budi Pranoto", saldoKasir: 2180000 },
  { no: 6, bukaShift: "25 Apr 2026 14:00", tutupShift: "25 Apr 2026 21:00", kasir: "Citra Dewi", saldoKasir: 2960000 },
];
export const totalSaldoKasir = lapPergantianShift.reduce((s, r) => s + r.saldoKasir, 0);

// ---- LABA RUGI DATA ----
export const labaRugiData = {
  pemasukan: [
    { namaAkun: "Penjualan Obat", nominal: 48750000 },
    { namaAkun: "Jasa Konsultasi", nominal: 12400000 },
    { namaAkun: "Jasa Pemeriksaan", nominal: 8750000 },
    { namaAkun: "Pendapatan Lain-lain", nominal: 2100000 },
  ],
  pengeluaran: [
    { namaAkun: "Gaji Karyawan", nominal: 15000000 },
    { namaAkun: "Sewa Gedung", nominal: 5000000 },
    { namaAkun: "Listrik & Air", nominal: 1800000 },
    { namaAkun: "Operasional", nominal: 2400000 },
  ],
  hpp: [
    { namaAkun: "Obat Terjual", nominal: 32500000 },
    { namaAkun: "Obat Retur", nominal: -1200000 },
    { namaAkun: "Jasa Terjual", nominal: 8750000 },
  ],
};
export const totalPemasukanLabaRugi = labaRugiData.pemasukan.reduce((s, r) => s + r.nominal, 0);
export const totalPengeluaranLabaRugi = labaRugiData.pengeluaran.reduce((s, r) => s + r.nominal, 0);
export const totalHPP = labaRugiData.hpp.reduce((s, r) => s + r.nominal, 0);
export const labaKotor = totalPemasukanLabaRugi - totalHPP;
export const labaBersih = labaKotor - totalPengeluaranLabaRugi;

// ---- NERACA UMUM DATA ----
export const neracaUmumData = {
  aktiva: [
    { label: "Kas & Bank", nominal: 48240000 },
    { label: "Piutang Dagang", nominal: 15750000 },
    { label: "Persediaan Obat", nominal: 87500000 },
    { label: "Aset Tetap", nominal: 250000000 },
    { label: "Aset Lain-lain", nominal: 12500000 },
  ],
  kewajibanModal: [
    { label: "Hutang Dagang", nominal: 32800000 },
    { label: "Hutang Bank", nominal: 125000000 },
    { label: "Kewajiban Lain", nominal: 8500000 },
    { label: "Modal Awal", nominal: 200000000 },
    { label: "Laba Ditahan", nominal: 47690000 },
  ],
};
export const totalAktiva = neracaUmumData.aktiva.reduce((s, r) => s + r.nominal, 0);
export const totalKewajibanModal = neracaUmumData.kewajibanModal.reduce((s, r) => s + r.nominal, 0);

// ---- PENGATURAN BANK DATA ----
export const bankData = [
  { id: 1, bankName: "BCA", accountNumber: "1234567890", accountName: "Klinik Sehat Sentosa", isDefault: true },
  { id: 2, bankName: "Mandiri", accountNumber: "0987654321", accountName: "Klinik Sehat Sentosa", isDefault: false },
  { id: 3, bankName: "BNI", accountNumber: "1122334455", accountName: "Klinik Sehat Sentosa", isDefault: false },
];

// ---- MANAJEMEN USER DATA ----
export const userData = [
  { id: 1, nama: "dr. Budi Santoso", username: "budi.santoso", email: "budi.santoso@klinik.com", hp: "08123456789", alamat: "Jl. Merdeka No. 12, Jakarta", group: "Dokter", aktif: true },
  { id: 2, nama: "dr. Dewi Lestari", username: "dewi.lestari", email: "dewi.lestari@klinik.com", hp: "08234567890", alamat: "Jl. Sudirman No. 45, Jakarta", group: "Dokter", aktif: true },
  { id: 3, nama: "dr. Ahmad Rizki", username: "ahmad.rizki", email: "ahmad.rizki@klinik.com", hp: "08345678901", alamat: "Jl. Gatot Subroto No. 8, Jakarta", group: "Dokter", aktif: true },
  { id: 4, nama: "dr. Sri Mulyani", username: "sri.mulyani", email: "sri.mulyani@klinik.com", hp: "08456789012", alamat: "Jl. Kebon Jeruk No. 21, Jakarta", group: "Dokter", aktif: false },
  { id: 5, nama: "Ani Susanti", username: "ani.susanti", email: "ani.susanti@klinik.com", hp: "08567890123", alamat: "Jl. Pahlawan No. 33, Jakarta", group: "Kasir", aktif: true },
  { id: 6, nama: "Budi Pranoto", username: "budi.pranoto", email: "budi.pranoto@klinik.com", hp: "08678901234", alamat: "Jl. Diponegoro No. 17, Jakarta", group: "Kasir", aktif: true },
  { id: 7, nama: "Citra Dewi", username: "citra.dewi", email: "citra.dewi@klinik.com", hp: "08789012345", alamat: "Jl. Ahmad Yani No. 5, Jakarta", group: "Admin", aktif: true },
  { id: 8, nama: "Dani Kusuma", username: "dani.kusuma", email: "dani.kusuma@klinik.com", hp: "08890123456", alamat: "Jl. Veteran No. 29, Jakarta", group: "Apoteker", aktif: false },
];

// ---- DASHBOARD DOKTER DATA ----
export const dashboardDokterData = {
  dokter: { nama: "dr. Budi Santoso", spesialis: "Dokter Umum" },
  dataKunjungan: [
    { polid: "POL-001", polnama: "Poli Umum", jumantrian: 12, antrianskrg: "005" },
    { polid: "POL-002", polnama: "Poli Anak", jumantrian: 8, antrianskrg: "003" },
  ],
  dataJanji: { jumjanji: 5 },
};

// ---- CABANG DATA ----
export const cabangOptions = [
  { label: 'Semua Cabang', value: 'all' },
  { label: 'Klinik Sehat Sentosa (Pusat)', value: 'KSS-001' },
  { label: 'Klinik Sehat Sentosa Cabang 1', value: 'KSS-002' },
  { label: 'Klinik Sehat Sentosa Cabang 2', value: 'KSS-003' },
  { label: 'Klinik Sehat Sentosa Cabang 3', value: 'KSS-004' },
];

export const gudangOptions = [
  { label: 'Semua Gudang', value: '' },
  { label: 'Gudang Utama', value: 'Gudang Utama' },
  { label: 'Gudang Cabang', value: 'Gudang Cabang' },
];

// Format currency helper
export function formatRupiah(value: number): string {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
}

export function formatNumber(value: number, decimals = 2): string {
  return new Intl.NumberFormat('id-ID', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(value);
}
