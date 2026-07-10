// pages/public/view/ViewPage.tsx
import { useNavigate } from 'react-router-dom'

const FACTORIES = [
  {
    id: 1,
    short: 'ZGI',
    name: 'Zinus Global Indonesia',
    location: 'Bogor · Factory 1',
    color: '#0F766E',
    locked: false,
  },
  {
    id: 2,
    short: 'ZGI',
    name: 'Zinus Global Indonesia',
    location: 'Karawang · Factory 2',
    color: '#0369A1',
    locked: true,
  },
  {
    id: 3,
    short: 'ZDI',
    name: 'Zinus Dream Indonesia',
    location: 'Tangerang · Factory 3',
    color: '#6D28D9',
    locked: false,
  },
]

// ── SVG Icons (dipertahankan dari versi sebelumnya) ─────────────────────────

const IconFactory = ({ color }: { color: string }) => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="2" y="10" width="20" height="12" rx="1.5" fill={color} fillOpacity="0.15" stroke={color} strokeWidth="1.6"/>
    <path d="M2 10L8 6V10M8 10L14 6V10M14 10L20 6V10" stroke={color} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
    <rect x="9" y="14" width="3" height="4" rx="0.5" fill={color} fillOpacity="0.4"/>
    <rect x="14" y="14" width="3" height="3" rx="0.5" fill={color} fillOpacity="0.3"/>
    <rect x="4" y="14" width="3" height="3" rx="0.5" fill={color} fillOpacity="0.3"/>
  </svg>
)

const IconRecycle = ({ color }: { color: string }) => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 2L15.5 8H8.5L12 2Z" fill={color} fillOpacity="0.2" stroke={color} strokeWidth="1.5" strokeLinejoin="round"/>
    <path d="M4.5 15L2 11L8.5 8L7 15H4.5Z" fill={color} fillOpacity="0.15" stroke={color} strokeWidth="1.5" strokeLinejoin="round"/>
    <path d="M19.5 15L22 11L15.5 8L17 15H19.5Z" fill={color} fillOpacity="0.15" stroke={color} strokeWidth="1.5" strokeLinejoin="round"/>
    <path d="M7 15H17L15 21H9L7 15Z" fill={color} fillOpacity="0.2" stroke={color} strokeWidth="1.5" strokeLinejoin="round"/>
  </svg>
)

const IconShield = ({ color }: { color: string }) => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 2L3 6.5V11C3 15.55 6.96 19.79 12 21C17.04 19.79 21 15.55 21 11V6.5L12 2Z" fill={color} fillOpacity="0.15" stroke={color} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M9 12L11 14L15 10" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
)

const IconBuilding = ({ color }: { color: string }) => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
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
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 21C12 21 4 16 4 9.5C4 6.5 6.5 4 9.5 4C10.8 4 12 4.5 13 5.3C14 4.5 15.2 4 16.5 4C19.5 4 22 6.5 22 9.5C22 16 12 21 12 21Z" fill={color} fillOpacity="0.15" stroke={color} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M12 21V12M12 12C12 12 9 10 7 8" stroke={color} strokeWidth="1.6" strokeLinecap="round"/>
  </svg>
)

const IconScroll = ({ color }: { color: string }) => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M6 3H18C18.55 3 19 3.45 19 4V20C19 20.55 18.55 21 18 21H6C5.45 21 5 20.55 5 20V4C5 3.45 5.45 3 6 3Z" fill={color} fillOpacity="0.12" stroke={color} strokeWidth="1.6"/>
    <path d="M9 8H15M9 12H15M9 16H12" stroke={color} strokeWidth="1.6" strokeLinecap="round"/>
  </svg>
)

const ChevronRight = ({ color }: { color: string }) => (
  <svg width="10" height="10" fill="none" stroke={color} strokeWidth="2.5" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
  </svg>
)

const IconLock = ({ color }: { color: string }) => (
  <svg width="13" height="13" fill="none" stroke={color} strokeWidth="2" viewBox="0 0 24 24">
    <rect x="4" y="11" width="16" height="9" rx="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M8 11V7a4 4 0 0 1 8 0v4" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
)

// ── Corner bracket, aksen ala "technical panel" ─────────────────────────────

