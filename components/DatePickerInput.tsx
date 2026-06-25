'use client';
import { useState } from 'react';
import { createPortal } from 'react-dom';
import { DateScrollPicker } from './ScrollPicker';

interface DatePickerInputProps {
  label: string;
  value: string; // ISO date string YYYY-MM-DD
  onChange: (iso: string) => void;
  minDate?: string;
  maxDate?: string;
}

export default function DatePickerInput({
  label,
  value,
  onChange,
  minDate,
  maxDate,
}: DatePickerInputProps) {
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState(value);

  const months = ['Jan','Feb','Mar','Apr','Mei','Jun','Jul','Agt','Sep','Okt','Nov','Des'];
  const displayDate = value
    ? (() => {
        const [y, m, d] = value.split('-');
        return `${d} ${months[Number(m) - 1]} ${y}`;
      })()
    : 'Pilih tanggal';

  const handleOpen = () => {
    setDraft(value);
    setOpen(true);
  };

  const handleConfirm = () => {
    if (draft) onChange(draft);
    setOpen(false);
  };

  return (
    <>
      {/* Trigger button */}
      <div className="flex-1 min-w-0">
        <label className="text-[10px] text-gray-400 uppercase tracking-wide font-semibold block mb-1">
          {label}
        </label>
        <button
          type="button"
          onClick={handleOpen}
          className="w-full flex items-center gap-2 px-3 py-2.5 bg-gray-100 rounded-xl border-2 border-transparent active:border-blue-500 transition-all text-left"
        >
          <span className="text-primary-accent text-sm flex-shrink-0">📅</span>
          <span className="text-sm font-medium text-gray-800 truncate">{displayDate}</span>
          <span className="ml-auto text-gray-400 text-xs flex-shrink-0">▾</span>
        </button>
      </div>

      {/* Bottom sheet overlay — rendered via portal to escape stacking context */}
      {open && createPortal(
        <div className="fixed inset-0 z-[99999] flex flex-col justify-end">
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={() => setOpen(false)}
          />
          <div
            className="relative bg-white rounded-t-3xl shadow-[0_-8px_30px_rgba(0,0,0,0.12)] overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Handle bar */}
            <div className="flex justify-center pt-3 pb-1">
              <div className="w-10 h-1 rounded-full bg-gray-300" />
            </div>

            {/* Header */}
            <div className="flex items-center justify-between px-5 py-2 border-b border-gray-100">
              <button
                onClick={() => setOpen(false)}
                className="text-sm font-medium text-gray-500 py-1"
              >
                Batal
              </button>
              <span className="text-sm font-bold text-gray-900">{label}</span>
              <button
                onClick={handleConfirm}
                className="text-sm font-semibold text-primary-accent py-1"
              >
                Selesai
              </button>
            </div>

            {/* Scroll Picker */}
            <DateScrollPicker
              value={draft || value}
              onChange={setDraft}
              minDate={minDate}
              maxDate={maxDate}
            />
          </div>
        </div>
      , document.body)}
    </>
  );
}
