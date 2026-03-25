'use client';
import { useState } from 'react';
import { Segmented, SegmentedButton } from 'konsta/react';
import { dashboardStats, dashboardChartData, dashboardChartItems } from '@/lib/dummyData';
import StatCard from '@/components/StatCard';
import ChartCarousel from '@/components/ChartCarousel';
import PageHeader from '@/components/PageHeader';

const tabs = [
  { label: 'Hari Ini',  value: 'hariIni'  },
  { label: 'Bulan Ini', value: 'bulanIni' },
  { label: 'Tahun Ini', value: 'tahunIni' },
];

const dateLabels: Record<string, string> = {
  hariIni:  '23 Maret 2024',
  bulanIni: 'Maret 2024',
  tahunIni: 'Tahun 2024',
};

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState('hariIni');
  const stats = dashboardStats[activeTab as keyof typeof dashboardStats] ?? [];

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
                invoiceCount={(stat as { invoiceCount?: string }).invoiceCount}
              />
            ))}
          </div>

          <ChartCarousel data={dashboardChartData} items={dashboardChartItems} title="Minggu Ini" />
        </div>
      </div>
    </>
  );
}
