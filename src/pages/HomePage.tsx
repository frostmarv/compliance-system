import { useNavigate } from 'react-router-dom'
import hyundaiLogo from '@/assets/hyundai-ori-hitam.png'
import zinusLogo from '@/assets/zinus-tulisan-putih-contour.webp'

// ── Inline SVG Icons ─────────────────────────────────────────────────────────

const IconLogin = () => (
  <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round"
      d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
  </svg>
)

const IconClipboard = ({ size = 22 }) => (
  <svg width={size} height={size} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round"
      d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2M9 12h6M9 16h4" />
  </svg>
)

const IconLock = () => (
  <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round"
      d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
  </svg>
)

const IconArrowRight = ({ size = 17 }) => (
  <svg width={size} height={size} fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
  </svg>
)

const IconChevronRight = () => (
  <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
  </svg>
)

const IconTrophy = () => (
  <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round"
      d="M8 21h8m-4-4v4M5 3H3a2 2 0 000 4c0 3.314 2.686 6 6 6h6c3.314 0 6-2.686 6-6a2 2 0 000-4h-2M5 3h14M5 3v5" />
  </svg>
)

const IconFactory = () => (
  <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round"
      d="M3 21h18M3 7v14M9 3v18M15 7v14M21 7v14M3 7l6-4 6 4 6-4" />
  </svg>
)

const IconUsers = () => (
  <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round"
      d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
)

const IconCheck = () => (
  <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round"
      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
)

// ── Quiz categories data ─────────────────────────────────────────────────────
const QUIZ_CATEGORIES = [
  { name: 'Training 5S',            count: '10 soal', color: '#329F96' },
  { name: 'Pengelolaan Limbah B3',  count: '15 soal', color: '#0ea5e9' },
]

