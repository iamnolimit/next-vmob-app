'use client';
import { useState, useRef } from 'react';

export interface ChartItem {
  title: string;
  dataKey: string;
  color: string;
  icon: string;
}

interface ChartCarouselProps {
  data: Record<string, number | string>[];
  items: ChartItem[];
  title?: string;
  dataByChart?: Record<string, number | string>[][];
}

const BAR_MAX_HEIGHT = 88; // px

function formatShort(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000)     return `${(n / 1_000).toFixed(0)}K`;
  return String(n);
}

export default function ChartCarousel({ data, items, title, dataByChart }: ChartCarouselProps) {
  const [current, setCurrent]         = useState(0);
  const [selectedBar, setSelectedBar] = useState<{ name: string; value: string } | null>(null);
  const touchStartX = useRef<number | null>(null);

  const prev = () => { setSelectedBar(null); setCurrent((c) => (c - 1 + items.length) % items.length); };
  const next = () => { setSelectedBar(null); setCurrent((c) => (c + 1) % items.length); };

  const onTouchStart = (e: React.TouchEvent) => { touchStartX.current = e.touches[0].clientX; };
  const onTouchEnd   = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const diff = touchStartX.current - e.changedTouches[0].clientX;
    if (diff > 40) next();
    else if (diff < -40) prev();
    touchStartX.current = null;
  };

  const item       = items[current];
  const activeData = dataByChart ? (dataByChart[current] ?? data) : data;
  const values     = activeData.map((d) => Number(d[item.dataKey] ?? 0));
  const max        = Math.max(...values, 1);

  const handleBarTap = (idx: number) => {
    const raw = values[idx];
    setSelectedBar({ name: String(activeData[idx].name ?? idx), value: formatShort(raw) });
    setTimeout(() => setSelectedBar(null), 2000);
  };

  return (
    <div
      className="chart-card bg-white rounded-2xl mx-4 mb-4 ios-shadow overflow-hidden select-none"
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 pt-3 pb-2">
        <div className="flex items-center gap-2">
          {/* Icon with pop animation on chart switch */}
          <div
            key={`icon-${current}`}
            className="chart-icon w-8 h-8 rounded-xl flex items-center justify-center text-lg"
            style={{ background: `${item.color}18` }}
          >
            {item.icon}
          </div>
          <div key={`title-${current}`} className="chart-title">
            <p className="text-sm font-bold text-gray-900 leading-tight">{item.title}</p>
            {title && <p className="text-[11px] text-gray-400 leading-tight">{title}</p>}
          </div>
        </div>

        {/* Counter + Prev / Next */}
        <div className="flex items-center gap-1">
          <span className="text-[10px] text-gray-400 mr-1 font-medium">
            {current + 1}/{items.length}
          </span>
          <button
            onClick={prev}
            className="w-8 h-8 flex items-center justify-center rounded-lg active:scale-90 transition-transform"
            style={{ background: `${item.color}18` }}
          >
            <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke={item.color} strokeWidth={2.5} strokeLinecap="round">
              <path d="M15 18l-6-6 6-6" />
            </svg>
          </button>
          <button
            onClick={next}
            className="w-8 h-8 flex items-center justify-center rounded-lg active:scale-90 transition-transform"
            style={{ background: `${item.color}18` }}
          >
            <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke={item.color} strokeWidth={2.5} strokeLinecap="round">
              <path d="M9 6l6 6-6 6" />
            </svg>
          </button>
        </div>
      </div>

      {/* Chart bars — key={current} triggers re-animation on chart switch */}
      <div className="relative px-4 pb-2">
        <div key={current} className="flex items-end gap-1.5">
          {activeData.map((d, i) => {
            const barPx    = Math.max(Math.round((values[i] / max) * BAR_MAX_HEIGHT), 4);
            const delay    = `${i * 45}ms`;
            return (
              <button
                key={i}
                className="flex-1 flex flex-col items-center gap-1 focus:outline-none active:opacity-70 transition-opacity"
                onClick={() => handleBarTap(i)}
              >
                <span className="text-[9px] text-gray-400 leading-none">{formatShort(values[i])}</span>
                <div
                  className="chart-bar w-full rounded-t-md"
                  style={{
                    height: barPx,
                    background: `linear-gradient(180deg, ${item.color} 0%, ${item.color}cc 100%)`,
                    animationDelay: delay,
                  }}
                />
                <span
                  className="text-[9px] font-medium leading-none transition-colors duration-300"
                  style={{ color: selectedBar?.name === String(d.name) ? item.color : '#6b7280' }}
                >
                  {String(d.name)}
                </span>
              </button>
            );
          })}
        </div>

        {/* Tap popup */}
        {selectedBar && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="bg-gray-900/90 text-white rounded-2xl px-5 py-3 text-center shadow-xl animate-fadeIn">
              <p className="text-xs text-gray-300 font-medium">{selectedBar.name}</p>
              <p className="text-lg font-bold mt-0.5" style={{ color: item.color }}>
                {selectedBar.value}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Dot indicators */}
      <div className="flex justify-center gap-1.5 pb-3 pt-1">
        {items.map((_, i) => (
          <button
            key={i}
            onClick={() => { setSelectedBar(null); setCurrent(i); }}
            className="rounded-full transition-all duration-300"
            style={{
              width:  i === current ? 16 : 6,
              height: 6,
              background: i === current ? item.color : `${item.color}33`,
            }}
          />
        ))}
      </div>
    </div>
  );
}
