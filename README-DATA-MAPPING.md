# Data Mapping Aplikasi

Dokumentasi ini menjelaskan pemetaan data antara request/response API dan elemen antarmuka aplikasi Vmedis Mobile. Setiap field yang dicantumkan berasal dari source code aplikasi, terutama konfigurasi API, normalizer data, halaman dashboard, halaman laporan, form autentikasi, dropdown, card, tabel, dan grafik.

Informasi yang belum terlihat jelas dari source code ditandai dengan `Belum ditemukan / perlu dikonfirmasi.`. Dokumentasi ini tidak memuat password, token, API key, atau data sensitif.

## 1. Data Mapping Aplikasi

Aplikasi menggunakan Next.js App Router dengan proxy API melalui `/api/proxy` atau gateway dari environment. Pemanggilan API frontend dilakukan dengan HTTP `POST` ke proxy, kemudian endpoint target dikirim melalui header `Target-URL`, versi API melalui `Target-Version`, dan parameter dikirim pada body `{ "params": ... }`.

Field API utama ditemukan dari:

- `lib/auth.ts`: login dan pembentukan `UserProfile`.
- `lib/api.ts`: wrapper `fetchApi`.
- `lib/apiConfigs.ts`: endpoint dashboard utama.
- `lib/apiDataNormalizer.ts`: normalisasi response dashboard, obat, forecast, customer, dan keuangan.
- `lib/useReportData.ts`: request laporan dengan pagination `limit` dan `offset`.
- Halaman pada folder `app/`: pemetaan field response ke UI.

## 2. Daftar Modul dan Halaman

| No. | Modul | Nama Halaman | Route | Endpoint Utama | Keterangan |
|---:|---|---|---|---|---|
| 1 | Autentikasi | Login | `/login` | `sys/login-v2`, `penjualan-obat-v3/set-token` | Form login dan registrasi token sesi. |
| 2 | Profil | Profil Pengguna | `/profil` | Local storage `vmob_user` | Menampilkan data pengguna hasil login. |
| 3 | Profil | Ganti Password | `/ganti-password` | Belum ditemukan / perlu dikonfirmasi. | Validasi form lokal; tidak ditemukan request API. |
| 4 | Dashboard | Dashboard Home | `/dashboard` | `mob-ap-dashboard/home-v2` | Ringkasan pendapatan dan grafik. |
| 5 | Dashboard | Obat | `/obat` | `sys-main-menu-obat/index-v4` | Ringkasan stok/nilai obat dan ranking obat. |
| 6 | Dashboard | Keuangan | `/keuangan` | `sys-main-menu-keuangan/index-v6` | Ringkasan keuangan. |
| 7 | Dashboard | Forecast | `/forecast` | `sys-main-menu-forecast/index-v2` | Analisis Pareto dan status pengadaan. |
| 8 | Dashboard | Customer | `/customer` | `sys-main-menu-customer/index` | Grafik customer dan kunjungan. |
| 9 | Laporan | Dashboard Dokter | `/lap-dashboard-dokter` | `mob-dashboard/dashboard-dokter` | Ringkasan dokter. |
| 10 | Laporan | Hutang Obat | `/lap-hutang-obat` | `hutang-obat/index` | Tabel hutang obat. |
| 11 | Laporan | Janji Dengan Dokter | `/lap-janji-dengan-dokter` | `laporan-janji/index` | Tabel jadwal janji pasien. |
| 12 | Laporan | Kunjungan Pasien | `/lap-kunjungan-pasien` | `kunjungan/index` | Tabel kunjungan pasien. |
| 13 | Laporan | Laba Rugi | `/lap-laba-rugi` | `dy-lap-laba-rugi/laporan/` | Laporan laba rugi. |
| 14 | Laporan | Manajemen User | `/lap-manajemen-user` | `sys/index` | Daftar pengguna. |
| 15 | Laporan | Neraca Umum | `/lap-neraca-umum` | `laporanneracanormal/laporan-v2` | Neraca aktiva, kewajiban/modal, dan laba. |
| 16 | Laporan | Obat Expired | `/lap-obat-expired` | `ap-obatexpired-batch/index-v2` | Tabel obat kedaluwarsa. |
| 17 | Laporan | Obat Stok Habis | `/lap-obat-stok-habis` | `my-data-obat/index-mob-v2` | Tabel stok obat habis/minimum. |
| 18 | Laporan | Obat Terlaris | `/lap-obat-terlaris` | `ap-lapobatlaris/index-v3` | Ranking obat terlaris. |
| 19 | Laporan | Pembayaran Kasir | `/lap-pembayaran-kasir` | `kln-lap-bayar-kasir/index` | Tabel pembayaran kasir. |
| 20 | Laporan | Pembelian Obat | `/lap-pembelian-obat` | `laporan-transaksi-pembelian-obat/index` | Tabel pembelian obat. |
| 21 | Laporan | Pendapatan Petugas Medis | `/lap-pendapatan-petugas-medis` | `laporan-pendapatan-petugas-medis/index` | Tabel fee petugas medis. |
| 22 | Laporan | Pengaturan Bank | `/lap-pengaturan-bank` | `mobile-bank/index` | Daftar bank. |
| 23 | Laporan | Penjualan Obat | `/lap-penjualan-obat` | `apt-lap-penjualanobat-batch/indexlaporan-v2` | Tabel penjualan obat. |
| 24 | Laporan | Penjualan Obat Klinik | `/lap-penjualan-obat-klinik` | `ki-penjualanobatklinik/index` | Tabel penjualan obat klinik. |
| 25 | Laporan | Pergantian Shift | `/lap-pergantian-shift` | `aplaporangantishift/index` | Tabel shift kasir. |
| 26 | Laporan | Piutang Klinik | `/lap-piutang-klinik` | `kln-piutang/index` | Tabel piutang klinik. |
| 27 | Laporan | Piutang Obat | `/lap-piutang-obat` | `appiutang-obat/index-v2` | Tabel piutang obat. |
| 28 | Laporan | Registrasi Pasien | `/lap-registrasi-pasien` | `laporanmasterpasien/index` | Tabel pasien terdaftar. |
| 29 | Laporan | Stok Obat | `/lap-stok-obat` | `ap-lapstok-batch/kartu3-v2` | Tabel stok obat. |
| 30 | Laporan | Stok Opname | `/lap-stok-opname` | `aplaporanstokopname/index` | Tabel hasil stok opname. |
| 31 | Laporan | Tagihan Jaminan | `/lap-tagihan-jaminan` | `laporan-tagihan-jaminan-pasien/index` | Tabel tagihan jaminan pasien. |
| 32 | Referensi | Dropdown Cabang | Digunakan lintas laporan | `ap-list-cabang/index` | Sumber pilihan cabang. |
| 33 | Referensi | Dropdown Gudang | Digunakan laporan obat | `apgudang/index` | Sumber pilihan gudang. |

## 3. Data Mapping per Halaman

### Autentikasi — Login

#### Informasi Halaman

| Informasi | Keterangan |
|---|---|
| Nama Halaman | Login |
| Route | `/login` |
| File Komponen | `app/login/page.tsx` |
| Endpoint API | `sys/login-v2`, `penjualan-obat-v3/set-token` |
| HTTP Method | `POST` melalui proxy/gateway |
| Fungsi Halaman | Mengirim domain, username, dan password untuk autentikasi; menyimpan profil hasil login ke local storage. |

#### Struktur Response API

```json
{
  "status": "success",
  "data": {
    "id": "1",
    "app_id": "APP001",
    "app_reg": "db",
    "nama_lengkap": "Pengguna Contoh",
    "nama": "Pengguna",
    "name": "Pengguna",
    "username": "usercontoh",
    "email": "user@example.com",
    "jabatan": "Admin",
    "kl_nama": "Klinik Contoh",
    "nama_apotek": "Apotek Contoh",
    "cabang": "Cabang Contoh",
    "kl_logo": "logo.png",
    "gr_id": "1",
    "status": "1",
    "app_jenis": "3",
    "dokid": "D001",
    "kl_id": "K001"
  }
}
```

#### Data Mapping Response API ke Tampilan

| Atribut API Existing (JSON Field) | Tipe Data | Keterangan / Aturan Tampilan |
|---|---|---|
| `data.id` | String / Integer | Disimpan sebagai `id` dan `user_id` pada profil sesi. |
| `data.app_id` | String | Disimpan sebagai `app_id`; digunakan sebagai parameter `a` pada request berikutnya. |
| `data.app_reg` | String | Disimpan sebagai `app_reg`; digunakan sebagai parameter `reg`. |
| `data.nama_lengkap` | String, Nullable | Prioritas pertama untuk nama pengguna; fallback ke `data.nama`, `data.name`, lalu username input. |
| `data.nama` | String, Nullable | Fallback nama pengguna. |
| `data.name` | String, Nullable | Fallback nama pengguna. |
| `data.username` | String, Nullable | Ditampilkan pada sesi tersimpan dan profil; fallback ke username input. |
| `data.email` | String, Nullable | Disimpan pada profil; fallback string kosong. |
| `data.jabatan` | String, Nullable | Disimpan pada profil; fallback string kosong. |
| `data.kl_nama` | String, Nullable | Prioritas nama cabang; fallback ke `data.nama_apotek`, `data.cabang`, lalu string kosong. |
| `data.nama_apotek` | String, Nullable | Fallback nama cabang/apotek. |
| `data.cabang` | String, Nullable | Fallback nama cabang. |
| `data.kl_logo` | String, Nullable | Jika tersedia, avatar menjadi URL `https://apt.vmedis.com/foto/{kl_logo}`; jika kosong, avatar berupa dua huruf awal nama. |
| `data.gr_id` | String / Integer, Nullable | Disimpan sebagai `group` dan `gr_id`; dipakai untuk mapping role. |
| `data.status` | String / Integer | Jika bernilai `11`, login ditolak dengan pesan akun dinonaktifkan. |
| `data.app_jenis` | String / Integer, Nullable | Digunakan sebagai parameter dashboard; fallback sesuai konfigurasi halaman. |
| `data.dokid` | String, Nullable | Disimpan pada profil; penggunaan UI langsung belum ditemukan. |
| `data.kl_id` | String, Nullable | Digunakan sebagai parameter halaman obat/keuangan. |

### Profil — Profil Pengguna

#### Informasi Halaman

| Informasi | Keterangan |
|---|---|
| Nama Halaman | Profil Pengguna |
| Route | `/profil` |
| File Komponen | `app/profil/page.tsx` |
| Endpoint API | Local storage `vmob_user` hasil login |
| HTTP Method | Tidak ada request API langsung |
| Fungsi Halaman | Menampilkan identitas pengguna aktif. |

#### Struktur Response API

```json
{
  "id": "1",
  "nama": "Pengguna Contoh",
  "username": "usercontoh",
  "cabang": "Klinik Contoh",
  "avatar": "https://apt.vmedis.com/foto/logo.png",
  "gr_id": "1",
  "group": "1"
}
```

#### Data Mapping Response API ke Tampilan

| Atribut API Existing (JSON Field) | Tipe Data | Keterangan / Aturan Tampilan |
|---|---|---|
| `data.nama` | String | Ditampilkan sebagai nama lengkap dan alt avatar; fallback `-` pada info card. |
| `data.username` | String | Ditampilkan sebagai username; fallback `-`. |
| `data.cabang` | String | Ditampilkan sebagai Cabang / Klinik; fallback `-`. |
| `data.avatar` | String (URL) / String inisial | Dipakai komponen `AvatarImage`; fallback teks dua huruf awal dari `nama` atau `username`. |
| `data.gr_id` | String / Integer | Dipetakan menjadi `Admin`, `Kasir`, `Apoteker`, `Dokter`, atau `Role {id}`. |
| `data.group` | String / Integer | Fallback sumber role apabila `gr_id` kosong. |

### Profil — Ganti Password

#### Informasi Halaman

