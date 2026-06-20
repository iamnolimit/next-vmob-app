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

type PeriodType = 'tanggal' | 'bulan' | 'tahun';

const today = new Date();
const toISO = (d: Date) => d.toISOString().slice(0, 10);
const firstOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);

const months = ['Jan','Feb','Mar','Apr','Mei','Jun','Jul','Agt','Sep','Okt','Nov','Des'];
function fmtDate(iso: string) {
  const [y, m, d] = iso.split('-');
  return `${d} ${months[Number(m) - 1]} ${y}`;
}

export default function LapLabaRugiPage() {
  const { user } = useAuth();
  const namaKlinik = user?.cabang ?? 'Vmedis Mobile';
  const [showFilter, setShowFilter] = useState(false);
  const [showExportMenu, setShowExportMenu] = useState(false);
  const [periodType, setPeriodType] = useState<PeriodType>('bulan');
  const [startDate, setStartDate] = useState(toISO(today));
  const [endDate, setEndDate] = useState(toISO(today));
  const [appliedStart, setAppliedStart] = useState(toISO(today));
  const [appliedEnd, setAppliedEnd] = useState(toISO(today));
  const [selectedCabang, setSelectedCabang] = useState(cabangOptions[0].value);
  const [appliedCabang, setAppliedCabang] = useState(cabangOptions[0].value);

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

  useEffect(() => {
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

    if (periodType === 'tanggal') {
      cariValue = 4;
      tglAwal = formatDate(appliedStart);
      tglAkhir = formatDate(appliedEnd);
    } else if (periodType === 'bulan') {
      cariValue = 3;
      const [y, m] = appliedStart.split('-');
      bulan = `${y}-${m}`;
      tahun = y;
      tglAwal = `01 ${months[Number(m) - 1]} ${y}`;
      const lastDay = new Date(Number(y), Number(m), 0).getDate();
      tglAkhir = `${lastDay} ${months[Number(m) - 1]} ${y}`;
    } else {
      cariValue = 2;
      const [y] = appliedStart.split('-');
      tahun = y;
      tglAwal = `01 Jan ${y}`;
      tglAkhir = `31 Des ${y}`;
    }

    refetch({
      cari: cariValue,
      bulan,
      tahun,
      tglAwal,
      tglAkhir,
      apiEndpoint: cariValue === 2 || cariValue === 3 ? 'dy-lap-laba-rugi-bulan/laporan/' : 'dy-lap-laba-rugi/laporan/',
    });
  }, [appliedStart, appliedEnd, periodType, refetch]);

  const handleRefresh = useCallback(() => {
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
    if (periodType === 'tanggal') {
      cariValue = 4;
      tglAwal = formatDate(appliedStart);
      tglAkhir = formatDate(appliedEnd);
    } else if (periodType === 'bulan') {
      cariValue = 3;
      const [y, m] = appliedStart.split('-');
      bulan = `${y}-${m}`;
      tahun = y;
      tglAwal = `01 ${months[Number(m) - 1]} ${y}`;
      const lastDay = new Date(Number(y), Number(m), 0).getDate();
      tglAkhir = `${lastDay} ${months[Number(m) - 1]} ${y}`;
    } else {
      cariValue = 2;
      const [y] = appliedStart.split('-');
      tahun = y;
      tglAwal = `01 Jan ${y}`;
      tglAkhir = `31 Des ${y}`;
    }
    return refetch({
      cari: cariValue, bulan, tahun, tglAwal, tglAkhir,
      apiEndpoint: cariValue === 2 || cariValue === 3 ? 'dy-lap-laba-rugi-bulan/laporan/' : 'dy-lap-laba-rugi/laporan/',
    });
  }, [appliedStart, appliedEnd, periodType, refetch]);

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
    setAppliedStart(startDate);
    setAppliedEnd(endDate);
    setAppliedCabang(selectedCabang);
    setShowFilter(false);
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
          <SelectInput label="Cabang / Klinik" value={selectedCabang} onChange={setSelectedCabang} options={cabangOptions} />

          <div>
            <p className="text-xs font-semibold text-gray-500 mb-2">Tipe Periode</p>
            <div className="flex gap-2">
              {(['tanggal', 'bulan', 'tahun'] as PeriodType[]).map((p) => (
                <button key={p} onClick={() => setPeriodType(p)}
                  className={`flex-1 py-2 rounded-xl text-sm font-semibold capitalize transition-colors ${periodType === p ? 'bg-primary-accent text-white' : 'bg-gray-100 text-gray-600'}`}>
                  {p.charAt(0).toUpperCase() + p.slice(1)}
                </button>
              ))}
            </div>
          </div>

          <div>
            <p className="text-xs font-semibold text-gray-500 mb-2">Rentang Tanggal</p>
            <div className="flex gap-3">
              <DatePickerInput label="Tanggal Awal" value={startDate} onChange={setStartDate} maxDate={endDate} />
              <DatePickerInput label="Tanggal Akhir" value={endDate} onChange={setEndDate} minDate={startDate} />
            </div>
          </div>

          <div className="flex gap-2.5">
            <button onClick={() => setShowFilter(false)} className="flex-1 py-3 rounded-xl text-sm font-semibold bg-gray-100 text-gray-700">Batal</button>
            <button onClick={applyFilter} className="flex-1 py-3 rounded-xl text-sm font-bold bg-primary-accent text-white shadow-md active:bg-primary-accent/90">Terapkan</button>
          </div>
        </div>
      </div>

      {!showFilter && (
        <div className="px-4 pb-2 flex items-center gap-2 flex-wrap">
          <span className="text-[11px] bg-primary-accent/10 text-primary-accent font-medium px-2.5 py-1 rounded-full">
            {String.fromCodePoint(0x1F4C5)} {fmtDate(appliedStart)} {String.fromCodePoint(0x2013)} {fmtDate(appliedEnd)}
          </span>
          <span className="text-[11px] bg-purple-50 text-purple-600 font-medium px-2.5 py-1 rounded-full capitalize">
            {periodType}
          </span>
          <span className="text-[11px] bg-green-50 text-green-700 font-medium px-2.5 py-1 rounded-full">
            {String.fromCodePoint(0x1F3E5)} {cabangOptions.find(c => c.value === appliedCabang)?.label}
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
