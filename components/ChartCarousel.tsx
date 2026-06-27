'use client';
import { useState, useRef } from 'react';

export interface ChartItem {
  title: string;
  dataKey: string;
  color: string;
  icon: React.ReactNode;
  valueFormatter?: (value: number) => string;
}

interface ChartCarouselProps {
  data: Record<string, number | string>[];
  items: ChartItem[];
  title?: string;
  dataByChart?: Record<string, number | string>[][];
}

const BAR_MAX_HEIGHT = 88; // px

function formatShort(n: number): string {
  return `Rp ${new Intl.NumberFormat('id-ID').format(n)}`;
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
    const formattedValue = item.valueFormatter ? item.valueFormatter(raw) : formatShort(raw);
    setSelectedBar({ name: String(activeData[idx].name ?? idx), value: formattedValue });
    setTimeout(() => setSelectedBar(null), 2000);
  };

  return (
    <div
      className="chart-container mx-4 mb-6 select-none"
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-1 pt-2 pb-4">
        <div className="flex items-center gap-3">
          {/* Icon with pop animation on chart switch */}
          <div
            key={`icon-${current}`}
            className="chart-icon w-10 h-10 rounded-2xl flex items-center justify-center text-xl"
            style={{ background: `${item.color}18` }}
          >
            {item.icon}
          </div>
          <div key={`title-${current}`} className="chart-title">
            <p className="text-[16px] font-bold text-gray-900 leading-tight">{item.title}</p>
            {title && <p className="text-[13px] text-gray-500 leading-tight mt-0.5">{title}</p>}
          </div>
        </div>

        {/* Prev / Next */}
        <div className="flex items-center gap-2">
          <button
            onClick={prev}
            className="w-8 h-8 flex items-center justify-center rounded-full active:scale-90 transition-transform"
            style={{ background: `${item.color}18` }}
          >
            <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke={item.color} strokeWidth={2.5} strokeLinecap="round">
              <path d="M15 18l-6-6 6-6" />
            </svg>
          </button>
          <button
            onClick={next}
            className="w-8 h-8 flex items-center justify-center rounded-full active:scale-90 transition-transform"
            style={{ background: `${item.color}18` }}
          >
            <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke={item.color} strokeWidth={2.5} strokeLinecap="round">
              <path d="M9 6l6 6-6 6" />
            </svg>
          </button>
        </div>
      </div>

      {/* Chart line — key={current} triggers re-animation on chart switch */}
      <div className="relative px-4 pb-6 h-[160px] flex items-end">
        <div key={current} className="w-full h-full relative">
          {/* SVG Line Chart */}
          <svg className="w-full h-full overflow-visible" preserveAspectRatio="none" viewBox="0 0 100 100">
            {/* Draw gradient area under the line */}
            <defs>
              <linearGradient id={`gradient-${current}`} x1="0" x2="0" y1="0" y2="1">
                <stop offset="0%" stopColor={item.color} stopOpacity="0.2" />
                <stop offset="100%" stopColor={item.color} stopOpacity="0" />
              </linearGradient>
            </defs>
            <path
              d={`M 0 100 L 0 ${100 - (Math.max((values[0] / max) * 90, 5))} ${values.map((v, i) => {
                if (i === 0) return '';
                const prevX = values.length > 1 ? ((i - 1) / (values.length - 1)) * 100 : 50;
                const prevY = 100 - (Math.max((values[i - 1] / max) * 90, 5));
                const x = values.length > 1 ? (i / (values.length - 1)) * 100 : 50;
                const y = 100 - (Math.max((v / max) * 90, 5));
                
                // Control points for cubic bezier curve (smooth wave)
                const cp1x = prevX + (x - prevX) / 2;
                const cp1y = prevY;
                const cp2x = prevX + (x - prevX) / 2;
                const cp2y = y;
                
                return `C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${x} ${y}`;
              }).join(' ')} L 100 100 Z`}
              fill={`url(#gradient-${current})`}
              className="chart-area-path"
            />

            {/* Draw line */}
            <path
              d={`M 0 ${100 - (Math.max((values[0] / max) * 90, 5))} ${values.map((v, i) => {
                if (i === 0) return '';
                const prevX = values.length > 1 ? ((i - 1) / (values.length - 1)) * 100 : 50;
                const prevY = 100 - (Math.max((values[i - 1] / max) * 90, 5));
                const x = values.length > 1 ? (i / (values.length - 1)) * 100 : 50;
                const y = 100 - (Math.max((v / max) * 90, 5));
                
                // Control points for cubic bezier curve (smooth wave)
                const cp1x = prevX + (x - prevX) / 2;
                const cp1y = prevY;
                const cp2x = prevX + (x - prevX) / 2;
                const cp2y = y;
                
                return `C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${x} ${y}`;
              }).join(' ')}`}
              fill="none"
              stroke={item.color}
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="chart-line-path"
              vectorEffect="non-scaling-stroke"
            />
            
            {/* Draw points using HTML elements to avoid SVG scaling distortion */}
            <div className="absolute inset-0 pointer-events-none">
              {values.map((v, i) => {
                const x = values.length > 1 ? (i / (values.length - 1)) * 100 : 50;
                const y = 100 - (Math.max((v / max) * 90, 5));
                return (
                  <div
                    key={i}
                    className="absolute w-2.5 h-2.5 rounded-full bg-white border-2 chart-line-point"
                    style={{
                      left: `${x}%`,
                      top: `${y}%`,
                      transform: 'translate(-50%, -50%)',
                      borderColor: item.color,
                      animationDelay: `${i * 45}ms`
                    }}
                  />
                );
              })}
            </div>
          </svg>

          {/* Invisible buttons for interaction */}
          <div className="absolute inset-0">
            {activeData.map((d, i) => {
              const x = values.length > 1 ? (i / (values.length - 1)) * 100 : 50;
              return (
                <button
                  key={i}
                  className="absolute h-full flex flex-col justify-end items-center focus:outline-none group"
                  style={{ 
                    left: `${x}%`, 
                    transform: 'translateX(-50%)',
                    width: `${100 / Math.max(values.length, 1)}%`,
                    minWidth: '40px'
                  }}
                  onClick={() => handleBarTap(i)}
                >
                  <div className="w-full h-full flex flex-col justify-between items-center opacity-0 group-active:opacity-100 transition-opacity">
                    <span className="text-[10px] text-gray-500 font-medium leading-none mt-1">{item.valueFormatter ? item.valueFormatter(values[i]) : formatShort(values[i])}</span>
                    <div className="w-px h-full bg-gray-300/50 my-1" />
                  </div>
                  <span
                    className="text-[10px] font-medium leading-none transition-colors duration-300 absolute -bottom-5 w-full text-center"
                    style={{ color: selectedBar?.name === String(d.name) ? item.color : '#9ca3af' }}
                  >
                    {String(d.name)}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Tap popup */}
        {selectedBar && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
            <div className="bg-white/90 backdrop-blur-md text-gray-900 rounded-2xl px-5 py-3 text-center shadow-lg border border-gray-100 animate-fadeIn">
              <p className="text-xs text-gray-500 font-medium">{selectedBar.name}</p>
              <p className="text-lg font-bold mt-0.5" style={{ color: item.color }}>
                {selectedBar.value}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Dot indicators */}
      <div className="flex justify-center gap-1.5 pb-1 pt-4">
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