| Informasi | Keterangan |
|---|---|
| Nama Halaman | Ganti Password |
| Route | `/ganti-password` |
| File Komponen | `app/ganti-password/page.tsx` |
| Endpoint API | Belum ditemukan / perlu dikonfirmasi. |
| HTTP Method | Belum ditemukan / perlu dikonfirmasi. |
| Fungsi Halaman | Form lokal untuk validasi password lama, password baru, dan konfirmasi. |

#### Struktur Response API

Belum ditemukan / perlu dikonfirmasi.

#### Data Mapping Response API ke Tampilan

| Atribut API Existing (JSON Field) | Tipe Data | Keterangan / Aturan Tampilan |
|---|---|---|
| Belum ditemukan / perlu dikonfirmasi. | Belum ditemukan / perlu dikonfirmasi. | Tidak ditemukan response API; halaman menggunakan state lokal `passwordLama`, `passwordBaru`, dan `konfirmasi`. |

### Dashboard — Dashboard Home

#### Informasi Halaman

| Informasi | Keterangan |
|---|---|
| Nama Halaman | Dashboard Home |
| Route | `/dashboard` |
| File Komponen | `app/(dashboard)/dashboard/page.tsx` |
| Endpoint API | `mob-ap-dashboard/home-v2` |
| HTTP Method | `POST` melalui proxy/gateway |
| Fungsi Halaman | Menampilkan ringkasan penjualan, pendapatan, jumlah faktur, dan grafik periode. |

#### Struktur Response API

```json
{
  "data": {
    "penjualanUmum": [{ "jumfaktur": "10", "grandtotal": "1500000", "item": "Hari Ini", "sumberGrandtotal": [] }],
    "pesananOnline": [{ "jumfaktur": "2", "grandtotal": "250000", "item": "Hari Ini", "sumberGrandtotal": [] }],
    "penjualanVmart": [{ "jumfaktur": "3", "grandtotal": "300000", "item": "Hari Ini", "sumberGrandtotal": [] }],
    "pembayaranKasir": [{ "jumfaktur": "4", "grandtotal": "400000", "item": "Hari Ini", "sumberGrandtotal": [] }],
    "pendapatanHC": [{ "jumfaktur": "1", "grandtotal": "100000", "item": "Hari Ini", "sumberGrandtotal": [] }],
    "totalPendapatan": [{ "jumfaktur": "20", "grandtotal": "2550000", "item": "Hari Ini", "sumberGrandtotal": [] }]
  }
}
```

#### Data Mapping Response API ke Tampilan

| Atribut API Existing (JSON Field) | Tipe Data | Keterangan / Aturan Tampilan |
|---|---|---|
| `data.penjualanUmum[].jumfaktur` | Integer | Ditampilkan sebagai jumlah faktur pada card Penjualan Kasir; fallback `0 faktur`. |
| `data.penjualanUmum[].grandtotal` | Number | Ditampilkan sebagai Rupiah dengan dua desimal; fallback `Rp 0`. |
| `data.penjualanUmum[].item` | String | Dinormalisasi; penggunaan UI langsung belum ditemukan. |
| `data.penjualanUmum[].sumberGrandtotal` | Array | Dinormalisasi sebagai array; penggunaan UI langsung belum ditemukan. |
| `data.penjualanVmart[].jumfaktur` | Integer | Ditampilkan sebagai jumlah faktur pada card Penjualan Online. |
| `data.penjualanVmart[].grandtotal` | Number | Ditampilkan sebagai nilai Penjualan Online dan series grafik `penjualanOnline`. |
| `data.pembayaranKasir[].jumfaktur` | Integer | Ditampilkan sebagai jumlah faktur pada card Pemeriksaan Klinik. |
| `data.pembayaranKasir[].grandtotal` | Number | Ditampilkan sebagai nilai Pemeriksaan Klinik dan series grafik `pemeriksaanKlinik`. |
| `data.pendapatanHC[].jumfaktur` | Integer | Ditampilkan sebagai jumlah faktur pada card Pendapatan HomeCare. |
| `data.pendapatanHC[].grandtotal` | Number | Ditampilkan sebagai nilai Pendapatan HomeCare dan series grafik `pendapatanHomecare`. |
| `data.totalPendapatan[].jumfaktur` | Integer | Ditampilkan sebagai jumlah faktur pada card Total Pendapatan. |
| `data.totalPendapatan[].grandtotal` | Number | Ditampilkan sebagai total pendapatan dan series grafik `totalPendapatan`. |
| `data.pesananOnline[].jumfaktur` | Integer | Dinormalisasi; penggunaan UI langsung pada dashboard belum ditemukan. |
| `data.pesananOnline[].grandtotal` | Number | Dinormalisasi; penggunaan UI langsung pada dashboard belum ditemukan. |

### Dashboard — Obat

#### Informasi Halaman

| Informasi | Keterangan |
|---|---|
| Nama Halaman | Obat |
| Route | `/obat` |
| File Komponen | `app/(dashboard)/obat/page.tsx` |
| Endpoint API | `sys-main-menu-obat/index-v4` |
| HTTP Method | `POST` melalui proxy/gateway |
| Fungsi Halaman | Menampilkan ringkasan nilai obat, obat expired, stok habis/hilang, pengadaan obat, dan obat terlaris. |

#### Struktur Response API

```json
{
  "data": {
    "dataNilaiObat": { "count": "100", "nilai": "5000000", "peningkatan": "5" },
    "dataObatExpired": { "count": "2", "nilai": "100000", "peningkatan": "-1" },
    "dataObatStokHabis": { "count": "4", "peningkatan": "2" },
    "dataObatStokHilang": { "count": "1", "nilai": "50000", "peningkatan": "0", "statistik": [{ "total": "50000" }] },
    "dataPengadaanObatTerbanyak": { "peningkatan": "3", "ranking": [{ "obatid": "OB001", "jumlah": "10", "satuan": "pcs", "obatnama": "Obat A" }], "statistik": [{ "total": "100000" }] },
    "dataObatTerlaris": [{ "obatid": "OB002", "obatnama": "Obat B", "satuan": "strip", "jumlah": "20" }]
  }
}
```

#### Data Mapping Response API ke Tampilan

| Atribut API Existing (JSON Field) | Tipe Data | Keterangan / Aturan Tampilan |
|---|---|---|
| `data.dataNilaiObat.count` | Integer | Ditampilkan sebagai jumlah/nilai ringkasan; fallback `0`. |
| `data.dataNilaiObat.nilai` | Number | Ditampilkan dalam format Rupiah bila digunakan sebagai nilai uang; fallback `0`. |
| `data.dataNilaiObat.peningkatan` | Number | Ditampilkan sebagai persentase perubahan; positif hijau, negatif merah mengikuti `StatCard`. |
| `data.dataObatExpired.count` | Integer | Ditampilkan sebagai jumlah obat expired; fallback `0`. |
| `data.dataObatExpired.nilai` | Number | Ditampilkan sebagai nilai obat expired; fallback `0`. |
| `data.dataObatExpired.peningkatan` | Number | Persentase perubahan; fallback `0.0%`. |
| `data.dataObatStokHabis.count` | Integer | Ditampilkan sebagai jumlah stok habis; fallback `0`. |
| `data.dataObatStokHabis.peningkatan` | Number | Persentase perubahan; fallback `0.0%`. |
| `data.dataObatStokHilang.count` | Integer | Ditampilkan sebagai jumlah stok hilang; fallback `0`. |
| `data.dataObatStokHilang.nilai` | Number | Nilai stok hilang; fallback `0`. |
| `data.dataObatStokHilang.statistik[].total` | Number | Series grafik `obatHilang`; fallback `0`. |
| `data.dataPengadaanObatTerbanyak.ranking[].obatid` | String | Identitas obat pada ranking; fallback string kosong. |
| `data.dataPengadaanObatTerbanyak.ranking[].obatnama` | String | Ditampilkan sebagai nama obat ranking; fallback string kosong atau `-` pada UI. |
| `data.dataPengadaanObatTerbanyak.ranking[].jumlah` | Number | Ditampilkan sebagai jumlah ranking; fallback `0`. |
| `data.dataPengadaanObatTerbanyak.ranking[].satuan` | String | Ditampilkan sebagai satuan; fallback string kosong. |
| `data.dataPengadaanObatTerbanyak.statistik[].total` | Number | Series grafik `pembelianObat`; fallback `0`. |
| `data.dataObatTerlaris[].obatid` | String | Identitas obat terlaris; fallback string kosong. |
| `data.dataObatTerlaris[].obatnama` | String | Ditampilkan sebagai nama obat terlaris. |
| `data.dataObatTerlaris[].satuan` | String | Ditampilkan sebagai satuan obat. |
| `data.dataObatTerlaris[].jumlah` | Number | Ditampilkan sebagai jumlah obat terlaris; fallback `0`. |

### Dashboard — Keuangan

#### Informasi Halaman

| Informasi | Keterangan |
|---|---|
| Nama Halaman | Keuangan |
| Route | `/keuangan` |
| File Komponen | `app/(dashboard)/keuangan/page.tsx` |
| Endpoint API | `sys-main-menu-keuangan/index-v6` |
| HTTP Method | `POST` melalui proxy/gateway |
| Fungsi Halaman | Menampilkan data keuangan dan grafik aset, cash, pasiva, pendapatan, pengeluaran, laba rugi, hutang, dan piutang. |

#### Struktur Response API

```json
{
  "data": {
    "dataAset": [{ "y": "1000000" }],
    "dataCash": [{ "y": "500000" }],
    "dataPasiva": [{ "y": "300000" }],
    "dataPendapatan": [{ "y": "750000" }],
    "dataPengeluaran": [{ "y": "250000" }],
    "dataLabarugi": [{ "y": "500000" }],
    "dataHutang": [{ "y": "100000" }],
    "dataPiutang": [{ "y": "150000" }],
    "dataPiutangKlinik": [{ "y": "200000" }]
  }
}
```

#### Data Mapping Response API ke Tampilan

| Atribut API Existing (JSON Field) | Tipe Data | Keterangan / Aturan Tampilan |
|---|---|---|
| `data.dataAset[].y` | Number | Series grafik/card `totalAset`; parsed dengan `parseFloat`; fallback `0`. |
| `data.dataCash[].y` | Number | Series grafik/card `totalCash`; fallback `0`. |
| `data.dataPasiva[].y` | Number | Series grafik/card `totalPasiva`; fallback `0`. |
| `data.dataPendapatan[].y` | Number | Series grafik/card `totalPendapatan`; fallback `0`. |
| `data.dataPengeluaran[].y` | Number | Series grafik/card `totalPengeluaran`; fallback `0`. |
| `data.dataLabarugi[].y` | Number | Series grafik/card `labaRugi`; fallback `0`. |
| `data.dataHutang[].y` | Number | Series grafik/card `totalHutangObat`; fallback `0`. |
| `data.dataPiutang[].y` | Number | Series grafik/card `totalPiutangApotek`; fallback `0`. |
| `data.dataPiutangKlinik[].y` | Number | Series grafik/card `totalPiutangKlinik`; fallback `0`. |

### Dashboard — Forecast

#### Informasi Halaman

| Informasi | Keterangan |
|---|---|
| Nama Halaman | Forecast |
| Route | `/forecast` |
| File Komponen | `app/(dashboard)/forecast/page.tsx` |
| Endpoint API | `sys-main-menu-forecast/index-v2` |
| HTTP Method | `POST` melalui proxy/gateway |
| Fungsi Halaman | Menampilkan analisis Pareto, status pengadaan, nilai nominal, dan kategori laris. |

#### Struktur Response API

```json
{
  "data": {
    "paretoA": "10",
    "paretoB": "20",
    "paretoC": "30",
    "paretoMin": "5",
    "paA": "40.5",
    "paB": "30.0",
    "paC": "20.0",
    "paMin": "9.5",
    "status1": "11",
    "status2": "2",
    "status3": "3",
    "status4": "1",
    "pStatus1": "64.7",
    "pStatus2": "11.8",
    "pStatus3": "17.6",
    "pStatus4": "5.9",
    "nominalParetoA": "1000000",
    "nominalParetoB": "500000",
    "nominalParetoC": "250000",
    "nominalParetoMin": "100000",
    "pengadaan1": "100",
    "pengadaan2": "20",
    "pengadaan3": "30",
    "pengadaan4": "10",
    "katlaris": {},
    "total": "1850000",
    "countData": "65",
    "grandtotal": "1850000",
    "interval": "3",
    "jmldata": "65"
  }
}
```

