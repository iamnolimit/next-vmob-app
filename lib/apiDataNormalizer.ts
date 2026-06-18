/**
 * API Data Normalizer Utility
 * Normalizes different API response formats to a consistent structure
 * for both Dashboard and Medicine (Obat) data
 */

/**
 * Safely parse numeric values from API responses
 * @param {any} value - Value to parse
 * @param {number} defaultValue - Default value if parsing fails
 * @returns {number} Parsed number or default value
 */
export const safeParseNumber = (value: any, defaultValue = 0) => {
  if (value === null || value === undefined || value === '') return defaultValue;
  const parsed = typeof value === 'string' ? parseFloat(value) : Number(value);
  return isNaN(parsed) ? defaultValue : parsed;
};

/**
 * Safely parse integer values from API responses
 * @param {any} value - Value to parse
 * @param {number} defaultValue - Default value if parsing fails
 * @returns {number} Parsed integer or default value
 */
export const safeParseInt = (value: any, defaultValue = 0) => {
  if (value === null || value === undefined || value === '') return defaultValue;
  const parsed = typeof value === 'string' ? parseInt(value, 10) : Number(value);
  return isNaN(parsed) ? defaultValue : parsed;
};

/**
 * Normalize array data with fallback to empty array
 * @param {any} data - Data to normalize
 * @returns {Array} Normalized array
 */
export const normalizeArray = (data: any) => (Array.isArray(data) ? data : []);

/**
 * Normalize object data with fallback to empty object
 * @param {any} data - Data to normalize
 * @returns {Object} Normalized object
 */
export const normalizeObject = (data: any) =>
  data && typeof data === 'object' && !Array.isArray(data) ? data : {};

/**
 * Normalize dashboard API response structure
 * @param {Object} apiResponse - Raw API response from dashboard endpoint
 * @returns {Object} Normalized dashboard data
 */
export const normalizeDashboardData = (apiResponse: any) => {
  if (!apiResponse || typeof apiResponse !== 'object') {
    return {
      penjualanUmum: [],
      pesananOnline: [],
      penjualanVmart: [],
      pembayaranKasir: [],
      pendapatanHC: [],
      totalPendapatan: [],
    };
  }

  // Handle both { penjualanUmum: ... } and { data: { penjualanUmum: ... } }
  const data = apiResponse.data || apiResponse;

  const normalizeTransactionArray = (arr: any) =>
    normalizeArray(arr).map((item: any) => ({
      jumfaktur: safeParseInt(item?.jumfaktur, 0),
      grandtotal: safeParseNumber(item?.grandtotal, 0),
      item: item?.item || '',
      sumberGrandtotal: normalizeArray(item?.sumberGrandtotal),
    }));

  return {
    penjualanUmum: normalizeTransactionArray(data.penjualanUmum),
    pesananOnline: normalizeTransactionArray(data.pesananOnline),
    penjualanVmart: normalizeTransactionArray(data.penjualanVmart),
    pembayaranKasir: normalizeTransactionArray(data.pembayaranKasir),
    pendapatanHC: normalizeTransactionArray(data.pendapatanHC),
    totalPendapatan: normalizeTransactionArray(data.totalPendapatan),
  };
};

/**
 * Normalize medicine (obat) API response structure
 * @param {Object} apiResponse - Raw API response from medicine endpoint
 * @returns {Object} Normalized medicine data
 */
