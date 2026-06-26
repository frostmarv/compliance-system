import { useState, useEffect, useCallback, useRef } from 'react'
import logoZinus from '@/assets/zinus-tulisan-putih-contour.webp'
import logoHyundai from '@/assets/hyundai-ori-hitam.png'

// ─── FOTO MATERI (silakan upload file dengan nama-nama berikut) ───────────────
// Letakkan semua foto di: src/assets/images/materi/lingkungan/
import fotoLimbahPadat from '@/assets/images/materi/lingkungan/limbah-padat.webp'
import fotoLimbahCair from '@/assets/images/materi/lingkungan/limbah-cair.webp'
import fotoAirBersih from '@/assets/images/materi/lingkungan/air-bersih.webp'
import fotoLimbahB3 from '@/assets/images/materi/lingkungan/limbah-b3.webp'
import fotoEmisiUdara from '@/assets/images/materi/lingkungan/emisi-udara.webp'
import fotoPencemaranSungai from '@/assets/images/materi/lingkungan/pencemaran-sungai.webp'
import fotoIspa from '@/assets/images/materi/lingkungan/ispa.webp'
import fotoPencemaranTanah from '@/assets/images/materi/lingkungan/pencemaran-tanah.webp'
import fotoLabelLimbahB3 from '@/assets/images/materi/lingkungan/label-limbah-b3.webp'
import fotoImplementasiKemasanB3 from '@/assets/images/materi/lingkungan/implementasi-kemasan-b3.webp'
import fotoJarakPenyimpananB3 from '@/assets/images/materi/lingkungan/jarak-penyimpanan-b3.webp'
import fotoApd from '@/assets/images/materi/lingkungan/apd.webp'
import fotoKonservasiAir from '@/assets/images/materi/lingkungan/konservasi-air.webp'
import fotoLimbahCairDampak from '@/assets/images/materi/lingkungan/limbah-cair-dampak.webp'
import fotoSegregasiTempatSampah from '@/assets/images/materi/lingkungan/segregasi-tempat-sampah.webp'
import fotoEsgLingkungan from '@/assets/images/materi/lingkungan/esg-lingkungan.webp'
import fotoGhsBahanKimia from '@/assets/images/materi/lingkungan/ghs-bahan-kimia.webp'

interface MateriLingkunganProps {
  employeeName?: string
  onSelesai: () => void
}

// ─── TYPES ──────────────────────────────────────────────────────────────────

type Block =
  | { type: 'list'; title?: string; items: string[] }
  | { type: 'steps'; title?: string; items: { step: string; judul: string; detail: string }[] }
  | { type: 'cards'; title?: string; items: { icon?: string; judul: string; detail: string }[] }
  | { type: 'image'; src: string; alt: string; caption?: string }
  | { type: 'colorgrid'; title?: string; items: { warna: string; judul: string; sub: string; contoh: string }[] }
  | { type: 'badges'; title?: string; items: string[] }

interface Topik {
  kode: string
  nama: string
  warna: string
  tagline: string
  deskripsi: string
  blocks: Block[]
}

// ─── DATA: RUANG LINGKUP (Slide 1) ─────────────────────────────────────────

const RUANG_LINGKUP = [
  { label: 'Limbah Padat', img: fotoLimbahPadat },
  { label: 'Limbah Cair', img: fotoLimbahCair },
  { label: 'Air Bersih', img: fotoAirBersih },
  { label: 'Limbah B3', img: fotoLimbahB3 },
  { label: 'Emisi Udara', img: fotoEmisiUdara },
]

// ─── DATA: MENGAPA HARUS DIKELOLA (Slide 2) ────────────────────────────────

const MASALAH = [
  {
    img: fotoPencemaranSungai,
    judul: 'Pencemaran Sungai',
    teks: 'Sungai yang tercemar limbah menyebabkan kualitas air menurun dan menjadi keruh, berbau, hingga sulit dikembalikan ke kondisi semula.',
  },
  {
    img: fotoIspa,
    judul: 'ISPA',
    teks: 'Udara sekitar yang tercemar emisi berdampak pada kesehatan pernapasan, salah satunya Infeksi Saluran Pernapasan Akut (ISPA).',
  },
  {
    img: fotoPencemaranTanah,
    judul: 'Pencemaran Tanah',
    teks: 'Limbah yang tercemar pada tanah berdampak buruk pada tanaman, sayur, dan buah yang ditanam di area tersebut.',
  },
]