#### Data Mapping Response API ke Tampilan

| Atribut API Existing (JSON Field) | Tipe Data | Keterangan / Aturan Tampilan |
|---|---|---|
| `data.paretoA` | Integer | Ditampilkan sebagai kategori Pareto A dan series grafik `paretoAnalysis`; fallback `0`. |
| `data.paretoB` | Integer | Ditampilkan sebagai Pareto B; fallback `0`. |
| `data.paretoC` | Integer | Ditampilkan sebagai Pareto C; fallback `0`. |
| `data.paretoMin` | Integer | Ditampilkan sebagai Dibawah/Under Pareto C; fallback `0`. |
| `data.paA` | Number | Persentase Pareto A; fallback `0`. |
| `data.paB` | Number | Persentase Pareto B; fallback `0`. |
| `data.paC` | Number | Persentase Pareto C; fallback `0`. |
| `data.paMin` | Number | Persentase dibawah Pareto C; fallback `0`. |
| `data.status1` | Integer | Ditampilkan sebagai `Stock On Hand` pada grafik status; fallback `0`. |
| `data.status2` | Integer | Ditampilkan sebagai `Over Stock`; fallback `0`. |
| `data.status3` | Integer | Ditampilkan sebagai `Under Stock`; fallback `0`. |
| `data.status4` | Integer | Ditampilkan sebagai `Potential Lost`; fallback `0`. |
| `data.pStatus1` | Number | Persentase status 1; fallback `0`. |
| `data.pStatus2` | Number | Persentase status 2; fallback `0`. |
| `data.pStatus3` | Number | Persentase status 3; fallback `0`. |
| `data.pStatus4` | Number | Persentase status 4; fallback `0`. |
| `data.nominalParetoA` | Number | Nilai nominal Pareto A; ditampilkan sebagai Rupiah jika digunakan. |
| `data.nominalParetoB` | Number | Nilai nominal Pareto B. |
| `data.nominalParetoC` | Number | Nilai nominal Pareto C. |
| `data.nominalParetoMin` | Number | Nilai nominal dibawah Pareto C. |
| `data.pengadaan1` | Number | Nilai pengadaan status 1; fallback `0`. |
| `data.pengadaan2` | Number | Nilai pengadaan status 2; fallback `0`. |
| `data.pengadaan3` | Number | Nilai pengadaan status 3; fallback `0`. |
| `data.pengadaan4` | Number | Nilai pengadaan status 4; fallback `0`. |
| `data.katlaris` | Object | Dinormalisasi sebagai object; detail UI belum ditemukan / perlu dikonfirmasi. |
| `data.total` | Number | Dinormalisasi; penggunaan UI detail belum ditemukan. |
| `data.countData` | Integer | Dinormalisasi; penggunaan UI detail belum ditemukan. |
| `data.grandtotal` | Number | Dinormalisasi; penggunaan UI detail belum ditemukan. |
| `data.interval` | Integer | Dinormalisasi; penggunaan UI detail belum ditemukan. |
| `data.jmldata` | Integer | Dinormalisasi; penggunaan UI detail belum ditemukan. |

### Dashboard — Customer

#### Informasi Halaman

| Informasi | Keterangan |
|---|---|
| Nama Halaman | Customer |
| Route | `/customer` |
| File Komponen | `app/(dashboard)/customer/page.tsx` |
| Endpoint API | `sys-main-menu-customer/index` |
| HTTP Method | `POST` melalui proxy/gateway |
| Fungsi Halaman | Menampilkan data customer bulanan, pasien baru, dan kunjungan pasien. |

#### Struktur Response API

```json
{
  "databulanan": [{
    "tgl": "2026-06",
    "total": "1000000",
    "totalcustomer": "100",
    "paretoA": "10",
    "paretoB": "20",
    "paretoC": "30",
    "paretoD": "40",
    "paretoMin": "5"
  }],
  "datapasienbaru": { "peningkatan": "5", "count": "12", "statistik": [{ "total": "12" }] },
  "datakunjungan": { "peningkatan": "3", "count": "50", "statistik": [{ "total": "50" }] }
}
```

#### Data Mapping Response API ke Tampilan

| Atribut API Existing (JSON Field) | Tipe Data | Keterangan / Aturan Tampilan |
|---|---|---|
| `databulanan[].tgl` | String (Date/Period) | Periode data bulanan; label grafik digenerate berdasarkan periode aktif; fallback string kosong. |
| `databulanan[].total` | Number | Total nilai customer; fallback `0`. |
| `databulanan[].totalcustomer` | Integer | Series grafik `totalCustomer`; fallback `0`. |
| `databulanan[].paretoA` | Integer | Series grafik `loyalCustomer`; fallback `0`. |
| `databulanan[].paretoB` | Integer | Series grafik `potensialCustomer`; fallback `0`. |
| `databulanan[].paretoC` | Integer | Series grafik `prospekCustomer`; fallback `0`. |
| `databulanan[].paretoD` | Integer | Series grafik `belumProspek`; fallback `0`. |
| `databulanan[].paretoMin` | Integer | Dinormalisasi; penggunaan UI langsung belum ditemukan. |
| `datapasienbaru.peningkatan` | Number | Persentase perubahan pasien baru; fallback `0`. |
| `datapasienbaru.count` | Integer | Jumlah pasien baru; fallback `0`. |
| `datapasienbaru.statistik[].total` | Integer | Series grafik `pasienBaru`; fallback `0`. |
| `datakunjungan.peningkatan` | Number | Persentase perubahan kunjungan; fallback `0`. |
| `datakunjungan.count` | Integer | Jumlah kunjungan; fallback `0`. |
| `datakunjungan.statistik[].total` | Integer | Series grafik `kunjunganPasien`; fallback `0`. |

### Laporan — Dashboard Dokter

#### Informasi Halaman

| Informasi | Keterangan |
|---|---|
| Nama Halaman | Dashboard Dokter |
| Route | `/lap-dashboard-dokter` |
| File Komponen | `app/(laporan)/lap-dashboard-dokter/page.tsx` |
| Endpoint API | `mob-dashboard/dashboard-dokter` |
| HTTP Method | `POST` melalui proxy/gateway |
| Fungsi Halaman | Menampilkan data dashboard dokter. |

#### Struktur Response API

Belum ditemukan / perlu dikonfirmasi.

#### Data Mapping Response API ke Tampilan

| Atribut API Existing (JSON Field) | Tipe Data | Keterangan / Aturan Tampilan |
|---|---|---|
| Belum ditemukan / perlu dikonfirmasi. | Belum ditemukan / perlu dikonfirmasi. | Endpoint ditemukan, tetapi struktur field tampilan detail belum cukup jelas dari hasil analisis ringkas. |

### Laporan — Hutang Obat

#### Informasi Halaman

| Informasi | Keterangan |
|---|---|
| Nama Halaman | Hutang Obat |
| Route | `/lap-hutang-obat` |
| File Komponen | `app/(laporan)/lap-hutang-obat/page.tsx` |
| Endpoint API | `hutang-obat/index` |
| HTTP Method | `POST` melalui proxy/gateway |
| Fungsi Halaman | Menampilkan tabel hutang obat berdasarkan rentang tanggal dan cabang. |

#### Struktur Response API

```json
{ "data": [{ "tgl": "2026-06-27", "pemofaktur": "PO-001", "supnama": "Supplier Contoh", "total": "150000" }] }
```

#### Data Mapping Response API ke Tampilan

| Atribut API Existing (JSON Field) | Tipe Data | Keterangan / Aturan Tampilan |
|---|---|---|
| `data[].tgl` | String (Date) | Ditampilkan pada kolom `Tgl`; fallback `-`. |
| `data[].pemofaktur` | String | Ditampilkan pada kolom `No Faktur`; fallback `-`. |
| `data[].supnama` | String | Ditampilkan pada kolom `Supplier`; fallback `-`. |
| `data[].total` | Number | Ditampilkan pada kolom `Total Bayar`; format uang/angka mengikuti render halaman, perlu konfirmasi detail. |

### Laporan — Janji Dengan Dokter

#### Informasi Halaman

| Informasi | Keterangan |
|---|---|
| Nama Halaman | Janji Dengan Dokter |
| Route | `/lap-janji-dengan-dokter` |
| File Komponen | `app/(laporan)/lap-janji-dengan-dokter/page.tsx` |
| Endpoint API | `laporan-janji/index` |
| HTTP Method | `POST` melalui proxy/gateway |
| Fungsi Halaman | Menampilkan daftar janji pasien dengan dokter. |

#### Struktur Response API

```json
{ "data": [{ "jantanggal": "2026-06-27", "pasnama": "Pasien Contoh", "doknama": "Dokter Contoh", "janketerangan": "Kontrol", "pasrm": "RM001" }] }
```

#### Data Mapping Response API ke Tampilan

| Atribut API Existing (JSON Field) | Tipe Data | Keterangan / Aturan Tampilan |
|---|---|---|
| `data[].jantanggal` | String (Date) | Kolom `Tanggal`; fallback `-`. |
| `data[].pasnama` | String | Kolom `Pasien`; fallback `-`. |
| `data[].doknama` | String | Kolom `Dokter`; fallback `-`. |
| `data[].janketerangan` | String | Kolom `Keterangan`; fallback `-`. |
| `data[].pasrm` | String | Nomor RM tambahan; fallback `-`. |

### Laporan — Kunjungan Pasien

#### Informasi Halaman

| Informasi | Keterangan |
|---|---|
| Nama Halaman | Kunjungan Pasien |
| Route | `/lap-kunjungan-pasien` |
| File Komponen | `app/(laporan)/lap-kunjungan-pasien/page.tsx` |
| Endpoint API | `kunjungan/index` |
| HTTP Method | `POST` melalui proxy/gateway |
| Fungsi Halaman | Menampilkan daftar kunjungan pasien. |

#### Struktur Response API

```json
{ "data": [{ "kuntgl": "2026-06-27", "pasnama": "Pasien Contoh", "polnama": "Poli Umum", "doknama": "Dokter Contoh", "kunid": "K001", "kunnomer": "KN-001", "pasrm": "RM001", "pasjk": "L", "kunstatus": "selesai" }] }
```

#### Data Mapping Response API ke Tampilan

| Atribut API Existing (JSON Field) | Tipe Data | Keterangan / Aturan Tampilan |
|---|---|---|
| `data[].kuntgl` | String (Date) | Kolom `Tanggal`; fallback `-`. |
| `data[].pasnama` | String | Kolom `Nama`; fallback `-`. |
| `data[].polnama` | String | Kolom `Poli`; fallback `-`. |
| `data[].doknama` | String | Kolom `Dokter`; fallback `-`. |
| `data[].kunid` | String | Identitas kunjungan; fallback string kosong. |
| `data[].kunnomer` | String | Nomor kunjungan; fallback `-`. |
| `data[].pasrm` | String | Nomor RM; fallback `-`. |
| `data[].pasjk` | String | Jenis kelamin; fallback `-`. |
| `data[].kunstatus` | String | Status kunjungan; fallback string kosong. |

### Laporan — Laba Rugi

#### Informasi Halaman

| Informasi | Keterangan |
|---|---|
| Nama Halaman | Laba Rugi |
| Route | `/lap-laba-rugi` |
| File Komponen | `app/(laporan)/lap-laba-rugi/page.tsx` |
| Endpoint API | `dy-lap-laba-rugi/laporan/` |
| HTTP Method | `POST` melalui proxy/gateway |
| Fungsi Halaman | Menampilkan laporan laba rugi. |

#### Struktur Response API

Belum ditemukan / perlu dikonfirmasi.

#### Data Mapping Response API ke Tampilan

