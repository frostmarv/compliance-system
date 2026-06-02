import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../../lib/supabase'
import hyundaiLogo from '@/assets/hyundai-ori-hitam.png'
import zinusLogo from '@/assets/zinus-tulisan-putih.webp'

// ── Divider dot ──────────────────────────────────────────────────────────────
function Divider() {
  return (
    <div className="flex items-center gap-3 my-1">
      <div className="h-px flex-1 bg-white/30" />
      <div className="w-1.5 h-1.5 rounded-full bg-white/40" />
      <div className="h-px flex-1 bg-white/30" />
    </div>
  )
}

// ── Main page ────────────────────────────────────────────────────────────────
export default function LoginPage() {
  const [email, setEmail]       = useState('')
  const [password, setPassword] = useState('')
  const [error, setError]       = useState('')
  const [loading, setLoading]   = useState(false)
  const navigate = useNavigate()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    const { data, error: authError } = await supabase.auth.signInWithPassword({ email, password })

    if (authError) {
      setError('Email atau password salah!')
      setLoading(false)
      return
    }

    const { data: staff } = await supabase
      .from('staff')
      .select('role')
      .eq('id', data.user.id)
      .single()

    if (!staff) {
      await supabase.auth.signOut()
      setError('Akun tidak terdaftar sebagai admin. Hubungi IT.')
    } else {
      navigate('/admin/dashboard')
    }
    setLoading(false)
  }

  return (
    <div
      className="min-h-screen flex items-center justify-center p-4"
      style={{ background: 'linear-gradient(135deg, #1a7a73 0%, #329F96 45%, #2ab5aa 100%)' }}
    >
      {/* Subtle background pattern */}
      <div
        className="absolute inset-0 opacity-5 pointer-events-none"
        style={{
          backgroundImage: `repeating-linear-gradient(
            45deg,
            transparent,
            transparent 40px,
            rgba(255,255,255,0.6) 40px,
            rgba(255,255,255,0.6) 41px
          )`,
        }}
      />

      <div className="relative w-full max-w-sm">
        {/* ── Brand header card ─────────────────────────────────────── */}
        <div
          className="rounded-t-2xl px-8 pt-8 pb-6 text-center"
          style={{ background: 'rgba(255,255,255,0.12)', backdropFilter: 'blur(12px)' }}
        >
          {/* Logos row */}
          <div className="flex items-center justify-center gap-6 mb-3">
            {/* Hyundai */}
            <div className="flex items-center">
              <img
                src={hyundaiLogo}
                alt="Hyundai"
                className="h-12 w-auto object-contain"
              />
            </div>

            {/* Separator */}
            <div className="h-14 w-px bg-white/30" />

            {/* Zinus */}
            <div className="flex items-center">
              <img
                src={zinusLogo}
                alt="Zinus"
                className="h-10 w-auto object-contain"
              />
            </div>
          </div>

          <Divider />

          <p className="text-white/70 text-xs tracking-widest uppercase mt-2 font-medium">
            Admin Portal
          </p>
        </div>

        {/* ── Login card ────────────────────────────────────────────── */}
        <div
          className="rounded-b-2xl px-8 pt-6 pb-8"
          style={{ background: 'rgba(255,255,255,0.95)', backdropFilter: 'blur(8px)' }}
        >
          <h2
            className="text-lg font-bold mb-1 text-center"
            style={{ color: '#329F96' }}
          >
            Selamat Datang
          </h2>
          <p className="text-gray-400 text-xs text-center mb-5">
            Masuk menggunakan akun admin Anda
          </p>

          {/* Error message */}
          {error && (
            <div
              className="flex items-center gap-2 text-sm mb-4 px-3 py-2.5 rounded-lg"
              style={{ background: '#fff0f0', color: '#c0392b', border: '1px solid #fecaca' }}
            >
              <svg className="w-4 h-4 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            {/* Email */}
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                </svg>
              </span>
              <input
                type="email"
                placeholder="Email Admin"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm
                           focus:outline-none focus:ring-2 transition"
                style={{ '--tw-ring-color': '#329F96' } as React.CSSProperties}
                required
              />
            </div>

            {/* Password */}
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </span>
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm
                           focus:outline-none focus:ring-2 transition"
                style={{ '--tw-ring-color': '#329F96' } as React.CSSProperties}
                required
              />
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 rounded-xl text-white font-semibold text-sm tracking-wide
                         transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed
                         active:scale-95 flex items-center justify-center gap-2"
              style={{ background: loading ? '#88ceca' : 'linear-gradient(135deg, #329F96, #2ab5aa)' }}
            >
              {loading ? (
                <>
                  <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 00-8 8h4z" />
                  </svg>
                  Memproses…
                </>
              ) : (
                <>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                  </svg>
                  Masuk
                </>
              )}
            </button>
          </form>

          <p className="text-center text-gray-300 text-xs mt-5">
            Masalah akses? Hubungi tim IT
          </p>
        </div>

        {/* ── Bottom label ──────────────────────────────────────────── */}
        <p className="text-white/40 text-xs text-center mt-4 tracking-wide">
          © {new Date().getFullYear()} Zinus Compliance . Internal Use Only
        </p>
      </div>
    </div>
  )
}