const CornerBrackets = ({ color }: { color: string }) => (
  <>
    <span className="absolute top-2.5 left-2.5 w-2.5 h-2.5 border-t-2 border-l-2 pointer-events-none" style={{ borderColor: color }} />
    <span className="absolute top-2.5 right-2.5 w-2.5 h-2.5 border-t-2 border-r-2 pointer-events-none" style={{ borderColor: color }} />
    <span className="absolute bottom-2.5 left-2.5 w-2.5 h-2.5 border-b-2 border-l-2 pointer-events-none" style={{ borderColor: color }} />
    <span className="absolute bottom-2.5 right-2.5 w-2.5 h-2.5 border-b-2 border-r-2 pointer-events-none" style={{ borderColor: color }} />
  </>
)

// ── Trainings ─────────────────────────────────────────────────────────────────

const TRAININGS: { code: string; label: string; desc: string; Icon: React.FC<{ color: string }> }[] = [
  { code: '5S',                    label: 'Training 5S / 5R',      desc: 'Seiri · Seiton · Seiso · Seiketsu · Shitsuke',   Icon: IconFactory },
  { code: 'LIMBAH',                label: 'Limbah B3',             desc: 'Klasifikasi dan penanganan limbah berbahaya',    Icon: IconRecycle },
  { code: 'CTPAT',                 label: 'C-TPAT',                desc: 'Customs-Trade Partnership Against Terrorism',   Icon: IconShield },
  { code: 'CONDUCT',               label: 'Code of Conduct',       desc: 'Etika & tata perilaku karyawan',                Icon: IconScroll },
  { code: 'COMPANY_PROFILE',       label: 'Company Profile',       desc: 'Pengenalan perusahaan & struktur organisasi',   Icon: IconBuilding },
  { code: 'KESADARAN_LINGKUNGAN',  label: 'Kesadaran Lingkungan',  desc: 'Pengelolaan limbah & lingkungan hidup',         Icon: IconLeaf },
]

// ── Component ─────────────────────────────────────────────────────────────────

