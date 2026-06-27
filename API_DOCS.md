# API Documentation

This document outlines the API endpoints used in the Vmedis Mobile application. The application uses a proxy route (`/api/proxy`) to communicate with the backend servers, handling CORS and dynamic base URLs based on the `apiVersion`.

## Base URLs

The base URL is determined by the `apiVersion` parameter or the `Target-Version` header:

*   **api5**: `https://api3.vmedismart.com/` (or `NEXT_PUBLIC_BASE_URL_API5`)
*   **apivmart**: (or `NEXT_PUBLIC_BASE_URL_API_MART`)
*   **api7** (Default): `https://api3penjualan.vmedismart.com/` (or `NEXT_PUBLIC_BASE_URL_API7`)

---

## 1. Endpoint: Dashboard Home

*   **Method:** `POST`
*   **URL/Path:** `/api/proxy` (Target: `mob-ap-dashboard/home-v2`)
*   **Fungsi:** Mengambil data statistik utama untuk ditampilkan pada halaman Dashboard (Penjualan, Pemeriksaan, Pendapatan).
*   **Target-Version:** `api7`
*   **Payload (JSON):**
    ```json
    {
      "endpoint": "mob-ap-dashboard/home-v2",
      "apiVersion": "api7",
      "params": {
        "a": "app_id",
        "periode": "1 | 2 | 3",
        "tanggal": "YYYY-MM-DD",
        "app_jenis": "3",
        "user_id": "user_id",
        "reg": "app_reg"
      }
    }
    ```
*   **Struktur Response (JSON):**
    ```json
    {
        "penjualanUmum": [
            {
                "jumfaktur": "3",
                "grandtotal": 1923267,
                "item": "2025-09-11"
            },
            {
                "jumfaktur": "1",
                "grandtotal": 31400,
                "item": "2025-09-12"
            },
            {
                "jumfaktur": "0",
                "grandtotal": "0",
                "item": "2025-09-13"
            },
            {
                "jumfaktur": "1",
                "grandtotal": 96400,
                "item": "2025-09-14"
            },
            {
                "jumfaktur": "9",
                "grandtotal": 926525,
                "item": "2025-09-15"
            },
            {
                "jumfaktur": "3",
                "grandtotal": 1000,
                "item": "2025-09-16"
            },
            {
                "jumfaktur": "7",
                "grandtotal": 1246008,
                "item": "2025-09-17"
            }
        ],
        "pesananOnline": [],
        "penjualanVmart": [
            {
                "jumfaktur": "0",
                "grandtotal": "0",
                "item": "2025-09-11"
            },
            {
                "jumfaktur": "0",
                "grandtotal": "0",
                "item": "2025-09-12"
            },
            {
                "jumfaktur": "0",
                "grandtotal": "0",
                "item": "2025-09-13"
            },
            {
                "jumfaktur": "0",
                "grandtotal": "0",
                "item": "2025-09-14"
            },
            {
                "jumfaktur": "0",
                "grandtotal": "0",
                "item": "2025-09-15"
            },
            {
                "jumfaktur": "0",
                "grandtotal": "0",
                "item": "2025-09-16"
            },
            {
                "jumfaktur": "0",
                "grandtotal": "0",
                "item": "2025-09-17"
            }
        ],
        "pembayaranKasir": [
            {
                "jumfaktur": "2",
                "grandtotal": 1392264.96,
                "item": "2025-09-11"
            },
            {
                "jumfaktur": "0",
                "grandtotal": "0",
                "item": "2025-09-12"
            },
            {
                "jumfaktur": "0",
                "grandtotal": "0",
                "item": "2025-09-13"
            },
            {
                "jumfaktur": "0",
                "grandtotal": "0",
                "item": "2025-09-14"
            },
            {
                "jumfaktur": "0",
                "grandtotal": "0",
                "item": "2025-09-15"
            },
            {
                "jumfaktur": "0",
                "grandtotal": "0",
                "item": "2025-09-16"
            },
            {
                "jumfaktur": "0",
                "grandtotal": "0",
                "item": "2025-09-17"
            }
        ],
        "pendapatanHC": [
            {
                "jumfaktur": "0",
                "grandtotal": "0",
                "item": "2025-09-11"
            },
            {
                "jumfaktur": "0",
                "grandtotal": "0",
                "item": "2025-09-12"
            },
            {
                "jumfaktur": "0",
                "grandtotal": "0",
                "item": "2025-09-13"
            },
            {
                "jumfaktur": "0",
                "grandtotal": "0",
                "item": "2025-09-14"
            },
            {
                "jumfaktur": "0",
                "grandtotal": "0",
                "item": "2025-09-15"
            },
            {
                "jumfaktur": "0",
                "grandtotal": "0",
                "item": "2025-09-16"
            },
            {
                "jumfaktur": "0",
                "grandtotal": "0",
                "item": "2025-09-17"
            }
        ],
        "totalPendapatan": [
            {
                "jumfaktur": 5,
                "grandtotal": 3315531.96,
                "item": "2025-09-11",
                "sumberGrandtotal": [
                    "penjualanUmum",
                    "pembayaranKasir"
                ]
            },
            {
                "jumfaktur": 1,
                "grandtotal": 31400,
                "item": "2025-09-12",
                "sumberGrandtotal": [
                    "penjualanUmum"
                ]
            },
            {
                "jumfaktur": 0,
                "grandtotal": 0,
                "item": "2025-09-13",
                "sumberGrandtotal": []
            },
            {
                "jumfaktur": 1,
                "grandtotal": 96400,
                "item": "2025-09-14",
                "sumberGrandtotal": [
                    "penjualanUmum"
                ]
            },
            {
                "jumfaktur": 9,
                "grandtotal": 926525,
                "item": "2025-09-15",
                "sumberGrandtotal": [
                    "penjualanUmum"
                ]
            },
            {
                "jumfaktur": 3,
                "grandtotal": 1000,
                "item": "2025-09-16",
                "sumberGrandtotal": [
                    "penjualanUmum"
                ]
            },
            {
                "jumfaktur": 7,
                "grandtotal": 1246008,
                "item": "2025-09-17",
                "sumberGrandtotal": [
                    "penjualanUmum"
                ]
            }
        ]
    }
    ```

