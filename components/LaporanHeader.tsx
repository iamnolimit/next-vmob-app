'use client';
import { useRouter } from 'next/navigation';
import { useSidebar } from '@/lib/sidebarContext';
import { useAuth } from '@/lib/authContext';

interface LaporanHeaderProps {
  title: string;
  subtitle?: string;
  onExport?: () => void;
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

export default function LaporanHeader({ title, subtitle, onExport }: LaporanHeaderProps) {
  const router = useRouter();
  const { openSidebar } = useSidebar();
  const { user } = useAuth();

  const resolvedSubtitle =
    subtitle ?? (user ? `Halo, ${user.nama.split(' ')[0]} 👋` : undefined);

  return (
    <div className="relative z-10 mb-4">
      <div className="px-6 pt-8 pb-2 flex items-center justify-between gap-4">
        <div className="flex-shrink-0 self-start">
          <BackBtn onClick={() => router.push('/dashboard')} />
        </div>

        <div className="flex-1 flex flex-col justify-center min-w-0">
          {resolvedSubtitle && (
            <p className="text-[14px] font-medium text-gray-500 mb-0.5">
              {resolvedSubtitle}
            </p>
          )}
          <h1 className="text-[22px] font-bold text-gray-900 tracking-tight leading-tight">
            {title}
          </h1>
        </div>

        <div className="flex items-center justify-end gap-1">
          {onExport && (
            <button
              onClick={onExport}
              className="w-12 h-12 flex items-center justify-center rounded-full bg-white shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] active:scale-95 transition-transform text-gray-700"
              title="Export"
            >
              <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 3v12M7 8l5-5 5 5" />
                <path d="M5 20h14" />
              </svg>
            </button>
          )}
          <HamburgerBtn onClick={openSidebar} />
        </div>
      </div>
    </div>
  );
}
