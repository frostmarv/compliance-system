import { useState, useEffect, useCallback, useRef } from 'react'
import logoZinus from '@/assets/zinus-tulisan-putih-contour.webp'
import logoHyundai from '@/assets/hyundai-ori-hitam.png'

interface Materi5RProps {
  employeeName?: string
  onSelesai: () => void
}

// ─── DATA ────────────────────────────────────────────────────────────────────

const PILAR = [
  {
    kode: 'S1', nama: 'Ringkas', jepang: 'Seiri', warna: '#329F96',
    tagline: 'Pisahkan yang perlu & tidak perlu',
    deskripsi: 'Memisahkan barang yang diperlukan dari yang tidak diperlukan, lalu menyingkirkan barang yang tidak dibutuhkan dari area kerja.',
    tujuan: [
      'Tidak ada item yang tidak diperlukan di area kerja',
      'Ada pemilahan tegas antara barang DIPERLUKAN dan TIDAK',
      'Tidak ada barang yang berlebihan jumlahnya',
      'Selalu ada upaya menurunkan stok sesuai kebutuhan',
    ],
    manfaat: ['Efisiensi tempat kerja', 'Mempermudah kontrol', 'Mempermudah perawatan'],
    aktivitas: [
      { step: '01', judul: 'Pilah', detail: 'Pisahkan benda yang digunakan dan tidak digunakan' },
      { step: '02', judul: 'Buang', detail: 'Buang benda tidak terpakai setelah mendapat persetujuan penanggung jawab' },
      { step: '03', judul: 'Tentukan Penyimpanan', detail: 'Tentukan lokasi penyimpanan yang memudahkan pemakaian' },
    ],
    tabel: [
      { frek: 'Rendah', contoh: 'Tidak digunakan > 1 tahun', aksi: 'Keluarkan dari area' },
      { frek: 'Sedang', contoh: 'Digunakan 1× per 2–6 bulan', aksi: 'Simpan di area tengah / gudang' },
      { frek: 'Tinggi', contoh: 'Digunakan setiap hari / jam', aksi: 'Simpan di dekat tempat kerja' },
    ],
  },
  {
    kode: 'S2', nama: 'Rapi', jepang: 'Seiton', warna: '#2A7D76',
    tagline: 'Setiap barang punya tempat yang jelas',
    deskripsi: 'Menata dengan rapi barang yang diperlukan sesuai tempatnya, sehingga mudah ditemukan dan diambil kapan pun dibutuhkan.',
    tujuan: [
      'Setiap item & tempat penyimpanan memiliki kode identifikasi jelas',
      'Setiap item selalu tersedia, mudah didapat, dan jelas statusnya',
      'Ada standar aturan penyimpanan yang ditaati seluruh pelaku kerja',
    ],
    manfaat: [
      'Mempercepat pengambilan & pencarian barang',
      'Mengurangi pemborosan gerak dan downtime',
      'Mengurangi risiko kehilangan / kesalahan',
    ],
    aktivitas: [
      { step: '01', judul: 'Pengelompokan', detail: 'Kelompokkan barang berdasarkan fungsi/kategori' },
      { step: '02', judul: 'Siapkan Tempat', detail: 'Tentukan lokasi penyimpanan terbaik' },
      { step: '03', judul: 'Beri Tanda Batas', detail: 'Gunakan garis, warna, atau label pembatas area' },
      { step: '04', judul: 'Beri Pengenal', detail: 'Label nama, kode, dan kuantitas pada setiap item' },
      { step: '05', judul: 'Buat Denah', detail: 'Buat peta/denah penyimpanan sebagai referensi visual' },
    ],
    tabel: [
      { frek: 'Lokasi', contoh: 'Di dekat tempat penggunaan', aksi: 'Efisiensi gerak maksimal' },
      { frek: 'Jumlah', contoh: 'Tentukan level maks & min', aksi: 'Hindari kelebihan/kekurangan stok' },
      { frek: 'Periode', contoh: 'Terapkan aturan FIFO', aksi: 'Indikasi tanggal penyimpanan' },
    ],
  },
  {
    kode: 'S3', nama: 'Resik', jepang: 'Seiso', warna: '#1E6B64',
    tagline: 'Membersihkan = Memeriksa',
    deskripsi: 'Membersihkan area kerja sekaligus memeriksa kondisi peralatan dan lingkungan. Kebersihan adalah bentuk inspeksi aktif.',
    tujuan: [
      'Membersihkan = Memeriksa, dilakukan setiap saat',
      'Lingkungan, alat/mesin, material, dan orang — semuanya dicakup',
      'Menghilangkan atau meminimalisir sumber penyebab kotor',
      'Mengupayakan kondisi optimum di seluruh area',
    ],
    manfaat: [
      'Area kerja menjadi nyaman',
      'Meningkatkan konsentrasi kerja',
      'Menghindari kecelakaan akibat lantai licin',
    ],
    aktivitas: [
      { step: '01', judul: '5–10 Menit Setiap Hari', detail: 'Lakukan Seiso rutin sebelum dan sesudah kerja' },
      { step: '02', judul: 'Pembersihan = Pemeriksaan', detail: 'Temukan minor problem saat proses kebersihan berlangsung' },
      { step: '03', judul: 'Catat Temuan', detail: 'Dokumentasikan masalah kecil sebelum menjadi besar' },
    ],
    tabel: [],
  },
  {
    kode: 'S4', nama: 'Rawat', jepang: 'Seiketsu', warna: '#155955',
    tagline: 'Standarisasi untuk mempertahankan 3R',
    deskripsi: 'Memelihara kondisi Ringkas, Rapi, dan Resik (3R) dengan mempertahankan standarisasi sehingga hasil perbaikan tidak kembali ke kondisi awal.',
    tujuan: [
      'Memudahkan perawatan dengan adanya prosedur langkah-langkah kerja',
      'Menyamakan persepsi agar metode kerja sesuai standar',
      'Memudahkan analisa kondisi abnormal karena ada acuan prosedur',
      'Memudahkan & menyamakan trainer saat penyampaian materi',
    ],
    manfaat: [
      'Keamanan dan kenyamanan tempat kerja terpelihara',
      'Improvement dilakukan terus-menerus dan terarah',
      'Membangkitkan semangat 5R setiap orang',
    ],
    aktivitas: [
      { step: '01', judul: 'Tentukan Standard Normal', detail: 'Tetapkan dengan jelas kondisi normal vs tidak normal di setiap area' },
      { step: '02', judul: 'Terangkan Kunci Perawatan', detail: 'Jika ada abnormalitas, periksa dan catat sebagai poin kontrol' },
      { step: '03', judul: 'Tentukan Metode Pemeriksaan', detail: 'Buat prosedur inspeksi yang dapat diikuti semua orang' },
    ],
    tabel: [],
  },
  {
    kode: 'S5', nama: 'Rajin', jepang: 'Shitsuke', warna: '#0D3D3A',
    tagline: 'Disiplin dari kesadaran, bukan paksaan',
    deskripsi: 'Mematuhi semua aturan 5R dengan penuh kesadaran diri sendiri — bukan karena dipaksa — dan menjadikannya sebagai kebiasaan.',
    tujuan: [
      'Karyawan mematuhi aturan dengan penuh kesadaran, bukan paksaan',
      'Karyawan memiliki moral dan kedisiplinan yang tinggi',
      'Pimpinan memberi contoh langsung dan mensupport aktivitas positif',
      'Menciptakan tempat kerja dimana masalah dapat langsung dikenali',
    ],
    manfaat: [
      'Budaya 5R berjalan otomatis tanpa perlu diingatkan',
      'Tempat kerja terus membaik secara berkesinambungan',
      'Tim yang solid dengan nilai disiplin bersama',
    ],
    aktivitas: [
      { step: '01', judul: 'Pengendalian Visual', detail: 'Ciptakan lingkungan di mana masalah langsung terlihat dan bisa ditangani' },
      { step: '02', judul: 'Terima Kritik Membangun', detail: 'Budayakan memberi dan menerima kritik sebagai dasar langkah 5R' },
      { step: '03', judul: 'Pameran Foto 5R', detail: 'Tampilkan foto sebelum & sesudah 5R sebagai bukti perubahan nyata' },
    ],
    tabel: [],
  },
]

