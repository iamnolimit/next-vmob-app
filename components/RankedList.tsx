'use client';
import { formatRupiah } from '@/lib/dummyData';
import { useRouter } from 'next/navigation';
import { getStatsRoute } from '@/lib/routeConnector';

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
  const router = useRouter();
  const route = getStatsRoute(title);
  const isClickable = !!route;

  const handleSeeAll = () => {
    if (isClickable && route) {
      router.push(route);
    }
  };

  return (
    <div 
      className="rounded-[20px] mx-4 mb-4 shadow-[0_8px_24px_-12px_rgba(0,0,0,0.1)] border border-white/40 overflow-hidden"
      style={{ background: `linear-gradient(145deg, #ffffff, ${color}05)` }}
    >
      {/* Header */}
      <div className="px-4 py-3.5 border-b border-gray-100/50 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          {icon && (
            <div className="w-8 h-8 rounded-full flex items-center justify-center text-lg" style={{ backgroundColor: `${color}15`, color: color }}>
              <span className="ranked-header-icon">{icon}</span>
            </div>
          )}
          <h3 className="text-[15px] font-bold text-gray-900">{title}</h3>
        </div>
        {isClickable && (
          <button 
            onClick={handleSeeAll}
            className="text-[12px] font-semibold text-[#4f6dfa] bg-[#4f6dfa]/10 px-3 py-1 rounded-full active:scale-95 transition-transform"
          >
            Semua
          </button>
        )}
      </div>

      {/* Items */}
      <div className="flex flex-col">
        {items.map((item, i) => {
          const isTop3      = i < 3;
          const rankColor   = rankColors[i] ?? color;
          const delay       = `${i * 60}ms`;

          return (
            <div
              key={i}
              className="flex items-center gap-3 px-4 py-3 border-b border-gray-100/50 last:border-b-0 hover:bg-white/50 transition-colors"
              style={{ animationDelay: delay }}
            >
              {/* Rank badge */}
              <div
                className="w-7 h-7 rounded-full flex items-center justify-center text-[12px] font-bold flex-shrink-0"
                style={{ 
                  backgroundColor: isTop3 ? `${rankColor}15` : '#f3f4f6',
                  color: isTop3 ? rankColor : '#9ca3af',
                }}
              >
                {i + 1}
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <p className="text-[14px] font-semibold text-gray-900 truncate">{item.name}</p>
                {type === 'obat' && item.jumlah !== undefined && (
                  <p className="text-[12px] font-medium text-gray-500 mt-0.5">
                    {item.jumlah.toLocaleString('id-ID')} <span className="text-gray-400">{item.satuan}</span>
                  </p>
                )}
                {type === 'katlaris' && item.persen !== undefined && (
                  <div className="flex items-center gap-2 mt-1.5">
                    <div className="flex-1 bg-gray-200/60 rounded-full h-1.5 overflow-hidden">
                      <div
                        className="h-full rounded-full"
                        style={{
                          width: `${item.persen}%`,
                          backgroundColor: color,
                        }}
                      />
                    </div>
                    <span className="text-[11px] font-bold text-gray-500 w-7 text-right">{item.persen}%</span>
                  </div>
                )}
              </div>

              {/* Value */}
              {item.nilai !== undefined && (
                <div className="text-right flex-shrink-0 pl-2">
                  <p className="text-[13px] font-bold text-gray-900">{formatRupiah(item.nilai)}</p>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
