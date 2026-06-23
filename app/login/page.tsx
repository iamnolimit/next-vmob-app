'use client';
import { useState, useEffect, Suspense } from 'react';
import Image from 'next/image';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/lib/authContext';
import AvatarImage from '@/components/AvatarImage';

function LoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { login, sessions, switchSession, removeSession } = useAuth();
  const [domain, setDomain] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showSessions, setShowSessions] = useState(false);

  useEffect(() => {
    if (searchParams.get('showSessions') === 'true' && sessions.length > 0) {
      setShowSessions(true);
    }
  }, [searchParams, sessions.length]);

  const handleLogin = async () => {
    if (!domain.trim()) {
      setError('Domain wajib diisi.');
      return;
    }
    if (!username.trim() || !password.trim()) {
      setError('Username dan password wajib diisi.');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const success = await login(domain.trim(), username.trim(), password);
      setLoading(false);
      if (success) {
        router.push('/dashboard');
      } else {
        setError('Login gagal. Periksa kembali data Anda.');
      }
    } catch (err: unknown) {
      setLoading(false);
      setError(err instanceof Error ? err.message : 'Login gagal.');
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">

      {/* Header — sama seperti dashboard */}
      <div className="relative z-10 bg-primary-accent rounded-b-[2.5rem] shadow-md">
        <div className="px-6 pt-10 pb-6 flex flex-col items-center gap-4">
          {/* Logo */}
          <div className="w-16 h-16 rounded-2xl bg-white/20 border border-white/30 flex items-center justify-center overflow-hidden shadow-lg">
            <Image
              src="/vmedis-ico.png"
              alt="Vmedis"
              width={52}
              height={52}
              className="object-contain"
              priority
            />
          </div>
          <div className="text-center">
            <h1 className="text-[22px] font-bold text-white tracking-tight leading-tight">Vmedis Mobile</h1>
            <p className="text-[14px] font-medium text-blue-100 mt-0.5">VMEDIS Apotek / Klinik</p>
          </div>
        </div>
      </div>

      {/* Form area */}
      <div className="flex-1 px-6 pt-8 pb-10 flex flex-col">

        {/* Error */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-2xl px-4 py-3 mb-5 flex items-start gap-3">
            <svg viewBox="0 0 24 24" className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
              <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
              <line x1="12" y1="9" x2="12" y2="13" />
              <line x1="12" y1="17" x2="12.01" y2="17" />
            </svg>
            <span className="text-sm text-red-600">{error}</span>
          </div>
        )}

        {/* Domain */}
        <div className="mb-4">
          <label className="text-[11px] font-bold text-gray-400 mb-2 block uppercase tracking-widest">
            Domain
          </label>
          <div className="flex items-center bg-white rounded-2xl border-2 border-gray-100 focus-within:border-primary-accent transition-colors shadow-sm overflow-hidden">
            <span className="pl-4 flex-shrink-0 text-primary-accent/60">
              <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
                <polyline points="9 22 9 12 15 12 15 22" />
              </svg>
            </span>
            <input
              type="text"
              value={domain}
              onChange={(e) => setDomain(e.target.value.replace(/[^a-zA-Z0-9-]/g, '').toLowerCase())}
              placeholder="nama-domain"
              className="flex-1 pl-3 pr-2 py-3.5 bg-transparent text-sm outline-none min-w-0 text-gray-800 placeholder:text-gray-300"
              autoCapitalize="none"
              autoComplete="off"
              onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
            />
            <span className="pr-4 text-xs text-gray-400 font-semibold flex-shrink-0 bg-gray-50 self-stretch flex items-center px-3 border-l border-gray-100">
              .vmedis.com
            </span>
          </div>
        </div>

        {/* Username */}
        <div className="mb-4">
          <label className="text-[11px] font-bold text-gray-400 mb-2 block uppercase tracking-widest">
            Username
          </label>
          <div className="flex items-center bg-white rounded-2xl border-2 border-gray-100 focus-within:border-primary-accent transition-colors shadow-sm">
            <span className="pl-4 flex-shrink-0 text-primary-accent/60">
              <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" />
                <circle cx="12" cy="7" r="4" />
              </svg>
            </span>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Masukkan username"
              className="flex-1 pl-3 pr-4 py-3.5 bg-transparent text-sm outline-none text-gray-800 placeholder:text-gray-300"
              autoCapitalize="none"
              autoComplete="username"
              onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
            />
          </div>
        </div>

        {/* Password */}
        <div className="mb-7">
          <label className="text-[11px] font-bold text-gray-400 mb-2 block uppercase tracking-widest">
            Password
          </label>
          <div className="flex items-center bg-white rounded-2xl border-2 border-gray-100 focus-within:border-primary-accent transition-colors shadow-sm">
            <span className="pl-4 flex-shrink-0 text-primary-accent/60">
              <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="11" width="18" height="11" rx="2" />
                <path d="M7 11V7a5 5 0 0110 0v4" />
              </svg>
            </span>
            <input
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Masukkan password"
              className="flex-1 pl-3 pr-2 py-3.5 bg-transparent text-sm outline-none text-gray-800 placeholder:text-gray-300"
              autoComplete="current-password"
              onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="pr-4 pl-2 text-gray-400 active:text-primary-accent transition-colors"
            >
              {showPassword ? (
                <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                  <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94" />
                  <path d="M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19" />
                  <line x1="1" y1="1" x2="23" y2="23" />
                </svg>
              ) : (
                <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                  <circle cx="12" cy="12" r="3" />
                </svg>
              )}
            </button>
          </div>
        </div>

        {/* Submit */}
        <button
          onClick={handleLogin}
          disabled={loading}
          className="w-full bg-primary-accent text-white font-bold py-4 rounded-2xl text-sm shadow-lg shadow-primary-accent/30 active:opacity-90 transition-opacity disabled:opacity-60 flex items-center justify-center gap-2"
        >
          {loading ? (
            <>
              <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
              </svg>
              Proses Masuk...
            </>
          ) : (
            <>
              <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
                <path d="M15 3h4a2 2 0 012 2v14a2 2 0 01-2 2h-4" />
                <polyline points="10 17 15 12 10 7" />
                <line x1="15" y1="12" x2="3" y2="12" />
              </svg>
              Masuk
            </>
          )}
        </button>

        {/* Saved Sessions */}
        {sessions.length > 0 && (
          <div className="mt-5 text-center">
            <button
              onClick={() => setShowSessions(true)}
              className="inline-flex items-center gap-1.5 text-sm text-primary-accent font-semibold"
            >
              <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" />
                <circle cx="12" cy="7" r="4" />
              </svg>
              Pilih Akun Tersimpan
            </button>
          </div>
        )}

        <p className="text-center text-xs text-gray-400 mt-auto pt-8">
          © 2025 Vmedis Mobile v1.0.0
        </p>
      </div>

      {/* Sessions Bottom Sheet */}
      {showSessions && (
        <div
          className="fixed inset-0 z-50 flex flex-col justify-end"
          style={{ background: 'rgba(0,0,0,0.5)' }}
          onClick={() => setShowSessions(false)}
        >
          <div
            className="bg-white rounded-t-3xl overflow-hidden max-h-[80vh] flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Handle bar */}
            <div className="flex justify-center pt-3 pb-1 flex-shrink-0">
              <div className="w-10 h-1 rounded-full bg-gray-200" />
            </div>

            {/* Header */}
            <div className="flex items-center justify-between px-5 py-3 border-b border-gray-100 flex-shrink-0">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-primary-accent/10 flex items-center justify-center">
                  <svg viewBox="0 0 24 24" className="w-4 h-4 text-primary-accent" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                    <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" />
                    <circle cx="12" cy="7" r="4" />
                  </svg>
                </div>
                <span className="text-base font-bold text-gray-900">Pilih Akun</span>
              </div>
              <button
                onClick={() => setShowSessions(false)}
                className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 text-gray-500 active:bg-gray-200 transition-colors"
              >
                <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round">
                  <path d="M18 6L6 18M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="overflow-y-auto p-4 space-y-3">
              {sessions.map((session) => (
                <div key={`${session.domain}-${session.username}`} className="flex items-center justify-between p-3 bg-gray-50 rounded-2xl border border-gray-100">
                  <button
                    className="flex items-center gap-3 flex-1 text-left"
                    onClick={() => {
                      switchSession(session);
                      router.replace('/dashboard');
                    }}
                  >
                    <div className="w-11 h-11 rounded-full bg-primary-accent/10 flex items-center justify-center text-primary-accent font-bold text-base overflow-hidden border-2 border-primary-accent/20">
                      <AvatarImage 
                        src={session.avatar} 
                        alt={session.nama} 
                        fallbackText={(session.nama || session.username).substring(0, 2).toUpperCase()} 
                        className="w-full h-full object-cover" 
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold text-gray-900 truncate">{session.nama}</p>
                      <p className="text-xs text-gray-400 truncate">@{session.username} · {session.domain}</p>
                    </div>
                    <svg viewBox="0 0 24 24" className="w-4 h-4 text-primary-accent/40 flex-shrink-0" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="9 18 15 12 9 6" />
                    </svg>
                  </button>
                  <button
                    onClick={() => removeSession(session.username, session.domain)}
                    className="w-8 h-8 flex items-center justify-center rounded-full text-red-400 active:bg-red-50 transition-colors ml-1 flex-shrink-0"
                  >
                    <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round">
                      <path d="M18 6L6 18M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              ))}

              <button
                onClick={() => {
                  setShowSessions(false);
                  setDomain('');
                  setUsername('');
                  setPassword('');
                }}
                className="w-full flex items-center justify-center gap-2 p-4 border-2 border-dashed border-primary-accent/20 rounded-2xl text-primary-accent active:bg-primary-accent/5 transition-colors"
              >
                <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="9" />
                  <line x1="12" y1="8" x2="12" y2="16" />
                  <line x1="8" y1="12" x2="16" y2="12" />
                </svg>
                <span className="text-sm font-semibold">Tambah Akun Baru</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center bg-primary-accent" />}>
      <LoginContent />
    </Suspense>
  );
}
