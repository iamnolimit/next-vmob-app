'use client';
import { useState, useRef } from 'react';
import ReactDatePicker from 'react-datepicker';
import { format, parseISO } from 'date-fns';
import { id } from 'date-fns/locale';

// We import the CSS in globals.css override below
import 'react-datepicker/dist/react-datepicker.css';

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
  const selected = value ? parseISO(value) : new Date();

  const months = ['Jan','Feb','Mar','Apr','Mei','Jun','Jul','Agt','Sep','Okt','Nov','Des'];
  const displayDate = value
    ? (() => {
        const [y, m, d] = value.split('-');
        return `${d} ${months[Number(m) - 1]} ${y}`;
      })()
    : 'Pilih tanggal';

  const handleChange = (date: Date | null) => {
    if (date) {
      onChange(format(date, 'yyyy-MM-dd'));
    }
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
          onClick={() => setOpen(true)}
          className="w-full flex items-center gap-2 px-3 py-2.5 bg-gray-100 rounded-xl border-2 border-transparent active:border-blue-500 transition-all text-left"
        >
          <span className="text-[#4f6dfa] text-sm flex-shrink-0">📅</span>
          <span className="text-sm font-medium text-gray-800 truncate">{displayDate}</span>
          <span className="ml-auto text-gray-400 text-xs flex-shrink-0">▾</span>
        </button>
      </div>

      {/* Bottom sheet overlay */}
      {open && (
        <div
          className="fixed inset-0 z-[100] flex flex-col justify-end"
          style={{ background: 'rgba(0,0,0,0.4)' }}
          onClick={() => setOpen(false)}
        >
          <div
            className="bg-white rounded-t-3xl overflow-hidden"
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
                onClick={() => {
                  // apply current selection (already handled by handleChange)
                  setOpen(false);
                }}
                className="text-sm font-semibold text-[#4f6dfa] py-1"
              >
                Selesai
              </button>
            </div>

            {/* Calendar */}
            <div className="vmob-datepicker px-2 pb-6">
              <ReactDatePicker
                selected={selected}
                onChange={handleChange}
                inline
                locale={id}
                minDate={minDate ? parseISO(minDate) : undefined}
                maxDate={maxDate ? parseISO(maxDate) : undefined}
                calendarClassName="vmob-cal"
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
}
