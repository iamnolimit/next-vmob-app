'use client';
import { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import LiquidPullToRefresh from './LiquidPullToRefresh';
import { useRouter } from 'next/navigation';
import { useSidebar } from '@/lib/sidebarContext';
import { useAuth } from '@/lib/authContext';
import { useCabangOptions } from '@/lib/useCabangOptions';
import DatePickerInput from './DatePickerInput';
import MonthPickerInput from './MonthPickerInput';
import YearPickerInput from './YearPickerInput';
import SelectInput from './SelectInput';
import { useGudangOptions } from '@/lib/useGudangOptions';
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
  reg?: string;
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
  /** Callback to fetch data from API (always resets to offset 0) */
  onFetchData?: (filters: { start: string; end: string; search: string; interval: string | number; cabang: string; cabangReg: string; gudang: string; offset: number; limit: number; periodType: 'tanggal' | 'bulan' | 'tahun' }) => void;
  /** Callback to load the next page (append mode) */
  onLoadMore?: () => void;
  /** Callback to clear data when filter is reset (without re-fetching) */
  onReset?: () => void;
  loading?: boolean;
  error?: string | null;
  /** Whether there is more data to load */
  hasMore?: boolean;
  /** Default sort column key */
  defaultSortKey?: string;
  /** Default sort direction */
  defaultSortDir?: 'asc' | 'desc';
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
  onLoadMore,
  onReset,
  loading,
  error,
  hasMore = false,
  defaultSortKey,
  defaultSortDir = 'asc',
}: ReportTableProps) {
  const [search, setSearch] = useState('');
  const [showFilter, setShowFilter] = useState(true);
  const [startDate, setStartDate] = useState(toISO(today));
  const [endDate, setEndDate] = useState(toISO(today));
  const [dateFilterType, setDateFilterType] = useState<'tanggal' | 'bulan' | 'tahun'>('tanggal');
  const [selectedMonth, setSelectedMonth] = useState<string>(() => {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
  });
  const [selectedYear, setSelectedYear] = useState<string>(() => new Date().getFullYear().toString());
  const [selectedInterval, setSelectedInterval] = useState<string | number>(
    intervalOptions?.[0]?.value ?? 'all'
  );
  const { user } = useAuth();
  // Fetch cabang from API; fall back to prop if provided
  const { cabangOptions: fetchedCabangOptions } = useCabangOptions();
  const resolvedCabangOptions = cabangOptions ?? fetchedCabangOptions;
  // Fetch gudang from API; fall back to prop if provided
  const { gudangOptions: fetchedGudangOptions } = useGudangOptions();
  const resolvedGudangOptions = gudangField ? (gudangOptions ?? fetchedGudangOptions) : undefined;

  // Initialize from prop or user.app_id (available immediately from auth)
  const [selectedCabang, setSelectedCabang] = useState<string>(
    cabangOptions?.[0]?.value ?? ''
  );
  const [selectedCabangReg, setSelectedCabangReg] = useState<string>(
    cabangOptions?.[0]?.reg ?? ''
  );

  // As soon as user is available, set selectedCabang so initial fetch has a valid 'a'
  const initialCabangSetRef = useRef(false);
  if (!initialCabangSetRef.current && user?.app_id && !selectedCabang) {
    initialCabangSetRef.current = true;
    setSelectedCabang(user.app_id);
    setSelectedCabangReg(user.app_reg ?? '');
  }
  const [selectedGudang, setSelectedGudang] = useState<string>('');
  const [appliedFilter, setAppliedFilter] = useState<{
    start: string; end: string; interval: string | number; cabang?: string; gudang?: string; periodType?: 'tanggal' | 'bulan' | 'tahun';
  } | null>(null);

  const [sortKey, setSortKey] = useState<string | null>(defaultSortKey ?? null);
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>(defaultSortDir);
  const [isFiltering, setIsFiltering] = useState(false);
  const [showExportMenu, setShowExportMenu] = useState(false);
  const limit = 50;

  // Track whether we have any data yet (to distinguish initial load vs load-more)
  const hasDataRef = useRef(false);
  // Ref to the scrollable container so we can preserve scroll position
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  // Saved scroll position before load-more appends data
  const savedScrollTopRef = useRef<number>(0);

  const handleSort = (key: string) => {
    if (sortKey === key) {
      setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortKey(key);
      setSortDir('asc');
    }
  };

  const router = useRouter();
  const { openSidebar } = useSidebar();

  // When fetched cabang options arrive, set default to the one matching user.app_id
  useEffect(() => {
    if (cabangOptions) return; // prop takes priority
    if (fetchedCabangOptions.length === 0) return;
    const match = fetchedCabangOptions.find((c) => c.value === user?.app_id)
      ?? fetchedCabangOptions[0];
    setSelectedCabang(match.value);
    setSelectedCabangReg(match.reg ?? user?.app_reg ?? '');
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fetchedCabangOptions]);

  // Initial fetch — wait until we have a valid cabang (user.app_id)
  const didInitialFetchRef = useRef(false);
  useEffect(() => {
    if (didInitialFetchRef.current) return;
    const cabang = selectedCabang || user?.app_id || '';
    const cabangReg = selectedCabangReg || user?.app_reg || '';
    if (!cabang || !cabangReg) return; // wait for user to load
    didInitialFetchRef.current = true;
    if (onFetchData) {
      onFetchData({
        start: startDate,
        end: endDate,
        search: '',
        interval: selectedInterval,
        cabang,
        cabangReg,
        gudang: selectedGudang,
        offset: 0,
        limit,
        periodType: dateFilterType,
      });
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.app_id, user?.app_reg, selectedCabang, selectedCabangReg]);

  const handleLoadMore = () => {
    if (loading || !hasMore) return;
    // Save current scroll position before appending data
    if (scrollContainerRef.current) {
      savedScrollTopRef.current = scrollContainerRef.current.scrollTop;
    }
    if (onLoadMore) {
      onLoadMore();
    }
  };

  // After data changes, update hasDataRef and restore scroll position on append
  useEffect(() => {
    if (data.length > 0) {
      hasDataRef.current = true;
    } else {
      hasDataRef.current = false;
    }
    // Only restore scroll if we were appending (savedScrollTop > 0)
    if (savedScrollTopRef.current > 0 && scrollContainerRef.current) {
      const saved = savedScrollTopRef.current;
      savedScrollTopRef.current = 0; // clear so it doesn't re-apply
      requestAnimationFrame(() => {
        if (scrollContainerRef.current) {
          scrollContainerRef.current.scrollTop = saved;
        }
      });
    }
  }, [data]);

  // Clear filtering overlay when loading finishes
  useEffect(() => {
    if (!loading) setIsFiltering(false);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loading]);

  // Update both cabang value and its reg together when user changes selection
  const handleCabangChange = (value: string) => {
    const found = resolvedCabangOptions.find((c) => c.value === value);
    setSelectedCabang(value);
    setSelectedCabangReg(found?.reg ?? user?.app_reg ?? '');
  };

  const applyFilter = () => {
    let finalStart = startDate;
    let finalEnd = endDate;

    if (dateFilterType === 'bulan') {
      const [y, m] = selectedMonth.split('-');
      finalStart = `${y}-${m}-01`;
      const lastDay = new Date(Number(y), Number(m), 0).getDate();
      finalEnd = `${y}-${m}-${String(lastDay).padStart(2, '0')}`;
    } else if (dateFilterType === 'tahun') {
      finalStart = `${selectedYear}-01-01`;
      finalEnd = `${selectedYear}-12-31`;
    }

    setAppliedFilter({ start: finalStart, end: finalEnd, interval: selectedInterval, cabang: selectedCabang, gudang: selectedGudang, periodType: dateFilterType });
    setShowFilter(false);
    setIsFiltering(true);
    if (onFetchData) {
      onFetchData({ start: finalStart, end: finalEnd, search, interval: selectedInterval, cabang: selectedCabang, cabangReg: selectedCabangReg, gudang: selectedGudang, offset: 0, limit, periodType: dateFilterType });
    }
  };

  const resetFilter = () => {
    const defaultStart = toISO(today);
    const defaultEnd = toISO(today);
    const defaultInterval = intervalOptions?.[0]?.value ?? 'all';
    const defaultCabangObj = resolvedCabangOptions.find((c) => c.value === user?.app_id)
      ?? resolvedCabangOptions[0];
    const defaultCabang = defaultCabangObj?.value ?? user?.app_id ?? '';
    const defaultCabangReg = defaultCabangObj?.reg ?? user?.app_reg ?? '';

    setStartDate(defaultStart);
    setEndDate(defaultEnd);
    setDateFilterType('tanggal');
    const d = new Date();
    setSelectedMonth(`${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`);
    setSelectedYear(d.getFullYear().toString());
    setSelectedInterval(defaultInterval);
    setSelectedCabang(defaultCabang);
    setSelectedCabangReg(defaultCabangReg);
    setSelectedGudang('');
    setSortKey(null);
    setSortDir('asc');
    setAppliedFilter(null);
    setSearch('');
    setShowFilter(true);

    // Call onReset first to clear stale data & lastFilterParamsRef in useReportData,
    // then immediately re-fetch with the default filter params so the API always
    // receives valid tanggalawal/tanggalakhir and never returns 500.
    if (onReset) onReset();
    if (onFetchData) {
      onFetchData({
        start: defaultStart,
        end: defaultEnd,
        search: '',
        interval: defaultInterval,
        cabang: defaultCabang,
        cabangReg: defaultCabangReg,
        gudang: '',
        offset: 0,
        limit,
        periodType: 'tanggal',
      });
    }
  };

  // ── Sorting (client-side only; all filtering is done server-side) ──────
  // Matches yyyy-mm-dd or yyyy-mm-dd HH:mm:ss — lexicographic order = chronological
  const ISO_DATE_RE = /^\d{4}-\d{2}-\d{2}/;
  const sorted = sortKey
    ? [...data].sort((a, b) => {
        const av = String(a[sortKey] ?? '');
        const bv = String(b[sortKey] ?? '');
        const cmp = (ISO_DATE_RE.test(av) && ISO_DATE_RE.test(bv))
          ? av < bv ? -1 : av > bv ? 1 : 0
          : av.localeCompare(bv, 'id', { numeric: true });
        return sortDir === 'asc' ? cmp : -cmp;
      })
    : data;

  const handleRefresh = async () => {
    if (onFetchData) {
      await onFetchData({
        start: appliedFilter?.start || startDate,
        end: appliedFilter?.end || endDate,
        search,
        cabang: appliedFilter?.cabang || selectedCabang,
        cabangReg: selectedCabangReg,
        gudang: appliedFilter?.gudang || selectedGudang,
        interval: appliedFilter?.interval || selectedInterval,
        offset: 0,
        limit,
        periodType: appliedFilter?.periodType || dateFilterType
      });
    }
  };

  const activeIntervalLabel = intervalOptions?.find(
    (o) => o.value === (appliedFilter?.interval ?? selectedInterval)
  )?.label;

  const handleExportPdf = async () => {
    const klinikName = resolvedCabangOptions.find(c => c.value === selectedCabang)?.label || user?.cabang || 'Klinik';
    let subtitle = '';
    if (appliedFilter) {
      if (appliedFilter.periodType === 'tanggal') {
        subtitle = `Periode: ${fmtDisplay(appliedFilter.start)} - ${fmtDisplay(appliedFilter.end)}`;
      } else if (appliedFilter.periodType === 'bulan') {
        subtitle = `Periode: ${fmtDisplay(appliedFilter.start).substring(3)}`;
      } else if (appliedFilter.periodType === 'tahun') {
        subtitle = `Tahun: ${appliedFilter.start.substring(0, 4)}`;
      }
    } else {
      subtitle = `Periode: ${fmtDisplay(startDate)} - ${fmtDisplay(endDate)}`;
    }
    
    await exportToPdf(
      `${title} - ${klinikName}`,
      title,
      columns.map(c => ({ label: c.label, key: c.key, align: c.align })),
      sorted,
      klinikName,
      subtitle
    );
    setShowExportMenu(false);
  };

  const handleExportExcel = async () => {
    const klinikName = resolvedCabangOptions.find(c => c.value === selectedCabang)?.label || user?.cabang || 'Klinik';
    await exportToExcel(
      `${title} - ${klinikName}`,
      columns.map(c => ({ label: c.label, key: c.key, align: c.align })),
      sorted,
      title,
      klinikName
    );
    setShowExportMenu(false);
  };

  const headerNode = (
    <>
      {/* ── Header ── */}
      <div className="mb-4 bg-primary-accent rounded-b-[2.5rem] pb-2 shadow-[0_4px_16px_rgba(0,0,0,0.18)]">
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
            <h1 className="text-[22px] font-bold text-white tracking-tight leading-tight">
              {title}
            </h1>
          </div>
          <div className="flex items-center justify-end gap-2">
            <button
              onClick={() => setShowExportMenu(true)}
              className="w-12 h-12 flex items-center justify-center rounded-full bg-white shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] active:scale-95 transition-transform"
            >
              <svg viewBox="0 0 24 24" className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                <polyline points="7 10 12 15 17 10" />
                <line x1="12" y1="15" x2="12" y2="3" />
              </svg>
            </button>

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
    </>
  );

  const filterPanel = (
    <>
      {/* ── Filter Panel ── */}
      <div className="flex-shrink-0 bg-white border-b border-gray-100 shadow-sm rounded-t-2xl">

        {/* Toggle row */}
        <button
          onClick={() => setShowFilter((v) => !v)}
          className="w-full flex items-center justify-between px-4 py-3 active:bg-primary-accent/5 transition-colors"
        >
          <div className="flex items-center gap-2.5">
            {/* Sliders icon */}
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
            <span className="text-sm font-semibold text-primary-accent">Filter &amp; Pencarian</span>
            {appliedFilter && (
              <span className="inline-flex items-center gap-1 bg-primary-accent text-white text-[10px] font-bold px-2 py-0.5 rounded-full leading-none">
                Aktif
              </span>
            )}
          </div>
          {/* Chevron icon */}
          <svg
            viewBox="0 0 24 24"
            className="w-4 h-4 text-primary-accent transition-transform duration-200 flex-shrink-0"
            style={{ transform: showFilter ? 'rotate(180deg)' : 'none' }}
            fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round"
          >
            <path d="M6 9l6 6 6-6" />
          </svg>
        </button>

        {/* Active filter chips */}
        {appliedFilter && !showFilter && (
          <div className="px-4 pb-3 flex items-center gap-1.5 flex-wrap">
            {!hideDateFilter && (
              <span className="inline-flex items-center gap-1 text-[11px] bg-primary-accent/8 text-primary-accent font-medium px-2.5 py-1 rounded-full border border-primary-accent/15">
                <svg viewBox="0 0 24 24" className="w-3 h-3 flex-shrink-0" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="4" width="18" height="18" rx="2" />
                  <line x1="16" y1="2" x2="16" y2="6" />
                  <line x1="8" y1="2" x2="8" y2="6" />
                  <line x1="3" y1="10" x2="21" y2="10" />
                </svg>
                {fmtDisplay(appliedFilter.start)} – {fmtDisplay(appliedFilter.end)}
              </span>
            )}
            {intervalOptions && (
              <span className="inline-flex items-center gap-1 text-[11px] bg-primary-accent/8 text-primary-accent font-medium px-2.5 py-1 rounded-full border border-primary-accent/15">
                <svg viewBox="0 0 24 24" className="w-3 h-3 flex-shrink-0" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="9" />
                  <polyline points="12 7 12 12 15 15" />
                </svg>
                {intervalTitle}: {activeIntervalLabel}
              </span>
            )}
            {cabangOptions && appliedFilter.cabang && (
              <span className="inline-flex items-center gap-1 text-[11px] bg-primary-accent/8 text-primary-accent font-medium px-2.5 py-1 rounded-full border border-primary-accent/15">
                <svg viewBox="0 0 24 24" className="w-3 h-3 flex-shrink-0" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                  <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
                  <polyline points="9 22 9 12 15 12 15 22" />
                </svg>
                {cabangOptions.find(c => c.value === appliedFilter.cabang)?.label}
              </span>
            )}
            {gudangOptions && appliedFilter.gudang && appliedFilter.gudang !== '' && (
              <span className="inline-flex items-center gap-1 text-[11px] bg-primary-accent/8 text-primary-accent font-medium px-2.5 py-1 rounded-full border border-primary-accent/15">
                <svg viewBox="0 0 24 24" className="w-3 h-3 flex-shrink-0" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="7" width="20" height="14" rx="2" />
                  <path d="M16 7V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v2" />
                </svg>
                {gudangOptions.find(g => g.value === appliedFilter.gudang)?.label}
              </span>
            )}
            {sortKey && (
              <span className="inline-flex items-center gap-1 text-[11px] bg-primary-accent/8 text-primary-accent font-medium px-2.5 py-1 rounded-full border border-primary-accent/15">
                <svg viewBox="0 0 24 24" className="w-3 h-3 flex-shrink-0" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                  <path d="M7 16V4m0 0L3 8m4-4l4 4M17 8v12m0 0l4-4m-4 4l-4-4" />
                </svg>
                {columns.find(c => c.key === sortKey)?.label} {sortDir === 'asc' ? '↑' : '↓'}
              </span>
            )}
            <button
              onClick={resetFilter}
              className="inline-flex items-center gap-1 text-[11px] text-primary-accent font-semibold px-2.5 py-1 rounded-full border border-primary-accent/30 active:bg-primary-accent/10 transition-colors"
            >
              <svg viewBox="0 0 24 24" className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round">
                <path d="M18 6L6 18M6 6l12 12" />
              </svg>
              Reset
            </button>
          </div>
        )}

        {/* Collapsible body */}
        <div
          className="transition-all duration-300"
          style={{ 
            maxHeight: showFilter ? 700 : 0, 
            opacity: showFilter ? 1 : 0,
            overflow: showFilter ? 'visible' : 'hidden'
          }}
        >
          <div className="px-4 pb-4 pt-1 space-y-4">

            {/* Cabang select */}
            {resolvedCabangOptions.length > 1 && (
              <div>
                <p className="text-xs font-semibold text-gray-500 mb-1.5 flex items-center gap-1.5">
                  <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 text-primary-accent" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                    <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
                    <polyline points="9 22 9 12 15 12 15 22" />
                  </svg>
                  Cabang / Klinik
                </p>
                <SelectInput
                  label=""
                  value={selectedCabang}
                  onChange={handleCabangChange}
                  options={resolvedCabangOptions}
                />
              </div>
            )}

            {/* Gudang select */}
            {resolvedGudangOptions && resolvedGudangOptions.length > 0 && (
              <div>
                <p className="text-xs font-semibold text-gray-500 mb-1.5 flex items-center gap-1.5">
                  <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 text-primary-accent" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                    <rect x="2" y="7" width="20" height="14" rx="2" />
                    <path d="M16 7V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v2" />
                  </svg>
                  Gudang
                </p>
                <SelectInput
                  label=""
                  value={selectedGudang}
                  onChange={setSelectedGudang}
                  options={resolvedGudangOptions}
                />
              </div>
            )}

            {/* Interval pills */}
            {intervalOptions && intervalOptions.length > 0 && (
              <div>
                <p className="text-xs font-semibold text-gray-500 mb-2 flex items-center gap-1.5">
                  <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 text-primary-accent" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="9" />
                    <polyline points="12 7 12 12 15 15" />
                  </svg>
                  {intervalTitle}
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {intervalOptions.map((opt) => (
                    <button
                      key={String(opt.value)}
                      onClick={() => setSelectedInterval(opt.value)}
                      className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-colors ${
                        selectedInterval === opt.value
                          ? 'bg-primary-accent text-white shadow-sm'
                          : 'bg-gray-100 text-gray-600 active:bg-gray-200'
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
                <div className="flex items-center justify-between mb-2">
                  <p className="text-xs font-semibold text-gray-500 flex items-center gap-1.5">
                    <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 text-primary-accent" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                      <rect x="3" y="4" width="18" height="18" rx="2" />
                      <line x1="16" y1="2" x2="16" y2="6" />
                      <line x1="8" y1="2" x2="8" y2="6" />
                      <line x1="3" y1="10" x2="21" y2="10" />
                    </svg>
                    Pilihan Periode
                  </p>
                  <div className="flex bg-gray-100 rounded-lg p-0.5">
                    {(['tanggal', 'bulan', 'tahun'] as const).map((type) => (
                      <button
                        key={type}
                        onClick={() => setDateFilterType(type)}
                        className={`px-3 py-1.5 text-xs font-bold rounded-md capitalize transition-colors ${
                          dateFilterType === type
                            ? 'bg-white text-primary-accent shadow-sm'
                            : 'text-gray-500 hover:text-gray-700'
                        }`}
                      >
                        {type}
                      </button>
                    ))}
                  </div>
                </div>

                {dateFilterType === 'tanggal' && (
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
                )}

                {dateFilterType === 'bulan' && (
                  <div className="flex gap-3">
                    <MonthPickerInput
                      label="Pilih Bulan"
                      value={selectedMonth}
                      onChange={setSelectedMonth}
                    />
                  </div>
                )}

                {dateFilterType === 'tahun' && (
                  <div className="flex gap-3">
                    <YearPickerInput
                      label="Pilih Tahun"
                      value={selectedYear}
                      onChange={setSelectedYear}
                    />
                  </div>
                )}
              </div>
            )}

            {/* Search */}
            {searchFields.length > 0 && (
              <div>
                <p className="text-xs font-semibold text-gray-500 mb-2 flex items-center gap-1.5">
                  <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 text-primary-accent" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="11" cy="11" r="7" />
                    <line x1="21" y1="21" x2="16.65" y2="16.65" />
                  </svg>
                  Pencarian
                </p>
                <div className="relative">
                  <svg viewBox="0 0 24 24" className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-primary-accent/50 pointer-events-none" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="11" cy="11" r="7" />
                    <line x1="21" y1="21" x2="16.65" y2="16.65" />
                  </svg>
                  <input
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder={searchPlaceholder}
                    className="w-full pl-9 pr-9 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm outline-none focus:border-primary-accent/40 focus:bg-white transition-colors"
                  />
                  {search && (
                    <button
                      onClick={() => setSearch('')}
                      className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 flex items-center justify-center rounded-full bg-gray-300/70 text-gray-500 active:bg-gray-300 transition-colors"
                    >
                      <svg viewBox="0 0 24 24" className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round">
                        <path d="M18 6L6 18M6 6l12 12" />
                      </svg>
                    </button>
                  )}
                </div>
              </div>
            )}

            {/* Action buttons */}
            <div className="flex gap-2.5 pt-1">
              <button
                onClick={resetFilter}
                className="flex-1 py-3 rounded-xl text-sm font-semibold bg-gray-100 text-gray-600 active:bg-gray-200 transition-colors flex items-center justify-center gap-1.5"
              >
                <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                  <path d="M3 12a9 9 0 109-9 9.75 9.75 0 00-6.74 2.74L3 8" />
                  <path d="M3 3v5h5" />
                </svg>
                Reset
              </button>
              <button
                onClick={applyFilter}
                className="flex-1 py-3 rounded-xl text-sm font-bold bg-primary-accent text-white shadow-md active:bg-primary-accent transition-colors flex items-center justify-center gap-1.5"
              >
                <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
                Terapkan
              </button>
            </div>
          </div>
        </div>

      </div>
    </>
  );

  return (
    <>
      {/* ── Outer flex column: header (LiquidPullToRefresh) + filter + thead + scrollable tbody ── */}
      <div className="flex-1 flex flex-col overflow-hidden">

        {/* ── LiquidPullToRefresh hanya untuk title bar + pull gesture ── */}
        <LiquidPullToRefresh
          header={headerNode}
          onRefresh={handleRefresh}
          className="flex-shrink-0"
          overflowVisible
          scrollRef={scrollContainerRef}
        >
          {/* children kosong — scroll dihandle di bawah */}
          <div style={{ height: 0 }} />
        </LiquidPullToRefresh>

        {/* ── Filter Panel (tidak ikut scroll) ── */}
        <div className="flex-shrink-0">
          {filterPanel}
        </div>

        {/* ── Loading overlay saat filter apply ── */}
        {(isFiltering || (loading && hasDataRef.current)) && (
          <div className="fixed inset-0 z-50 flex flex-col items-center justify-center" style={{ background: 'rgba(248,250,255,0.72)', backdropFilter: 'blur(18px) saturate(1.8)', WebkitBackdropFilter: 'blur(18px) saturate(1.8)' }}>
            {/* Ambient glow rings */}
            <div className="relative flex items-center justify-center mb-8">
              {/* Outer pulse ring */}
              <div className="absolute w-28 h-28 rounded-full border border-primary-accent/20" style={{ animation: 'ringPulse 2s ease-out infinite' }} />
              <div className="absolute w-20 h-20 rounded-full border border-primary-accent/30" style={{ animation: 'ringPulse 2s ease-out 0.4s infinite' }} />
              {/* Inner glow circle */}
              <div className="w-14 h-14 rounded-full bg-primary-accent/10 flex items-center justify-center" style={{ boxShadow: '0 0 32px 8px rgba(3,90,252,0.15)' }}>
                {/* Arc spinner */}
                <svg className="w-8 h-8" viewBox="0 0 32 32" fill="none">
                  <circle cx="16" cy="16" r="12" stroke="rgba(3,90,252,0.12)" strokeWidth="2.5" />
                  <circle
                    cx="16" cy="16" r="12"
                    stroke="#035afc"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeDasharray="28 48"
                    style={{ animation: 'arcSpin 1s linear infinite', transformOrigin: '16px 16px' }}
                  />
                </svg>
              </div>
            </div>
            {/* Text */}
            <p className="text-[13px] font-semibold tracking-[0.12em] uppercase" style={{ color: '#035afc', opacity: 0.7, animation: 'textFade 1.8s ease-in-out infinite' }}>Memuat data</p>
            {/* Progress bar */}
            <div className="mt-4 w-24 h-0.5 rounded-full overflow-hidden bg-primary-accent/10">
              <div className="h-full rounded-full bg-primary-accent/50" style={{ animation: 'progressBar 1.8s ease-in-out infinite' }} />
            </div>
          </div>
        )}

        {/* ── Table (thead sticky + tbody scrollable dalam satu tabel) ── */}
        <div
          ref={scrollContainerRef}
          className="flex-1 overflow-y-auto overflow-x-auto px-3"
          style={{ overscrollBehavior: 'none' }}
          onScroll={(e) => {
            const target = e.target as HTMLDivElement;
            if (target.scrollHeight - target.scrollTop <= target.clientHeight + 150) {
              handleLoadMore();
            }
          }}
        >
          <table className="w-full border-collapse">
            <thead className="sticky top-0 z-[5] bg-gray-100 shadow-sm">
              <tr>
                {columns.map((col) => (
                  <th
                    key={col.key}
                    onClick={() => handleSort(col.key)}
                    className="py-2.5 px-1.5 last:pr-3 text-[11px] font-bold text-gray-700 border-r border-b border-gray-200 last:border-r-0 cursor-pointer select-none active:bg-gray-200 break-words"
                    style={{ width: col.key === 'no' ? '40px' : 'auto', textAlign: col.align ?? 'left' }}
                  >
                    <div className={`flex items-center gap-1 ${col.align === 'right' ? 'justify-end' : col.align === 'center' ? 'justify-center' : 'justify-start'}`}>
                      <span>{col.label}</span>
                      <span className="inline-flex items-center text-gray-400">
                        {sortKey === col.key ? (
                          sortDir === 'asc' ? (
                            <svg viewBox="0 0 24 24" className="w-4 h-4 text-primary-accent" fill="none" stroke="currentColor" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round"><path d="M12 19V5M5 12l7-7 7 7"/></svg>
                          ) : (
                            <svg viewBox="0 0 24 24" className="w-4 h-4 text-primary-accent" fill="none" stroke="currentColor" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round"><path d="M12 5v14M19 12l-7 7-7-7"/></svg>
                          )
                        ) : (
                          <svg viewBox="0 0 24 24" className="w-4 h-4 opacity-50" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><path d="M7 15l5 5 5-5M7 9l5-5 5 5"/></svg>
                        )}
                      </span>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading && !hasDataRef.current ? (
                <>
                  {Array.from({ length: 8 }).map((_, i) => (
                    <tr key={i} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50/60'}>
                      {columns.map((col) => (
                        <td key={col.key} className="py-2.5 px-1.5 last:pr-3">
                          <div
                            className="h-3 rounded-full bg-gray-200"
                            style={{
                              width: col.key === 'no' ? '24px' : `${55 + ((i * 13 + col.key.length * 7) % 35)}%`,
                              animation: `shimmer 1.5s ease-in-out ${i * 0.07}s infinite`,
                              background: 'linear-gradient(90deg, #e5e7eb 25%, #f3f4f6 50%, #e5e7eb 75%)',
                              backgroundSize: '200% 100%',
                            }}
                          />
                        </td>
                      ))}
                    </tr>
                  ))}
                </>
              ) : error && !hasDataRef.current ? (
                <tr>
                  <td colSpan={columns.length} className="text-center py-16">
                    <div className="flex flex-col items-center gap-3 text-red-400">
                      <svg viewBox="0 0 24 24" className="w-10 h-10" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
                        <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
                        <line x1="12" y1="9" x2="12" y2="13" />
                        <line x1="12" y1="17" x2="12.01" y2="17" />
                      </svg>
                      <span className="text-sm">{error}</span>
                    </div>
                  </td>
                </tr>
              ) : sorted.length === 0 && !loading ? (
                <tr>
                  <td colSpan={columns.length} className="text-center py-16">
                    <div className="flex flex-col items-center gap-3 text-gray-300">
                      <svg viewBox="0 0 24 24" className="w-10 h-10" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
                        <rect x="3" y="3" width="18" height="18" rx="2" />
                        <line x1="3" y1="9" x2="21" y2="9" />
                        <line x1="9" y1="21" x2="9" y2="9" />
                      </svg>
                      <span className="text-sm text-gray-400">Tidak ada data</span>
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
                          className="py-2.5 px-1.5 last:pr-3 text-[11px] text-gray-800 align-top border-r border-gray-100 last:border-r-0 break-all"
                          style={{ textAlign: col.align ?? 'left' }}
                        >
                          {col.render ? col.render(row) : col.key === 'no' ? String(i + 1) : String(row[col.key] ?? '-')}
                        </td>
                      ))}
                    </tr>
                  ))}
                  {/* Load-more row */}
                  {hasMore && (
                    <tr>
                      <td colSpan={columns.length} className="text-center py-6">
                        {loading ? (
                          <div className="flex justify-center items-center gap-1.5">
                            {[0, 1, 2].map((i) => (
                              <div
                                key={i}
                                className="w-2 h-2 rounded-full bg-primary-accent/60"
                                style={{ animation: `bounce 1.2s ease-in-out ${i * 0.2}s infinite` }}
                              />
                            ))}
                          </div>
                        ) : (
                          <button
                            onClick={handleLoadMore}
                            className="text-xs text-primary-accent font-semibold px-5 py-2.5 rounded-full border border-primary-accent/30 bg-primary-accent/10 active:bg-primary-accent/20"
                          >
                            Muat 50 data berikutnya
                          </button>
                        )}
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

          {/* Grand total (Floating) */}
          {totalLabel && totalValue && (
            <div className="fixed bottom-4 left-4 right-4 bg-white/90 backdrop-blur-md rounded-2xl shadow-lg px-5 py-4 flex items-center justify-between z-30">
              <span className="text-sm font-bold text-primary-accent">{totalLabel}</span>
              <span className="text-lg font-extrabold text-primary-accent">{totalValue}</span>
            </div>
          )}
        </div>

      </div>{/* end outer flex column */}

      {/* Export Bottom Sheet — via portal to escape stacking context */}
      {showExportMenu && createPortal(
        <div className="fixed inset-0 z-[99999] flex flex-col justify-end">
          <div 
            className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity"
            onClick={() => setShowExportMenu(false)}
          />
          <div className="relative bg-white rounded-t-3xl shadow-[0_-8px_30px_rgba(0,0,0,0.12)] overflow-hidden animate-in slide-in-from-bottom-full duration-300">
            <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
              <span className="text-base font-bold text-gray-800">Pilih Format Export</span>
              <button onClick={() => setShowExportMenu(false)} className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 text-gray-500 active:bg-gray-200">
                <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round"><path d="M18 6L6 18M6 6l12 12" /></svg>
              </button>
            </div>
            <div className="p-4 space-y-3 pb-8">
              <button
                onClick={handleExportPdf}
                className="w-full px-5 py-4 text-left text-sm font-bold text-gray-700 bg-gray-50 rounded-2xl active:bg-gray-100 flex items-center gap-4 transition-colors border border-gray-100"
              >
                <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center text-red-500 flex-shrink-0">
                  <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                    <polyline points="14 2 14 8 20 8" />
                    <line x1="16" y1="13" x2="8" y2="13" />
                    <line x1="16" y1="17" x2="8" y2="17" />
                    <polyline points="10 9 9 9 8 9" />
                  </svg>
                </div>
                Export sebagai PDF
              </button>
              <button
                onClick={handleExportExcel}
                className="w-full px-5 py-4 text-left text-sm font-bold text-gray-700 bg-gray-50 rounded-2xl active:bg-gray-100 flex items-center gap-4 transition-colors border border-gray-100"
              >
                <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center text-green-600 flex-shrink-0">
                  <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                    <polyline points="14 2 14 8 20 8" />
                    <path d="M8 13h2" />
                    <path d="M8 17h2" />
                    <path d="M14 13h2" />
                    <path d="M14 17h2" />
                  </svg>
                </div>
                Export sebagai Excel
              </button>
            </div>
          </div>
        </div>
      , document.body)}
    </>
  );
}

