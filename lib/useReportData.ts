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
        // On fresh fetch, save the filter params for use by loadMore
        if (!append) {
          lastFilterParamsRef.current = extraParams;
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
        if (append) {
          setData((prev) => [...prev, ...normalized]);
        } else {
          setData(normalized);
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
        setError(err instanceof Error ? err.message : 'An error occurred');
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
