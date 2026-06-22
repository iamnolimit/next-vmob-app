import { UserProfile } from './auth';

const getLocalDateString = () => {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

export const dashboardPageConfig = {
  apiEndpoint: 'mob-ap-dashboard/home-v2',
  apiVersion: 'api7',
  getApiParams: (user: UserProfile, periodValue: string) => ({
    a: user.app_id,
    periode: periodValue,
    tanggal: getLocalDateString(),
    app_jenis: user.app_jenis?.toString() || '3',
    user_id: user.gr_id?.toString() || user.user_id?.toString(),
    reg: user.app_reg,
  }),
};

export const forecastPageConfig = {
  apiEndpoint: 'sys-main-menu-forecast/index-v2',
  apiVersion: 'api7',
  calculatePeriodDates: (periodType: string) => {
    const now = new Date();
    const currentMonth = now.getMonth(); // 0-11 (Oct = 9)
    const currentYear = now.getFullYear();

    // End month is always last month
    let endMonth = currentMonth - 1;
    let endYear = currentYear;

    // Handle January case (currentMonth = 0)
    if (endMonth < 0) {
      endMonth = 11; // December
      endYear = currentYear - 1;
    }

    let startMonth, startYear;

    switch (periodType) {
      case 'threeMonth':
        startMonth = endMonth - 2;
        startYear = endYear;
        if (startMonth < 0) {
          startMonth = 12 + startMonth;
          startYear = endYear - 1;
        }
        break;
      case 'sixMonth':
        startMonth = endMonth - 5;
        startYear = endYear;
        if (startMonth < 0) {
          startMonth = 12 + startMonth;
          startYear = endYear - 1;
        }
        break;
      case 'oneYear':
        startMonth = endMonth - 11;
        startYear = endYear;
        if (startMonth < 0) {
          startMonth = 12 + startMonth;
          startYear = endYear - 1;
        }
        break;
      default:
        startMonth = endMonth - 2;
        startYear = endYear;
    }

    const monthNames = [
      'Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun',
      'Jul', 'Agt', 'Sep', 'Okt', 'Nov', 'Des',
    ];

    return {
      bulan: `${monthNames[startMonth]} ${startYear}`,
      bulan1: `${monthNames[endMonth]} ${endYear}`,
    };
  },
  getApiParams: (user: UserProfile, periodValue: string) => {
    const dates = forecastPageConfig.calculatePeriodDates(periodValue);
    return {
      a: user.app_id,
      reg: user.app_reg,
      jenis: '3',
      cari: '3',
      bulan: dates.bulan,
      bulan1: dates.bulan1,
      proses: 'true',
    };
  },
};

export const obatPageConfig = {
  apiEndpoint: 'sys-main-menu-obat/index-v4',
  apiVersion: 'api7',
  getApiParams: (user: UserProfile, periodValue: string) => ({
    a: user.app_id,
    reg: user.app_reg,
    kl_id: user.kl_id || '',
    periode: periodValue,
    tanggal: getLocalDateString(),
    app_jenis: user.app_jenis?.toString() || 3,
    'akses[0]': true,
    'akses[1]': true,
    'akses[2]': true,
    'akses[3]': true,
    'akses[4]': true,
    'akses[5]': true,
    refreshData: 1,
  }),
};

export const keuanganPageConfig = {
  apiEndpoint: 'sys-main-menu-keuangan/index-v6',
  apiVersion: 'api7',
  getApiParams: (user: UserProfile, periodValue: string) => ({
    a: user.app_id,
    reg: user.app_reg,
    kl_id: user.kl_id || '',
    app_jenis: user.app_jenis?.toString() || '3',
    periode: periodValue,
    tanggal: getLocalDateString(),
    'akses[0]': 'true',
    'akses[1]': 'true',
    'akses[2]': 'true',
    'akses[3]': 'true',
    'akses[4]': 'true',
    'akses[5]': 'true',
    'akses[6]': 'true',
    'akses[7]': 'true',
    'akses[8]': 'true',
    refreshData: '1',
  }),
};

export const customerPageConfig = {
  apiEndpoint: 'sys-main-menu-customer/index',
  apiVersion: 'api5',
  calculatePeriodDates: (periodType: string) => {
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();

    const endMonth = currentMonth;
    const endYear = currentYear;

    let startMonth, startYear;

    switch (periodType) {
      case 'threeMonth':
        startMonth = endMonth - 2;
        startYear = endYear;
        if (startMonth < 0) {
          startMonth = 12 + startMonth;
          startYear = endYear - 1;
        }
        break;
      case 'sixMonth':
        startMonth = endMonth - 5;
        startYear = endYear;
        if (startMonth < 0) {
          startMonth = 12 + startMonth;
          startYear = endYear - 1;
        }
        break;
      case 'oneYear':
        startMonth = endMonth + 1;
        startYear = endYear - 1;
        if (startMonth > 11) {
          startMonth = 0;
        }
        break;
      default:
        startMonth = endMonth - 2;
        startYear = endYear;
    }

    const monthNames = [
      'Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun',
      'Jul', 'Agt', 'Sep', 'Okt', 'Nov', 'Des',
    ];

    return {
      bulan: `${monthNames[startMonth]} ${startYear}`,
      bulan1: `${monthNames[endMonth]} ${endYear}`,
    };
  },
  getApiParams: (user: UserProfile, periodValue: string) => {
    const dates = customerPageConfig.calculatePeriodDates(periodValue);

    const getCombomobValue = (period: string) => {
      switch (period) {
        case 'threeMonth': return '1';
        case 'sixMonth': return '2';
        case 'oneYear': return '3';
        default: return '1';
      }
    };

    return {
      a: user.app_id,
      reg: user.app_reg,
      jenis: '3',
      cari: '3',
      combomob: getCombomobValue(periodValue),
      bulan: dates.bulan,
      bulan1: dates.bulan1,
      proses: 'true',
      'akses[0]': true,
      'akses[1]': true,
      'akses[2]': true,
      'akses[3]': true,
      'akses[4]': true,
      date: getLocalDateString(),
    };
  },
};
