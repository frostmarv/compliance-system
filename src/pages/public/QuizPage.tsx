import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { DotLottieReact } from '@lottiefiles/dotlottie-react'
import hyundaiLogo from '@/assets/hyundai-ori-hitam.png'
import zinusLogo from '@/assets/zinus-tulisan-putih-contour.webp'
import quizIconAnimation from '@/assets/animations/QuizIcon.lottie'

// ─── Icon Components ──────────────────────────────────────────────────────────

const ShieldIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
    <path d="M12 2L3 6.5V11C3 15.55 6.96 19.79 12 21C17.04 19.79 21 15.55 21 11V6.5L12 2Z" fill="#1a7a73" fillOpacity="0.15" stroke="#1a7a73" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M9 12L11 14L15 10" stroke="#1a7a73" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
)

const ClipboardIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
    <rect x="8" y="2" width="8" height="4" rx="1.5" fill="#1a7a73" fillOpacity="0.15" stroke="#1a7a73" strokeWidth="1.6"/>
    <path d="M16 3H18C19.1 3 20 3.9 20 5V20C20 21.1 19.1 22 18 22H6C4.9 22 4 21.1 4 20V5C4 3.9 4.9 3 6 3H8" stroke="#1a7a73" strokeWidth="1.6" strokeLinecap="round"/>
    <path d="M9 12H15M9 16H13" stroke="#1a7a73" strokeWidth="1.6" strokeLinecap="round"/>
  </svg>
)

const BuildingIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
    <rect x="3" y="7" width="18" height="14" rx="1.5" fill="#1a7a73" fillOpacity="0.12" stroke="#1a7a73" strokeWidth="1.6"/>
    <path d="M8 22V7M16 22V7" stroke="#1a7a73" strokeWidth="1.4" strokeLinecap="round"/>
    <rect x="9" y="11" width="2.5" height="2.5" rx="0.5" fill="#1a7a73"/>
    <rect x="12.5" y="11" width="2.5" height="2.5" rx="0.5" fill="#1a7a73"/>
    <rect x="9" y="15" width="2.5" height="2.5" rx="0.5" fill="#1a7a73"/>
    <rect x="12.5" y="15" width="2.5" height="2.5" rx="0.5" fill="#1a7a73"/>
    <path d="M8 7V4C8 3.45 8.45 3 9 3H15C15.55 3 16 3.45 16 4V7" stroke="#1a7a73" strokeWidth="1.6" strokeLinecap="round"/>
  </svg>
)

const ScrollIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
    <path d="M6 3H18C18.55 3 19 3.45 19 4V20C19 20.55 18.55 21 18 21H6C5.45 21 5 20.55 5 20V4C5 3.45 5.45 3 6 3Z" fill="#9ca3af" fillOpacity="0.12" stroke="#9ca3af" strokeWidth="1.6"/>
    <path d="M9 8H15M9 12H15M9 16H12" stroke="#9ca3af" strokeWidth="1.6" strokeLinecap="round"/>
  </svg>
)

const LeafIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
    <path d="M12 21C12 21 4 16 4 9.5C4 6.5 6.5 4 9.5 4C10.8 4 12 4.5 13 5.3C14 4.5 15.2 4 16.5 4C19.5 4 22 6.5 22 9.5C22 16 12 21 12 21Z" fill="#9ca3af" fillOpacity="0.12" stroke="#9ca3af" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M12 21V12M12 12C12 12 9 10 7 8" stroke="#9ca3af" strokeWidth="1.6" strokeLinecap="round"/>
  </svg>
)

const RecycleIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
    <circle cx="12" cy="12" r="10.5" fill="#1a7a73" fillOpacity="0.08"/>
    <g stroke="#1a7a73" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" fill="none">
      <path d="M7 19H4.815a1.83 1.83 0 0 1-1.57-.881 1.785 1.785 0 0 1-.004-1.784L7.196 9.5"/>
      <path d="M11 19h8.203a1.83 1.83 0 0 0 1.556-.89 1.784 1.784 0 0 0 0-1.775l-1.226-2.12"/>
      <path d="m14 16-3 3 3 3"/>
      <path d="M8.293 13.596 7.196 9.5 3.1 10.598"/>
      <path d="m9.344 5.811 1.093-1.892A1.83 1.83 0 0 1 12.203 3a1.784 1.784 0 0 1 1.545.888l3.943 6.843"/>
      <path d="m13.378 9.633 4.096 1.098 1.097-4.096"/>
    </g>
  </svg>
)

const HeartShieldIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
    <path d="M12 21C12 21 3 15 3 9C3 6.24 5.24 4 8 4C9.6 4 11 4.8 12 6C13 4.8 14.4 4 16 4C18.76 4 21 6.24 21 9C21 15 12 21 12 21Z" fill="#be185d" fillOpacity="0.12" stroke="#be185d" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M12 8v4M10 10h4" stroke="#be185d" strokeWidth="1.8" strokeLinecap="round"/>
  </svg>
)

