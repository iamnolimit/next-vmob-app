'use client';
import { useRouter } from 'next/navigation';

export default function MaintenancePage({ title }: { title: string }) {
  const router = useRouter();
  return (
    <div className="flex flex-col min-h-full bg-gray-50">
      {/* Header */}
      <div className="bg-primary-accent px-4 pt-10 pb-5 flex items-center gap-3 flex-shrink-0">
        <button
          onClick={() => router.back()}
          className="w-10 h-10 flex items-center justify-center rounded-full bg-white/20 text-white active:scale-95 transition-transform"
        >
          <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
            <path d="M15 18l-6-6 6-6" />
          </svg>
        </button>
        <h1 className="text-white font-bold text-[17px] flex-1 truncate">{title}</h1>
      </div>

      {/* Content */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 py-8">
        <div className="w-full max-w-sm bg-white rounded-3xl shadow-sm border border-gray-100 px-6 py-8 flex flex-col items-center text-center gap-5">
          {/* Icon */}
          <div className="w-20 h-20 rounded-full bg-orange-50 border border-orange-100 flex items-center justify-center">
            <svg viewBox="0 0 24 24" className="w-10 h-10 text-orange-400" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
              <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
              <line x1="12" y1="9" x2="12" y2="13" />
              <line x1="12" y1="17" x2="12.01" y2="17" />
            </svg>
          </div>

          {/* Badge */}
          <span className="inline-block bg-orange-100 text-orange-600 text-xs font-semibold px-3 py-1 rounded-full">
            Maintenance
          </span>

          {/* Text */}
          <div>
            <p className="text-sm text-gray-500 leading-relaxed">
              Laporan ini berada di luar ruang lingkup (Batasan Masalah) purwarupa penelitian. Terima kasih.
            </p>
          </div>

          {/* Divider */}
          <div className="w-full border-t border-gray-100" />

          {/* Button */}
          <button
            onClick={() => router.back()}
            className="w-full py-3.5 bg-primary-accent text-white font-bold rounded-2xl text-sm active:opacity-80 transition-opacity shadow-md shadow-primary-accent/25"
          >
            Kembali
          </button>
        </div>
      </div>
    </div>
  );
}
