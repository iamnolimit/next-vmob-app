'use client';
import { useState } from 'react';
import { Segmented, SegmentedButton } from 'konsta/react';
import { customerStats, customerChartData, customerChartItems } from '@/lib/dummyData';
import StatCard from '@/components/StatCard';
import ChartCarousel from '@/components/ChartCarousel';
import PageHeader from '@/components/PageHeader';

const tabs = [
  { label: '3 Bulan', value: 'tigaBulan' },
  { label: '6 Bulan', value: 'enamBulan' },
  { label: '1 Tahun', value: 'satTahun'  },
];

const dateLabels: Record<string, string> = {
  tigaBulan: '3 Bulan Terakhir',
  enamBulan: '6 Bulan Terakhir',
  satTahun:  '1 Tahun Terakhir',
};

export default function CustomerPage() {
  const [activeTab, setActiveTab] = useState('tigaBulan');
  const stats     = customerStats[activeTab as keyof typeof customerStats] ?? [];
  const chartData = customerChartData[activeTab] ?? [];

  return (
    <>
      <PageHeader
        title="Customer"
        subtitle={`Data customer ${dateLabels[activeTab]}`}
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
              <StatCard key={i} label={stat.label} value={stat.value} change={stat.change} icon={stat.icon} color={stat.color} invoiceCount={(stat as { invoiceCount?: string }).invoiceCount} />
            ))}
          </div>

          {/* Chart pertumbuhan pasien — dinamis sesuai periode */}
          <ChartCarousel
            key={activeTab}
            data={chartData}
            items={customerChartItems}
            title={dateLabels[activeTab]}
          />
        </div>
      </div>
    </>
  );
}
