'use client';
import { useState, useEffect, Suspense } from 'react';
import Image from 'next/image';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/lib/authContext';

import { Hospital, User, Lock, Eye, EyeOff, ChevronDown, Plus, X } from 'lucide-react';

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
    <div
      className="min-h-screen flex flex-col items-center justify-center px-5 py-10 bg-gray-50"
    >
      <div className="w-full max-w-sm bg-white rounded-3xl shadow-2xl overflow-hidden">

        {/* Logo + app name */}
        <div className="flex flex-col items-center pt-8 pb-5 px-6">
          <div className="w-20 h-20 rounded-3xl bg-blue-50 flex items-center justify-center shadow mb-4 overflow-hidden">
            <Image
              src="/vmedis-ico.png"
              alt="Vmedis"
              width={72}
              height={72}
              className="object-contain"
              priority
            />
          </div>
          <h1 className="text-xl font-extrabold text-gray-900 tracking-tight">Vmedis Mobile</h1>
          <p className="text-xs text-gray-400 mt-0.5">VMEDIS Apotek/Klinik</p>
        </div>

        <div className="px-6 pb-8">

          {/* Error */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-2.5 mb-4 flex items-center gap-2">
              <span className="text-red-500 text-sm">⚠️</span>
              <span className="text-sm text-red-600">{error}</span>
            </div>
          )}

          {/* Domain */}
          <div className="mb-3">
            <label className="text-[11px] font-semibold text-gray-500 mb-1.5 block uppercase tracking-wide">
              Domain
            </label>
            <div className="flex items-center bg-gray-100 rounded-full border-2 border-transparent focus-within:border-blue-500 focus-within:bg-white transition-all overflow-hidden">
              <span className="pl-4 text-gray-400 flex-shrink-0"><Hospital size={18} /></span>
              <input
                type="text"
                value={domain}
                onChange={(e) => setDomain(e.target.value.replace(/[^a-zA-Z0-9-]/g, '').toLowerCase())}
                placeholder="Masukkan Domain"
                className="flex-1 pl-2 py-3 bg-transparent text-sm outline-none min-w-0"
                autoCapitalize="none"
                autoComplete="off"
                onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
              />
              <span className="pr-4 text-sm text-gray-400 font-medium flex-shrink-0">.vmedis.com</span>
            </div>
          </div>

          {/* Username */}
          <div className="mb-3">
            <label className="text-[11px] font-semibold text-gray-500 mb-1.5 block uppercase tracking-wide">
              Username
            </label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"><User size={18} /></span>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Masukkan username"
                className="w-full pl-11 pr-4 py-3 bg-gray-100 rounded-full text-sm outline-none border-2 border-transparent focus:border-blue-500 focus:bg-white transition-all"
                autoCapitalize="none"
                autoComplete="username"
                onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
              />
            </div>
          </div>

          {/* Password */}
          <div className="mb-6">
            <label className="text-[11px] font-semibold text-gray-500 mb-1.5 block uppercase tracking-wide">
              Password
            </label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"><Lock size={18} /></span>
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Masukkan password"
                className="w-full pl-11 pr-12 py-3 bg-gray-100 rounded-full text-sm outline-none border-2 border-transparent focus:border-blue-500 focus:bg-white transition-all"
                autoComplete="current-password"
                onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {/* Submit */}
          <button
            onClick={handleLogin}
            disabled={loading}
            className="w-full bg-green-600 text-white font-bold py-3.5 rounded-full text-sm shadow-md active:opacity-90 transition-opacity disabled:opacity-60"
          >
            {loading ? 'Proses Masuk...' : 'Masuk'}
          </button>

          {/* Saved Sessions Toggle */}
          {sessions.length > 0 && (
            <div className="mt-6 text-center">
              <button
                onClick={() => setShowSessions(true)}
                className="text-sm text-blue-600 font-medium hover:underline"
              >
                Pilih Akun Tersimpan
              </button>
            </div>
          )}
        </div>
      </div>

      <p className="text-center text-xs text-gray-400 mt-6">
        © 2025 Vmedis Mobile v1.0.0
      </p>

      {/* Sessions Bottom Sheet */}
      {showSessions && (
        <div
          className="fixed inset-0 z-50 flex flex-col justify-end"
          style={{ background: 'rgba(0,0,0,0.45)' }}
          onClick={() => setShowSessions(false)}
        >
          <div
            className="bg-white rounded-t-3xl overflow-hidden max-h-[80vh] flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Handle bar */}
            <div className="flex justify-center pt-3 pb-1 flex-shrink-0">
              <div className="w-10 h-1 rounded-full bg-gray-300" />
            </div>

            {/* Header */}
            <div className="flex items-center justify-between px-5 py-3 border-b border-gray-100 flex-shrink-0">
              <span className="text-base font-bold text-gray-900">Pilih Akun</span>
              <button onClick={() => setShowSessions(false)} className="p-1 text-gray-500 hover:bg-gray-100 rounded-full">
                <X size={20} />
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
                    <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-lg overflow-hidden">
                      {session.avatar.startsWith('http') ? (
                        <img src={session.avatar} alt={session.nama} className="w-full h-full object-cover" />
                      ) : (
                        session.avatar
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold text-gray-900 truncate">{session.nama}</p>
                      <p className="text-xs text-gray-500 truncate">@{session.username} • {session.domain}</p>
                    </div>
                  </button>
                  <button
                    onClick={() => removeSession(session.username, session.domain)}
                    className="p-2 text-red-500 hover:bg-red-50 rounded-full ml-2"
                  >
                    <X size={18} />
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
                className="w-full flex items-center justify-center gap-2 p-4 border-2 border-dashed border-gray-200 rounded-2xl text-gray-500 hover:bg-gray-50 hover:border-gray-300 transition-colors"
              >
                <Plus size={20} />
                <span className="text-sm font-medium">Tambah Akun Baru</span>
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
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center bg-gray-50">Loading...</div>}>
      <LoginContent />
    </Suspense>
  );
}
