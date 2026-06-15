import { useState, useEffect, useCallback, useRef } from 'react'
import logoZinus from '@/assets/zinus-tulisan-putih-contour.webp'
import logoHyundai from '@/assets/hyundai-ori-hitam.png'

interface KesadaranLingkunganProps {
  employeeName?: string
  onSelesai: () => void
}

// ─── DATA ────────────────────────────────────────────────────────────────────

const BAB = [
  {
    kode: 'B1',
    nama: 'Manajemen & Kesadaran Lingkungan',
    warna: '#1E6B2E',
    tagline: 'Memahami aspek lingkungan dan dampaknya',
    deskripsi:
      'Setiap kegiatan operasional pabrik menghasilkan berbagai aspek lingkungan. Kesadaran terhadap aspek-aspek ini adalah langkah pertama dalam menjaga kelestarian lingkungan.',
    aspek: [
      { nama: 'Limbah Padat', icon: 'LS', contoh: 'Sisa busa, plastik kemasan, potongan kain, kardus' },
      { nama: 'Limbah Cair', icon: 'LC', contoh: 'Air proses produksi, limbah cucian, air dari WWTP' },
      { nama: 'Limbah B3', icon: 'B3', contoh: 'Oli bekas, kemasan bahan kimia, lampu TL, baterai' },
      { nama: 'Emisi Udara', icon: 'EU', contoh: 'Asap dari proses produksi, gas buang forklift' },
      { nama: 'Air Bersih', icon: 'AB', contoh: 'Konsumsi air untuk produksi, sanitasi, dan kantin' },
    ],
    dampak: [
      { teks: 'Pencemaran sungai akibat pembuangan limbah cair tidak terkendali', ikon: 'PCV' },
      { teks: 'ISPA (Infeksi Saluran Pernapasan) akibat paparan emisi udara', ikon: 'ISP' },
      { teks: 'Pencemaran tanah akibat kebocoran atau pembuangan limbah B3', ikon: 'PCT' },
    ],
  },
]

const TOPIK_PENGELOLAAN = [
  {
    kode: 'T1', judul: 'Limbah B3', warna: '#B91C1C',
    definisi: 'Sisa kegiatan (padat atau cair) yang karena sifat dan jumlahnya — baik langsung maupun tidak langsung — membahayakan lingkungan dan makhluk hidup.',
    catatan: 'Maksimal penyimpanan Limbah B3 adalah 3 bulan (90 hari) sesuai izin TPS.',
    poin: [
      { judul: 'Pengemasan', detail: 'Kemasan harus sesuai karakteristik limbah, tidak bocor, tidak berkarat, dan dapat mencegah tumpahan hingga pengangkutan.' },
      { judul: 'Penyimpanan', detail: 'Disimpan di atas permukaan tanah, bebas dari bahaya kebakaran & banjir. Semua wadah harus compatible dan dilengkapi simbol & label.' },
      { judul: 'Pengurangan', detail: 'Dilakukan melalui substitusi bahan, modifikasi proses (engineering), dan penggunaan teknologi ramah lingkungan.' },
      { judul: 'Penggunaan APD', detail: 'Setiap karyawan yang bekerja dengan Limbah B3 wajib menggunakan APD yang disediakan perusahaan.' },
    ],
    sifat: [
      { nama: 'Fisik', detail: 'Berat jenis, wujud (padat/cair/gas)' },
      { nama: 'Kimia', detail: 'pH, logam berat, senyawa organik' },
      { nama: 'Biologis', detail: 'Kehadiran mikroorganisme' },
      { nama: 'Toksisitas', detail: 'Kadar racun bagi makhluk hidup' },
      { nama: 'Eksplosif/Reaktif', detail: 'Potensi meledak atau bereaksi' },
      { nama: 'Radioaktif', detail: 'Memancarkan radiasi' },
    ],
  },
]

const SIMBOL_B3 = [
  { kode: 'EXP', nama: 'Mudah Meledak', warna: '#EF4444' },
  { kode: 'OXI', nama: 'Pengoksidasi', warna: '#F97316' },
  { kode: 'EFL', nama: 'Sangat Mudah Menyala', warna: '#FBBF24' },
  { kode: 'TOX', nama: 'Beracun', warna: '#7C3AED' },
  { kode: 'COR', nama: 'Korosif', warna: '#0891B2' },
  { kode: 'ENV', nama: 'Berbahaya bagi Lingkungan', warna: '#059669' },
  { kode: 'HAR', nama: 'Berbahaya', warna: '#6B7280' },
  { kode: 'IRR', nama: 'Bersifat Iritasi', warna: '#D97706' },
]

