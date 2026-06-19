'use client';

export default function KonstaApp({ children }: { children: React.ReactNode }) {
  return (
    <div className="h-full">
      {children}
    </div>
  );
}