// ─── DATA: 7 TOPIK UTAMA (Slide 3–9) ───────────────────────────────────────

const TOPIK: Topik[] = [
  {
    kode: 'L1',
    nama: 'Limbah B3',
    warna: '#3E8E5B',
    tagline: 'Kenali, kelola, dan simpan dengan aman',
    deskripsi:
      'Limbah B3 adalah sisa kegiatan (padat atau cair) yang karena sifat dan jumlahnya — baik langsung maupun tidak langsung — dapat membahayakan lingkungan dan makhluk hidup. Maksimal masa penyimpanan Limbah B3 adalah 3 bulan (90 hari) sesuai izin TPS Limbah B3.',
    blocks: [
      {
        type: 'list',
        title: 'Karakteristik Limbah',
        items: [
          'Sifat Fisik — berat jenis (densitas) dan wujud (padat, cair, atau gas)',
          'Sifat Kimia — tingkat keasaman (pH) dan kandungan zat kimia berbahaya',
          'Sifat Biologis — kehadiran mikroorganisme yang memengaruhi dekomposisi',
          'Sifat Termal — kemampuan menghantarkan panas',
          'Sifat Radioaktif — kemampuan memancarkan radiasi',
          'Sifat Toksisitas — tingkat racun bagi makhluk hidup',
          'Sifat Eksplosif & Reaktif — potensi meledak atau bereaksi berbahaya',
          'Sifat Biodegradabilitas — kemampuan terurai oleh organisme hidup',
          'Sifat Estetika — bau, warna, dan rasa yang ditimbulkan',
        ],
      },
      {
        type: 'steps',
        title: 'Syarat Pengemasan',
        items: [
          { step: '01', judul: 'Material Sesuai', detail: 'Kemasan terbuat dari bahan yang sesuai karakteristik Limbah B3 yang disimpan' },
          { step: '02', judul: 'Tertutup Rapat', detail: 'Memiliki penutup yang mencegah kebocoran/tumpahan saat penyimpanan & pengangkutan' },
          { step: '03', judul: 'Tidak Rusak', detail: 'Kemasan dalam keadaan tidak bocor, tidak berkarat, dan tidak rusak' },
          { step: '04', judul: 'Kapasitas Aman', detail: 'Mampu menampung Limbah B3 agar tetap berada di dalam kemasan' },
        ],
      },
      {
        type: 'list',
        title: 'Persyaratan Pengumpulan',
        items: [
          'Limbah B3 dari sumber tidak spesifik',
          'Limbah B3 dari bahan kimia kadaluwarsa, tumpahan, bekas kemasan, dan produk gagal spesifikasi',
          'Limbah B3 dari sumber spesifik (sumber spesifik umum & khusus)',
        ],
      },
      {
        type: 'list',
        title: 'Aturan Penyimpanan',
        items: [
          'Sesuai dengan jenis limbah yang tercantum dalam Izin TPS Limbah B3',
          'Dilakukan di atas permukaan tanah',
          'Area bebas dari bahaya kebakaran, banjir, dan tumpahan',
          'Wadah harus compatible — tidak bereaksi dengan limbah yang disimpan',
          'Seluruh limbah yang disimpan diberi simbol dan label',
        ],
      },
      {
        type: 'image',
        src: fotoLabelLimbahB3,
        alt: 'Contoh label limbah B3',
        caption: 'Contoh label Limbah B3 — wajib dicantumkan pada setiap kemasan',
      },
      {
        type: 'badges',
        title: 'Simbol Limbah B3',
        items: [
          'Mudah Meledak', 'Pengoksidasi', 'Sangat Mudah Menyala', 'Mudah Menyala',
          'Amat Sangat Beracun', 'Sangat Beracun', 'Beracun', 'Berbahaya',
          'Korosif', 'Bersifat Iritasi', 'Berbahaya bagi Lingkungan',
          'Karsinogenik', 'Teratogenik', 'Mutagenik',
        ],
      },
      {
        type: 'image',
        src: fotoImplementasiKemasanB3,
        alt: 'Implementasi kemasan limbah B3',
        caption: 'Implementasi kemasan Limbah B3 sesuai standar',
      },
      {
        type: 'image',
        src: fotoJarakPenyimpananB3,
        alt: 'Jarak penyimpanan limbah B3',
        caption: 'Jarak penyimpanan antar kemasan Limbah B3',
      },
      {
        type: 'list',
        title: 'Pengurangan Limbah B3',
        items: [
          'Substitusi bahan — mengganti bahan baku/penolong B3 menjadi non-B3',
          'Modifikasi proses (rekayasa engineering) — penerapan produksi bersih',
          'Penggunaan teknologi ramah lingkungan',
        ],
      },
      {
        type: 'image',
        src: fotoApd,
        alt: 'Alat Pelindung Diri',
        caption: 'Wajib gunakan APD (Alat Pelindung Diri) saat menangani Limbah B3',
      },
    ],
  },
  {
    kode: 'L2',
    nama: '3R Pengelolaan Limbah',
    warna: '#2F7D52',
    tagline: 'Reduce, Reuse, Recycle — budayakan setiap hari',
    deskripsi:
      'Upaya pengelolaan limbah dilakukan melalui prinsip 3R agar limbah yang dihasilkan dapat dikurangi, dimanfaatkan kembali, dan diolah menjadi sesuatu yang lebih bernilai sebelum akhirnya dibuang.',
    blocks: [
      {
        type: 'cards',
        title: 'Budaya 3R',
        items: [
          { icon: '♻️', judul: 'Reduce', detail: 'Mengurangi limbah yang dihasilkan dari awal proses kerja' },
          { icon: '🔁', judul: 'Reuse', detail: 'Menggunakan kembali barang yang masih bisa dimanfaatkan' },
          { icon: '🔄', judul: 'Recycle', detail: 'Mengolah kembali limbah menjadi produk yang bermanfaat' },
        ],
      },
      {
        type: 'steps',
        title: 'Contoh Implementasi',
        items: [
          { step: '01', judul: 'Reduce', detail: 'Menggunakan kemasan kerja-ulang yang bisa digunakan berkali-kali' },
          { step: '02', judul: 'Reuse', detail: 'Memanfaatkan kembali barang/material yang masih layak pakai' },
          { step: '03', judul: 'Recycle', detail: 'Mengolah kembali limbah plastik & bahan baku menjadi produk baru' },
        ],
      },
    ],
  },
  {
    kode: 'L3',
    nama: 'Konservasi Air & Energi',
    warna: '#2C6E6E',
    tagline: 'Hemat sumber daya, jaga masa depan',
    deskripsi:
      'Konservasi air adalah upaya memelihara keberadaan, sifat, dan fungsi sumber daya air agar tetap tersedia dalam kuantitas dan kualitas yang memadai, baik untuk kebutuhan saat ini maupun masa depan. Konservasi energi adalah upaya mengurangi penggunaan energi tak terbarukan sekaligus mengoptimalkan energi terbarukan, sebagai bagian dari upaya menekan dampak perubahan iklim.',
    blocks: [
      {
        type: 'image',
        src: fotoKonservasiAir,
        alt: 'Konservasi air',
        caption: 'Gunakan air secukupnya dan segera laporkan kebocoran',
      },
      {
        type: 'list',
        title: 'Cara Konservasi Air',
        items: [
          'Matikan keran air saat tidak digunakan',
          'Laporkan jika terjadi kebocoran kran atau pipa',
          'Manfaatkan air seefisien mungkin sesuai kebutuhan',
          'Catat penggunaan air secara berkala',
        ],
      },
      {
        type: 'cards',
        title: 'Hemat Energi, Yuk!',
        items: [
          { icon: '💡', judul: 'Matikan Lampu', detail: 'Matikan lampu yang tidak digunakan' },
          { icon: '🔌', judul: 'Cabut Charger', detail: 'Cabut charger setelah selesai mengisi daya' },
          { icon: '⚙️', judul: 'Matikan Mesin', detail: 'Matikan mesin/peralatan saat tidak dipakai' },
          { icon: '🔋', judul: 'Gunakan Seperlunya', detail: 'Gunakan peralatan listrik sesuai kebutuhan saja' },
        ],
      },
    ],
  },
  {
    kode: 'L4',
    nama: 'Limbah Cair',
    warna: '#1F6B49',
    tagline: 'Kelola sebelum dibuang ke lingkungan',
    deskripsi:
      'Limbah cair (waste water) adalah sisa dari suatu proses produksi dan operasional yang berwujud cair.',
    blocks: [
      {
        type: 'image',
        src: fotoLimbahCairDampak,
        alt: 'Dampak limbah cair pada sungai',
        caption: 'Sungai yang tercemar limbah cair sulit dikembalikan ke kondisi semula',
      },
      {
        type: 'list',
        title: 'Mengapa Harus Dikelola Sebelum Dibuang',
        items: [
          'Dapat merusak ekosistem air sehingga mengancam kelangsungan sungai',
          'Sungai yang tercemar limbah cair menjadi sulit dikembalikan bersih',
          'Dapat menimbulkan gangguan kesehatan dan berbagai penyakit',
        ],
      },
    ],
  },
  {
    kode: 'L5',
    nama: 'Segregasi Limbah',
    warna: '#4C9A6B',
    tagline: 'Pilah dari sumber, kelola lebih efisien',
    deskripsi:
      'Segregasi limbah adalah upaya pemilahan limbah yang dihasilkan, dimulai dari hulu (produksi) hingga hilir (tempat pembuangan akhir), sesuai jenis dan karakteristiknya — agar proses pengolahan menjadi lebih tepat guna.',
    blocks: [
      {
        type: 'list',
        title: 'Tujuan Segregasi Limbah',
        items: [
          'Mengidentifikasi jenis sampah',
          'Memisahkan berdasarkan sifat dan komposisi',
          'Menjalankan prinsip 3R (Reduce, Reuse, Recycle)',
          'Menggunakan tempat penyimpanan yang sesuai',
          'Menumbuhkan kesadaran lingkungan',
        ],
      },
      {
        type: 'image',
        src: fotoSegregasiTempatSampah,
        alt: 'Tempat sampah berwarna',
        caption: 'Gunakan tempat sampah berwarna sesuai kategori limbah',
      },
      {
        type: 'colorgrid',
        title: '5 Kategori Sampah',
        items: [
          { warna: '#C0392B', judul: 'Sampah B3', sub: 'Warna Merah', contoh: 'Baterai, lampu, oli bekas, obat kadaluwarsa, limbah elektronik' },
          { warna: '#27AE60', judul: 'Sampah Organik', sub: 'Warna Hijau', contoh: 'Sisa makanan, sayur, dan buah dari area kantin/dapur' },
          { warna: '#F1C40F', judul: 'Sampah Guna Ulang', sub: 'Warna Kuning', contoh: 'Kemasan bahan kimia kosong, kain majun, barang bernilai guna' },
          { warna: '#2980B9', judul: 'Sampah Daur Ulang', sub: 'Warna Biru', contoh: 'Kardus, kertas, plastik, kaleng, dan logam' },
          { warna: '#7F8C8D', judul: 'Sampah Residu', sub: 'Warna Abu-abu', contoh: 'Pembalut wanita, popok bayi, puntung rokok, permen karet' },
        ],
      },
      {
        type: 'list',
        title: 'Teknik Pemilahan Sampah',
        items: [
          'Sediakan tempat sampah yang memadai di setiap area',
          'Beri label yang jelas pada setiap tempat sampah',
          'Gunakan tempat sampah berwarna sesuai kategori limbah',
        ],
      },
    ],
  },
  {
    kode: 'L6',
    nama: 'Strategi & ESG',
    warna: '#1F5A52',
    tagline: 'Komitmen Zinus untuk planet masa depan',
    deskripsi:
      'Zinus senantiasa memperhatikan keberlanjutan lingkungan demi memastikan masa depan planet, melalui perbaikan berkelanjutan seperti desain kemasan ramah lingkungan, pemasangan energi terbarukan, dan penggunaan kembali scrap foam menjadi produk visco-latex.',
    blocks: [
      {
        type: 'image',
        src: fotoEsgLingkungan,
        alt: 'Program lingkungan Zinus',
        caption: 'Inisiatif lingkungan Zinus — green packaging, energi terbarukan, daur ulang scrap foam',
      },
      {
        type: 'list',
        title: 'Fokus Program Lingkungan',
        items: [
          'Penanganan perubahan iklim dan masalah lingkungan utama',
          'Pengelolaan residu dan pemanfaatan peluang lingkungan',
          'Pelestarian lingkungan hidup dan keanekaragaman hayati',
          'Kontribusi sosial untuk lingkungan sekitar perusahaan',
          'Partisipasi aktif dalam proyek/inisiatif ramah lingkungan',
        ],
      },
    ],
  },
  {
    kode: 'L7',
    nama: 'Manajemen Bahan Kimia',
    warna: '#13433D',
    tagline: 'Kendalikan bahan kimia, lindungi semua orang',
    deskripsi:
      'Manajemen bahan kimia adalah upaya memastikan seluruh pengelolaan bahan kimia di perusahaan terkendali, sehingga tidak menimbulkan bahaya bagi karyawan maupun lingkungan.',
    blocks: [
      {
        type: 'cards',
        title: 'Bagaimana Caranya?',
        items: [
          { icon: '📋', judul: 'Sediakan MSDS', detail: 'MSDS tersedia di setiap area penyimpanan bahan kimia' },
          { icon: '🧤', judul: 'Gunakan APD', detail: 'Gunakan APD yang sesuai saat menangani bahan kimia' },
          { icon: '🚫', judul: 'Jaga Area Kerja', detail: 'Dilarang makan, minum, dan merokok di area bahan kimia' },
          { icon: '📢', judul: 'Laporkan Segera', detail: 'Laporkan segera jika terjadi tumpahan atau kebocoran' },
        ],
      },
      {
        type: 'image',
        src: fotoGhsBahanKimia,
        alt: 'Simbol GHS pada bahan kimia',
        caption: 'Implementasi simbol GHS pada kemasan bahan kimia',
      },
      {
        type: 'list',
        title: 'RSL (Restricted Substance List)',
        items: [
          'RSL adalah daftar zat/bahan kimia yang penggunaan dan/atau keberadaannya dilarang atau dibatasi oleh suatu merek',
          'Dibatasi karena kepedulian terhadap lingkungan',
          'Dibatasi karena masalah kesehatan & keselamatan pekerja atau konsumen',
          'Beberapa zat dibatasi langsung oleh undang-undang',
        ],
      },
    ],
  },
]

