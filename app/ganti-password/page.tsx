'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

const EyeIcon = ({ open }: { open: boolean }) => (
  <svg viewBox="0 0 24 24" className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    {open ? (
      <>
        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
        <circle cx="12" cy="12" r="3" />
      </>
    ) : (
      <>
        <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94" />
        <path d="M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19" />
        <line x1="1" y1="1" x2="23" y2="23" />
      </>
    )}
  </svg>
);

export default function GantiPasswordPage() {
  const router = useRouter();

  const [form, setForm] = useState({
    passwordLama: '',
    passwordBaru: '',
    konfirmasi: '',
  });
  const [showOld, setShowOld]     = useState(false);
  const [showNew, setShowNew]     = useState(false);
  const [showConf, setShowConf]   = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError]         = useState('');

  const handleChange = (key: keyof typeof form, val: string) => {
    setForm((prev) => ({ ...prev, [key]: val }));
    setError('');
  };

  const handleSubmit = () => {
    if (!form.passwordLama || !form.passwordBaru || !form.konfirmasi) {
      setError('Semua field wajib diisi.');
      return;
    }
    if (form.passwordBaru.length < 6) {
      setError('Password baru minimal 6 karakter.');
      return;
    }
    if (form.passwordBaru !== form.konfirmasi) {
      setError('Konfirmasi password tidak cocok.');
      return;
    }
    setSubmitted(true);
  };

  return (
    <div className="flex flex-col min-h-full bg-gray-50">
      {/* Header */}
      <div
        className="px-4 pt-12 pb-6 relative overflow-hidden flex-shrink-0"
        style={{ background: 'linear-gradient(135deg, #1e3a8a 0%, #2563eb 100%)' }}
      >
        <div className="absolute -top-16 -right-16 w-40 h-40 rounded-full bg-white/5" />
        <button
          onClick={() => router.back()}
          className="absolute top-4 left-4 flex items-center gap-0.5 text-white/90 active:opacity-60 pr-1"
        >
          <svg viewBox="0 0 24 24" className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
            <path d="M15 18l-6-6 6-6" />
          </svg>
          <span className="text-base font-medium">Kembali</span>
        </button>
        <div className="flex flex-col items-center relative mt-2">
          <div className="w-16 h-16 rounded-2xl bg-white/20 flex items-center justify-center text-3xl mb-3 shadow-lg">
            🔑
          </div>
          <h1 className="text-xl font-extrabold text-white">Ganti Password</h1>
          <p className="text-blue-200 text-sm mt-1">Perbarui kata sandi Anda</p>
        </div>
      </div>

      <div className="px-4 py-5 space-y-3 flex-1">
        {submitted ? (
          /* ── Success state ── */
          <div className="bg-white rounded-2xl ios-shadow px-6 py-8 flex flex-col items-center text-center gap-3">
            <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center text-3xl">
              ✅
            </div>
            <h2 className="text-base font-bold text-gray-900">Password Berhasil Diubah</h2>
            <p className="text-sm text-gray-500">Gunakan password baru Anda saat login berikutnya.</p>
            <button
              onClick={() => router.back()}
              className="mt-2 w-full bg-[#4f6dfa] text-white text-sm font-semibold py-3 rounded-xl active:bg-[#4f6dfa]/90"
            >
              Kembali ke Profil
            </button>
          </div>
        ) : (
          /* ── Form ── */
          <>
            <div className="bg-white rounded-2xl ios-shadow overflow-hidden">
              {/* Password lama */}
              <div className="flex items-center gap-3 px-4 py-3.5 border-b border-gray-100">
                <span className="text-lg w-7 text-center flex-shrink-0">🔒</span>
                <div className="flex-1 min-w-0">
                  <p className="text-[10px] text-gray-400 font-medium mb-0.5">Password Lama</p>
                  <input
                    type={showOld ? 'text' : 'password'}
                    value={form.passwordLama}
                    onChange={(e) => handleChange('passwordLama', e.target.value)}
                    placeholder="Masukkan password lama"
                    className="w-full text-sm text-gray-900 placeholder-gray-300 outline-none bg-transparent"
                  />
                </div>
                <button onClick={() => setShowOld((v) => !v)} className="flex-shrink-0 p-1">
                  <EyeIcon open={showOld} />
                </button>
              </div>

              {/* Password baru */}
              <div className="flex items-center gap-3 px-4 py-3.5 border-b border-gray-100">
                <span className="text-lg w-7 text-center flex-shrink-0">🔓</span>
                <div className="flex-1 min-w-0">
                  <p className="text-[10px] text-gray-400 font-medium mb-0.5">Password Baru</p>
                  <input
                    type={showNew ? 'text' : 'password'}
                    value={form.passwordBaru}
                    onChange={(e) => handleChange('passwordBaru', e.target.value)}
                    placeholder="Minimal 6 karakter"
                    className="w-full text-sm text-gray-900 placeholder-gray-300 outline-none bg-transparent"
                  />
                </div>
                <button onClick={() => setShowNew((v) => !v)} className="flex-shrink-0 p-1">
                  <EyeIcon open={showNew} />
                </button>
              </div>

              {/* Konfirmasi */}
              <div className="flex items-center gap-3 px-4 py-3.5">
                <span className="text-lg w-7 text-center flex-shrink-0">✅</span>
                <div className="flex-1 min-w-0">
                  <p className="text-[10px] text-gray-400 font-medium mb-0.5">Konfirmasi Password Baru</p>
                  <input
                    type={showConf ? 'text' : 'password'}
                    value={form.konfirmasi}
                    onChange={(e) => handleChange('konfirmasi', e.target.value)}
                    placeholder="Ulangi password baru"
                    className="w-full text-sm text-gray-900 placeholder-gray-300 outline-none bg-transparent"
                  />
                </div>
                <button onClick={() => setShowConf((v) => !v)} className="flex-shrink-0 p-1">
                  <EyeIcon open={showConf} />
                </button>
              </div>
            </div>

            {/* Error */}
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-2.5">
                <p className="text-xs text-red-600 font-medium">{error}</p>
              </div>
            )}

            {/* Submit */}
            <button
              onClick={handleSubmit}
              className="w-full bg-[#4f6dfa] text-white text-sm font-semibold py-3.5 rounded-2xl active:bg-[#4f6dfa]/90 transition-colors shadow-sm"
            >
              Simpan Password Baru
            </button>
          </>
        )}
      </div>
    </div>
  );
}
