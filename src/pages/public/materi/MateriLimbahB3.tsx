import { useState, useEffect, useCallback, useRef } from 'react'
import logoZinus from '@/assets/zinus-tulisan-putih-contour.webp'
import logoHyundai from '@/assets/hyundai-ori-hitam.png'

// ─── FOTO MATERI (silakan upload file dengan nama-nama berikut) ───────────────
// Letakkan semua foto di: src/assets/images/materi/limbah-b3/
import fotoLabelLimbahB3 from '@/assets/images/materi/limbah-b3/label-limbah-b3.webp'
import fotoSimbolLimbahB3 from '@/assets/images/materi/limbah-b3/simbol-limbah-b3.webp'
import fotoImplementasiKemasanB3 from '@/assets/images/materi/limbah-b3/implementasi-kemasan-b3.webp'
import fotoJarakPenyimpananB3 from '@/assets/images/materi/limbah-b3/jarak-penyimpanan-b3.webp'
import fotoApd from '@/assets/images/materi/limbah-b3/apd.webp'
import fotoGhsBahanKimia from '@/assets/images/materi/limbah-b3/ghs-bahan-kimia.webp'
import fotoMsds from '@/assets/images/materi/limbah-b3/msds.webp'

interface MateriLimbahB3Props {
  employeeName?: string
  onSelesai: () => void
}

// ─── TYPES ──────────────────────────────────────────────────────────────────

type Block =
  | { type: 'list'; title?: string; items: string[] }
  | { type: 'steps'; title?: string; items: { step: string; judul: string; detail: string }[] }
  | { type: 'cards'; title?: string; items: { icon?: string; judul: string; detail: string }[] }
  | { type: 'image'; src: string; alt: string; caption?: string }
  | { type: 'table'; title?: string; headers: string[]; rows: string[][] }
  | { type: 'badges'; title?: string; items: string[] }
  | { type: 'callout'; text: string }

interface Topik {
  kode: string
  nama: string
  warna: string
  tagline: string
  deskripsi: string
  blocks: Block[]
}

// ─── DATA: 4 TOPIK UTAMA ────────────────────────────────────────────────────