---

## 2. Endpoint: Smart Forecast

*   **Method:** `POST`
*   **URL/Path:** `/api/proxy` (Target: `sys-main-menu-forecast/index-v2`)
*   **Fungsi:** Mengambil data analisis pareto dan status pengadaan obat untuk halaman Smart Forecast.
*   **Target-Version:** `api7`
*   **Payload (JSON):**
    ```json
    {
      "endpoint": "sys-main-menu-forecast/index-v2",
      "apiVersion": "api7",
      "params": {
        "a": "app_id",
        "reg": "app_reg",
        "jenis": "3",
        "cari": "3",
        "bulan": "Mmm YYYY",
        "bulan1": "Mmm YYYY",
        "proses": "true"
      }
    }
    ```
*   **Struktur Response (JSON):**
    ```json
    {
      "data": {
        "nominalParetoA": 5000000,
        "paretoA": 10,
        "paA": 2.5,
        "nominalParetoB": 3000000,
        "paretoB": 15,
        "paB": 1.2,
        "nominalParetoC": 1000000,
        "paretoC": 20,
        "paC": 0.5,
        "nominalParetoMin": 500000,
        "paretoMin": 5,
        "paMin": 1.5,
        "pengadaan1": 10000000,
        "status1": 50,
        "pStatus1": 5.0,
        "pengadaan2": 2000000,
        "status2": 10,
        "pStatus2": 2.0,
        "pengadaan3": 1000000,
        "status3": 5,
        "pStatus3": 1.0,
        "pengadaan4": 500000,
        "status4": 2,
        "pStatus4": 0.5,
        "total": 0,
        "countData": 0,
        "grandtotal": 0,
        "interval": 0,
        "jmldata": 0,
        "katlaris": {
          "OBT-001": { "name": "Paracetamol 500mg", "nilai": 1000000, "persen": 20.5 }
        }
      }
    }
    ```

---

## 3. Endpoint: Dashboard Obat

*   **Method:** `POST`
*   **URL/Path:** `/api/proxy` (Target: `sys-main-menu-obat/index-v4`)
*   **Fungsi:** Mengambil data statistik obat (stok, expired, habis, hilang) dan grafik pembelian untuk halaman Obat.
*   **Target-Version:** `api7`
*   **Payload (JSON):**
    ```json
    {
      "endpoint": "sys-main-menu-obat/index-v4",
      "apiVersion": "api7",
      "params": {
        "a": "app_id",
        "reg": "app_reg",
        "kl_id": "kl_id",
        "periode": "hariIni | bulanIni | tahunIni",
        "tanggal": "YYYY-MM-DD",
        "app_jenis": "3",
        "akses[0]": true,
        "akses[1]": true,
        "akses[2]": true,
        "akses[3]": true,
        "akses[4]": true,
        "akses[5]": true,
        "refreshData": 1
      }
    }
    ```
*   **Struktur Response (JSON):**
    ```json
    {
      "data": {
        "dataNilaiObat": {
          "count": 1000,
          "nilai": 50000000,
          "peningkatan": 2.5
        },
        "dataObatExpired": {
          "count": 20,
          "nilai": 1000000,
          "peningkatan": -1.0
        },
        "dataObatStokHabis": {
          "count": 5,
          "peningkatan": 0.0
        },
        "dataObatStokHilang": {
          "count": 10,
          "nilai": 500000,
          "peningkatan": -2.5,
          "statistik": [
            { "total": 10000 },
            { "total": 8000 }
          ]
        },
        "dataPengadaanObatTerbanyak": {
          "peningkatan": 5.0,
          "ranking": [
            { "obatid": "1", "obatnama": "Paracetamol 500mg", "satuan": "Box", "jumlah": 100 }
          ],
          "statistik": [
            { "total": 500000 },
            { "total": 450000 }
          ]
        },
        "dataObatTerlaris": [
          { "obatid": "2", "obatnama": "Amoxicillin 500mg", "satuan": "Strip", "jumlah": 50 }
        ]
      }
    }
    ```