export const normalizeMedicineData = (apiResponse: any) => {
  if (!apiResponse || !apiResponse.data) {
    return {
      dataNilaiObat: { count: 0, nilai: 0, peningkatan: 0 },
      dataObatExpired: { count: 0, nilai: 0, peningkatan: 0 },
      dataObatStokHabis: { count: 0, peningkatan: 0 },
      dataObatStokHilang: { count: 0, peningkatan: 0, statistik: [] },
      dataPengadaanObatTerbanyak: { peningkatan: 0, ranking: [], statistik: [] },
      dataObatTerlaris: [],
    };
  }

  const data = apiResponse.data;

  const normalizeBasicMedicineData = (item: any) => ({
    count: safeParseInt(item?.count, 0),
    nilai: safeParseNumber(item?.nilai, 0),
    peningkatan: safeParseNumber(item?.peningkatan, 0),
  });

  const normalizeStatistik = (statistik: any) =>
    normalizeArray(statistik).map((item: any) => ({
      total: safeParseNumber(item?.total, 0),
    }));

  const normalizeRanking = (ranking: any) =>
    normalizeArray(ranking).map((item: any) => ({
      obatid: item?.obatid || '',
      jumlah: safeParseNumber(item?.jumlah, 0),
      satuan: item?.satuan || '',
      obatnama: item?.obatnama || '',
    }));

  const normalizeObatTerlaris = (datas: any) =>
    normalizeArray(datas).map((item: any) => ({
      obatid: item?.obatid || '',
      obatnama: item?.obatnama || '',
      satuan: item?.satuan || '',
      jumlah: safeParseNumber(item?.jumlah, 0),
    }));

  return {
    dataNilaiObat: normalizeBasicMedicineData(data.dataNilaiObat),
    dataObatExpired: normalizeBasicMedicineData(data.dataObatExpired),
    dataObatStokHabis: {
      count: safeParseInt(data.dataObatStokHabis?.count, 0),
      peningkatan: safeParseNumber(data.dataObatStokHabis?.peningkatan, 0),
    },
    dataObatStokHilang: {
      count: safeParseInt(data.dataObatStokHilang?.count, 0),
      peningkatan: safeParseNumber(data.dataObatStokHilang?.peningkatan, 0),
      statistik: normalizeStatistik(data.dataObatStokHilang?.statistik),
    },
    dataPengadaanObatTerbanyak: {
      peningkatan: safeParseNumber(data.dataPengadaanObatTerbanyak?.peningkatan, 0),
      ranking: normalizeRanking(data.dataPengadaanObatTerbanyak?.ranking),
      statistik: normalizeStatistik(data.dataPengadaanObatTerbanyak?.statistik),
    },
    dataObatTerlaris: normalizeObatTerlaris(data.dataObatTerlaris),
  };
};

/**
 * Get safe value for stats calculation with percentage change
 * @param {number} current - Current value
 * @param {number} previous - Previous value
 * @returns {Object} Object with value and percentage change info
 */
export const calculateSafePercentageChange = (current: any, previous: any) => {
  const currentVal = safeParseNumber(current, 0);
  const previousVal = safeParseNumber(previous, 0);

  if (previousVal === 0) {
    return {
      value: '0.0',
      isPositive: true,
      currentValue: currentVal,
      previousValue: previousVal,
    };
  }

  const percentageChange = ((currentVal - previousVal) / previousVal) * 100;
  return {
    value: Math.abs(percentageChange).toFixed(1),
    isPositive: percentageChange >= 0,
    currentValue: currentVal,
    previousValue: previousVal,
  };
};

/**
 * Get safe percentage from peningkatan field
 * @param {any} peningkatan - Peningkatan value from API
 * @returns {Object} Object with formatted percentage info
 */
export const getSafePercentageFromPeningkatan = (peningkatan: any) => {
  const value = safeParseNumber(peningkatan, 0);
  return {
    value: Math.abs(value).toFixed(1),
    isPositive: value >= 0,
    rawValue: value,
  };
};

/**
 * Generate safe chart data from normalized API response
 * @param {Object} normalizedData - Normalized API data
 * @param {string} period - Period type ('today', 'month', 'year')
 * @returns {Array} Chart data array
 */
