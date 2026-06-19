'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSidebar } from '@/lib/sidebarContext';
import { useAuth } from '@/lib/authContext';
import DatePickerInput from './DatePickerInput';
import SelectInput from './SelectInput';
import { exportToExcel, exportToPdf } from '@/lib/exportUtils';

const ID_MONTHS: Record<string, number> = {
  Jan:1, Feb:2, Mar:3, Apr:4, Mei:5, Jun:6, Jul:7, Agt:8, Sep:9, Okt:10, Nov:11, Des:12,
};

function parseIdDate(s: string): string | null {
  if (!s) return null;
  const parts = s.trim().split(/\s+/);
  if (parts.length < 3) return null;
  const mNum = ID_MONTHS[parts[1]];
  if (!mNum) return null;
  return `${parts[2]}-${String(mNum).padStart(2, '0')}-${parts[0].padStart(2, '0')}`;
}

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

export interface GudangOption {
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
  /** Field name in data row that contains the date string (Indonesian format) */
  dateField?: string;
  /** Options for gudang filter */
  gudangOptions?: GudangOption[];
  /** Field name in data row to apply gudang filter against */
  gudangField?: string;
  /** Callback to fetch data from API */
  onFetchData?: (filters: { start: string; end: string; search: string; interval: string | number; cabang: string; gudang: string; offset: number; limit: number }) => void;
  loading?: boolean;
  error?: string | null;
  /** Whether there is more data to load */
  hasMore?: boolean;
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
  dateField,
  gudangOptions,
  gudangField,
  onFetchData,
  loading,
  error,
  hasMore = false,
}: ReportTableProps) {
  const [search, setSearch] = useState('');
  const [appliedSearch, setAppliedSearch] = useState('');
  const [showFilter, setShowFilter] = useState(false);
  const [startDate, setStartDate] = useState(toISO(firstOfMonth));
  const [endDate, setEndDate] = useState(toISO(today));
  const [selectedInterval, setSelectedInterval] = useState<string | number>(
    intervalOptions?.[0]?.value ?? 'all'
  );
  const [selectedCabang, setSelectedCabang] = useState<string>(
    cabangOptions?.[0]?.value ?? ''
  );
  const [selectedGudang, setSelectedGudang] = useState<string>(
    gudangOptions?.[0]?.value ?? ''
  );
  const [appliedFilter, setAppliedFilter] = useState<{
    start: string; end: string; interval: string | number; cabang?: string; gudang?: string;
  } | null>(null);

  const [sortKey, setSortKey] = useState<string | null>(null);
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc');
  const [offset, setOffset] = useState(0);
  const limit = 50;

  const handleSort = (key: string) => {
    if (sortKey === key) {
      setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortKey(key);
      setSortDir('asc');
    }
  };

  const [showExportMenu, setShowExportMenu] = useState(false);

  const router = useRouter();
  const { openSidebar } = useSidebar();
  const { user } = useAuth();
  const namaKlinik = user?.cabang ?? 'Vmedis Mobile';

  // Initial fetch
  useEffect(() => {
    if (onFetchData) {
      onFetchData({
        start: startDate,
        end: endDate,
        search: '',
        interval: selectedInterval,
        cabang: selectedCabang,
        gudang: selectedGudang,
        offset: 0,
        limit,
      });
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleLoadMore = () => {
    if (loading || !hasMore) return;
    const newOffset = offset + limit;
    setOffset(newOffset);
    if (onFetchData) {
      onFetchData({
        start: startDate,
        end: endDate,
        search: appliedSearch,
        interval: selectedInterval,
        cabang: selectedCabang,
        gudang: selectedGudang,
        offset: newOffset,
        limit,
      });
    }
  };

  const exportFilename = title.replace(/\s+/g, '_').toLowerCase();

  const getExportData = () =>
    sorted.map((row) =>
      Object.fromEntries(
        columns.map((c) => [c.key, c.render ? String(c.render(row) ?? '') : row[c.key]])
      )
    );

  const handleExportExcel = async () => {
    if (sorted.length === 0) {
      alert('Tidak ada data yang bisa dicetak!');
      setShowExportMenu(false);
      return;
    }
    await exportToExcel(
      exportFilename,
      columns.map((c) => ({ label: c.label, key: c.key, align: c.align })),
      getExportData(),
      title,
      namaKlinik,
    );
    setShowExportMenu(false);
  };

  const handleExportPdf = async () => {
    if (sorted.length === 0) {
      alert('Tidak ada data yang bisa dicetak!');
      setShowExportMenu(false);
      return;
    }
    const subtitle = appliedFilter
      ? `Periode: ${fmtDisplay(appliedFilter.start)} – ${fmtDisplay(appliedFilter.end)}`
      : undefined;
    await exportToPdf(
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
    setAppliedFilter({ start: startDate, end: endDate, interval: selectedInterval, cabang: selectedCabang, gudang: selectedGudang });
    setAppliedSearch(search);
    setShowFilter(false);
    setOffset(0);
    if (onFetchData) {
      onFetchData({ start: startDate, end: endDate, search, interval: selectedInterval, cabang: selectedCabang, gudang: selectedGudang, offset: 0, limit });
    }
  };

  const resetFilter = () => {
    const defaultStart = toISO(firstOfMonth);
    const defaultEnd = toISO(today);
    const defaultInterval = intervalOptions?.[0]?.value ?? 'all';
    const defaultCabang = cabangOptions?.[0]?.value ?? '';
    const defaultGudang = gudangOptions?.[0]?.value ?? '';

    setStartDate(defaultStart);
    setEndDate(defaultEnd);
    setSelectedInterval(defaultInterval);
    setSelectedCabang(defaultCabang);
    setSelectedGudang(defaultGudang);
    setSortKey(null);
    setSortDir('asc');
    setAppliedFilter(null);
    setSearch('');
    setAppliedSearch('');
    setOffset(0);

    if (onFetchData) {
      onFetchData({ start: defaultStart, end: defaultEnd, search: '', interval: defaultInterval, cabang: defaultCabang, gudang: defaultGudang, offset: 0, limit });
    }
  };

  // ── Filtering ──────────────────────────────────────────────────────────
  let filtered: Record<string, unknown>[] = data;

  // Text search (applied via Terapkan Filter)
  if (appliedSearch.trim() && searchFields.length > 0) {
    filtered = filtered.filter((row) =>
      searchFields.some((f) =>
        String(row[f] ?? '').toLowerCase().includes(appliedSearch.toLowerCase())
      )
    );
  }

  // Date range filter
  if (!hideDateFilter && appliedFilter && dateField) {
    const { start, end } = appliedFilter;
    filtered = filtered.filter((row) => {
      const iso = parseIdDate(String(row[dateField] ?? ''));
      if (!iso) return true;
      return iso >= start && iso <= end;
    });
  }

  // Gudang filter
  if (appliedFilter?.gudang && appliedFilter.gudang !== '' && gudangField) {
    const gv = appliedFilter.gudang;
    filtered = filtered.filter((row) => String(row[gudangField] ?? '') === gv);
  }

  // ── Sorting ─────────────────────────────────────────────────────────────
  const sorted = sortKey
    ? [...filtered].sort((a, b) => {
        const av = String(a[sortKey] ?? '');
        const bv = String(b[sortKey] ?? '');
        const cmp = av.localeCompare(bv, 'id', { numeric: true });
        return sortDir === 'asc' ? cmp : -cmp;
      })
    : filtered;

  const activeIntervalLabel = intervalOptions?.find(
    (o) => o.value === (appliedFilter?.interval ?? selectedInterval)
  )?.label;

  return (
    <div className="flex flex-col h-full bg-gray-50">

      {/* ── Header ── */}
      <div className="relative z-10 mb-4">
        <div className="px-6 pt-8 pb-2 flex items-center justify-between gap-4">
          <div className="flex-shrink-0 self-start">
            <button
              onClick={() => router.back()}
              className="w-12 h-12 flex items-center justify-center rounded-full bg-white shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] active:scale-95 transition-transform text-gray-700"
            >
              <svg viewBox="0 0 24 24" className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
                <path d="M15 18l-6-6 6-6" />
              </svg>
            </button>
          </div>
          <div className="flex-1 flex flex-col justify-center min-w-0">
            <h1 className="text-[22px] font-bold text-gray-900 tracking-tight leading-tight">
              {title}
            </h1>
          </div>
          <div className="flex items-center justify-end gap-1">
            {/* Export button */}
            <button
              onClick={() => setShowExportMenu(true)}
              className="w-12 h-12 flex items-center justify-center rounded-full bg-white shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] active:scale-95 transition-transform text-gray-700"
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
              className="w-12 h-12 flex items-center justify-center rounded-full bg-white shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] active:scale-95 transition-transform"
            >
              <svg viewBox="0 0 24 24" className="w-6 h-6 text-gray-700" fill="currentColor">
                <rect x="4" y="6"  width="16" height="2" rx="1" />
                <rect x="4" y="11" width="12" height="2" rx="1" />
                <rect x="4" y="16" width="16" height="2" rx="1" />
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
            {gudangOptions && appliedFilter.gudang && appliedFilter.gudang !== '' && (
              <span className="text-[11px] bg-orange-100 text-orange-700 font-medium px-2 py-0.5 rounded-full">
                🏪 {gudangOptions.find(g => g.value === appliedFilter.gudang)?.label}
              </span>
            )}
            {sortKey && (
              <span className="text-[11px] bg-gray-100 text-gray-600 font-medium px-2 py-0.5 rounded-full">
                ⇅ {columns.find(c => c.key === sortKey)?.label} {sortDir === 'asc' ? '▲' : '▼'}
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

            {/* Gudang select */}
            {gudangOptions && gudangOptions.length > 0 && (
              <SelectInput
                label="Gudang"
                value={selectedGudang}
                onChange={setSelectedGudang}
                options={gudangOptions}
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

      </div>

      {/* ── Table ── */}
      <div className="flex-1 overflow-hidden flex flex-col">
        <div 
          className="flex-1 overflow-auto"
          onScroll={(e) => {
            const target = e.target as HTMLDivElement;
            if (target.scrollHeight - target.scrollTop <= target.clientHeight + 100) {
              handleLoadMore();
            }
          }}
        >
          <table
            className="w-full border-collapse"
            style={{ minWidth: columns.reduce((s, c) => s + (c.width ?? 100), 0) }}
          >
            <thead className="sticky top-0 z-10">
              <tr className="bg-gray-100">
                {columns.map((col) => (
                  <th
                    key={col.key}
                    onClick={() => handleSort(col.key)}
                    className="py-2.5 px-2 text-xs font-bold text-gray-700 whitespace-nowrap border-r border-gray-200 last:border-r-0 cursor-pointer select-none active:bg-gray-200"
                    style={{ minWidth: col.width ?? 80, textAlign: col.align ?? 'left' }}
                  >
                    {col.label}
                    <span className="ml-1 text-[9px] opacity-70">
                      {sortKey === col.key ? (sortDir === 'asc' ? '▲' : '▼') : '⇅'}
                    </span>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={columns.length} className="text-center py-16">
                    <div className="flex flex-col items-center gap-2 text-gray-400">
                      <span className="text-4xl animate-spin">⏳</span>
                      <span className="text-sm">Memuat data...</span>
                    </div>
                  </td>
                </tr>
              ) : error ? (
                <tr>
                  <td colSpan={columns.length} className="text-center py-16">
                    <div className="flex flex-col items-center gap-2 text-red-400">
                      <span className="text-4xl">⚠️</span>
                      <span className="text-sm">{error}</span>
                    </div>
                  </td>
                </tr>
              ) : sorted.length === 0 ? (
                <tr>
                  <td colSpan={columns.length} className="text-center py-16">
                    <div className="flex flex-col items-center gap-2 text-gray-400">
                      <span className="text-4xl">📋</span>
                      <span className="text-sm">Tidak ada data</span>
                    </div>
                  </td>
                </tr>
              ) : (
                <>
                  {sorted.map((row, i) => (
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
                  ))}
                  {loading && hasMore && (
                    <tr>
                      <td colSpan={columns.length} className="text-center py-4">
                        <div className="flex justify-center items-center gap-2 text-gray-400">
                          <span className="animate-spin">⏳</span>
                          <span className="text-xs">Memuat data selanjutnya...</span>
                        </div>
                      </td>
                    </tr>
                  )}
                </>
              )}
            </tbody>
          </table>
          
          {/* Spacer inside the scrollable area to prevent content from being hidden behind the floating total */}
          {totalLabel && totalValue && (
            <div className="h-28" />
          )}
        </div>

        {/* Grand total (Floating) */}
        {totalLabel && totalValue && (
          <div className="fixed bottom-4 left-4 right-4 bg-white/90 backdrop-blur-md rounded-2xl shadow-lg px-5 py-4 flex items-center justify-between z-50">
            <span className="text-sm font-bold text-blue-800">{totalLabel}</span>
            <span className="text-lg font-extrabold text-blue-900">{totalValue}</span>
          </div>
        )}
      </div>
    </div>
  );
}