// ── Main Component ────────────────────────────────────────────────────────────
export default function HomePage() {
  const navigate = useNavigate()

  return (
    <div className="font-sans min-h-screen bg-[#f5fafa] text-[#1a2e2d] overflow-x-hidden">

      {/* ── Navbar ───────────────────────────────────────────────────────────── */}
      <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 md:px-10 h-16
                      bg-white/90 backdrop-blur-md border-b border-[#329F96]/10 shadow-sm">
        {/* Logos: Zinus | Hyundai */}
        <div className="flex items-center gap-4">
          <img src={zinusLogo}   alt="Zinus"   className="h-6 w-auto object-contain" />
          <div className="w-px h-6 bg-[#329F96]/25" />
          <img src={hyundaiLogo} alt="Hyundai" className="h-8 w-auto object-contain" />
        </div>

        <button
          onClick={() => navigate('/admin/login')}
          className="flex items-center gap-2 px-5 py-2 rounded-full text-[13px] font-semibold text-white
                     bg-gradient-to-r from-[#1a7a73] to-[#2ab5aa]
                     shadow-[0_4px_14px_rgba(50,159,150,0.35)]
                     hover:-translate-y-px hover:shadow-[0_6px_20px_rgba(50,159,150,0.45)]
                     active:scale-[0.97] transition-all duration-150"
        >
          <IconLogin />
          Login Admin
        </button>
      </nav>

      {/* ── Hero ─────────────────────────────────────────────────────────────── */}
      <section className="relative pt-16 min-h-screen flex items-center overflow-hidden">
        {/* Background blobs */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute inset-0"
            style={{
              background: `
                radial-gradient(ellipse 80% 60% at 70% 40%, rgba(50,159,150,0.18) 0%, transparent 60%),
                radial-gradient(ellipse 50% 50% at 10% 80%, rgba(26,122,115,0.12) 0%, transparent 55%),
                #f5fafa`
            }}
          />
          {/* Dot grid */}
          <div className="absolute inset-0 opacity-60"
            style={{
              backgroundImage: 'radial-gradient(circle, rgba(50,159,150,0.15) 1px, transparent 1px)',
              backgroundSize: '32px 32px',
              maskImage: 'radial-gradient(ellipse 60% 60% at 80% 30%, black 0%, transparent 70%)',
            }}
          />
          {/* Rings */}
          {[
            'w-[520px] h-[520px] -top-20 -right-24',
            'w-[340px] h-[340px] top-14 right-10',
            'w-[180px] h-[180px] top-40 right-44',
          ].map((cls, i) => (
            <div key={i}
              className={`absolute rounded-full border border-[#329F96]/[0.12] ${cls}`}
            />
          ))}
        </div>

        <div className="relative z-10 w-full max-w-[1100px] mx-auto px-6 md:px-10
                        py-20 grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-16 items-center">

          {/* ── Left ─────────────────────────────────────────────────────────── */}
          <div className="flex flex-col gap-7">
            {/* Tag */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full w-fit
                            bg-[#329F96]/10 border border-[#329F96]/20
                            animate-[fadeUp_0.6s_ease_both]">
              <span className="w-2 h-2 rounded-full bg-[#329F96] animate-pulse" />
              <span className="text-[11px] font-bold tracking-widest uppercase text-[#1a7a73]">
                Platform Training Internal
              </span>
            </div>

            {/* Heading */}
            <h1 className="font-serif text-[clamp(32px,4.5vw,54px)] leading-[1.1] text-[#0d2220]
                           animate-[fadeUp_0.6s_0.1s_ease_both]">
              Platform Peningkatan<br />
              <span className="italic text-[#329F96]">Kompetensi</span><br />
              Karyawan
            </h1>

            {/* Description */}
            <p className="text-[15px] leading-relaxed text-[#4a6b69] max-w-[460px]
                          animate-[fadeUp_0.6s_0.2s_ease_both]">
              Ujian evaluasi online untuk mengukur pemahaman karyawan Hyundai &amp; Zinus
              terhadap materi training — mulai dari 5S, Pengelolaan Limbah B3, hingga K3.
            </p>

            {/* Actions */}
            <div className="flex flex-wrap items-center gap-4 animate-[fadeUp_0.6s_0.3s_ease_both]">
              <button
                onClick={() => navigate('/quiz')}
                className="flex items-center gap-2.5 px-8 py-3.5 rounded-full text-[15px] font-semibold text-white
                           bg-gradient-to-br from-[#1a7a73] to-[#2ab5aa]
                           shadow-[0_8px_28px_rgba(50,159,150,0.40)]
                           hover:-translate-y-0.5 hover:shadow-[0_12px_36px_rgba(50,159,150,0.50)]
                           active:scale-[0.97] transition-all duration-150"
              >
                <IconClipboard size={17} />
                Mulai Ujian Evaluasi
              </button>
              <button
                onClick={() => navigate('/admin/login')}
                className="flex items-center gap-2 px-7 py-3.5 rounded-full text-[15px] font-semibold
                           bg-white text-[#1a7a73]
                           border border-[#329F96]/30 shadow-sm
                           hover:border-[#329F96] hover:shadow-[0_4px_18px_rgba(50,159,150,0.18)]
                           hover:-translate-y-px active:scale-[0.97] transition-all duration-150"
              >
                <IconLock />
                Admin Portal
              </button>
            </div>

            {/* Stats */}
            <div className="flex items-center gap-8 pt-2 animate-[fadeUp_0.6s_0.4s_ease_both]">
              {[
                { num: '2',   label: 'Kategori Training' },
                { num: '25+', label: 'Soal Tersedia'     },
                { num: '2',   label: 'Factory'           },
              ].map((s, i) => (
                <div key={i} className="flex items-center gap-8">
                  {i > 0 && <div className="w-px h-10 bg-[#329F96]/15" />}
                  <div className="flex flex-col gap-0.5">
                    <span className="font-serif text-[26px] leading-none text-[#0f5c57]">{s.num}</span>
                    <span className="text-[11px] font-medium text-[#7a9997]">{s.label}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* ── Right — Card Stack (hidden on mobile) ────────────────────────── */}
          <div className="hidden md:flex items-center justify-center animate-[fadeUp_0.7s_0.2s_ease_both]">
            <div className="relative w-[360px] h-[430px]">
              {/* Back cards */}
              <div className="absolute w-[300px] h-[180px] rounded-[20px] top-10 right-0
                              bg-gradient-to-br from-[#1a7a73] to-[#2ab5aa] opacity-25
                              rotate-6 translate-x-8" />
              <div className="absolute w-[300px] h-[180px] rounded-[20px] top-28 right-5
                              bg-gradient-to-br from-[#329F96] to-[#1a7a73] opacity-15
                              -rotate-[4deg] -translate-x-5" />

              {/* Main card */}
              <div className="absolute top-5 left-0 right-0 z-10 bg-white rounded-3xl p-7
                              shadow-[0_20px_60px_rgba(0,0,0,0.10),0_4px_16px_rgba(50,159,150,0.12)]">
                {/* Card header */}
                <div className="flex items-center justify-between mb-5">
                  <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-[#1a7a73] to-[#2ab5aa]
                                  flex items-center justify-center text-white">
                    <IconClipboard size={20} />
                  </div>
                  <span className="text-[11px] font-bold px-3 py-1 rounded-full bg-[#e6f7f6] text-[#1a7a73] tracking-wide">
                    AKTIF
                  </span>
                </div>

                <p className="font-serif text-[17px] text-[#0d2220] mb-1">Pilih Ujian Evaluasi</p>
                <p className="text-[12px] text-[#7a9997] mb-5">Tersedia untuk seluruh karyawan</p>

                {/* Quiz list */}
                <div className="flex flex-col gap-2.5">
                  {QUIZ_CATEGORIES.map((q) => (
                    <button
                      key={q.name}
                      onClick={() => navigate('/quiz')}
                      className="flex items-center gap-3 px-3.5 py-3 rounded-xl text-left
                                 bg-[#f5fafa] border border-[#329F96]/10
                                 hover:bg-[#e6f7f6] hover:border-[#329F96]/25 transition-colors duration-150"
                    >
                      <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: q.color }} />
                      <span className="flex-1 text-[13px] font-semibold text-[#1a2e2d]">{q.name}</span>
                      <span className="text-[11px] text-[#99bfbd]">{q.count}</span>
                      <span className="w-6 h-6 rounded-lg bg-white shadow-sm
                                       flex items-center justify-center text-[#329F96]">
                        <IconChevronRight />
                      </span>
                    </button>
                  ))}
                </div>

                {/* Progress */}
                <div className="mt-5">
                  <div className="flex justify-between text-[11px] text-[#99bfbd] mb-1.5">
                    <span>Partisipasi bulan ini</span>
                    <span>72%</span>
                  </div>
                  <div className="h-1.5 rounded-full bg-[#e6f7f6] overflow-hidden">
                    <div className="h-full rounded-full bg-gradient-to-r from-[#1a7a73] to-[#2ab5aa]
                                    animate-[growBar_1.2s_0.8s_ease_both]"
                      style={{ width: '72%' }}
                    />
                  </div>
                </div>
              </div>

              {/* Floating score card */}
              <div className="absolute bottom-0 right-0 z-20 bg-white rounded-2xl px-4 py-3.5
                              shadow-[0_8px_32px_rgba(0,0,0,0.10)]
                              flex items-center gap-3
                              animate-[float_3s_ease-in-out_infinite]">
                <div className="w-9 h-9 rounded-[10px] bg-gradient-to-br from-amber-400 to-orange-400
                                flex items-center justify-center text-white">
                  <IconTrophy />
                </div>
                <div>
                  <p className="text-[11px] text-[#99bfbd]">Rata-rata Skor</p>
                  <strong className="text-[15px] font-bold text-[#0d2220]">84.5</strong>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Quiz CTA section (mobile-friendly cards) ─────────────────────────── */}
      <section className="max-w-[1100px] mx-auto px-6 md:px-10 py-16 md:py-24">
        <p className="text-center text-[11px] font-bold tracking-[2px] uppercase text-[#329F96] mb-3">
          Ujian Evaluasi
        </p>
        <h2 className="font-serif text-[clamp(24px,3.5vw,38px)] text-center text-[#0d2220] mb-12 leading-snug">
          Pilih materi yang ingin<br className="hidden sm:block" /> kamu ujikan hari ini
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {[
            {
              name: 'Training 5S',
              desc: 'Evaluasi pemahaman konsep Sort, Set in Order, Shine, Standardize, dan Sustain di area kerja.',
              count: '10 soal',
              color: '#329F96',
              gradient: 'from-[#0f5c57] to-[#2ab5aa]',
              icon: <IconCheck />,
            },
            {
              name: 'Pengelolaan Limbah B3',
              desc: 'Uji pengetahuan tentang identifikasi, penyimpanan, dan penanganan limbah bahan berbahaya beracun.',
              count: '15 soal',
              color: '#0ea5e9',
              gradient: 'from-[#0369a1] to-[#38bdf8]',
              icon: <IconFactory />,
            },
          ].map((q) => (
            <button
              key={q.name}
              onClick={() => navigate('/quiz')}
              className="group text-left p-7 rounded-2xl bg-white border border-[#329F96]/10
                         shadow-[0_2px_16px_rgba(0,0,0,0.05)]
                         hover:-translate-y-1 hover:shadow-[0_12px_32px_rgba(50,159,150,0.14)]
                         active:scale-[0.98] transition-all duration-200"
            >
              <div className={`w-12 h-12 rounded-[14px] bg-gradient-to-br ${q.gradient}
                               flex items-center justify-center text-white mb-5`}>
                {q.icon}
              </div>
              <p className="font-serif text-[18px] text-[#0d2220] mb-2">{q.name}</p>
              <p className="text-[13.5px] text-[#6b8f8d] leading-relaxed mb-5">{q.desc}</p>
              <div className="flex items-center justify-between">
                <span className="text-[12px] font-semibold px-3 py-1 rounded-full"
                  style={{ background: `${q.color}18`, color: q.color }}>
                  {q.count}
                </span>
                <span className="flex items-center gap-1.5 text-[13px] font-semibold text-[#1a7a73]
                                 group-hover:gap-3 transition-all duration-200">
                  Mulai Ujian <IconArrowRight size={14} />
                </span>
              </div>
            </button>
          ))}
        </div>

        {/* All-quiz CTA */}
        <div className="mt-8 flex justify-center">
          <button
            onClick={() => navigate('/quiz')}
            className="flex items-center gap-3 px-8 py-4 rounded-full
                       bg-gradient-to-r from-[#1a7a73] to-[#2ab5aa] text-white
                       text-[15px] font-semibold
                       shadow-[0_8px_28px_rgba(50,159,150,0.35)]
                       hover:-translate-y-0.5 hover:shadow-[0_12px_36px_rgba(50,159,150,0.45)]
                       active:scale-[0.97] transition-all duration-150"
          >
            <IconClipboard size={18} />
            Lihat Semua Ujian
            <IconArrowRight />
          </button>
        </div>
      </section>

      {/* ── Info strip ───────────────────────────────────────────────────────── */}
      <div className="border-y border-[#329F96]/10 bg-white">
        <div className="max-w-[1100px] mx-auto px-6 md:px-10 py-6
                        grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-0 text-center">
          {[
            { icon: <IconUsers />,    label: 'Semua karyawan dapat mengikuti ujian tanpa perlu akun' },
            { icon: <IconCheck />,    label: 'Hasil langsung ditampilkan setelah ujian selesai'         },
            { icon: <IconFactory />,  label: 'Tersedia untuk Factory 1 dan Factory 2'                  },
          ].map((item, i) => (
            <div key={i} className={`flex flex-col items-center gap-2 px-6
                                     ${i < 2 ? 'sm:border-r border-[#329F96]/10' : ''}`}>
              <span className="text-[#329F96]">{item.icon}</span>
              <p className="text-[12.5px] text-[#6b8f8d] leading-relaxed">{item.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ── Footer ───────────────────────────────────────────────────────────── */}
      <footer className="border-t border-[#329F96]/10 py-8 px-6 md:px-10">
        <div className="max-w-[1100px] mx-auto flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <img src={zinusLogo}   alt="Zinus"   className="h-5 object-contain opacity-60" />
            <div className="w-px h-5 bg-[#329F96]/20" />
            <img src={hyundaiLogo} alt="Hyundai" className="h-7 object-contain opacity-60" />
          </div>
          <div className="text-right">
            <p className="text-[11px] text-[#99bfbd]">
              © {new Date().getFullYear()} Compliance — Zinus Indonesia.
            </p>
            <p className="text-[10px] text-[#b5d2d0] mt-0.5">
              Developed by Nurmalik Wijaya
            </p>
          </div>
        </div>
      </footer>

      {/* ── Global keyframes ─────────────────────────────────────────────────── */}
      <style>{`
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(20px); }
          to   { opacity: 1; transform: none; }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50%       { transform: translateY(-8px); }
        }
        @keyframes growBar {
          from { width: 0; }
          to   { width: 72%; }
        }
        @import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=DM+Sans:wght@300;400;500;600&display=swap');
        .font-serif { font-family: 'DM Serif Display', serif; }
        .font-sans  { font-family: 'DM Sans', sans-serif; }
      `}</style>
    </div>
  )
}