---

## 4. Endpoint: Dashboard Keuangan

*   **Method:** `POST`
*   **URL/Path:** `/api/proxy` (Target: `sys-main-menu-keuangan/index-v6`)
*   **Fungsi:** Mengambil data statistik keuangan (aset, cash, pasiva, pendapatan, pengeluaran, laba rugi) untuk halaman Keuangan.
*   **Target-Version:** `api7`
*   **Payload (JSON):**
    ```json
    {
      "endpoint": "sys-main-menu-keuangan/index-v6",
      "apiVersion": "api7",
      "params": {
        "a": "app_id",
        "reg": "app_reg",
        "kl_id": "kl_id",
        "app_jenis": "3",
        "periode": "hariIni | bulanIni | tahunIni",
        "tanggal": "YYYY-MM-DD",
        "akses[0]": "true",
        "akses[1]": "true",
        "akses[2]": "true",
        "akses[3]": "true",
        "akses[4]": "true",
        "akses[5]": "true",
        "akses[6]": "true",
        "akses[7]": "true",
        "akses[8]": "true",
        "refreshData": "1"
      }
    }
    ```
*   **Struktur Response (JSON):**
    ```json
    {
      "data": {
        "dataAset": [
          { "y": "100000000", "jmlfaktur": "0" },
          { "y": "102000000", "jmlfaktur": "0" }
        ],
        "dataCash": [
          { "y": "50000000", "jmlfaktur": "0" },
          { "y": "51000000", "jmlfaktur": "0" }
        ],
        "dataPasiva": [
          { "y": "20000000", "jmlfaktur": "0" },
          { "y": "19000000", "jmlfaktur": "0" }
        ],
        "dataPendapatan": [
          { "y": "30000000", "jmlfaktur": "5" },
          { "y": "32000000", "jmlfaktur": "6" }
        ],
        "dataPengeluaran": [
          { "y": "10000000", "jmlfaktur": "3" },
          { "y": "11000000", "jmlfaktur": "4" }
        ],
        "dataLabarugi": [
          { "y": "20000000", "jmlfaktur": "0" },
          { "y": "21000000", "jmlfaktur": "0" }
        ],
        "dataHutang": [
          { "y": "5000000", "jmlfaktur": "2" },
          { "y": "4500000", "jmlfaktur": "1" }
        ],
        "dataPiutang": [
          { "y": "2000000", "jmlfaktur": "1" },
          { "y": "1800000", "jmlfaktur": "1" }
        ],
        "dataPiutangKlinik": [
          { "y": "1000000", "jmlfaktur": "1" },
          { "y": "900000", "jmlfaktur": "1" }
        ]
      }
    }
    ```

---

## 5. Endpoint: Dashboard Customer

*   **Method:** `POST`
*   **URL/Path:** `/api/proxy` (Target: `sys-main-menu-customer/index`)
*   **Fungsi:** Mengambil data statistik pelanggan (loyal, potensial, prospek, pasien baru) untuk halaman Customer.
*   **Target-Version:** `api5`
*   **Payload (JSON):**
    ```json
    {
      "endpoint": "sys-main-menu-customer/index",
      "apiVersion": "api5",
      "params": {
        "a": "app_id",
        "reg": "app_reg",
        "jenis": "3",
        "cari": "3",
        "combomob": "1 | 2 | 3",
        "bulan": "Mmm YYYY",
        "bulan1": "Mmm YYYY",
        "proses": "true",
        "akses[0]": true,
        "akses[1]": true,
        "akses[2]": true,
        "akses[3]": true,
        "akses[4]": true,
        "date": "YYYY-MM-DD"
      }
    }
    ```
*   **Struktur Response (JSON):**
    ```json
    {
      "databulanan": [
        {
          "tgl": "2026-01",
          "total": "5000000",
          "totalcustomer": "180",
          "paretoA": "100",
          "paretoB": "50",
          "paretoC": "20",
          "paretoD": "10",
          "paretoMin": "0"
        }
      ],
      "datapasienbaru": {
        "count": 30,
        "peningkatan": 15.0,
        "statistik": [
          { "total": 25 },
          { "total": 30 }
        ]
      },
      "datakunjungan": {
        "count": 200,
        "peningkatan": 10.0,
        "statistik": [
          { "total": 180 },
          { "total": 200 }
        ]
      }
    }
    ```

---

## 6. Endpoint: Laporan (Contoh: Registrasi Pasien)

