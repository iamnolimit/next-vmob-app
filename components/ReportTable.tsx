'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSidebar } from '@/lib/sidebarContext';
import { useAuth } from '@/lib/authContext';
import DatePickerInput from './DatePickerInput';
import SelectInput from './SelectInput';
import { exportToExcel, exportToPdf } from '@/lib/exportUtils';

export interface Column {
  key: string;
  label: string;
  align?: 'left' | 'right' | 'center';
  width?: number;
  render?: (row: Record<string, unknown>) => React.ReactNode;
}

export interface IntervalOption {
  label: string;
  value: string | number;
}

export interface CabangOption {
  label: string;
  value: string;
}

interface ReportTableProps {
  title: string;
  columns: Column[];
  data: Record<string, unknown>[];
  totalLabel?: string;
  totalValue?: string;
  searchFields?: string[];
  searchPlaceholder?: string;
  hideDateFilter?: boolean;
  intervalOptions?: IntervalOption[];
  intervalTitle?: string;
  cabangOptions?: CabangOption[];
}

function toISO(d: Date) {
  return d.toISOString().slice(0, 10);
}

function fmtDisplay(iso: string) {
  if (!iso) return '';
  const months = ['Jan','Feb','Mar','Apr','Mei','Jun','Jul','Agt','Sep','Okt','Nov','Des'];
  const [y, m, d] = iso.split('-');
  return `${d} ${months[Number(m) - 1]} ${y}`;
}

const today = new Date();
const firstOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);

