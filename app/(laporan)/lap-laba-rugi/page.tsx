'use client';
import { useState, useEffect, useCallback } from 'react';
import LaporanHeader from '@/components/LaporanHeader';
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
  const [startDate, setStartDate] = useState(toISO(firstOfMonth));
  const [endDate, setEndDate] = useState(toISO(today));
  const [appliedStart, setAppliedStart] = useState(toISO(firstOfMonth));
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

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <LaporanHeader title="Laporan Laba Rugi" onExport={() => setShowExportMenu(true)} />

      {/* Filter Panel */}
      <div className="bg-white border-b border-gray-200 flex-shrink-0">
        <button
          className="w-full flex items-center justify-between px-4 py-2.5 active:bg-gray-50"
          onClick={() => setShowFilter(!showFilter)}
        >
          <div className="flex items-center gap-2">
            <span className="text-blue-600">🔽</span>
            <span className="text-sm font-semibold text-blue-600">Filter &amp; Periode</span>
          </div>
          <span
            className="text-blue-600 text-lg leading-none inline-block transition-transform duration-200"
            style={{ transform: showFilter ? 'rotate(180deg)' : 'none' }}
          >▾</span>
        </button>

        <div
          className="overflow-hidden transition-all duration-300"
          style={{ maxHeight: showFilter ? 750 : 0, opacity: showFilter ? 1 : 0 }}
        >
          <div className="px-4 pb-4 pt-1 space-y-4">
            {/* Cabang */}
            <SelectInput
              label="Cabang / Klinik"
              value={selectedCabang}
              onChange={setSelectedCabang}
              options={cabangOptions}
            />

            {/* Tipe periode */}
            <div>
              <p className="text-xs font-semibold text-gray-500 mb-2">Tipe Periode</p>
              <div className="flex gap-2">
                {(['tanggal', 'bulan', 'tahun'] as PeriodType[]).map((p) => (
                  <button
                    key={p}
                    onClick={() => setPeriodType(p)}
                    className={`flex-1 py-2 rounded-xl text-sm font-semibold capitalize transition-colors ${
                      periodType === p ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600'
                    }`}
                  >
                    {p.charAt(0).toUpperCase() + p.slice(1)}
                  </button>
                ))}
              </div>
            </div>

            {/* Date range */}
            <div>
              <p className="text-xs font-semibold text-gray-500 mb-2">Rentang Tanggal</p>
              <div className="flex gap-3">
                <DatePickerInput label="Tanggal Awal" value={startDate} onChange={setStartDate} maxDate={endDate} />
                <DatePickerInput label="Tanggal Akhir" value={endDate} onChange={setEndDate} minDate={startDate} />
              </div>
            </div>

            <div className="flex gap-2.5">
              <button onClick={() => setShowFilter(false)} className="flex-1 py-3 rounded-xl text-sm font-semibold bg-gray-100 text-gray-700">Batal</button>
              <button onClick={applyFilter} className="flex-1 py-3 rounded-xl text-sm font-bold bg-blue-600 text-white shadow-md active:bg-blue-700">Terapkan</button>
            </div>
          </div>
        </div>

        {!showFilter && (
          <div className="px-4 pb-2 flex items-center gap-2 flex-wrap">
            <span className="text-[11px] bg-blue-50 text-blue-600 font-medium px-2.5 py-1 rounded-full">
              📅 {fmtDate(appliedStart)} – {fmtDate(appliedEnd)}
            </span>
            <span className="text-[11px] bg-purple-50 text-purple-600 font-medium px-2.5 py-1 rounded-full capitalize">
              {periodType}
            </span>
            <span className="text-[11px] bg-green-50 text-green-700 font-medium px-2.5 py-1 rounded-full">
              🏥 {cabangOptions.find(c => c.value === appliedCabang)?.label}
            </span>
            <button
              onClick={() => setShowExportMenu(true)}
              className="ml-auto flex items-center gap-1.5 bg-blue-600 text-white text-[11px] font-semibold px-2.5 py-1 rounded-full active:bg-blue-700"
            >
              <svg viewBox="0 0 24 24" className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 3v12M7 8l5-5 5 5M5 20h14" />
              </svg>
              Export
            </button>

            {showExportMenu && (
              <div
                className="fixed inset-0 z-50 flex flex-col justify-end"
                style={{ background: 'rgba(0,0,0,0.4)' }}
                onClick={() => setShowExportMenu(false)}
              >
                <div className="bg-white rounded-t-3xl overflow-hidden" onClick={(e) => e.stopPropagation()}>
                  <div className="flex justify-center pt-3 pb-1">
                    <div className="w-10 h-1 rounded-full bg-gray-300" />
                  </div>
                  <div className="flex items-center justify-between px-5 py-2 border-b border-gray-100">
                    <button onClick={() => setShowExportMenu(false)} className="text-sm font-medium text-gray-500 py-1">Batal</button>
                    <span className="text-sm font-bold text-gray-900">Export Laporan</span>
                    <div className="w-12" />
                  </div>
                  <div className="pb-8">
                    <button
                      onClick={async () => { await exportSectionedToExcel('laporan_laba_rugi', 'Laporan Laba Rugi', exportSections, namaKlinik); setShowExportMenu(false); }}
                      className="w-full flex items-center gap-4 px-5 py-4 text-left border-b border-gray-100 active:bg-gray-50"
                    >
                      <div className="w-10 h-10 rounded-2xl bg-green-50 flex items-center justify-center flex-shrink-0">
                        <span className="text-xl">📊</span>
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-gray-800">Export Excel</p>
                        <p className="text-xs text-gray-400 mt-0.5">Format .xlsx · Microsoft Excel</p>
                      </div>
                    </button>
                    <button
                      onClick={async () => { await exportSectionedToPdf('laporan_laba_rugi', 'Laporan Laba Rugi', exportSections, namaKlinik, `${fmtDate(appliedStart)} – ${fmtDate(appliedEnd)} · ${cabangOptions.find(c => c.value === appliedCabang)?.label}`); setShowExportMenu(false); }}
                      className="w-full flex items-center gap-4 px-5 py-4 text-left active:bg-gray-50"
                    >
                      <div className="w-10 h-10 rounded-2xl bg-red-50 flex items-center justify-center flex-shrink-0">
                        <span className="text-xl">📄</span>
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-gray-800">Export PDF</p>
                        <p className="text-xs text-gray-400 mt-0.5">Format .pdf · Adobe PDF</p>
                      </div>
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-3 py-4 pb-8 bg-gray-50">
        {/* Header kolom */}
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

        {/* Summary */}
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

        {/* Final box */}
        <div className={`mt-4 rounded-2xl border-2 p-4 flex items-center justify-center gap-4 ${isProfit ? 'bg-gray-50 border-gray-900' : 'bg-red-50 border-red-500'}`}>
          <span className={`text-lg font-bold ${isProfit ? 'text-gray-900' : 'text-red-600'}`}>Laba Rugi:</span>
          <span className={`text-2xl font-extrabold ${isProfit ? 'text-gray-900' : 'text-red-600'}`}>{fmt(reportData.labaBersih)}</span>
        </div>
      </div>
    </div>
  );
}
