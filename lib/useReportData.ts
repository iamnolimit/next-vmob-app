import { useState, useCallback, useRef, useEffect } from 'react';
import { fetchApi } from './api';
import { useAuth } from './authContext';

interface UseReportDataProps {
  apiEndpoint: string;
  apiVersion?: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  apiParams?: Record<string, any>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  apiNormalizer: (data: any, offset?: number) => any[];
  pageSize?: number;
}

export function useReportData({
  apiEndpoint,
  apiVersion = 'api5',
  apiParams = {},
  apiNormalizer,
  pageSize = 50,
}: UseReportDataProps) {
  const { user } = useAuth();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(true);
  // Track the current offset so load-more knows where to continue
  const currentOffsetRef = useRef(0);
  // Store last filter params so loadMore can reuse them
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const lastFilterParamsRef = useRef<Record<string, any>>({});

  const fetchPage = useCallback(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    async (extraParams: Record<string, any> = {}, append = false) => {
      if (!user) return;
      setLoading(true);
      setError(null);
      try {
        const offset = append ? currentOffsetRef.current : 0;
        // On fresh fetch, merge new params into existing filter params so that
        // partial updates (e.g. only sorting) don't lose previously set filters
        // (e.g. tanggalawal/tanggalakhir).
        if (!append) {
          lastFilterParamsRef.current = { ...lastFilterParamsRef.current, ...extraParams };
        }
        const mergedParams = {
          a: user.app_id,
          reg: user.app_reg,
          ...apiParams,
          limit: pageSize,
          offset,
          ...lastFilterParamsRef.current,
        };
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const result: any = await fetchApi(apiEndpoint, mergedParams, user, apiVersion);
        const normalized = apiNormalizer(result, offset);

        // Helper: re-sort combined data client-side to compensate for
        // API pagination not guaranteeing global order across pages.
        const applySorting = (rows: any[]) => {
          const sortingStr: string = lastFilterParamsRef.current?.sorting || '';
          if (!sortingStr) return rows;
          const parts = sortingStr.trim().split(/\s+/);
          const field = parts[0]; // e.g. 'shftutup'
          const dir = parts[1]?.toUpperCase() === 'DESC' ? -1 : 1;
          return [...rows].sort((a, b) => {
            const av = a?.rawData?.[field] ?? a?.[field] ?? '';
            const bv = b?.rawData?.[field] ?? b?.[field] ?? '';
            if (av < bv) return -1 * dir;
            if (av > bv) return 1 * dir;
            return 0;
          });
        };

        const reNumber = (rows: any[]) =>
          rows.map((r, i) => ('no' in r ? { ...r, no: i + 1 } : r));

        if (append) {
          setData((prev) => {
            const combined = [...prev, ...normalized];
            return reNumber(applySorting(combined));
          });
        } else {
          setData(reNumber(applySorting(normalized)));
          currentOffsetRef.current = 0;
        }
        // If we got fewer rows than pageSize, there's no more data
        setHasMore(normalized.length >= pageSize);
        if (!append) {
          currentOffsetRef.current = normalized.length;
        } else {
          currentOffsetRef.current = offset + normalized.length;
        }
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : 'An error occurred';
        const isNetworkError = msg === 'Failed to fetch' || msg.toLowerCase().includes('network') || msg.toLowerCase().includes('failed to fetch');
        const isServerError = /status 5\d\d/.test(msg);
        setError(
          isNetworkError ? 'Gagal memuat data\nKoneksi terputus' :
          isServerError ? 'Maaf terjadi kesalahan pada server (500)' :
          msg
        );
      } finally {
        setLoading(false);
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [user, apiEndpoint, apiVersion, pageSize]
  );

  // refetch: reset data and fetch from offset 0
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const refetch = useCallback((extraParams: Record<string, any> = {}) => {
    return fetchPage(extraParams, false);
  }, [fetchPage]);

  // Stable ref so callers can use refetch in useEffect without it as a dependency
  const refetchRef = useRef(refetch);
  useEffect(() => { refetchRef.current = refetch; }, [refetch]);

  // Auto-fetch once when user becomes available (for pages that don't call refetch manually)
  const didAutoFetchRef = useRef(false);
  useEffect(() => {
    // We remove the auto-fetch here because ReportTable already handles the initial fetch
    // with the correct date filters. If we auto-fetch here, it sends a request without
    // the date filters (tanggalawal/tanggalakhir), which causes the API to return 500.
    // if (didAutoFetchRef.current || !user) return;
    // didAutoFetchRef.current = true;
    // refetchRef.current();
  }, [user]);

  // loadMore: append next page using the same filter params as the last refetch
  const loadMore = useCallback(() => {
    return fetchPage({}, true);
  }, [fetchPage]);

  // reset: clear data without fetching (used by ReportTable resetFilter)
  const reset = useCallback(() => {
    setData([]);
    setError(null);
    setHasMore(true);
    currentOffsetRef.current = 0;
    lastFilterParamsRef.current = {};
  }, []);

  return { data, loading, error, hasMore, refetch, loadMore, reset };
}
