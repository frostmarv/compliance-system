import { useState, useEffect, useCallback, useRef } from 'react'
import logoZinus from '@/assets/zinus-tulisan-putih-contour.webp'
import logoHyundai from '@/assets/hyundai-ori-hitam.png'

interface MateriCompanyProfileProps {
  employeeName?: string
  onSelesai: () => void
}

// ─── SVG ICONS ───────────────────────────────────────────────────────────────

const IconGlobe = ({ size = 20, color = 'currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" />
    <line x1="2" y1="12" x2="22" y2="12" />
    <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
  </svg>
)

const IconFactory = ({ size = 20, color = 'currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M2 20V10l6-5v5l6-5v5l6-5v10H2z" />
    <line x1="2" y1="20" x2="22" y2="20" />
    <rect x="8" y="14" width="3" height="6" />
    <rect x="13" y="14" width="3" height="6" />
  </svg>
)

const IconStar = ({ size = 20, color = 'currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26" />
  </svg>
)

const IconTrendUp = ({ size = 20, color = 'currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="23,6 13.5,15.5 8.5,10.5 1,18" />
    <polyline points="17,6 23,6 23,12" />
  </svg>
)

const IconLeaf = ({ size = 20, color = 'currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17 8C8 10 5.9 16.17 3.82 19.5c.9.11 1.8.2 2.7.2A13 13 0 0 0 17 8z" />
    <path d="M3.82 19.5C3.82 19.5 5 14 10 12" />
  </svg>
)

const IconBox = ({ size = 20, color = 'currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
    <polyline points="3.27,6.96 12,12.01 20.73,6.96" />
    <line x1="12" y1="22.08" x2="12" y2="12" />
  </svg>
)

const IconUsers = ({ size = 20, color = 'currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
    <circle cx="9" cy="7" r="4" />
    <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
  </svg>
)

const IconShield = ({ size = 20, color = 'currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
  </svg>
)

const IconRecycle = ({ size = 20, color = 'currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="1.5,8.5 1.5,3.5 6.5,3.5" />
    <path d="M1.5 3.5A10 10 0 0 1 21.5 12" />
    <polyline points="22.5,15.5 22.5,20.5 17.5,20.5" />
    <path d="M22.5 20.5A10 10 0 0 1 2.5 12" />
  </svg>
)

const IconAward = ({ size = 20, color = 'currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="8" r="6" />
    <path d="M15.477 12.89L17 22l-5-3-5 3 1.523-9.11" />
  </svg>
)

const IconHeart = ({ size = 20, color = 'currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
  </svg>
)

const IconCheck = ({ size = 20, color = 'currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20,6 9,17 4,12" />
  </svg>
)

const IconMapPin = ({ size = 20, color = 'currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
    <circle cx="12" cy="10" r="3" />
  </svg>
)

const IconBed = ({ size = 20, color = 'currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M2 4v16" />
    <path d="M22 4v16" />
    <path d="M2 8h20" />
    <path d="M2 16h20" />
    <rect x="6" y="8" width="4" height="8" rx="1" />
    <rect x="14" y="8" width="4" height="8" rx="1" />
  </svg>
)

const IconBuilding = ({ size = 20, color = 'currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="3" width="18" height="18" rx="1" />
    <path d="M3 9h18" />
    <path d="M9 21V9" />
    <path d="M6 6h.01" />
    <path d="M12 6h.01" />
    <path d="M18 6h.01" />
    <rect x="12" y="13" width="4" height="8" />
  </svg>
)

// ─── DATA ────────────────────────────────────────────────────────────────────

const FAKTA_KUNCI = [
  { angka: '25M+', label: 'Kasur Terjual', sub: 'Sejak 2004 secara global', icon: 'bed' },
  { angka: '2.6M+', label: 'Rating & Ulasan', sub: 'Dari pelanggan di seluruh dunia', icon: 'star' },
  { angka: '4,000+', label: 'Produk', sub: 'Dalam 12 kategori furnitur', icon: 'box' },
  { angka: '44 Thn', label: 'Hyundai DS Group', sub: 'Pengalaman retail di Korea', icon: 'building' },
]

const PABRIK = [
  {
    nama: 'Pabrik 1 – Bogor',
    tahun: 'Akuisisi: 2018',
    luas: '1.269.646 ft²',
    karyawan: '1.417 karyawan (2 shift)',
    kapasitas: '2.640.000 pcs/tahun',
    pelabuhan: '36 mil (75 menit)',
    fasilitas: ['Produksi Kasur Busa', 'Produksi Kasur Spring', 'Sertifikasi Walmart', '12 Loading Docks'],
    warna: '#003628',
  },
  {
    nama: 'Pabrik 2 – Karawang',
    tahun: 'Berdiri: 2019',
    luas: '896.762 ft²',
    karyawan: '1.050 karyawan (2 shift)',
    kapasitas: '1.742.400 pcs/tahun',
    pelabuhan: '43 mil (90 menit)',
    fasilitas: ['Produksi Kasur Busa', 'Produksi Kasur Spring', 'Sertifikasi Walmart', '30 Loading Docks'],
    warna: '#005248',
  },
  {
    nama: 'Pabrik 3 – Tangerang',
    tahun: 'Berdiri: 2022',
    luas: '1.814.763 ft²',
    karyawan: '1.459 karyawan (2 shift)',
    kapasitas: '3.432.000 pcs/tahun',
    pelabuhan: '26 mil (60 menit)',
    fasilitas: ['Produksi Kasur Busa', 'Produksi Kasur Spring', 'Investasi $70 Juta', '38 Loading Docks'],
    warna: '#00684E',
  },
]

const KAPASITAS_TOTAL = [
  { pabrik: 'Pabrik 1 – Bogor', luas: '1,3M ft²', kapasitas: '2.640.000' },
  { pabrik: 'Pabrik 2 – Karawang', luas: '0,9M ft²', kapasitas: '1.742.400' },
  { pabrik: 'Pabrik 3 – Tangerang', luas: '1,8M ft²', kapasitas: '3.432.000' },
  { pabrik: 'TOTAL', luas: '4,0M ft²', kapasitas: '7.814.400*' },
]

const TIMELINE = [
  { tahun: '2004', teks: 'Zinus meluncurkan produk bedding pertama' },
  { tahun: '2006', teks: 'Teknologi kompresi dikembangkan; paten "SmartBase" didaftarkan' },
  { tahun: '2007', teks: 'Memperkenalkan "BioFoam" dengan minyak biji alami, teh hijau, & arang aktif' },
  { tahun: '2010', teks: 'Gudang AS pertama diluncurkan untuk operasional domestik' },
  { tahun: '2019', teks: 'Listing di Bursa Efek Korea Selatan; ekspansi ke 5 pasar Eropa' },
  { tahun: '2021', teks: 'Fasilitas manufaktur pertama di AS resmi beroperasi' },
  { tahun: '2022', teks: 'Bergabung dengan Hyundai Department Store Group' },
  { tahun: '2024', teks: 'Pabrik ketiga di Indonesia (Tangerang) mulai beroperasi' },
]

const PASAR_GLOBAL = [
  { kode: 'USA', nama: 'Amerika Serikat', tahun: '1987' },
  { kode: 'AUS', nama: 'Australia', tahun: '2018' },
  { kode: 'KOR', nama: 'Korea', tahun: '2018' },
  { kode: 'CHN', nama: 'China', tahun: '2019' },
  { kode: 'JPN', nama: 'Jepang', tahun: '2019' },
  { kode: 'UK/EU', nama: 'UK & Eropa', tahun: '2019' },
  { kode: 'IDN', nama: 'Indonesia', tahun: '2020' },
  { kode: 'SGP', nama: 'Singapura', tahun: '2020' },
  { kode: 'MYS', nama: 'Malaysia', tahun: '2022' },
  { kode: 'VNM', nama: 'Vietnam', tahun: '2022' },
  { kode: 'CHL', nama: 'Chile', tahun: '2022' },
  { kode: 'NZL', nama: 'Selandia Baru', tahun: '2023' },
  { kode: 'MEX', nama: 'Meksiko', tahun: '2024' },
]

const ESG_DATA = [
  { label: 'GHG Emission Intensity', nilai: '21,7', satuan: 'tons CO₂e/USD juta', kategori: 'Lingkungan', warna: '#2E7D52' },
  { label: 'Daur Ulang Limbah', nilai: '7.895', satuan: 'ton/tahun', kategori: 'Lingkungan', warna: '#2E7D52' },
  { label: 'Energy Usage Intensity', nilai: '0,1', satuan: 'TJ/USD juta penjualan', kategori: 'Lingkungan', warna: '#2E7D52' },
  { label: 'Partisipasi Serikat Pekerja', nilai: '100%', satuan: 'China jurisdictions', kategori: 'Sosial', warna: '#003628' },
  { label: 'Tingkat Kecelakaan Kerja', nilai: '0,6%', satuan: 'rata-rata industri', kategori: 'Sosial', warna: '#003628' },
  { label: 'Pelanggaran Standar Ketenagakerjaan', nilai: '0', satuan: 'pelanggaran', kategori: 'Sosial', warna: '#003628' },
  { label: 'Kontroversi Etika Bisnis', nilai: '0', satuan: '3 tahun terakhir', kategori: 'Tata Kelola', warna: '#005248' },
]

const SUSTAINABILITY = [
  { label: 'Energi Terbarukan', detail: 'Program transisi ke energi hijau di fasilitas produksi', icon: 'leaf' },
  { label: 'Kemasan Ramah Lingkungan', detail: 'Kertas daur ulang cetak timbul menggantikan lembaran PE', icon: 'recycle' },
  { label: 'Zero Waste Policy', detail: '4 jalur daur ulang limbah busa: baling, pengisi tas, kursi aksen, marble foam', icon: 'shield' },
  { label: 'OEKO-TEX Certified', detail: 'Setiap komponen tekstil telah diuji dari 100+ zat berbahaya', icon: 'award' },
  { label: 'GRS Roadmap', detail: 'Implementasi 50% serat daur ulang & sertifikasi GRS target 2025', icon: 'trending' },
  { label: 'Kontribusi Komunitas', detail: 'Donasi 5.000 kasur untuk korban gempa Turki; reboisasi 30.000 pohon', icon: 'heart' },
]

const PRODUK_KATEGORI = [
  { nama: 'Kasur', detail: 'Busa, Spring, Hybrid — lini utama produksi Indonesia' },
  { nama: 'Bed Frames & Foundation', detail: 'Rangka besi, kayu/bambu, upholstered, storage bed' },
  { nama: 'Sofa & Seating', detail: 'Sofa, loveseat, kursi aksen, futon, ottoman' },
  { nama: 'Meja & Penyimpanan', detail: 'Meja, TV stand, rak, storage bathroom' },
  { nama: 'Outdoor & Lainnya', detail: 'Produk outdoor, home office, kids furniture' },
  { nama: 'Bantal & Topper', detail: 'Pelengkap tidur berkualitas tinggi' },
]

const TOTAL_SLIDES = 12

// ─── MINIMAL CSS ─────────────────────────────────────────────────────────────

const minimalCss = `
  @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700&family=Playfair+Display:ital,wght@0,700;1,700&display=swap');
  @keyframes fadeSlideUp {
    from { opacity: 0; transform: translateY(6px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  @keyframes bounceHint {
    0%, 100% { transform: translateX(-50%) translateY(0px); }
    50%       { transform: translateX(-50%) translateY(-4px); }
  }
  @keyframes arrowBounce {
    0%, 100% { transform: translateY(0); }
    50%       { transform: translateY(2px); }
  }
  .slide-anim { animation: fadeSlideUp 0.3s ease both; }
  .bounce-hint { animation: bounceHint 2s ease-in-out infinite; }
  .arrow-bounce { animation: arrowBounce 1.4s ease infinite; }
  .no-scrollbar::-webkit-scrollbar { display: none; }
  .no-scrollbar { scrollbar-width: none; -ms-overflow-style: none; }
  .font-playfair { font-family: 'Playfair Display', serif; }
  .font-jakarta  { font-family: 'Plus Jakarta Sans', sans-serif; }
`

// ─── ICON RENDERER ───────────────────────────────────────────────────────────

function Icon({ name, size = 18, color = 'currentColor' }: { name: string; size?: number; color?: string }) {
  switch (name) {
    case 'globe':    return <IconGlobe size={size} color={color} />
    case 'factory':  return <IconFactory size={size} color={color} />
    case 'star':     return <IconStar size={size} color={color} />
    case 'trending': return <IconTrendUp size={size} color={color} />
    case 'leaf':     return <IconLeaf size={size} color={color} />
    case 'box':      return <IconBox size={size} color={color} />
    case 'users':    return <IconUsers size={size} color={color} />
    case 'shield':   return <IconShield size={size} color={color} />
    case 'recycle':  return <IconRecycle size={size} color={color} />
    case 'award':    return <IconAward size={size} color={color} />
    case 'heart':    return <IconHeart size={size} color={color} />
    case 'check':    return <IconCheck size={size} color={color} />
    case 'pin':      return <IconMapPin size={size} color={color} />
    case 'bed':      return <IconBed size={size} color={color} />
    case 'building': return <IconBuilding size={size} color={color} />
    default:         return <IconBox size={size} color={color} />
  }
}

// ─── COMPONENT ───────────────────────────────────────────────────────────────

export default function MateriCompanyProfile({ employeeName, onSelesai }: MateriCompanyProfileProps) {
  const [slide, setSlide] = useState(0)
  const [visited, setVisited] = useState<Set<number>>(new Set([0]))
  const [showHint, setShowHint] = useState(false)
  const innerRef = useRef<HTMLDivElement>(null)
  const hintTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    setVisited(prev => new Set([...prev, slide]))
  }, [slide])

  useEffect(() => {
    setShowHint(false)
    if (innerRef.current) innerRef.current.scrollTop = 0
    if (slide === 0 || slide === TOTAL_SLIDES - 1) return
    if (hintTimer.current) clearTimeout(hintTimer.current)
    hintTimer.current = setTimeout(() => {
      const el = innerRef.current
      if (el && el.scrollHeight > el.clientHeight + 30) setShowHint(true)
    }, 700)
    return () => { if (hintTimer.current) clearTimeout(hintTimer.current) }
  }, [slide])

  const handleScroll = useCallback(() => {
    const el = innerRef.current
    if (el && el.scrollTop + el.clientHeight >= el.scrollHeight - 50) setShowHint(false)
  }, [])

  const goNext = useCallback(() => setSlide(s => Math.min(s + 1, TOTAL_SLIDES - 1)), [])
  const goPrev = useCallback(() => setSlide(s => Math.max(s - 1, 0)), [])

  const canFinish = visited.size >= TOTAL_SLIDES - 1
  const progress = Math.round((visited.size / TOTAL_SLIDES) * 100)
  const isScrollableSlide = slide > 0 && slide < TOTAL_SLIDES - 1

  // ─── Warna tema Zinus brand green ──────────────────────────────────────────
  const C = {
    primary: '#003628',
    mid: '#005C40',
    light: '#EEF7F4',
    accent: '#B2E0D2',
    text: '#001F16',
    muted: '#2E6B56',
    border: '#B2D9CC',
    white: '#FFFFFF',
  }

  // ─── ScrollSlide wrapper ────────────────────────────────────────────────────
  const ScrollSlide = ({ children }: { children: React.ReactNode }) => (
    <div key={slide} className="slide-anim flex flex-col flex-1 overflow-hidden">
      <div ref={innerRef} onScroll={handleScroll} className="no-scrollbar flex-1 overflow-y-auto px-4 py-5 flex flex-col gap-4 max-w-[540px] w-full mx-auto">
        {children}
      </div>
    </div>
  )

  // ─── Section header pattern ──────────────────────────────────────────────────
  const SlideHeader = ({ label, title }: { label: string; title: string }) => (
    <div>
      <p className="font-jakarta text-[10px] font-bold tracking-[0.16em] uppercase mb-1" style={{ color: C.mid }}>{label}</p>
      <h2 className="font-playfair text-[clamp(20px,5vw,28px)] font-bold leading-tight" style={{ color: C.text }}>{title}</h2>
    </div>
  )

  // ─── SLIDE 0: Cover ─────────────────────────────────────────────────────────
  const Slide0Cover = () => (
    <div
      key={slide}
      className="slide-anim no-scrollbar flex flex-col items-center justify-center text-center overflow-y-auto flex-1 gap-5 px-5 py-8"
      style={{ background: `linear-gradient(160deg, ${C.primary} 0%, #001810 100%)` }}
    >
      {/* Zinus logo badge */}
      <div className="w-16 h-16 rounded-2xl flex items-center justify-center flex-shrink-0" style={{ background: 'rgba(255,255,255,0.12)', border: '1px solid rgba(255,255,255,0.2)' }}>
        <IconBuilding size={32} color="white" />
      </div>

      <p className="font-jakarta text-[10px] font-bold tracking-[0.18em] uppercase" style={{ color: 'rgba(255,255,255,0.6)' }}>
        Materi Training · Company Profile
      </p>
      <h1 className="font-playfair text-[clamp(28px,8vw,42px)] font-bold text-white leading-[1.1] tracking-tight">
        Mengenal<br />
        <em className="italic" style={{ color: C.accent }}>Zinus Indonesia</em>
      </h1>
      <p className="font-jakarta text-sm leading-relaxed max-w-[300px]" style={{ color: 'rgba(255,255,255,0.8)' }}>
        {employeeName
          ? `Halo, ${employeeName}! Pelajari seluruh materi ini untuk memahami perusahaan kita lebih dalam.`
          : 'Pelajari sejarah, fasilitas, produk, dan komitmen keberlanjutan Zinus Indonesia.'}
      </p>

      {/* Topic chips */}
      <div className="flex flex-wrap justify-center gap-1.5 mt-1">
        {['Tentang Zinus', 'Pabrik Indonesia', 'Produk', 'Pasar Global', 'ESG & Sustainability'].map(t => (
          <span
            key={t}
            className="font-jakarta text-[11px] font-semibold text-white px-3 py-1 rounded-full"
            style={{ background: 'rgba(255,255,255,0.12)', border: '1px solid rgba(255,255,255,0.2)' }}
          >
            {t}
          </span>
        ))}
      </div>
    </div>
  )

  // ─── SLIDE 1: Tentang Zinus ──────────────────────────────────────────────────
  const Slide1Tentang = () => (
    <ScrollSlide>
      <SlideHeader label="Company Overview" title="Zinus, Brand Kasur #1 di Amerika" />

      <p className="font-jakarta text-sm leading-relaxed" style={{ color: C.muted }}>
        Didirikan pada tahun 2004, Zinus telah berkembang menjadi brand kasur dan furnitur online
        <strong style={{ color: C.text }}> paling dicintai di dunia</strong>. Dikenal karena inovasi kompresi
        dan pengiriman dalam satu kotak yang mudah dirakit.
      </p>

      {/* Stat grid */}
      <div className="grid grid-cols-2 gap-2.5">
        {FAKTA_KUNCI.map((f) => (
          <div key={f.angka} className="bg-white rounded-xl p-3 text-center" style={{ border: `1px solid ${C.border}` }}>
            <div className="w-8 h-8 rounded-full flex items-center justify-center mx-auto mb-2" style={{ background: C.light }}>
              <Icon name={f.icon} size={16} color={C.primary} />
            </div>
            <p className="font-playfair text-[22px] font-bold leading-none mb-0.5" style={{ color: C.primary }}>{f.angka}</p>
            <p className="font-jakarta text-[11px] font-semibold mb-0.5" style={{ color: C.text }}>{f.label}</p>
            <p className="font-jakarta text-[10px]" style={{ color: C.muted }}>{f.sub}</p>
          </div>
        ))}
      </div>

      {/* Hyundai note */}
      <div className="rounded-xl px-4 py-3 flex items-start gap-3" style={{ background: C.primary }}>
        <div className="flex-shrink-0 mt-0.5">
          <IconBuilding size={16} color={C.accent} />
        </div>
        <div>
          <p className="font-jakarta text-xs font-bold text-white mb-0.5">Bagian dari Hyundai Department Store Group</p>
          <p className="font-jakarta text-[11px]" style={{ color: 'rgba(255,255,255,0.7)' }}>
            Hyundai DS menjadi pemegang saham mayoritas Zinus sejak Mei 2022 — grup retail premium Korea dengan pendapatan $3 miliar USD dan 44 tahun pengalaman.
          </p>
        </div>
      </div>
    </ScrollSlide>
  )

  // ─── SLIDE 2: Timeline ───────────────────────────────────────────────────────
  const Slide2Timeline = () => (
    <ScrollSlide>
      <SlideHeader label="Sejarah Perusahaan" title="20 Tahun Perjalanan Zinus" />
      <p className="font-jakarta text-sm leading-relaxed" style={{ color: C.muted }}>
        Dari startup bedding di 2004 hingga menjadi perusahaan publik global yang dicintai jutaan pelanggan.
      </p>
      <div className="relative flex flex-col gap-0">
        {/* Vertical line */}
        <div className="absolute left-[28px] top-4 bottom-4 w-px" style={{ background: C.border }} />
        {TIMELINE.map((t, i) => (
          <div key={t.tahun} className="flex items-start gap-3 py-2 relative">
            <div
              className="flex-shrink-0 w-14 h-7 rounded-lg flex items-center justify-center font-jakarta text-[10px] font-bold text-white z-10"
              style={{ background: i === TIMELINE.length - 1 ? C.primary : C.mid }}
            >
              {t.tahun}
            </div>
            <div className="flex-1 bg-white rounded-xl px-3 py-2.5" style={{ border: `1px solid ${C.border}` }}>
              <p className="font-jakarta text-[12px] leading-relaxed" style={{ color: C.text }}>{t.teks}</p>
            </div>
          </div>
        ))}
      </div>
    </ScrollSlide>
  )

  // ─── SLIDE 3: Pasar Global ───────────────────────────────────────────────────
  const Slide3Pasar = () => (
    <ScrollSlide>
      <SlideHeader label="Ekspansi Global" title="Zinus Hadir di 14+ Pasar" />
      <p className="font-jakarta text-sm leading-relaxed" style={{ color: C.muted }}>
        Dimulai dari Amerika Serikat, Zinus terus memperluas jangkauan ke seluruh dunia — dengan Indonesia bergabung sejak 2020.
      </p>
      <div className="grid grid-cols-2 gap-2">
        {PASAR_GLOBAL.map((p) => (
          <div
            key={p.kode}
            className="flex items-center gap-2.5 bg-white rounded-xl px-3 py-2.5"
            style={{ border: `1px solid ${C.border}`, borderLeft: `3px solid ${p.kode === 'IDN' ? C.primary : C.accent}` }}
          >
            <div className="flex-shrink-0 w-9 h-7 rounded-md flex items-center justify-center font-jakarta text-[9px] font-bold" style={{ background: p.kode === 'IDN' ? C.primary : C.light, color: p.kode === 'IDN' ? 'white' : C.primary }}>
              {p.kode}
            </div>
            <div>
              <p className="font-jakarta text-[11px] font-semibold" style={{ color: C.text }}>{p.nama}</p>
              <p className="font-jakarta text-[10px]" style={{ color: C.muted }}>Masuk {p.tahun}</p>
            </div>
          </div>
        ))}
      </div>
      <div className="rounded-xl px-4 py-3 text-center" style={{ background: C.light, border: `1px solid ${C.border}` }}>
        <p className="font-jakarta text-xs font-semibold" style={{ color: C.primary }}>
          <span style={{ color: C.mid }}>Indonesia</span> adalah salah satu hub produksi terbesar Zinus di dunia — dengan 3 pabrik beroperasi aktif.
        </p>
      </div>
    </ScrollSlide>
  )

  // ─── SLIDE 4: Kapasitas Produksi ─────────────────────────────────────────────
  const Slide4Kapasitas = () => (
    <ScrollSlide>
      <SlideHeader label="Fasilitas Produksi" title="Kapasitas 3 Pabrik Indonesia" />
      <p className="font-jakarta text-sm leading-relaxed" style={{ color: C.muted }}>
        Zinus Indonesia mengoperasikan tiga pabrik besar dengan total kapasitas produksi <strong style={{ color: C.text }}>7,8 juta pcs per tahun</strong> — atau 650.000 pcs per bulan.
      </p>
      {/* Capacity table */}
      <div className="overflow-x-auto rounded-xl" style={{ border: `1px solid ${C.border}` }}>
        <table className="w-full border-collapse text-[11px]" style={{ minWidth: 280 }}>
          <thead>
            <tr>
              {['Pabrik', 'Luas', 'Kapasitas/Tahun'].map((h, i) => (
                <th key={h} className="font-jakarta text-[9px] font-bold tracking-[0.08em] uppercase text-left px-2.5 py-2" style={{ background: C.primary, color: C.accent, borderRadius: i === 0 ? '9px 0 0 0' : i === 2 ? '0 9px 0 0' : undefined }}>
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {KAPASITAS_TOTAL.map((row, i) => (
              <tr key={row.pabrik} style={{ background: row.pabrik === 'TOTAL' ? C.primary : i % 2 === 0 ? C.light : 'white' }}>
                <td className="font-jakarta px-2.5 py-2 font-semibold" style={{ color: row.pabrik === 'TOTAL' ? 'white' : C.text, borderBottom: i < KAPASITAS_TOTAL.length - 1 ? `1px solid ${C.border}` : undefined }}>{row.pabrik}</td>
                <td className="font-jakarta px-2.5 py-2" style={{ color: row.pabrik === 'TOTAL' ? C.accent : C.muted, borderBottom: i < KAPASITAS_TOTAL.length - 1 ? `1px solid ${C.border}` : undefined }}>{row.luas}</td>
                <td className="font-jakarta px-2.5 py-2 font-bold" style={{ color: row.pabrik === 'TOTAL' ? 'white' : C.primary, borderBottom: i < KAPASITAS_TOTAL.length - 1 ? `1px solid ${C.border}` : undefined }}>{row.kapasitas}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="font-jakarta text-[10px] text-center" style={{ color: C.muted }}>* Data kapasitas Y2024 · Update Q1 2025</p>

      {/* Visual bar */}
      <div className="bg-white rounded-xl p-3" style={{ border: `1px solid ${C.border}` }}>
        <p className="font-jakarta text-[10px] font-bold uppercase tracking-wide mb-2" style={{ color: C.muted }}>Distribusi Kapasitas</p>
        {[
          { label: 'Bogor', persen: 34, warna: '#003628' },
          { label: 'Karawang', persen: 22, warna: '#005C40' },
          { label: 'Tangerang', persen: 44, warna: '#00684E' },
        ].map(bar => (
          <div key={bar.label} className="flex items-center gap-2 mb-1.5">
            <p className="font-jakarta text-[11px] w-[72px] flex-shrink-0" style={{ color: C.text }}>{bar.label}</p>
            <div className="flex-1 h-4 rounded-full overflow-hidden" style={{ background: C.light }}>
              <div className="h-full rounded-full flex items-center justify-end pr-2 font-jakarta text-[9px] font-bold text-white" style={{ width: `${bar.persen}%`, background: bar.warna }}>
                {bar.persen}%
              </div>
            </div>
          </div>
        ))}
      </div>
    </ScrollSlide>
  )

  // ─── SLIDE 5–7: Pabrik detail ────────────────────────────────────────────────
  const SlidePabrik = ({ pabrik, idx }: { pabrik: typeof PABRIK[0]; idx: number }) => (
    <div key={`pabrik-${idx}`} className="slide-anim flex flex-col flex-1 overflow-hidden">
      <div ref={innerRef} onScroll={handleScroll} className="no-scrollbar flex-1 overflow-y-auto px-4 py-5 flex flex-col gap-4 max-w-[540px] w-full mx-auto">

        {/* Hero */}
        <div className="relative rounded-2xl overflow-hidden px-4 py-5 text-white" style={{ background: pabrik.warna }}>
          <p className="font-jakarta text-[10px] font-bold tracking-[0.14em] uppercase mb-1" style={{ color: 'rgba(255,255,255,0.7)' }}>
            Pabrik {idx + 1} dari 3 · Zinus Indonesia
          </p>
          <p className="font-playfair text-[28px] font-bold leading-none mb-1.5">{pabrik.nama}</p>
          <div className="flex items-center gap-1.5">
            <IconMapPin size={12} color="rgba(255,255,255,0.7)" />
            <p className="font-jakarta text-[12px]" style={{ color: 'rgba(255,255,255,0.85)' }}>{pabrik.tahun}</p>
          </div>
        </div>

        {/* Stats grid */}
        <div className="grid grid-cols-2 gap-2">
          {[
            { label: 'Luas Total', nilai: pabrik.luas, icon: 'factory' },
            { label: 'Karyawan', nilai: pabrik.karyawan, icon: 'users' },
            { label: 'Kapasitas/Tahun', nilai: pabrik.kapasitas, icon: 'box' },
            { label: 'Jarak Pelabuhan', nilai: pabrik.pelabuhan, icon: 'pin' },
          ].map(s => (
            <div key={s.label} className="bg-white rounded-xl p-3" style={{ border: `1px solid ${C.border}` }}>
              <div className="w-7 h-7 rounded-lg flex items-center justify-center mb-2" style={{ background: C.light }}>
                <Icon name={s.icon} size={14} color={C.primary} />
              </div>
              <p className="font-jakarta text-[10px] mb-0.5" style={{ color: C.muted }}>{s.label}</p>
              <p className="font-jakarta text-xs font-bold" style={{ color: C.text }}>{s.nilai}</p>
            </div>
          ))}
        </div>

        {/* Capabilities */}
        <div>
          <p className="font-jakarta text-[10px] font-bold tracking-[0.14em] uppercase mb-2" style={{ color: C.muted }}>Kapabilitas</p>
          <div className="flex flex-col gap-2">
            {pabrik.fasilitas.map(f => (
              <div key={f} className="flex items-center gap-2.5 bg-white rounded-xl px-3 py-2.5" style={{ border: `1px solid ${C.border}` }}>
                <div className="flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center" style={{ background: pabrik.warna }}>
                  <IconCheck size={11} color="white" />
                </div>
                <p className="font-jakarta text-[12px]" style={{ color: C.text }}>{f}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )

  // ─── SLIDE 8: Produk ─────────────────────────────────────────────────────────
  const Slide8Produk = () => (
    <ScrollSlide>
      <SlideHeader label="Portofolio Produk" title="Solusi Lengkap untuk Rumah" />
      <p className="font-jakarta text-sm leading-relaxed" style={{ color: C.muted }}>
        Zinus terus berkembang dari brand kasur menjadi solusi furnitur rumah lengkap — dengan 4.000+ produk di 12 kategori.
      </p>
      <div className="flex flex-col gap-2">
        {PRODUK_KATEGORI.map((p, i) => (
          <div key={p.nama} className="flex items-start gap-3 bg-white rounded-xl px-3 py-3" style={{ border: `1px solid ${C.border}` }}>
            <div className="flex-shrink-0 w-7 h-7 rounded-lg flex items-center justify-center font-jakarta text-[11px] font-bold text-white" style={{ background: C.primary }}>
              {i + 1}
            </div>
            <div>
              <p className="font-jakarta text-xs font-bold mb-0.5" style={{ color: C.text }}>{p.nama}</p>
              <p className="font-jakarta text-[11px] leading-relaxed" style={{ color: C.muted }}>{p.detail}</p>
            </div>
          </div>
        ))}
      </div>
      <div className="rounded-xl px-4 py-3 flex items-center gap-2" style={{ background: C.light, border: `1px solid ${C.border}` }}>
        <IconTrendUp size={14} color={C.primary} />
        <p className="font-jakarta text-xs" style={{ color: C.text }}>
          <strong>Foam mattress</strong> mendominasi 66% eCommerce global; hybrid tumbuh 41% YoY.
        </p>
      </div>
    </ScrollSlide>
  )

  // ─── SLIDE 9: ESG Data ───────────────────────────────────────────────────────
  const Slide9ESG = () => (
    <ScrollSlide>
      <SlideHeader label="ESG Performance 2023" title="Kinerja Lingkungan, Sosial & Tata Kelola" />
      <p className="font-jakarta text-sm leading-relaxed" style={{ color: C.muted }}>
        Zinus berkomitmen pada praktik bisnis yang bertanggung jawab — dibuktikan dengan data ESG yang transparan.
      </p>
      {['Lingkungan', 'Sosial', 'Tata Kelola'].map(kat => {
        const items = ESG_DATA.filter(d => d.kategori === kat)
        const bg = kat === 'Lingkungan' ? '#1A5C38' : kat === 'Sosial' ? C.primary : '#2E5C1A'
        return (
          <div key={kat}>
            <div className="flex items-center gap-2 mb-2">
              <div className="w-5 h-5 rounded-full flex items-center justify-center" style={{ background: bg }}>
                {kat === 'Lingkungan' && <IconLeaf size={11} color="white" />}
                {kat === 'Sosial' && <IconUsers size={11} color="white" />}
                {kat === 'Tata Kelola' && <IconShield size={11} color="white" />}
              </div>
              <p className="font-jakarta text-[11px] font-bold uppercase tracking-wide" style={{ color: bg }}>{kat}</p>
            </div>
            <div className="grid grid-cols-1 gap-2">
              {items.map(d => (
                <div key={d.label} className="flex items-center gap-3 bg-white rounded-xl px-3 py-2.5" style={{ border: `1px solid ${C.border}` }}>
                  <div>
                    <p className="font-playfair text-[22px] font-bold leading-none" style={{ color: d.warna }}>{d.nilai}</p>
                    <p className="font-jakarta text-[10px]" style={{ color: C.muted }}>{d.satuan}</p>
                  </div>
                  <div className="h-8 w-px flex-shrink-0" style={{ background: C.border }} />
                  <p className="font-jakarta text-[12px]" style={{ color: C.text }}>{d.label}</p>
                </div>
              ))}
            </div>
          </div>
        )
      })}
    </ScrollSlide>
  )

  // ─── SLIDE 10: Sustainability ────────────────────────────────────────────────
  const Slide10Sustainability = () => (
    <ScrollSlide>
      <SlideHeader label="Keberlanjutan" title="Komitmen Zinus untuk Lingkungan & Komunitas" />
      <p className="font-jakarta text-sm leading-relaxed" style={{ color: C.muted }}>
        Dari pengelolaan limbah busa hingga donasi komunitas, Zinus memiliki roadmap keberlanjutan yang jelas dan terukur.
      </p>
      <div className="flex flex-col gap-2.5">
        {SUSTAINABILITY.map((s, i) => (
          <div key={s.label} className="flex items-start gap-3 bg-white rounded-xl px-3 py-3" style={{ border: `1px solid ${C.border}` }}>
            <div className="flex-shrink-0 w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: i % 2 === 0 ? C.primary : '#005248' }}>
              <Icon name={s.icon} size={16} color="white" />
            </div>
            <div>
              <p className="font-jakarta text-xs font-bold mb-0.5" style={{ color: C.text }}>{s.label}</p>
              <p className="font-jakarta text-[11px] leading-relaxed" style={{ color: C.muted }}>{s.detail}</p>
            </div>
          </div>
        ))}
      </div>
      <div className="rounded-xl px-4 py-3 text-center" style={{ background: '#001F16', color: 'white' }}>
        <p className="font-jakarta text-xs font-semibold" style={{ color: '#8FDFC0' }}>
          Target 2025: Sertifikasi GRS + implementasi 50% serat daur ulang pada produk tekstil.
        </p>
      </div>
    </ScrollSlide>
  )

  // ─── SLIDE 11: Finish ────────────────────────────────────────────────────────
  const Slide11Finish = () => (
    <div
      key={slide}
      className="slide-anim no-scrollbar flex flex-col flex-1 items-center justify-center text-center overflow-y-auto px-5 py-8 gap-4"
      style={{ background: `linear-gradient(160deg, ${C.primary} 0%, #001810 100%)` }}
    >
      <div className="w-14 h-14 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: C.mid }}>
        <IconCheck size={24} color="white" />
      </div>
      <h2 className="font-playfair text-2xl font-bold" style={{ color: C.accent }}>Materi Selesai!</h2>
      <p className="font-jakarta text-[13px] leading-relaxed max-w-[280px]" style={{ color: 'rgba(255,255,255,0.65)' }}>
        {canFinish
          ? 'Kamu sudah membaca semua materi Company Profile. Saatnya kerjakan Post-Test!'
          : `Kamu sudah membaca ${progress}% materi. Pastikan semua slide sudah dibuka sebelum melanjutkan.`}
      </p>
      <button
        onClick={onSelesai}
        disabled={!canFinish}
        className="font-jakarta font-bold text-sm text-white rounded-xl px-7 py-4 w-full max-w-[280px] mt-1 transition-all"
        style={{
          background: canFinish ? C.mid : 'rgba(0,92,64,0.4)',
          cursor: canFinish ? 'pointer' : 'not-allowed',
        }}
      >
        Lanjut ke Post-Test →
      </button>
      {!canFinish && (
        <p className="font-jakarta text-[11px]" style={{ color: 'rgba(255,255,255,0.4)' }}>
          Kembali dan buka semua slide terlebih dahulu ({visited.size}/{TOTAL_SLIDES} slide terbuka)
        </p>
      )}
    </div>
  )

  // ─── SLIDE REGISTRY ──────────────────────────────────────────────────────────
  const slides: React.ReactNode[] = [
    <Slide0Cover key="cover" />,
    <Slide1Tentang key="tentang" />,
    <Slide2Timeline key="timeline" />,
    <Slide3Pasar key="pasar" />,
    <Slide4Kapasitas key="kapasitas" />,
    ...PABRIK.map((p, i) => <SlidePabrik key={p.nama} pabrik={p} idx={i} />),
    <Slide8Produk key="produk" />,
    <Slide9ESG key="esg" />,
    <Slide10Sustainability key="sustainability" />,
    <Slide11Finish key="finish" />,
  ]

  // ─── RENDER ───────────────────────────────────────────────────────────────────
  return (
    <>
      <style>{minimalCss}</style>
      <div className="font-jakarta flex flex-col min-h-screen" style={{ background: C.light }}>

        {/* ── TOP BAR ── */}
        <div
          className="sticky top-0 z-50 flex items-center justify-between gap-2 bg-white px-3 h-14"
          style={{ borderBottom: `1px solid ${C.border}` }}
        >
          <div className="flex items-center gap-2.5 flex-shrink-0">
            <img src={logoZinus} alt="Zinus" className="h-7 w-auto object-contain max-w-[80px]" loading="eager" />
            <div className="w-px h-5 flex-shrink-0" style={{ background: C.border }} />
            <img src={logoHyundai} alt="Hyundai" className="h-7 w-auto object-contain max-w-[80px]" loading="eager" />
          </div>
          <div className="flex-1 min-w-0 max-w-[120px]">
            <div className="h-1 rounded-full overflow-hidden" style={{ background: C.border }}>
              <div
                className="h-full rounded-full transition-all duration-300"
                style={{ width: `${progress}%`, background: C.mid }}
              />
            </div>
            <p className="font-jakarta text-[10px] font-semibold text-right mt-0.5 tracking-wide whitespace-nowrap" style={{ color: C.mid }}>
              {progress}% terbaca
            </p>
          </div>
        </div>

        {/* ── SLIDE AREA ── */}
        <div className="flex-1 relative overflow-hidden" style={{ height: 'calc(100dvh - 56px - 68px)' }}>
          {slides[slide]}

          {/* Scroll hint */}
          {isScrollableSlide && (
            <div
              className={`bounce-hint absolute left-1/2 z-50 flex items-center gap-2 rounded-full px-3.5 py-2 text-white font-jakarta text-[11px] font-semibold pointer-events-none transition-all duration-300 ${showHint ? 'opacity-100' : 'opacity-0'}`}
              style={{
                bottom: 12,
                transform: 'translateX(-50%)',
                background: 'rgba(0,31,22,0.92)',
                boxShadow: '0 2px 12px rgba(0,0,0,0.18)',
                whiteSpace: 'nowrap',
              }}
            >
              <span
                className="arrow-bounce w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0"
                style={{ background: C.mid }}
              >
                <svg width="10" height="10" viewBox="0 0 10 10" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="2,3 5,7 8,3" />
                </svg>
              </span>
              Gulir ke bawah
            </div>
          )}
        </div>

        {/* ── BOTTOM NAV ── */}
        <div
          className="sticky bottom-0 z-50 flex items-center justify-between gap-2 bg-white px-4"
          style={{ borderTop: `1px solid ${C.border}`, height: 68, paddingBottom: 'env(safe-area-inset-bottom, 0px)' }}
        >
          {/* PREV */}
          <button
            onClick={goPrev}
            disabled={slide === 0}
            aria-label="Slide sebelumnya"
            className="flex-shrink-0 w-11 h-11 rounded-full flex items-center justify-center transition-all active:scale-95"
            style={{
              background: slide === 0 ? C.border : C.primary,
              boxShadow: slide === 0 ? 'none' : `0 2px 8px rgba(0,54,40,0.35)`,
            }}
          >
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="11,4 6,9 11,14" />
            </svg>
          </button>

          {/* Dots */}
          <div className="flex-1 flex items-center justify-center gap-1.5 overflow-x-auto no-scrollbar px-1" role="tablist">
            {Array.from({ length: TOTAL_SLIDES }).map((_, i) => (
              <button
                key={i}
                role="tab"
                aria-selected={slide === i}
                aria-label={`Slide ${i + 1}`}
                onClick={() => setSlide(i)}
                className="flex-shrink-0 w-2 h-2 rounded-full border-0 p-0 cursor-pointer transition-all duration-200"
                style={{
                  background: slide === i ? C.primary : visited.has(i) ? C.mid : C.border,
                  transform: slide === i ? 'scale(1.5)' : 'scale(1)',
                  minWidth: 8,
                }}
              />
            ))}
          </div>

          {/* NEXT */}
          <button
            onClick={goNext}
            disabled={slide === TOTAL_SLIDES - 1}
            aria-label="Slide berikutnya"
            className="flex-shrink-0 w-11 h-11 rounded-full flex items-center justify-center transition-all active:scale-95"
            style={{
              background: slide === TOTAL_SLIDES - 1 ? C.border : C.primary,
              boxShadow: slide === TOTAL_SLIDES - 1 ? 'none' : `0 2px 8px rgba(0,54,40,0.35)`,
            }}
          >
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="7,4 12,9 7,14" />
            </svg>
          </button>
        </div>

      </div>
    </>
  )
}