| Atribut API Existing (JSON Field) | Tipe Data | Keterangan / Aturan Tampilan |
|---|---|---|
| Belum ditemukan / perlu dikonfirmasi. | Belum ditemukan / perlu dikonfirmasi. | Endpoint ditemukan, tetapi field response yang digunakan UI belum cukup jelas dari hasil analisis ringkas. |

### Laporan — Manajemen User

#### Informasi Halaman

| Informasi | Keterangan |
|---|---|
| Nama Halaman | Manajemen User |
| Route | `/lap-manajemen-user` |
| File Komponen | `app/(laporan)/lap-manajemen-user/page.tsx` |
| Endpoint API | `sys/index` |
| HTTP Method | `POST` melalui proxy/gateway |
| Fungsi Halaman | Menampilkan daftar pengguna dan informasi grup. |

#### Struktur Response API

```json
{ "data": [{ "user_id": "U001", "id": "1", "nama_lengkap": "User Contoh", "nama": "User", "username": "user", "email": "user@example.com", "alamat": "Alamat", "alamatuser": "Alamat", "gr_nama": "Admin", "grup": "Admin", "logo": "logo.png", "foto": "foto.png", "user_wa": "08123456789" }] }
```

#### Data Mapping Response API ke Tampilan

| Atribut API Existing (JSON Field) | Tipe Data | Keterangan / Aturan Tampilan |
|---|---|---|
| `data[].user_id` | String | Prioritas ID user; fallback `data[].id`, lalu index. |
| `data[].id` | String / Integer | Fallback ID user. |
| `data[].nama_lengkap` | String | Nama pengguna; fallback `data[].nama`, lalu `-`. |
| `data[].nama` | String | Fallback nama pengguna. |
| `data[].username` | String | Ditampilkan sebagai username; fallback `-`. |
| `data[].email` | String | Ditampilkan sebagai email; fallback `-`. |
| `data[].alamat` | String | Alamat; fallback `data[].alamatuser`, lalu `-`. |
| `data[].alamatuser` | String | Fallback alamat. |
| `data[].gr_nama` | String | Nama grup; fallback `data[].grup`, lalu `Other`. |
| `data[].grup` | String | Fallback grup. |
| `data[].logo` | String (URL/File), Nullable | Foto profil; fallback `data[].foto`, lalu string kosong. |
| `data[].foto` | String (URL/File), Nullable | Fallback foto profil. |
| `data[].user_wa` | String | Nomor WhatsApp/HP; fallback `-`. |

### Laporan — Neraca Umum

#### Informasi Halaman

| Informasi | Keterangan |
|---|---|
| Nama Halaman | Neraca Umum |
| Route | `/lap-neraca-umum` |
| File Komponen | `app/(laporan)/lap-neraca-umum/page.tsx` |
| Endpoint API | `laporanneracanormal/laporan-v2` |
| HTTP Method | `POST` melalui proxy/gateway |
| Fungsi Halaman | Menampilkan neraca aktiva dan kewajiban/modal, termasuk perhitungan laba. |

#### Struktur Response API

```json
{ "data": [{ "data1": [{ "aknama": "Kas", "nominal": "1000000" }], "data23": [{ "aknama": "Modal", "nominal": "1000000" }], "datalaba": [{ "nominal": "500000" }], "datalabacabang": [{ "nominal": "100000" }] }] }
```

#### Data Mapping Response API ke Tampilan

| Atribut API Existing (JSON Field) | Tipe Data | Keterangan / Aturan Tampilan |
|---|---|---|
| `data[].data1[].aknama` | String | Label akun sisi aktiva; fallback belum ditemukan / perlu dikonfirmasi. |
| `data[].data1[].nominal` | Number | Nilai akun aktiva; digunakan dalam total aktiva dan format Rupiah. |
| `data[].data23[].aknama` | String | Label akun kewajiban/modal. |
| `data[].data23[].nominal` | Number | Nilai akun kewajiban/modal; digunakan dalam total. |
| `data[].datalaba[].nominal` | Number | Digunakan menghitung laba. |
| `data[].datalabacabang[].nominal` | Number | Digunakan menghitung laba cabang. |

### Laporan — Obat Expired

#### Informasi Halaman

| Informasi | Keterangan |
|---|---|
| Nama Halaman | Obat Expired |
| Route | `/lap-obat-expired` |
| File Komponen | `app/(laporan)/lap-obat-expired/page.tsx` |
| Endpoint API | `ap-obatexpired-batch/index-v2` |
| HTTP Method | `POST` melalui proxy/gateway |
| Fungsi Halaman | Menampilkan daftar obat yang mendekati atau sudah expired. |

#### Struktur Response API

```json
{ "data": [{ "gudnama": "Gudang Utama", "obatnama": "Obat A", "sisa": "5", "tglexpired": "2026-12-31" }] }
```

#### Data Mapping Response API ke Tampilan

| Atribut API Existing (JSON Field) | Tipe Data | Keterangan / Aturan Tampilan |
|---|---|---|
| `data[].gudnama` | String | Kolom `Gudang`; fallback `-`. |
| `data[].obatnama` | String | Kolom `Nama Obat`; fallback perlu dikonfirmasi dari detail source. |
| `data[].sisa` | Number | Kolom `Sisa Stok`; fallback perlu dikonfirmasi. |
| `data[].tglexpired` | String (Date) | Kolom `Tgl Expired`; fallback perlu dikonfirmasi. |

### Laporan — Obat Stok Habis

#### Informasi Halaman

| Informasi | Keterangan |
|---|---|
| Nama Halaman | Obat Stok Habis |
| Route | `/lap-obat-stok-habis` |
| File Komponen | `app/(laporan)/lap-obat-stok-habis/page.tsx` |
| Endpoint API | `my-data-obat/index-mob-v2` |
| HTTP Method | `POST` melalui proxy/gateway |
| Fungsi Halaman | Menampilkan obat dengan stok habis/minimum berdasarkan gudang. |

#### Struktur Response API

```json
{ "data": [{ "gudnama": "Gudang Utama", "obatnama": "Obat A", "stokminimal": "10", "stok": "2" }] }
```

#### Data Mapping Response API ke Tampilan

| Atribut API Existing (JSON Field) | Tipe Data | Keterangan / Aturan Tampilan |
|---|---|---|
| `data[].gudnama` | String | Kolom `Gudang`; fallback `-`. |
| `data[].obatnama` | String | Kolom `Nama Obat`; fallback `-`. |
| `data[].stokminimal` | Number | Kolom `Stok Minimal`; fallback perlu dikonfirmasi. |
| `data[].stok` | Number | Kolom `Stok Nyata`; fallback perlu dikonfirmasi. |

### Laporan — Obat Terlaris

#### Informasi Halaman

| Informasi | Keterangan |
|---|---|
| Nama Halaman | Obat Terlaris |
| Route | `/lap-obat-terlaris` |
| File Komponen | `app/(laporan)/lap-obat-terlaris/page.tsx` |
| Endpoint API | `ap-lapobatlaris/index-v3` |
| HTTP Method | `POST` melalui proxy/gateway |
| Fungsi Halaman | Menampilkan ranking obat terlaris. |

#### Struktur Response API

```json
{ "data": [{ "obatnama": "Obat A", "jumlahTerjualRaw": "20", "jumlahTransaksi": "5", "nominal": "250000" }] }
```

#### Data Mapping Response API ke Tampilan

| Atribut API Existing (JSON Field) | Tipe Data | Keterangan / Aturan Tampilan |
|---|---|---|
| `data[].obatnama` | String | Kolom `Nama Obat`; fallback `-`. |
| `data[].jumlahTerjualRaw` | Number | Kolom `Jml Terjual`; fallback perlu dikonfirmasi. |
| `data[].jumlahTransaksi` | Integer | Kolom `Jml Transaksi`; fallback perlu dikonfirmasi. |
| `data[].nominal` | Number | Kolom `Nominal`; ditampilkan sebagai nilai uang. |

### Laporan — Pembayaran Kasir

#### Informasi Halaman

| Informasi | Keterangan |
|---|---|
| Nama Halaman | Pembayaran Kasir |
| Route | `/lap-pembayaran-kasir` |
| File Komponen | `app/(laporan)/lap-pembayaran-kasir/page.tsx` |
| Endpoint API | `kln-lap-bayar-kasir/index` |
| HTTP Method | `POST` melalui proxy/gateway |
| Fungsi Halaman | Menampilkan daftar pembayaran kasir. |

#### Struktur Response API

```json
{ "data": [{ "pemtanggal": "2026-06-27", "pemnofaktur": "FK-001", "pasnama": "Pasien Contoh", "pasrm": "RM001", "pemjenis": "Tunai", "katnama": "Umum", "polnama": "Poli Umum", "doknama": "Dokter Contoh", "total": "150000" }] }
```

#### Data Mapping Response API ke Tampilan

| Atribut API Existing (JSON Field) | Tipe Data | Keterangan / Aturan Tampilan |
|---|---|---|
| `data[].pemtanggal` | String (Date/Datetime) | Kolom `Tgl` melalui field normalisasi `tanggalISO`; fallback perlu dikonfirmasi. |
| `data[].pemnofaktur` | String | Kolom `No Faktur`; fallback `-`. |
| `data[].pasnama` | String | Kolom `Pasien`; fallback `-`. |
| `data[].pasrm` | String | Nomor RM; fallback `-`. |
| `data[].pemjenis` | String | Jenis pembayaran; fallback `-`. |
| `data[].katnama` | String | Kategori; fallback `-`. |
| `data[].polnama` | String | Poli; fallback `-`. |
| `data[].doknama` | String | Kolom `Dokter`; fallback `-`. |
| `data[].total` | Number | Kolom `Total`; format uang/angka mengikuti render halaman. |

### Laporan — Pembelian Obat

#### Informasi Halaman

| Informasi | Keterangan |
|---|---|
| Nama Halaman | Pembelian Obat |
| Route | `/lap-pembelian-obat` |
| File Komponen | `app/(laporan)/lap-pembelian-obat/page.tsx` |
| Endpoint API | `laporan-transaksi-pembelian-obat/index` |
| HTTP Method | `POST` melalui proxy/gateway |
| Fungsi Halaman | Menampilkan transaksi pembelian obat. |

#### Struktur Response API

```json
{ "data": [{ "tgl": "2026-06-27", "pemofaktur": "PO-001", "supnama": "Supplier Contoh", "gudnama": "Gudang Utama", "total": "500000" }] }
```

#### Data Mapping Response API ke Tampilan

| Atribut API Existing (JSON Field) | Tipe Data | Keterangan / Aturan Tampilan |
|---|---|---|
| `data[].tgl` | String (Date) | Kolom `Tgl`; fallback `-`. |
| `data[].pemofaktur` | String | Kolom `No Faktur`; fallback `-`. |
| `data[].supnama` | String | Kolom `Supplier`; fallback `-`. |
| `data[].gudnama` | String | Field gudang; fallback `-`. |
| `data[].total` | Number | Kolom `Total`; format uang/angka mengikuti render halaman. |

### Laporan — Pendapatan Petugas Medis

#### Informasi Halaman

| Informasi | Keterangan |
|---|---|
| Nama Halaman | Pendapatan Petugas Medis |
| Route | `/lap-pendapatan-petugas-medis` |
| File Komponen | `app/(laporan)/lap-pendapatan-petugas-medis/page.tsx` |
| Endpoint API | `laporan-pendapatan-petugas-medis/index` |
| HTTP Method | `POST` melalui proxy/gateway |
| Fungsi Halaman | Menampilkan fee dokter/petugas medis. |

#### Struktur Response API

```json
{ "data": [{ "pemtanggal": "2026-06-27", "pemnofaktur": "FK-001", "doknama": "Dokter Contoh", "bianama": "Pemeriksaan", "feedokter": "75000" }] }
```

#### Data Mapping Response API ke Tampilan

