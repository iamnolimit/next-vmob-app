import { useState, useEffect } from 'react';
import { useFetch } from './useFetch';
import { useAuth } from './authContext';

interface UseReportDataProps {
  apiEndpoint: string;
  apiVersion?: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  apiParams?: Record<string, any>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  apiNormalizer: (data: any, offset?: number) => any[];
}

export function useReportData({
  apiEndpoint,
  apiVersion = 'api5',
  apiParams = {},
  apiNormalizer,
}: UseReportDataProps) {
  const { user } = useAuth();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [data, setData] = useState<any[]>([]);

  const { data: apiData, loading, error, refetch } = useFetch({
    endpoint: apiEndpoint,
    apiVersion,
    params: user ? { a: user.app_id, reg: user.app_reg, ...apiParams } : {},
    isMutation: false,
  });

  useEffect(() => {
    if (user) {
      refetch({ a: user.app_id, reg: user.app_reg, ...apiParams });
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  useEffect(() => {
    if (apiData) {
      const normalized = apiNormalizer(apiData);
      setData(normalized);
    }
  }, [apiData, apiNormalizer]);

  return { data, loading, error, refetch };
}