const TOTAL_SLIDES = 3 + TOPIK.length + 1 // cover + pendahuluan + masalah + topik + finish

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

export default function MateriLingkungan({ employeeName, onSelesai }: MateriLingkunganProps) {
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

  // ─── BLOCK RENDERER ────────────────────────────────────────────────────────
  const renderBlock = (block: Block, idx: number, warna: string) => {
    switch (block.type) {
      case 'list':
        return (
          <div key={idx}>
            {block.title && (
              <p className="font-jakarta text-[10px] font-bold tracking-[0.14em] uppercase mb-2" style={{ color: '#5A8A86' }}>
                {block.title}
              </p>
            )}
            <ul className="flex flex-col gap-2">
              {block.items.map((t, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="flex-shrink-0 w-1.5 h-1.5 rounded-full mt-[6px]" style={{ background: warna }} />
                  <span className="font-jakarta text-[13px] leading-relaxed" style={{ color: '#2D5C58' }}>{t}</span>
                </li>
              ))}
            </ul>
          </div>
        )

      case 'steps':
        return (
          <div key={idx}>
            {block.title && (
              <p className="font-jakarta text-[10px] font-bold tracking-[0.14em] uppercase mb-2" style={{ color: '#5A8A86' }}>
                {block.title}
              </p>
            )}
            <div className="flex flex-col gap-2">
              {block.items.map(a => (
                <div key={a.step} className="flex items-start gap-2.5 bg-white rounded-xl p-2.5" style={{ border: '1px solid #D4EDE9' }}>
                  <div
                    className="flex-shrink-0 w-[26px] h-[26px] rounded-lg flex items-center justify-center font-jakarta text-[10px] font-bold text-white"
                    style={{ background: warna }}
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
        )

      case 'cards':
        return (
          <div key={idx}>
            {block.title && (
              <p className="font-jakarta text-[10px] font-bold tracking-[0.14em] uppercase mb-2" style={{ color: '#5A8A86' }}>
                {block.title}
              </p>
            )}
            <div className="grid grid-cols-2 gap-2.5">
              {block.items.map((m, i) => (
                <div key={i} className="bg-white rounded-xl p-3" style={{ border: '1px solid #D4EDE9' }}>
                  {m.icon && <span className="text-lg mb-1.5 block">{m.icon}</span>}
                  <p className="font-jakarta text-xs font-bold mb-1" style={{ color: '#0D3D3A' }}>{m.judul}</p>
                  <p className="font-jakarta text-[11px] leading-relaxed" style={{ color: '#5A8A86' }}>{m.detail}</p>
                </div>
              ))}
            </div>
          </div>
        )

      case 'image':
        return (
          <figure key={idx} className="flex flex-col gap-2">
            <div className="rounded-xl overflow-hidden bg-white" style={{ border: '1px solid #D4EDE9' }}>
              {/* GANTI src foto ini setelah file diupload ke assets/images/materi/lingkungan/ */}
              <img src={block.src} alt={block.alt} className="w-full h-auto object-cover" loading="lazy" />
            </div>
            {block.caption && (
              <figcaption className="font-jakarta text-[11px] text-center leading-relaxed" style={{ color: '#5A8A86' }}>
                {block.caption}
              </figcaption>
            )}
          </figure>
        )

      case 'colorgrid':
        return (
          <div key={idx}>
            {block.title && (
              <p className="font-jakarta text-[10px] font-bold tracking-[0.14em] uppercase mb-2" style={{ color: '#5A8A86' }}>
                {block.title}
              </p>
            )}
            <div className="flex flex-col gap-2">
              {block.items.map((c, i) => (
                <div key={i} className="flex items-start gap-3 bg-white rounded-xl p-3" style={{ border: '1px solid #D4EDE9' }}>
                  <span className="flex-shrink-0 w-3 h-3 rounded-full mt-1" style={{ background: c.warna }} />
                  <div>
                    <p className="font-jakarta text-xs font-bold" style={{ color: '#0D3D3A' }}>
                      {c.judul} <span className="font-normal" style={{ color: '#5A8A86' }}>· {c.sub}</span>
                    </p>
                    <p className="font-jakarta text-[11px] leading-relaxed mt-0.5" style={{ color: '#5A8A86' }}>{c.contoh}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )

      case 'badges':
        return (
          <div key={idx}>
            {block.title && (
              <p className="font-jakarta text-[10px] font-bold tracking-[0.14em] uppercase mb-2" style={{ color: '#5A8A86' }}>
                {block.title}
              </p>
            )}
            <div className="flex flex-wrap gap-1.5">
              {block.items.map((t, i) => (
                <span
                  key={i}
                  className="font-jakarta text-[11px] font-semibold px-2.5 py-1 rounded-full"
                  style={{ background: '#E6F3F2', color: '#0D3D3A', border: '1px solid #D4EDE9' }}
                >
                  {t}
                </span>
              ))}
            </div>
          </div>
        )
    }
  }

  // ─── SLIDE 0: Cover ────────────────────────────────────────────────────────
  const Slide0Cover = () => (
    <div
      key={slide}
      className="slide-anim no-scrollbar flex flex-col items-center justify-center text-center overflow-y-auto flex-1 gap-4 px-5 py-8"
      style={{ background: '#2F7D52' }}
    >
      <p className="font-jakarta text-[10px] font-bold tracking-[0.18em] uppercase text-white/70">
        Materi Training · Lingkungan
      </p>
      <h1 className="font-playfair text-[clamp(28px,8vw,44px)] font-bold text-white leading-[1.15] tracking-tight">
        Sistem Manajemen<br />
        <em className="italic" style={{ color: '#C7EAD3' }}>Lingkungan</em> &amp;<br />
        Bahan Kimia
      </h1>
      <p className="font-jakarta text-sm text-white/90 leading-relaxed max-w-[300px]">
        {employeeName
          ? `Halo, ${employeeName}! Baca seluruh materi ini sebelum mengerjakan post-test.`
          : 'Pelajari pengelolaan limbah, bahan kimia, dan kesadaran lingkungan di tempat kerja.'}
      </p>
      <div className="flex flex-wrap justify-center gap-1.5 mt-1">
        {TOPIK.map(t => (
          <span
            key={t.kode}
            className="font-jakarta text-xs font-semibold text-white px-3 py-1 rounded-full"
            style={{ background: 'rgba(255,255,255,0.15)', border: '1px solid rgba(255,255,255,0.25)' }}
          >
            {t.nama}
          </span>
        ))}
      </div>
    </div>
  )

  // ─── SLIDE 1: Pendahuluan / Ruang Lingkup ─────────────────────────────────
  const Slide1Pendahuluan = () => (
    <div key={slide} className="slide-anim flex flex-col flex-1 overflow-hidden">
      <div ref={innerRef} onScroll={handleScroll} className="no-scrollbar flex-1 overflow-y-auto px-4 py-5 flex flex-col gap-4 max-w-[540px] w-full mx-auto">
        <div>
          <p className="font-jakarta text-[10px] font-bold tracking-[0.16em] uppercase mb-1" style={{ color: '#2F7D52' }}>Pendahuluan</p>
          <h2 className="font-playfair text-[clamp(20px,5vw,28px)] font-bold leading-tight" style={{ color: '#0D3D3A' }}>Ruang Lingkup Lingkungan</h2>
        </div>
        <p className="font-jakarta text-sm leading-relaxed" style={{ color: '#2D5C58' }}>
          Manajemen lingkungan adalah cara memastikan dampak aspek lingkungan terkelola dan tersedia di masa yang akan datang.
          Ruang lingkupnya mencakup <strong>5 aspek utama</strong> berikut:
        </p>
        <div className="grid grid-cols-2 gap-2.5">
          {RUANG_LINGKUP.map((r, i) => (
            <div key={r.label} className={`bg-white rounded-xl overflow-hidden ${i === 4 ? 'col-span-2 max-w-[48%] mx-auto w-full' : ''}`} style={{ border: '1px solid #D4EDE9' }}>
              <img src={r.img} alt={r.label} className="w-full h-24 object-cover" loading="lazy" />
              <p className="font-jakarta text-xs font-bold text-center py-2" style={{ color: '#0D3D3A' }}>{r.label}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )

  // ─── SLIDE 2: Mengapa Harus Dikelola ──────────────────────────────────────
  const Slide2Masalah = () => (
    <div key={slide} className="slide-anim flex flex-col flex-1 overflow-hidden">
      <div ref={innerRef} onScroll={handleScroll} className="no-scrollbar flex-1 overflow-y-auto px-4 py-5 flex flex-col gap-4 max-w-[540px] w-full mx-auto">
        <div>
          <p className="font-jakarta text-[10px] font-bold tracking-[0.16em] uppercase mb-1" style={{ color: '#2F7D52' }}>Tanpa Pengelolaan</p>
          <h2 className="font-playfair text-[clamp(20px,5vw,28px)] font-bold leading-tight" style={{ color: '#0D3D3A' }}>Mengapa Harus Dikelola?</h2>
        </div>
        <div className="flex flex-col gap-2.5">
          {MASALAH.map((m, i) => (
            <div key={i} className="flex gap-3 bg-white rounded-xl overflow-hidden" style={{ border: '1px solid #D4EDE9' }}>
              <img src={m.img} alt={m.judul} className="w-24 h-24 object-cover flex-shrink-0" loading="lazy" />
              <div className="py-2.5 pr-3 flex flex-col justify-center">
                <p className="font-jakarta text-xs font-bold mb-1" style={{ color: '#0D3D3A' }}>{m.judul}</p>
                <p className="font-jakarta text-[11px] leading-relaxed" style={{ color: '#5A8A86' }}>{m.teks}</p>
              </div>
            </div>
          ))}
        </div>
        <div className="flex items-center justify-center gap-2 flex-wrap rounded-xl px-4 py-3 text-white font-jakarta text-xs font-semibold" style={{ background: '#0D3D3A' }}>
          <span>Semua dampak ini dapat dicegah dengan pengelolaan lingkungan yang baik</span>
        </div>
      </div>
    </div>
  )

  // ─── SLIDE 3..9: Topik ─────────────────────────────────────────────────────
  const SlideTopik = ({ topik, idx }: { topik: Topik; idx: number }) => (
    <div key={`${slide}-${topik.kode}`} className="slide-anim flex flex-col flex-1 overflow-hidden">
      <div ref={innerRef} onScroll={handleScroll} className="no-scrollbar flex-1 overflow-y-auto px-4 py-5 flex flex-col gap-4 max-w-[540px] w-full mx-auto">

        {/* ── HERO — nama besar dengan background warna + ghost kode ── */}
        <div
          className="pilar-hero relative rounded-2xl overflow-hidden px-4 py-5 text-white"
          data-kode={topik.kode}
          style={{ background: topik.warna }}
        >
          <p className="font-jakarta text-[10px] font-bold tracking-[0.14em] uppercase text-white/75 mb-1">
            Topik {idx + 1} dari {TOPIK.length}
          </p>
          <p className="font-playfair text-[26px] font-bold leading-tight mb-1.5">{topik.nama}</p>
          <p className="font-jakarta text-[13px] text-white/90">{topik.tagline}</p>
        </div>

        {/* Deskripsi */}
        <p className="font-jakarta text-sm leading-relaxed" style={{ color: '#2D5C58' }}>{topik.deskripsi}</p>

        <div className="h-px" style={{ background: '#E6F3F2' }} />

        {/* Blocks */}
        {topik.blocks.map((b, i) => renderBlock(b, i, topik.warna))}
      </div>
    </div>
  )

  // ─── SLIDE TERAKHIR: Finish ────────────────────────────────────────────────
  const SlideFinish = () => (
    <div
      key={slide}
      className="slide-anim no-scrollbar flex flex-col flex-1 items-center justify-center text-center overflow-y-auto px-5 py-8 gap-4"
      style={{ background: '#0D3D3A' }}
    >
      <div className="w-14 h-14 rounded-full flex items-center justify-center text-2xl flex-shrink-0" style={{ background: '#2F7D52' }}>✓</div>
      <h2 className="font-playfair text-2xl font-bold" style={{ color: '#C7EAD3' }}>Materi Selesai!</h2>
      <p className="font-jakarta text-[13px] leading-relaxed max-w-[280px]" style={{ color: 'rgba(255,255,255,0.6)' }}>
        {canFinish
          ? 'Kamu sudah membaca semua materi Lingkungan & Bahan Kimia. Saatnya kerjakan Post-Test!'
          : `Kamu sudah membaca ${progress}% materi. Pastikan semua slide sudah dibuka sebelum melanjutkan.`}
      </p>
      <button
        onClick={onSelesai}
        disabled={!canFinish}
        className="font-jakarta font-bold text-sm text-white rounded-xl px-7 py-4 w-full max-w-[280px] mt-1 transition-all"
        style={{
          background: canFinish ? '#2F7D52' : 'rgba(47,125,82,0.4)',
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
    ...TOPIK.map((t, i) => <SlideTopik key={t.kode} topik={t} idx={i} />),
    <SlideFinish key="finish" />,
  ]

  // ─── RENDER ───────────────────────────────────────────────────────────────
  return (
    <>
      <style>{minimalCss}</style>
      <div className="font-jakarta flex flex-col min-h-screen" style={{ background: '#F2FAF5' }}>

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
                style={{ width: `${progress}%`, background: '#2F7D52' }}
              />
            </div>
            <p className="font-jakarta text-[10px] font-semibold text-right mt-0.5 tracking-wide whitespace-nowrap" style={{ color: '#2F7D52' }}>
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
                style={{ background: '#2F7D52' }}
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
          {/* PREV — solid circle */}
          <button
            onClick={goPrev}
            disabled={slide === 0}
            aria-label="Slide sebelumnya"
            className="flex-shrink-0 w-11 h-11 rounded-full flex items-center justify-center transition-all active:scale-95"
            style={{
              background: slide === 0 ? '#CDE9D7' : '#2F7D52',
              boxShadow: slide === 0 ? 'none' : '0 2px 8px rgba(47,125,82,0.35)',
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
                  background: slide === i ? '#2F7D52' : visited.has(i) ? '#9CCEAE' : '#CDE9D7',
                  transform: slide === i ? 'scale(1.5)' : 'scale(1)',
                  minWidth: 8,
                }}
              />
            ))}
          </div>

          {/* NEXT — solid circle */}
          <button
            onClick={goNext}
            disabled={slide === TOTAL_SLIDES - 1}
            aria-label="Slide berikutnya"
            className="flex-shrink-0 w-11 h-11 rounded-full flex items-center justify-center transition-all active:scale-95"
            style={{
              background: slide === TOTAL_SLIDES - 1 ? '#CDE9D7' : '#2F7D52',
              boxShadow: slide === TOTAL_SLIDES - 1 ? 'none' : '0 2px 8px rgba(47,125,82,0.35)',
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