const TOPIK: Topik[] = [
  {
    kode: 'B1',
    nama: 'Mengenal Limbah B3',
    warna: '#3E8E5B',
    tagline: 'Definisi, karakteristik, dan batas penyimpanan',
    deskripsi:
      'Limbah B3 adalah sisa kegiatan (padat atau cair) yang karena sifat dan jumlahnya — baik secara langsung maupun tidak langsung — dapat membahayakan lingkungan dan makhluk hidup. Memahami karakteristik limbah B3 adalah langkah pertama sebelum menangani, menyimpan, atau mengelolanya dengan benar.',
    blocks: [
      {
        type: 'callout',
        text: 'Maksimal masa penyimpanan Limbah B3 adalah 3 bulan (90 hari) sesuai izin TPS Limbah B3.',
      },
      {
        type: 'list',
        title: 'Karakteristik Limbah B3',
        items: [
          'Sifat Fisik — berat jenis (densitas) dan wujud (padat, cair, atau gas)',
          'Sifat Kimia — tingkat keasaman (pH) dan kandungan zat kimia berbahaya',
          'Sifat Biologis — kehadiran mikroorganisme yang memengaruhi dekomposisi',
          'Sifat Termal — kemampuan menghantarkan panas',
          'Sifat Radioaktif — kemampuan memancarkan radiasi',
          'Sifat Toksisitas — tingkat racun bagi makhluk hidup',
          'Sifat Eksplosif & Reaktif — potensi meledak atau bereaksi berbahaya dengan zat lain',
          'Sifat Biodegradabilitas — kemampuan terurai oleh organisme hidup',
          'Sifat Estetika — bau, warna, dan rasa yang ditimbulkan',
        ],
      },
      {
        type: 'list',
        title: 'Persyaratan Pengumpulan Limbah B3',
        items: [
          'Limbah B3 dari sumber tidak spesifik',
          'Limbah B3 dari bahan kimia kadaluwarsa, tumpahan, bekas kemasan, dan buangan produk yang tidak memenuhi spesifikasi',
          'Limbah B3 dari sumber spesifik (sumber spesifik umum dan sumber spesifik khusus)',
        ],
      },
    ],
  },
  {
    kode: 'B2',
    nama: 'Pengemasan & Penyimpanan',
    warna: '#2F7D52',
    tagline: 'Kemasan yang benar mencegah kebocoran & kecelakaan',
    deskripsi:
      'Kemasan dan area penyimpanan Limbah B3 harus memenuhi standar yang ketat — mulai dari material kemasan, jarak antar kemasan, hingga lokasi penyimpanan — untuk mencegah kebocoran, tumpahan, dan reaksi berbahaya antar limbah.',
    blocks: [
      {
        type: 'steps',
        title: 'Syarat Kemasan Limbah B3',
        items: [
          { step: '01', judul: 'Material Sesuai', detail: 'Kemasan terbuat dari bahan yang sesuai dan dapat mengemas Limbah B3 sesuai karakteristik limbah yang disimpan' },
          { step: '02', judul: 'Mampu Menampung', detail: 'Dapat menampung Limbah B3 untuk tetap berada di dalam kemasan' },
          { step: '03', judul: 'Tertutup Rapat', detail: 'Memiliki penutup yang dapat mencegah terjadinya kebocoran/tumpahan saat penyimpanan hingga pengangkutan' },
          { step: '04', judul: 'Tidak Rusak', detail: 'Kemasan dalam keadaan tidak bocor, tidak berkarat, dan tidak rusak' },
        ],
      },
      {
        type: 'image',
        src: fotoImplementasiKemasanB3,
        alt: 'Implementasi kemasan limbah B3',
        caption: 'Implementasi kemasan (drum) Limbah B3 sesuai standar — diberi simbol dan label',
      },
      {
        type: 'list',
        title: 'Aturan Penyimpanan',
        items: [
          'Limbah B3 yang disimpan harus sesuai dengan jenis limbah yang tercantum dalam Izin TPS Limbah B3',
          'Penyimpanan Limbah B3 harus dilakukan di atas permukaan tanah',
          'Area penyimpanan harus dipastikan bebas dari bahaya kebakaran, banjir, dan tumpahan',
          'Wadah yang digunakan untuk Limbah B3 harus compatible (tidak bereaksi dengan limbah)',
        ],
      },
      {
        type: 'image',
        src: fotoJarakPenyimpananB3,
        alt: 'Jarak penyimpanan limbah B3',
        caption: 'Jarak penyimpanan antar kemasan Limbah B3 wajib diatur agar mudah diakses dan tidak saling bereaksi',
      },
      {
        type: 'list',
        title: 'Pengurangan Timbulan Limbah B3',
        items: [
          'Substitusi bahan — penggantian bahan baku dan/atau bahan penolong B3 menjadi bahan baku/penolong yang tidak mengandung B3',
          'Modifikasi proses (rekayasa engineering) — pemilihan dan penerapan produksi bersih',
          'Penggunaan teknologi ramah lingkungan',
        ],
      },
    ],
  },
  {
    kode: 'B3',
    nama: 'Label, Simbol & APD',
    warna: '#1F6B49',
    tagline: 'Identifikasi visual dan perlindungan diri',
    deskripsi:
      'Setiap kemasan Limbah B3 wajib dilengkapi label dan simbol bahaya yang jelas agar mudah diidentifikasi oleh siapa pun yang menanganinya. Selain itu, penggunaan Alat Pelindung Diri (APD) adalah kewajiban mutlak bagi siapa saja yang bekerja dengan Limbah B3.',
    blocks: [
      {
        type: 'image',
        src: fotoLabelLimbahB3,
        alt: 'Contoh label limbah B3',
        caption: 'Contoh label Limbah B3 — berisi info penghasil, alamat, nomor telepon, jenis limbah, dan tanggal pengemasan',
      },
      {
        type: 'list',
        title: 'Informasi Wajib pada Label Limbah B3',
        items: [
          'Nama dan alamat penghasil limbah',
          'Nomor telepon penghasil limbah',
          'Tanggal pengemasan limbah',
          'Jenis dan kode limbah',
          'Jumlah/berat limbah',
          'Sifat limbah B3 yang dikemas',
        ],
      },
      {
        type: 'image',
        src: fotoSimbolLimbahB3,
        alt: 'Simbol bahaya limbah B3',
        caption: 'Simbol Limbah B3 sesuai Permen LHK No.14/2013 tentang Simbol dan Label Limbah B3',
      },
      {
        type: 'badges',
        title: 'Jenis Simbol Limbah B3',
        items: [
          'Mudah Meledak (explosive)', 'Pengoksidasi (oxidizing)', 'Sangat Mudah Menyala (extremely flammable)',
          'Mudah Menyala (highly flammable)', 'Amat Sangat Beracun (extremely toxic)', 'Sangat Beracun (highly toxic)',
          'Beracun (moderately toxic)', 'Berbahaya (harmful)', 'Korosif (corrosive)', 'Bersifat Iritasi (irritant)',
          'Berbahaya bagi Lingkungan (dangerous for the environment)', 'Karsinogenik (carcinogenic)',
          'Teratogenik (teratogenic)', 'Mutagenik (mutagenic)',
        ],
      },
      {
        type: 'image',
        src: fotoApd,
        alt: 'Alat Pelindung Diri',
        caption: 'Contoh Alat Pelindung Diri (APD) — pelindung mata dan pelindung tangan',
      },
      {
        type: 'callout',
        text: 'Setiap karyawan atau orang yang bekerja dengan Limbah B3 WAJIB menggunakan Alat Pelindung Diri (APD) yang diberikan oleh perusahaan.',
      },
    ],
  },
  {
    kode: 'B4',
    nama: 'Manajemen Bahan Kimia',
    warna: '#13433D',
    tagline: 'Kendalikan bahan kimia, lindungi semua orang',
    deskripsi:
      'Manajemen bahan kimia adalah upaya memastikan seluruh pengelolaan bahan kimia di perusahaan terkendali, sehingga tidak menimbulkan bahaya bagi karyawan maupun lingkungan. Sistem ini mencakup penggunaan simbol GHS, ketersediaan MSDS, hingga kepatuhan terhadap RSL.',
    blocks: [
      {
        type: 'list',
        title: 'Apa Itu Manajemen Bahan Kimia?',
        items: [
          'Upaya untuk memastikan seluruh pengelolaan bahan kimia di perusahaan terkendali',
          'Mencegah bahaya terhadap karyawan dan lingkungan akibat penggunaan bahan kimia',
        ],
      },
      {
        type: 'steps',
        title: 'Bagaimana Caranya?',
        items: [
          { step: '01', judul: 'Sediakan MSDS', detail: 'Memastikan MSDS (Material Safety Data Sheet) di setiap area kerja yang menggunakan bahan kimia' },
          { step: '02', judul: 'Gunakan APD', detail: 'Menggunakan APD (alat pelindung diri) yang sesuai saat menangani bahan kimia' },
          { step: '03', judul: 'Simpan & Buang Sesuai Aturan', detail: 'Menyimpan, menggunakan, dan membuang bahan kimia sesuai aturan dan prosedur yang berlaku' },
          { step: '04', judul: 'Laporkan Bahaya', detail: 'Melaporkan jika menemukan potensi bahaya terkait bahan kimia kepada penanggung jawab area' },
        ],
      },
      {
        type: 'image',
        src: fotoGhsBahanKimia,
        alt: 'GHS atau simbol bahan kimia',
        caption: 'GHS (Globally Harmonized System) — implementasi simbol bahaya pada kemasan bahan kimia',
      },
      {
        type: 'image',
        src: fotoMsds,
        alt: 'Contoh MSDS bahan kimia',
        caption: 'MSDS (Material Safety Data Sheet) wajib tersedia di setiap area penyimpanan bahan kimia',
      },
      {
        type: 'list',
        title: 'RSL (Restricted Substance List) — Pembatasan Zat Berbahaya',
        items: [
          'RSL adalah zat terlarang, bahan kimia, dan zat lain yang penggunaan dan/atau keberadaannya telah dilarang atau dibatasi oleh suatu merek',
          'Dibatasi karena berbagai alasan, salah satunya karena kepedulian terhadap lingkungan',
          'Dibatasi karena masalah kesehatan dan keselamatan bagi pekerja atau konsumen',
          'Beberapa zat dibatasi oleh undang-undang yang berlaku',
        ],
      },
    ],
  },
]

