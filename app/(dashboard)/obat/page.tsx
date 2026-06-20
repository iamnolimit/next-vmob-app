'use client';
import { useState, useEffect } from 'react';
import { obatChartItems, pembelianObatTerbanyak, obatTerlaris } from '@/lib/dummyData';
import { Pill, AlertTriangle, Package, Search } from 'lucide-react';
import StatCard from '@/components/StatCard';
import ChartCarousel from '@/components/ChartCarousel';
import RankedList from '@/components/RankedList';
import PageHeader from '@/components/PageHeader';
import TabSelector from '@/components/TabSelector';
import { useFetch } from '@/lib/useFetch';
import { DashboardSkeleton } from '@/components/SkeletonLoader';
import { obatPageConfig } from '@/lib/apiConfigs';
import { useAuth } from '@/lib/authContext';
import { normalizeApiData, calculateSafePercentageChange, safeParseInt, generateSafeChartData } from '@/lib/utils';

import LiquidPullToRefresh from '@/components/LiquidPullToRefresh';

const tabs = [
  { label: 'Hari Ini',  value: '1'  },
  { label: 'Bulan Ini', value: '2' },
  { label: 'Tahun Ini', value: '3' },
];

const dateLabels: Record<string, string> = {
  '1':  'Hari Ini',
  '2': 'Bulan Ini',
  '3': 'Tahun Ini',
};

const formatRupiah = (amount: number) =>
  new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);

export default function ObatPage() {
  const [activeTab, setActiveTab] = useState('1');
  const { user } = useAuth();

  const { data: apiData, loading, refetch } = useFetch({
    endpoint: obatPageConfig.apiEndpoint,
    apiVersion: obatPageConfig.apiVersion,
    params: user ? obatPageConfig.getApiParams(user, activeTab) : {},
    isMutation: false,
  });

  // Fetch is driven by useFetch reacting to params changes (activeTab → params → paramsKey)

  const normalizedData = normalizeApiData(apiData, 'medicine');
  const { dataNilaiObat, dataObatExpired, dataObatStokHabis, dataObatStokHilang } = normalizedData || {};

  const stokHilangStats = dataObatStokHilang?.statistik || [];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const getLastEntry = (array: any[]) => (array?.length > 0 ? array[array.length - 1] : null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const getPreviousEntry = (array: any[]) => (array?.length > 1 ? array[array.length - 2] : null);

  const latestObatHilang = getLastEntry(stokHilangStats);
  const prevObatHilang = getPreviousEntry(stokHilangStats);

  const nilaiObatHilang = latestObatHilang?.total
    ? parseFloat(latestObatHilang.total)
    : dataObatStokHilang?.nilai || 0;

  const obatHilangChange = calculateSafePercentageChange(
    latestObatHilang?.total,
    prevObatHilang?.total
  );

  const stats = [
    {
      label: 'Nilai Stok Obat',
      value: formatRupiah(dataNilaiObat?.nilai || 0),
      icon: <Pill size={20} />,
      color: '#4f6dfa',
      change: 0,
      invoiceCount: dataNilaiObat?.count ? `${dataNilaiObat.count} Obat` : '',
    },
    {
      label: 'Obat Expired',
      value: formatRupiah(dataObatExpired?.nilai || 0),
      icon: <AlertTriangle size={20} />,
      color: '#4f6dfa',
      change: 0,
      invoiceCount: dataObatExpired?.count ? `${dataObatExpired.count} Obat` : '',
    },
    {
      label: 'Obat Stok Habis',
      value: dataObatStokHabis?.count ? `${dataObatStokHabis.count} Obat` : '0 Obat',
      icon: <Package size={20} />,
      color: '#4f6dfa',
      change: 0,
      invoiceCount: '',
    },
    {
      label: 'Obat Hilang',
      value: formatRupiah(nilaiObatHilang),
      icon: <Search size={20} />,
      color: '#4f6dfa',
      change: parseFloat(obatHilangChange.value) * (obatHilangChange.isPositive ? 1 : -1),
      invoiceCount: dataObatStokHilang?.count ? `${dataObatStokHilang.count} Obat` : '0 Obat',
    },
  ];

  const chartData = normalizedData ? generateSafeChartData(normalizedData, activeTab === '1' ? 'today' : activeTab === '2' ? 'month' : 'year') : [];

  const pembelianObatTerbanyakData = normalizedData?.dataPengadaanObatTerbanyak?.ranking || [];
  const obatTerlarisData = normalizedData?.dataObatTerlaris || [];

  return (
    <LiquidPullToRefresh
      onRefresh={async () => {
        await refetch();
      }}
      header={
        <PageHeader
          title="Obat"
          subtitle={`Data obat ${dateLabels[activeTab]}`}
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
          <DashboardSkeleton cardCount={4} />
        ) : (
          <div className="pb-4 animate-content-in">
            <div className="mt-4">
              <ChartCarousel data={chartData} items={obatChartItems} title={dateLabels[activeTab]} />
            </div>

            <div className="mt-6 grid grid-cols-1 gap-4 px-4">
              {stats.map((stat, i) => (
                <div key={i} className="mx-0 mb-0">
                  <StatCard label={stat.label} value={stat.value} change={stat.change} icon={stat.icon} color={stat.color} invoiceCount={stat.invoiceCount} />
                </div>
              ))}
            </div>

            <div className="mt-6">
              <RankedList title="Pembelian Obat Terbanyak" icon="🛒" color="#4CAF50"
                items={pembelianObatTerbanyakData.map((item: any, i: number) => ({ rank: i + 1, name: item.obatnama, satuan: item.satuan, jumlah: item.jumlah, nilai: 0 }))}
                type="obat" />
            </div>

            <div className="mt-6">
              <RankedList title="Obat Terlaris" icon="🔥" color="#FF5722"
                items={obatTerlarisData.map((item: any, i: number) => ({ rank: i + 1, name: item.obatnama, satuan: item.satuan, jumlah: item.jumlah, nilai: 0 }))}
                type="obat" />
            </div>
          </div>
        )}
      </div>
    </LiquidPullToRefresh>
  );
}
