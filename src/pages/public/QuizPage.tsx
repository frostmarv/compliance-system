import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import hyundaiLogo from '@/assets/hyundai-ori-hitam.png'
import zinusLogo from '@/assets/zinus-tulisan-putih-contour.webp'

// SVG icon components
const ShieldIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 2L3 6.5V11C3 15.55 6.96 19.79 12 21C17.04 19.79 21 15.55 21 11V6.5L12 2Z" fill="#1a7a73" fillOpacity="0.15" stroke="#1a7a73" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M9 12L11 14L15 10" stroke="#1a7a73" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
)

const ClipboardIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="8" y="2" width="8" height="4" rx="1.5" fill="#1a7a73" fillOpacity="0.15" stroke="#1a7a73" strokeWidth="1.6"/>
    <path d="M16 3H18C19.1 3 20 3.9 20 5V20C20 21.1 19.1 22 18 22H6C4.9 22 4 21.1 4 20V5C4 3.9 4.9 3 6 3H8" stroke="#1a7a73" strokeWidth="1.6" strokeLinecap="round"/>
    <path d="M9 12H15M9 16H13" stroke="#1a7a73" strokeWidth="1.6" strokeLinecap="round"/>
  </svg>
)

const BuildingIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="3" y="7" width="18" height="14" rx="1.5" fill="#9ca3af" fillOpacity="0.12" stroke="#9ca3af" strokeWidth="1.6"/>
    <path d="M8 22V7M16 22V7" stroke="#9ca3af" strokeWidth="1.4" strokeLinecap="round"/>
    <rect x="9" y="11" width="2.5" height="2.5" rx="0.5" fill="#9ca3af"/>
    <rect x="12.5" y="11" width="2.5" height="2.5" rx="0.5" fill="#9ca3af"/>
    <rect x="9" y="15" width="2.5" height="2.5" rx="0.5" fill="#9ca3af"/>
    <rect x="12.5" y="15" width="2.5" height="2.5" rx="0.5" fill="#9ca3af"/>
    <path d="M8 7V4C8 3.45 8.45 3 9 3H15C15.55 3 16 3.45 16 4V7" stroke="#9ca3af" strokeWidth="1.6" strokeLinecap="round"/>
  </svg>
)

const ScrollIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M6 3H18C18.55 3 19 3.45 19 4V20C19 20.55 18.55 21 18 21H6C5.45 21 5 20.55 5 20V4C5 3.45 5.45 3 6 3Z" fill="#9ca3af" fillOpacity="0.12" stroke="#9ca3af" strokeWidth="1.6"/>
    <path d="M9 8H15M9 12H15M9 16H12" stroke="#9ca3af" strokeWidth="1.6" strokeLinecap="round"/>
  </svg>
)

const LeafIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 21C12 21 4 16 4 9.5C4 6.5 6.5 4 9.5 4C10.8 4 12 4.5 13 5.3C14 4.5 15.2 4 16.5 4C19.5 4 22 6.5 22 9.5C22 16 12 21 12 21Z" fill="#9ca3af" fillOpacity="0.12" stroke="#9ca3af" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M12 21V12M12 12C12 12 9 10 7 8" stroke="#9ca3af" strokeWidth="1.6" strokeLinecap="round"/>
  </svg>
)

const ChevronRight = () => (
  <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
  </svg>
)

const ClockIcon = () => (
  <svg width="28" height="28" fill="none" stroke="#d97706" strokeWidth="1.6" viewBox="0 0 24 24">
    <circle cx="12" cy="12" r="9" strokeOpacity="0.25" fill="#fef3c7"/>
    <circle cx="12" cy="12" r="9"/>
    <path strokeLinecap="round" d="M12 7v5l3 3"/>
  </svg>
)

const quizzes = [
  {
    name: 'C-TPAT',
    sub: 'Customs-Trade Partnership Against Terrorism',
    icon: <ShieldIcon />,
    path: '/quiz/ctpat',
    active: true,
  },
  {
    name: '5R / 5S',
    sub: 'Ringkas, Rapi, Resik, Rawat, Rajin',
    icon: <ClipboardIcon />,
    path: '/quiz/5r',
    active: true,
  },
  {
    name: 'Company Profile',
    sub: 'Pengenalan perusahaan & struktur organisasi',
    icon: <BuildingIcon />,
    path: null,
    active: false,
  },
  {
    name: 'Code of Conduct',
    sub: 'Etika & tata perilaku karyawan',
    icon: <ScrollIcon />,
    path: null,
    active: false,
  },
  {
    name: 'Kesadaran Lingkungan',
    sub: 'Pengelolaan limbah & lingkungan hidup',
    icon: <LeafIcon />,
    path: null,
    active: false,
  },
]

