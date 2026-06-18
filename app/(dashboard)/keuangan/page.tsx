'use client';
import { useState, useEffect } from 'react';
import { Segmented, SegmentedButton, Preloader } from 'konsta/react';
import { keuanganChartItems } from '@/lib/dummyData';
import StatCard from '@/components/StatCard';
import ChartCarousel from '@/components/ChartCarousel';
import PageHeader from '@/components/PageHeader';
import { useFetch } from '@/lib/useFetch';
import { keuanganPageConfig } from '@/lib/apiConfigs';
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

export default function KeuanganPage() {
  const [activeTab, setActiveTab] = useState('1');
  const { user } = useAuth();

  const { data: apiData, loading, refetch } = useFetch({
    endpoint: keuanganPageConfig.apiEndpoint,
    apiVersion: keuanganPageConfig.apiVersion,
    params: user ? keuanganPageConfig.getApiParams(user, activeTab) : {},
    isMutation: false,
  });

  useEffect(() => {
    if (user) {
      refetch(keuanganPageConfig.getApiParams(user, activeTab));
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab, user]);

  const normalizedData = normalizeApiData(apiData, 'finance');
  const data = normalizedData || {};

  // Normalize arrays
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const normalizeArray = (array: any) =>
    Array.isArray(array)
      ? array.map((item) => ({
          y: parseFloat(item?.y || 0),
          jmlfaktur: parseInt(item?.jmlfaktur || 0, 10),
        }))
      : [];

  const dataAset = normalizeArray(data.dataAset);
  const dataCash = normalizeArray(data.dataCash);
  const dataPasiva = normalizeArray(data.dataPasiva);
  const dataPendapatan = normalizeArray(data.dataPendapatan);
  const dataPengeluaran = normalizeArray(data.dataPengeluaran);
  const dataLabarugi = normalizeArray(data.dataLabarugi);
  const dataHutang = normalizeArray(data.dataHutang);
  const dataPiutang = normalizeArray(data.dataPiutang);
  const dataPiutangKlinik = normalizeArray(data.dataPiutangKlinik);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const getLastEntry = (array: any[]) => (array?.length > 0 ? array[array.length - 1] : null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const getPreviousEntry = (array: any[]) => (array?.length > 1 ? array[array.length - 2] : null);

  const latestAset = getLastEntry(dataAset);
  const prevAset = getPreviousEntry(dataAset);
  const latestCash = getLastEntry(dataCash);
  const prevCash = getPreviousEntry(dataCash);
  const latestPasiva = getLastEntry(dataPasiva);
  const prevPasiva = getPreviousEntry(dataPasiva);
  const latestPendapatan = getLastEntry(dataPendapatan);
  const prevPendapatan = getPreviousEntry(dataPendapatan);
  const latestPengeluaran = getLastEntry(dataPengeluaran);
  const prevPengeluaran = getPreviousEntry(dataPengeluaran);
  const latestLabarugi = getLastEntry(dataLabarugi);
  const prevLabarugi = getPreviousEntry(dataLabarugi);
  const latestHutang = getLastEntry(dataHutang);
  const prevHutang = getPreviousEntry(dataHutang);
  const latestPiutang = getLastEntry(dataPiutang);
  const prevPiutang = getPreviousEntry(dataPiutang);
  const latestPiutangKlinik = getLastEntry(dataPiutangKlinik);
  const prevPiutangKlinik = getPreviousEntry(dataPiutangKlinik);

  const cashChange = calculateSafePercentageChange(latestCash?.y, prevCash?.y);
  const pasivaChange = calculateSafePercentageChange(latestPasiva?.y, prevPasiva?.y);
  const pendapatanChange = calculateSafePercentageChange(latestPendapatan?.y, prevPendapatan?.y);
  const pengeluaranChange = calculateSafePercentageChange(latestPengeluaran?.y, prevPengeluaran?.y);
  const labarugiChange = calculateSafePercentageChange(latestLabarugi?.y, prevLabarugi?.y);
  const hutangChange = calculateSafePercentageChange(latestHutang?.y, prevHutang?.y);
  const piutangChange = calculateSafePercentageChange(latestPiutang?.y, prevPiutang?.y);
  const piutangKlinikChange = calculateSafePercentageChange(latestPiutangKlinik?.y, prevPiutangKlinik?.y);

  const totalAsetValue = latestAset?.y || 0;
  const prevTotalAsetValue = prevAset?.y || 0;
  const totalAsetChange = calculateSafePercentageChange(totalAsetValue, prevTotalAsetValue);

  const stats = [
    {
      label: 'Total Aset',
      value: formatRupiah(totalAsetValue),
      icon: '🏦',
      color: '#1A73E8',
      change: parseFloat(totalAsetChange.value) * (totalAsetChange.isPositive ? 1 : -1),
      invoiceCount: 'Total aset perusahaan',
    },
    {
      label: 'Total Cash',
      value: latestCash ? formatRupiah(latestCash.y || 0) : 'Rp 0',
      icon: '💵',
      color: '#1A73E8',
      change: parseFloat(cashChange.value) * (cashChange.isPositive ? 1 : -1),
      invoiceCount: 'Kas dan setara kas',
    },
    {
      label: 'Total Pasiva',
      value: latestPasiva ? formatRupiah(latestPasiva.y || 0) : 'Rp 0',
      icon: '⚖️',
      color: '#1A73E8',
      change: parseFloat(pasivaChange.value) * (pasivaChange.isPositive ? 1 : -1),
      invoiceCount: 'Total kewajiban',
    },
    {
      label: 'Total Pendapatan',
      value: latestPendapatan ? formatRupiah(latestPendapatan.y || 0) : 'Rp 0',
      icon: '📈',
      color: '#1A73E8',
      change: parseFloat(pendapatanChange.value) * (pendapatanChange.isPositive ? 1 : -1),
      invoiceCount: 'Pendapatan operasional',
    },
    {
      label: 'Total Pengeluaran',
      value: latestPengeluaran ? formatRupiah(latestPengeluaran.y || 0) : 'Rp 0',
      icon: '📉',
      color: '#1A73E8',
      change: parseFloat(pengeluaranChange.value) * (pengeluaranChange.isPositive ? 1 : -1),
      invoiceCount: 'Biaya operasional',
    },
    {
      label: 'Laba Rugi',
      value: latestLabarugi ? formatRupiah(latestLabarugi.y || 0) : 'Rp 0',
      icon: '📊',
      color: '#1A73E8',
      change: parseFloat(labarugiChange.value) * (labarugiChange.isPositive ? 1 : -1),
      invoiceCount: 'Laba bersih periode',
    },
    {
      label: 'Hutang Obat Jatuh Tempo',
      value: latestHutang ? formatRupiah(latestHutang.y || 0) : 'Rp 0',
      icon: '🧾',
      color: '#1A73E8',
      change: parseFloat(hutangChange.value) * (hutangChange.isPositive ? 1 : -1),
      invoiceCount: `${safeParseInt(latestHutang?.jmlfaktur, 0)} faktur`,
    },
    {
      label: 'Piutang Apotek Jatuh Tempo',
      value: latestPiutang ? formatRupiah(latestPiutang.y || 0) : 'Rp 0',
      icon: '📄',
      color: '#1A73E8',
      change: parseFloat(piutangChange.value) * (piutangChange.isPositive ? 1 : -1),
      invoiceCount: `${safeParseInt(latestPiutang?.jmlfaktur, 0)} faktur`,
    },
    {
      label: 'Piutang Klinik Jatuh Tempo',
      value: latestPiutangKlinik ? formatRupiah(latestPiutangKlinik.y || 0) : 'Rp 0',
      icon: '🏥',
      color: '#1A73E8',
      change: parseFloat(piutangKlinikChange.value) * (piutangKlinikChange.isPositive ? 1 : -1),
      invoiceCount: `${safeParseInt(latestPiutangKlinik?.jmlfaktur, 0)} faktur`,
    },
  ];

  const chartData = normalizedData ? generateSafeChartData(normalizedData, activeTab === '1' ? 'today' : activeTab === '2' ? 'month' : 'year') : [];

  return (
    <>
      <PageHeader
        title="Keuangan"
        subtitle={`Data keuangan ${dateLabels[activeTab]}`}
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

            <ChartCarousel data={chartData} items={keuanganChartItems} title={dateLabels[activeTab]} />
          </div>
        )}
      </div>
    </>
  );
}
