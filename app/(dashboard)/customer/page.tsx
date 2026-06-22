'use client';
import { useState } from 'react';
import { customerChartItems } from '@/lib/dummyData';
import { Icon } from '@iconify/react';
import StatCard from '@/components/StatCard';
import ChartCarousel from '@/components/ChartCarousel';
import PageHeader from '@/components/PageHeader';
import TabSelector from '@/components/TabSelector';
import { useFetch } from '@/lib/useFetch';
import { DashboardSkeleton } from '@/components/SkeletonLoader';
import { customerPageConfig } from '@/lib/apiConfigs';
import { useAuth } from '@/lib/authContext';
import { normalizeApiData, generateCustomerSafeChartData, calculateSafePercentageChange } from '@/lib/utils';

import LiquidPullToRefresh from '@/components/LiquidPullToRefresh';

const tabs = [
  { label: '3 Bulan', value: 'threeMonth' },
  { label: '6 Bulan', value: 'sixMonth' },
  { label: '1 Tahun', value: 'oneYear'  },
];

const getDateLabel = (tab: string): string => {
  const dates = customerPageConfig.calculatePeriodDates(tab);
  return `${dates.bulan} - ${dates.bulan1}`;
};

const formatCount = (n: number) =>
  new Intl.NumberFormat('id-ID', { minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(n);

export default function CustomerPage() {
  const [activeTab, setActiveTab] = useState('threeMonth');
  const { user } = useAuth();

  const { data: apiData, loading, refetch } = useFetch({
    endpoint: customerPageConfig.apiEndpoint,
    apiVersion: customerPageConfig.apiVersion,
    params: user ? customerPageConfig.getApiParams(user, activeTab) : {},
    isMutation: false,
  });

  const normalizedData = normalizeApiData(apiData, 'customer');
  const data = normalizedData || {};

  const databulanan: any[] = data.databulanan || [];
  const datapasienbaru = data.datapasienbaru || {};
  const datakunjungan = data.datakunjungan || {};

  // Find latest month with data, then previous month for change calculation
  let latestIdx = databulanan.length - 1;
  for (let i = databulanan.length - 1; i >= 0; i--) {
    if (databulanan[i]?.total > 0) { latestIdx = i; break; }
  }
  const latestData = databulanan[latestIdx] || {};
  const prevData = latestIdx > 0 ? databulanan[latestIdx - 1] : {};

  const loyalChange      = calculateSafePercentageChange(latestData.paretoA,       prevData.paretoA);
  const potensialChange  = calculateSafePercentageChange(latestData.paretoB,       prevData.paretoB);
  const prospekChange    = calculateSafePercentageChange(latestData.paretoC,       prevData.paretoC);
  const belumChange      = calculateSafePercentageChange(latestData.paretoD,       prevData.paretoD);
  const totalChange      = calculateSafePercentageChange(latestData.totalcustomer, prevData.totalcustomer);

  const pasienBaruChange = {
    value: Math.abs(datapasienbaru.peningkatan || 0),
    isPositive: (datapasienbaru.peningkatan || 0) >= 0,
  };
  const kunjunganChange = {
    value: Math.abs(datakunjungan.peningkatan || 0),
    isPositive: (datakunjungan.peningkatan || 0) >= 0,
  };

  const stats = [
    {
      label: 'Loyal Customer Bulan Ini',
      value: `${formatCount(latestData.paretoA || 0)} Pelanggan`,
      icon: <Icon icon="material-symbols:star" width={20} height={20} />,
      color: 'var(--primary-accent)',
      change: loyalChange.isPositive ? Number(loyalChange.value) : -Number(loyalChange.value),
    },
    {
      label: 'Potensial Customer Bulan Ini',
      value: `${formatCount(latestData.paretoB || 0)} Pelanggan`,
      icon: <Icon icon="material-symbols:trending-up" width={20} height={20} />,
      color: 'var(--primary-accent)',
      change: potensialChange.isPositive ? Number(potensialChange.value) : -Number(potensialChange.value),
    },
    {
      label: 'Prospek Customer Bulan Ini',
      value: `${formatCount(latestData.paretoC || 0)} Pelanggan`,
      icon: <Icon icon="material-symbols:person-add" width={20} height={20} />,
      color: 'var(--primary-accent)',
      change: prospekChange.isPositive ? Number(prospekChange.value) : -Number(prospekChange.value),
    },
    {
      label: 'Belum Prospek Bulan Ini',
      value: `${formatCount(latestData.paretoD || 0)} Pelanggan`,
      icon: <Icon icon="material-symbols:person-outline" width={20} height={20} />,
      color: 'var(--primary-accent)',
      change: belumChange.isPositive ? Number(belumChange.value) : -Number(belumChange.value),
    },
    {
      label: 'Total Customer Bulan Ini',
      value: `${formatCount(latestData.totalcustomer || 0)} Pelanggan`,
      icon: <Icon icon="material-symbols:group" width={20} height={20} />,
      color: 'var(--primary-accent)',
      change: totalChange.isPositive ? Number(totalChange.value) : -Number(totalChange.value),
    },
    {
      label: 'Pasien Baru Bulan Ini',
      value: `${formatCount(datapasienbaru.count || 0)} Pelanggan`,
      icon: <Icon icon="material-symbols:person-add-outline" width={20} height={20} />,
      color: 'var(--primary-accent)',
      change: pasienBaruChange.isPositive ? pasienBaruChange.value : -pasienBaruChange.value,
    },
    {
      label: 'Kunjungan Pasien Bulan Ini',
      value: `${formatCount(datakunjungan.count || 0)} Pelanggan`,
      icon: <Icon icon="material-symbols:local-hospital" width={20} height={20} />,
      color: 'var(--primary-accent)',
      change: kunjunganChange.isPositive ? kunjunganChange.value : -kunjunganChange.value,
    },
  ];

  const chartData = generateCustomerSafeChartData(data);
  const currentDateLabel = getDateLabel(activeTab);

  return (
    <LiquidPullToRefresh
      onRefresh={async () => {
        await refetch();
      }}
      header={
        <PageHeader
          title="Dashboard Customer"
          subtitle={`Berikut adalah laporan data ${currentDateLabel}`}
          subnavbar={
            <TabSelector 
              tabs={tabs} 
              activeTab={activeTab} 
              onChange={setActiveTab} 
            />
          }
        />
      }
      className="flex-1"
    >
      <div className="flex-1 overflow-y-auto pb-6">
        {loading ? (
          <DashboardSkeleton cardCount={7} />
        ) : (
          <div className="pb-4 animate-content-in">
            <div className="mt-4">
              <ChartCarousel
                key={activeTab}
                data={chartData}
                items={customerChartItems}
                title={currentDateLabel}
              />
            </div>

            <div className="mt-6 grid grid-cols-1 gap-4 px-4">
              {stats.map((stat, i) => (
                <div key={i} className="mx-0 mb-0">
                  <StatCard label={stat.label} value={stat.value} change={stat.change} icon={stat.icon} color={stat.color} />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </LiquidPullToRefresh>
  );
}
