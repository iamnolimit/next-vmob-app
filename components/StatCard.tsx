'use client';

import { useRouter } from 'next/navigation';
import { getStatsRoute } from '@/lib/routeConnector';
import { ChevronRight } from 'lucide-react';
import { Icon } from '@iconify/react';

interface StatCardProps {
  label: string;
  value: string;
  change?: number;
  icon?: React.ReactNode;
  color?: string;
  invoiceCount?: string;
}

export default function StatCard({ label, value, change, icon, color = '#1d4ed8', invoiceCount }: StatCardProps) {
  const router = useRouter();
  const isZero       = change === 0;
  const isPositive   = change !== undefined && change > 0;
  const changeColor  = change === undefined ? '' : isZero ? 'var(--primary-accent)' : isPositive ? '#10b981' : '#ef4444';
  const changeBg     = change === undefined ? '' : isZero ? 'rgba(18, 124, 255, 0.1)' : isPositive ? '#d1fae5' : '#fee2e2';
  const changeSymbol = change === undefined ? '' : isZero ? <Icon icon="material-symbols:sync-alt" className="inline-block mr-0.5" /> : isPositive ? '↑' : '↓';

  const route = getStatsRoute(label);
  const isClickable = !!route;

  const handleClick = () => {
    if (isClickable && route) {
      router.push(route);
    }
  };

  return (
    <div 
      onClick={handleClick}
      className={`rounded-[20px] p-4 mx-4 mb-3 shadow-[0_8px_24px_-12px_rgba(0,0,0,0.1)] border border-white/40 relative overflow-hidden ${isClickable ? 'cursor-pointer hover:shadow-[0_12px_28px_-12px_rgba(0,0,0,0.15)] transition-all active:scale-[0.98]' : ''}`}
      style={{ background: `linear-gradient(145deg, #ffffff, ${color}08)` }}
    >
      <div className="flex justify-between items-center gap-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2.5 mb-1.5">
            {icon && (
              <div 
                className="w-8 h-8 rounded-full flex items-center justify-center text-sm flex-shrink-0"
                style={{ backgroundColor: `${color}15`, color: color }}
              >
                {icon}
              </div>
            )}
            <p className="text-[13px] text-gray-500 font-medium truncate">{label}</p>
          </div>
          
          <div className="flex items-baseline gap-2 mt-1">
            <h3 className="text-[22px] font-bold text-gray-900 tracking-tight leading-none">
              {value}
            </h3>
            {change !== undefined && (
              <span className="text-[12px] font-semibold" style={{ color: changeColor }}>
                {changeSymbol}{Math.abs(change).toFixed(1)}%
              </span>
            )}
          </div>
          
          {invoiceCount && (
            <p className="text-[12px] text-gray-400 font-medium mt-1">{invoiceCount}</p>
          )}
        </div>
      </div>

      {isClickable && (
        <div className="absolute right-0 top-0 bottom-0 w-8 flex items-center justify-center" style={{ backgroundColor: `${color}10` }}>
          <ChevronRight size={18} style={{ color: color }} />
        </div>
      )}
    </div>
  );
}