*   **Method:** `POST`
*   **URL/Path:** `/api/proxy` (Target: `laporanmasterpasien/index`)
*   **Fungsi:** Mengambil data laporan registrasi pasien dengan fitur pagination dan filter.
*   **Target-Version:** `api5`
*   **Payload (JSON):**
    ```json
    {
      "endpoint": "laporanmasterpasien/index",
      "apiVersion": "api5",
      "params": {
        "a": "app_id",
        "reg": "app_reg",
        "filter": "search_keyword",
        "sorting": "",
        "pasaktif": 1,
        "cari": 4,
        "limit": 50,
        "offset": 0,
        "tglAwal": "DD Mmm YYYY",
        "tglAkhir": "DD Mmm YYYY",
        "device": "mobile"
      }
    }
    ```
*   **Struktur Response (JSON):**
    ```json
    {
      "data": [
        {
          "tgl": "01 Jan 2026 10:00:00",
          "pastglreg": "01 Jan 2026 10:00:00",
          "pasrm": "RM001",
          "pasnama": "Budi Santoso",
          "pasalamat": "Jl. Merdeka No. 1"
        }
      ]
    }
    ```

---

## 7. Endpoint: Laporan Kunjungan Pasien

*   **Method:** `POST`
*   **URL/Path:** `/api/proxy` (Target: `kunjungan/index`)
*   **Fungsi:** Mengambil data laporan kunjungan pasien.
*   **Target-Version:** `api5`
*   **Payload (JSON):**
    ```json
    {
      "endpoint": "kunjungan/index",
      "apiVersion": "api5",
      "params": {
        "a": "app_id",
        "reg": "app_reg",
        "filter": "search_keyword",
        "sorting": "",
        "cari": 4,
        "limit": 50,
        "offset": 0,
        "tanggalawal": "DD Mmm YYYY",
        "tanggalakhir": "DD Mmm YYYY",
        "device": "mobile"
      }
    }
    ```
*   **Struktur Response (JSON):**
    ```json
    {
      "data": {
        "data": [
          {
            "kuntgl": "01 Jan 2026",
            "pasnama": "Budi Santoso",
            "polnama": "Poli Umum",
            "doknama": "Dr. Andi",
            "kunid": "123",
            "kunnomer": "KUN-001",
            "pasrm": "RM001",
            "pasjk": "L",
            "kunstatus": "Selesai"
          }
        ]
      }
    }
    ```

---

## 8. Endpoint: Laporan Janji Dengan Dokter

*   **Method:** `POST`
*   **URL/Path:** `/api/proxy` (Target: `laporan-janji/index`)
*   **Fungsi:** Mengambil data laporan janji dengan dokter.
*   **Target-Version:** `api7`
*   **Payload (JSON):**
    ```json
    {
      "endpoint": "laporan-janji/index",
      "apiVersion": "api7",
      "params": {
        "a": "app_id",
        "reg": "app_reg",
        "filter": "search_keyword",
        "sorting": "",
        "cari": 4,
        "limit": 50,
        "offset": 0,
        "tanggalawal": "DD Mmm YYYY",
        "tanggalakhir": "DD Mmm YYYY",
        "device": "mobile"
      }
    }
    ```
*   **Struktur Response (JSON):**
    ```json
    {
      "data": [
        {
          "jantanggal": "01 Jan 2026",
          "pasnama": "Budi Santoso",
          "doknama": "Dr. Andi",
          "janketerangan": "Konsultasi rutin",
          "pasrm": "RM001"
        }
      ]
    }
    ```

---

## 9. Endpoint: Laporan Piutang Klinik

*   **Method:** `POST`
*   **URL/Path:** `/api/proxy` (Target: `kln-piutang/index`)
*   **Fungsi:** Mengambil data piutang klinik yang belum lunas.
*   **Target-Version:** `api5`
*   **Payload (JSON):**
    ```json
    {
      "endpoint": "kln-piutang/index",
      "apiVersion": "api5",
      "params": {
        "a": "app_id",
        "reg": "app_reg",
        "date": "YYYY-MM-DD",
        "tanggalawal": "DD Mmm YYYY",
        "tanggalakhir": "DD Mmm YYYY",
        "carimobile": "search_keyword",
        "sorting": "",
        "deadline": "0 | 7 | 15 | 30",
        "cari": "4 | 3 | 2",
        "filter": "",
        "limit": 50,
        "offset": 0,
        "device": "mobile"
      }
    }
    ```
*   **Struktur Response (JSON):**
    ```json
    {
      "data": [
        {
          "pemnofaktur": "FK-001",
          "pasnama": "Budi Santoso",
          "tanggaldeadline": "01 Jan 2026",
          "kekurangan": "150000"
        }
      ]
    }
    ```

---

## 10. Endpoint: Laporan Pembayaran Kasir

*   **Method:** `POST`
*   **URL/Path:** `/api/proxy` (Target: `kln-lap-bayar-kasir/index`)
*   **Fungsi:** Mengambil data laporan pembayaran kasir klinik.
*   **Target-Version:** `api7`
*   **Payload (JSON):**
    ```json
    {
      "endpoint": "kln-lap-bayar-kasir/index",
      "apiVersion": "api7",
      "params": {
        "a": "app_id",
        "reg": "app_reg",
        "tanggalawal": "DD Mmm YYYY",
        "tanggalakhir": "DD Mmm YYYY",
        "cari": "4 | 3 | 2",
        "bulan": "MM",
        "tahun": "YYYY",
        "filter": "search_keyword",
        "sorting": "",
        "limit": 50,
        "offset": 0,
        "device": "mobile"
      }
    }
    ```
