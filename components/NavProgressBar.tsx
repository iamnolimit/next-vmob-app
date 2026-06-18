'use client';
import { useEffect, useState } from 'react';
import { useNavLoading } from '@/lib/navLoadingContext';

export default function NavProgressBar() {
  const { isLoading } = useNavLoading();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    let t: NodeJS.Timeout;
    if (isLoading) {
      // Use setTimeout to avoid synchronous state update during render
      t = setTimeout(() => setVisible(true), 0);
    } else {
      t = setTimeout(() => setVisible(false), 200);
    }
    return () => clearTimeout(t);
  }, [isLoading]);

  if (!visible) return null;

  return (
    <div className="fixed inset-0 z-[998] flex items-center justify-center bg-black/20 backdrop-blur-[1px]">
      <div className="bg-white rounded-2xl px-6 py-5 flex flex-col items-center gap-3 shadow-xl">
        {/* Spinner */}
        <svg
          className="w-8 h-8 animate-spin"
          viewBox="0 0 24 24"
          fill="none"
        >
          <circle
            className="opacity-20"
            cx="12" cy="12" r="10"
            stroke="#2563eb"
            strokeWidth="3"
          />
          <path
            className="opacity-90"
            d="M12 2a10 10 0 0 1 10 10"
            stroke="#2563eb"
            strokeWidth="3"
            strokeLinecap="round"
          />
        </svg>
        <p className="text-xs font-semibold text-gray-500">Memuat...</p>
      </div>
    </div>
  );
}
