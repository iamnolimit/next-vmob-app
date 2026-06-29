# UI & Design Guidelines

Dokumen ini berisi panduan antarmuka (UI), prinsip desain, dan praktik komponen untuk proyek Next.js / Capacitor Mobile ini. Ini akan membantu Anda tetap konsisten saat membangun komponen dan halaman baru.

## 1. Arsitektur Frontend

- **Framework Utama**: Next.js 16 (App Router) + React 19.
- **Paradigma**: Mobile-first Hybrid App (Web view diconvert menjadi Android Native App via **Capacitor**).
- **Styling**: Tailwind CSS v4.
- **Pustaka UI**: **Konsta UI** (berjalan pada lingkungan React). Secara konsisten menggunakan konfigurasi **`theme="ios"`** (bahkan pada perangkat Android) agar mendapat feel native-like yang konsisten dan smooth.
- **Render Mode**: Karena mayoritas interaksi bersifat _client-side_, utamanya komponen interaktif Konsta dan state, komponen diletakkan dalam direktori `components/` menggunakan indikator `'use client'`.

## 2. Palet Warna (Colors) & Permukaan (Surface)

Aplikasi ini memiliki nuansa biru modern dengan kontras tinggi di bagian header dan card yang bersih.

### Primary Variables & Gradients

- **Primary Header Gradient**: Kombinasi warna linear yang kuat sebagai identitas visual atas (Top Bar).
  - CSS: `linear-gradient(135deg, #1e3a8a 0%, #2563eb 100%)`
- **Primary Chart/Bar Gradient**:
  - CSS: `linear-gradient(180deg, #3b82f6 0%, #1d4ed8 100%)`
- **Background Utama (Base)**: `bg-gray-50`. Memberi batas visual dengan kartu-kartu putih.

### Permukaan Cards (Surface)

- Warna Latar: `bg-white`.
- Kelengkungan (Border Radius): Lebar, spesifik pada `rounded-2xl` (16px).
- Gap/Spacing umum: Padding sebesar `p-4`, margin bawah `mb-3` atau `mb-4`, margin sisi `mx-4`.

### Teks & Status

- **Label Sub-Judul (Kecil)**: `text-xs text-gray-400 font-semibold uppercase tracking-widest` (digunakan pada Stats Card).
- **Nilai Penting / Angka Besar**: `text-xl font-bold text-gray-900`.
- **Feedback Positif (Kenaikan)**: Warna Teks `#16a34a` (hijau), Background Badge `#dcfce7`.
- **Feedback Negatif (Penurunan)**: Warna Teks `#dc2626` (merah), Background Badge `#fee2e2`.
- **Accent Icons**: Icon pada card sering mendapat backround warna solid dengan _opacity 15%_ (misalnya: `#1d4ed815`) agar terasa _soft_.

## 3. Komponen Utama (Standard Components)

### AppShell & LiquidPullToRefresh

- Merupakan pembungkus utama tata letak navigasi _BottomNav_ dan _Sidebar_.
- Menangani area aman perangkat mobile (contoh: _safe-area-inset-bottom_).
- **Aturan**: Komponen halaman tak lazim untuk memakai layout mandiri kecuali mematikan `showBottomNav`.
- Gunakan `<LiquidPullToRefresh>` untuk membungkus konten halaman yang membutuhkan fitur _pull-to-refresh_ dengan animasi liquid yang halus.

### PageHeader & TabSelector

- Selalu panggil header bawaan ini untuk memberi konteks halaman.
- Mendukung properti: `title`, `subtitle` (responsif menampilkan nama pengguna).
- Ciri khas: memiliki elemen dekorasi lingkaran transparan (`bg-white/5 absolute`) pada sudut kanan atas.
- **Subnavbar**: Tempatkan `<TabSelector>` di sini jika Anda butuh submenu (misalnya untuk filter Hari Ini, Bulan Ini, Tahun Ini). Komponen ini membungkus Segmented Control milik Konsta UI.

### StatCard & RankedList

- Gunakan `<StatCard>` untuk meringkas Key Performance Indicator (KPI) dengan persentase perubahan.
- Format _Card_ tidak perlu bayangan berat, sering menggunakan `overflow-hidden` dan letak icon _fluid_ di sebelah kanan.

### Chart Native (Kustom)

- Ketimbang memuat _library_ berat seperti Recharts/Chart.js yang beresiko menurunkan performa rendering mobile, gunakan komponen _in-house_ seperti `<ChartBar>` dan `<ChartCarousel>`.
- Tinggi grafik disimulasikan proporsional _matematis_ (`max height = 96px`, dirender via style prop `height`).
- Angka dipersingkat dalam format 'K' (Ribu) dan 'M' (Juta) dengan Font Size sangat mini (`text-[9px]`).

### ReportTable & LaporanHeader

- Gunakan `<ReportTable>` untuk menampilkan data tabular dengan fitur sorting, pencarian, pagination, dan export (PDF/Excel).
- Gunakan `<LaporanHeader>` sebagai header standar untuk halaman-halaman laporan.

### Input & Form Components

- Gunakan `<DatePickerInput>`, `<MonthPickerInput>`, dan `<YearPickerInput>` untuk input tanggal, bulan, dan tahun. Komponen ini sudah disesuaikan dengan tema Konsta UI dan menggunakan `<ScrollPicker>` kustom di balik layar untuk memberikan pengalaman memilih tanggal seperti native iOS/Android. (Catatan: `react-datepicker` masih ada di package.json dan globals.css untuk kompatibilitas mundur, namun komponen baru menggunakan `ScrollPicker`).
- Gunakan `<SelectInput>` untuk dropdown pilihan (seperti pilihan cabang atau gudang).

