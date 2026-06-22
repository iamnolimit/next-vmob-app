'use client';
import { useState, useEffect } from 'react';
import { fetchApi } from './api';
import { useAuth } from './authContext';

export interface CabangOption {
  value: string;
  label: string;
  reg?: string;
}

export function useCabangOptions() {
  const { user } = useAuth();
  const [cabangOptions, setCabangOptions] = useState<CabangOption[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!user?.app_id) return;

    setLoading(true);
    fetchApi('ap-list-cabang/index', { a: user.app_id, device: 'mobile' }, user, 'api5')
      .then((response) => {
        // Handle nested: response.data.data or response.data or response
        const cabangData: Record<string, string>[] =
          response?.data?.data || response?.data || response;
        if (Array.isArray(cabangData) && cabangData.length > 0) {
          const options: CabangOption[] = cabangData.map((c) => ({
            value: c.appidcabang,
            label: c.nama,
            reg: c.reg,
          }));
          setCabangOptions(options);
        } else {
          // Fallback: hanya cabang saat ini
          setCabangOptions([{ value: user.app_id, label: user.cabang || 'Cabang Saat Ini' }]);
        }
      })
      .catch(() => {
        setCabangOptions([{ value: user.app_id, label: user.cabang || 'Cabang Saat Ini' }]);
      })
      .finally(() => setLoading(false));
  }, [user?.app_id]);

  return { cabangOptions, loading };
}
