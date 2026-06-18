'use client';
import { useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { login as doLogin } from '@/lib/auth';

export default function LoginPage() {
  const router = useRouter();
  const [domain, setDomain] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Lupa password
  const [showForgot, setShowForgot] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotError, setForgotError] = useState('');
  const [forgotSent, setForgotSent] = useState(false);
  const [forgotLoading, setForgotLoading] = useState(false);

  const handleForgot = async () => {
    if (!forgotEmail.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(forgotEmail)) {
      setForgotError('Masukkan alamat email yang valid.');
      return;
    }
    setForgotLoading(true);
    setForgotError('');
    await new Promise((r) => setTimeout(r, 1200));
    setForgotLoading(false);
    setForgotSent(true);
  };

  const closeForgot = () => {
    setShowForgot(false);
    setForgotEmail('');
    setForgotError('');
    setForgotSent(false);
    setForgotLoading(false);
  };

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
      const profile = await doLogin(domain.trim(), username.trim(), password);
      setLoading(false);
      if (profile) {
        router.replace('/dashboard');
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
      className="min-h-screen flex flex-col items-center justify-center px-5 py-10"
      style={{ background: 'linear-gradient(135deg, #1e3a8a 0%, #2563eb 100%)' }}
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
            <div className="flex items-center bg-gray-100 rounded-xl border-2 border-transparent focus-within:border-blue-500 focus-within:bg-white transition-all overflow-hidden">
              <span className="pl-3.5 text-base flex-shrink-0">🏥</span>
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
              <span className="pr-3.5 text-sm text-gray-400 font-medium flex-shrink-0">.vmedis.com</span>
            </div>
          </div>

          {/* Username */}
          <div className="mb-3">
            <label className="text-[11px] font-semibold text-gray-500 mb-1.5 block uppercase tracking-wide">
              Username
            </label>
            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-base">👤</span>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Masukkan username"
                className="w-full pl-10 pr-4 py-3 bg-gray-100 rounded-xl text-sm outline-none border-2 border-transparent focus:border-blue-500 focus:bg-white transition-all"
                autoCapitalize="none"
                autoComplete="username"
                onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
              />
            </div>
          </div>

          {/* Password */}
          <div className="mb-1">
            <label className="text-[11px] font-semibold text-gray-500 mb-1.5 block uppercase tracking-wide">
              Password
            </label>
            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-base">🔒</span>
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Masukkan password"
                className="w-full pl-10 pr-12 py-3 bg-gray-100 rounded-xl text-sm outline-none border-2 border-transparent focus:border-blue-500 focus:bg-white transition-all"
                autoComplete="current-password"
                onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-lg"
              >
                {showPassword ? '🙈' : '👁️'}
              </button>
            </div>
          </div>

          {/* Lupa password */}
          <div className="flex justify-end mb-5">
            <button
              type="button"
              onClick={() => setShowForgot(true)}
              className="text-xs text-blue-600 font-medium py-1"
            >
              Lupa Password?
            </button>
          </div>

          {/* Submit */}
          <button
            onClick={handleLogin}
            disabled={loading}
            className="w-full bg-green-600 text-white font-bold py-3.5 rounded-xl text-sm shadow-md active:opacity-90 transition-opacity disabled:opacity-60"
          >
            {loading ? 'Proses Masuk...' : 'Masuk'}
          </button>
        </div>
      </div>

      <p className="text-center text-xs text-white/40 mt-6">
        © 2025 Vmedis Mobile v1.0.0
      </p>

      {/* ── Lupa Password Bottom Sheet ── */}
      {showForgot && (
        <div
          className="fixed inset-0 z-50 flex flex-col justify-end"
          style={{ background: 'rgba(0,0,0,0.45)' }}
          onClick={closeForgot}
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
              <button onClick={closeForgot} className="text-sm font-medium text-gray-500 py-1">
                Batal
              </button>
              <span className="text-sm font-bold text-gray-900">Lupa Password</span>
              <div className="w-12" />
            </div>

            <div className="px-5 pt-5 pb-10">
              {forgotSent ? (
                /* ── Success state ── */
                <div className="flex flex-col items-center text-center gap-3 py-4">
                  <div className="w-14 h-14 rounded-full bg-green-100 flex items-center justify-center">
                    <svg viewBox="0 0 24 24" className="w-7 h-7 text-green-600" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
                      <path d="M20 6L9 17l-5-5" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm font-bold text-gray-900">Email Terkirim!</p>
                    <p className="text-xs text-gray-500 mt-1">
                      Instruksi reset password telah dikirim ke
                    </p>
                    <p className="text-xs font-semibold text-blue-600 mt-0.5">{forgotEmail}</p>
                  </div>
                  <p className="text-[11px] text-gray-400">Silakan periksa kotak masuk atau folder spam Anda.</p>
                  <button
                    onClick={closeForgot}
                    className="mt-2 w-full bg-blue-600 text-white text-sm font-bold py-3 rounded-xl active:bg-blue-700"
                  >
                    Mengerti
                  </button>
                </div>
              ) : (
                /* ── Form ── */
                <>
                  <p className="text-sm text-gray-500 mb-5">
                    Masukkan alamat email yang terdaftar. Kami akan mengirimkan instruksi untuk mereset password Anda.
                  </p>

                  {forgotError && (
                    <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-2.5 mb-4 flex items-center gap-2">
                      <span className="text-red-500 text-sm">⚠️</span>
                      <span className="text-xs text-red-600">{forgotError}</span>
                    </div>
                  )}

                  <label className="text-[11px] font-semibold text-gray-500 mb-1.5 block uppercase tracking-wide">
                    Alamat Email
                  </label>
                  <div className="relative mb-5">
                    <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-base">✉️</span>
                    <input
                      type="email"
                      value={forgotEmail}
                      onChange={(e) => { setForgotEmail(e.target.value); setForgotError(''); }}
                      placeholder="contoh@email.com"
                      className="w-full pl-10 pr-4 py-3 bg-gray-100 rounded-xl text-sm outline-none border-2 border-transparent focus:border-blue-500 focus:bg-white transition-all"
                      autoComplete="email"
                      onKeyDown={(e) => e.key === 'Enter' && handleForgot()}
                    />
                  </div>

                  <button
                    onClick={handleForgot}
                    disabled={forgotLoading}
                    className="w-full bg-blue-600 text-white text-sm font-bold py-3.5 rounded-xl shadow-md active:bg-blue-700 disabled:opacity-60 transition-opacity flex items-center justify-center gap-2"
                  >
                    {forgotLoading ? (
                      <>
                        <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none">
                          <circle className="opacity-20" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" />
                          <path className="opacity-90" d="M12 2a10 10 0 0 1 10 10" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
                        </svg>
                        Mengirim...
                      </>
                    ) : (
                      'Kirim Instruksi Reset'
                    )}
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