const MASALAH = [
  { icon: '📁', teks: 'Waktu terbuang hanya untuk mencari dokumen di tumpukan file yang tidak teratur' },
  { icon: '🔧', teks: 'Operator mencari-cari parts/tools ketika harus melakukan produksi atau perawatan' },
  { icon: '⚠️', teks: 'Karyawan tidak bekerja maksimum karena lingkungan yang suram dan rawan kecelakaan' },
  { icon: '📦', teks: 'Peningkatan produk tidak terlihat jelas karena pabrik kotor dan inventory yang menumpuk' },
]

const MANFAAT = [
  { kode: 'Q', label: 'Quality', detail: 'Zero defect — kualitas lebih baik, zero customer claim' },
  { kode: 'C', label: 'Cost', detail: 'Zero waste — mengurangi biaya, efisiensi meningkat' },
  { kode: 'D', label: 'Delivery', detail: 'Zero late delivery — memenuhi permintaan tepat waktu' },
  { kode: 'S', label: 'Safety', detail: 'Zero injury — keselamatan kerja lebih baik' },
  { kode: 'M', label: 'Moral', detail: 'Turnover rendah, absensi baik, semangat kerja tinggi' },
]

const TOTAL_SLIDES = 10

// ─── minimal CSS: hanya animasi + scrollbar-hide + ::after pseudo ──────────
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
  .pilar-hero::after {
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

export default function Materi5R({ employeeName, onSelesai }: Materi5RProps) {
  const [slide, setSlide] = useState(0)
  const [visited, setVisited] = useState<Set<number>>(new Set([0]))
  const [showHint, setShowHint] = useState(false)
  const innerRef = useRef<HTMLDivElement>(null)
  const hintTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  // mark visited
  useEffect(() => {
    setVisited(prev => new Set([...prev, slide]))
  }, [slide])

  // on slide change → scroll to top, maybe show hint
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

  // ─── SLIDE 0: Cover ────────────────────────────────────────────────────────
  const Slide0Cover = () => (
    <div
      key={slide}
      className="slide-anim no-scrollbar flex flex-col items-center justify-center text-center overflow-y-auto flex-1 gap-4 px-5 py-8"
      style={{ background: '#329F96' }}
    >
      <p className="font-jakarta text-[10px] font-bold tracking-[0.18em] uppercase text-white/70">
        Materi Training · 5R
      </p>
      <h1 className="font-playfair text-[clamp(32px,9vw,48px)] font-bold text-white leading-[1.1] tracking-tight">
        Mengenal<br />
        <em className="italic" style={{ color: '#C2EDE9' }}>5R</em> di<br />
        Tempat Kerja
      </h1>
      <p className="font-jakarta text-sm text-white/90 leading-relaxed max-w-[300px]">
        {employeeName
          ? `Halo, ${employeeName}! Baca seluruh materi ini sebelum mengerjakan post-test.`
          : 'Pelajari metode 5R untuk tempat kerja yang efisien, aman, dan nyaman.'}
      </p>
      <div className="flex flex-wrap justify-center gap-1.5 mt-1">
        {PILAR.map(p => (
          <span
            key={p.kode}
            className="font-jakarta text-xs font-semibold text-white px-3 py-1 rounded-full"
            style={{ background: 'rgba(255,255,255,0.15)', border: '1px solid rgba(255,255,255,0.25)' }}
          >
            {p.kode} · {p.nama}
          </span>
        ))}
      </div>
    </div>
  )

  // ─── SLIDE 1: Pendahuluan ──────────────────────────────────────────────────
  const Slide1Pendahuluan = () => (
    <div key={slide} className="slide-anim flex flex-col flex-1 overflow-hidden">
      <div ref={innerRef} onScroll={handleScroll} className="no-scrollbar flex-1 overflow-y-auto px-4 py-5 flex flex-col gap-4 max-w-[540px] w-full mx-auto">
        <div>
          <p className="font-jakarta text-[10px] font-bold tracking-[0.16em] uppercase mb-1" style={{ color: '#329F96' }}>Pendahuluan</p>
          <h2 className="font-playfair text-[clamp(20px,5vw,28px)] font-bold leading-tight" style={{ color: '#0D3D3A' }}>Mengapa 5R Penting?</h2>
        </div>
        <p className="font-jakarta text-sm leading-relaxed" style={{ color: '#2D5C58' }}>
          5R adalah metode pengelolaan tempat kerja yang melibatkan <strong>semua orang</strong> di area kerja.
          5R menjadi dasar penting dalam aktivitas perbaikan dan menciptakan <strong>budaya disiplin</strong> melalui rantai perubahan:
        </p>
        <div className="flex flex-wrap gap-1 items-center rounded-xl px-3 py-2.5" style={{ background: '#0D3D3A' }}>
          {['Tempat Kerja','→','Perilaku','→','Kebiasaan','→','Sikap','→','Budaya'].map((t, i) => (
            <span key={i} className={`font-jakarta text-[11px] px-1 py-0.5 ${t==='→' ? 'text-white/35' : 'font-semibold'}`} style={t!=='→' ? { color: '#C2EDE9' } : {}}>
              {t}
            </span>
          ))}
        </div>
        <div className="bg-white rounded-xl border p-4 text-center" style={{ borderColor: '#D4EDE9' }}>
          <p className="font-jakarta text-xs mb-2" style={{ color: '#5A8A86' }}>5R terdiri dari 5 Pilar</p>
          <div className="flex flex-wrap justify-center gap-1.5">
            {PILAR.map((p, i) => (
              <span key={p.kode} className="font-jakarta text-xs font-bold px-2.5 py-1 rounded-lg" style={{ background: `rgba(50,159,150,${0.12 + i * 0.12})`, color: '#0D3D3A' }}>
                {p.kode} {p.nama}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  )

  // ─── SLIDE 2: Masalah ──────────────────────────────────────────────────────
  const Slide2Masalah = () => (
    <div key={slide} className="slide-anim flex flex-col flex-1 overflow-hidden">
      <div ref={innerRef} onScroll={handleScroll} className="no-scrollbar flex-1 overflow-y-auto px-4 py-5 flex flex-col gap-4 max-w-[540px] w-full mx-auto">
        <div>
          <p className="font-jakarta text-[10px] font-bold tracking-[0.16em] uppercase mb-1" style={{ color: '#329F96' }}>Tanpa 5R</p>
          <h2 className="font-playfair text-[clamp(20px,5vw,28px)] font-bold leading-tight" style={{ color: '#0D3D3A' }}>Masalah yang Terjadi</h2>
        </div>
        <div className="grid grid-cols-2 gap-2.5">
          {MASALAH.map((m, i) => (
            <div key={i} className="bg-white rounded-xl p-3" style={{ border: '1px solid #D4EDE9', borderLeft: '3px solid #329F96' }}>
              <span className="text-lg mb-1.5 block">{m.icon}</span>
              <p className="font-jakarta text-[11px] leading-relaxed" style={{ color: '#2D5C58' }}>{m.teks}</p>
            </div>
          ))}
        </div>
        <div className="flex items-center justify-center gap-2 flex-wrap rounded-xl px-4 py-3 text-white font-jakarta text-xs font-semibold" style={{ background: '#0D3D3A' }}>
          <span>Semua masalah ini dapat diselesaikan dengan</span>
          <span className="px-2.5 py-0.5 rounded-md text-xs font-bold text-white" style={{ background: '#329F96' }}>5R</span>
        </div>
      </div>
    </div>
  )

  // ─── SLIDE 3: Manfaat ─────────────────────────────────────────────────────
  const Slide3Manfaat = () => (
    <div key={slide} className="slide-anim flex flex-col flex-1 overflow-hidden">
      <div ref={innerRef} onScroll={handleScroll} className="no-scrollbar flex-1 overflow-y-auto px-4 py-5 flex flex-col gap-4 max-w-[540px] w-full mx-auto">
        <div>
          <p className="font-jakarta text-[10px] font-bold tracking-[0.16em] uppercase mb-1" style={{ color: '#329F96' }}>Manfaat Penerapan</p>
          <h2 className="font-playfair text-[clamp(20px,5vw,28px)] font-bold leading-tight" style={{ color: '#0D3D3A' }}>Dampak 5R pada Kinerja</h2>
        </div>
        <div className="grid grid-cols-2 gap-2.5">
          {MANFAAT.map((m, i) => (
            <div
              key={m.kode}
              className={`bg-white rounded-xl p-3 text-center${i === 4 ? ' col-span-2 max-w-[180px] mx-auto w-full' : ''}`}
              style={{ border: '1px solid #D4EDE9' }}
            >
              <div className="w-9 h-9 rounded-full flex items-center justify-center font-playfair text-base font-bold text-white mx-auto mb-2" style={{ background: '#329F96' }}>
                {m.kode}
              </div>
              <div className="font-jakarta text-[11px] font-bold mb-1" style={{ color: '#0D3D3A' }}>{m.label}</div>
              <div className="font-jakarta text-[10px] leading-relaxed" style={{ color: '#5A8A86' }}>{m.detail}</div>
            </div>
          ))}
        </div>
        <p className="font-jakarta text-xs text-center leading-relaxed" style={{ color: '#2D5C58' }}>
          Penerapan 5R yang konsisten menghasilkan lingkungan kerja yang lebih aman, efisien, dan produktif.
        </p>
      </div>
    </div>
  )

  // ─── SLIDE 4–8: Pilar ─────────────────────────────────────────────────────
  const SlidePilar = ({ pilar, idx }: { pilar: typeof PILAR[0]; idx: number }) => (
    <div key={`${slide}-${pilar.kode}`} className="slide-anim flex flex-col flex-1 overflow-hidden">
      <div ref={innerRef} onScroll={handleScroll} className="no-scrollbar flex-1 overflow-y-auto px-4 py-5 flex flex-col gap-4 max-w-[540px] w-full mx-auto">

        {/* ── PILAR HERO — nama besar dengan background warna + ghost kode ── */}
        <div
          className="pilar-hero relative rounded-2xl overflow-hidden px-4 py-5 text-white"
          data-kode={pilar.kode}
          style={{ background: pilar.warna }}
        >
          <p className="font-jakarta text-[10px] font-bold tracking-[0.14em] uppercase text-white/75 mb-1">
            {pilar.kode} · {pilar.jepang} · Pilar {idx + 1} dari 5
          </p>
          <p className="font-playfair text-[32px] font-bold leading-none mb-1.5">{pilar.nama}</p>
          <p className="font-jakarta text-[13px] text-white/90">{pilar.tagline}</p>
        </div>

        {/* Deskripsi */}
        <p className="font-jakarta text-sm leading-relaxed" style={{ color: '#2D5C58' }}>{pilar.deskripsi}</p>

        <div className="h-px" style={{ background: '#E6F3F2' }} />

        {/* Tujuan */}
        <div>
          <p className="font-jakarta text-[10px] font-bold tracking-[0.14em] uppercase mb-2" style={{ color: '#5A8A86' }}>Tujuan</p>
          <ul className="flex flex-col gap-2">
            {pilar.tujuan.map((t, i) => (
              <li key={i} className="flex items-start gap-2">
                <span className="flex-shrink-0 w-1.5 h-1.5 rounded-full mt-[6px]" style={{ background: pilar.warna }} />
                <span className="font-jakarta text-[13px] leading-relaxed" style={{ color: '#2D5C58' }}>{t}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Manfaat */}
        <div>
          <p className="font-jakarta text-[10px] font-bold tracking-[0.14em] uppercase mb-2" style={{ color: '#5A8A86' }}>Manfaat</p>
          <ul className="flex flex-col gap-2">
            {pilar.manfaat.map((m, i) => (
              <li key={i} className="flex items-start gap-2">
                <span className="flex-shrink-0 w-1.5 h-1.5 rounded-full mt-[6px]" style={{ background: pilar.warna }} />
                <span className="font-jakarta text-[13px] leading-relaxed" style={{ color: '#2D5C58' }}>{m}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Aktivitas */}
        <div>
          <p className="font-jakarta text-[10px] font-bold tracking-[0.14em] uppercase mb-2" style={{ color: '#5A8A86' }}>Langkah Aktivitas</p>
          <div className="flex flex-col gap-2">
            {pilar.aktivitas.map(a => (
              <div key={a.step} className="flex items-start gap-2.5 bg-white rounded-xl p-2.5" style={{ border: '1px solid #D4EDE9' }}>
                <div
                  className="flex-shrink-0 w-[26px] h-[26px] rounded-lg flex items-center justify-center font-jakarta text-[10px] font-bold text-white"
                  style={{ background: pilar.warna }}
                >
                  {a.step}
                </div>
                <div>
                  <p className="font-jakarta text-xs font-semibold mb-0.5" style={{ color: '#0D3D3A' }}>{a.judul}</p>
                  <p className="font-jakarta text-[11px] leading-relaxed" style={{ color: '#5A8A86' }}>{a.detail}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Tabel */}
        {pilar.tabel.length > 0 && (
          <div>
            <p className="font-jakarta text-[10px] font-bold tracking-[0.14em] uppercase mb-2" style={{ color: '#5A8A86' }}>Panduan Pelaksanaan</p>
            <div className="overflow-x-auto rounded-xl" style={{ border: '1px solid #D4EDE9' }}>
              <table className="w-full border-collapse text-[11px]" style={{ minWidth: 280 }}>
                <thead>
                  <tr>
                    {['Kategori','Kondisi','Tindakan'].map((h, i) => (
                      <th
                        key={h}
                        className="font-jakarta text-[9px] font-bold tracking-[0.08em] uppercase text-left px-2 py-2"
                        style={{
                          background: '#0D3D3A', color: '#C2EDE9',
                          borderRadius: i === 0 ? '9px 0 0 0' : i === 2 ? '0 9px 0 0' : undefined,
                        }}
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {pilar.tabel.map((row, i) => (
                    <tr key={i}>
                      <td className="font-jakarta px-2 py-2 font-semibold" style={{ color: '#2D5C58', background: i % 2 === 0 ? '#F7FFFE' : undefined, borderBottom: i < pilar.tabel.length-1 ? '1px solid #E6F3F2' : undefined }}>{row.frek}</td>
                      <td className="font-jakarta px-2 py-2" style={{ color: '#2D5C58', background: i % 2 === 0 ? '#F7FFFE' : undefined, borderBottom: i < pilar.tabel.length-1 ? '1px solid #E6F3F2' : undefined }}>{row.contoh}</td>
                      <td className="font-jakarta px-2 py-2" style={{ color: '#2D5C58', background: i % 2 === 0 ? '#F7FFFE' : undefined, borderBottom: i < pilar.tabel.length-1 ? '1px solid #E6F3F2' : undefined }}>{row.aksi}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  )

  // ─── SLIDE 9: Finish ──────────────────────────────────────────────────────
  const Slide9Finish = () => (
    <div
      key={slide}
      className="slide-anim no-scrollbar flex flex-col flex-1 items-center justify-center text-center overflow-y-auto px-5 py-8 gap-4"
      style={{ background: '#0D3D3A' }}
    >
      <div className="w-14 h-14 rounded-full flex items-center justify-center text-2xl flex-shrink-0" style={{ background: '#329F96' }}>✓</div>
      <h2 className="font-playfair text-2xl font-bold" style={{ color: '#C2EDE9' }}>Materi Selesai!</h2>
      <p className="font-jakarta text-[13px] leading-relaxed max-w-[280px]" style={{ color: 'rgba(255,255,255,0.6)' }}>
        {canFinish
          ? 'Kamu sudah membaca semua materi 5R. Saatnya kerjakan Post-Test!'
          : `Kamu sudah membaca ${progress}% materi. Pastikan semua slide sudah dibuka sebelum melanjutkan.`}
      </p>
      <button
        onClick={onSelesai}
        disabled={!canFinish}
        className="font-jakarta font-bold text-sm text-white rounded-xl px-7 py-4 w-full max-w-[280px] mt-1 transition-all"
        style={{
          background: canFinish ? '#329F96' : 'rgba(50,159,150,0.4)',
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

  // ─── SLIDE REGISTRY ──────────────────────────────────────────────────────
  const slides: React.ReactNode[] = [
    <Slide0Cover key="cover" />,
    <Slide1Pendahuluan key="pendahuluan" />,
    <Slide2Masalah key="masalah" />,
    <Slide3Manfaat key="manfaat" />,
    ...PILAR.map((p, i) => <SlidePilar key={p.kode} pilar={p} idx={i} />),
    <Slide9Finish key="finish" />,
  ]

  // ─── RENDER ───────────────────────────────────────────────────────────────
  return (
    <>
      <style>{minimalCss}</style>
      <div className="font-jakarta flex flex-col min-h-screen" style={{ background: '#F0FAF9' }}>

        {/* ── TOP BAR ── */}
        <div
          className="sticky top-0 z-50 flex items-center justify-between gap-2 bg-white px-3 h-14"
          style={{ borderBottom: '1px solid #D4EDE9' }}
        >
          {/* Logos */}
          <div className="flex items-center gap-2.5 flex-shrink-0">
            <img src={logoZinus} alt="Zinus" className="h-7 w-auto object-contain max-w-[80px]" loading="eager" />
            <div className="w-px h-5 flex-shrink-0" style={{ background: '#D4EDE9' }} />
            <img src={logoHyundai} alt="Hyundai" className="h-7 w-auto object-contain max-w-[80px]" loading="eager" />
          </div>
          {/* Progress */}
          <div className="flex-1 min-w-0 max-w-[120px]">
            <div className="h-1 rounded-full overflow-hidden" style={{ background: '#D4EDE9' }}>
              <div
                className="h-full rounded-full transition-all duration-300"
                style={{ width: `${progress}%`, background: '#329F96' }}
              />
            </div>
            <p className="font-jakarta text-[10px] font-semibold text-right mt-0.5 tracking-wide whitespace-nowrap" style={{ color: '#329F96' }}>
              {progress}% terbaca
            </p>
          </div>
        </div>

        {/* ── SLIDE AREA ── */}
        <div className="flex-1 relative overflow-hidden" style={{ height: 'calc(100dvh - 56px - 68px)' }}>
          {slides[slide]}

          {/* Scroll hint popup */}
          {isScrollableSlide && (
            <div
              className={`bounce-hint absolute left-1/2 z-50 flex items-center gap-2 rounded-full px-3.5 py-2 text-white font-jakarta text-[11px] font-semibold pointer-events-none transition-all duration-300 ${showHint ? 'opacity-100' : 'opacity-0'}`}
              style={{
                bottom: 12,
                transform: 'translateX(-50%)',
                background: 'rgba(13,61,58,0.92)',
                boxShadow: '0 2px 12px rgba(0,0,0,0.18)',
                whiteSpace: 'nowrap',
              }}
            >
              {/* Arrow circle */}
              <span
                className="arrow-bounce w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0"
                style={{ background: '#329F96' }}
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
          style={{ borderTop: '1px solid #D4EDE9', height: 68, paddingBottom: 'env(safe-area-inset-bottom, 0px)' }}
        >
          {/* PREV — solid teal circle */}
          <button
            onClick={goPrev}
            disabled={slide === 0}
            aria-label="Slide sebelumnya"
            className="flex-shrink-0 w-11 h-11 rounded-full flex items-center justify-center transition-all active:scale-95"
            style={{
              background: slide === 0 ? '#C8E6E4' : '#329F96',
              boxShadow: slide === 0 ? 'none' : '0 2px 8px rgba(50,159,150,0.35)',
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
                  background: slide === i ? '#329F96' : visited.has(i) ? '#9CCEC9' : '#C8E6E4',
                  transform: slide === i ? 'scale(1.5)' : 'scale(1)',
                  minWidth: 8,
                }}
              />
            ))}
          </div>

          {/* NEXT — solid teal circle */}
          <button
            onClick={goNext}
            disabled={slide === TOTAL_SLIDES - 1}
            aria-label="Slide berikutnya"
            className="flex-shrink-0 w-11 h-11 rounded-full flex items-center justify-center transition-all active:scale-95"
            style={{
              background: slide === TOTAL_SLIDES - 1 ? '#C8E6E4' : '#329F96',
              boxShadow: slide === TOTAL_SLIDES - 1 ? 'none' : '0 2px 8px rgba(50,159,150,0.35)',
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