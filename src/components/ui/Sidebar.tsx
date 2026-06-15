import { useState } from 'react'
import { NavLink, useLocation, useNavigate } from 'react-router-dom'
import zinusLogo from '@/assets/zinus-tulisan-putih.webp'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/hooks/useAuth'

// ── Icons ────────────────────────────────────────────────────────────────────
function IconDashboard() {
  return (
    <svg className="w-[18px] h-[18px]" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
      <rect x="3" y="3" width="7" height="7" rx="1.5" />
      <rect x="14" y="3" width="7" height="7" rx="1.5" />
      <rect x="3" y="14" width="7" height="7" rx="1.5" />
      <rect x="14" y="14" width="7" height="7" rx="1.5" />
    </svg>
  )
}

function IconQuiz() {
  return (
    <svg className="w-[18px] h-[18px]" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2" />
      <rect x="9" y="3" width="6" height="4" rx="1" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6M9 16h4" />
    </svg>
  )
}

function IconSoal() {
  return (
    <svg className="w-[15px] h-[15px]" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M17.586 3.586a2 2 0 112.828 2.828L12 15l-4 1 1-4 8.586-8.414z" />
    </svg>
  )
}

function IconHasil() {
  return (
    <svg className="w-[15px] h-[15px]" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
    </svg>
  )
}

function IconUser() {
  return (
    <svg className="w-[18px] h-[18px]" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75" />
    </svg>
  )
}

function IconChevron({ open }: { open: boolean }) {
  return (
    <svg
      className={`w-3.5 h-3.5 transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      viewBox="0 0 24 24"
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
    </svg>
  )
}

function IconLogout() {
  return (
    <svg className="w-[16px] h-[16px]" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
    </svg>
  )
}

// ── Role badge ────────────────────────────────────────────────────────────────
function RoleBadge({ role }: { role: string }) {
  const normalized = role.toLowerCase()
  const isPemilik = normalized === 'pemilik'
  return (
    <span
      className="inline-flex items-center px-1.5 py-0.5 rounded text-[9px] font-bold uppercase tracking-wide"
      style={isPemilik
        ? { background: 'rgba(251,191,36,0.2)', color: '#fbbf24' }
        : { background: 'rgba(255,255,255,0.15)', color: 'rgba(255,255,255,0.7)' }
      }
    >
      {isPemilik ? '★ ' : ''}{role}
    </span>
  )
}

// ── Sidebar ──────────────────────────────────────────────────────────────────
export default function Sidebar() {
  const location  = useLocation()
  const navigate  = useNavigate()
  const { staff } = useAuth()

  const [quizOpen, setQuizOpen] = useState(
    location.pathname.startsWith('/admin/quiz') || location.pathname.startsWith('/admin/hasil')
  )

  const handleLogout = async () => {
    await supabase.auth.signOut()
    navigate('/admin/login')
  }

  const isActive = (path: string) => location.pathname === path
  const isQuizSection =
    location.pathname.startsWith('/admin/quiz') ||
    location.pathname.startsWith('/admin/hasil')

  const navBase   = 'flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 group'
  const navActive = 'bg-white/15 text-white shadow-inner'
  const navIdle   = 'text-white/60 hover:text-white hover:bg-white/10'
  const subBase   = 'flex items-center gap-2.5 pl-10 pr-4 py-2 rounded-xl text-[13px] font-medium transition-all duration-150'
  const subActive = 'bg-white/15 text-white'
  const subIdle   = 'text-white/55 hover:text-white hover:bg-white/10'

  // Derived display values
  const displayName = staff?.nama ?? '...'
  const initial     = displayName !== '...' ? displayName.charAt(0).toUpperCase() : '?'
  const factoryLabel = staff?.factory === 1
    ? 'Zinus Global'
    : staff?.factory === 2
    ? 'Zinus Dream'
    : null

  return (
    <aside
      className="flex flex-col h-screen w-60 shrink-0 select-none"
      style={{ background: 'linear-gradient(180deg, #1a7a73 0%, #329F96 55%, #2ab5aa 100%)' }}
    >
      {/* ── Logo ── */}
      <div className="px-5 pt-7 pb-5 flex justify-center">
        <img src={zinusLogo} alt="Zinus" className="h-12 w-auto object-contain" />
      </div>
      <div className="px-5 pb-4">
        <div className="h-px bg-white/15 rounded-full" />
      </div>

      {/* ── Navigation ── */}
      <nav className="flex-1 px-3 space-y-0.5 overflow-y-auto">

        <NavLink
          to="/admin/dashboard"
          className={`${navBase} ${isActive('/admin/dashboard') ? navActive : navIdle}`}
        >
          <IconDashboard />
          <span>Dashboard</span>
          {isActive('/admin/dashboard') && (
            <span className="ml-auto w-1.5 h-1.5 rounded-full bg-white/70" />
          )}
        </NavLink>

        <div>
          <button
            onClick={() => setQuizOpen((v) => !v)}
            className={`w-full ${navBase} ${isQuizSection && !quizOpen ? navActive : navIdle} ${quizOpen ? 'text-white' : ''}`}
          >
            <IconQuiz />
            <span>Quiz</span>
            <span className="ml-auto"><IconChevron open={quizOpen} /></span>
          </button>

          <div className={`overflow-hidden transition-all duration-200 ${quizOpen ? 'max-h-32 opacity-100 mt-0.5' : 'max-h-0 opacity-0'}`}>
            <div className="space-y-0.5 py-1">
              <NavLink
                to="/admin/quiz/soal"
                className={`${subBase} ${isActive('/admin/quiz/soal') ? subActive : subIdle}`}
              >
                <IconSoal /><span>Soal</span>
              </NavLink>
              <NavLink
                to="/admin/quiz/hasil"
                className={`${subBase} ${isActive('/admin/quiz/hasil') ? subActive : subIdle}`}
              >
                <IconHasil /><span>Hasil Ujian</span>
              </NavLink>
            </div>
          </div>
        </div>

        <NavLink
          to="/admin/users"
          className={`${navBase} ${isActive('/admin/users') ? navActive : navIdle}`}
        >
          <IconUser />
          <span>User</span>
          {isActive('/admin/users') && (
            <span className="ml-auto w-1.5 h-1.5 rounded-full bg-white/70" />
          )}
        </NavLink>

      </nav>

      {/* ── Footer: Profile + Logout ── */}
      <div className="px-4 py-4 space-y-2">
        <div className="h-px bg-white/15 rounded-full mb-3" />

        {/* Profile card */}
        <div className="flex items-center gap-3 px-3 py-2.5 rounded-xl bg-white/10">
          {/* Avatar */}
          <div
            className="w-8 h-8 rounded-full flex items-center justify-center shrink-0 text-sm font-bold"
            style={{ background: 'rgba(255,255,255,0.25)', color: 'white' }}
          >
            {initial}
          </div>

          {/* Info */}
          <div className="flex-1 min-w-0 space-y-0.5">
            <p className="text-white text-xs font-semibold truncate leading-tight">{displayName}</p>
            <div className="flex items-center gap-1.5 flex-wrap">
              {staff?.role && <RoleBadge role={staff.role} />}
              {factoryLabel && (
                <span className="text-[9px] text-white/50 font-medium truncate">{factoryLabel}</span>
              )}
            </div>
          </div>
        </div>

        {/* Logout */}
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium
                     text-white/60 hover:text-white hover:bg-red-500/20 transition-all duration-150"
        >
          <IconLogout />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  )
}