const TOTAL_SLIDES = 1 + TOPIK.length + 1 // cover + topik + finish

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

export default function MateriLimbahB3({ employeeName, onSelesai }: MateriLimbahB3Props) {
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
              {/* GANTI src foto ini setelah file diupload ke assets/images/materi/limbah-b3/ */}
              <img src={block.src} alt={block.alt} className="w-full h-auto object-cover" loading="lazy" />
            </div>
            {block.caption && (
              <figcaption className="font-jakarta text-[11px] text-center leading-relaxed" style={{ color: '#5A8A86' }}>
                {block.caption}
              </figcaption>
            )}
          </figure>
        )

      case 'table':
        return (
          <div key={idx}>
            {block.title && (
              <p className="font-jakarta text-[10px] font-bold tracking-[0.14em] uppercase mb-2" style={{ color: '#5A8A86' }}>
                {block.title}
              </p>
            )}
            <div className="overflow-x-auto rounded-xl" style={{ border: '1px solid #D4EDE9' }}>
              <table className="w-full border-collapse text-[11px]" style={{ minWidth: 280 }}>
                <thead>
                  <tr>
                    {block.headers.map((h, i) => (
                      <th
                        key={h}
                        className="font-jakarta text-[9px] font-bold tracking-[0.08em] uppercase text-left px-2 py-2"
                        style={{
                          background: '#0D3D3A', color: '#C2EDE9',
                          borderRadius: i === 0 ? '9px 0 0 0' : i === block.headers.length - 1 ? '0 9px 0 0' : undefined,
                        }}
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {block.rows.map((row, i) => (
                    <tr key={i}>
                      {row.map((cell, j) => (
                        <td
                          key={j}
                          className={`font-jakarta px-2 py-2${j === 0 ? ' font-semibold' : ''}`}
                          style={{
                            color: '#2D5C58',
                            background: i % 2 === 0 ? '#F7FFFE' : undefined,
                            borderBottom: i < block.rows.length - 1 ? '1px solid #E6F3F2' : undefined,
                          }}
                        >
                          {cell}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
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

      case 'callout':
        return (
          <div
            key={idx}
            className="rounded-xl px-4 py-3 font-jakarta text-xs font-semibold text-white text-center leading-relaxed"
            style={{ background: warna }}
          >
            {block.text}
          </div>
        )
    }
  }

  // ─── SLIDE 0: Cover ────────────────────────────────────────────────────────
  const Slide0Cover = () => (
    <div
      key={slide}
      className="slide-anim no-scrollbar flex flex-col items-center justify-center text-center overflow-y-auto flex-1 gap-4 px-5 py-8"
      style={{ background: '#1F6B49' }}
    >
      <p className="font-jakarta text-[10px] font-bold tracking-[0.18em] uppercase text-white/70">
        Materi Training · Limbah B3
      </p>
      <h1 className="font-playfair text-[clamp(28px,8vw,44px)] font-bold text-white leading-[1.15] tracking-tight">
        Pengelolaan<br />
        <em className="italic" style={{ color: '#C7EAD3' }}>Limbah B3</em><br />
        &amp; Bahan Kimia
      </h1>
      <p className="font-jakarta text-sm text-white/90 leading-relaxed max-w-[300px]">
        {employeeName
          ? `Halo, ${employeeName}! Baca seluruh materi ini sebelum mengerjakan post-test.`
          : 'Pelajari cara mengenali, mengemas, menyimpan, dan menangani Limbah B3 serta bahan kimia dengan aman.'}
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

  // ─── SLIDE 1..4: Topik ─────────────────────────────────────────────────────
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
      <div className="w-14 h-14 rounded-full flex items-center justify-center text-2xl flex-shrink-0" style={{ background: '#1F6B49' }}>✓</div>
      <h2 className="font-playfair text-2xl font-bold" style={{ color: '#C7EAD3' }}>Materi Selesai!</h2>
      <p className="font-jakarta text-[13px] leading-relaxed max-w-[280px]" style={{ color: 'rgba(255,255,255,0.6)' }}>
        {canFinish
          ? 'Kamu sudah membaca semua materi Limbah B3 & Bahan Kimia. Saatnya kerjakan Post-Test!'
          : `Kamu sudah membaca ${progress}% materi. Pastikan semua slide sudah dibuka sebelum melanjutkan.`}
      </p>
      <button
        onClick={onSelesai}
        disabled={!canFinish}
        className="font-jakarta font-bold text-sm text-white rounded-xl px-7 py-4 w-full max-w-[280px] mt-1 transition-all"
        style={{
          background: canFinish ? '#1F6B49' : 'rgba(31,107,73,0.4)',
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
    ...TOPIK.map((t, i) => <SlideTopik key={t.kode} topik={t} idx={i} />),
    <SlideFinish key="finish" />,
  ]

  // ─── RENDER ───────────────────────────────────────────────────────────────
  return (
    <>
      <style>{minimalCss}</style>
      <div className="font-jakarta flex flex-col min-h-screen" style={{ background: '#F0FAF6' }}>

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
                style={{ width: `${progress}%`, background: '#1F6B49' }}
              />
            </div>
            <p className="font-jakarta text-[10px] font-semibold text-right mt-0.5 tracking-wide whitespace-nowrap" style={{ color: '#1F6B49' }}>
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
                style={{ background: '#1F6B49' }}
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
              background: slide === 0 ? '#C9E6D9' : '#1F6B49',
              boxShadow: slide === 0 ? 'none' : '0 2px 8px rgba(31,107,73,0.35)',
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
                  background: slide === i ? '#1F6B49' : visited.has(i) ? '#8FCBAE' : '#C9E6D9',
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
              background: slide === TOTAL_SLIDES - 1 ? '#C9E6D9' : '#1F6B49',
              boxShadow: slide === TOTAL_SLIDES - 1 ? 'none' : '0 2px 8px rgba(31,107,73,0.35)',
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