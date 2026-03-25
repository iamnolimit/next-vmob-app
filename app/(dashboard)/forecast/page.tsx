'use client';
import { useState } from 'react';
import { Segmented, SegmentedButton } from 'konsta/react';
import { forecastStats, forecastChartData, forecastChartItems, katlarisData } from '@/lib/dummyData';
import StatCard from '@/components/StatCard';
import ChartCarousel from '@/components/ChartCarousel';
import RankedList from '@/components/RankedList';
import PageHeader from '@/components/PageHeader';

const tabs = [
  { label: '3 Bulan', value: 'tigaBulan' },
  { label: '6 Bulan', value: 'enamBulan' },
  { label: '1 Tahun', value: 'satTahun'  },
];

const dateLabels: Record<string, string> = {
  tigaBulan: '3 Bulan ke Depan',
  enamBulan: '6 Bulan ke Depan',
  satTahun:  '1 Tahun ke Depan',
};

export default function ForecastPage() {
  const [activeTab, setActiveTab] = useState('tigaBulan');
  const stats = forecastStats[activeTab as keyof typeof forecastStats] ?? [];

  return (
    <>
      <PageHeader
        title="Forecast"
        subtitle={`Proyeksi ${dateLabels[activeTab]}`}
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

          <ChartCarousel
            data={forecastChartData.paretoAnalysis}
            dataByChart={[
              forecastChartData.paretoAnalysis,
              forecastChartData.statusPengadaan,
            ]}
            items={forecastChartItems}
            title="Analisis Periode"
          />

          <RankedList title="Kategori Obat Terlaris" icon="📊" color="#1d4ed8"
            items={katlarisData.map((item, i) => ({ rank: i + 1, name: item.name, persen: item.persen, nilai: item.nilai }))}
            type="katlaris" />
        </div>
      </div>
    </>
  );
}
