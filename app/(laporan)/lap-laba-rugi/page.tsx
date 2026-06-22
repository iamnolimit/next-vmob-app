'use client';
import { useState, useEffect, useCallback } from 'react';
import LaporanHeader from '@/components/LaporanHeader';
import LiquidPullToRefresh from '@/components/LiquidPullToRefresh';
import { ListSkeleton } from '@/components/SkeletonLoader';
import SelectInput from '@/components/SelectInput';
import DatePickerInput from '@/components/DatePickerInput';
import { formatNumber } from '@/lib/dummyData';
import { useCabangOptions } from '@/lib/useCabangOptions';
import MonthPickerInput from '@/components/MonthPickerInput';
import YearPickerInput from '@/components/YearPickerInput';
import { exportSectionedToPdf, exportSectionedToExcel } from '@/lib/exportUtils';
import { useAuth } from '@/lib/authContext';
import { useReportData } from '@/lib/useReportData';

type PeriodType = 'tanggal' | 'bulan' | 'tahun';

const today = new Date();
const toISO = (d: Date) => d.toISOString().slice(0, 10);

const months = ['Jan','Feb','Mar','Apr','Mei','Jun','Jul','Agt','Sep','Okt','Nov','Des'];
function fmtDate(iso: string) {
  const [y, m, d] = iso.split('-');
  return `${d} ${months[Number(m) - 1]} ${y}`;
}