| Atribut API Existing (JSON Field) | Tipe Data | Keterangan / Aturan Tampilan |
|---|---|---|
| `data[].pemtanggal` | String (Date/Datetime) | Tanggal transaksi; fallback `-`. |
| `data[].pemnofaktur` | String | Kolom `No. Faktur`; fallback `-`. |
| `data[].doknama` | String | Kolom `Dokter`; fallback `-`. |
| `data[].bianama` | String | Kolom `Pemeriksaan`; fallback `-`. |
| `data[].feedokter` | Number | Kolom `Fee Dokter`; format uang/angka mengikuti render halaman. |

### Laporan — Pengaturan Bank

#### Informasi Halaman

| Informasi | Keterangan |
|---|---|
| Nama Halaman | Pengaturan Bank |
| Route | `/lap-pengaturan-bank` |
| File Komponen | `app/(laporan)/lap-pengaturan-bank/page.tsx` |
| Endpoint API | `mobile-bank/index` |
| HTTP Method | `POST` melalui proxy/gateway |
| Fungsi Halaman | Menampilkan daftar bank. |

#### Struktur Response API

Belum ditemukan / perlu dikonfirmasi.

#### Data Mapping Response API ke Tampilan

| Atribut API Existing (JSON Field) | Tipe Data | Keterangan / Aturan Tampilan |
|---|---|---|
| Belum ditemukan / perlu dikonfirmasi. | Belum ditemukan / perlu dikonfirmasi. | Endpoint ditemukan, tetapi field response yang digunakan UI belum cukup jelas dari hasil analisis ringkas. |

### Laporan — Penjualan Obat

#### Informasi Halaman

| Informasi | Keterangan |
|---|---|
| Nama Halaman | Penjualan Obat |
| Route | `/lap-penjualan-obat` |
| File Komponen | `app/(laporan)/lap-penjualan-obat/page.tsx` |
| Endpoint API | `apt-lap-penjualanobat-batch/indexlaporan-v2` |
| HTTP Method | `POST` melalui proxy/gateway |
| Fungsi Halaman | Menampilkan transaksi penjualan obat. |

#### Struktur Response API

```json
{ "data": [{ "pjnofaktur": "PJ-001", "pasnama": "Pasien Contoh", "doknama": "Dokter Contoh", "pjtanggal": "2026-06-27", "total": "200000" }] }
```

#### Data Mapping Response API ke Tampilan

| Atribut API Existing (JSON Field) | Tipe Data | Keterangan / Aturan Tampilan |
|---|---|---|
| `data[].pjnofaktur` | String | Kolom `No Faktur`; fallback string kosong. |
| `data[].pasnama` | String | Kolom `Pasien`; fallback `-`. |
| `data[].doknama` | String | Kolom `Dokter`; fallback `-`. |
| `data[].pjtanggal` | String (Date/Datetime) | Tanggal transaksi; fallback string kosong. |
| `data[].total` | Number | Kolom `Total`; format uang/angka mengikuti render halaman. |

### Laporan — Penjualan Obat Klinik

#### Informasi Halaman

| Informasi | Keterangan |
|---|---|
| Nama Halaman | Penjualan Obat Klinik |
| Route | `/lap-penjualan-obat-klinik` |
| File Komponen | `app/(laporan)/lap-penjualan-obat-klinik/page.tsx` |
| Endpoint API | `ki-penjualanobatklinik/index` |
| HTTP Method | `POST` melalui proxy/gateway |
| Fungsi Halaman | Menampilkan penjualan obat dari klinik. |

#### Struktur Response API

```json
{ "data": [{ "pemtanggal": "2026-06-27", "pemnofaktur": "FK-001", "pasnama": "Pasien Contoh", "pasrm": "RM001", "pemjenis": "Tunai", "katnama": "Umum", "totalobat": "125000", "polnama": "Poli Umum", "doknama": "Dokter Contoh", "total": "125000" }] }
```

#### Data Mapping Response API ke Tampilan

| Atribut API Existing (JSON Field) | Tipe Data | Keterangan / Aturan Tampilan |
|---|---|---|
| `data[].pemtanggal` | String (Date/Datetime) | Tanggal transaksi; fallback `-`. |
| `data[].pemnofaktur` | String | Kolom `No Faktur`; fallback `-`. |
| `data[].pasnama` | String | Kolom `Pasien`; fallback `-`. |
| `data[].pasrm` | String | Nomor RM; fallback `-`. |
| `data[].pemjenis` | String | Jenis pembayaran; fallback `-`. |
| `data[].katnama` | String | Kategori; fallback `-`. |
| `data[].totalobat` | Number | Total obat; fallback `0`. |
| `data[].polnama` | String | Poli; fallback `-`. |
| `data[].doknama` | String | Kolom `Dokter`; fallback `-`. |
| `data[].total` | Number | Kolom `Total`; format uang/angka mengikuti render halaman. |

### Laporan — Pergantian Shift

#### Informasi Halaman

| Informasi | Keterangan |
|---|---|
| Nama Halaman | Pergantian Shift |
| Route | `/lap-pergantian-shift` |
| File Komponen | `app/(laporan)/lap-pergantian-shift/page.tsx` |
| Endpoint API | `aplaporangantishift/index` |
| HTTP Method | `POST` melalui proxy/gateway |
| Fungsi Halaman | Menampilkan histori buka/tutup shift kasir dan saldo kasir. |

#### Struktur Response API

```json
{ "data": [{ "bukaShift": "2026-06-27 08:00:00", "tutupShift": "2026-06-27 16:00:00", "username": "kasir", "saldoKasir": "1000000" }] }
```

#### Data Mapping Response API ke Tampilan

| Atribut API Existing (JSON Field) | Tipe Data | Keterangan / Aturan Tampilan |
|---|---|---|
| `data[].bukaShift` | String (Datetime) | Kolom `Buka Shift`; fallback perlu dikonfirmasi. |
| `data[].tutupShift` | String (Datetime) | Kolom `Tutup Shift`; fallback perlu dikonfirmasi. |
| `data[].username` | String | Kolom `Kasir`; fallback `-`. |
| `data[].saldoKasir` | Number | Kolom `Saldo Kasir`; format uang/angka mengikuti render halaman. |

### Laporan — Piutang Klinik

#### Informasi Halaman

| Informasi | Keterangan |
|---|---|
| Nama Halaman | Piutang Klinik |
| Route | `/lap-piutang-klinik` |
| File Komponen | `app/(laporan)/lap-piutang-klinik/page.tsx` |
| Endpoint API | `kln-piutang/index` |
| HTTP Method | `POST` melalui proxy/gateway |
| Fungsi Halaman | Menampilkan piutang klinik. |

#### Struktur Response API

```json
{ "data": [{ "pemnofaktur": "FK-001", "pasnama": "Pasien Contoh", "tanggaldeadline": "2026-07-01", "total": "300000" }] }
```

#### Data Mapping Response API ke Tampilan

| Atribut API Existing (JSON Field) | Tipe Data | Keterangan / Aturan Tampilan |
|---|---|---|
| `data[].pemnofaktur` | String | Kolom `No Faktur`; fallback `-`. |
| `data[].pasnama` | String | Kolom `Pasien`; fallback `-`. |
| `data[].tanggaldeadline` | String (Date) | Kolom `Jatuh Tempo`; fallback `-`. |
| `data[].total` | Number | Kolom `Total`; format uang/angka mengikuti render halaman. |

### Laporan — Piutang Obat

#### Informasi Halaman

| Informasi | Keterangan |
|---|---|
| Nama Halaman | Piutang Obat |
| Route | `/lap-piutang-obat` |
| File Komponen | `app/(laporan)/lap-piutang-obat/page.tsx` |
| Endpoint API | `appiutang-obat/index-v2` |
| HTTP Method | `POST` melalui proxy/gateway |
| Fungsi Halaman | Menampilkan piutang transaksi obat. |

#### Struktur Response API

```json
{ "data": [{ "pjnofaktur": "PJ-001", "pasnama": "Pasien Contoh", "deadline": "2026-07-01", "total": "250000" }] }
```

#### Data Mapping Response API ke Tampilan

| Atribut API Existing (JSON Field) | Tipe Data | Keterangan / Aturan Tampilan |
|---|---|---|
| `data[].pjnofaktur` | String | Kolom `No Faktur`; fallback `-`. |
| `data[].pasnama` | String | Kolom `Pasien`; fallback `-`. |
| `data[].deadline` | String (Date) | Kolom `Jatuh Tempo`; fallback `-`. |
| `data[].total` | Number | Kolom `Total`; format uang/angka mengikuti render halaman. |

### Laporan — Registrasi Pasien

#### Informasi Halaman

| Informasi | Keterangan |
|---|---|
| Nama Halaman | Registrasi Pasien |
| Route | `/lap-registrasi-pasien` |
| File Komponen | `app/(laporan)/lap-registrasi-pasien/page.tsx` |
| Endpoint API | `laporanmasterpasien/index` |
| HTTP Method | `POST` melalui proxy/gateway |
| Fungsi Halaman | Menampilkan daftar registrasi pasien. |

#### Struktur Response API

```json
{ "data": [{ "tgldaftar": "2026-06-27", "pasrm": "RM001", "pasnama": "Pasien Contoh", "pasalamat": "Alamat Contoh" }] }
```

#### Data Mapping Response API ke Tampilan

| Atribut API Existing (JSON Field) | Tipe Data | Keterangan / Aturan Tampilan |
|---|---|---|
| `data[].tgldaftar` | String (Date) | Kolom `Tanggal` melalui normalisasi `tanggalISO`; fallback perlu dikonfirmasi. |
| `data[].pasrm` | String | Kolom `No. RM`; fallback string kosong. |
| `data[].pasnama` | String | Kolom `Pasien`; fallback `-`. |
| `data[].pasalamat` | String | Kolom `Alamat`; fallback `-`. |

### Laporan — Stok Obat

#### Informasi Halaman

| Informasi | Keterangan |
|---|---|
| Nama Halaman | Stok Obat |
| Route | `/lap-stok-obat` |
| File Komponen | `app/(laporan)/lap-stok-obat/page.tsx` |
| Endpoint API | `ap-lapstok-batch/kartu3-v2` |
| HTTP Method | `POST` melalui proxy/gateway |
| Fungsi Halaman | Menampilkan stok obat per gudang. |

#### Struktur Response API

```json
{ "data": [{ "gudnama": "Gudang Utama", "obatkode": "OB001", "obatnama": "Obat A", "stok": "10" }] }
```

#### Data Mapping Response API ke Tampilan

| Atribut API Existing (JSON Field) | Tipe Data | Keterangan / Aturan Tampilan |
|---|---|---|
| `data[].gudnama` | String | Kolom `Gudang`; fallback `-`. |
| `data[].obatkode` | String | Kolom `Kode Obat`; fallback `-`. |
| `data[].obatnama` | String | Kolom `Nama Obat`; fallback `-`. |
| `data[].stok` | Number | Kolom `Stok`; fallback perlu dikonfirmasi. |

### Laporan — Stok Opname

#### Informasi Halaman

| Informasi | Keterangan |
|---|---|
| Nama Halaman | Stok Opname |
| Route | `/lap-stok-opname` |
| File Komponen | `app/(laporan)/lap-stok-opname/page.tsx` |
| Endpoint API | `aplaporanstokopname/index` |
| HTTP Method | `POST` melalui proxy/gateway |
| Fungsi Halaman | Menampilkan selisih hasil stok opname. |

#### Struktur Response API

```json
{ "data": [{ "obatnama": "Obat A", "gudnama": "Gudang Utama", "selisih": "-2", "nominalSelisih": "50000" }] }
```

#### Data Mapping Response API ke Tampilan

| Atribut API Existing (JSON Field) | Tipe Data | Keterangan / Aturan Tampilan |
|---|---|---|
| `data[].obatnama` | String | Kolom `Nama Obat`; fallback `-`. |
| `data[].gudnama` | String | Kolom `Gudang`; fallback `-`. |
| `data[].selisih` | Number | Kolom `Selisih`; fallback perlu dikonfirmasi. |
| `data[].nominalSelisih` | Number | Kolom `Nominal Selisih`; format uang/angka mengikuti render halaman. |

### Laporan — Tagihan Jaminan

