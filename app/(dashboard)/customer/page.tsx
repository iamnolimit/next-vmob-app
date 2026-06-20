'use client';
import { useState, useEffect } from 'react';
import { customerChartItems } from '@/lib/dummyData';
import { UserPlus, Users } from 'lucide-react';
import StatCard from '@/components/StatCard';
import ChartCarousel from '@/components/ChartCarousel';
import PageHeader from '@/components/PageHeader';
import TabSelector from '@/components/TabSelector';
import { useFetch } from '@/lib/useFetch';
import { DashboardSkeleton } from '@/components/SkeletonLoader';
import { customerPageConfig } from '@/lib/apiConfigs';
import { useAuth } from '@/lib/authContext';
import { normalizeApiData, generateCustomerSafeChartData } from '@/lib/utils';

import LiquidPullToRefresh from '@/components/LiquidPullToRefresh';

const tabs = [
  { label: '3 Bulan', value: 'threeMonth' },
  { label: '6 Bulan', value: 'sixMonth' },
  { label: '1 Tahun', value: 'oneYear'  },
];

const dateLabels: Record<string, string> = {
  threeMonth: '3 Bulan Terakhir',
  sixMonth: '6 Bulan Terakhir',
  oneYear:  '1 Tahun Terakhir',
};

export default function CustomerPage() {
  const [activeTab, setActiveTab] = useState('threeMonth');
  const { user } = useAuth();

  const { data: apiData, loading, refetch } = useFetch({
    endpoint: customerPageConfig.apiEndpoint,
    apiVersion: customerPageConfig.apiVersion,
    params: user ? customerPageConfig.getApiParams(user, activeTab) : {},
    isMutation: false,
  });

  // Fetch is driven by useFetch reacting to params changes (activeTab → params → paramsKey)

  const normalizedData = normalizeApiData(apiData, 'customer');
  const data = normalizedData || {};

  const datapasienbaru = data.datapasienbaru || {};
  const datakunjungan = data.datakunjungan || {};

  const stats = [
    {
      label: 'Pasien Baru',
      value: `${datapasienbaru.count || 0} Orang`,
      icon: <UserPlus size={20} />,
      color: '#4f6dfa',
      change: datapasienbaru.peningkatan || 0,
    },
    {
      label: 'Kunjungan Pasien',
      value: `${datakunjungan.count || 0} Orang`,
      icon: <Users size={20} />,
      color: '#4f6dfa',
      change: datakunjungan.peningkatan || 0,
    },
  ];

  const chartData = generateCustomerSafeChartData(data);

  return (
    <LiquidPullToRefresh
      onRefresh={async () => {
        await refetch();
      }}
      header={
        <PageHeader
          title="Customer"
          subtitle={`Data customer ${dateLabels[activeTab]}`}
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
          <DashboardSkeleton cardCount={2} />
        ) : (
          <div className="pb-4 animate-content-in">
            {/* Chart pertumbuhan pasien — dinamis sesuai periode */}
            <div className="mt-4">
              <ChartCarousel
                key={activeTab}
                data={chartData}
                items={customerChartItems}
                title={dateLabels[activeTab]}
              />
            </div>

            <div className="mt-6 grid grid-cols-1 gap-4 px-4">
              {stats.map((stat, i) => (
                <div key={i} className="mx-0 mb-0">
                  <StatCard key={i} label={stat.label} value={stat.value} change={stat.change} icon={stat.icon} color={stat.color} invoiceCount={(stat as { invoiceCount?: string }).invoiceCount} />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </LiquidPullToRefresh>
  );
}
