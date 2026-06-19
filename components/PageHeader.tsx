'use client';
import { useRouter } from 'next/navigation';
import { useSidebar } from '@/lib/sidebarContext';
import { useAuth } from '@/lib/authContext';
import type { ReactNode } from 'react';

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  showBack?: boolean;
  showMenu?: boolean;
  subnavbar?: ReactNode;
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
      className="w-10 h-10 rounded-full bg-white shadow-sm flex items-center justify-center text-gray-600 mb-4 active:scale-95 transition-transform"
    >
      <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
        <path d="M15 18l-6-6 6-6" />
      </svg>
    </button>
  );
}

export default function PageHeader({
  title,
  subtitle,
  showBack = false,
  showMenu = true,
  subnavbar,
}: PageHeaderProps) {
  const router = useRouter();
  const { openSidebar } = useSidebar();
  const { user } = useAuth();

  const resolvedSubtitle =
    subtitle ?? (user ? `Halo, ${user.nama.split(' ')[0]} 👋` : undefined);

  return (
    <div className="relative z-10 mb-4">
      {/* Clean, modern header without the heavy background */}
      <div className="px-6 pt-8 pb-2 flex items-center justify-between gap-4">
        {/* Left slot: Menu or Back button */}
        <div className="flex-shrink-0 self-start">
          {showBack ? (
            <BackBtn onClick={() => router.back()} />
          ) : showMenu ? (
            <HamburgerBtn onClick={openSidebar} />
          ) : null}
        </div>

        {/* Center slot: Title & Subtitle */}
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

        {/* Right slot: Profile */}
        {showMenu && (
          <div className="flex-shrink-0 self-start">
            <ProfileBtn onClick={() => router.push('/profil')} />
          </div>
        )}
      </div>

      {/* Subnavbar (segmented tabs) */}
      {subnavbar && (
        <div className="px-2">
          {subnavbar}
        </div>
      )}
    </div>
  );
}
