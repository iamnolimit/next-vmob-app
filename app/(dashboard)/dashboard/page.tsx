'use client';
import { useState, useEffect } from 'react';
import { Segmented, SegmentedButton, Preloader } from 'konsta/react';
import { dashboardChartItems } from '@/lib/dummyData';
import StatCard from '@/components/StatCard';
import ChartCarousel from '@/components/ChartCarousel';
import PageHeader from '@/components/PageHeader';
import { useFetch } from '@/lib/useFetch';
import { dashboardPageConfig } from '@/lib/apiConfigs';
import { useAuth } from '@/lib/authContext';
import { normalizeApiData, calculateSafePercentageChange, safeParseInt, generateSafeChartData } from '@/lib/utils';

const tabs = [
  { label: 'Hari Ini',  value: '1'  },
  { label: 'Bulan Ini', value: '2' },
  { label: 'Tahun Ini', value: '3' },
];

const formatRupiah = (amount: number) =>
  new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState('1');
  const { user } = useAuth();

  const { data: apiData, loading, refetch } = useFetch({
    endpoint: dashboardPageConfig.apiEndpoint,
    apiVersion: dashboardPageConfig.apiVersion,
    params: user ? dashboardPageConfig.getApiParams(user, activeTab) : {},
    isMutation: false,
  });

  useEffect(() => {
    if (user) {
      refetch(dashboardPageConfig.getApiParams(user, activeTab));
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab, user]);

  const normalizedData = normalizeApiData(apiData, 'dashboard');
  
  const { penjualanVmart, pembayaranKasir, pendapatanHC, totalPendapatan, penjualanUmum } = normalizedData || {};

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const getLastEntry = (array: any[]) => (array?.length > 0 ? array[array.length - 1] : null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const getPreviousEntry = (array: any[]) => (array?.length > 1 ? array[array.length - 2] : null);

  const latestPenjualanKasir = getLastEntry(penjualanUmum);
  const prevPenjualanKasir = getPreviousEntry(penjualanUmum);
  const latestPenjualanOnline = getLastEntry(penjualanVmart);
  const prevPenjualanOnline = getPreviousEntry(penjualanVmart);
  const latestPemeriksaanKlinik = getLastEntry(pembayaranKasir);
  const prevPemeriksaanKlinik = getPreviousEntry(pembayaranKasir);
  const latestPendapatanHC = getLastEntry(pendapatanHC);
  const prevPendapatanHC = getPreviousEntry(pendapatanHC);
  const latestTotalPendapatan = getLastEntry(totalPendapatan);
  const prevTotalPendapatan = getPreviousEntry(totalPendapatan);

  const totalPendapatanChange = calculateSafePercentageChange(latestTotalPendapatan?.grandtotal, prevTotalPendapatan?.grandtotal);
  const penjualanKasirChange = calculateSafePercentageChange(latestPenjualanKasir?.grandtotal, prevPenjualanKasir?.grandtotal);
  const penjualanOnlineChange = calculateSafePercentageChange(latestPenjualanOnline?.grandtotal, prevPenjualanOnline?.grandtotal);
  const pemeriksaanKlinikChange = calculateSafePercentageChange(latestPemeriksaanKlinik?.grandtotal, prevPemeriksaanKlinik?.grandtotal);
  const pendapatanHCChange = calculateSafePercentageChange(latestPendapatanHC?.grandtotal, prevPendapatanHC?.grandtotal);

  const stats = [
    {
      label: 'Penjualan Kasir',
      value: latestPenjualanKasir ? formatRupiah(latestPenjualanKasir.grandtotal || 0) : 'Rp 0',
      icon: '🏪',
      color: '#FF9800',
      change: parseFloat(penjualanKasirChange.value) * (penjualanKasirChange.isPositive ? 1 : -1),
      invoiceCount: `${safeParseInt(latestPenjualanKasir?.jumfaktur, 0)} faktur`,
    },
    {
      label: 'Penjualan Online',
      value: latestPenjualanOnline ? formatRupiah(latestPenjualanOnline.grandtotal || 0) : 'Rp 0',
      icon: '🛒',
      color: '#4CAF50',
      change: parseFloat(penjualanOnlineChange.value) * (penjualanOnlineChange.isPositive ? 1 : -1),
      invoiceCount: `${safeParseInt(latestPenjualanOnline?.jumfaktur, 0)} faktur`,
    },
    {
      label: 'Pemeriksaan Klinik',
      value: latestPemeriksaanKlinik ? formatRupiah(latestPemeriksaanKlinik.grandtotal || 0) : 'Rp 0',
      icon: '🏥',
      color: '#9C27B0',
      change: parseFloat(pemeriksaanKlinikChange.value) * (pemeriksaanKlinikChange.isPositive ? 1 : -1),
      invoiceCount: `${safeParseInt(latestPemeriksaanKlinik?.jumfaktur, 0)} faktur`,
    },
    {
      label: 'Pendapatan HomeCare',
      value: latestPendapatanHC ? formatRupiah(latestPendapatanHC.grandtotal || 0) : 'Rp 0',
      icon: '🏠',
      color: '#F44336',
      change: parseFloat(pendapatanHCChange.value) * (pendapatanHCChange.isPositive ? 1 : -1),
      invoiceCount: `${safeParseInt(latestPendapatanHC?.jumfaktur, 0)} faktur`,
    },
    {
      label: 'Total Pendapatan',
      value: latestTotalPendapatan ? formatRupiah(latestTotalPendapatan.grandtotal || 0) : 'Rp 0',
      icon: '💰',
      color: '#2196F3',
      change: parseFloat(totalPendapatanChange.value) * (totalPendapatanChange.isPositive ? 1 : -1),
      invoiceCount: `${safeParseInt(latestTotalPendapatan?.jumfaktur, 0)} faktur`,
    },
  ];

  const chartData = normalizedData ? generateSafeChartData(normalizedData, activeTab === '1' ? 'today' : activeTab === '2' ? 'month' : 'year') : [];

  const dateLabels: Record<string, string> = {
    '1':  'Hari Ini',
    '2': 'Bulan Ini',
    '3': 'Tahun Ini',
  };

  return (
    <>
      <PageHeader
        title="Dashboard"
        subtitle={`Data ${dateLabels[activeTab]}`}
        subnavbar={
          <Segmented strong>
            {tabs.map((tab) => (
              <SegmentedButton
                key={tab.value}
                active={activeTab === tab.value}
                onClick={() => setActiveTab(tab.value)}
              >
                {tab.label}
              </SegmentedButton>
            ))}
          </Segmented>
        }
      />

      <div className="flex-1 overflow-y-auto pb-6">
        {loading ? (
          <div className="flex justify-center items-center h-40">
            <Preloader />
          </div>
        ) : (
          <div className="pb-4">
            <div className="mt-4">
              {stats.map((stat, i) => (
                <StatCard
                  key={i}
                  label={stat.label}
                  value={stat.value}
                  change={stat.change}
                  icon={stat.icon}
                  color={stat.color}
                  invoiceCount={stat.invoiceCount}
                />
              ))}
            </div>

            <ChartCarousel data={chartData} items={dashboardChartItems} title={dateLabels[activeTab]} />
          </div>
        )}
      </div>
    </>
  );
}