export const generateSafeChartData = (normalizedData: any, period = 'today') => {
  const generateLabels = (periodType: string, length = 7) => {
    if (periodType === 'today') {
      const today = new Date();
      const dates = [];
      for (let i = length - 1; i >= 0; i--) {
        const date = new Date(today);
        date.setDate(today.getDate() - i);
        const day = date.getDate();
        const month = date.toLocaleDateString('id-ID', { month: 'short' });
        dates.push(`${day} ${month}`);
      }
      return dates;
    }
    if (periodType === 'month') {
      const months = [
        'Jan',
        'Feb',
        'Mar',
        'Apr',
        'Mei',
        'Jun',
        'Jul',
        'Ags',
        'Sep',
        'Okt',
        'Nov',
        'Des',
      ];
      // Get current month (0-11)
      const now = new Date();
      const currentMonth = now.getMonth(); // e.g., October = 9

      // Generate last N months ending with current month
      // Example: If October (9) and length=7, show: Apr, Mei, Jun, Jul, Ags, Sep, Okt
      const labels = [];
      for (let i = length - 1; i >= 0; i--) {
        let monthIndex = currentMonth - i;
        if (monthIndex < 0) {
          monthIndex += 12; // Wrap to previous year
        }
        labels.push(months[monthIndex]);
      }
      return labels;
    }
    if (periodType === 'year') {
      const currentYear = new Date().getFullYear();
      const years = [];
      for (let i = 0; i < length; i++) {
        years.push((currentYear - length + 1 + i).toString());
      }
      return years;
    }
    return [];
  };

  // Check if this is dashboard data (has arrays) or medicine data (has statistik)
  if (normalizedData.totalPendapatan && Array.isArray(normalizedData.totalPendapatan)) {
    // Dashboard data - use transaction arrays
    const maxLength = Math.max(
      normalizedData.totalPendapatan.length,
      normalizedData.penjualanUmum.length,
      normalizedData.pembayaranKasir.length,
      normalizedData.penjualanVmart.length,
      normalizedData.pendapatanHC.length,
      7
    );

    const labels = generateLabels(period, maxLength);
    const data = [];
    for (let i = 0; i < maxLength; i++) {
      const totalPendapatan = normalizedData.totalPendapatan[i]?.grandtotal || 0;
      // Updated mapping according to requirements:
      // 1. Penjualan Kasir uses penjualanUmum
      const penjualanKasir = normalizedData.penjualanUmum[i]?.grandtotal || 0;
      // 2. Penjualan Online uses penjualanVmart
      const penjualanOnline = normalizedData.penjualanVmart[i]?.grandtotal || 0;
      // 3. Pemeriksaan Klinik (formerly V-Mart) uses pembayaranKasir
      const pemeriksaanKlinik = normalizedData.pembayaranKasir[i]?.grandtotal || 0;
      const pendapatanHomecare = normalizedData.pendapatanHC[i]?.grandtotal || 0;

      data.push({
        name: labels[i] || `Item ${i + 1}`,
        totalPendapatan,
        penjualanKasir,
        penjualanOnline,
        pemeriksaanKlinik,
        pendapatanHomecare,
      });
    }

    return data;
  } else if (normalizedData.dataObatStokHilang && normalizedData.dataPengadaanObatTerbanyak) {
    // Medicine data - use statistik arrays
    const stokHilangStats = normalizedData.dataObatStokHilang.statistik || [];
    const pengadaanStats = normalizedData.dataPengadaanObatTerbanyak.statistik || [];

    const maxLength = Math.max(stokHilangStats.length, pengadaanStats.length, 7);
    const labels = generateLabels(period, maxLength);
    const data = [];

    for (let i = 0; i < maxLength; i++) {
      const obatHilang = stokHilangStats[i]?.total || 0;
      const pembelianObat = pengadaanStats[i]?.total || 0;
      data.push({
        name: labels[i] || `Point ${i + 1}`,
        obatHilang,
        pembelianObat,
        totalObat: obatHilang + pembelianObat,
      });
    }

    return data;
  } else if (normalizedData.dataAset || normalizedData.dataCash) {
    // Finance data
    const dataAset = normalizeArray(normalizedData.dataAset);
    const dataCash = normalizeArray(normalizedData.dataCash);
    const dataPasiva = normalizeArray(normalizedData.dataPasiva);
    const dataPendapatan = normalizeArray(normalizedData.dataPendapatan);
    const dataPengeluaran = normalizeArray(normalizedData.dataPengeluaran);
    const dataLabarugi = normalizeArray(normalizedData.dataLabarugi);
    const dataHutang = normalizeArray(normalizedData.dataHutang);
    const dataPiutang = normalizeArray(normalizedData.dataPiutang);
    const dataPiutangKlinik = normalizeArray(normalizedData.dataPiutangKlinik);

    const maxLength = Math.max(
      dataAset.length,
      dataCash.length,
      dataPasiva.length,
      dataPendapatan.length,
      dataPengeluaran.length,
      dataLabarugi.length,
      dataHutang.length,
      dataPiutang.length,
      dataPiutangKlinik.length,
      7
    );

    const labels = generateLabels(period, maxLength);
    const data = [];

    for (let i = 0; i < maxLength; i++) {
      data.push({
        name: labels[i] || `Point ${i + 1}`,
        totalAset: parseFloat(dataAset[i]?.y || 0),
        totalCash: parseFloat(dataCash[i]?.y || 0),
        totalPasiva: parseFloat(dataPasiva[i]?.y || 0),
        totalPendapatan: parseFloat(dataPendapatan[i]?.y || 0),
        totalPengeluaran: parseFloat(dataPengeluaran[i]?.y || 0),
        labaRugi: parseFloat(dataLabarugi[i]?.y || 0),
        totalHutangObat: parseFloat(dataHutang[i]?.y || 0),
        totalPiutangApotek: parseFloat(dataPiutang[i]?.y || 0),
        totalPiutangKlinik: parseFloat(dataPiutangKlinik[i]?.y || 0),
      });
    }

    return data;
  }

  return [];
};

