'use client';
import { useState, useEffect } from 'react';
import { Segmented, SegmentedButton, Preloader } from 'konsta/react';
import { obatChartItems, pembelianObatTerbanyak, obatTerlaris } from '@/lib/dummyData';
import StatCard from '@/components/StatCard';
import ChartCarousel from '@/components/ChartCarousel';
import RankedList from '@/components/RankedList';
import PageHeader from '@/components/PageHeader';
import { useFetch } from '@/lib/useFetch';
import { obatPageConfig } from '@/lib/apiConfigs';
import { useAuth } from '@/lib/authContext';
import { normalizeApiData, calculateSafePercentageChange, safeParseInt, generateSafeChartData } from '@/lib/utils';

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

  useEffect(() => {
    if (user) {
      refetch(obatPageConfig.getApiParams(user, activeTab));
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab, user]);

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
      icon: '💊',
      color: '#1A73E8',
      change: 0,
      invoiceCount: dataNilaiObat?.count ? `${dataNilaiObat.count} Obat` : '',
    },
    {
      label: 'Obat Expired',
      value: formatRupiah(dataObatExpired?.nilai || 0),
      icon: '⚠️',
      color: '#1A73E8',
      change: 0,
      invoiceCount: dataObatExpired?.count ? `${dataObatExpired.count} Obat` : '',
    },
    {
      label: 'Obat Stok Habis',
      value: dataObatStokHabis?.count ? `${dataObatStokHabis.count} Obat` : '0 Obat',
      icon: '📦',
      color: '#1A73E8',
      change: 0,
      invoiceCount: '',
    },
    {
      label: 'Obat Hilang',
      value: formatRupiah(nilaiObatHilang),
      icon: '🔍',
      color: '#1A73E8',
      change: parseFloat(obatHilangChange.value) * (obatHilangChange.isPositive ? 1 : -1),
      invoiceCount: dataObatStokHilang?.count ? `${dataObatStokHilang.count} Obat` : '0 Obat',
    },
  ];

  const chartData = normalizedData ? generateSafeChartData(normalizedData, activeTab === '1' ? 'today' : activeTab === '2' ? 'month' : 'year') : [];

  const pembelianObatTerbanyakData = normalizedData?.dataPengadaanObatTerbanyak?.ranking || [];
  const obatTerlarisData = normalizedData?.dataObatTerlaris || [];

  return (
    <>
      <PageHeader
        title="Obat"
        subtitle={`Data obat ${dateLabels[activeTab]}`}
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
                <StatCard key={i} label={stat.label} value={stat.value} change={stat.change} icon={stat.icon} color={stat.color} invoiceCount={stat.invoiceCount} />
              ))}
            </div>

            <ChartCarousel data={chartData} items={obatChartItems} title={dateLabels[activeTab]} />

            <RankedList title="Pembelian Obat Terbanyak" icon="🛒" color="#4CAF50"
              items={pembelianObatTerbanyakData.map((item: any, i: number) => ({ rank: i + 1, name: item.obatnama, satuan: item.satuan, jumlah: item.jumlah, nilai: 0 }))}
              type="obat" />

            <RankedList title="Obat Terlaris" icon="🔥" color="#FF5722"
              items={obatTerlarisData.map((item: any, i: number) => ({ rank: i + 1, name: item.obatnama, satuan: item.satuan, jumlah: item.jumlah, nilai: 0 }))}
              type="obat" />
          </div>
        )}
      </div>
    </>
  );
}
