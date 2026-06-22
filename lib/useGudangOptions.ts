'use client';
import { useState, useEffect } from 'react';
import { fetchApi } from './api';
import { useAuth } from './authContext';

export interface GudangOption {
  value: string;
  label: string;
}

export function useGudangOptions() {
  const { user } = useAuth();
  const [gudangOptions, setGudangOptions] = useState<GudangOption[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!user?.app_id) return;

    setLoading(true);
    fetchApi('apgudang/index', { a: user.app_id, device: 'mobile', gudaktif: 1, reg: 'db' }, user, 'api5')
      .then((response) => {
        const gudangData: Record<string, string>[] = response?.data || response;
        if (Array.isArray(gudangData) && gudangData.length > 0) {
          const options: GudangOption[] = [
            { value: '', label: 'Semua Gudang' },
            ...gudangData.map((g) => ({
              value: g.gudid || '',
              label: g.gudnama || '',
            })),
          ];
          setGudangOptions(options);
        } else {
          setGudangOptions([{ value: '', label: 'Semua Gudang' }]);
        }
      })
      .catch(() => {
        setGudangOptions([{ value: '', label: 'Semua Gudang' }]);
      })
      .finally(() => setLoading(false));
  }, [user?.app_id]);

  return { gudangOptions, loading };
}