export default function LapLabaRugiPage() {
  const { user } = useAuth();
  const { cabangOptions } = useCabangOptions();
  const namaKlinik = user?.cabang ?? 'Vmedis Mobile';
  const [showFilter, setShowFilter] = useState(false);
  const [showExportMenu, setShowExportMenu] = useState(false);
  const [periodType, setPeriodType] = useState<PeriodType>('bulan');
  const [startDate, setStartDate] = useState(toISO(today));
  const [endDate, setEndDate] = useState(toISO(today));
  const [selectedMonth, setSelectedMonth] = useState<string>(() => {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
  });
  const [selectedYear, setSelectedYear] = useState<string>(() => new Date().getFullYear().toString());
  const [appliedStart, setAppliedStart] = useState(toISO(today));
  const [appliedEnd, setAppliedEnd] = useState(toISO(today));
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
    let resdata = null;
    if (rawData?.data && !Array.isArray(rawData.data)) {
      resdata = rawData.data;
    } else if (rawData?.data?.data) {
      resdata = rawData.data.data;
    } else if (rawData) {
      resdata = rawData;
    }

    if (resdata && (resdata.data || resdata.data1 || resdata.data2)) {
      const obatterjual = resdata.data2 ? parseFloat(resdata.data2.total) || 0 : 0;
      const obatretur = resdata.data3 ? parseFloat(resdata.data3.total) || 0 : 0;
      const jasaterjual = resdata.data6 ? parseFloat(resdata.data6.total) || 0 : 0;
      const jasaretur = resdata.data7 ? parseFloat(resdata.data7.total) || 0 : 0;
      const pemasukan = resdata.data4 ? parseFloat(resdata.data4.mutasi) || 0 : 0;
      const pengeluaran = resdata.data5 ? Math.abs(parseFloat(resdata.data5.mutasi) || 0) : 0;

      const totalhpp = obatterjual + jasaterjual - obatretur - jasaretur;
      const labakotor = pemasukan - totalhpp;
      const lababersih = labakotor - pengeluaran;

      return [{
        pemasukanData: resdata.data || [],
        pengeluaranData: resdata.data1 || [],
        totalPemasukan: pemasukan,
        totalPengeluaran: pengeluaran,
        totalHPP: totalhpp,
        labaKotor: labakotor,
        labaBersih: lababersih,
      }];
    }
    return [];
  }, []);

  const { data, refetch, loading } = useReportData({
    apiEndpoint: 'dy-lap-laba-rugi/laporan/',
    apiVersion: 'api7',
    apiParams: {
      cari: 4,
      bulan: '',
      tahun: '',
      tglAwal: '',
      tglAkhir: '',
      reg: 'db',
      mn_jenis: '',
    },
    apiNormalizer,
  });

  const buildRefetchParams = useCallback((start: string, end: string, period: PeriodType) => {
    const formatDate = (isoDate: string) => {
      if (!isoDate) return '';
      const [y, m, d] = isoDate.split('-');
      return `${d} ${months[Number(m) - 1]} ${y}`;
    };
    let cariValue = 4;
    let bulan = '';
    let tahun = '';
    let tglAwal = '';
    let tglAkhir = '';
    if (period === 'tanggal') {
      cariValue = 4;
      tglAwal = formatDate(start);
      tglAkhir = formatDate(end);
    } else if (period === 'bulan') {
      cariValue = 3;
      const [y, m] = start.split('-');
      bulan = `${y}-${m}`;
      tahun = y;
      tglAwal = `01 ${months[Number(m) - 1]} ${y}`;
      const lastDay = new Date(Number(y), Number(m), 0).getDate();
      tglAkhir = `${lastDay} ${months[Number(m) - 1]} ${y}`;
    } else {
      cariValue = 2;
      const [y] = start.split('-');
      tahun = y;
      tglAwal = `01 Jan ${y}`;
      tglAkhir = `31 Des ${y}`;
    }
    return { cari: cariValue, bulan, tahun, tglAwal, tglAkhir,
      apiEndpoint: cariValue === 2 || cariValue === 3 ? 'dy-lap-laba-rugi-bulan/laporan/' : 'dy-lap-laba-rugi/laporan/' };
  }, []);

  const handleRefresh = useCallback(() => {
    return refetch(buildRefetchParams(appliedStart, appliedEnd, periodType));
  }, [appliedStart, appliedEnd, periodType, refetch, buildRefetchParams]);

  const reportData = data[0] || {
    pemasukanData: [],
    pengeluaranData: [],
    totalPemasukan: 0,
    totalPengeluaran: 0,
    totalHPP: 0,
    labaKotor: 0,
    labaBersih: 0,
  };

  const isProfit = reportData.labaBersih >= 0;
  const fmt = (v: number) => formatNumber(v);

  const applyFilter = () => {
    let finalStart = startDate;
    let finalEnd = endDate;
    if (periodType === 'bulan') {
      const [y, m] = selectedMonth.split('-');
      finalStart = `${y}-${m}-01`;
      const lastDay = new Date(Number(y), Number(m), 0).getDate();
      finalEnd = `${y}-${m}-${String(lastDay).padStart(2, '0')}`;
    } else if (periodType === 'tahun') {
      finalStart = `${selectedYear}-01-01`;
      finalEnd = `${selectedYear}-12-31`;
    }
    setAppliedStart(finalStart);
    setAppliedEnd(finalEnd);
    setAppliedCabang(selectedCabang);
    setShowFilter(false);
    refetch(buildRefetchParams(finalStart, finalEnd, periodType));
  };

  const resetFilter = () => {
    const d = new Date();
    const todayISO = toISO(d);
    const monthStr = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
    setPeriodType('bulan');
    setStartDate(todayISO);
    setEndDate(todayISO);
    setSelectedMonth(monthStr);
    setSelectedYear(d.getFullYear().toString());
    setAppliedStart(todayISO);
    setAppliedEnd(todayISO);
    const defaultCabang = (cabangOptions.find((c) => c.value === user?.app_id) ?? cabangOptions[0])?.value ?? '';
    setSelectedCabang(defaultCabang);
    setAppliedCabang(defaultCabang);
    setShowFilter(true);
  };

  const exportSections = [
    {
      title: 'PEMASUKAN',
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      rows: [
        ...reportData.pemasukanData.map((r: any) => ({ label: r.aknama, value: fmt(parseFloat(r.mutasi || 0)) })),
        { label: 'Total Pemasukan', value: fmt(reportData.totalPemasukan) },
      ],
    },
    {
      title: 'PENGELUARAN',
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      rows: [
        ...reportData.pengeluaranData.map((r: any) => ({ label: r.aknama, value: fmt(Math.abs(parseFloat(r.mutasi || 0))) })),
        { label: 'HPP', value: fmt(reportData.totalHPP) },
        { label: 'Total Pengeluaran', value: fmt(reportData.totalPengeluaran) },
      ],
    },
    {
      title: 'RINGKASAN',
      rows: [
        { label: 'Laba Kotor', value: fmt(reportData.labaKotor) },
        { label: 'Laba Bersih', value: fmt(reportData.labaBersih) },
      ],
    },
  ];

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
          <span className="text-sm font-semibold text-primary-accent">Filter &amp; Periode</span>
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
        style={{ maxHeight: showFilter ? 750 : 0, opacity: showFilter ? 1 : 0 }}
      >
        <div className="px-4 pb-4 pt-1 space-y-4">
          <SelectInput
            label="Cabang / Klinik"
            value={selectedCabang}
            onChange={setSelectedCabang}
            options={cabangOptions.length > 0 ? cabangOptions : [{ value: user?.app_id ?? '', label: user?.cabang ?? 'Cabang Saat Ini' }]}
          />

          <div>
            <p className="text-xs font-semibold text-gray-500 mb-2">Pilihan Periode</p>
            <div className="flex bg-gray-100 rounded-lg p-0.5">
              {(['tanggal', 'bulan', 'tahun'] as PeriodType[]).map((p) => (
                <button key={p} onClick={() => setPeriodType(p)}
                  className={`flex-1 py-1.5 text-xs font-bold rounded-md capitalize transition-colors ${periodType === p ? 'bg-white text-primary-accent shadow-sm' : 'text-gray-500'}`}>
                  {p.charAt(0).toUpperCase() + p.slice(1)}
                </button>
              ))}
            </div>
          </div>

          {periodType === 'tanggal' && (
            <div className="flex gap-3">
              <DatePickerInput label="Tanggal Awal" value={startDate} onChange={setStartDate} maxDate={endDate} />
              <DatePickerInput label="Tanggal Akhir" value={endDate} onChange={setEndDate} minDate={startDate} />
            </div>
          )}

          {periodType === 'bulan' && (
            <MonthPickerInput label="Pilih Bulan" value={selectedMonth} onChange={setSelectedMonth} />
          )}

          {periodType === 'tahun' && (
            <YearPickerInput label="Pilih Tahun" value={selectedYear} onChange={setSelectedYear} />
          )}

          <div className="flex gap-2.5">
            <button onClick={resetFilter} className="flex-1 py-3 rounded-xl text-sm font-semibold bg-gray-100 text-gray-700 flex items-center justify-center gap-1.5">
              <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><path d="M3 12a9 9 0 109-9 9.75 9.75 0 00-6.74 2.74L3 8" /><path d="M3 3v5h5" /></svg>
              Reset
            </button>
            <button onClick={applyFilter} className="flex-1 py-3 rounded-xl text-sm font-bold bg-primary-accent text-white shadow-md active:bg-primary-accent/90">Terapkan</button>
          </div>
        </div>
      </div>

      {!showFilter && (
        <div className="px-4 pb-2 flex items-center gap-2 flex-wrap">
          <span className="text-[11px] bg-primary-accent/10 text-primary-accent font-medium px-2.5 py-1 rounded-full">
            {String.fromCodePoint(0x1F4C5)} {fmtDate(appliedStart)} {String.fromCodePoint(0x2013)} {fmtDate(appliedEnd)}
          </span>
          <span className="text-[11px] bg-primary-accent/10 text-primary-accent font-medium px-2.5 py-1 rounded-full capitalize">
            {periodType}
          </span>
          <span className="text-[11px] bg-green-50 text-green-700 font-medium px-2.5 py-1 rounded-full">
            {String.fromCodePoint(0x1F3E5)} {(cabangOptions.length > 0 ? cabangOptions : [{ value: user?.app_id ?? '', label: user?.cabang ?? '' }]).find(c => c.value === appliedCabang)?.label}
          </span>
        </div>
      )}
    </div>
  );

  const headerNode = <LaporanHeader title="Laba Rugi" />;

  return (
    <LiquidPullToRefresh header={headerNode} onRefresh={handleRefresh} className="flex-1">
      {filterNode}
      <div className="px-3 py-4 pb-8 bg-gray-50">
        {loading ? (
          <ListSkeleton rows={8} />
        ) : (
          <div className="animate-content-in">
            <div className="flex gap-2 mb-2">
              {['PEMASUKAN', 'PENGELUARAN'].map((h) => (
                <div key={h} className="flex-1 pb-1 border-b-2 border-gray-900 text-sm font-bold">{h}</div>
              ))}
            </div>
            <div className="flex gap-2 mb-2">
              {[0, 1].map((i) => (
                <div key={i} className="flex-1 flex justify-between text-xs font-semibold text-gray-500">
                  <span>Nama Akun</span><span>Nominal</span>
                </div>
              ))}
            </div>

            {Array.from({ length: Math.max(reportData.pemasukanData.length, reportData.pengeluaranData.length) }).map((_, i) => (
              <div key={i} className="flex gap-2 mb-1">
                <div className="flex-1 flex justify-between text-xs">
                  {reportData.pemasukanData[i]
                    ? (<><span className="text-gray-700 pl-2">{reportData.pemasukanData[i].aknama}</span><span className="font-medium">{fmt(parseFloat(reportData.pemasukanData[i].mutasi || 0))}</span></>)
                    : <span />}
                </div>
                <div className="flex-1 flex justify-between text-xs">
                  {reportData.pengeluaranData[i]
                    ? (<><span className="text-gray-700 pl-2">{reportData.pengeluaranData[i].aknama}</span><span className="font-medium">{fmt(Math.abs(parseFloat(reportData.pengeluaranData[i].mutasi || 0)))}</span></>)
                    : <span />}
                </div>
              </div>
            ))}

            <div className="flex gap-2 mt-3 pt-2 border-t-2 border-gray-900">
              <div className="flex-1 flex justify-between text-sm font-bold"><span>Total</span><span>{fmt(reportData.totalPemasukan)}</span></div>
              <div className="flex-1 flex justify-between text-sm font-bold"><span>Total</span><span>{fmt(reportData.totalPengeluaran)}</span></div>
            </div>

            <div className="mt-3 space-y-2">
              {[
                { label: 'Total HPP', val: reportData.totalHPP, color: '' },
                { label: 'Laba Kotor', val: reportData.labaKotor, color: reportData.labaKotor < 0 ? 'text-red-600' : '' },
                { label: 'Total Pengeluaran', val: reportData.totalPengeluaran, color: '' },
                { label: 'Laba Bersih', val: reportData.labaBersih, color: reportData.labaBersih < 0 ? 'text-red-600' : '' },
              ].map(({ label, val, color }) => (
                <div key={label} className={`flex justify-between text-sm font-bold py-2 border-t border-dashed border-gray-300 ${color}`}>
                  <span>{label}</span><span>{fmt(val)}</span>
                </div>
              ))}
            </div>

            <div className={`mt-4 rounded-2xl border-2 p-4 flex items-center justify-center gap-4 ${isProfit ? 'bg-gray-50 border-gray-900' : 'bg-red-50 border-red-500'}`}>
              <span className={`text-lg font-bold ${isProfit ? 'text-gray-900' : 'text-red-600'}`}>Laba Rugi:</span>
              <span className={`text-2xl font-extrabold ${isProfit ? 'text-gray-900' : 'text-red-600'}`}>{fmt(reportData.labaBersih)}</span>
            </div>

            <div className="mt-4 relative">
              <button
                onClick={() => setShowExportMenu(!showExportMenu)}
                className="w-full py-3 rounded-xl text-sm font-bold bg-primary-accent text-white shadow-md active:bg-primary-accent/90"
              >
                Export Laporan
              </button>
              {showExportMenu && (
                <div className="absolute bottom-full mb-2 left-0 right-0 bg-white rounded-2xl ios-shadow overflow-hidden z-10">
                  <button
                    onClick={() => { exportSectionedToPdf(`Laba Rugi - ${namaKlinik}`, 'Laba Rugi', exportSections, namaKlinik, `${fmtDate(appliedStart)} – ${fmtDate(appliedEnd)}`); setShowExportMenu(false); }}
                    className="w-full px-4 py-3 text-sm font-semibold text-left text-red-600 border-b border-gray-100 active:bg-red-50"
                  >
                    {String.fromCodePoint(0x1F4C4)} Export PDF
                  </button>
                  <button
                    onClick={() => { exportSectionedToExcel(`Laba Rugi - ${namaKlinik}`, 'Laba Rugi', exportSections, namaKlinik); setShowExportMenu(false); }}
                    className="w-full px-4 py-3 text-sm font-semibold text-left text-green-700 active:bg-green-50"
                  >
                    {String.fromCodePoint(0x1F4CA)} Export Excel
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </LiquidPullToRefresh>
  );
}
