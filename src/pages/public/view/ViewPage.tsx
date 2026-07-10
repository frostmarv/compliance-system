// pages/public/view/ViewPage.tsx
import { useNavigate } from 'react-router-dom'

const FACTORIES = [
  {
    id: 1,
    short: 'ZGI',
    name: 'Zinus Global Indonesia',
    location: 'Factory 1',
    color: '#329F96',
    grad: 'linear-gradient(135deg, #1a7a73 0%, #329F96 100%)',
    shadow: 'rgba(50,159,150,0.35)',
  },
  {
    id: 2,
    short: 'ZGK',
    name: 'Zinus Global Indonesia',
    location: 'Karawang · Factory 2',
    color: '#0ea5e9',
    grad: 'linear-gradient(135deg, #0369a1 0%, #0ea5e9 100%)',
    shadow: 'rgba(14,165,233,0.35)',
  },
  {
    id: 3,
    short: 'ZDI',
    name: 'Zinus Dream Indonesia',
    location: 'Factory 3',
    color: '#8b5cf6',
    grad: 'linear-gradient(135deg, #6d28d9 0%, #8b5cf6 100%)',
    shadow: 'rgba(139,92,246,0.35)',
  },
]

// ── SVG Icons ────────────────────────────────────────────────────────────────

const IconFactory = ({ color }: { color: string }) => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="2" y="10" width="20" height="12" rx="1.5" fill={color} fillOpacity="0.15" stroke={color} strokeWidth="1.6"/>
    <path d="M2 10L8 6V10M8 10L14 6V10M14 10L20 6V10" stroke={color} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
    <rect x="9" y="14" width="3" height="4" rx="0.5" fill={color} fillOpacity="0.4"/>
    <rect x="14" y="14" width="3" height="3" rx="0.5" fill={color} fillOpacity="0.3"/>
    <rect x="4" y="14" width="3" height="3" rx="0.5" fill={color} fillOpacity="0.3"/>
  </svg>
)

const IconRecycle = ({ color }: { color: string }) => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 2L15.5 8H8.5L12 2Z" fill={color} fillOpacity="0.2" stroke={color} strokeWidth="1.5" strokeLinejoin="round"/>
    <path d="M4.5 15L2 11L8.5 8L7 15H4.5Z" fill={color} fillOpacity="0.15" stroke={color} strokeWidth="1.5" strokeLinejoin="round"/>
    <path d="M19.5 15L22 11L15.5 8L17 15H19.5Z" fill={color} fillOpacity="0.15" stroke={color} strokeWidth="1.5" strokeLinejoin="round"/>
    <path d="M7 15H17L15 21H9L7 15Z" fill={color} fillOpacity="0.2" stroke={color} strokeWidth="1.5" strokeLinejoin="round"/>
  </svg>
)

const IconShield = ({ color }: { color: string }) => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 2L3 6.5V11C3 15.55 6.96 19.79 12 21C17.04 19.79 21 15.55 21 11V6.5L12 2Z" fill={color} fillOpacity="0.15" stroke={color} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M9 12L11 14L15 10" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
)

const IconBuilding = ({ color }: { color: string }) => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="3" y="7" width="18" height="14" rx="1.5" fill={color} fillOpacity="0.12" stroke={color} strokeWidth="1.6"/>
    <path d="M8 22V7M16 22V7" stroke={color} strokeWidth="1.4" strokeLinecap="round"/>
    <rect x="9" y="11" width="2.5" height="2.5" rx="0.5" fill={color} fillOpacity="0.5"/>
    <rect x="12.5" y="11" width="2.5" height="2.5" rx="0.5" fill={color} fillOpacity="0.5"/>
    <rect x="9" y="15" width="2.5" height="2.5" rx="0.5" fill={color} fillOpacity="0.5"/>
    <rect x="12.5" y="15" width="2.5" height="2.5" rx="0.5" fill={color} fillOpacity="0.5"/>
    <path d="M8 7V4C8 3.45 8.45 3 9 3H15C15.55 3 16 3.45 16 4V7" stroke={color} strokeWidth="1.6" strokeLinecap="round"/>
  </svg>
)

const IconLeaf = ({ color }: { color: string }) => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 21C12 21 4 16 4 9.5C4 6.5 6.5 4 9.5 4C10.8 4 12 4.5 13 5.3C14 4.5 15.2 4 16.5 4C19.5 4 22 6.5 22 9.5C22 16 12 21 12 21Z" fill={color} fillOpacity="0.15" stroke={color} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M12 21V12M12 12C12 12 9 10 7 8" stroke={color} strokeWidth="1.6" strokeLinecap="round"/>
  </svg>
)

const IconScroll = ({ color }: { color: string }) => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M6 3H18C18.55 3 19 3.45 19 4V20C19 20.55 18.55 21 18 21H6C5.45 21 5 20.55 5 20V4C5 3.45 5.45 3 6 3Z" fill={color} fillOpacity="0.12" stroke={color} strokeWidth="1.6"/>
    <path d="M9 8H15M9 12H15M9 16H12" stroke={color} strokeWidth="1.6" strokeLinecap="round"/>
  </svg>
)

const ChevronRight = ({ color }: { color: string }) => (
  <svg width="11" height="11" fill="none" stroke={color} strokeWidth="2.5" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
  </svg>
)

// ── Trainings ─────────────────────────────────────────────────────────────────