const SEGREGASI = {
  definisi: 'Upaya pemilahan limbah yang dihasilkan mulai dari hulu (produksi) ke hilir (TPA) sesuai jenis & karakteristik limbah.',
  tujuan: 'Mengurangi volume sampah ke TPA dan memungkinkan pengelolaan limbah lebih efisien dan berkelanjutan.',
  prinsip: ['Reduce', 'Reuse', 'Recycle'],
  nonB3: [
    { no: '1', nama: 'Limbah Produksi', contoh: 'Busa, tekstil, plastik produksi', warna: '#FBBF24' },
    { no: '2', nama: 'Limbah Makanan', contoh: 'Sisa makanan, buah, organik', warna: '#84CC16' },
    { no: '3', nama: 'Limbah Domestik/Sanitasi', contoh: 'Tisu, botol plastik, limbah taman', warna: '#22D3EE' },
  ],
  b3: [
    { no: '1', nama: 'Limbah Produksi B3', contoh: 'Kemasan bahan kimia kosong, kain majun bekas bahan kimia', warna: '#EF4444' },
    { no: '2', nama: 'Limbah Domestik B3', contoh: 'Baterai, lampu, oli mesin, obat kadaluarsa, elektronik', warna: '#F97316' },
  ],
  teknik: [
    { step: '01', judul: 'Penyediaan Tempat Sampah', detail: 'Sediakan tempat sampah yang cukup dan sesuai jenis limbah di setiap titik sumber limbah.' },
    { step: '02', judul: 'Labelisasi', detail: 'Berikan label yang jelas pada setiap tempat sampah sesuai jenis limbah yang ditampung.' },
    { step: '03', judul: 'Kode Warna', detail: 'Gunakan tempat sampah berwarna untuk membedakan jenis limbah secara visual.' },
  ],
}

const KONSERVASI = [
  {
    kode: 'KA', judul: 'Konservasi Air',
    deskripsi: 'Upaya memelihara keberadaan serta keberlanjutan sumber daya air agar tersedia dalam kuantitas dan kualitas memadai untuk memenuhi kebutuhan makhluk hidup, kini dan masa depan.',
    aksi: ['Tutup keran air setelah digunakan', 'Laporkan kebocoran pipa segera', 'Gunakan air secukupnya di toilet & pantry', 'Tidak membuang limbah cair ke saluran air bersih'],
    warna: '#0EA5E9',
  },
  {
    kode: 'KE', judul: 'Konservasi Energi',
    deskripsi: 'Tindakan untuk mengurangi penggunaan energi tak terbarukan dan mengoptimalkan energi terbarukan. Dengan menghemat energi, kita berperan dalam mengurangi dampak perubahan iklim.',
    aksi: ['Matikan lampu & AC saat ruangan kosong', 'Cabut charger dan peralatan tidak terpakai', 'Manfaatkan cahaya alami jika memungkinkan', 'Gunakan peralatan hemat energi'],
    warna: '#F59E0B',
  },
]

const MANAJEMEN_KIMIA = {
  definisi: 'Upaya untuk memastikan seluruh pengelolaan bahan kimia yang digunakan di dalam perusahaan terkendali sehingga tidak menyebabkan bahaya terhadap karyawan dan lingkungan.',
  ghs: [
    { kode: 'GHS01', nama: 'Explosive', warna: '#EF4444' },
    { kode: 'GHS02', nama: 'Flammable', warna: '#F97316' },
    { kode: 'GHS03', nama: 'Oxidizing', warna: '#FBBF24' },
    { kode: 'GHS04', nama: 'Compressed Gas', warna: '#6B7280' },
    { kode: 'GHS05', nama: 'Corrosive', warna: '#0891B2' },
    { kode: 'GHS06', nama: 'Acute Toxicity', warna: '#7C3AED' },
    { kode: 'GHS07', nama: 'Harmful/Irritant', warna: '#D97706' },
    { kode: 'GHS08', nama: 'Health Hazard', warna: '#9D174D' },
    { kode: 'GHS09', nama: 'Environmental', warna: '#059669' },
  ],
  rsl: {
    definisi: 'RSL (Restricted Substance List) adalah daftar zat terlarang — bahan kimia dan zat lain yang penggunaan dan/atau keberadaannya telah dilarang atau dibatasi oleh suatu merek.',
    alasan: ['Kepedulian terhadap lingkungan', 'Masalah kesehatan & keselamatan pekerja', 'Perlindungan konsumen', 'Kewajiban undang-undang'],
  },
}

const ESG = {
  pernyataan: 'Zinus selalu memperhatikan Keberlanjutan Lingkungan untuk memastikan planet masa depan.',
  program: [
    { kode: 'GP', nama: 'Green Packaging', detail: 'Mendesain ulang kemasan produk dengan material ramah lingkungan untuk mengurangi limbah kemasan.' },
    { kode: 'RE', nama: 'Renewable Energy', detail: 'Memasang panel surya dan sumber energi terbarukan lainnya untuk mengurangi ketergantungan pada energi fosil.' },
    { kode: 'RS', nama: 'Reuse Scrap Foam', detail: 'Menggunakan kembali scrap foam produksi menjadi produk visco-latex, mengurangi limbah padat secara signifikan.' },
  ],
}

const TOTAL_SLIDES = 12

// ─── CSS ─────────────────────────────────────────────────────────────────────

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
  .bab-hero::after {
    content: attr(data-kode);
    position: absolute;
    right: -6px; top: -8px;
    font-family: 'Playfair Display', serif;
    font-size: 80px;
    font-weight: 700;
    color: rgba(255,255,255,0.08);
    line-height: 1;
    pointer-events: none;
    user-select: none;
  }
  .font-playfair { font-family: 'Playfair Display', serif; }
  .font-jakarta  { font-family: 'Plus Jakarta Sans', sans-serif; }