export default function QuizNavPage() {
  const navigate = useNavigate()
  const [modal, setModal] = useState<string | null>(null)

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500;9..40,600&display=swap');
        .font-display { font-family: 'DM Serif Display', serif; }
        .font-sans-dm { font-family: 'DM Sans', sans-serif; }
      `}</style>

      <div className="font-sans-dm min-h-screen bg-[#f5fafa] text-[#1a2e2d] flex flex-col">

        {/* Navbar */}
        <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-10 h-[68px] bg-white/85 backdrop-blur-xl border-b border-[#329F96]/10 shadow-[0_2px_20px_rgba(0,0,0,0.05)] max-sm:px-4">
          <div className="flex items-center gap-5">
            <img src={zinusLogo} alt="Zinus" className="h-7 object-contain" />
            <div className="w-px h-7 bg-[#329F96]/25" />
            <img src={hyundaiLogo} alt="Hyundai" className="h-9 object-contain" />
          </div>
          {/* Back button removed */}
        </nav>

        {/* Content */}
        <main className="flex-1 w-full max-w-[560px] mx-auto px-5 pt-[108px] pb-12">
          <p className="text-[11px] font-bold tracking-[2.5px] uppercase text-[#329F96] mb-1.5">
            Quiz Training
          </p>
          <h1 className="font-display text-[clamp(24px,4vw,32px)] text-[#0d2220] leading-tight mb-1.5">
            Pilih Kategori Ujian
          </h1>
          <p className="text-[13.5px] text-[#7a9997] mb-7">
            Tersedia untuk seluruh karyawan Zinus Indonesia
          </p>

          <div className="flex flex-col gap-2.5">
            {quizzes.map(q => (
              <button
                key={q.name}
                onClick={() => q.active ? navigate(q.path!) : setModal(q.name)}
                className={[
                  'flex items-center gap-3.5 bg-white border rounded-2xl px-4 py-3.5 text-left w-full transition-all duration-150',
                  q.active
                    ? 'border-[#329F96]/15 hover:border-[#329F96]/35 hover:shadow-[0_4px_18px_rgba(50,159,150,0.10)] hover:-translate-y-px active:scale-[0.99]'
                    : 'border-gray-100 opacity-70 cursor-pointer hover:opacity-90',
                ].join(' ')}
              >
                {/* Icon container */}
                <span className={[
                  'w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0',
                  q.active ? 'bg-[#1a7a73]/8' : 'bg-gray-50',
                ].join(' ')}>
                  {q.icon}
                </span>

                <div className="flex-1 min-w-0">
                  <p className="m-0 font-semibold text-[13.5px] text-[#0d2220] mb-0.5">{q.name}</p>
                  <p className="m-0 text-[11.5px] text-[#7a9997] truncate max-sm:whitespace-normal">{q.sub}</p>
                </div>

                <span className={[
                  'text-[11px] font-semibold px-2.5 py-1 rounded-full flex-shrink-0',
                  q.active
                    ? 'bg-[#329F96]/10 text-[#1a7a73]'
                    : 'bg-gray-100 text-gray-400',
                ].join(' ')}>
                  {q.active ? 'Tersedia' : 'Segera'}
                </span>

                <span className="text-[#c5d8d7] flex-shrink-0">
                  <ChevronRight />
                </span>
              </button>
            ))}
          </div>
        </main>

        {/* Footer */}
        <footer className="border-t border-[#329F96]/10 px-10 py-7 max-sm:px-5">
          <div className="max-w-[1100px] mx-auto flex items-center justify-between flex-wrap gap-3 max-sm:flex-col max-sm:items-start">
            <div className="flex items-center gap-4">
              <img src={zinusLogo} alt="Zinus" className="h-[22px] object-contain opacity-50" />
              <div className="w-px h-5 bg-[#329F96]/20" />
              <img src={hyundaiLogo} alt="Hyundai" className="h-[22px] object-contain opacity-50" />
            </div>
            <div className="text-right max-sm:text-left">
              <p className="text-[12px] text-[#99bfbd] m-0">© {new Date().getFullYear()} Compliance - Zinus Indonesia.</p>
              <span className="text-[11px] text-[#b5d2d0]">Developed by Nurmalik Wijaya</span>
            </div>
          </div>
        </footer>

      </div>

      {/* Modal */}
      {modal && (
        <div
          className="fixed inset-0 bg-black/35 flex items-center justify-center z-[999]"
          onClick={() => setModal(null)}
        >
          <div
            className="bg-white rounded-[20px] px-6 pt-7 pb-5 max-w-[320px] w-[90%] text-center"
            onClick={e => e.stopPropagation()}
          >
            <div className="w-14 h-14 rounded-full bg-amber-50 flex items-center justify-center mx-auto mb-4">
              <ClockIcon />
            </div>
            <p className="font-semibold text-[16px] text-[#0d2220] mb-2 m-0">{modal} — belum tersedia</p>
            <p className="text-[13px] text-[#7a9997] mb-5 leading-relaxed m-0">
              Soal untuk training {modal} belum tersedia. Silakan coba lagi nanti atau hubungi tim Compliance.
            </p>
            <button
              onClick={() => setModal(null)}
              className="font-sans-dm w-full py-2.5 rounded-xl border border-gray-200 bg-transparent text-[14px] text-[#1a2e2d] hover:bg-[#f5fafa] transition-colors cursor-pointer"
            >
              Tutup
            </button>
          </div>
        </div>
      )}
    </>
  )
}