*   **Struktur Response (JSON):**
    ```json
    {
      "data": [
        {
          "pemtanggal": "01 Jan 2026",
          "pemnofaktur": "FK-001",
          "pasnama": "Budi Santoso",
          "pasrm": "RM001",
          "pemjenis": "Tunai",
          "katnama": "Umum",
          "total": "250000",
          "polnama": "Poli Umum",
          "doknama": "Dr. Andi"
        }
      ]
    }
    ```

---

## 11. Endpoint: Laporan Penjualan Obat Klinik

*   **Method:** `POST`
*   **URL/Path:** `/api/proxy` (Target: `ki-penjualanobatklinik/index`)
*   **Fungsi:** Mengambil data laporan penjualan obat dari klinik.
*   **Target-Version:** `api7`
*   **Payload (JSON):**
    ```json
    {
      "endpoint": "ki-penjualanobatklinik/index",
      "apiVersion": "api7",
      "params": {
        "a": "app_id",
        "reg": "app_reg",
        "tanggalawal": "DD Mmm YYYY",
        "tanggalakhir": "DD Mmm YYYY",
        "cari": "4 | 3 | 2",
        "bulan": "MM",
        "tahun": "YYYY",
        "filter": "search_keyword",
        "carimobile": "search_keyword",
        "sorting": "",
        "limit": 50,
        "offset": 0,
        "device": "mobile"
      }
    }
    ```
*   **Struktur Response (JSON):**
    ```json
    {
      "data": [
        {
          "pemtanggal": "01 Jan 2026",
          "pemnofaktur": "FK-001",
          "pasnama": "Budi Santoso",
          "pasrm": "RM001",
          "pemjenis": "Tunai",
          "katnama": "Umum",
          "totalobat": "5",
          "total": "75000",
          "polnama": "Poli Umum",
          "doknama": "Dr. Andi"
        }
      ]
    }
    ```

---

## 12. Endpoint: Laporan Tagihan Jaminan Pasien

*   **Method:** `POST`
*   **URL/Path:** `/api/proxy` (Target: `laporan-tagihan-jaminan-pasien/index`)
*   **Fungsi:** Mengambil data laporan tagihan jaminan pasien (BPJS, asuransi, dll).
*   **Target-Version:** `api7`
*   **Payload (JSON):**
    ```json
    {
      "endpoint": "laporan-tagihan-jaminan-pasien/index",
      "apiVersion": "api7",
      "params": {
        "a": "app_id",
        "reg": "app_reg",
        "tanggalawal": "DD Mmm YYYY",
        "tanggalakhir": "DD Mmm YYYY",
        "filter": "search_keyword",
        "sorting": "",
        "cari": 4,
        "limit": 50,
        "offset": 0,
        "device": "mobile"
      }
    }
    ```
*   **Struktur Response (JSON):**
    ```json
    {
      "data": [
        {
          "tgl": "01 Jan 2026",
          "pemnofaktur": "FK-001",
          "pasrm": "RM001",
          "pasnama": "Budi Santoso",
          "katnama": "BPJS",
          "pemtunai": "500000"
        }
      ]
    }
    ```

---

## 13. Endpoint: Laporan Pendapatan Petugas Medis

*   **Method:** `POST`
*   **URL/Path:** `/api/proxy` (Target: `laporan-pendapatan-petugas-medis/index`)
*   **Fungsi:** Mengambil data laporan fee/pendapatan dokter dan petugas medis.
*   **Target-Version:** `api7`
*   **Payload (JSON):**
    ```json
    {
      "endpoint": "laporan-pendapatan-petugas-medis/index",
      "apiVersion": "api7",
      "params": {
        "a": "app_id",
        "reg": "app_reg",
        "tglAwal": "DD Mmm YYYY",
        "tglAkhir": "DD Mmm YYYY",
        "cari": "4 | 3 | 2",
        "bulan": "MM",
        "tahun": "YYYY",
        "filter": "search_keyword",
        "sorting": "",
        "limit": 50,
        "offset": 0,
        "device": "mobile"
      }
    }
    ```
*   **Struktur Response (JSON):**
    ```json
    {
      "data": [
        {
          "pemtanggal": "01 Jan 2026",
          "pemnofaktur": "FK-001",
          "doknama": "Dr. Andi",
          "bianama": "Konsultasi Umum",
          "dpemfeedoktertext": "100000",
          "dpemretfeedoktertext": "0"
        }
      ]
    }
    ```

---

## 14. Endpoint: Laporan Pembelian Obat