#### Informasi Halaman

| Informasi | Keterangan |
|---|---|
| Nama Halaman | Tagihan Jaminan |
| Route | `/lap-tagihan-jaminan` |
| File Komponen | `app/(laporan)/lap-tagihan-jaminan/page.tsx` |
| Endpoint API | `laporan-tagihan-jaminan-pasien/index` |
| HTTP Method | `POST` melalui proxy/gateway |
| Fungsi Halaman | Menampilkan tagihan pasien dengan jaminan. |

#### Struktur Response API

```json
{ "data": [{ "tgl": "2026-06-27", "pemnofaktur": "FK-001", "pasrm": "RM001", "pasnama": "Pasien Contoh", "katnama": "Asuransi", "totalBiaya": "500000" }] }
```

#### Data Mapping Response API ke Tampilan

| Atribut API Existing (JSON Field) | Tipe Data | Keterangan / Aturan Tampilan |
|---|---|---|
| `data[].tgl` | String (Date) | Tanggal transaksi; fallback `-`. |
| `data[].pemnofaktur` | String | Kolom `No. Faktur`; fallback `-`. |
| `data[].pasrm` | String | Nomor RM; fallback `-`. |
| `data[].pasnama` | String | Kolom `Pasien`; fallback `-`. |
| `data[].katnama` | String | Kolom `Jaminan`; fallback `-`. |
| `data[].totalBiaya` | Number | Kolom `Total`; format uang/angka mengikuti render halaman. |

## 4. Request Data Mapping

### Request Umum Proxy API

| Elemen Input/Sumber | Atribut Request | Tipe Data | Wajib | Keterangan / Aturan |
|---|---|---|---|---|
| Profil pengguna | `a` | String | Ya | Diisi dari `user.app_id`; dapat dioverride saat memilih cabang. |
| Profil pengguna | `reg` | String | Ya | Diisi dari `user.app_reg`; dapat dioverride dari cabang terpilih. |
| Pagination laporan | `limit` | Integer | Ya pada laporan | Default `50`. |
| Pagination laporan | `offset` | Integer | Ya pada laporan | Dimulai dari `0`; bertambah sesuai jumlah data termuat. |

### Login

| Elemen Input | Atribut Request | Tipe Data | Wajib | Keterangan / Aturan |
|---|---|---|---|---|
| Domain | `t` | String | Ya | Input domain dibersihkan dari karakter selain huruf, angka, dan `-`, lalu lowercase. |
| Username | `u` | String | Ya | Wajib diisi. |
| Password | `p` | String | Ya | Wajib diisi; tidak didokumentasikan nilainya. |
| Perangkat | `device` | String | Ya | Bernilai statis `mobile`. |
| IP | `ip` | String | Tidak | Dikirim string kosong. |
| Tanggal | `date` | String (Datetime) | Ya | Format `YYYY-MM-DD HH:mm:ss`. |

### Registrasi Token Setelah Login

| Elemen Input/Sumber | Atribut Request | Tipe Data | Wajib | Keterangan / Aturan |
|---|---|---|---|---|
| Response login | `a` | String | Ya | Dari `data.app_id`. |
| Response login | `reg` | String | Ya | Dari `data.app_reg`. |
| Response login | `uid` | String / Integer | Ya | Dari `data.id`. |
| Token sesi | `token` | String | Ya | Dibuat aplikasi; nilai tidak ditampilkan dalam dokumentasi. |
| Masa berlaku | `expired` | Integer | Ya | Unix timestamp + 4 jam. |

### Dashboard

| Halaman | Endpoint | Atribut Request | Tipe Data | Wajib | Keterangan / Aturan |
|---|---|---|---|---|---|
| Dashboard Home | `mob-ap-dashboard/home-v2` | `periode` | String | Ya | Tab: `1` Hari Ini, `2` Bulan Ini, `3` Tahun Ini. |
| Dashboard Home | `mob-ap-dashboard/home-v2` | `tanggal` | String (Date) | Ya | Tanggal lokal format `YYYY-MM-DD`. |
| Dashboard Home | `mob-ap-dashboard/home-v2` | `app_jenis` | String | Ya | Dari `user.app_jenis`, fallback `3`. |
| Dashboard Home | `mob-ap-dashboard/home-v2` | `user_id` | String | Ya | Dari `user.gr_id` atau `user.user_id`. |
| Forecast | `sys-main-menu-forecast/index-v2` | `jenis`, `cari` | String | Ya | Bernilai `3`. |
| Forecast | `sys-main-menu-forecast/index-v2` | `bulan`, `bulan1` | String | Ya | Label bulan seperti `Jan 2026`; dihitung berdasarkan periode. |
| Forecast | `sys-main-menu-forecast/index-v2` | `proses` | String | Ya | Bernilai `true`. |
| Obat | `sys-main-menu-obat/index-v4` | `kl_id` | String | Tidak | Dari `user.kl_id`, fallback string kosong. |
| Obat | `sys-main-menu-obat/index-v4` | `periode`, `tanggal`, `refreshData` | String / Integer | Ya | Periode aktif, tanggal lokal, refresh `1`. |
| Obat | `sys-main-menu-obat/index-v4` | `akses[0]` s.d. `akses[5]` | Boolean | Ya | Bernilai `true`. |
| Keuangan | `sys-main-menu-keuangan/index-v6` | `akses[0]` s.d. `akses[8]` | String | Ya | Bernilai `true`. |
| Customer | `sys-main-menu-customer/index` | `combomob` | String | Ya | `1` tiga bulan, `2` enam bulan, `3` satu tahun. |
| Customer | `sys-main-menu-customer/index` | `bulan`, `bulan1`, `proses`, `date` | String | Ya | Periode dan tanggal lokal. |

### Laporan Umum

| Elemen Input | Atribut Request | Tipe Data | Wajib | Keterangan / Aturan |
|---|---|---|---|---|
| Tanggal Mulai | `tanggalawal` | String (Date) | Ya pada laporan bertanggal | Dikirim format `YYYY-MM-DD`. |
| Tanggal Selesai | `tanggalakhir` | String (Date) | Ya pada laporan bertanggal | Dikirim format `YYYY-MM-DD`. |
| Cabang | `a` | String | Ya | Dari dropdown cabang atau user aktif. |
| Cabang Reg | `reg` | String | Ya | Dari dropdown cabang atau user aktif. |
| Gudang | `gudid` | String | Tidak | Dikirim pada laporan obat yang memakai filter gudang; kosong berarti semua gudang. |
| Search lokal | `search` | String | Tidak | Digunakan komponen untuk filter UI; sebagian besar request API tidak mengirim search. |
| Jenis periode | `periodType` | String | Tidak | Nilai UI `tanggal`, `bulan`, atau `tahun`; dipakai membentuk tanggal awal/akhir. |

## 5. Response Data Mapping

| Endpoint | Atribut API Existing (JSON Field) | Tipe Data | Keterangan / Aturan Tampilan |
|---|---|---|---|
| Proxy/Gateway | `data` | Object / Array | Wrapper proxy mengembalikan `json.data` jika tersedia. |
| `sys/login-v2` | `status` | String / Integer | Jika `error`, login gagal; jika `data.status` bernilai `11`, akun dinonaktifkan. |
| `sys/login-v2` | `message` | String | Digunakan sebagai pesan error login apabila ada. |
| `mob-ap-dashboard/home-v2` | `data.penjualanUmum[]` | Array of Object | Sumber card Penjualan Kasir. |
| `mob-ap-dashboard/home-v2` | `data.penjualanVmart[]` | Array of Object | Sumber card Penjualan Online. |
| `mob-ap-dashboard/home-v2` | `data.pembayaranKasir[]` | Array of Object | Sumber card Pemeriksaan Klinik. |
| `mob-ap-dashboard/home-v2` | `data.pendapatanHC[]` | Array of Object | Sumber card Pendapatan HomeCare. |
| `mob-ap-dashboard/home-v2` | `data.totalPendapatan[]` | Array of Object | Sumber card Total Pendapatan. |
| `sys-main-menu-obat/index-v4` | `data.dataNilaiObat` | Object | Sumber ringkasan nilai obat. |
| `sys-main-menu-obat/index-v4` | `data.dataObatExpired` | Object | Sumber ringkasan obat expired. |
| `sys-main-menu-obat/index-v4` | `data.dataObatStokHabis` | Object | Sumber ringkasan stok habis. |
| `sys-main-menu-obat/index-v4` | `data.dataObatStokHilang` | Object | Sumber ringkasan/grafik stok hilang. |
| `sys-main-menu-obat/index-v4` | `data.dataPengadaanObatTerbanyak` | Object | Sumber ranking pengadaan dan grafik pembelian. |
| `sys-main-menu-obat/index-v4` | `data.dataObatTerlaris[]` | Array of Object | Sumber obat terlaris. |
| `sys-main-menu-forecast/index-v2` | `data.paretoA`, `data.paretoB`, `data.paretoC`, `data.paretoMin` | Integer | Sumber grafik Pareto. |
| `sys-main-menu-forecast/index-v2` | `data.status1`, `data.status2`, `data.status3`, `data.status4` | Integer | Sumber grafik status pengadaan. |
| `sys-main-menu-customer/index` | `databulanan[]` | Array of Object | Sumber grafik customer. |
| `sys-main-menu-customer/index` | `datapasienbaru` | Object | Sumber pasien baru. |
| `sys-main-menu-customer/index` | `datakunjungan` | Object | Sumber kunjungan pasien. |
| Laporan tabel | `data[]` | Array of Object | Umumnya dinormalisasi menjadi baris tabel dengan tambahan nomor urut. |

Pagination response khusus seperti `meta.current_page`, `meta.last_page`, `meta.per_page`, dan `meta.total` belum ditemukan. Pagination di aplikasi menggunakan request `limit` dan `offset`, lalu menentukan `hasMore` dari jumlah data yang diterima.

## 6. Mapping Kolom Tabel

