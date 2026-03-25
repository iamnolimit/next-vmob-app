'use client';

interface StatCardProps {
  label: string;
  value: string;
  change?: number;
  icon?: string;
  color?: string;
  invoiceCount?: string;
}

export default function StatCard({ label, value, change, icon, color = '#1d4ed8', invoiceCount }: StatCardProps) {
  const isPositive   = change !== undefined && change >= 0;
  const changeColor  = change === undefined ? '' : isPositive ? '#16a34a' : '#dc2626';
  const changeBg     = change === undefined ? '' : isPositive ? '#dcfce7' : '#fee2e2';
  const changeSymbol = change === undefined ? '' : isPositive ? '▲' : '▼';

  return (
    <div className="stat-card bg-white rounded-2xl p-4 mx-4 mb-3 overflow-hidden">
      <div className="flex items-center justify-between gap-3">
        <div className="flex-1 min-w-0">
          <p className="text-xs text-gray-400 font-semibold uppercase tracking-widest mb-1 truncate">
            {label}
          </p>
          <p className="text-xl font-bold text-gray-900 leading-tight">{value}</p>
          {invoiceCount && (
            <p className="text-xs text-gray-400 mt-0.5">{invoiceCount}</p>
          )}
          {change !== undefined && (
            <span
              className="inline-flex items-center gap-1 text-[11px] font-semibold mt-1.5 px-2 py-0.5 rounded-full"
              style={{ color: changeColor, backgroundColor: changeBg }}
            >
              {changeSymbol} {Math.abs(change).toFixed(1)}% dari periode lalu
            </span>
          )}
        </div>

        {icon && (
          <div
            className="stat-icon w-12 h-12 rounded-2xl flex items-center justify-center text-2xl flex-shrink-0"
            style={{
              background: `${color}15`,
              boxShadow: `0 2px 8px ${color}20`,
            }}
          >
            {icon}
          </div>
        )}
      </div>
    </div>
  );
}