/**
 * Format currency value safely
 * @param {any} amount - Amount to format
 * @returns {string} Formatted currency string
 */
export const formatSafeCurrency = (amount: any) => {
  const value = safeParseNumber(amount, 0);
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
};

/**
 * Format chart value safely for display
 * @param {any} value - Value to format
 * @returns {string} Formatted value string
 */
export const formatSafeChartValue = (value: any) => {
  const numValue = safeParseNumber(value, 0);

  if (numValue >= 1000000) {
    const millions = numValue / 1000000;
    const formatted = millions.toLocaleString('id-ID', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
    return `Rp ${formatted}M`;
  }
  if (numValue >= 1000) {
    const thousands = numValue / 1000;
    const formatted = thousands.toLocaleString('id-ID', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
    return `Rp ${formatted}K`;
  }
  return `Rp ${numValue.toLocaleString('id-ID', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
};

/**
 * Main normalizer function that detects data type and applies appropriate normalization
 * @param {Object} apiResponse - Raw API response
 * @param {string} dataType - Type of data ('dashboard' or 'medicine')
 * @returns {Object} Normalized data
 */
export const normalizeApiData = (apiResponse: any, dataType = 'auto') => {
  if (!apiResponse) return null;

  // Auto-detect data type if not specified
  if (dataType === 'auto') {
    if (
      apiResponse.data &&
      (apiResponse.data.dataNilaiObat || apiResponse.data.dataObatStokHilang)
    ) {
      dataType = 'medicine';
    } else if (apiResponse.totalPendapatan || apiResponse.pembayaranKasir) {
      dataType = 'dashboard';
    } else if (apiResponse.paretoA !== undefined || apiResponse.status1 !== undefined) {
      dataType = 'forecast';
    } else if (apiResponse.databulanan || apiResponse.datapasienbaru) {
      dataType = 'customer';
    } else if (apiResponse.data && (apiResponse.data.dataAset || apiResponse.data.dataCash)) {
      dataType = 'finance';
    }
  }

  switch (dataType) {
    case 'medicine':
      return normalizeMedicineData(apiResponse);
    case 'dashboard':
      return normalizeDashboardData(apiResponse);
    case 'forecast':
      return normalizeForecastData(apiResponse);
    case 'customer':
      return normalizeCustomerData(apiResponse);
    case 'finance':
      return apiResponse.data || apiResponse; // Finance data is already in a good shape, just extract data
    default:
      console.warn('Unknown data type for normalization:', dataType);
      return apiResponse.data || apiResponse;
  }
};

/**
 * Normalize forecast API response structure
 * @param {Object} apiResponse - Raw API response from forecast endpoint
 * @returns {Object} Normalized forecast data
 */
export const normalizeForecastData = (apiResponse: any) => {
  if (!apiResponse || typeof apiResponse !== 'object') {
    return {
      paretoA: 0,
      paretoB: 0,
      paretoC: 0,
      paretoMin: 0,
      paA: 0,
      paB: 0,
      paC: 0,
      paMin: 0,
      status1: 0,
      status2: 0,
      status3: 0,
      status4: 0,
      pStatus1: 0,
      pStatus2: 0,
      pStatus3: 0,
      pStatus4: 0,
      nominalParetoA: 0,
      nominalParetoB: 0,
      nominalParetoC: 0,
      nominalParetoMin: 0,
      katlaris: {},
    };
  }

  const data = normalizeObject(apiResponse.data || apiResponse);

  return {
    paretoA: safeParseInt(data.paretoA, 0),
    paretoB: safeParseInt(data.paretoB, 0),
    paretoC: safeParseInt(data.paretoC, 0),
    paretoMin: safeParseInt(data.paretoMin, 0),
    paA: safeParseNumber(data.paA, 0),
    paB: safeParseNumber(data.paB, 0),
    paC: safeParseNumber(data.paC, 0),
    paMin: safeParseNumber(data.paMin, 0),
    status1: safeParseInt(data.status1, 0),
    status2: safeParseInt(data.status2, 0),
    status3: safeParseInt(data.status3, 0),
    status4: safeParseInt(data.status4, 0),
    pStatus1: safeParseNumber(data.pStatus1, 0),
    pStatus2: safeParseNumber(data.pStatus2, 0),
    pStatus3: safeParseNumber(data.pStatus3, 0),
    pStatus4: safeParseNumber(data.pStatus4, 0),
    nominalParetoA: safeParseNumber(data.nominalParetoA, 0),
    nominalParetoB: safeParseNumber(data.nominalParetoB, 0),
    nominalParetoC: safeParseNumber(data.nominalParetoC, 0),
    nominalParetoMin: safeParseNumber(data.nominalParetoMin, 0),
    katlaris: normalizeObject(data.katlaris),
    total: safeParseNumber(data.total, 0),
    countData: safeParseInt(data.countData, 0),
    grandtotal: safeParseNumber(data.grandtotal, 0),
    interval: safeParseInt(data.interval, 0),
    jmldata: safeParseInt(data.jmldata, 0),
  };
};

/**
 * Generate safe chart data for forecast
 * @param {Object} apiData - Normalized forecast data
 * @returns {Array} Chart data array
 */
export const generateForecastChartData = (apiData: any) => {
  if (!apiData || typeof apiData !== 'object') {
    return [];
  }

  const data = normalizeForecastData(apiData);
  console.log('Normalized forecast data for charts:', data);
  const chartData = []; // Chart 1: Kategori Pareto - menggunakan paretoA, paretoB, paretoC, paretoMin
  const paretoData = [
    { name: 'Pareto A', value: data.paretoA, color: '#4CAF50' },
    { name: 'Pareto B', value: data.paretoB, color: '#2196F3' },
    { name: 'Pareto C', value: data.paretoC, color: '#FF9800' },
    { name: 'Under Pareto C', value: data.paretoMin, color: '#F44336' },
  ];

  console.log('Pareto chart data:', paretoData);
  console.log('Pareto values from API:', {
    paretoA: data.paretoA,
    paretoB: data.paretoB,
    paretoC: data.paretoC,
    paretoMin: data.paretoMin,
  });

  chartData.push({
    title: 'Distribusi Kategori Pareto',
    type: 'bar',
    data: paretoData,
    subtitle: 'Analisis ABC berdasarkan nilai penjualan',
  });
  // Chart 2: Status Pengadaan - menggunakan status1, status2, status3, status4
  const statusData = [
    { name: 'Stock On Hand', value: data.status1, color: '#4CAF50' },
    { name: 'Over Stock', value: data.status2, color: '#FF9800' },
    { name: 'Under Stock', value: data.status3, color: '#F44336' },
    { name: 'Potential Lost', value: data.status4, color: '#9C27B0' },
  ];

  console.log('Status Pengadaan chart data:', statusData);
  console.log('Status values from API:', {
    status1: data.status1,
    status2: data.status2,
    status3: data.status3,
    status4: data.status4,
  });
  chartData.push({
    title: 'Status Pengadaan',
    type: 'bar',
    data: statusData,
    subtitle: 'Kondisi stok berdasarkan analisis forecast',
  });

  return chartData;
};

/**
 * Generate safe chart data for forecast following the same pattern as dashboard
 * @param {Object} normalizedData - Normalized forecast data
 * @param {string} period - Period type (not used but kept for consistency)
 * @returns {Array} Chart data array in the same format as dashboard
 */
export const generateForecastSafeChartData = (normalizedData: any, period = 'forecast') => {
  if (!normalizedData || typeof normalizedData !== 'object') {
    return [];
  }

  // Important: ChartCarousel will show different data based on the dataKey
  // When chart 1 (paretoAnalysis) is active, it will show: Pareto A (paretoA), Pareto B (paretoB), etc
  // When chart 2 (statusPengadaan) is active, it will show: Stock On Hand (status2), Over Stock (status4), etc
  // We need to put the data in correct positions so the right values show up
  return [
    {
      name: 'Pareto A', // Chart 1 label
      paretoAnalysis: normalizedData.paretoA || 0, // Chart 1 data
      statusPengadaan: 0, // Chart 2 will not use this row
    },
    {
      name: 'Pareto B', // Chart 1 label
      paretoAnalysis: normalizedData.paretoB || 0, // Chart 1 data
      statusPengadaan: 0, // Chart 2 will not use this row
    },
    {
      name: 'Pareto C', // Chart 1 label
      paretoAnalysis: normalizedData.paretoC || 0, // Chart 1 data
      statusPengadaan: 0, // Chart 2 will not use this row
    },
    {
      name: 'Dibawah Pareto C', // Chart 1 label
      paretoAnalysis: normalizedData.paretoMin || 0, // Chart 1 data
      statusPengadaan: 0, // Chart 2 will not use this row
    },
    {
      name: 'Stock On Hand', // Chart 2 label
      paretoAnalysis: 0, // Chart 1 will not use this row
      statusPengadaan: normalizedData.status1 || 0, // Chart 2 data
    },
    {
      name: 'Over Stock', // Chart 2 label
      paretoAnalysis: 0, // Chart 1 will not use this row
      statusPengadaan: normalizedData.status2 || 0, // Chart 2 data
    },
    {
      name: 'Under Stock', // Chart 2 label
      paretoAnalysis: 0, // Chart 1 will not use this row
      statusPengadaan: normalizedData.status3 || 0, // Chart 2 data
    },
    {
      name: 'Potential Lost', // Chart 2 label
      paretoAnalysis: 0, // Chart 1 will not use this row
      statusPengadaan: normalizedData.status4 || 0, // Chart 2 data
    },
  ];
};

/**
 * Normalize customer API response structure
 * @param {Object} apiResponse - Raw API response from customer endpoint
 * @returns {Object} Normalized customer data
 */
export const normalizeCustomerData = (apiResponse: any) => {
  if (!apiResponse || typeof apiResponse !== 'object') {
    return {
      databulanan: [],
      datapasienbaru: { peningkatan: 0, count: 0, statistik: [] },
      datakunjungan: { peningkatan: 0, count: 0, statistik: [] },
    };
  }

  const databulanan = normalizeArray(apiResponse.databulanan).map((item: any) => ({
    tgl: item?.tgl || '',
    total: safeParseNumber(item?.total, 0),
    totalcustomer: safeParseInt(item?.totalcustomer, 0),
    paretoA: safeParseInt(item?.paretoA, 0),
    paretoB: safeParseInt(item?.paretoB, 0),
    paretoC: safeParseInt(item?.paretoC, 0),
    paretoD: safeParseInt(item?.paretoD, 0),
    paretoMin: safeParseInt(item?.paretoMin, 0),
  }));

  const datapasienbaru = {
    peningkatan: safeParseNumber(apiResponse.datapasienbaru?.peningkatan, 0),
    count: safeParseInt(apiResponse.datapasienbaru?.count, 0),
    statistik: normalizeArray(apiResponse.datapasienbaru?.statistik).map((s: any) => ({
      total: safeParseInt(s?.total, 0),
    })),
  };

  const datakunjungan = {
    peningkatan: safeParseNumber(apiResponse.datakunjungan?.peningkatan, 0),
    count: safeParseInt(apiResponse.datakunjungan?.count, 0),
    statistik: normalizeArray(apiResponse.datakunjungan?.statistik).map((s: any) => ({
      total: safeParseInt(s?.total, 0),
    })),
  };

  return { databulanan, datapasienbaru, datakunjungan };
};

/**
 * Generate safe chart data for customer page
 * @param {Object} normalizedData - Normalized customer data
 * @param {string} periodType - Period type ('threeMonth', 'sixMonth', 'oneYear')
 * @returns {Array} Chart data array following dashboard pattern
 */
export const generateCustomerSafeChartData = (normalizedData: any, periodType = 'threeMonth') => {
  if (!normalizedData || !normalizedData.databulanan || normalizedData.databulanan.length === 0) {
    return [];
  }

  // Determine expected number of data points based on period
  const getExpectedDataPoints = (type: string) => {
    switch (type) {
      case 'threeMonth':
        return 3;
      case 'sixMonth':
        return 6;
      case 'oneYear':
        return 12;
      default:
        return 3;
    }
  };
  // Generate proper month labels based on current date and period
  const generateMonthLabels = (type: string) => {
    const now = new Date();
    const currentMonth = now.getMonth(); // 0-11
    const monthNames = [
      'Jan',
      'Feb',
      'Mar',
      'Apr',
      'Mei',
      'Jun',
      'Jul',
      'Agt',
      'Sep',
      'Okt',
      'Nov',
      'Des',
    ];

    const labels = [];
    let numMonths = getExpectedDataPoints(type);

    // Calculate start month based on period type
    let startMonth;
    switch (type) {
      case 'threeMonth':
        startMonth = currentMonth - 2;
        break;
      case 'sixMonth':
        startMonth = currentMonth - 5;
        break;
      case 'oneYear':
        startMonth = currentMonth + 1; // Start from next month of previous year
        break;
      default:
        startMonth = currentMonth - 2;
    }

    // Adjust for negative months
    while (startMonth < 0) {
      startMonth += 12;
    }

    // Generate labels for each month in the period
    for (let i = 0; i < numMonths; i++) {
      const monthIndex = (startMonth + i) % 12;
      labels.push(monthNames[monthIndex]);
    }

    return labels;
  };

  const expectedPoints = getExpectedDataPoints(periodType);
  const properLabels = generateMonthLabels(periodType);
  const actualData = normalizedData.databulanan;

  // Ensure we have the right number of data points
  let chartDataPoints = actualData;
  // If we have more data than expected, take the last N points
  if (actualData.length > expectedPoints) {
    chartDataPoints = actualData.slice(-expectedPoints);
  }

  // If we have less data than expected, pad with empty data
  if (actualData.length < expectedPoints) {
    const missingPoints = expectedPoints - actualData.length;
    const paddingData = Array(missingPoints)
      .fill(null)
      .map((_, index) => ({
        tgl: '',
        total: 0,
        totalcustomer: 0,
        paretoA: 0,
        paretoB: 0,
        paretoC: 0,
        paretoD: 0,
        paretoMin: 0,
      }));
    chartDataPoints = [...paddingData, ...actualData];
  }

  const chartData = [];

  // Generate data points for each period unit using proper labels
  for (let i = 0; i < chartDataPoints.length; i++) {
    const monthData = chartDataPoints[i];
    const label = properLabels[i] || `Bulan ${i + 1}`;

    chartData.push({
      name: label,
      loyalCustomer: monthData.paretoA,
      potensialCustomer: monthData.paretoB,
      prospekCustomer: monthData.paretoC,
      belumProspek: monthData.paretoD,
      totalCustomer: monthData.totalcustomer,
      pasienBaru: normalizedData.datapasienbaru.statistik[i]?.total || 0,
      kunjunganPasien: normalizedData.datakunjungan.statistik[i]?.total || 0,
    });
  }

  return chartData;
};