export default function ReportTable({
  title,
  columns,
  data,
  totalLabel,
  totalValue,
  searchFields = [],
  searchPlaceholder = 'Cari...',
  hideDateFilter = false,
  intervalOptions,
  intervalTitle = 'Interval',
  cabangOptions,
}: ReportTableProps) {
  const [search, setSearch] = useState('');
  const [showFilter, setShowFilter] = useState(false);
  const [startDate, setStartDate] = useState(toISO(firstOfMonth));
  const [endDate, setEndDate] = useState(toISO(today));
  const [selectedInterval, setSelectedInterval] = useState<string | number>(
    intervalOptions?.[0]?.value ?? 'all'
  );
  const [selectedCabang, setSelectedCabang] = useState<string>(
    cabangOptions?.[0]?.value ?? ''
  );
  const [appliedFilter, setAppliedFilter] = useState<{
    start: string; end: string; interval: string | number; cabang?: string;
  } | null>(null);

  const [showExportMenu, setShowExportMenu] = useState(false);

  const router = useRouter();
  const { openSidebar } = useSidebar();
  const { user } = useAuth();
  const namaKlinik = user?.cabang ?? 'Vmedis Mobile';

  const exportFilename = title.replace(/\s+/g, '_').toLowerCase();

  const getExportData = () =>
    filtered.map((row) =>
      Object.fromEntries(
        columns.map((c) => [c.key, c.render ? String(c.render(row) ?? '') : row[c.key]])
      )
    );

  const handleExportExcel = () => {
    exportToExcel(
      exportFilename,
      columns.map((c) => ({ label: c.label, key: c.key, align: c.align })),
      getExportData(),
      title,
      namaKlinik,
    );
    setShowExportMenu(false);
  };

  const handleExportPdf = () => {
    const subtitle = appliedFilter
      ? `Periode: ${fmtDisplay(appliedFilter.start)} – ${fmtDisplay(appliedFilter.end)}`
      : undefined;
    exportToPdf(
      exportFilename,
      title,
      columns.map((c) => ({ label: c.label, key: c.key, align: c.align })),
      getExportData(),
      namaKlinik,
      subtitle,
    );
    setShowExportMenu(false);
  };

  const applyFilter = () => {
    setAppliedFilter({ start: startDate, end: endDate, interval: selectedInterval, cabang: selectedCabang });
    setShowFilter(false);
  };

  const resetFilter = () => {
    setStartDate(toISO(firstOfMonth));
    setEndDate(toISO(today));
    setSelectedInterval(intervalOptions?.[0]?.value ?? 'all');
    setSelectedCabang(cabangOptions?.[0]?.value ?? '');
    setAppliedFilter(null);
  };

  const filtered = search.trim()
    ? data.filter((row) =>
        searchFields.some((f) =>
          String(row[f] ?? '').toLowerCase().includes(search.toLowerCase())
        )
      )
    : data;

  const activeIntervalLabel = intervalOptions?.find(
    (o) => o.value === (appliedFilter?.interval ?? selectedInterval)
  )?.label;

  return (
    <div className="flex flex-col h-full bg-gray-50">

      {/* ── Header ── */}
      <div
        className="flex-shrink-0 relative overflow-hidden"
        style={{ background: 'linear-gradient(135deg, #1e3a8a 0%, #2563eb 100%)' }}
      >
        <div className="absolute -top-10 -right-10 w-32 h-32 rounded-full bg-white/5 pointer-events-none" />
        <div className="h-14 flex items-center justify-between px-3 relative">
          <div className="w-24 flex justify-start">
            <button
              onClick={() => router.back()}
              className="flex items-center gap-0.5 text-white/90 active:opacity-60 pr-1"
            >
              <svg viewBox="0 0 24 24" className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
                <path d="M15 18l-6-6 6-6" />
              </svg>
              <span className="text-base font-medium">Kembali</span>
            </button>
          </div>
          <div className="flex-1 text-center min-w-0 px-1">
            <p className="text-base font-bold text-white truncate">{title}</p>
          </div>
          <div className="flex items-center justify-end gap-1">
            {/* Export button */}
            <button
              onClick={() => setShowExportMenu(true)}
              className="w-10 h-10 flex items-center justify-center text-white rounded-xl active:bg-white/10"
              title="Export"
            >
              <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 3v12M7 8l5-5 5 5" />
                <path d="M5 20h14" />
              </svg>
            </button>

            {/* Export bottom sheet */}
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
                      onClick={handleExportExcel}
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
                      onClick={handleExportPdf}
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

            <button
              onClick={openSidebar}
              className="w-11 h-11 flex items-center justify-center text-white rounded-xl active:bg-white/10"
            >
              <svg viewBox="0 0 24 24" className="w-7 h-7" fill="currentColor">
                <rect x="3" y="5"  width="18" height="2.5" rx="1.25" />
                <rect x="3" y="11" width="14" height="2.5" rx="1.25" />
                <rect x="3" y="17" width="18" height="2.5" rx="1.25" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* ── Filter Panel ── */}
      <div className="flex-shrink-0 bg-white border-b border-gray-200">

        {/* Toggle row */}
        <button
          onClick={() => setShowFilter((v) => !v)}
          className="w-full flex items-center justify-between px-4 py-2.5 active:bg-gray-50"
        >
          <div className="flex items-center gap-2">
            <span className="text-blue-600">🔽</span>
            <span className="text-sm font-semibold text-blue-600">Filter &amp; Pencarian</span>
            {appliedFilter && (
              <span className="w-2 h-2 rounded-full bg-orange-500 flex-shrink-0" />
            )}
          </div>
          <span
            className="text-blue-600 text-lg leading-none inline-block transition-transform duration-200"
            style={{ transform: showFilter ? 'rotate(180deg)' : 'none' }}
          >
            ▾
          </span>
        </button>

        {/* Active filter chips */}
        {appliedFilter && !showFilter && (
          <div className="px-4 pb-2 flex items-center gap-1.5 flex-wrap">
            {!hideDateFilter && (
              <span className="text-[11px] bg-blue-100 text-blue-700 font-medium px-2 py-0.5 rounded-full">
                📅 {fmtDisplay(appliedFilter.start)} – {fmtDisplay(appliedFilter.end)}
              </span>
            )}
            {intervalOptions && (
              <span className="text-[11px] bg-purple-100 text-purple-700 font-medium px-2 py-0.5 rounded-full">
                {intervalTitle}: {activeIntervalLabel}
              </span>
            )}
            {cabangOptions && appliedFilter.cabang && (
              <span className="text-[11px] bg-green-100 text-green-700 font-medium px-2 py-0.5 rounded-full">
                🏥 {cabangOptions.find(c => c.value === appliedFilter.cabang)?.label}
              </span>
            )}
            <button onClick={resetFilter} className="text-[11px] text-red-500 font-semibold px-1">
              × Reset
            </button>
          </div>
        )}

        {/* Collapsible body */}
        <div
          className="overflow-hidden transition-all duration-300"
          style={{ maxHeight: showFilter ? 700 : 0, opacity: showFilter ? 1 : 0 }}
        >
          <div className="px-4 pb-4 pt-1 space-y-4">

            {/* Cabang select */}
            {cabangOptions && cabangOptions.length > 0 && (
              <SelectInput
                label="Cabang / Klinik"
                value={selectedCabang}
                onChange={setSelectedCabang}
                options={cabangOptions}
              />
            )}

            {/* Interval pills */}
            {intervalOptions && intervalOptions.length > 0 && (
              <div>
                <p className="text-xs font-semibold text-gray-500 mb-2">{intervalTitle}</p>
                <div className="flex flex-wrap gap-1.5">
                  {intervalOptions.map((opt) => (
                    <button
                      key={String(opt.value)}
                      onClick={() => setSelectedInterval(opt.value)}
                      className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-colors ${
                        selectedInterval === opt.value
                          ? 'bg-blue-600 text-white shadow-sm'
                          : 'bg-gray-100 text-gray-700 active:bg-gray-200'
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Date range pickers */}
            {!hideDateFilter && (
              <div>
                <p className="text-xs font-semibold text-gray-500 mb-2">Rentang Tanggal</p>
                <div className="flex gap-3">
                  <DatePickerInput
                    label="Tanggal Awal"
                    value={startDate}
                    onChange={setStartDate}
                    maxDate={endDate}
                  />
                  <DatePickerInput
                    label="Tanggal Akhir"
                    value={endDate}
                    onChange={setEndDate}
                    minDate={startDate}
                  />
                </div>

                {/* Quick presets */}
                <div className="mt-2.5">
                  <p className="text-[10px] text-gray-400 font-medium uppercase tracking-wide mb-1.5">
                    Preset Cepat
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {[
                      { label: 'Hari Ini', fn: () => { const d = toISO(new Date()); setStartDate(d); setEndDate(d); } },
                      { label: '7 Hari', fn: () => { const e = new Date(); const s = new Date(); s.setDate(s.getDate()-6); setStartDate(toISO(s)); setEndDate(toISO(e)); } },
                      { label: '30 Hari', fn: () => { const e = new Date(); const s = new Date(); s.setDate(s.getDate()-29); setStartDate(toISO(s)); setEndDate(toISO(e)); } },
                      { label: 'Bulan Ini', fn: () => { const e = new Date(); const s = new Date(e.getFullYear(), e.getMonth(), 1); setStartDate(toISO(s)); setEndDate(toISO(e)); } },
                      { label: 'Bulan Lalu', fn: () => { const now = new Date(); const s = new Date(now.getFullYear(), now.getMonth()-1, 1); const e = new Date(now.getFullYear(), now.getMonth(), 0); setStartDate(toISO(s)); setEndDate(toISO(e)); } },
                    ].map((p) => (
                      <button
                        key={p.label}
                        onClick={p.fn}
                        className="px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700 active:bg-gray-200 border border-gray-200"
                      >
                        {p.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Search */}
            {searchFields.length > 0 && (
              <div>
                <p className="text-xs font-semibold text-gray-500 mb-2">Pencarian</p>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">🔍</span>
                  <input
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder={searchPlaceholder}
                    className="w-full pl-9 pr-9 py-2.5 bg-gray-100 rounded-xl text-sm outline-none"
                  />
                  {search && (
                    <button onClick={() => setSearch('')}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 font-bold">✕</button>
                  )}
                </div>
              </div>
            )}

            {/* Action buttons */}
            <div className="flex gap-2.5 pt-1">
              <button
                onClick={resetFilter}
                className="flex-1 py-3 rounded-xl text-sm font-semibold bg-gray-100 text-gray-700 active:bg-gray-200"
              >
                Reset
              </button>
              <button
                onClick={applyFilter}
                className="flex-1 py-3 rounded-xl text-sm font-bold bg-blue-600 text-white shadow-md active:bg-blue-700"
              >
                Terapkan Filter
              </button>
            </div>
          </div>
        </div>

        {/* Always-visible search (when filter closed) */}
        {!showFilter && searchFields.length > 0 && (
          <div className="px-4 pb-2.5">
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">🔍</span>
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder={searchPlaceholder}
                className="w-full pl-9 pr-9 py-2 bg-gray-100 rounded-xl text-sm outline-none"
              />
              {search && (
                <button onClick={() => setSearch('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 font-bold">✕</button>
              )}
            </div>
          </div>
        )}
      </div>

      {/* ── Table ── */}
      <div className="flex-1 overflow-hidden flex flex-col">
        <div className="flex-1 overflow-auto">
          <table
            className="w-full border-collapse"
            style={{ minWidth: columns.reduce((s, c) => s + (c.width ?? 100), 0) }}
          >
            <thead className="sticky top-0 z-10">
              <tr className="bg-blue-700">
                {columns.map((col) => (
                  <th
                    key={col.key}
                    className="py-2.5 px-2 text-xs font-bold text-white whitespace-nowrap border-r border-blue-600 last:border-r-0"
                    style={{ minWidth: col.width ?? 80, textAlign: col.align ?? 'left' }}
                  >
                    {col.label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={columns.length} className="text-center py-16">
                    <div className="flex flex-col items-center gap-2 text-gray-400">
                      <span className="text-4xl">📋</span>
                      <span className="text-sm">Tidak ada data</span>
                    </div>
                  </td>
                </tr>
              ) : (
                filtered.map((row, i) => (
                  <tr key={i}
                    className={`border-b border-gray-100 ${i % 2 === 0 ? 'bg-white' : 'bg-gray-50/60'}`}>
                    {columns.map((col) => (
                      <td
                        key={col.key}
                        className="py-2.5 px-2 text-xs text-gray-800 align-top border-r border-gray-100 last:border-r-0"
                        style={{ minWidth: col.width ?? 80, textAlign: col.align ?? 'left', wordBreak: 'break-word' }}
                      >
                        {col.render ? col.render(row) : String(row[col.key] ?? '-')}
                      </td>
                    ))}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Grand total */}
        {totalLabel && totalValue && (
          <div className="flex-shrink-0 border-t-2 border-blue-300 bg-blue-50 px-4 py-3 flex items-center justify-between">
            <span className="text-xs font-bold text-blue-800">{totalLabel}</span>
            <span className="text-sm font-extrabold text-blue-900">{totalValue}</span>
          </div>
        )}

        {/* Status bar */}
        <div className="flex-shrink-0 bg-white border-t border-gray-100 px-4 py-2 flex items-center justify-between gap-2">
          <span className="text-[10px] text-gray-400 flex-1 min-w-0">
            <span>{filtered.length} dari {data.length} data</span>
            {appliedFilter && !hideDateFilter && (
              <span className="text-blue-500"> · {fmtDisplay(appliedFilter.start)} – {fmtDisplay(appliedFilter.end)}</span>
            )}
            {appliedFilter && intervalOptions && (
              <span className="text-purple-500"> · {activeIntervalLabel}</span>
            )}
          </span>
          {search && (
            <button onClick={() => setSearch('')} className="text-[10px] text-blue-600 font-semibold flex-shrink-0">
              Hapus cari
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
