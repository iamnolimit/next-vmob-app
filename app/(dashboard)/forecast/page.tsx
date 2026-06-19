'use client';
import { useState, useEffect } from 'react';
import { forecastChartItems, katlarisData } from '@/lib/dummyData';
import { Star, StarHalf, Sparkles, AlertTriangle, Package, TrendingUp, TrendingDown, CircleDollarSign } from 'lucide-react';
import StatCard from '@/components/StatCard';
import ChartCarousel from '@/components/ChartCarousel';
import RankedList from '@/components/RankedList';
import PageHeader from '@/components/PageHeader';
import TabSelector from '@/components/TabSelector';
import { useFetch } from '@/lib/useFetch';
import { forecastPageConfig } from '@/lib/apiConfigs';
import { useAuth } from '@/lib/authContext';
import { normalizeApiData, generateForecastSafeChartData } from '@/lib/utils';

const tabs = [
  { label: '3 Bulan', value: 'threeMonth' },
  { label: '6 Bulan', value: 'sixMonth' },
  { label: '1 Tahun', value: 'oneYear'  },
];

const dateLabels: Record<string, string> = {
  threeMonth: '3 Bulan ke Depan',
  sixMonth: '6 Bulan ke Depan',
  oneYear:  '1 Tahun ke Depan',
};

const formatRupiah = (amount: number) =>
  new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);

export default function ForecastPage() {
  const [activeTab, setActiveTab] = useState('threeMonth');
  const { user } = useAuth();

  const { data: apiData, loading, refetch } = useFetch({
    endpoint: forecastPageConfig.apiEndpoint,
    apiVersion: forecastPageConfig.apiVersion,
    params: user ? forecastPageConfig.getApiParams(user, activeTab) : {},
    isMutation: false,
  });

  useEffect(() => {
    if (user) {
      refetch(forecastPageConfig.getApiParams(user, activeTab));
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab, user]);

  const normalizedData = normalizeApiData(apiData, 'forecast');
  const data = normalizedData || {};

  const stats = [
    {
      label: 'Pareto A',
      value: formatRupiah(data.nominalParetoA || 0),
      invoiceCount: `${data.paretoA || 0} Obat`,
      icon: <Star size={20} />,
      color: '#1A73E8',
      change: data.paA || 0,
    },
    {
      label: 'Pareto B',
      value: formatRupiah(data.nominalParetoB || 0),
      invoiceCount: `${data.paretoB || 0} Obat`,
      icon: <StarHalf size={20} />,
      color: '#1A73E8',
      change: data.paB || 0,
    },
    {
      label: 'Pareto C',
      value: formatRupiah(data.nominalParetoC || 0),
      invoiceCount: `${data.paretoC || 0} Obat`,
      icon: <Sparkles size={20} />,
      color: '#1A73E8',
      change: data.paC || 0,
    },
    {
      label: 'Dibawah Pareto C (Stok Mati)',
      value: formatRupiah(data.nominalParetoMin || 0),
      invoiceCount: `${data.paretoMin || 0} Obat`,
      icon: <AlertTriangle size={20} />,
      color: '#1A73E8',
      change: data.paMin || 0,
    },
    {
      label: 'Stock On Hand',
      value: formatRupiah(data.pengadaan1 || 0),
      invoiceCount: `${data.status1 || 0} Obat`,
      icon: <Package size={20} />,
      color: '#1A73E8',
      change: data.pStatus1 || 0,
    },
    {
      label: 'Over Stock',
      value: formatRupiah(data.pengadaan2 || 0),
      invoiceCount: `${data.status2 || 0} Obat`,
      icon: <TrendingUp size={20} />,
      color: '#1A73E8',
      change: data.pStatus2 || 0,
    },
    {
      label: 'Under Stock',
      value: formatRupiah(data.pengadaan3 || 0),
      invoiceCount: `${data.status3 || 0} Obat`,
      icon: <TrendingDown size={20} />,
      color: '#1A73E8',
      change: data.pStatus3 || 0,
    },
    {
      label: 'Potential Lost',
      value: formatRupiah(data.pengadaan4 || 0),
      invoiceCount: `${data.status4 || 0} Obat`,
      icon: <CircleDollarSign size={20} />,
      color: '#1A73E8',
      change: data.pStatus4 || 0,
    },
  ];

  const chartData = generateForecastSafeChartData(data);

  const paretoChartData = chartData.filter(d => d.paretoAnalysis !== undefined && d.name.includes('Pareto'));
  const statusChartData = chartData.filter(d => d.statusPengadaan !== undefined && !d.name.includes('Pareto'));

  const katlarisDataApi = (() => {
    if (!data.katlaris) return [];
    let result = [];
    if (Array.isArray(data.katlaris)) {
      result = data.katlaris.map((item: any) => ({
        name: item.nama || item.name || 'Unknown',
        persen: Number(parseFloat(item.persen || item.percentage || 0).toFixed(2)),
        nilai: item.y || item.value || item.amount || 0
      }));
    } else {
      result = Object.entries(data.katlaris).map(([key, value]: [string, any]) => ({
        name: value?.nama || key,
        persen: Number(parseFloat(value?.persen || value?.percentage || 0).toFixed(2)),
        nilai: value?.y || value?.value || value?.amount || 0
      }));
    }
    return result.slice(0, 5);
  })();

  return (
    <>
      <PageHeader
        title="Forecast"
        subtitle={`Proyeksi ${dateLabels[activeTab]}`}
        subnavbar={
          <TabSelector 
            tabs={tabs} 
            activeTab={activeTab} 
            onChange={setActiveTab} 
          />
        }
      />

      <div className="flex-1 overflow-y-auto pb-6">
        {loading ? (
          <div className="flex justify-center items-center h-40">
            <div className="w-8 h-8 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
          </div>
        ) : (
          <div className="pb-4">
            <div className="mt-4">
              <ChartCarousel
                data={paretoChartData}
                dataByChart={[
                  paretoChartData,
                  statusChartData,
                ]}
                items={forecastChartItems}
                title="Analisis Periode"
              />
            </div>

            <div className="mt-6 grid grid-cols-1 gap-4 px-4">
              {stats.map((stat, i) => (
                <div key={i} className="mx-0 mb-0">
                  <StatCard label={stat.label} value={stat.value} change={stat.change} icon={stat.icon} color={stat.color} invoiceCount={stat.invoiceCount} />
                </div>
              ))}
            </div>

            <div className="mt-6">
              <RankedList title="Kategori Obat Terlaris" icon="📊" color="#1d4ed8"
                items={katlarisDataApi.map((item: any, i: number) => ({ rank: i + 1, name: item.name, persen: item.persen, nilai: item.nilai }))}
                type="katlaris" />
            </div>
          </div>
        )}
      </div>
    </>
  );
}