*   **Method:** `POST`
*   **URL/Path:** `/api/proxy` (Target: `laporan-transaksi-pembelian-obat/index`)
*   **Fungsi:** Mengambil data laporan transaksi pembelian obat dari supplier.
*   **Target-Version:** `api7`
*   **Payload (JSON):**
    ```json
    {
      "endpoint": "laporan-transaksi-pembelian-obat/index",
      "apiVersion": "api7",
      "params": {
        "a": "app_id",
        "reg": "app_reg",
        "tanggalawal": "DD Mmm YYYY",
        "tanggalakhir": "DD Mmm YYYY",
        "cari": "4 | 3 | 2",
        "bulan": "MM",
        "tahun": "YYYY",
        "carimobile": "search_keyword",
        "sorting": "",
        "gudid": "gudang_id",
        "limit": 50,
        "offset": 0,
        "device": "mobile"
      }
    }
    ```
*   **Struktur Response (JSON):**
    ```json
    {
      "data": [
        {
          "tgl": "01 Jan 2026",
          "pemofaktur": "PO-001",
          "supnama": "PT. Kimia Farma",
          "gudnama": "Gudang Utama",
          "pemograndtotal": "5000000"
        }
      ]
    }
    ```

---

## 15. Endpoint: Laporan Hutang Obat

*   **Method:** `POST`
*   **URL/Path:** `/api/proxy` (Target: `hutang-obat/index`)
*   **Fungsi:** Mengambil data laporan hutang obat kepada supplier.
*   **Target-Version:** `api5`
*   **Payload (JSON):**
    ```json
    {
      "endpoint": "hutang-obat/index",
      "apiVersion": "api5",
      "params": {
        "a": "app_id",
        "reg": "app_reg",
        "date": "DD-MM-YYYY",
        "tanggalawal": "DD Mmm YYYY",
        "tanggalakhir": "DD Mmm YYYY",
        "tahun": "YYYY",
        "bulan": "M",
        "pemofaktur": "search_keyword",
        "supnama": "search_keyword",
        "sorting": "",
        "deadline": "",
        "cari": "4 | 3 | 2",
        "limit": 50,
        "offset": 0,
        "device": "mobile"
      }
    }
    ```
*   **Struktur Response (JSON):**
    ```json
    {
      "data": [
        {
          "tgl": "01 Jan 2026",
          "pemofaktur": "PO-001",
          "supnama": "PT. Kimia Farma",
          "jml_bayar": "3000000"
        }
      ]
    }
    ```

---

## 16. Endpoint: Laporan Penjualan Obat (Apotek)

*   **Method:** `POST`
*   **URL/Path:** `/api/proxy` (Target: `apt-lap-penjualanobat-batch/indexlaporan-v2`)
*   **Fungsi:** Mengambil data laporan penjualan obat dari apotek.
*   **Target-Version:** `api5`
*   **Payload (JSON):**
    ```json
    {
      "endpoint": "apt-lap-penjualanobat-batch/indexlaporan-v2",
      "apiVersion": "api5",
      "params": {
        "a": "app_id",
        "reg": "app_reg",
        "tanggalawal": "DD Mmm YYYY",
        "tanggalakhir": "DD Mmm YYYY",
        "carimobile": "search_keyword",
        "cari": "4",
        "sorting": "",
        "limit": 50,
        "offset": 0,
        "device": "mobile"
      }
    }
    ```
*   **Struktur Response (JSON):**
    ```json
    {
      "data": [
        {
          "pjnofaktur": "PJ-001",
          "pasnama": "Budi Santoso",
          "doknama": "Dr. Andi",
          "grandtotal": "125000",
          "pjtanggal": "01 Jan 2026"
        }
      ]
    }
    ```

---

## 17. Endpoint: Laporan Piutang Obat

*   **Method:** `POST`
*   **URL/Path:** `/api/proxy` (Target: `appiutang-obat/index-v2`)
*   **Fungsi:** Mengambil data piutang obat apotek yang belum lunas.
*   **Target-Version:** `api5`
*   **Payload (JSON):**
    ```json
    {
      "endpoint": "appiutang-obat/index-v2",
      "apiVersion": "api5",
      "params": {
        "a": "app_id",
        "reg": "app_reg",
        "date": "YYYY-MM-DD",
        "tanggalawal": "DD Mmm YYYY",
        "tanggalakhir": "DD Mmm YYYY",
        "carimobile": "search_keyword",
        "sorting": "",
        "deadline": "0 | 7 | 15 | 30",
        "cari": 4,
        "limit": 50,
        "offset": 0,
        "device": "mobile"
      }
    }
    ```
*   **Struktur Response (JSON):**
    ```json
    {
      "data": [
        {
          "pjnofaktur": "PJ-001",
          "pasnama": "Budi Santoso",
          "deadline": "15 Jan 2026",
          "kurang": "75000"
        }
      ]
    }
    ```

---

## 18. Endpoint: Laporan Pergantian Shift

