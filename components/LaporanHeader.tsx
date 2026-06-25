'use client';
import { useState } from 'react';
import { createPortal } from 'react-dom';
import { useRouter } from 'next/navigation';
import { useSidebar } from '@/lib/sidebarContext';
import { useAuth } from '@/lib/authContext';

interface LaporanHeaderProps {
  title: string;
  subtitle?: string;
  onExportPdf?: () => void;
  onExportExcel?: () => void;
}

function HamburgerBtn({ onClick }: { onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="w-12 h-12 flex items-center justify-center rounded-full bg-white shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] active:scale-95 transition-transform"
    >
      <svg viewBox="0 0 24 24" className="w-6 h-6 text-gray-700" fill="currentColor">
        <rect x="4" y="6"  width="16" height="2" rx="1" />
        <rect x="4" y="11" width="12" height="2" rx="1" />
        <rect x="4" y="16" width="16" height="2" rx="1" />
      </svg>
    </button>
  );
}

function ProfileBtn({ onClick }: { onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="w-12 h-12 flex items-center justify-center rounded-full bg-white shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] active:scale-95 transition-transform"
    >
      <svg viewBox="0 0 24 24" className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
        <circle cx="12" cy="7" r="4" />
      </svg>
    </button>
  );
}

function BackBtn({ onClick }: { onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="w-12 h-12 flex items-center justify-center rounded-full bg-white shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] active:scale-95 transition-transform text-gray-700"
    >
      <svg viewBox="0 0 24 24" className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
        <path d="M15 18l-6-6 6-6" />
      </svg>
    </button>
  );
}

export default function LaporanHeader({ title, subtitle, onExportPdf, onExportExcel }: LaporanHeaderProps) {
  const router = useRouter();
  const { openSidebar } = useSidebar();
  const { user } = useAuth();
  const [showExportMenu, setShowExportMenu] = useState(false);

  return (
    <>
    <div className="mb-4 bg-[#035afc] rounded-b-[2.5rem] pb-2">
      <div className="px-6 pt-8 pb-2 flex items-center justify-between gap-4">
        <div className="flex-shrink-0 self-start">
          <BackBtn onClick={() => router.push('/dashboard')} />
        </div>

        <div className="flex-1 flex flex-col justify-center min-w-0">
          <p className="text-[14px] font-medium text-blue-100 mb-0.5">
            Laporan
          </p>
          <h1 className="text-[22px] font-bold text-white tracking-tight leading-tight">
            {title}
          </h1>
        </div>

        <div className="flex items-center justify-end gap-2 relative">
          {(onExportPdf || onExportExcel) && (
            <button
              onClick={() => setShowExportMenu(true)}
              className="w-12 h-12 flex items-center justify-center rounded-full bg-white shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] active:scale-95 transition-transform"
            >
              <svg viewBox="0 0 24 24" className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                <polyline points="7 10 12 15 17 10" />
                <line x1="12" y1="15" x2="12" y2="3" />
              </svg>
            </button>
          )}

          <HamburgerBtn onClick={openSidebar} />
        </div>
      </div>
    </div>
    
    {/* Export Bottom Sheet — via portal to escape stacking context */}
    {showExportMenu && createPortal(
      <div className="fixed inset-0 z-[99999] flex flex-col justify-end">
        <div 
          className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity"
          onClick={() => setShowExportMenu(false)}
        />
        <div className="relative bg-white rounded-t-3xl shadow-[0_-8px_30px_rgba(0,0,0,0.12)] overflow-hidden animate-in slide-in-from-bottom-full duration-300">
          <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
            <span className="text-base font-bold text-gray-800">Pilih Format Export</span>
            <button onClick={() => setShowExportMenu(false)} className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 text-gray-500 active:bg-gray-200">
              <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round"><path d="M18 6L6 18M6 6l12 12" /></svg>
            </button>
          </div>
          <div className="p-4 space-y-3 pb-8">
            {onExportPdf && (
              <button
                onClick={() => {
                  onExportPdf();
                  setShowExportMenu(false);
                }}
                className="w-full px-5 py-4 text-left text-sm font-bold text-gray-700 bg-gray-50 rounded-2xl active:bg-gray-100 flex items-center gap-4 transition-colors border border-gray-100"
              >
                <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center text-red-500 flex-shrink-0">
                  <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                    <polyline points="14 2 14 8 20 8" />
                    <line x1="16" y1="13" x2="8" y2="13" />
                    <line x1="16" y1="17" x2="8" y2="17" />
                    <polyline points="10 9 9 9 8 9" />
                  </svg>
                </div>
                Export sebagai PDF
              </button>
            )}
            {onExportExcel && (
              <button
                onClick={() => {
                  onExportExcel();
                  setShowExportMenu(false);
                }}
                className="w-full px-5 py-4 text-left text-sm font-bold text-gray-700 bg-gray-50 rounded-2xl active:bg-gray-100 flex items-center gap-4 transition-colors border border-gray-100"
              >
                <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center text-green-600 flex-shrink-0">
                  <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                    <polyline points="14 2 14 8 20 8" />
                    <path d="M8 13h2" />
                    <path d="M8 17h2" />
                    <path d="M14 13h2" />
                    <path d="M14 17h2" />
                  </svg>
                </div>
                Export sebagai Excel
              </button>
            )}
          </div>
        </div>
      </div>
    , document.body)}
    </>
  );
}
