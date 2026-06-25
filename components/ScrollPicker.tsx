'use client';
import { useEffect, useRef, useState } from 'react';

interface ScrollPickerColumnProps {
  items: { value: number; label: string }[];
  selectedValue: number;
  onSelect: (value: number) => void;
}

const ITEM_HEIGHT = 44;
const VISIBLE_ITEMS = 5;

function ScrollPickerColumn({ items, selectedValue, onSelect }: ScrollPickerColumnProps) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const initialOffset = (() => {
    const index = items.findIndex((it) => it.value === selectedValue);
    return index >= 0 ? -index * ITEM_HEIGHT : 0;
  })();
  const currentOffsetRef = useRef(initialOffset);
  const animFrameRef = useRef<number | null>(null);
  const isDraggingRef = useRef(false);
  const [offset, setOffset] = useState(initialOffset);

  const paddingItems = Math.floor(VISIBLE_ITEMS / 2);
  const maxOffset = 0;
  const minOffset = -(items.length - 1) * ITEM_HEIGHT;

  // Sync position whenever selectedValue changes (e.g. external prop update),
  // but skip if the user is currently dragging to avoid interrupting the gesture.
  useEffect(() => {
    if (isDraggingRef.current) return;
    const index = items.findIndex((it) => it.value === selectedValue);
    const newOffset = index >= 0 ? -index * ITEM_HEIGHT : 0;
    currentOffsetRef.current = newOffset;
    setOffset(newOffset);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedValue, items]);

  const snapToNearest = (off: number, velocity = 0) => {
    const momentumOffset = off + velocity * 60;
    const clamped = Math.max(minOffset, Math.min(maxOffset, momentumOffset));
    const snappedIndex = Math.max(0, Math.min(Math.round(-clamped / ITEM_HEIGHT), items.length - 1));
    const snappedOffset = -snappedIndex * ITEM_HEIGHT;

    const start = currentOffsetRef.current;
    const end = snappedOffset;
    const duration = 180;
    const startTime = performance.now();

    const animate = (now: number) => {
      const progress = Math.min((now - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const cur = start + (end - start) * eased;
      currentOffsetRef.current = cur;
      setOffset(cur);
      if (progress < 1) {
        animFrameRef.current = requestAnimationFrame(animate);
      } else {
        currentOffsetRef.current = end;
        setOffset(end);
        onSelect(items[snappedIndex].value);
      }
    };
    if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    animFrameRef.current = requestAnimationFrame(animate);
  };

  // Attach native touch listeners with { passive: false } so preventDefault works
  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;

    let startY = 0;
    let startOffset = 0;
    let lastY = 0;
    let lastTime = 0;
    let velocity = 0;

    const onTouchStart = (e: TouchEvent) => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
      isDraggingRef.current = true;
      startY = e.touches[0].clientY;
      startOffset = currentOffsetRef.current;
      lastY = startY;
      lastTime = Date.now();
      velocity = 0;
    };

    const onTouchMove = (e: TouchEvent) => {
      e.preventDefault();
      const y = e.touches[0].clientY;
      const now = Date.now();
      const dt = now - lastTime;
      if (dt > 0) velocity = (y - lastY) / dt;
      lastY = y;
      lastTime = now;

      let newOffset = startOffset + (y - startY);
      if (newOffset > maxOffset) newOffset = maxOffset + (newOffset - maxOffset) * 0.25;
      if (newOffset < minOffset) newOffset = minOffset + (newOffset - minOffset) * 0.25;
      currentOffsetRef.current = newOffset;
      setOffset(newOffset);
    };

    const onTouchEnd = () => {
      isDraggingRef.current = false;
      snapToNearest(currentOffsetRef.current, velocity);
      velocity = 0;
    };

    el.addEventListener('touchstart', onTouchStart, { passive: true });
    el.addEventListener('touchmove', onTouchMove, { passive: false });
    el.addEventListener('touchend', onTouchEnd, { passive: true });

    return () => {
      el.removeEventListener('touchstart', onTouchStart);
      el.removeEventListener('touchmove', onTouchMove);
      el.removeEventListener('touchend', onTouchEnd);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [items, minOffset]);

  const handleItemClick = (index: number) => {
    snapToNearest(-index * ITEM_HEIGHT);
  };

  return (
    <div
      ref={wrapRef}
      className="relative flex-1 select-none"
      style={{ height: ITEM_HEIGHT * VISIBLE_ITEMS, overflow: 'hidden', cursor: 'grab' }}
    >
      {/* Selection highlight */}
      <div
        className="absolute left-1 right-1 pointer-events-none z-10 rounded-xl bg-gray-100"
        style={{ top: ITEM_HEIGHT * paddingItems, height: ITEM_HEIGHT }}
      />

      {/* Top fade */}
      <div
        className="absolute top-0 left-0 right-0 pointer-events-none z-40"
        style={{
          height: ITEM_HEIGHT * paddingItems,
          background: 'linear-gradient(to bottom, rgba(255,255,255,1) 30%, rgba(255,255,255,0.2))',
        }}
      />
      {/* Bottom fade */}
      <div
        className="absolute bottom-0 left-0 right-0 pointer-events-none z-40"
        style={{
          height: ITEM_HEIGHT * paddingItems,
          background: 'linear-gradient(to top, rgba(255,255,255,1) 30%, rgba(255,255,255,0.2))',
        }}
      />

      {/* Items list — translated by offset; z-30 so it renders above highlight (z-10) and fades (z-20) */}
      <div
        className="relative z-30"
        style={{
          transform: `translateY(${offset + paddingItems * ITEM_HEIGHT}px)`,
          willChange: 'transform',
        }}
      >
        {items.map((item, index) => {
          // Highlight the item that is visually centered, not just the selectedValue prop.
          // This avoids grey-center issues when offset and selectedValue are briefly out of sync.
          const centeredIndex = Math.max(0, Math.min(Math.round(-offset / ITEM_HEIGHT), items.length - 1));
          const isCenter = index === centeredIndex;
          return (
            <div
              key={item.value}
              onClick={() => handleItemClick(index)}
              className="flex items-center justify-center"
              style={{ height: ITEM_HEIGHT }}
            >
              <span
                className={`transition-colors duration-100 ${
                  isCenter
                    ? 'font-bold text-gray-900 text-[17px]'
                    : 'font-normal text-gray-400 text-[15px]'
                }`}
              >
                {item.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── Date Picker (day / month / year) ────────────────────────────────────────

interface DateScrollPickerProps {
  value: string; // YYYY-MM-DD
  onChange: (iso: string) => void;
  minDate?: string;
  maxDate?: string;
}

const MONTH_NAMES = [
  'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
  'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember',
];

function daysInMonth(year: number, month: number) {
  return new Date(year, month, 0).getDate();
}

export function DateScrollPicker({ value, onChange, minDate, maxDate }: DateScrollPickerProps) {
  const today = new Date();
  const parsed = value ? value.split('-').map(Number) : null;
  const selYear = parsed ? parsed[0] : today.getFullYear();
  const selMonth = parsed ? parsed[1] : today.getMonth() + 1;
  const selDay = parsed ? parsed[2] : today.getDate();

  const minY = minDate ? Number(minDate.split('-')[0]) : today.getFullYear() - 10;
  const maxY = maxDate ? Number(maxDate.split('-')[0]) : today.getFullYear() + 5;

  const years = Array.from({ length: maxY - minY + 1 }, (_, i) => ({
    value: minY + i,
    label: String(minY + i),
  }));

  const months = MONTH_NAMES.map((name, i) => ({ value: i + 1, label: name }));

  const totalDays = daysInMonth(selYear, selMonth);
  const days = Array.from({ length: totalDays }, (_, i) => ({
    value: i + 1,
    label: String(i + 1).padStart(2, '0'),
  }));

  const clampedDay = Math.min(selDay, totalDays);

  const emit = (y: number, m: number, d: number) => {
    const dd = Math.min(d, daysInMonth(y, m));
    onChange(`${y}-${String(m).padStart(2, '0')}-${String(dd).padStart(2, '0')}`);
  };

  return (
    <div className="flex gap-1 px-4 pb-4">
      {/* Day */}
      <ScrollPickerColumn
        items={days}
        selectedValue={clampedDay}
        onSelect={(d) => emit(selYear, selMonth, d)}
      />
      {/* Month */}
      <ScrollPickerColumn
        items={months}
        selectedValue={selMonth}
        onSelect={(m) => emit(selYear, m, selDay)}
      />
      {/* Year */}
      <ScrollPickerColumn
        items={years}
        selectedValue={selYear}
        onSelect={(y) => emit(y, selMonth, selDay)}
      />
    </div>
  );
}

// ─── Month Picker (month / year) ─────────────────────────────────────────────

interface MonthScrollPickerProps {
  value: string; // YYYY-MM
  onChange: (iso: string) => void;
}

export function MonthScrollPicker({ value, onChange }: MonthScrollPickerProps) {
  const today = new Date();
  const parsed = value ? value.split('-').map(Number) : null;
  const selYear = parsed ? parsed[0] : today.getFullYear();
  const selMonth = parsed ? parsed[1] : today.getMonth() + 1;

  const minY = today.getFullYear() - 10;
  const maxY = today.getFullYear() + 5;

  const years = Array.from({ length: maxY - minY + 1 }, (_, i) => ({
    value: minY + i,
    label: String(minY + i),
  }));

  const months = MONTH_NAMES.map((name, i) => ({ value: i + 1, label: name }));

  const emit = (y: number, m: number) => {
    onChange(`${y}-${String(m).padStart(2, '0')}`);
  };

  return (
    <div className="flex gap-1 px-4 pb-4">
      {/* Month */}
      <ScrollPickerColumn
        items={months}
        selectedValue={selMonth}
        onSelect={(m) => emit(selYear, m)}
      />
      {/* Year */}
      <ScrollPickerColumn
        items={years}
        selectedValue={selYear}
        onSelect={(y) => emit(y, selMonth)}
      />
    </div>
  );
}

// ─── Year Picker (year only) ──────────────────────────────────────────────────

interface YearScrollPickerProps {
  value: string; // YYYY
  onChange: (iso: string) => void;
}

export function YearScrollPicker({ value, onChange }: YearScrollPickerProps) {
  const today = new Date();
  const selYear = value ? Number(value) : today.getFullYear();

  const minY = today.getFullYear() - 10;
  const maxY = today.getFullYear() + 5;

  const years = Array.from({ length: maxY - minY + 1 }, (_, i) => ({
    value: minY + i,
    label: String(minY + i),
  }));

  return (
    <div className="flex gap-1 px-4 pb-4">
      <ScrollPickerColumn
        items={years}
        selectedValue={selYear}
        onSelect={(y) => onChange(String(y))}
      />
    </div>
  );
}