| Halaman | Header Tabel | Atribut API Existing | Tipe Data | Keterangan / Aturan Tampilan |
|---|---|---|---|---|
| Hutang Obat | No | Tidak berasal langsung dari API | Integer | Dihitung dari index dan offset. |
| Hutang Obat | Tgl | `data[].tgl` | String (Date) | Fallback `-`. |
| Hutang Obat | No Faktur | `data[].pemofaktur` | String | Fallback `-`. |
| Hutang Obat | Supplier | `data[].supnama` | String | Fallback `-`. |
| Hutang Obat | Total Bayar | `data[].total` | Number | Ditampilkan sebagai total. |
| Janji Dengan Dokter | Tanggal | `data[].jantanggal` | String (Date) | Fallback `-`. |
| Janji Dengan Dokter | Pasien | `data[].pasnama` | String | Fallback `-`. |
| Janji Dengan Dokter | Dokter | `data[].doknama` | String | Fallback `-`. |
| Janji Dengan Dokter | Keterangan | `data[].janketerangan` | String | Fallback `-`. |
| Kunjungan Pasien | Tanggal | `data[].kuntgl` | String (Date) | Fallback `-`. |
| Kunjungan Pasien | Nama | `data[].pasnama` | String | Fallback `-`. |
| Kunjungan Pasien | Poli | `data[].polnama` | String | Fallback `-`. |
| Kunjungan Pasien | Dokter | `data[].doknama` | String | Fallback `-`. |
| Obat Expired | Gudang | `data[].gudnama` | String | Fallback `-`. |
| Obat Expired | Nama Obat | `data[].obatnama` | String | Field ditemukan dari konteks halaman obat; fallback detail perlu dikonfirmasi. |
| Obat Expired | Sisa Stok | `data[].sisa` | Number | Field perlu dikonfirmasi dari source detail. |
| Obat Expired | Tgl Expired | `data[].tglexpired` | String (Date) | Field perlu dikonfirmasi dari source detail. |
| Obat Stok Habis | Gudang | `data[].gudnama` | String | Fallback `-`. |
| Obat Stok Habis | Nama Obat | `data[].obatnama` | String | Fallback `-`. |
| Obat Stok Habis | Stok Minimal | `data[].stokminimal` | Number | Field perlu dikonfirmasi dari source detail. |
| Obat Stok Habis | Stok Nyata | `data[].stok` | Number | Field perlu dikonfirmasi dari source detail. |
| Obat Terlaris | Nama Obat | `data[].obatnama` | String | Fallback `-`. |
| Obat Terlaris | Jml Terjual | `data[].jumlahTerjualRaw` | Number | Digunakan pada total/ranking; detail normalisasi perlu dikonfirmasi. |
| Obat Terlaris | Jml Transaksi | `data[].jumlahTransaksi` | Integer | Digunakan pada kolom. |
| Obat Terlaris | Nominal | `data[].nominal` | Number | Ditampilkan sebagai nilai uang. |
| Pembayaran Kasir | Tgl | `data[].pemtanggal` | String (Date/Datetime) | Dinormalisasi sebagai `tanggalISO`. |
| Pembayaran Kasir | No Faktur | `data[].pemnofaktur` | String | Fallback `-`. |
| Pembayaran Kasir | Pasien | `data[].pasnama` | String | Fallback `-`. |
| Pembayaran Kasir | Dokter | `data[].doknama` | String | Fallback `-`. |
| Pembayaran Kasir | Total | `data[].total` | Number | Ditampilkan sebagai total. |
| Pembelian Obat | Tgl | `data[].tgl` | String (Date) | Fallback `-`. |
| Pembelian Obat | No Faktur | `data[].pemofaktur` | String | Fallback `-`. |
| Pembelian Obat | Supplier | `data[].supnama` | String | Fallback `-`. |
| Pembelian Obat | Total | `data[].total` | Number | Ditampilkan sebagai total. |
| Pendapatan Petugas Medis | Dokter | `data[].doknama` | String | Fallback `-`. |
| Pendapatan Petugas Medis | No. Faktur | `data[].pemnofaktur` | String | Fallback `-`. |
| Pendapatan Petugas Medis | Pemeriksaan | `data[].bianama` | String | Fallback `-`. |
| Pendapatan Petugas Medis | Fee Dokter | `data[].feedokter` | Number | Ditampilkan sebagai fee. |
| Penjualan Obat | No Faktur | `data[].pjnofaktur` | String | Fallback string kosong. |
| Penjualan Obat | Pasien | `data[].pasnama` | String | Fallback `-`. |
| Penjualan Obat | Dokter | `data[].doknama` | String | Fallback `-`. |
| Penjualan Obat | Total | `data[].total` | Number | Ditampilkan sebagai total. |
| Penjualan Obat Klinik | No Faktur | `data[].pemnofaktur` | String | Fallback `-`. |
| Penjualan Obat Klinik | Pasien | `data[].pasnama` | String | Fallback `-`. |
| Penjualan Obat Klinik | Dokter | `data[].doknama` | String | Fallback `-`. |
| Penjualan Obat Klinik | Total | `data[].total` | Number | Ditampilkan sebagai total. |
| Pergantian Shift | Buka Shift | `data[].bukaShift` | String (Datetime) | Detail fallback perlu dikonfirmasi. |
| Pergantian Shift | Tutup Shift | `data[].tutupShift` | String (Datetime) | Detail fallback perlu dikonfirmasi. |
| Pergantian Shift | Kasir | `data[].username` | String | Fallback `-`. |
| Pergantian Shift | Saldo Kasir | `data[].saldoKasir` | Number | Ditampilkan sebagai saldo. |
| Piutang Klinik | No Faktur | `data[].pemnofaktur` | String | Fallback `-`. |
| Piutang Klinik | Pasien | `data[].pasnama` | String | Fallback `-`. |
| Piutang Klinik | Jatuh Tempo | `data[].tanggaldeadline` | String (Date) | Fallback `-`. |
| Piutang Klinik | Total | `data[].total` | Number | Ditampilkan sebagai total. |
| Piutang Obat | No Faktur | `data[].pjnofaktur` | String | Fallback `-`. |
| Piutang Obat | Pasien | `data[].pasnama` | String | Fallback `-`. |
| Piutang Obat | Jatuh Tempo | `data[].deadline` | String (Date) | Fallback `-`. |
| Piutang Obat | Total | `data[].total` | Number | Ditampilkan sebagai total. |
| Registrasi Pasien | Tanggal | `data[].tgldaftar` | String (Date) | Dinormalisasi sebagai `tanggalISO`; detail fallback perlu dikonfirmasi. |
| Registrasi Pasien | No. RM | `data[].pasrm` | String | Fallback string kosong. |
| Registrasi Pasien | Pasien | `data[].pasnama` | String | Fallback `-`. |
| Registrasi Pasien | Alamat | `data[].pasalamat` | String | Fallback `-`. |
| Stok Obat | Gudang | `data[].gudnama` | String | Fallback `-`. |
| Stok Obat | Kode Obat | `data[].obatkode` | String | Fallback `-`. |
| Stok Obat | Nama Obat | `data[].obatnama` | String | Fallback `-`. |
| Stok Obat | Stok | `data[].stok` | Number | Ditampilkan sebagai stok. |
| Stok Opname | Gudang | `data[].gudnama` | String | Fallback `-`. |
| Stok Opname | Nama Obat | `data[].obatnama` | String | Fallback `-`. |
| Stok Opname | Selisih | `data[].selisih` | Number | Ditampilkan sebagai selisih. |
| Stok Opname | Nominal Selisih | `data[].nominalSelisih` | Number | Ditampilkan sebagai nominal. |
| Tagihan Jaminan | No. Faktur | `data[].pemnofaktur` | String | Fallback `-`. |
| Tagihan Jaminan | Pasien | `data[].pasnama` | String | Fallback `-`. |
| Tagihan Jaminan | Jaminan | `data[].katnama` | String | Fallback `-`. |
| Tagihan Jaminan | Total | `data[].totalBiaya` | Number | Ditampilkan sebagai total. |

Aturan tabel umum: sorting dilakukan client-side berdasarkan kolom terpilih; pencarian menggunakan `searchFields`; load more memakai `limit` dan `offset`; export tersedia sebagai PDF/Excel pada komponen header/tabel; empty state dan loading state dikelola komponen `ReportTable`/skeleton.

## 7. Mapping Form Input

| Halaman | Label Input | Atribut Request / State | Tipe Input | Tipe Data | Validasi / Aturan |
|---|---|---|---|---|---|
| Login | Domain | `t` / `domain` | Text | String | Wajib; hanya huruf, angka, dan `-`; diubah lowercase; UI menampilkan suffix `.vmedis.com`. |
| Login | Username | `u` / `username` | Text | String | Wajib; `autoComplete="username"`. |
| Login | Password | `p` / `password` | Password | String | Wajib; dapat ditampilkan/disembunyikan; nilai tidak didokumentasikan. |
| Ganti Password | Password Lama | `passwordLama` | Password | String | Wajib; state lokal, endpoint belum ditemukan. |
| Ganti Password | Password Baru | `passwordBaru` | Password | String | Wajib; minimal 6 karakter. |
| Ganti Password | Konfirmasi Password Baru | `konfirmasi` | Password | String | Wajib; harus sama dengan password baru. |
| ReportTable | Tanggal Mulai | `tanggalawal` | Date | String (Date) | Format request `YYYY-MM-DD`. |
| ReportTable | Tanggal Selesai | `tanggalakhir` | Date | String (Date) | Format request `YYYY-MM-DD`. |
| ReportTable | Bulan | Dibentuk ke `tanggalawal`/`tanggalakhir` | Month | String | Awal bulan `YYYY-MM-01`, akhir bulan dihitung otomatis. |
| ReportTable | Tahun | Dibentuk ke `tanggalawal`/`tanggalakhir` | Year | String | Awal tahun `YYYY-01-01`, akhir tahun `YYYY-12-31`. |
| ReportTable | Cari | `search` | Text | String | Digunakan untuk filter tabel lokal berdasarkan `searchFields`. |
| ReportTable | Cabang | `a`, `reg` | Select | String | Nilai dari dropdown cabang. |
| ReportTable | Gudang | `gudid` | Select | String | Kosong berarti semua gudang. |

## 8. Mapping Dropdown

| Nama Dropdown | Field Label | Field Value | Sumber Data | Keterangan / Aturan |
|---|---|---|---|---|
| Pilih Cabang | `data[].nama` | `data[].appidcabang` | Endpoint `ap-list-cabang/index` | `reg` disimpan dari `data[].reg`; fallback ke cabang user aktif jika API kosong/gagal. |
| Pilih Gudang | `data[].gudnama` | `data[].gudid` | Endpoint `apgudang/index` | Opsi pertama `{ value: "", label: "Semua Gudang" }`; fallback tetap menampilkan Semua Gudang. |
| Tab Dashboard Home | Label statis | `1`, `2`, `3` | Konstanta halaman | `1` Hari Ini, `2` Bulan Ini, `3` Tahun Ini. |
| Periode Forecast/Customer | Label statis | `threeMonth`, `sixMonth`, `oneYear` | Konfigurasi halaman | Menghasilkan parameter `bulan`, `bulan1`, dan `combomob` pada customer. |
| Interval ReportTable | `intervalOptions[].label` | `intervalOptions[].value` | Props halaman | Default nilai pertama atau `all`. |

## 9. Mapping Dashboard dan Card

| Halaman | Nama Card | Atribut API Existing | Tipe Data | Keterangan / Aturan Tampilan |
|---|---|---|---|---|
| Dashboard Home | Penjualan Kasir | `data.penjualanUmum[].grandtotal` | Number | Format Rupiah `id-ID` dengan 2 desimal; fallback `Rp 0`. |
| Dashboard Home | Penjualan Kasir - Faktur | `data.penjualanUmum[].jumfaktur` | Integer | Ditampilkan `{n} faktur`; fallback `0 faktur`. |
| Dashboard Home | Penjualan Online | `data.penjualanVmart[].grandtotal` | Number | Format Rupiah; fallback `Rp 0`. |
| Dashboard Home | Pemeriksaan Klinik | `data.pembayaranKasir[].grandtotal` | Number | Format Rupiah; fallback `Rp 0`. |
| Dashboard Home | Pendapatan HomeCare | `data.pendapatanHC[].grandtotal` | Number | Format Rupiah; fallback `Rp 0`. |
| Dashboard Home | Total Pendapatan | `data.totalPendapatan[].grandtotal` | Number | Format Rupiah; fallback `Rp 0`. |
| Obat | Nilai Obat | `data.dataNilaiObat.nilai` | Number | Format Rupiah bila sebagai nominal; fallback `0`. |
| Obat | Obat Expired | `data.dataObatExpired.count` | Integer | Jumlah item; fallback `0`. |
| Obat | Obat Stok Habis | `data.dataObatStokHabis.count` | Integer | Jumlah item; fallback `0`. |
| Forecast | Pareto A/B/C/Min | `data.paretoA`, `data.paretoB`, `data.paretoC`, `data.paretoMin` | Integer | Ditampilkan sebagai kategori Pareto; fallback `0`. |
| Customer | Pasien Baru | `datapasienbaru.count` | Integer | Jumlah pasien baru; fallback `0`. |
| Customer | Kunjungan Pasien | `datakunjungan.count` | Integer | Jumlah kunjungan; fallback `0`. |

Aturan `StatCard`: perubahan `change` positif berwarna hijau dan simbol `↑`; negatif merah dan simbol `↓`; nol menggunakan warna primary dan ikon sync; card dapat diklik jika `getStatsRoute(label)` mengembalikan route.

## 10. Mapping Grafik

