'use client';
import { useState } from 'react';
import ReactDatePicker from 'react-datepicker';
import { format, parseISO } from 'date-fns';
import { id } from 'date-fns/locale';

import 'react-datepicker/dist/react-datepicker.css';

interface MonthPickerInputProps {
  label: string;
  value: string; // ISO month string YYYY-MM
  onChange: (iso: string) => void;
}

export default function MonthPickerInput({
  label,
  value,
  onChange,
}: MonthPickerInputProps) {
  const [open, setOpen] = useState(false);
  // parseISO needs a full date, so we append -01
  const selected = value ? parseISO(`${value}-01`) : new Date();

  const months = ['Januari','Februari','Maret','April','Mei','Juni','Juli','Agustus','September','Oktober','November','Desember'];
  const displayDate = value
    ? (() => {
        const [y, m] = value.split('-');
        return `${months[Number(m) - 1]} ${y}`;
      })()
    : 'Pilih bulan';

  const handleChange = (date: Date | null) => {
    if (date) {
      onChange(format(date, 'yyyy-MM'));
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
          <span className="text-primary-accent text-sm flex-shrink-0">📅</span>
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
                onClick={() => setOpen(false)}
                className="text-sm font-semibold text-primary-accent py-1"
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
                showMonthYearPicker
                dateFormat="MM/yyyy"
                calendarClassName="vmob-cal"
                renderCustomHeader={() => <div style={{ display: 'none' }} />}
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
}