*   **Method:** `POST`
*   **URL/Path:** `/api/proxy` (Target: `aplaporangantishift/index`)
*   **Fungsi:** Mengambil data laporan pergantian shift kasir.
*   **Target-Version:** `api7`
*   **Payload (JSON):**
    ```json
    {
      "endpoint": "aplaporangantishift/index",
      "apiVersion": "api7",
      "params": {
        "a": "app_id",
        "reg": "app_reg",
        "tglAwal": "YYYY-MM-DD 00:00:00",
        "tglAkhir": "YYYY-MM-DD 23:59:59",
        "filter": "search_keyword",
        "cari": "4",
        "sorting": "",
        "tgldirect": true,
        "limit": 50,
        "offset": 0,
        "device": "mobile"
      }
    }
    ```
*   **Struktur Response (JSON):**
    ```json
    {
      "data": {
        "data": [
          {
            "shfbuka": "2026-01-01T08:00:00",
            "shftutup": "2026-01-01T16:00:00",
            "username": "kasir01",
            "shfakhir": "1500000"
          }
        ]
      }
    }
    ```

---

## 19. Endpoint: Laporan Obat Stok Habis

*   **Method:** `POST`
*   **URL/Path:** `/api/proxy` (Target: `my-data-obat/index-mob-v2`)
*   **Fungsi:** Mengambil data obat yang stoknya habis atau di bawah stok minimal.
*   **Target-Version:** `api5`
*   **Payload (JSON):**
    ```json
    {
      "endpoint": "my-data-obat/index-mob-v2",
      "apiVersion": "api5",
      "params": {
        "a": "app_id",
        "reg": "app_reg",
        "gudid": "gudang_id",
        "obatnama": "search_keyword",
        "obatstatus": 1,
        "obathabisnotif": 1,
        "cari": "4",
        "sorting": "",
        "limit": 50,
        "offset": 0,
        "device": "mobile"
      }
    }
    ```
*   **Struktur Response (JSON):**
    ```json
    {
      "data": [
        {
          "gudnama": "Gudang Utama",
          "obatnama": "Paracetamol 500mg",
          "obatminstok": "10",
          "stok": "0",
          "sonama": "Strip"
        }
      ]
    }
    ```

---

## 20. Endpoint: Laporan Obat Expired

*   **Method:** `POST`
*   **URL/Path:** `/api/proxy` (Target: `ap-obatexpired-batch/index-v2`)
*   **Fungsi:** Mengambil data obat yang sudah atau akan expired.
*   **Target-Version:** `api7`
*   **Payload (JSON):**
    ```json
    {
      "endpoint": "ap-obatexpired-batch/index-v2",
      "apiVersion": "api7",
      "params": {
        "a": "app_id",
        "reg": "app_reg",
        "date": "YYYY-MM-DD",
        "gudid": "gudang_id",
        "carimobile": "search_keyword",
        "cari": "1 | 2 | 3",
        "custombatch": true,
        "mn_jenis": 3,
        "sorting": "",
        "limit": 50,
        "offset": 0,
        "device": "mobile"
      }
    }
    ```
*   **Struktur Response (JSON):**
    ```json
    {
      "data": [
        {
          "gudnama": "Gudang Utama",
          "obatnama": "Amoxicillin 500mg",
          "mshnobatch": "BATCH-001",
          "stokakhir": "50",
          "sonama": "Kapsul",
          "mshtglexpired": "2026-03-31"
        }
      ]
    }
    ```

---

## 21. Endpoint: Laporan Obat Terlaris

*   **Method:** `POST`
*   **URL/Path:** `/api/proxy` (Target: `ap-lapobatlaris/index-v3`)
*   **Fungsi:** Mengambil data laporan obat terlaris berdasarkan jumlah terjual dan nominal.
*   **Target-Version:** `api5`
*   **Payload (JSON):**
    ```json
    {
      "endpoint": "ap-lapobatlaris/index-v3",
      "apiVersion": "api5",
      "params": {
        "a": "app_id",
        "reg": "app_reg",
        "tglAwal": "DD Mmm YYYY",
        "tglAkhir": "DD Mmm YYYY",
        "namaobat": "search_keyword",
        "mn_jenis": 3,
        "cari": 4,
        "sorting": "",
        "limit": 50,
        "offset": 0,
        "device": "mobile"
      }
    }
    ```
*   **Struktur Response (JSON):**
    ```json
    {
      "data": {
        "data": [
          {
            "obatid": "1",
            "obatnama": "Paracetamol 500mg",
            "jmlterjual": "500",
            "sonama": "Tablet",
            "jmlfaktur": "120",
            "nominaltotal": "1500000"
          }
        ]
      }
    }
    ```

---

## 22. Endpoint: Laporan Stok Obat

*   **Method:** `POST`
*   **URL/Path:** `/api/proxy` (Target: `ap-lapstok-batch/kartu3-v2`)
*   **Fungsi:** Mengambil data laporan stok obat saat ini per gudang.
*   **Target-Version:** `api5`
*   **Payload (JSON):**
    ```json
    {
      "endpoint": "ap-lapstok-batch/kartu3-v2",
      "apiVersion": "api5",
      "params": {
        "a": "app_id",
        "reg": "app_reg",
        "gudid": "gudang_id",
        "filter": "search_keyword",
        "cari": 4,
        "sorting": "",
        "limit": 50,
        "offset": 0,
        "device": "mobile"
      }
    }
    ```
