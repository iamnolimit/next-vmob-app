'use client';
import { useState } from 'react';
import { Hospital } from 'lucide-react';

export interface SelectOption {
  label: string;
  value: string;
}

interface SelectInputProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: SelectOption[];
  icon?: React.ReactNode;
}

export default function SelectInput({
  label,
  value,
  onChange,
  options,
  icon = <Hospital size={16} />,
}: SelectInputProps) {
  const [open, setOpen] = useState(false);

  const selected = options.find((o) => o.value === value);

  const handleSelect = (val: string) => {
    onChange(val);
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
          <span className="text-primary-accent text-sm flex-shrink-0">{icon}</span>
          <span className="text-sm font-medium text-gray-800 truncate">
            {selected?.label ?? 'Pilih...'}
          </span>
          <span className="ml-auto text-gray-400 text-xs flex-shrink-0">▾</span>
        </button>
      </div>

      {/* Bottom sheet overlay */}
      {open && (
        <div
          className="fixed inset-0 z-[100] flex flex-col justify-end mb-0"
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
              <div className="w-12" />
            </div>

            {/* Options list */}
            <div className="overflow-y-auto max-h-72 pb-8">
              {options.map((opt) => {
                const isActive = opt.value === value;
                return (
                  <button
                    key={opt.value}
                    onClick={() => handleSelect(opt.value)}
                    className={`w-full flex items-center justify-between px-5 py-3.5 text-left border-b border-gray-100 last:border-none active:bg-gray-50 transition-colors ${
                      isActive ? 'bg-primary-accent/10' : ''
                    }`}
                  >
                    <span
                      className={`text-sm ${
                        isActive ? 'font-semibold text-primary-accent' : 'text-gray-800'
                      }`}
                    >
                      {opt.label}
                    </span>
                    {isActive && (
                      <svg
                        viewBox="0 0 24 24"
                        className="w-5 h-5 text-primary-accent flex-shrink-0"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth={2.5}
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M20 6L9 17l-5-5" />
                      </svg>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