const TRAININGS: { code: string; label: string; desc: string; Icon: React.FC<{ color: string }> }[] = [
  { code: '5S',         label: 'Training 5S / 5R',    desc: 'Seiri · Seiton · Seiso · Seiketsu · Shitsuke',         Icon: IconFactory },
  { code: 'LIMBAH',     label: 'Limbah B3',            desc: 'Klasifikasi dan penanganan limbah berbahaya',           Icon: IconRecycle },
  { code: 'CTPAT',      label: 'C-TPAT',               desc: 'Customs-Trade Partnership Against Terrorism',          Icon: IconShield },
  { code: 'CONDUCT',    label: 'Code of Conduct',      desc: 'Etika & tata perilaku karyawan',                       Icon: IconScroll },
  { code: 'COMPANY_PROFILE',    label: 'Company Profile',      desc: 'Pengenalan perusahaan & struktur organisasi',          Icon: IconBuilding },
  { code: 'KESADARAN_LINGKUNGAN', label: 'Kesadaran Lingkungan', desc: 'Pengelolaan limbah & lingkungan hidup',                Icon: IconLeaf },
]

// ── Component ─────────────────────────────────────────────────────────────────

export default function ViewPage() {
  const navigate = useNavigate()

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@300;400;500;600;700;800&family=DM+Mono:wght@400;500&display=swap');
        .vp-root { font-family: 'Sora', sans-serif; }
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(16px); }
          to   { opacity: 1; transform: none; }
        }
        @keyframes blink { 0%,100%{opacity:1} 50%{opacity:0.4} }
        .vp-anim { animation: fadeUp 0.5s ease both; }
        .vp-dot  { animation: blink 2s infinite; }
        .vp-card-top-pattern {
          position: absolute; inset: 0; pointer-events: none;
          background:
            radial-gradient(circle at 80% 20%, rgba(255,255,255,0.08) 0%, transparent 50%),
            radial-gradient(circle at 20% 80%, rgba(255,255,255,0.05) 0%, transparent 40%);
        }
      `}</style>

      <div className="vp-root min-h-screen bg-[#f0f4f8] [background-image:radial-gradient(ellipse_80%_50%_at_50%_-10%,rgba(50,159,150,0.1)_0%,transparent_60%)] text-[#0d1f1e]">

        {/* Header */}
        <div className="max-w-[1100px] mx-auto px-10 pt-12 pb-8 max-sm:px-5 max-sm:pt-9">
          <div className="vp-anim inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#329F96]/10 border border-[#329F96]/20 text-[11px] font-semibold text-[#329F96] tracking-[1px] uppercase mb-3.5">
            <span className="vp-dot w-1.5 h-1.5 rounded-full bg-[#329F96]" />
            Monitoring Training
          </div>
          <h1 className="vp-anim [animation-delay:60ms] text-[clamp(26px,3.5vw,40px)] font-extrabold text-[#0d1f1e] leading-tight m-0 mb-2">
            Status Ujian Karyawan
          </h1>
          <p className="vp-anim [animation-delay:120ms] text-[15px] text-[#6b8f8d] font-normal">
            Pilih factory dan kategori training untuk melihat hasil
          </p>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-3 gap-5 max-w-[1100px] mx-auto px-10 pb-10 max-[900px]:grid-cols-1 max-[900px]:px-5">
          {FACTORIES.map((fac, fi) => (
            <div
              key={fac.id}
              className="vp-anim rounded-[22px] overflow-hidden shadow-[0_4px_20px_rgba(0,0,0,0.10)] transition-transform duration-200 hover:-translate-y-1"
              style={{ animationDelay: `${fi * 80}ms` }}
            >
              {/* Colored top */}
              <div className="relative px-6 pt-7 pb-6" style={{ background: fac.grad }}>
                <div className="vp-card-top-pattern" />
                {/* Deco circles */}
                <div className="absolute -right-5 -bottom-5 w-24 h-24 rounded-full bg-white/[0.08]" />
                <div className="absolute right-8 -bottom-8 w-14 h-14 rounded-full bg-white/[0.06]" />

                <div className="font-mono text-[11px] font-medium tracking-[1px] text-white/70 bg-white/15 px-2.5 py-1 rounded-full inline-block mb-3.5">
                  {fac.location}
                </div>
                <div className="text-[38px] font-extrabold text-white leading-none tracking-[-1px] mb-1">
                  {fac.short}
                </div>
                <div className="text-[13px] text-white/75 font-medium">{fac.name}</div>
              </div>

              {/* Training list */}
              <div className="bg-white px-4 pt-4 pb-4 flex flex-col gap-2.5">
                <p className="text-[10px] font-bold tracking-[1.5px] uppercase text-slate-300 mx-0.5 mb-1">
                  Pilih Training
                </p>
                {TRAININGS.map((t) => (
                  <button
                    key={t.code}
                    onClick={() => navigate(`/view/${t.code.toLowerCase()}?factory=${fac.id}`)}
                    className="flex items-center gap-3 px-3.5 py-3 rounded-xl bg-slate-50 border-[1.5px] border-slate-100 cursor-pointer font-[Sora,sans-serif] text-left transition-all duration-150 hover:bg-[#f0f9f8] hover:border-[rgba(50,159,150,0.25)] hover:translate-x-0.5 group"
                  >
                    <div
                      className="w-9 h-9 rounded-[10px] flex items-center justify-center flex-shrink-0"
                      style={{ background: fac.color + '18' }}
                    >
                      <t.Icon color={fac.color} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-[13px] font-bold text-[#1a2e2d]">{t.label}</div>
                      <div className="text-[11px] text-slate-400 mt-0.5 truncate">{t.desc}</div>
                    </div>
                    <div className="w-[22px] h-[22px] rounded-[7px] bg-slate-100 flex items-center justify-center flex-shrink-0 transition-colors duration-150 group-hover:bg-[rgba(50,159,150,0.15)]">
                      <ChevronRight color="#94a3b8" />
                    </div>
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>

      </div>
    </>
  )
}