*   **Struktur Response (JSON):**
    ```json
    {
      "data": [
        {
          "gudnama": "Gudang Utama",
          "obatkode": "OBT-001",
          "obatnama": "Paracetamol 500mg",
          "stok1": "100",
          "sonama1": "Box",
          "stok2": "5",
          "sonama2": "Strip",
          "stok3": "0",
          "sonama3": "Tablet",
          "stok4": null,
          "sonama4": null
        }
      ]
    }
    ```

---

## 23. Endpoint: Laporan Stok Opname

*   **Method:** `POST`
*   **URL/Path:** `/api/proxy` (Target: `aplaporanstokopname/index`)
*   **Fungsi:** Mengambil data laporan stok opname (selisih stok fisik vs sistem).
*   **Target-Version:** `api7`
*   **Payload (JSON):**
    ```json
    {
      "endpoint": "aplaporanstokopname/index",
      "apiVersion": "api7",
      "params": {
        "a": "app_id",
        "reg": "app_reg",
        "tglAwal": "DD Mmm YYYY",
        "tglAkhir": "DD Mmm YYYY",
        "namaobat": "search_keyword",
        "gudid": "gudang_id",
        "cari": 4,
        "limit": 50,
        "offset": 0,
        "device": "mobile"
      }
    }
    ```
*   **Struktur Response (JSON):**
    ```json
    {
      "data": [
        {
          "obatnama": "Paracetamol 500mg",
          "gudnama": "Gudang Utama",
          "sopselisih": "-5",
          "sophrgpp": "2000"
        }
      ]
    }
    ```

---

## 24. Endpoint: Laporan Neraca Umum

*   **Method:** `POST`
*   **URL/Path:** `/api/proxy` (Target: `laporanneracanormal/laporan-v2`)
*   **Fungsi:** Mengambil data laporan neraca umum (aset, kewajiban, ekuitas) per tanggal tertentu.
*   **Target-Version:** `api5`
*   **Payload (JSON):**
    ```json
    {
      "endpoint": "laporanneracanormal/laporan-v2",
      "apiVersion": "api5",
      "params": {
        "a": "app_id",
        "reg": "app_reg",
        "bulan": "Mmm YYYY",
        "tahun": "YYYY",
        "tglAwal": "DD Mmm YYYY",
        "tglAkhir": "DD Mmm YYYY",
        "mn_jenis": 4,
        "cari": 4,
        "carimobile": "",
        "sorting": "",
        "limit": 1000,
        "offset": 0,
        "device": "mobile"
      }
    }
    ```
*   **Struktur Response (JSON):**
    ```json
    {
      "data": {
        "data1": [
          {
            "aknama": "Kas",
            "akpos": "1",
            "urut": "1",
            "aktipe": "D",
            "mutasi": "5000000"
          }
        ],
        "data23": [
          {
            "aknama": "Hutang Usaha",
            "akpos": "2",
            "urut": "1",
            "aktipe": "K",
            "mutasi": "2000000"
          }
        ],
        "datalaba": [
          {
            "aknama": "Laba Ditahan",
            "aktipe": "K",
            "mutasi": "3000000"
          }
        ],
        "datalabacabang": []
      }
    }
    ```

---

## 25. Endpoint: Laporan Laba Rugi

*   **Method:** `POST`
*   **URL/Path:** `/api/proxy` (Target: `dy-lap-laba-rugi/laporan/`)
*   **Fungsi:** Mengambil data laporan laba rugi berdasarkan periode (tanggal, bulan, atau tahun).
*   **Target-Version:** `api7`
*   **Payload (JSON):**
    ```json
    {
      "endpoint": "dy-lap-laba-rugi/laporan/",
      "apiVersion": "api7",
      "params": {
        "a": "app_id",
        "reg": "app_reg",
        "cari": "4 | 3 | 2",
        "bulan": "YYYY-MM",
        "tahun": "YYYY",
        "tglAwal": "DD Mmm YYYY",
        "tglAkhir": "DD Mmm YYYY",
        "mn_jenis": "",
        "limit": 50,
        "offset": 0,
        "device": "mobile"
      }
    }
    ```
*   **Struktur Response (JSON):**
    ```json
    {
      "data": {
        "data": [
          { "akunama": "Penjualan Obat", "total": "10000000" }
        ],
        "data1": [
          { "akunama": "Biaya Operasional", "total": "3000000" }
        ],
        "data2": { "total": "8000000" },
        "data3": { "total": "500000" },
        "data4": { "mutasi": "12000000" },
        "data5": { "mutasi": "-3000000" },
        "data6": { "total": "2000000" },
        "data7": { "total": "0" }
      }
    }
    ```
