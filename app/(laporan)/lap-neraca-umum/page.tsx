'use client';
import { useState } from 'react';
import LaporanHeader from '@/components/LaporanHeader';
import SelectInput from '@/components/SelectInput';
import DatePickerInput from '@/components/DatePickerInput';
import { neracaUmumData, totalAktiva, totalKewajibanModal, formatNumber, cabangOptions } from '@/lib/dummyData';
import { exportSectionedToPdf, exportSectionedToExcel } from '@/lib/exportUtils';
import { useAuth } from '@/lib/authContext';

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

  const sections = [
    {
      title: 'AKTIVA',
      rows: [
        ...neracaUmumData.aktiva.map((r) => ({ label: r.label, value: fmt(r.nominal) })),
        { label: 'TOTAL AKTIVA', value: fmt(totalAktiva) },
      ],
    },
    {
      title: 'KEWAJIBAN & MODAL',
      rows: [
        ...neracaUmumData.kewajibanModal.map((r) => ({ label: r.label, value: fmt(r.nominal) })),
        { label: 'TOTAL KEWAJIBAN & MODAL', value: fmt(totalKewajibanModal) },
      ],
    },
  ];

  const subtitle = `Per ${fmtDate(appliedDate)} · ${cabangOptions.find(c => c.value === appliedCabang)?.label}`;

  return (
    <div className="flex flex-col h-full">
      <LaporanHeader title="Laporan Neraca Umum" />

      {/* Filter */}
      <div className="bg-white border-b border-gray-200 flex-shrink-0">
        <button
          className="w-full flex items-center justify-between px-4 py-2.5 active:bg-gray-50"
          onClick={() => setShowFilter(!showFilter)}
        >
          <div className="flex items-center gap-2">
            <span className="text-blue-600">🔽</span>
            <span className="text-sm font-semibold text-blue-600">Filter Periode</span>
          </div>
          <span
            className="text-blue-600 text-lg leading-none inline-block transition-transform duration-200"
            style={{ transform: showFilter ? 'rotate(180deg)' : 'none' }}
          >▾</span>
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
                className="flex-1 py-3 rounded-xl text-sm font-bold bg-blue-600 text-white shadow-md active:bg-blue-700"
              >
                Terapkan
              </button>
            </div>
          </div>
        </div>

        {!showFilter && (
          <div className="px-4 pb-2 flex items-center gap-2 flex-wrap">
            <span className="text-[11px] bg-blue-50 text-blue-600 font-medium px-2.5 py-1 rounded-full">
              📅 Per {fmtDate(appliedDate)}
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
                      onClick={async () => { await exportSectionedToExcel('laporan_neraca_umum', 'Laporan Neraca Umum', sections, namaKlinik); setShowExportMenu(false); }}
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
                      onClick={async () => { await exportSectionedToPdf('laporan_neraca_umum', 'Laporan Neraca Umum', sections, namaKlinik, subtitle); setShowExportMenu(false); }}
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
        <div className="flex gap-2">
          {/* AKTIVA */}
          <div className="flex-1 bg-white rounded-2xl p-3 ios-shadow">
            <h2 className="text-xs font-bold text-blue-700 pb-1.5 border-b-2 border-blue-700 mb-2 uppercase">Aktiva</h2>
            <div className="flex justify-between text-[10px] text-gray-500 mb-2"><span>Keterangan</span><span>Nominal</span></div>
            <div className="space-y-1.5">
              {neracaUmumData.aktiva.map((item, i) => (
                <div key={i} className="flex justify-between text-xs">
                  <span className="text-gray-700">{item.label}</span>
                  <span className="font-medium">{fmt(item.nominal)}</span>
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
              {neracaUmumData.kewajibanModal.map((item, i) => (
                <div key={i} className="flex justify-between text-xs">
                  <span className="text-gray-700">{item.label}</span>
                  <span className="font-medium">{fmt(item.nominal)}</span>
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
    </div>
  );
}