const ChevronRight = () => (
  <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
  </svg>
)

const ChevronDown = ({ open }: { open: boolean }) => (
  <svg
    width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"
    style={{ transition: 'transform 0.22s ease', transform: open ? 'rotate(180deg)' : 'rotate(0deg)' }}
  >
    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
  </svg>
)

const FolderComplianceIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
    <path d="M3 7C3 5.9 3.9 5 5 5H10L12 7H19C20.1 7 21 7.9 21 9V18C21 19.1 20.1 20 19 20H5C3.9 20 3 19.1 3 18V7Z" fill="#1a7a73" fillOpacity="0.15" stroke="#1a7a73" strokeWidth="1.5" strokeLinejoin="round"/>
  </svg>
)

const FolderHRIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
    <path d="M3 7C3 5.9 3.9 5 5 5H10L12 7H19C20.1 7 21 7.9 21 9V18C21 19.1 20.1 20 19 20H5C3.9 20 3 19.1 3 18V7Z" fill="#be185d" fillOpacity="0.15" stroke="#be185d" strokeWidth="1.5" strokeLinejoin="round"/>
  </svg>
)

const ClockIcon = () => (
  <svg width="28" height="28" fill="none" stroke="#d97706" strokeWidth="1.6" viewBox="0 0 24 24">
    <circle cx="12" cy="12" r="9" strokeOpacity="0.25" fill="#fef3c7"/>
    <circle cx="12" cy="12" r="9"/>
    <path strokeLinecap="round" d="M12 7v5l3 3"/>
  </svg>
)

// ─── Data ─────────────────────────────────────────────────────────────────────

type QuizItem = {
  name: string
  sub: string
  icon: React.ReactNode
  path: string | null
  active: boolean
  training_type: string
}

const quizzes: QuizItem[] = [
  {
    training_type: 'COMPLIANCE',
    name: 'C-TPAT',
    sub: 'Customs-Trade Partnership Against Terrorism',
    icon: <ShieldIcon />,
    path: '/quiz/ctpat',
    active: true,
  },
  {
    training_type: 'COMPLIANCE',
    name: '5R / 5S',
    sub: 'Ringkas, Rapi, Resik, Rawat, Rajin',
    icon: <ClipboardIcon />,
    path: '/quiz/5r',
    active: true,
  },
  {
    training_type: 'COMPLIANCE',
    name: 'Company Profile',
    sub: 'Pengenalan perusahaan & struktur organisasi',
    icon: <BuildingIcon />,
    path: '/quiz/company',
    active: true,
  },
  {
    training_type: 'COMPLIANCE',
    name: 'Code of Conduct',
    sub: 'Etika & tata perilaku karyawan',
    icon: <ScrollIcon />,
    path: null,
    active: false,
  },
  {
    training_type: 'COMPLIANCE',
    name: 'Kesadaran Lingkungan',
    sub: 'Pengelolaan limbah & lingkungan hidup',
    icon: <LeafIcon />,
    path: '/quiz/lingkungan',
    active: true,
  },
  {
    training_type: 'COMPLIANCE',
    name: 'Limbah B3',
    sub: 'Pengelolaan limbah bahan berbahaya & beracun',
    icon: <RecycleIcon />,
    path: '/quiz/limbah',
    active: true,
  },
  {
    training_type: 'HR',
    name: 'Sexual Harassment',
    sub: 'Pencegahan & penanganan pelecehan di tempat kerja',
    icon: <HeartShieldIcon />,
    path: '/quiz-hr/sexual-harassment',
    active: true,
  },
]

// ─── Sub-components ───────────────────────────────────────────────────────────

type FolderSectionProps = {
  label: string
  accentColor: string        // e.g. '#1a7a73'
  accentBg: string           // e.g. 'rgba(26,122,115,0.08)'
  folderIcon: React.ReactNode
  items: QuizItem[]
  defaultOpen?: boolean
  onComingSoon: (name: string) => void
}

