'use client';
import { useRouter } from 'next/navigation';
import { useSidebar } from '@/lib/sidebarContext';

interface LaporanHeaderProps {
  title: string;
  subtitle?: string;
}

function HamburgerBtn({ onClick }: { onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="w-11 h-11 flex items-center justify-center rounded-xl active:bg-white/10"
    >
      <svg viewBox="0 0 24 24" className="w-7 h-7 text-white" fill="currentColor">
        <rect x="3" y="5"  width="18" height="2.5" rx="1.25" />
        <rect x="3" y="11" width="14" height="2.5" rx="1.25" />
        <rect x="3" y="17" width="18" height="2.5" rx="1.25" />
      </svg>
    </button>
  );
}

function BackBtn({ onClick }: { onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="flex items-center gap-0.5 text-white/90 active:opacity-60 pr-1"
    >
      <svg viewBox="0 0 24 24" className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
        <path d="M15 18l-6-6 6-6" />
      </svg>
      <span className="text-base font-medium">Kembali</span>
    </button>
  );
}

export default function LaporanHeader({ title, subtitle }: LaporanHeaderProps) {
  const router = useRouter();
  const { openSidebar } = useSidebar();

  return (
    <div
      className="flex-shrink-0 relative overflow-hidden"
      style={{ background: 'linear-gradient(135deg, #1e3a8a 0%, #2563eb 100%)' }}
    >
      <div className="absolute -top-10 -right-10 w-32 h-32 rounded-full bg-white/5 pointer-events-none" />
      <div className="h-14 flex items-center justify-between px-3 relative">
        <div className="w-24 flex justify-start">
          <BackBtn onClick={() => router.back()} />
        </div>

        <div className="flex-1 flex flex-col items-center justify-center min-w-0 px-1">
          <p className="text-base font-bold text-white leading-tight truncate w-full text-center">
            {title}
          </p>
          {subtitle && (
            <p className="text-sm text-blue-200 leading-tight truncate w-full text-center mt-0.5">
              {subtitle}
            </p>
          )}
        </div>

        <div className="w-24 flex justify-end">
          <HamburgerBtn onClick={openSidebar} />
        </div>
      </div>
    </div>
  );
}