export default function ViewPage() {
  const navigate = useNavigate()

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Archivo:wght@600;700;800;900&family=Inter:wght@400;500;600&family=IBM+Plex+Mono:wght@400;500&display=swap');
        .vp-root { font-family: 'Inter', sans-serif; }
        .vp-display { font-family: 'Archivo', sans-serif; }
        .vp-mono { font-family: 'IBM Plex Mono', monospace; }
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(14px); }
          to   { opacity: 1; transform: none; }
        }
        @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.35} }
        .vp-anim { animation: fadeUp 0.45s ease both; }
        .vp-pulse { animation: pulse 1.8s infinite; }
        .vp-blueprint {
          background-color: #EEF2F1;
          background-image:
            linear-gradient(rgba(15,45,40,0.05) 1px, transparent 1px),
            linear-gradient(90deg, rgba(15,45,40,0.05) 1px, transparent 1px);
          background-size: 28px 28px;
        }
        .vp-strip-grid {
          position: absolute; inset: 0; pointer-events: none;
          background-image: repeating-linear-gradient(135deg, rgba(255,255,255,0.07) 0px, rgba(255,255,255,0.07) 1px, transparent 1px, transparent 10px);
        }
        .vp-locked-strip {
          background-color: #94a3b8 !important;
        }
        .vp-lock-overlay {
          position: absolute; inset: 0;
          background: repeating-linear-gradient(135deg, rgba(15,23,42,0.035) 0px, rgba(15,23,42,0.035) 6px, transparent 6px, transparent 12px);
          pointer-events: none;
        }
      `}</style>

      <div className="vp-root vp-blueprint min-h-screen text-[#0d1f1e]">

        {/* Header */}
        <div className="max-w-[1120px] mx-auto px-10 pt-14 pb-9 max-sm:px-5 max-sm:pt-10">
          <div className="vp-anim vp-mono flex items-center gap-2 text-[11px] font-medium text-[#57726f] tracking-[1px] uppercase mb-4">
            <span className="vp-pulse w-1.5 h-1.5 rounded-full bg-[#0F766E]" />
            Form ZNI-COM-03 · Monitoring Aktif
          </div>
          <div className="vp-anim [animation-delay:60ms] flex items-start gap-4">
            <span className="w-1 self-stretch bg-[#0F766E] rounded-full mt-1.5 mb-1.5" />
            <div>
              <h1 className="vp-display text-[clamp(26px,3.5vw,38px)] font-extrabold text-[#0d1f1e] leading-[1.08] m-0 mb-2 tracking-[-0.5px]">
                Status Ujian Karyawan
              </h1>
              <p className="text-[14.5px] text-[#5c7371] font-normal max-w-[440px]">
                Pilih factory dan kategori training di bawah ini untuk melihat hasil dan progres ujian.
              </p>
            </div>
          </div>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-3 gap-5 max-w-[1120px] mx-auto px-10 pb-14 max-[900px]:grid-cols-1 max-[900px]:px-5">
          {FACTORIES.map((fac, fi) => (
            <div
              key={fac.id}
              className={`vp-anim relative rounded-xl overflow-hidden bg-white border shadow-[0_2px_10px_rgba(15,45,40,0.06)] transition-transform duration-200 ${
                fac.locked ? 'border-[#e2e6ea] grayscale-[0.35]' : 'border-[#dde5e3] hover:-translate-y-1'
              }`}
              style={{ animationDelay: `${fi * 80}ms` }}
            >
              {/* Panel header */}
              <div className={`relative px-5 pt-5 pb-5 ${fac.locked ? 'vp-locked-strip' : ''}`} style={!fac.locked ? { backgroundColor: fac.color } : undefined}>
                <div className="vp-strip-grid" />
                <CornerBrackets color="rgba(255,255,255,0.55)" />

                <div className="flex items-center justify-between mb-4">
                  <span className="vp-mono text-[10px] font-medium tracking-[1.5px] uppercase text-white/65">
                    Factory ID
                  </span>
                  {fac.locked ? (
                    <span className="flex items-center gap-1.5 vp-mono text-[9.5px] font-medium tracking-[1px] uppercase text-white/90 bg-white/15 px-2 py-1 rounded-full">
                      <IconLock color="#ffffff" />
                      Terkunci
                    </span>
                  ) : (
                    <span className="flex items-center gap-1.5 vp-mono text-[9.5px] font-medium tracking-[1px] uppercase text-white/85 bg-white/15 px-2 py-1 rounded-full">
                      <span className="vp-pulse w-1.5 h-1.5 rounded-full bg-[#8CF5C4]" />
                      Operasional
                    </span>
                  )}
                </div>

                <div className="vp-display text-[36px] font-black text-white leading-none tracking-[-0.5px] mb-2">
                  {fac.short}
                </div>
                <div className="text-[12.5px] text-white/80 font-medium">{fac.name}</div>
                <div className="vp-mono text-[11px] text-white/60 mt-0.5">{fac.location}</div>
              </div>

              {/* Training list */}
              <div className="relative px-3.5 pt-4 pb-3.5 flex flex-col gap-2">
                {fac.locked && <div className="vp-lock-overlay" />}

                <div className="flex items-center gap-2 px-1 mb-1">
                  <p className="vp-mono text-[10px] font-semibold tracking-[1.5px] uppercase text-[#94a5a3]">
                    Pilih Training
                  </p>
                  <span className="flex-1 h-px bg-[#e3e9e8]" />
                  <span className="vp-mono text-[10px] text-[#b8c4c2]">{TRAININGS.length} item</span>
                </div>

                {TRAININGS.map((t, ti) => (
                  <button
                    key={t.code}
                    disabled={fac.locked}
                    onClick={() => {
                      if (fac.locked) return
                      navigate(`/view/${t.code.toLowerCase()}?factory=${fac.id}`)
                    }}
                    className={`group flex items-center gap-3 px-3 py-2.5 rounded-lg bg-white border border-[#e6ebea] text-left transition-all duration-150 ${
                      fac.locked
                        ? 'cursor-not-allowed opacity-60'
                        : 'cursor-pointer hover:bg-[#F5FAF9] hover:border-[color:var(--fac-color)] hover:translate-x-0.5'
                    }`}
                    style={{ ['--fac-color' as string]: fac.color }}
                  >
                    <span className="vp-mono text-[9.5px] font-medium text-[#a9b6b4] border border-[#e6ebea] rounded px-1.5 py-1 flex-shrink-0 group-hover:border-[color:var(--fac-color)] group-hover:text-[color:var(--fac-color)] transition-colors">
                      {String(ti + 1).padStart(2, '0')}
                    </span>
                    <div
                      className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                      style={{ background: fac.color + '15' }}
                    >
                      <t.Icon color={fac.color} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-[12.5px] font-semibold text-[#1a2e2d]">{t.label}</div>
                      <div className="text-[10.5px] text-[#8a9997] mt-0.5 truncate">{t.desc}</div>
                    </div>
                    {fac.locked ? (
                      <div className="w-5 h-5 rounded-md bg-[#f0f4f3] flex items-center justify-center flex-shrink-0">
                        <IconLock color="#94a3b8" />
                      </div>
                    ) : (
                      <div className="w-5 h-5 rounded-md bg-[#f0f4f3] flex items-center justify-center flex-shrink-0 transition-colors duration-150 group-hover:bg-[color:var(--fac-color)]">
                        <ChevronRight color="#94a3b8" />
                      </div>
                    )}
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