function FolderSection({
  label, accentColor, accentBg, folderIcon, items, defaultOpen = false, onComingSoon,
}: FolderSectionProps) {
  const [open, setOpen] = useState(defaultOpen)
  const navigate = useNavigate()

  const activeCount = items.filter(i => i.active).length

  return (
    <div
      style={{
        border: `1.5px solid ${open ? accentColor + '28' : '#e5e7eb'}`,
        borderRadius: '18px',
        background: '#fff',
        overflow: 'hidden',
        transition: 'border-color 0.2s',
        boxShadow: open ? `0 4px 24px ${accentColor}12` : '0 1px 4px rgba(0,0,0,0.04)',
      }}
    >
      {/* Folder header */}
      <button
        onClick={() => setOpen(v => !v)}
        style={{
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          padding: '14px 16px',
          background: 'transparent',
          border: 'none',
          cursor: 'pointer',
          textAlign: 'left',
        }}
      >
        <span
          style={{
            width: 36, height: 36, borderRadius: 10,
            background: accentBg,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            flexShrink: 0,
          }}
        >
          {folderIcon}
        </span>

        <div style={{ flex: 1 }}>
          <p style={{ margin: 0, fontWeight: 700, fontSize: 13.5, color: '#0d2220', lineHeight: 1.3 }}>
            {label}
          </p>
          <p style={{ margin: 0, fontSize: 11.5, color: '#9db5b3', marginTop: 1 }}>
            {activeCount} dari {items.length} quiz tersedia
          </p>
        </div>

        <span style={{ color: accentColor, opacity: 0.7 }}>
          <ChevronDown open={open} />
        </span>
      </button>

      {/* Divider line when open */}
      {open && (
        <div style={{ height: 1, background: `${accentColor}14`, marginLeft: 16, marginRight: 16 }} />
      )}

      {/* Quiz list - animated expand */}
      <div
        style={{
          maxHeight: open ? `${items.length * 80}px` : '0px',
          overflow: 'hidden',
          transition: 'max-height 0.3s cubic-bezier(0.4,0,0.2,1)',
        }}
      >
        <div style={{ padding: '8px 10px 10px' }}>
          {items.map((q, idx) => (
            <button
              key={q.name}
              onClick={() => q.active ? navigate(q.path!) : onComingSoon(q.name)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 12,
                background: 'transparent',
                border: 'none',
                borderRadius: 14,
                padding: '10px 8px',
                width: '100%',
                cursor: 'pointer',
                textAlign: 'left',
                transition: 'background 0.12s',
                marginBottom: idx < items.length - 1 ? 2 : 0,
              }}
              onMouseEnter={e => {
                (e.currentTarget as HTMLButtonElement).style.background = q.active ? accentBg : '#f9fafb'
              }}
              onMouseLeave={e => {
                (e.currentTarget as HTMLButtonElement).style.background = 'transparent'
              }}
            >
              {/* Icon */}
              <span
                style={{
                  width: 38, height: 38, borderRadius: 11,
                  background: q.active ? accentBg : '#f3f4f6',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  flexShrink: 0,
                  opacity: q.active ? 1 : 0.65,
                }}
              >
                {q.icon}
              </span>

              <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{ margin: 0, fontWeight: 600, fontSize: 13, color: q.active ? '#0d2220' : '#9ca3af', lineHeight: 1.3 }}>
                  {q.name}
                </p>
                <p style={{ margin: 0, fontSize: 11, color: '#aac4c2', marginTop: 1, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {q.sub}
                </p>
              </div>

              {/* Badge */}
              <span
                style={{
                  fontSize: 10.5,
                  fontWeight: 600,
                  padding: '3px 9px',
                  borderRadius: 99,
                  flexShrink: 0,
                  background: q.active ? accentBg : '#f3f4f6',
                  color: q.active ? accentColor : '#9ca3af',
                }}
              >
                {q.active ? 'Tersedia' : 'Segera'}
              </span>

              <span style={{ color: q.active ? accentColor : '#d1d5db', flexShrink: 0, opacity: 0.7 }}>
                <ChevronRight />
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function QuizNavPage() {
  const [modal, setModal] = useState<string | null>(null)

  const complianceItems = quizzes.filter(q => q.training_type === 'COMPLIANCE')
  const hrItems = quizzes.filter(q => q.training_type === 'HR')

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
        </nav>

        {/* Content */}
        <main className="flex-1 w-full max-w-[560px] mx-auto px-5 pt-[108px] pb-12">
          <p className="text-[11px] font-bold tracking-[2.5px] uppercase text-[#329F96] mb-1.5">
            Quiz Training
          </p>
          <div className="flex items-center gap-2 mb-1.5">
            <h1 className="font-display text-[clamp(24px,4vw,32px)] text-[#0d2220] leading-tight">
              Pilih Kategori Ujian
            </h1>
            <div style={{ width: 72, height: 72, flexShrink: 0, marginTop: -4 }}>
              <DotLottieReact
                src={quizIconAnimation}
                autoplay
                loop
                style={{ width: '100%', height: '100%' }}
              />
            </div>
          </div>
          <p className="text-[13.5px] text-[#7a9997] mb-7">
            Tersedia untuk seluruh karyawan Zinus Indonesia
          </p>

          <div className="flex flex-col gap-3">
            <FolderSection
              label="Compliance"
              accentColor="#1a7a73"
              accentBg="rgba(26,122,115,0.08)"
              folderIcon={<FolderComplianceIcon />}
              items={complianceItems}
              defaultOpen={true}
              onComingSoon={setModal}
            />

            <FolderSection
              label="Human Resources"
              accentColor="#be185d"
              accentBg="rgba(190,24,93,0.08)"
              folderIcon={<FolderHRIcon />}
              items={hrItems}
              defaultOpen={false}
              onComingSoon={setModal}
            />
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