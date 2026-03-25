'use client';
import { formatRupiah } from '@/lib/dummyData';

interface RankedItem {
  rank: number;
  name: string;
  satuan?: string;
  jumlah?: number;
  nilai?: number;
  persen?: number;
}

interface RankedListProps {
  title: string;
  icon?: string;
  color?: string;
  items: RankedItem[];
  type?: 'obat' | 'katlaris';
}

const rankColors = ['#FFD700', '#C0C0C0', '#CD7F32'];
const rankBg     = ['bg-yellow-50', 'bg-gray-50', 'bg-orange-50'];

export default function RankedList({ title, icon, color = '#1d4ed8', items, type = 'obat' }: RankedListProps) {
  return (
    <div className="ranked-card bg-white rounded-2xl mx-4 mb-4 ios-shadow overflow-hidden">
      {/* Header */}
      <div className="px-4 py-3 border-b border-gray-100 flex items-center gap-2">
        {icon && <span className="text-xl ranked-header-icon">{icon}</span>}
        <h3 className="text-sm font-semibold text-gray-800">{title}</h3>
      </div>

      {/* Items */}
      {items.map((item, i) => {
        const isTop3      = i < 3;
        const rankColor   = rankColors[i] ?? color;
        const rankBgClass = rankBg[i] ?? '';
        const delay       = `${i * 60}ms`;

        return (
          <div
            key={i}
            className={`ranked-item flex items-center gap-3 px-4 py-3 border-b border-gray-50 last:border-b-0 ${isTop3 ? rankBgClass : ''}`}
            style={{ animationDelay: delay }}
          >
            {/* Rank badge */}
            <div
              className="ranked-badge w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white flex-shrink-0"
              style={{ backgroundColor: isTop3 ? rankColor : '#9ca3af', animationDelay: delay }}
            >
              {i + 1}
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">{item.name}</p>
              {type === 'obat' && item.jumlah !== undefined && (
                <p className="text-xs text-gray-500">
                  {item.jumlah.toLocaleString('id-ID')} {item.satuan}
                </p>
              )}
              {type === 'katlaris' && item.persen !== undefined && (
                <div className="flex items-center gap-2 mt-1">
                  {/* Progress bar animates width */}
                  <div className="flex-1 bg-gray-200 rounded-full h-1.5 overflow-hidden">
                    <div
                      className="ranked-bar h-1.5 rounded-full"
                      style={{
                        width: `${item.persen}%`,
                        backgroundColor: color,
                        animationDelay: `${i * 60 + 150}ms`,
                      }}
                    />
                  </div>
                  <span className="text-xs text-gray-500">{item.persen}%</span>
                </div>
              )}
            </div>

            {/* Value */}
            {item.nilai !== undefined && (
              <div className="text-right flex-shrink-0">
                <p className="text-xs font-semibold text-gray-700">{formatRupiah(item.nilai)}</p>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
