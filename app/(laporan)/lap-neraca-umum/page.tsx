'use client';
import { useState, useEffect, useCallback } from 'react';
import LaporanHeader from '@/components/LaporanHeader';
import LiquidPullToRefresh from '@/components/LiquidPullToRefresh';
import { ListSkeleton } from '@/components/SkeletonLoader';
import SelectInput from '@/components/SelectInput';
import DatePickerInput from '@/components/DatePickerInput';
import { formatNumber, cabangOptions } from '@/lib/dummyData';
import { exportSectionedToPdf, exportSectionedToExcel } from '@/lib/exportUtils';
import { useAuth } from '@/lib/authContext';
import { useReportData } from '@/lib/useReportData';

const fmt = (n: number) => formatNumber(n);
const today = new Date();
const toISO = (d: Date) => d.toISOString().slice(0, 10);
const months = ['Jan','Feb','Mar','Apr','Mei','Jun','Jul','Agt','Sep','Okt','Nov','Des'];
const fmtDate = (iso: string) => {
  const [y, m, d] = iso.split('-');
  return `${d} ${months[Number(m) - 1]} ${y}`;
};

export default function LapNeracaUmumPage() {
  const { user } = useAuth();
  const namaKlinik = user?.cabang ?? 'Vmedis Mobile';
  const [showFilter, setShowFilter] = useState(false);
  const [showExportMenu, setShowExportMenu] = useState(false);
  const [perDate, setPerDate] = useState(toISO(today));
  const [appliedDate, setAppliedDate] = useState(toISO(today));
  const [selectedCabang, setSelectedCabang] = useState(cabangOptions[0].value);
  const [appliedCabang, setAppliedCabang] = useState(cabangOptions[0].value);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const apiNormalizer = useCallback((rawData: any) => {
    if (rawData?.status === 1) {
      return [rawData];
    }
    return [];
  }, []);

  const { data, refetch } = useReportData({
    apiEndpoint: 'laporanneracanormal/laporan-v2',
    apiVersion: 'api5',
    apiParams: {
      cari: 4,
      bulan: '',
      tahun: '',
      tglAwal: '',
      tglAkhir: '',
      carimobile: '',
      sorting: '',
      limit: 1000,
      offset: 0,
      mn_jenis: 4,
      reg: 'db',
      app_jenis: '',
    },
    apiNormalizer,
  });

  useEffect(() => {
    const formatDate = (isoDate: string) => {
      if (!isoDate) return '';
      const [y, m, d] = isoDate.split('-');
      return `${d} ${months[Number(m) - 1]} ${y}`;
    };

    const [y, m] = appliedDate.split('-');
    const bulan = `${months[Number(m) - 1]} ${y}`;
    const tahun = y;
    const tgl = formatDate(appliedDate);

    refetch({
      bulan,
      tahun,
      tglAwal: tgl,
      tglAkhir: tgl,
    });
  }, [appliedDate, refetch]);

  const reportData = data[0] || { data1: [], data23: [], datalaba: [], datalabacabang: [] };

  // Process data1 (AKTIVA)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const aktivaItems = (reportData.data1 || []).filter((item: any) => item.urut != '0' && item.urut != '2' && item.urut != 0 && item.urut != 2);
  const totalAktiva = aktivaItems.reduce((sum: number, item: any) => sum + parseFloat(item.mutasi || 0), 0);

  // Process data23 (KEWAJIBAN & MODAL)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const kewajibanModalItems = (reportData.data23 || []).filter((item: any) => item.urut != '0' && item.urut != '2' && item.urut != 0 && item.urut != 2);
  const totalKewajibanModal = kewajibanModalItems.reduce((sum: number, item: any) => sum + parseFloat(item.mutasi || 0), 0);

  const sections = [
    {
      title: 'AKTIVA',
      rows: [
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        ...aktivaItems.map((r: any) => ({ label: r.aknama, value: fmt(parseFloat(r.mutasi || 0)) })),
        { label: 'TOTAL AKTIVA', value: fmt(totalAktiva) },
      ],
    },
    {
      title: 'KEWAJIBAN & MODAL',
      rows: [
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        ...kewajibanModalItems.map((r: any) => ({ label: r.aknama, value: fmt(parseFloat(r.mutasi || 0)) })),
        { label: 'TOTAL KEWAJIBAN & MODAL', value: fmt(totalKewajibanModal) },
      ],
    },
  ];

  const handleRefresh = useCallback(() => {
    const formatDate = (isoDate: string) => {
      if (!isoDate) return '';
      const [y, m, d] = isoDate.split('-');
      return `${d} ${months[Number(m) - 1]} ${y}`;
    };
    const [y, m] = appliedDate.split('-');
    return refetch({
      bulan: `${months[Number(m) - 1]} ${y}`,
      tahun: y,
      tglAwal: formatDate(appliedDate),
      tglAkhir: formatDate(appliedDate),
    });
  }, [appliedDate, refetch]);

  const filterNode = (
    <div className="flex-shrink-0 bg-white border-b border-gray-100 shadow-sm rounded-t-2xl">
        <button
          className="w-full flex items-center justify-between px-4 py-3 active:bg-[#4f6dfa]/5 transition-colors"
          onClick={() => setShowFilter(!showFilter)}
        >
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-[#4f6dfa]/10 flex items-center justify-center flex-shrink-0">
              <svg viewBox="0 0 24 24" className="w-4 h-4 text-[#4f6dfa]" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                <line x1="4" y1="6" x2="20" y2="6" />
                <line x1="4" y1="12" x2="20" y2="12" />
                <line x1="4" y1="18" x2="20" y2="18" />
                <circle cx="9" cy="6" r="2" fill="currentColor" stroke="none" />
                <circle cx="15" cy="12" r="2" fill="currentColor" stroke="none" />
                <circle cx="9" cy="18" r="2" fill="currentColor" stroke="none" />
              </svg>
            </div>
            <span className="text-sm font-semibold text-[#4f6dfa]">Filter Periode</span>
          </div>
          <svg
            viewBox="0 0 24 24"
            className="w-4 h-4 text-[#4f6dfa] transition-transform duration-200 flex-shrink-0"
            style={{ transform: showFilter ? 'rotate(180deg)' : 'none' }}
            fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round"
          >
            <path d="M6 9l6 6 6-6" />
          </svg>
        </button>

        <div
          className="overflow-hidden transition-all duration-300"
          style={{ maxHeight: showFilter ? 500 : 0, opacity: showFilter ? 1 : 0 }}
        >
          <div className="px-4 pb-4 pt-1 space-y-4">
            {/* Cabang */}
            <SelectInput
              label="Cabang / Klinik"
              value={selectedCabang}
              onChange={setSelectedCabang}
              options={cabangOptions}
            />
            <DatePickerInput label="Per Tanggal" value={perDate} onChange={setPerDate} />
            <div className="flex gap-2.5">
              <button onClick={() => setShowFilter(false)} className="flex-1 py-3 rounded-xl text-sm font-semibold bg-gray-100 text-gray-700">Batal</button>
              <button
                onClick={() => { setAppliedDate(perDate); setAppliedCabang(selectedCabang); setShowFilter(false); }}
                className="flex-1 py-3 rounded-xl text-sm font-bold bg-[#4f6dfa] text-white shadow-md active:bg-[#4f6dfa]/90"
              >
                Terapkan
              </button>
            </div>
          </div>
        </div>

        {!showFilter && (
          <div className="px-4 pb-2 flex items-center gap-2 flex-wrap">
            <span className="text-[11px] bg-[#4f6dfa]/10 text-[#4f6dfa] font-medium px-2.5 py-1 rounded-full">
              📅 Per {fmtDate(appliedDate)}
            </span>
            <span className="text-[11px] bg-green-50 text-green-700 font-medium px-2.5 py-1 rounded-full">
              🏥 {cabangOptions.find(c => c.value === appliedCabang)?.label}
            </span>
          </div>
        )}
      </div>
  );

  const headerNode = <LaporanHeader title="Neraca Umum" />;

  return (
    <LiquidPullToRefresh header={headerNode} onRefresh={handleRefresh} className="flex-1">
      {filterNode}
      <div className="px-3 py-4 pb-8 bg-gray-50">
        <div className="flex gap-2">
          {/* AKTIVA */}
          <div className="flex-1 bg-white rounded-2xl p-3 ios-shadow">
            <h2 className="text-xs font-bold text-[#4f6dfa] pb-1.5 border-b-2 border-[#4f6dfa] mb-2 uppercase">Aktiva</h2>
            <div className="flex justify-between text-[10px] text-gray-500 mb-2"><span>Keterangan</span><span>Nominal</span></div>
            <div className="space-y-1.5">
              {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
              {aktivaItems.map((item: any, i: number) => (
                <div key={i} className="flex justify-between text-xs">
                  <span className="text-gray-700">{item.aknama}</span>
                  <span className="font-medium">{fmt(parseFloat(item.mutasi || 0))}</span>
                </div>
              ))}
            </div>
            <div className="flex justify-between text-xs font-bold mt-3 pt-2 border-t-2 border-gray-900">
              <span>Total</span><span>{fmt(totalAktiva)}</span>
            </div>
          </div>

          {/* KEWAJIBAN & MODAL */}
          <div className="flex-1 bg-white rounded-2xl p-3 ios-shadow">
            <h2 className="text-xs font-bold text-purple-700 pb-1.5 border-b-2 border-purple-700 mb-2 uppercase">Kewajiban &amp; Modal</h2>
            <div className="flex justify-between text-[10px] text-gray-500 mb-2"><span>Keterangan</span><span>Nominal</span></div>
            <div className="space-y-1.5">
              {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
              {kewajibanModalItems.map((item: any, i: number) => (
                <div key={i} className="flex justify-between text-xs">
                  <span className="text-gray-700">{item.aknama}</span>
                  <span className="font-medium">{fmt(parseFloat(item.mutasi || 0))}</span>
                </div>
              ))}
            </div>
            <div className="flex justify-between text-xs font-bold mt-3 pt-2 border-t-2 border-gray-900">
              <span>Total</span><span>{fmt(totalKewajibanModal)}</span>
            </div>
          </div>
        </div>

        <div className={`mt-4 rounded-2xl p-4 flex items-center justify-between ${totalAktiva === totalKewajibanModal ? 'bg-green-50 border-2 border-green-500' : 'bg-red-50 border-2 border-red-500'}`}>
          <span className="text-sm font-semibold text-gray-800">
            {totalAktiva === totalKewajibanModal ? '✅ Neraca Seimbang' : '❌ Tidak Seimbang'}
          </span>
          <span className="text-sm font-bold text-gray-900">{fmt(totalAktiva)}</span>
        </div>
      </div>
    </LiquidPullToRefresh>
  );
}
