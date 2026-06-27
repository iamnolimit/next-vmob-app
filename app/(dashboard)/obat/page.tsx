'use client';
import { useState } from 'react';
import { obatChartItems } from '@/lib/dummyData';
import { Icon } from '@iconify/react';
import StatCard from '@/components/StatCard';
import ChartCarousel from '@/components/ChartCarousel';
import RankedList from '@/components/RankedList';
import PageHeader from '@/components/PageHeader';
import TabSelector from '@/components/TabSelector';
import { useFetch } from '@/lib/useFetch';
import { DashboardSkeleton } from '@/components/SkeletonLoader';
import { obatPageConfig } from '@/lib/apiConfigs';
import { useAuth } from '@/lib/authContext';
import { normalizeApiData, generateSafeChartData } from '@/lib/utils';

import LiquidPullToRefresh from '@/components/LiquidPullToRefresh';

const tabs = [
  { label: 'Hari Ini',  value: '1'  },
  { label: 'Bulan Ini', value: '2' },
  { label: 'Tahun Ini', value: '3' },
];

const getDateLabel = (tab: string): string => {
  const now = new Date();
  const day = now.getDate();
  const month = now.toLocaleDateString('id-ID', { month: 'long' });
  const year = now.getFullYear();
  if (tab === '1') return `${day} ${month} ${year}`;
  if (tab === '2') return `${month} ${year}`;
  return `${year}`;
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

  const apiParams = user ? obatPageConfig.getApiParams(user, activeTab) : {};
  console.log('[ObatPage] activeTab:', activeTab, 'params:', JSON.stringify(apiParams));

  const { data: apiData, loading, refetch } = useFetch({
    endpoint: obatPageConfig.apiEndpoint,
    apiVersion: obatPageConfig.apiVersion,
    params: apiParams,
    isMutation: false,
  });

  // Fetch is driven by useFetch reacting to params changes (activeTab → params → paramsKey)

  const normalizedData = normalizeApiData(apiData, 'medicine');
  const { dataNilaiObat, dataObatExpired, dataObatStokHabis, dataObatStokHilang } = normalizedData || {};

  // Use peningkatan from API directly for change indicators
  const nilaiObatChange = dataNilaiObat?.peningkatan ?? 0;
  const expiredChange = dataObatExpired?.peningkatan ?? 0;
  const stokHabisChange = dataObatStokHabis?.peningkatan ?? 0;
  const obatHilangPeningkatan = dataObatStokHilang?.peningkatan ?? 0;

  // Obat Hilang: use nilai directly from API (not from statistik last entry)
  const nilaiObatHilang = dataObatStokHilang?.nilai || 0;

  const stats = [
    {
      label: 'Nilai Stok Obat',
      value: formatRupiah(dataNilaiObat?.nilai || 0),
      icon: <Icon icon="material-symbols:medication" width={20} height={20} />,
      color: 'var(--primary-accent)',
      invoiceCount: dataNilaiObat?.count ? `${dataNilaiObat.count} Obat` : '',
    },
    {
      label: 'Obat Expired',
      value: dataObatExpired?.count ? `${dataObatExpired.count} Obat` : '0 Obat',
      icon: <Icon icon="material-symbols:warning" width={20} height={20} />,
      color: 'var(--primary-accent)',
      invoiceCount: '',
    },
    {
      label: 'Obat Stok Habis',
      value: dataObatStokHabis?.count ? `${dataObatStokHabis.count} Obat` : '0 Obat',
      icon: <Icon icon="material-symbols:inventory-2" width={20} height={20} />,
      color: 'var(--primary-accent)',
      invoiceCount: '',
    },
    {
      label: 'Obat Hilang',
      value: formatRupiah(nilaiObatHilang),
      icon: <Icon icon="material-symbols:search-off" width={20} height={20} />,
      color: 'var(--primary-accent)',
      change: -obatHilangPeningkatan,
      invoiceCount: dataObatStokHilang?.count ? `${dataObatStokHilang.count} Obat` : '0 Obat',
    },
  ];

  const chartData = normalizedData ? generateSafeChartData(normalizedData, activeTab === '1' ? 'today' : activeTab === '2' ? 'month' : 'year') : [];

  const pembelianObatTerbanyakData = normalizedData?.dataPengadaanObatTerbanyak?.ranking || [];
  const obatTerlarisData = normalizedData?.dataObatTerlaris || [];
  const currentDateLabel = getDateLabel(activeTab);

  return (
    <LiquidPullToRefresh
      onRefresh={async () => {
        await refetch();
      }}
      header={
        <PageHeader
          title="Dashboard Obat"
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
          <DashboardSkeleton cardCount={4} />
        ) : (
          <div className="pb-4 animate-content-in">
            <div className="mt-4">
              <ChartCarousel data={chartData} items={obatChartItems} title={currentDateLabel} />
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
                items={pembelianObatTerbanyakData.map((item: any, i: number) => ({ rank: i + 1, name: item.obatnama, satuan: item.satuan, jumlah: item.jumlah }))}
                type="obat" />
            </div>

            <div className="mt-6">
              <RankedList title="Obat Terlaris" icon="🔥" color="#FF5722"
                items={obatTerlarisData.map((item: any, i: number) => ({ rank: i + 1, name: item.obatnama, satuan: item.satuan, jumlah: item.jumlah }))}
                type="obat" />
            </div>
          </div>
        )}
      </div>
    </LiquidPullToRefresh>
  );
}
