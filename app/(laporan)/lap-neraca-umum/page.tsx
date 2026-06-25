'use client';
import { useState, useEffect, useCallback } from 'react';
import LaporanHeader from '@/components/LaporanHeader';
import LiquidPullToRefresh from '@/components/LiquidPullToRefresh';
import { ListSkeleton } from '@/components/SkeletonLoader';
import SelectInput from '@/components/SelectInput';
import DatePickerInput from '@/components/DatePickerInput';
import { formatNumber } from '@/lib/dummyData';
import { useCabangOptions } from '@/lib/useCabangOptions';
import { exportSectionedToPdf, exportSectionedToExcel } from '@/lib/exportUtils';
import { useAuth } from '@/lib/authContext';
import { useReportData } from '@/lib/useReportData';

const fmt = (n: number) => n.toLocaleString('id-ID', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
const today = new Date();
const toISO = (d: Date) => d.toISOString().slice(0, 10);
const months = ['Jan','Feb','Mar','Apr','Mei','Jun','Jul','Agt','Sep','Okt','Nov','Des'];
const fmtDate = (iso: string) => {
  const [y, m, d] = iso.split('-');
  return `${d} ${months[Number(m) - 1]} ${y}`;
};

export default function LapNeracaUmumPage() {
  const { user } = useAuth();
  const { cabangOptions, loading: cabangLoading } = useCabangOptions();
  const namaKlinik = user?.cabang ?? 'Vmedis Mobile';
  const [showFilter, setShowFilter] = useState(false);
  const [showExportMenu, setShowExportMenu] = useState(false);
  const [perDate, setPerDate] = useState(toISO(today));
  const [appliedDate, setAppliedDate] = useState(toISO(today));
  const [selectedCabang, setSelectedCabang] = useState('');
  const [appliedCabang, setAppliedCabang] = useState('');

  // Set default cabang when options load
  useEffect(() => {
    if (cabangOptions.length > 0 && !selectedCabang) {
      const match = cabangOptions.find((c) => c.value === user?.app_id) ?? cabangOptions[0];
      setSelectedCabang(match.value);
      setAppliedCabang(match.value);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cabangOptions]);

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

  const buildNeracaParams = useCallback((date: string, cabang: string) => {
    const formatDate = (isoDate: string) => {
      if (!isoDate) return '';
      const [y, m, d] = isoDate.split('-');
      return `${d} ${months[Number(m) - 1]} ${y}`;
    };
    const [y, m] = date.split('-');
    const selectedCabangObj = cabangOptions.find(c => c.value === cabang);
    return {
      bulan: `${months[Number(m) - 1]} ${y}`,
      tahun: y,
      tglAwal: formatDate(date),
      tglAkhir: formatDate(date),
      a: cabang,
      reg: selectedCabangObj?.reg ?? 'db',
      device: 'mobile',
    };
  }, [cabangOptions]);

  const reportData = data[0] || { data1: [], data23: [], datalaba: [], datalabacabang: [] };

  // Calculate laba from datalaba
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const laba = (() => {
    let laba_k = 0;
    let laba_d = 0;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (reportData.datalaba || []).forEach((item: any) => {
      if (item.aktipe === 'K') laba_k = parseFloat(item.mutasi) || 0;
      else laba_d = parseFloat(item.mutasi) || 0;
    });
    return laba_k - laba_d;
  })();

  // Calculate laba_cabang from datalabacabang
  const labaCabang = (() => {
    let laba_k = 0;
    let laba_d = 0;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (reportData.datalabacabang || []).forEach((item: any) => {
      if (item.aktipe === 'K') laba_k += parseFloat(item.mutasi) || 0;
      else laba_d += parseFloat(item.mutasi) || 0;
    });
    return laba_k - laba_d;
  })();

  // Group data1 (AKTIVA) by akpos
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const aktivaGrouped: Record<string, { label: string; nominal: number }[]> = {};
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (reportData.data1 || []).forEach((item: any) => {
    if (item.urut == '0' || item.urut == '2' || item.urut == 0 || item.urut == 2) return;
    if (!aktivaGrouped[item.akpos]) aktivaGrouped[item.akpos] = [];
    aktivaGrouped[item.akpos].push({ label: item.aknama, nominal: parseFloat(item.mutasi) || 0 });
  });

  // Group data23 (KEWAJIBAN & MODAL) by akpos, with laba injection
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const kewajibanModalGrouped: Record<string, { label: string; nominal: number }[]> = {};
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (reportData.data23 || []).forEach((item: any) => {
    if (item.urut == '0' || item.urut == '2' || item.urut == 0 || item.urut == 2) return;
    if (!kewajibanModalGrouped[item.akpos]) kewajibanModalGrouped[item.akpos] = [];
    let displayValue = parseFloat(item.mutasi) || 0;
    if (item.akkode === '330001') displayValue += laba;
    else if (item.aknama === 'Laba Distribusi Cabang') displayValue += labaCabang;
    kewajibanModalGrouped[item.akpos].push({ label: item.aknama, nominal: displayValue });
  });

  // Grand totals from subtotals (urut == 2)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const grandTotalAktiva = (reportData.data1 || []).reduce((sum: number, item: any) => {
    if (item.urut == 2) return sum + (parseFloat(item.mutasi) || 0);
    return sum;
  }, 0);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const grandTotalKewajibanModal = (reportData.data23 || []).reduce((sum: number, item: any) => {
    if (item.urut == 2) return sum + (parseFloat(item.mutasi) || 0);
    return sum;
  }, 0) + laba + labaCabang;

  const aktivaSections = Object.keys(aktivaGrouped);
  const kewajibanModalSections = Object.keys(kewajibanModalGrouped);
  const maxSections = Math.max(aktivaSections.length, kewajibanModalSections.length);

  const fmtDecimal = (n: number) =>
    n.toLocaleString('id-ID', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

  const handleRefresh = useCallback(() => {
    return refetch(buildNeracaParams(appliedDate, appliedCabang));
  }, [appliedDate, appliedCabang, refetch, buildNeracaParams]);

  const filterNode = (
    <div className="flex-shrink-0 bg-white border-b border-gray-100 shadow-sm rounded-t-2xl">
        <button
          className="w-full flex items-center justify-between px-4 py-3 active:bg-primary-accent/5 transition-colors"
          onClick={() => setShowFilter(!showFilter)}
        >
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-primary-accent/10 flex items-center justify-center flex-shrink-0">
              <svg viewBox="0 0 24 24" className="w-4 h-4 text-primary-accent" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                <line x1="4" y1="6" x2="20" y2="6" />
                <line x1="4" y1="12" x2="20" y2="12" />
                <line x1="4" y1="18" x2="20" y2="18" />
                <circle cx="9" cy="6" r="2" fill="currentColor" stroke="none" />
                <circle cx="15" cy="12" r="2" fill="currentColor" stroke="none" />
                <circle cx="9" cy="18" r="2" fill="currentColor" stroke="none" />
              </svg>
            </div>
            <span className="text-sm font-semibold text-primary-accent">Filter Periode</span>
          </div>
          <svg
            viewBox="0 0 24 24"
            className="w-4 h-4 text-primary-accent transition-transform duration-200 flex-shrink-0"
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
              options={cabangOptions.length > 0 ? cabangOptions : [{ value: user?.app_id ?? '', label: user?.cabang ?? 'Cabang Saat Ini' }]}
            />
            <DatePickerInput label="Per Tanggal" value={perDate} onChange={setPerDate} />
            <div className="flex gap-2.5">
              <button onClick={() => setShowFilter(false)} className="flex-1 py-3 rounded-xl text-sm font-semibold bg-gray-100 text-gray-700">Reset</button>
              <button
                onClick={() => { setAppliedDate(perDate); setAppliedCabang(selectedCabang); setShowFilter(false); refetch(buildNeracaParams(perDate, selectedCabang)); }}
                className="flex-1 py-3 rounded-xl text-sm font-bold bg-primary-accent text-white shadow-md active:bg-primary-accent/90"
              >
                Terapkan
              </button>
            </div>
          </div>
        </div>

        {!showFilter && (
          <div className="px-4 pb-2 flex items-center gap-2 flex-wrap">
            <span className="text-[11px] bg-primary-accent/10 text-primary-accent font-medium px-2.5 py-1 rounded-full">
              📅 Per {fmtDate(appliedDate)}
            </span>
            <span className="text-[11px] bg-green-50 text-green-700 font-medium px-2.5 py-1 rounded-full">
              🏥 {(cabangOptions.length > 0 ? cabangOptions : [{ value: user?.app_id ?? '', label: user?.cabang ?? '' }]).find(c => c.value === appliedCabang)?.label}
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
          <div className="flex-1 bg-white rounded-2xl p-3 ios-shadow flex flex-col">
            <h2 className="text-xs font-bold text-primary-accent pb-1.5 border-b-2 border-primary-accent mb-2 uppercase">Aktiva</h2>
            <div className="flex-1 space-y-3">
              {aktivaSections.map((section, i) => {
                const items = aktivaGrouped[section];
                const sectionTotal = items.reduce((sum, item) => sum + item.nominal, 0);
                return (
                  <div key={i} className="flex flex-col">
                    <div className="font-bold mb-1 text-[11px] text-gray-800">{section}</div>
                    <div className="space-y-1">
                      {items.map((item, j) => (
                        <div key={j} className="flex justify-between text-[10px] pl-2">
                          <span className="text-gray-600 flex-1 pr-1">{item.label}</span>
                          <span className="font-medium text-right shrink-0">{fmtDecimal(item.nominal)}</span>
                        </div>
                      ))}
                    </div>
                    <div className="flex justify-between text-[10px] font-bold mt-1 pt-1 border-t border-gray-200">
                      <span>Total</span>
                      <span>{fmtDecimal(sectionTotal)}</span>
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="flex justify-between text-xs font-bold mt-3 pt-2 border-t-2 border-gray-900">
              <span>Total Aktiva</span><span>{fmtDecimal(grandTotalAktiva)}</span>
            </div>
          </div>

          {/* KEWAJIBAN & MODAL */}
          <div className="flex-1 bg-white rounded-2xl p-3 ios-shadow flex flex-col">
            <h2 className="text-xs font-bold text-primary-accent pb-1.5 border-b-2 border-primary-accent mb-2 uppercase">Kewajiban &amp; Modal</h2>
            <div className="flex-1 space-y-3">
              {kewajibanModalSections.map((section, i) => {
                const items = kewajibanModalGrouped[section];
                const sectionTotal = items.reduce((sum, item) => sum + item.nominal, 0);
                return (
                  <div key={i} className="flex flex-col">
                    <div className="font-bold mb-1 text-[11px] text-gray-800">{section}</div>
                    <div className="space-y-1">
                      {items.map((item, j) => (
                        <div key={j} className="flex justify-between text-[10px] pl-2">
                          <span className="text-gray-600 flex-1 pr-1">{item.label}</span>
                          <span className="font-medium text-right shrink-0">{fmtDecimal(item.nominal)}</span>
                        </div>
                      ))}
                    </div>
                    <div className="flex justify-between text-[10px] font-bold mt-1 pt-1 border-t border-gray-200">
                      <span>Total</span>
                      <span>{fmtDecimal(sectionTotal)}</span>
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="flex justify-between text-xs font-bold mt-3 pt-2 border-t-2 border-gray-900">
              <span>Total Kewajiban &amp; Modal</span><span>{fmtDecimal(grandTotalKewajibanModal)}</span>
            </div>
          </div>
        </div>

        <div className={`mt-4 rounded-2xl p-4 flex items-center justify-between ${Math.abs(grandTotalAktiva - grandTotalKewajibanModal) < 0.01 ? 'bg-green-50 border-2 border-green-500' : 'bg-red-50 border-2 border-red-500'}`}>
          <span className="text-sm font-semibold text-gray-800">
            {Math.abs(grandTotalAktiva - grandTotalKewajibanModal) < 0.01 ? '✅ Neraca Seimbang' : '❌ Tidak Seimbang'}
          </span>
          <span className="text-sm font-bold text-gray-900">{fmtDecimal(grandTotalAktiva)}</span>
        </div>
      </div>
    </LiquidPullToRefresh>
  );
}