`

// ─── COMPONENT ───────────────────────────────────────────────────────────────

export default function KesadaranLingkungan({ employeeName, onSelesai }: KesadaranLingkunganProps) {
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

  // ── Warna primer tema ──
  const PRIMARY = '#1B6B3A'
  const PRIMARY_LIGHT = '#D1FAE5'
  const PRIMARY_MID = '#059669'
  const TEXT_DARK = '#0C3320'
  const TEXT_MID = '#1E5C38'
  const TEXT_MUTED = '#4B8B64'
  const BORDER = '#A7F3D0'

  // ─── SLIDE 0: Cover ────────────────────────────────────────────────────────
  const Slide0Cover = () => (
    <div
      key={slide}
      className="slide-anim no-scrollbar flex flex-col items-center justify-center text-center overflow-y-auto flex-1 gap-4 px-5 py-8"
      style={{ background: `linear-gradient(160deg, ${PRIMARY} 0%, #0A4020 100%)` }}
    >
      <div
        className="w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0"
        style={{ background: 'rgba(255,255,255,0.12)', border: '1.5px solid rgba(255,255,255,0.2)' }}
      >
        {/* leaf icon */}
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10z" />
          <path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12" />
        </svg>
      </div>
      <p className="font-jakarta text-[10px] font-bold tracking-[0.18em] uppercase text-white/70">
        Materi Training · Lingkungan
      </p>
      <h1 className="font-playfair text-[clamp(28px,8vw,44px)] font-bold text-white leading-[1.1] tracking-tight">
        Sistem Manajemen<br />
        <em className="italic" style={{ color: '#6EE7B7' }}>Lingkungan</em>
      </h1>
      <p className="font-jakarta text-sm text-white/90 leading-relaxed max-w-[300px]">
        {employeeName
          ? `Halo, ${employeeName}! Baca seluruh materi sebelum mengerjakan post-test.`
          : 'Pelajari pengelolaan limbah, segregasi, konservasi, dan manajemen bahan kimia di perusahaan.'}
      </p>
      <div className="flex flex-wrap justify-center gap-1.5 mt-1">
        {['Kesadaran Lingkungan', 'Limbah B3', 'Segregasi Limbah', 'Konservasi', 'Bahan Kimia', 'ESG Zinus'].map(t => (
          <span
            key={t}
            className="font-jakarta text-xs font-semibold text-white px-3 py-1 rounded-full"
            style={{ background: 'rgba(255,255,255,0.12)', border: '1px solid rgba(255,255,255,0.22)' }}
          >
            {t}
          </span>
        ))}
      </div>
    </div>
  )

  // ─── SLIDE 1: Pendahuluan — Aspek Lingkungan ───────────────────────────────
  const Slide1Pendahuluan = () => (
    <div key={slide} className="slide-anim flex flex-col flex-1 overflow-hidden">
      <div ref={innerRef} onScroll={handleScroll} className="no-scrollbar flex-1 overflow-y-auto px-4 py-5 flex flex-col gap-4 max-w-[540px] w-full mx-auto">
        <div>
          <p className="font-jakarta text-[10px] font-bold tracking-[0.16em] uppercase mb-1" style={{ color: PRIMARY_MID }}>Manajemen &amp; Kesadaran Lingkungan</p>
          <h2 className="font-playfair text-[clamp(20px,5vw,28px)] font-bold leading-tight" style={{ color: TEXT_DARK }}>Aspek Lingkungan di Pabrik</h2>
        </div>
        <p className="font-jakarta text-sm leading-relaxed" style={{ color: TEXT_MID }}>
          Setiap kegiatan operasional pabrik menghasilkan <strong>aspek lingkungan</strong> yang perlu dikelola dengan baik. Karyawan wajib mengenal dan memahami dampak dari setiap aspek ini.
        </p>
        <div className="flex flex-col gap-2">
          {BAB[0].aspek.map(a => (
            <div key={a.icon} className="flex items-start gap-3 bg-white rounded-xl px-3 py-2.5" style={{ border: `1px solid ${BORDER}` }}>
              <div
                className="flex-shrink-0 w-9 h-9 rounded-lg flex items-center justify-center font-jakarta text-[9px] font-bold text-white"
                style={{ background: PRIMARY }}
              >
                {a.icon}
              </div>
              <div>
                <p className="font-jakarta text-xs font-bold mb-0.5" style={{ color: TEXT_DARK }}>{a.nama}</p>
                <p className="font-jakarta text-[11px] leading-relaxed" style={{ color: TEXT_MUTED }}>{a.contoh}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )

  // ─── SLIDE 2: Dampak ───────────────────────────────────────────────────────
  const Slide2Dampak = () => (
    <div key={slide} className="slide-anim flex flex-col flex-1 overflow-hidden">
      <div ref={innerRef} onScroll={handleScroll} className="no-scrollbar flex-1 overflow-y-auto px-4 py-5 flex flex-col gap-4 max-w-[540px] w-full mx-auto">
        <div>
          <p className="font-jakarta text-[10px] font-bold tracking-[0.16em] uppercase mb-1" style={{ color: PRIMARY_MID }}>Mengapa Penting?</p>
          <h2 className="font-playfair text-[clamp(20px,5vw,28px)] font-bold leading-tight" style={{ color: TEXT_DARK }}>Dampak Bila Tidak Dikelola</h2>
        </div>
        <div className="flex flex-col gap-3">
          {[
            { judul: 'Pencemaran Sungai', detail: 'Pembuangan limbah cair tanpa pengolahan memperburuk kualitas air dan mengancam ekosistem sungai.', warna: '#0EA5E9' },
            { judul: 'ISPA & Gangguan Pernapasan', detail: 'Paparan emisi udara dari proses produksi yang tidak terkendali menyebabkan infeksi saluran pernapasan pada pekerja dan masyarakat sekitar.', warna: '#F97316' },
            { judul: 'Pencemaran Tanah', detail: 'Kebocoran atau pembuangan limbah B3 sembarangan mencemari tanah dan air tanah, sulit dipulihkan.', warna: '#B91C1C' },
          ].map((d, i) => (
            <div key={i} className="bg-white rounded-xl p-3.5" style={{ border: '1px solid #E5E7EB', borderLeft: `4px solid ${d.warna}` }}>
              <p className="font-jakarta text-xs font-bold mb-1" style={{ color: TEXT_DARK }}>{d.judul}</p>
              <p className="font-jakarta text-[11px] leading-relaxed" style={{ color: TEXT_MUTED }}>{d.detail}</p>
            </div>
          ))}
        </div>
        <div className="rounded-xl px-4 py-3 text-center font-jakarta text-xs font-semibold text-white" style={{ background: TEXT_DARK }}>
          Pengelolaan lingkungan yang baik = Tanggung jawab seluruh karyawan
        </div>
      </div>
    </div>
  )

  // ─── SLIDE 3: Definisi & Karakteristik Limbah B3 ──────────────────────────
  const Slide3LimbahB3 = () => (
    <div key={slide} className="slide-anim flex flex-col flex-1 overflow-hidden">
      <div ref={innerRef} onScroll={handleScroll} className="no-scrollbar flex-1 overflow-y-auto px-4 py-5 flex flex-col gap-4 max-w-[540px] w-full mx-auto">
        <div>
          <p className="font-jakarta text-[10px] font-bold tracking-[0.16em] uppercase mb-1" style={{ color: '#EF4444' }}>Pengelolaan Limbah</p>
          <h2 className="font-playfair text-[clamp(20px,5vw,28px)] font-bold leading-tight" style={{ color: TEXT_DARK }}>Limbah B3 — Definisi &amp; Karakteristik</h2>
        </div>
        <div className="rounded-xl px-4 py-3" style={{ background: '#FEF2F2', border: '1px solid #FECACA' }}>
          <p className="font-jakarta text-[11px] leading-relaxed" style={{ color: '#7F1D1D' }}>
            <strong>Definisi:</strong> Sisa kegiatan (padat atau cair) yang karena sifat dan jumlahnya — baik langsung maupun tidak langsung — membahayakan lingkungan dan makhluk hidup.
          </p>
          <p className="font-jakarta text-[11px] mt-2 font-semibold" style={{ color: '#B91C1C' }}>
            ⚠ Maksimal penyimpanan: 3 bulan (90 hari) sesuai izin TPS Limbah B3.
          </p>
        </div>
        <div>
          <p className="font-jakarta text-[10px] font-bold tracking-[0.14em] uppercase mb-2" style={{ color: TEXT_MUTED }}>Sifat Karakteristik Limbah</p>
          <div className="grid grid-cols-2 gap-2">
            {TOPIK_PENGELOLAAN[0].sifat.map(s => (
              <div key={s.nama} className="bg-white rounded-xl px-3 py-2" style={{ border: `1px solid ${BORDER}` }}>
                <p className="font-jakarta text-[11px] font-bold mb-0.5" style={{ color: TEXT_DARK }}>{s.nama}</p>
                <p className="font-jakarta text-[10px] leading-relaxed" style={{ color: TEXT_MUTED }}>{s.detail}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )

  // ─── SLIDE 4: Penyimpanan & Simbol B3 ─────────────────────────────────────
  const Slide4PenyimpananB3 = () => (
    <div key={slide} className="slide-anim flex flex-col flex-1 overflow-hidden">
      <div ref={innerRef} onScroll={handleScroll} className="no-scrollbar flex-1 overflow-y-auto px-4 py-5 flex flex-col gap-4 max-w-[540px] w-full mx-auto">
        <div>
          <p className="font-jakarta text-[10px] font-bold tracking-[0.16em] uppercase mb-1" style={{ color: '#EF4444' }}>Pengelolaan Limbah B3</p>
          <h2 className="font-playfair text-[clamp(20px,5vw,28px)] font-bold leading-tight" style={{ color: TEXT_DARK }}>Pengemasan, Penyimpanan &amp; Simbol</h2>
        </div>
        <div className="flex flex-col gap-2">
          {TOPIK_PENGELOLAAN[0].poin.map(p => (
            <div key={p.judul} className="flex items-start gap-2.5 bg-white rounded-xl p-2.5" style={{ border: `1px solid ${BORDER}` }}>
              <div
                className="flex-shrink-0 w-[26px] h-[26px] rounded-lg flex items-center justify-center font-jakarta text-[9px] font-bold text-white"
                style={{ background: '#B91C1C' }}
              >
                {p.judul.slice(0, 2).toUpperCase()}
              </div>
              <div>
                <p className="font-jakarta text-xs font-semibold mb-0.5" style={{ color: TEXT_DARK }}>{p.judul}</p>
                <p className="font-jakarta text-[11px] leading-relaxed" style={{ color: TEXT_MUTED }}>{p.detail}</p>
              </div>
            </div>
          ))}
        </div>
        <div>
          <p className="font-jakarta text-[10px] font-bold tracking-[0.14em] uppercase mb-2" style={{ color: TEXT_MUTED }}>Simbol Limbah B3 yang Wajib Dikenal</p>
          <div className="grid grid-cols-4 gap-1.5">
            {SIMBOL_B3.map(s => (
              <div key={s.kode} className="bg-white rounded-xl p-2 text-center" style={{ border: `1px solid ${BORDER}` }}>
                <div
                  className="w-7 h-7 rounded-lg mx-auto mb-1 flex items-center justify-center font-jakarta text-[8px] font-bold text-white"
                  style={{ background: s.warna }}
                >
                  {s.kode.slice(0, 3)}
                </div>
                <p className="font-jakarta text-[9px] leading-tight" style={{ color: TEXT_DARK }}>{s.nama}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )

  // ─── SLIDE 5: Segregasi Definisi & Tujuan ─────────────────────────────────
  const Slide5Segregasi = () => (
    <div key={slide} className="slide-anim flex flex-col flex-1 overflow-hidden">
      <div ref={innerRef} onScroll={handleScroll} className="no-scrollbar flex-1 overflow-y-auto px-4 py-5 flex flex-col gap-4 max-w-[540px] w-full mx-auto">
        <div>
          <p className="font-jakarta text-[10px] font-bold tracking-[0.16em] uppercase mb-1" style={{ color: PRIMARY_MID }}>Segregasi Limbah</p>
          <h2 className="font-playfair text-[clamp(20px,5vw,28px)] font-bold leading-tight" style={{ color: TEXT_DARK }}>Pemilahan Limbah — Apa &amp; Mengapa?</h2>
        </div>
        <div className="grid grid-cols-1 gap-3">
          <div className="bg-white rounded-xl p-3.5" style={{ border: `1px solid ${BORDER}` }}>
            <p className="font-jakarta text-[10px] font-bold tracking-[0.12em] uppercase mb-1.5" style={{ color: PRIMARY_MID }}>Definisi</p>
            <p className="font-jakarta text-[12px] leading-relaxed" style={{ color: TEXT_MID }}>{SEGREGASI.definisi}</p>
          </div>
          <div className="bg-white rounded-xl p-3.5" style={{ border: `1px solid ${BORDER}` }}>
            <p className="font-jakarta text-[10px] font-bold tracking-[0.12em] uppercase mb-1.5" style={{ color: PRIMARY_MID }}>Tujuan</p>
            <p className="font-jakarta text-[12px] leading-relaxed" style={{ color: TEXT_MID }}>{SEGREGASI.tujuan}</p>
          </div>
        </div>
        <div>
          <p className="font-jakarta text-[10px] font-bold tracking-[0.14em] uppercase mb-2" style={{ color: TEXT_MUTED }}>Prinsip Segregasi</p>
          <div className="flex gap-2">
            {SEGREGASI.prinsip.map(p => (
              <div key={p} className="flex-1 rounded-xl py-2.5 text-center font-jakarta text-xs font-bold text-white" style={{ background: PRIMARY }}>
                {p}
              </div>
            ))}
          </div>
        </div>
        <div>
          <p className="font-jakarta text-[10px] font-bold tracking-[0.14em] uppercase mb-2" style={{ color: TEXT_MUTED }}>Langkah Teknik Pemilahan</p>
          <div className="flex flex-col gap-2">
            {SEGREGASI.teknik.map(t => (
              <div key={t.step} className="flex items-start gap-2.5 bg-white rounded-xl p-2.5" style={{ border: `1px solid ${BORDER}` }}>
                <div className="flex-shrink-0 w-[26px] h-[26px] rounded-lg flex items-center justify-center font-jakarta text-[10px] font-bold text-white" style={{ background: PRIMARY }}>
                  {t.step}
                </div>
                <div>
                  <p className="font-jakarta text-xs font-semibold mb-0.5" style={{ color: TEXT_DARK }}>{t.judul}</p>
                  <p className="font-jakarta text-[11px] leading-relaxed" style={{ color: TEXT_MUTED }}>{t.detail}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )

  // ─── SLIDE 6: Jenis Limbah Non-B3 ─────────────────────────────────────────
  const Slide6NonB3 = () => (
    <div key={slide} className="slide-anim flex flex-col flex-1 overflow-hidden">
      <div ref={innerRef} onScroll={handleScroll} className="no-scrollbar flex-1 overflow-y-auto px-4 py-5 flex flex-col gap-4 max-w-[540px] w-full mx-auto">
        <div>
          <p className="font-jakarta text-[10px] font-bold tracking-[0.16em] uppercase mb-1" style={{ color: PRIMARY_MID }}>Segregasi Limbah</p>
          <h2 className="font-playfair text-[clamp(20px,5vw,28px)] font-bold leading-tight" style={{ color: TEXT_DARK }}>Jenis Limbah Non-B3</h2>
        </div>
        <p className="font-jakarta text-sm leading-relaxed" style={{ color: TEXT_MID }}>
          Limbah Non-B3 adalah limbah yang <strong>tidak berbahaya</strong> dan dapat dikelola melalui proses daur ulang, kompos, atau pembuangan umum.
        </p>
        <div className="flex flex-col gap-2.5">
          {SEGREGASI.nonB3.map(l => (
            <div key={l.no} className="bg-white rounded-xl p-3.5" style={{ border: '1px solid #E5E7EB', borderLeft: `4px solid ${l.warna}` }}>
              <div className="flex items-center gap-2 mb-1">
                <span
                  className="w-5 h-5 rounded-full flex items-center justify-center font-jakarta text-[10px] font-bold text-white flex-shrink-0"
                  style={{ background: l.warna }}
                >
                  {l.no}
                </span>
                <p className="font-jakarta text-xs font-bold" style={{ color: TEXT_DARK }}>{l.nama}</p>
              </div>
              <p className="font-jakarta text-[11px] leading-relaxed pl-7" style={{ color: TEXT_MUTED }}>Contoh: {l.contoh}</p>
            </div>
          ))}
        </div>
        <div className="rounded-xl px-4 py-3" style={{ background: PRIMARY_LIGHT, border: `1px solid ${BORDER}` }}>
          <p className="font-jakarta text-[11px] leading-relaxed text-center" style={{ color: TEXT_DARK }}>
            <strong>Selalu pisahkan</strong> limbah organik, anorganik, dan daur ulang sejak dari sumbernya.
          </p>
        </div>
      </div>
    </div>
  )

  // ─── SLIDE 7: Jenis Limbah B3 ─────────────────────────────────────────────
  const Slide7JenisB3 = () => (
    <div key={slide} className="slide-anim flex flex-col flex-1 overflow-hidden">
      <div ref={innerRef} onScroll={handleScroll} className="no-scrollbar flex-1 overflow-y-auto px-4 py-5 flex flex-col gap-4 max-w-[540px] w-full mx-auto">
        <div>
          <p className="font-jakarta text-[10px] font-bold tracking-[0.16em] uppercase mb-1" style={{ color: '#EF4444' }}>Segregasi Limbah B3</p>
          <h2 className="font-playfair text-[clamp(20px,5vw,28px)] font-bold leading-tight" style={{ color: TEXT_DARK }}>Jenis Limbah B3 di Perusahaan</h2>
        </div>
        <p className="font-jakarta text-sm leading-relaxed" style={{ color: TEXT_MID }}>
          Limbah B3 harus dipisahkan sejak dari sumber dan <strong>tidak boleh dicampur</strong> dengan limbah Non-B3. Penanganan khusus diperlukan sesuai karakteristiknya.
        </p>
        <div className="flex flex-col gap-2.5">
          {SEGREGASI.b3.map(l => (
            <div key={l.no} className="bg-white rounded-xl p-3.5" style={{ border: '1px solid #FEE2E2', borderLeft: `4px solid ${l.warna}` }}>
              <div className="flex items-center gap-2 mb-1">
                <span
                  className="w-5 h-5 rounded-full flex items-center justify-center font-jakarta text-[10px] font-bold text-white flex-shrink-0"
                  style={{ background: l.warna }}
                >
                  {l.no}
                </span>
                <p className="font-jakarta text-xs font-bold" style={{ color: TEXT_DARK }}>{l.nama}</p>
              </div>
              <p className="font-jakarta text-[11px] leading-relaxed pl-7" style={{ color: TEXT_MUTED }}>Contoh: {l.contoh}</p>
            </div>
          ))}
        </div>
        <div className="rounded-xl px-4 py-3" style={{ background: '#FEF2F2', border: '1px solid #FECACA' }}>
          <p className="font-jakarta text-[11px] font-semibold leading-relaxed" style={{ color: '#7F1D1D' }}>
            ⚠ Limbah B3 yang tidak terkelola dengan benar dapat dikenai sanksi hukum sesuai peraturan lingkungan hidup yang berlaku.
          </p>
        </div>
      </div>
    </div>
  )

  // ─── SLIDE 8: Konservasi Air & Energi ─────────────────────────────────────
  const Slide8Konservasi = () => (
    <div key={slide} className="slide-anim flex flex-col flex-1 overflow-hidden">
      <div ref={innerRef} onScroll={handleScroll} className="no-scrollbar flex-1 overflow-y-auto px-4 py-5 flex flex-col gap-4 max-w-[540px] w-full mx-auto">
        <div>
          <p className="font-jakarta text-[10px] font-bold tracking-[0.16em] uppercase mb-1" style={{ color: PRIMARY_MID }}>Konservasi</p>
          <h2 className="font-playfair text-[clamp(20px,5vw,28px)] font-bold leading-tight" style={{ color: TEXT_DARK }}>Air &amp; Energi</h2>
        </div>
        {KONSERVASI.map(k => (
          <div key={k.kode} className="bg-white rounded-2xl overflow-hidden" style={{ border: `1px solid ${BORDER}` }}>
            <div className="px-4 py-3" style={{ background: k.warna }}>
              <p className="font-jakarta text-[10px] font-bold tracking-[0.12em] uppercase text-white/80 mb-0.5">{k.kode === 'KA' ? 'Konservasi Air' : 'Konservasi Energi'}</p>
              <p className="font-playfair text-[18px] font-bold text-white">{k.judul}</p>
            </div>
            <div className="px-4 py-3">
              <p className="font-jakarta text-[11px] leading-relaxed mb-3" style={{ color: TEXT_MID }}>{k.deskripsi}</p>
              <p className="font-jakarta text-[10px] font-bold tracking-[0.12em] uppercase mb-2" style={{ color: TEXT_MUTED }}>Yang Bisa Dilakukan:</p>
              <ul className="flex flex-col gap-1.5">
                {k.aksi.map((a, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="flex-shrink-0 w-1.5 h-1.5 rounded-full mt-[6px]" style={{ background: k.warna }} />
                    <span className="font-jakarta text-[12px] leading-relaxed" style={{ color: TEXT_MID }}>{a}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>
    </div>
  )

  // ─── SLIDE 9: Manajemen Bahan Kimia ───────────────────────────────────────
  const Slide9BahanKimia = () => (
    <div key={slide} className="slide-anim flex flex-col flex-1 overflow-hidden">
      <div ref={innerRef} onScroll={handleScroll} className="no-scrollbar flex-1 overflow-y-auto px-4 py-5 flex flex-col gap-4 max-w-[540px] w-full mx-auto">
        <div>
          <p className="font-jakarta text-[10px] font-bold tracking-[0.16em] uppercase mb-1" style={{ color: PRIMARY_MID }}>Manajemen Bahan Kimia</p>
          <h2 className="font-playfair text-[clamp(20px,5vw,28px)] font-bold leading-tight" style={{ color: TEXT_DARK }}>GHS &amp; Simbol Bahan Kimia</h2>
        </div>
        <div className="bg-white rounded-xl p-3.5" style={{ border: `1px solid ${BORDER}` }}>
          <p className="font-jakarta text-[11px] leading-relaxed" style={{ color: TEXT_MID }}>{MANAJEMEN_KIMIA.definisi}</p>
        </div>
        <div>
          <p className="font-jakarta text-[10px] font-bold tracking-[0.14em] uppercase mb-2" style={{ color: TEXT_MUTED }}>9 Simbol GHS (Globally Harmonized System)</p>
          <div className="grid grid-cols-3 gap-2">
            {MANAJEMEN_KIMIA.ghs.map(g => (
              <div key={g.kode} className="bg-white rounded-xl p-2.5 text-center" style={{ border: `1px solid ${BORDER}` }}>
                <div
                  className="w-8 h-8 rounded-lg mx-auto mb-1.5 flex items-center justify-center font-jakarta text-[8px] font-bold text-white"
                  style={{ background: g.warna }}
                >
                  {g.kode}
                </div>
                <p className="font-jakarta text-[10px] leading-tight" style={{ color: TEXT_DARK }}>{g.nama}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )

  // ─── SLIDE 10: RSL ────────────────────────────────────────────────────────
  const Slide10RSL = () => (
    <div key={slide} className="slide-anim flex flex-col flex-1 overflow-hidden">
      <div ref={innerRef} onScroll={handleScroll} className="no-scrollbar flex-1 overflow-y-auto px-4 py-5 flex flex-col gap-4 max-w-[540px] w-full mx-auto">
        <div>
          <p className="font-jakarta text-[10px] font-bold tracking-[0.16em] uppercase mb-1" style={{ color: PRIMARY_MID }}>Manajemen Bahan Kimia</p>
          <h2 className="font-playfair text-[clamp(20px,5vw,28px)] font-bold leading-tight" style={{ color: TEXT_DARK }}>RSL — Restricted Substance List</h2>
        </div>
        <div className="rounded-2xl overflow-hidden" style={{ border: `1px solid ${BORDER}` }}>
          <div className="px-4 py-3" style={{ background: PRIMARY }}>
            <p className="font-playfair text-[18px] font-bold text-white">Apa itu RSL?</p>
          </div>
          <div className="px-4 py-3 bg-white">
            <p className="font-jakarta text-[12px] leading-relaxed" style={{ color: TEXT_MID }}>{MANAJEMEN_KIMIA.rsl.definisi}</p>
          </div>
        </div>
        <div>
          <p className="font-jakarta text-[10px] font-bold tracking-[0.14em] uppercase mb-2" style={{ color: TEXT_MUTED }}>Mengapa Perlu Dibatasi?</p>
          <div className="grid grid-cols-2 gap-2">
            {MANAJEMEN_KIMIA.rsl.alasan.map((a, i) => (
              <div key={i} className="bg-white rounded-xl px-3 py-2.5 flex items-start gap-2" style={{ border: `1px solid ${BORDER}` }}>
                <span className="flex-shrink-0 w-1.5 h-1.5 rounded-full mt-[6px]" style={{ background: PRIMARY }} />
                <p className="font-jakarta text-[11px] leading-relaxed" style={{ color: TEXT_MID }}>{a}</p>
              </div>
            ))}
          </div>
        </div>
        <div>
          <p className="font-jakarta text-[10px] font-bold tracking-[0.14em] uppercase mb-2" style={{ color: TEXT_MUTED }}>ESG Zinus — Komitmen Lingkungan</p>
          <div className="bg-white rounded-xl p-3.5" style={{ border: `1px solid ${BORDER}` }}>
            <p className="font-jakarta text-[11px] leading-relaxed mb-3" style={{ color: TEXT_MID }}>{ESG.pernyataan}</p>
            <div className="flex flex-col gap-2">
              {ESG.program.map(p => (
                <div key={p.kode} className="flex items-start gap-2.5">
                  <div
                    className="flex-shrink-0 w-[24px] h-[24px] rounded-md flex items-center justify-center font-jakarta text-[8px] font-bold text-white"
                    style={{ background: PRIMARY }}
                  >
                    {p.kode}
                  </div>
                  <div>
                    <p className="font-jakarta text-[11px] font-semibold" style={{ color: TEXT_DARK }}>{p.nama}</p>
                    <p className="font-jakarta text-[10px] leading-relaxed" style={{ color: TEXT_MUTED }}>{p.detail}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )

  // ─── SLIDE 11: Finish ─────────────────────────────────────────────────────
  const Slide11Finish = () => (
    <div
      key={slide}
      className="slide-anim no-scrollbar flex flex-col flex-1 items-center justify-center text-center overflow-y-auto px-5 py-8 gap-4"
      style={{ background: `linear-gradient(160deg, ${TEXT_DARK} 0%, #051A0D 100%)` }}
    >
      <div className="w-14 h-14 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: PRIMARY }}>
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="20 6 9 17 4 12" />
        </svg>
      </div>
      <h2 className="font-playfair text-2xl font-bold" style={{ color: '#6EE7B7' }}>Materi Selesai!</h2>
      <p className="font-jakarta text-[13px] leading-relaxed max-w-[280px]" style={{ color: 'rgba(255,255,255,0.6)' }}>
        {canFinish
          ? 'Kamu sudah membaca semua materi Kesadaran Lingkungan. Saatnya kerjakan Post-Test!'
          : `Kamu sudah membaca ${progress}% materi. Pastikan semua slide sudah dibuka sebelum melanjutkan.`}
      </p>
      <button
        onClick={onSelesai}
        disabled={!canFinish}
        className="font-jakarta font-bold text-sm text-white rounded-xl px-7 py-4 w-full max-w-[280px] mt-1 transition-all"
        style={{
          background: canFinish ? PRIMARY : 'rgba(27,107,58,0.4)',
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

  // ─── SLIDE REGISTRY ───────────────────────────────────────────────────────
  const slides: React.ReactNode[] = [
    <Slide0Cover key="cover" />,
    <Slide1Pendahuluan key="pendahuluan" />,
    <Slide2Dampak key="dampak" />,
    <Slide3LimbahB3 key="limbahb3" />,
    <Slide4PenyimpananB3 key="penyimpananb3" />,
    <Slide5Segregasi key="segregasi" />,
    <Slide6NonB3 key="nonb3" />,
    <Slide7JenisB3 key="jenisb3" />,
    <Slide8Konservasi key="konservasi" />,
    <Slide9BahanKimia key="bahankimia" />,
    <Slide10RSL key="rsl" />,
    <Slide11Finish key="finish" />,
  ]

  // ─── RENDER ───────────────────────────────────────────────────────────────
  return (
    <>
      <style>{minimalCss}</style>
      <div className="font-jakarta flex flex-col min-h-screen" style={{ background: '#F0FDF4' }}>

        {/* ── TOP BAR ── */}
        <div
          className="sticky top-0 z-50 flex items-center justify-between gap-2 bg-white px-3 h-14"
          style={{ borderBottom: `1px solid ${BORDER}` }}
        >
          <div className="flex items-center gap-2.5 flex-shrink-0">
            <img src={logoZinus} alt="Zinus" className="h-7 w-auto object-contain max-w-[80px]" loading="eager" />
            <div className="w-px h-5 flex-shrink-0" style={{ background: BORDER }} />
            <img src={logoHyundai} alt="Hyundai" className="h-7 w-auto object-contain max-w-[80px]" loading="eager" />
          </div>
          <div className="flex-1 min-w-0 max-w-[120px]">
            <div className="h-1 rounded-full overflow-hidden" style={{ background: BORDER }}>
              <div
                className="h-full rounded-full transition-all duration-300"
                style={{ width: `${progress}%`, background: PRIMARY }}
              />
            </div>
            <p className="font-jakarta text-[10px] font-semibold text-right mt-0.5 tracking-wide whitespace-nowrap" style={{ color: PRIMARY }}>
              {progress}% terbaca
            </p>
          </div>
        </div>

        {/* ── SLIDE AREA ── */}
        <div className="flex-1 relative overflow-hidden" style={{ height: 'calc(100dvh - 56px - 68px)' }}>
          {slides[slide]}

          {isScrollableSlide && (
            <div
              className={`bounce-hint absolute left-1/2 z-50 flex items-center gap-2 rounded-full px-3.5 py-2 text-white font-jakarta text-[11px] font-semibold pointer-events-none transition-all duration-300 ${showHint ? 'opacity-100' : 'opacity-0'}`}
              style={{
                bottom: 12,
                transform: 'translateX(-50%)',
                background: 'rgba(12,51,32,0.92)',
                boxShadow: '0 2px 12px rgba(0,0,0,0.18)',
                whiteSpace: 'nowrap',
              }}
            >
              <span
                className="arrow-bounce w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0"
                style={{ background: PRIMARY }}
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
          style={{ borderTop: `1px solid ${BORDER}`, height: 68, paddingBottom: 'env(safe-area-inset-bottom, 0px)' }}
        >
          <button
            onClick={goPrev}
            disabled={slide === 0}
            aria-label="Slide sebelumnya"
            className="flex-shrink-0 w-11 h-11 rounded-full flex items-center justify-center transition-all active:scale-95"
            style={{
              background: slide === 0 ? '#BBF7D0' : PRIMARY,
              boxShadow: slide === 0 ? 'none' : `0 2px 8px rgba(27,107,58,0.35)`,
            }}
          >
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="11,4 6,9 11,14" />
            </svg>
          </button>

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
                  background: slide === i ? PRIMARY : visited.has(i) ? '#6EE7B7' : '#BBF7D0',
                  transform: slide === i ? 'scale(1.5)' : 'scale(1)',
                  minWidth: 8,
                }}
              />
            ))}
          </div>

          <button
            onClick={goNext}
            disabled={slide === TOTAL_SLIDES - 1}
            aria-label="Slide berikutnya"
            className="flex-shrink-0 w-11 h-11 rounded-full flex items-center justify-center transition-all active:scale-95"
            style={{
              background: slide === TOTAL_SLIDES - 1 ? '#BBF7D0' : PRIMARY,
              boxShadow: slide === TOTAL_SLIDES - 1 ? 'none' : `0 2px 8px rgba(27,107,58,0.35)`,
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