### SkeletonLoader & NavProgressBar

- Gunakan `<DashboardSkeleton>` atau `<ListSkeleton>` dari `SkeletonLoader` untuk menampilkan state loading yang elegan sebelum data selesai dimuat.
- `<NavProgressBar>` digunakan secara global di dalam `AppShell` untuk memberikan indikator visual saat terjadi navigasi antar halaman.

### AlertModal

- Gunakan `<AlertModal>` untuk menampilkan pesan error atau peringatan kepada pengguna. Komponen ini membungkus `Dialog` dari Konsta UI.

### AvatarImage

- Gunakan `<AvatarImage>` untuk menampilkan foto profil pengguna. Komponen ini memiliki fallback otomatis untuk menampilkan inisial nama jika gambar gagal dimuat atau tidak tersedia.

### MaintenancePage

- Gunakan `<MaintenancePage>` untuk menampilkan halaman placeholder pada fitur atau laporan yang sedang dalam tahap pengembangan atau disembunyikan sementara (berdasarkan environment variable `NEXT_PUBLIC_ACTIVE_HIDDEN_MENU`).

### ServiceWorkerRegister

- Komponen `<ServiceWorkerRegister>` dipanggil di root layout untuk mendaftarkan service worker PWA, memungkinkan aplikasi berjalan secara offline atau diinstal ke home screen.

## 4. Animasi & Interaksi Micro (Micro-Interactions)

Sensasi hidupnya aplikasi (terutama untuk laporan performa pasien/klinik) difasilitasi oleh animasi CSS murni (telah dikonfigurasi di `app/globals.css`). Tidak perlu _import_ pustaka _motion_, cukup panggil kelas:

- `.animate-fadeIn`: Transisi fade in ringan (`0.18s`).
- `.growth-card`, `.ranked-card`: Interaksi elastis Y-axis _cubic-bezier_ saat mounting daftar data array.
- `.growth-row`, `.ranked-item`: List item menyusul masuk (Slide in per row).
- `.badgePop`: Animasi notifikasi badge menyembul elastis (sedikit terpelanting/rotating).
- `.growth-bar`: Memanjangkan bar CSS width secara bertahap saat chart memuat state awal.

## 5. Tipografi Konteks Segmented Control Nav

Konfigurasi `k-segmented` dari **Konsta UI** pada subnavigasi telah dioverride di CSS agar:

- _Border Radius_ sisi luar dibatas mentok `8px`.
- Teks button tab yang tak aktif sengaja diredam opasitas transparansinya (`color: rgba(255, 255, 255, 0.85)`).

## 6. Tata Letak (Layouting) & Icons

- Usahakan untuk **selalu merender desain list full-width** atau dengan padding samping (umumnya `px-3` atau padding otomatis `mx-4` via card).
- Menggunakan ikon:
  - Jika sekilas butuh navigasi cepat dan solid memori: **Gunakan Emoji** standar secara sistemik (seperti pada Tab Bawah: 🏠, 💊, 💰, 📊, 👥). Teks ukurannya dibesarkan menjadikannya reaktif tanpa aset render SVG.
  - Jika butuh stroke UI (seperti Hamburger, Back btn), gunakan inline `<svg>` Tailwind atau ikon dari pustaka **`lucide-react`** dan **`@iconify/react`** tanpa mengunduh library luar yang berat untuk menjaga build _Capacitor_ tetep kecil.

## 7. Data Fetching & State Management

- Gunakan custom hook `useFetch` untuk melakukan request API standar. Hook ini sudah menangani loading state, error handling, dan caching sederhana.
- Gunakan custom hook `useReportData` khusus untuk halaman laporan yang menggunakan `<ReportTable>`. Hook ini sudah terintegrasi dengan fitur pagination (`limit` dan `offset`), pencarian, dan filter tanggal.
- Gunakan custom hook `useCabangOptions` dan `useGudangOptions` untuk mengambil data opsi cabang dan gudang yang sering digunakan pada filter laporan.
- Gunakan `useAuth` dari `lib/authContext.tsx` untuk mengakses state autentikasi pengguna (seperti data user, session, fungsi login/logout).
- Gunakan `useNavLoading` dari `lib/navLoadingContext.tsx` untuk mengontrol state loading navigasi global (biasanya digunakan bersama `<NavProgressBar>`).
- Gunakan `useSidebar` dari `lib/sidebarContext.tsx` untuk mengontrol state buka/tutup sidebar.

## 8. Navigasi & Routing

- Gunakan fungsi `getStatsRoute` dari `lib/routeConnector.ts` untuk mendapatkan URL tujuan navigasi berdasarkan label dari `StatCard` atau `RankedList`. Ini memusatkan logika pemetaan label ke route.

## 9. Export Data

- Gunakan fungsi-fungsi dari `lib/exportUtils.ts` (seperti `exportToExcel`, `exportToPdf`, `exportLabaRugiToPdf`, dll) untuk mengekspor data laporan ke format Excel atau PDF. Fungsi-fungsi ini sudah disesuaikan dengan format dan styling yang dibutuhkan.