| Halaman | Elemen Grafik | Atribut API Existing | Tipe Data | Keterangan / Aturan Tampilan |
|---|---|---|---|---|
| Dashboard Home | Label Sumbu X | Label hasil generator tanggal/bulan/tahun | String | Hari ini memakai tanggal pendek, bulan memakai nama bulan, tahun memakai tahun. |
| Dashboard Home | Total Pendapatan | `data.totalPendapatan[].grandtotal` | Number | Series `totalPendapatan`; tooltip format Rupiah. |
| Dashboard Home | Penjualan Kasir | `data.penjualanUmum[].grandtotal` | Number | Series `penjualanKasir`. |
| Dashboard Home | Penjualan Online | `data.penjualanVmart[].grandtotal` | Number | Series `penjualanOnline`. |
| Dashboard Home | Pemeriksaan Klinik | `data.pembayaranKasir[].grandtotal` | Number | Series `pemeriksaanKlinik`. |
| Dashboard Home | Pendapatan HomeCare | `data.pendapatanHC[].grandtotal` | Number | Series `pendapatanHomecare`. |
| Obat | Obat Hilang | `data.dataObatStokHilang.statistik[].total` | Number | Series `obatHilang`; fallback `0`. |
| Obat | Pembelian Obat | `data.dataPengadaanObatTerbanyak.statistik[].total` | Number | Series `pembelianObat`; fallback `0`. |
| Forecast | Pareto Analysis | `data.paretoA`, `data.paretoB`, `data.paretoC`, `data.paretoMin` | Integer | Label `Pareto A`, `Pareto B`, `Pareto C`, `Dibawah Pareto C`. |
| Forecast | Status Pengadaan | `data.status1`, `data.status2`, `data.status3`, `data.status4` | Integer | Label `Stock On Hand`, `Over Stock`, `Under Stock`, `Potential Lost`. |
| Customer | Loyal Customer | `databulanan[].paretoA` | Integer | Series `loyalCustomer`. |
| Customer | Potensial Customer | `databulanan[].paretoB` | Integer | Series `potensialCustomer`. |
| Customer | Prospek Customer | `databulanan[].paretoC` | Integer | Series `prospekCustomer`. |
| Customer | Belum Prospek | `databulanan[].paretoD` | Integer | Series `belumProspek`. |
| Customer | Total Customer | `databulanan[].totalcustomer` | Integer | Series `totalCustomer`. |
| Customer | Pasien Baru | `datapasienbaru.statistik[].total` | Integer | Series `pasienBaru`. |
| Customer | Kunjungan Pasien | `datakunjungan.statistik[].total` | Integer | Series `kunjunganPasien`. |
| Keuangan | Total Aset | `data.dataAset[].y` | Number | Series `totalAset`. |
| Keuangan | Total Cash | `data.dataCash[].y` | Number | Series `totalCash`. |
| Keuangan | Total Pasiva | `data.dataPasiva[].y` | Number | Series `totalPasiva`. |
| Keuangan | Laba Rugi | `data.dataLabarugi[].y` | Number | Series `labaRugi`. |

Aturan grafik `ChartCarousel`: nilai kosong diperlakukan `0`; format default tooltip `Rp {angka id-ID}`; jika `valueFormatter` tersedia maka formatter tersebut dipakai; navigasi grafik menggunakan tombol sebelumnya/berikutnya dan swipe.

## 11. Mapping Tombol dan Aksi

| Tombol / Aksi | Field yang Digunakan | Kondisi | Hasil |
|---|---|---|---|
| Masuk | `domain`, `username`, `password` | Aktif; menampilkan loading saat request | Memanggil login dan redirect ke `/dashboard` bila berhasil. |
| Tampilkan/Sembunyikan Password | State lokal `showPassword` | Selalu tersedia pada input password | Mengubah tipe input password/text. |
| Sesi Tersimpan | `UserProfile.username`, `UserProfile.domain`, `UserProfile.avatar` | Ditampilkan jika `sessions.length > 0` | Switch atau hapus sesi tersimpan. |
| Kembali Profil/Laporan | Tidak memakai field API | Selalu tersedia | Navigasi ke halaman sebelumnya atau dashboard. |
| Simpan Password Baru | `passwordLama`, `passwordBaru`, `konfirmasi` | Validasi lokal terpenuhi | Menampilkan state sukses; endpoint belum ditemukan. |
| Refresh Dashboard/Laporan | Filter aktif dan user | Aktif bila callback tersedia | Memanggil ulang endpoint dengan parameter terakhir. |
| Filter Laporan | `tanggalawal`, `tanggalakhir`, `a`, `reg`, `gudid` | Aktif setelah cabang tersedia | Mengambil ulang data dari offset `0`. |
| Reset Filter | Default tanggal hari ini, cabang user | Selalu tersedia pada ReportTable | Mengosongkan data lama dan fetch ulang default. |
| Load More | `limit`, `offset` | Aktif jika `hasMore` dan tidak loading | Mengambil halaman berikutnya dan append data. |
| Sorting Kolom | `Column.key` | Header kolom diklik | Sorting client-side ascending/descending. |
| Export PDF | Data tabel dan kolom aktif | Ditampilkan jika handler tersedia | Membuat file PDF. |
| Export Excel | Data tabel dan kolom aktif | Ditampilkan jika handler tersedia | Membuat file Excel. |
| Klik StatCard | Label card | Aktif jika `getStatsRoute(label)` tersedia dan `disableRedirect` false | Navigasi ke route laporan terkait. |

## 12. Kondisi dan Fallback Data

| Kondisi Data | Keterangan / Aturan Tampilan |
|---|---|
| Field bernilai `null`, `undefined`, atau string kosong pada angka | `safeParseNumber`/`safeParseInt` mengubah ke `0`. |
| Field array tidak valid | `normalizeArray` mengubah ke array kosong `[]`. |
| Field object tidak valid | `normalizeObject` mengubah ke object kosong `{}`. |
| Nama/text laporan kosong | Banyak halaman memakai fallback `-`. |
| ID tertentu kosong | Beberapa halaman memakai fallback string kosong atau index. |
| Avatar login memiliki `kl_logo` | Ditampilkan sebagai URL `https://apt.vmedis.com/foto/{kl_logo}`. |
| Avatar login tanpa `kl_logo` | Ditampilkan sebagai dua huruf awal dari nama/username. |
| Role tidak dikenal | Ditampilkan sebagai `Role {id}`. |
| Status login `11` | Login ditolak dengan pesan akun dinonaktifkan. |
| API gagal | Error disimpan sebagai pesan error dan ditampilkan oleh halaman/komponen terkait. |
| Request berjalan | Komponen menampilkan loading/skeleton atau teks `Proses Masuk...`. |
| Tidak ada cabang dari API | Dropdown cabang fallback ke cabang user aktif atau `Cabang Saat Ini`. |
| Tidak ada gudang dari API | Dropdown gudang fallback ke `Semua Gudang`. |
| Perubahan nilai card positif | Warna hijau dan simbol `↑`. |
| Perubahan nilai card negatif | Warna merah dan simbol `↓`. |
| Perubahan nilai card nol | Warna primary dan ikon sync. |
| Tanggal filter bulan | Awal/akhir bulan dihitung otomatis. |
| Tanggal filter tahun | `YYYY-01-01` sampai `YYYY-12-31`. |
| Data laporan kurang dari `pageSize` | `hasMore` menjadi false. |
| Data grafik kosong | Nilai chart fallback `0`; beberapa generator mengembalikan `[]`. |

## 13. Field API yang Tidak Digunakan

| Atribut API Existing | Tipe Data | Status | Keterangan |
|---|---|---|---|
| `data.pesananOnline[].jumfaktur` | Integer | Tidak digunakan langsung | Dinormalisasi pada dashboard, tetapi card/grafik utama memakai `penjualanVmart` untuk Penjualan Online. |
| `data.pesananOnline[].grandtotal` | Number | Tidak digunakan langsung | Tersedia pada normalizer dashboard; tidak terlihat dipakai UI dashboard utama. |
| `data.penjualanUmum[].item` | String | Tidak digunakan langsung | Dinormalisasi, tetapi label grafik digenerate oleh aplikasi. |
| `data.penjualanUmum[].sumberGrandtotal` | Array | Tidak digunakan langsung | Dinormalisasi, tetapi tampilan langsung belum ditemukan. |
| `data.dataObatTerlaris[].obatid` | String | Tidak digunakan langsung | Dinormalisasi sebagai identitas obat; tampilan utama memakai nama, satuan, jumlah. |
| `databulanan[].paretoMin` | Integer | Tidak digunakan langsung | Dinormalisasi customer; series chart memakai paretoA-D dan totalcustomer. |
| `data.katlaris` | Object | Belum digunakan jelas | Dinormalisasi forecast; tampilan detail belum ditemukan dari analisis ringkas. |
| `data.countData` | Integer | Belum digunakan jelas | Dinormalisasi forecast; penggunaan UI langsung belum ditemukan. |
| `data.interval` | Integer | Belum digunakan jelas | Dinormalisasi forecast; penggunaan UI langsung belum ditemukan. |
| `data.jmldata` | Integer | Belum digunakan jelas | Dinormalisasi forecast; penggunaan UI langsung belum ditemukan. |
| `data.dokid` | String | Belum digunakan jelas | Disimpan pada profil login, tetapi penggunaan UI langsung belum ditemukan. |

## 14. Field UI yang Belum Memiliki Mapping

| Elemen UI | Field API | Status | Keterangan |
|---|---|---|---|
| Ganti Password | Belum ditemukan / perlu dikonfirmasi. | Perlu dikonfirmasi | Tidak ditemukan endpoint submit password baru. |
| Dashboard Dokter detail | Belum ditemukan / perlu dikonfirmasi. | Perlu dikonfirmasi | Endpoint ditemukan, field UI detail belum teridentifikasi lengkap. |
| Laba Rugi detail | Belum ditemukan / perlu dikonfirmasi. | Perlu dikonfirmasi | Endpoint ditemukan, field response detail belum teridentifikasi lengkap. |
| Pengaturan Bank detail | Belum ditemukan / perlu dikonfirmasi. | Perlu dikonfirmasi | Endpoint ditemukan, field tabel/detail belum teridentifikasi lengkap. |
| Format final beberapa nilai total laporan | Belum ditemukan / perlu dikonfirmasi. | Perlu dikonfirmasi | Beberapa kolom total memakai render halaman yang perlu inspeksi detail lanjutan. |
| Field tanggal tertentu pada laporan | Belum ditemukan / perlu dikonfirmasi. | Perlu dikonfirmasi | Beberapa halaman memakai field normalisasi `tanggalISO`, tetapi nama field API asal tidak selalu terlihat pada ekstraksi ringkas. |

## 15. Ringkasan Data Mapping

| Informasi | Jumlah |
|---|---:|
| Jumlah modul | 6 |
| Jumlah halaman | 31 |
| Jumlah endpoint | 30 |
| Jumlah request field | 39 |
| Jumlah response field | 158 |
| Jumlah field yang digunakan UI | 139 |
| Jumlah field yang tidak digunakan | 10 |
| Jumlah field yang perlu dikonfirmasi | 9 |

Halaman yang telah berhasil dipetakan:

1. Login
2. Profil Pengguna
3. Ganti Password
4. Dashboard Home
5. Obat
6. Keuangan
7. Forecast
8. Customer
9. Dashboard Dokter
10. Hutang Obat
11. Janji Dengan Dokter
12. Kunjungan Pasien
13. Laba Rugi
14. Manajemen User
15. Neraca Umum
16. Obat Expired
17. Obat Stok Habis
18. Obat Terlaris
19. Pembayaran Kasir
20. Pembelian Obat
21. Pendapatan Petugas Medis
22. Pengaturan Bank
23. Penjualan Obat
24. Penjualan Obat Klinik
25. Pergantian Shift
26. Piutang Klinik
27. Piutang Obat
28. Registrasi Pasien
29. Stok Obat
30. Stok Opname
31. Tagihan Jaminan

Bagian yang perlu dikonfirmasi:

1. Endpoint dan payload submit halaman Ganti Password.
2. Struktur response detail untuk Dashboard Dokter.
3. Struktur response detail untuk Laba Rugi.
4. Struktur response detail untuk Pengaturan Bank.
5. Nama field API asal untuk beberapa kolom tanggal yang sudah dinormalisasi sebagai `tanggalISO`.
6. Detail formatter khusus pada beberapa kolom total laporan yang tidak terlihat dari ekstraksi ringkas.
