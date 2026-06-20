import { useState, useEffect } from 'react';
import { fetchApi } from './api';
import { useAuth } from './authContext';

interface UseFetchOptions {
  endpoint: string;
  apiVersion?: string;
  params?: Record<string, any>;
  isMutation?: boolean;
}

export function useFetch<T = any>({ endpoint, apiVersion = 'api7', params = {}, isMutation = false }: UseFetchOptions) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(!isMutation);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  const fetchData = async (additionalParams = {}) => {
    if (!user) return;
    setLoading(true);
    setError(null);
    try {
      const mergedParams = { ...params, ...additionalParams };
      const result = await fetchApi(endpoint, mergedParams, user, apiVersion);
      console.log('useFetch result:', result);
      setData(result);
    } catch (err: any) {
      setError(err.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  // Stable JSON key so effect re-runs only when params actually change
  const paramsKey = JSON.stringify(params);

  useEffect(() => {
    if (!isMutation && user) {
      fetchData();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, isMutation, paramsKey]); // Re-fetch when user or params change

  const mutate = async (mutationParams: Record<string, any>) => {
    return fetchData(mutationParams);
  };

  const refetch = (additionalParams = {}) => {
    return fetchData(additionalParams);
  };

  return { data, loading, error, mutate, refetch };
}
