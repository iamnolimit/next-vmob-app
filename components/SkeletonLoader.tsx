'use client';

// Shimmer pulse base — shared by all skeleton shapes
function Shimmer({ className = '', style }: { className?: string; style?: React.CSSProperties }) {
  return (
    <div
      className={`relative overflow-hidden bg-gray-100 rounded-xl ${className}`}
      style={style}
    >
      <div className="absolute inset-0 -translate-x-full animate-[shimmer_1.4s_infinite] bg-gradient-to-r from-transparent via-white/70 to-transparent" />
    </div>
  );
}

// Single StatCard skeleton
export function StatCardSkeleton() {
  return (
    <div className="rounded-[20px] p-4 mx-4 mb-3 shadow-[0_8px_24px_-12px_rgba(0,0,0,0.08)] border border-gray-100 bg-white">
      <div className="flex items-center gap-2.5 mb-3">
        <Shimmer className="w-8 h-8 rounded-full" />
        <Shimmer className="h-3.5 w-28 rounded-md" />
      </div>
      <Shimmer className="h-7 w-36 rounded-md mb-2" />
      <Shimmer className="h-3 w-20 rounded-md" />
    </div>
  );
}

// Chart carousel skeleton
export function ChartSkeleton() {
  return (
    <div className="mx-4 rounded-[20px] p-4 bg-white shadow-[0_8px_24px_-12px_rgba(0,0,0,0.08)] border border-gray-100">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-2">
          <Shimmer className="w-7 h-7 rounded-full" />
          <Shimmer className="h-4 w-32 rounded-md" />
        </div>
        <Shimmer className="h-4 w-16 rounded-md" />
      </div>
      {/* Bars */}
      <div className="flex items-end gap-1.5 h-20 mb-3">
        {[55, 80, 40, 95, 60, 75, 45, 88, 50, 70].map((h, i) => (
          <Shimmer
            key={i}
            className="flex-1 rounded-t-md"
            style={{ height: `${h}%` } as React.CSSProperties}
          />
        ))}
      </div>
      {/* X labels */}
      <div className="flex gap-1.5">
        {Array.from({ length: 10 }).map((_, i) => (
          <Shimmer key={i} className="flex-1 h-2.5 rounded-sm" />
        ))}
      </div>
      {/* Dots */}
      <div className="flex justify-center gap-1.5 mt-4">
        {[0, 1, 2].map((i) => (
          <Shimmer key={i} className={`h-1.5 rounded-full ${i === 0 ? 'w-4' : 'w-1.5'}`} />
        ))}
      </div>
    </div>
  );
}

// Full dashboard page skeleton
export function DashboardSkeleton({ cardCount = 5 }: { cardCount?: number }) {
  return (
    <div className="pb-6 animate-[fadeIn_0.2s_ease-out]">
      <div className="mt-4">
        <ChartSkeleton />
      </div>
      <div className="mt-6">
        {Array.from({ length: cardCount }).map((_, i) => (
          <StatCardSkeleton key={i} />
        ))}
      </div>
    </div>
  );
}

// Generic list skeleton (for laporan pages)
export function ListSkeleton({ rows = 6 }: { rows?: number }) {
  return (
    <div className="px-4 pt-2 pb-6 space-y-3 animate-[fadeIn_0.2s_ease-out]">
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="rounded-[16px] p-4 bg-white shadow-[0_4px_16px_-8px_rgba(0,0,0,0.08)] border border-gray-100">
          <div className="flex justify-between items-start mb-2.5">
            <Shimmer className="h-3.5 w-32 rounded-md" />
            <Shimmer className="h-3.5 w-20 rounded-md" />
          </div>
          <Shimmer className="h-5 w-40 rounded-md mb-2" />
          <Shimmer className="h-3 w-24 rounded-md" />
        </div>
      ))}
    </div>
  );
}

// Simple card skeleton row (for pages with fewer cards)
export function CardRowSkeleton({ count = 3 }: { count?: number }) {
  return (
    <div className="pb-6 animate-[fadeIn_0.2s_ease-out]">
      <div className="mt-4">
        {Array.from({ length: count }).map((_, i) => (
          <StatCardSkeleton key={i} />
        ))}
      </div>
    </div>
  );
}
