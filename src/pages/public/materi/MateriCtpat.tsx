import { useState, useEffect, useCallback, useRef } from 'react'
import logoZinus from '@/assets/zinus-tulisan-putih-contour.webp'
import logoHyundai from '@/assets/hyundai-ori-hitam.png'
import CtpatLogo from '@/assets/images/ctpat-logo.png'

interface MateriCtpatProps {
  employeeName?: string
  onSelesai: () => void
}

// ─── DATA ────────────────────────────────────────────────────────────────────

const TOPIK = [
  {
    kode: 'T01',
    nama: 'Employee Identification',
    sub: 'Identifikasi Karyawan',
    warna: '#1B4F72',
    tagline: 'Kenali siapa yang ada di area kerjamu',
    deskripsi:
      'Setiap karyawan wajib mengenakan ID Card / Name Tag yang resmi dikeluarkan perusahaan selama berada di area pabrik. ID Card harus terlihat jelas dan tidak boleh dipinjamkan kepada siapapun.',
    poin: [
      'ID Card wajib dipakai setiap saat di area pabrik',
      'ID Card tidak boleh dipinjamkan kepada orang lain',
      'Kehilangan ID Card harus segera dilaporkan ke HR/Security',
      'Karyawan tanpa ID Card harus diarahkan ke pos security',
    ],
    catatan: 'ID Card adalah identitas resmi karyawan. Tanpa ID Card, seseorang tidak dapat dianggap memiliki akses sah ke area perusahaan.',
  },
  {
    kode: 'T02',
    nama: 'Visitor Controls',
    sub: 'Kendali Tamu',
    warna: '#1A5276',
    tagline: 'Setiap tamu harus terdaftar dan didampingi',
    deskripsi:
      'Semua tamu yang memasuki area perusahaan wajib mengisi buku tamu, menyerahkan identitas resmi, dan menerima Visitor Card. Tamu tidak boleh berkeliaran sendiri tanpa pendamping dari pihak perusahaan.',
    poin: [
      'Wajib mengisi buku tamu dan menyerahkan identitas resmi',
      'Identitas ditukar sementara dengan Visitor Card',
      'Tamu harus didampingi selama berada di area perusahaan',
      'Identitas dikembalikan saat tamu meninggalkan area',
    ],
    catatan: 'Pendampingan tamu bukan sekadar formalitas — ini adalah lapis perlindungan untuk mencegah akses tidak sah ke area sensitif.',
  },
  {
    kode: 'T03',
    nama: 'Suspicious Persons',
    sub: 'Orang Mencurigakan',
    warna: '#154360',
    tagline: 'Kenali, nilai, dan laporkan',
    deskripsi:
      'Orang yang berada di area perusahaan tanpa identitas jelas, berkeliaran di area terlarang, atau berperilaku tidak wajar harus segera ditangani sesuai prosedur.',
    poin: [
      'Periksa apakah orang tersebut karyawan, tamu, atau orang asing',
      'Jika karyawan → arahkan ke area kerja yang benar',
      'Jika tamu → antar ke pos security untuk registrasi',
      'Jika tidak dikenal → segera laporkan ke atasan / security',
      'Jangan konfrontasi sendiri jika situasi terasa berbahaya',
    ],
    catatan: 'Setiap orang di area perusahaan harus dapat diidentifikasi. Jika ragu, selalu hubungi security.',
  },
  {
    kode: 'T04',
    nama: 'Suspicious Activity',
    sub: 'Aktivitas Mencurigakan',
    warna: '#1B2631',
    tagline: 'Aktivitas tidak wajar = sinyal bahaya',
    deskripsi:
      'Aktivitas mencurigakan mencakup tindakan yang tidak normal dan berpotensi mengancam keamanan area atau rantai pasok perusahaan.',
    poin: [
      'Menghalangi atau merusak kamera CCTV',
      'Merusak atau mengganti kunci area terlarang',
      'Mengacak-acak ruang arsip atau dokumen sensitif',
      'Mengambil foto/video area produksi atau keamanan tanpa izin',
      'Aktivitas mencurigakan harus segera dilaporkan ke atasan',
    ],
    catatan: 'Satu tindakan mencurigakan yang tidak dilaporkan dapat membuka celah bagi ancaman yang lebih besar.',
  },
  {
    kode: 'T05',
    nama: 'Internal Conspiracies',
    sub: 'Konspirasi Internal',
    warna: '#212F3D',
    tagline: 'Ancaman bisa datang dari dalam',
    deskripsi:
      'Konspirasi internal terjadi ketika karyawan bekerja sama dengan pihak luar untuk merugikan perusahaan atau melanggar keamanan rantai pasok.',
    poin: [
      'Mengambil foto fasilitas produksi atau keamanan untuk pihak luar',
      'Mengumpulkan dan membagikan informasi data karyawan',
      'Mengintai celah keamanan di rantai pasok untuk kepentingan tertentu',
      'Memberikan informasi jadwal pengiriman kepada pihak tidak berwenang',
      'Segera laporkan indikasi konspirasi kepada manajemen',
    ],
    catatan: 'C-TPAT mewajibkan perusahaan memiliki mekanisme pelaporan yang aman bagi karyawan yang ingin melaporkan aktivitas internal yang mencurigakan.',
  },
  {
    kode: 'T06',
    nama: 'Suspicious Objects',
    sub: 'Objek & Paket Mencurigakan',
    warna: '#1C2833',
    tagline: 'Jangan sentuh — isolasi — laporkan',
    deskripsi:
      'Paket atau objek mencurigakan harus ditangani dengan sangat hati-hati. Jangan pernah membuka, mencium, atau memindahkan paket yang mencurigakan sebelum mendapat instruksi dari pihak berwenang.',
    poin: [
      'Ciri: tanpa identitas pengirim jelas, berat tidak sesuai ukuran, ada bau/cairan bocor, ada kabel atau tonjolan aneh',
      'Jangan membuka, mencium, atau menggoyang paket',
      'Isolasi paket dari area lalu lintas orang',
      'Hentikan semua aktivitas di sekitar objek tersebut',
      'Segera laporkan ke security dan atasan',
    ],
    catatan: 'Paket yang tampak normal secara visual (label rapi, tidak berbau) tetapi beratnya jauh lebih ringan dari ukurannya tetap harus dilaporkan sebagai mencurigakan.',
  },
  {
    kode: 'T07',
    nama: 'Computer & Document Security',
    sub: 'Keamanan IT & Dokumen',
    warna: '#0E2954',
    tagline: 'Aset digital & fisik harus sama-sama dijaga',
    deskripsi:
      'Keamanan informasi mencakup perlindungan terhadap aset digital (komputer, data, email) dan aset fisik (dokumen, arsip). Keduanya wajib dijaga dari akses yang tidak berwenang.',
    poin: [
      'Gunakan password yang kuat dan jangan bagikan ke siapapun',
      'Aktifkan antivirus dan selalu update sistem operasi',
      'Jangan buka email atau lampiran dari pengirim tidak dikenal',
      'Dokumen penting tidak boleh ditinggal di meja tanpa pengawasan',
      'Simpan dokumen sensitif di lemari terkunci atau musnahkan dengan benar',
      'Dokumen yang sudah tidak diperlukan harus dihancurkan (shredder)',
    ],
    catatan: 'Kebocoran data melalui email atau dokumen fisik yang tidak dijaga dapat membahayakan posisi bisnis perusahaan dan keamanan rantai pasok.',
  },
  {
    kode: 'T08',
    nama: 'Container Inspection',
    sub: 'Pemeriksaan Kontainer',
    warna: '#1A3A5C',
    tagline: '7 titik inspeksi untuk kontainer yang aman',
    deskripsi:
      'Setiap kontainer yang akan dimuat (stuffing) wajib diperiksa secara menyeluruh sebelum proses pemuatan. Pemeriksaan ini bertujuan mendeteksi rekayasa struktural, modifikasi tersembunyi, atau kompartemen ilegal.',
    poin: [
      '7-Point Inspection: Dinding kiri & kanan, lantai, langit-langit, pintu depan & belakang, eksterior bawah',
      'Untuk kontainer dari Meksiko: 17-Point Inspection yang lebih detail',
      'Gunakan metode VVTT: Visual, Verbal, Touch, Tapping untuk memeriksa seal',
      'Nomor seal HARUS dicocokkan dengan dokumen pengiriman resmi',
      'Jika nomor seal berbeda walau satu digit → HENTIKAN proses, laporkan ke supervisor',
      'Dokumentasikan hasil inspeksi sebelum dan sesudah stuffing',
    ],
    catatan: 'Seal yang tampak utuh secara fisik namun nomornya tidak sesuai dokumen tetap dianggap sebagai indikasi manipulasi dan wajib dilaporkan.',
  },
  {
    kode: 'T09',
    nama: 'Forced Labor & Human Trafficking',
    sub: 'Kerja Paksa & Perdagangan Orang',
    warna: '#1F3A4F',
    tagline: 'Setiap pekerja berhak atas kebebasan dan martabat',
    deskripsi:
      'C-TPAT melarang keras penggunaan tenaga kerja paksa atau perdagangan orang dalam seluruh rantai pasok. Perusahaan wajib memastikan seluruh mitra bisnis juga mematuhi standar ini.',
    poin: [
      'Kerja paksa (ILO Convention No. 29): pekerjaan yang dilakukan di bawah ancaman, tidak sukarela',
      'Perdagangan orang: perekrutan/penampungan melalui ancaman atau penipuan untuk eksploitasi',
      'Sektor berisiko tinggi: konstruksi, tekstil, elektronik, perkebunan, peternakan',
      'Karyawan berhak mengundurkan diri tanpa sanksi berlebihan',
      'Tidak boleh ada pemotongan upah sebagai bentuk hukuman',
      'Laporkan indikasi kerja paksa kepada manajemen atau otoritas terkait',
    ],
    catatan: 'Zinus berkomitmen pada rantai pasok yang bebas dari segala bentuk eksploitasi tenaga kerja sesuai standar C-TPAT dan hukum internasional.',
  },
  {
    kode: 'T10',
    nama: 'Anti Money Laundering',
    sub: 'Anti Pencucian Uang & Pendanaan Terorisme',
    warna: '#17202A',
    tagline: 'Kenali tiga tahap pencucian uang',
    deskripsi:
      'Pencucian uang adalah proses menyamarkan asal-usul uang hasil kejahatan agar terlihat sah. Indonesia mengaturnya melalui UU No. 8 Tahun 2010 dan UU No. 9 Tahun 2013 tentang Pencegahan Pendanaan Terorisme.',
    poin: [
      'Placement: menempatkan uang hasil kejahatan ke dalam sistem keuangan (tahap awal)',
      'Layering: memisahkan uang dari sumbernya melalui transaksi berlapis dan kompleks',
      'Integration: menggabungkan uang yang sudah "bersih" ke dalam bisnis yang sah',
      'PPATK (Pusat Pelaporan & Analisis Transaksi Keuangan) adalah lembaga pengawas di Indonesia',
      'Laporkan transaksi keuangan mencurigakan sesuai prosedur perusahaan',
    ],
    catatan: 'Keterlibatan dalam aktivitas pencucian uang — baik disengaja maupun tidak — dapat menimbulkan konsekuensi hukum bagi karyawan dan perusahaan.',
  },
  {
    kode: 'T11',
    nama: 'Agricultural Security',
    sub: 'Keamanan Pertanian — Kontainer',
    warna: '#1E3A2F',
    tagline: 'Kontainer bersih = ekspor yang aman',
    deskripsi:
      'Agricultural Security memastikan kontainer ekspor bebas dari hama, tanah, serangga, atau organisme biologis asing yang dapat merusak ekosistem negara tujuan dan menyebabkan penolakan kiriman.',
    poin: [
      'Inspeksi kontainer dari risiko kontaminasi biologis (hama, serangga, bakteri)',
      'Kontaminasi kimia: residu pestisida, bahan berbahaya lainnya',
      'Kontaminasi fisik: tanah, biji-bijian, material organik menempel di dinding/lantai kontainer',
      'Lakukan inspeksi menyeluruh SEBELUM proses stuffing dimulai',
      'Dokumentasikan kondisi kontainer dengan foto sebelum dan sesudah stuffing',
      'Kontainer yang tidak memenuhi standar kebersihan harus ditolak dan diganti',
    ],
    catatan: 'Banyak negara tujuan ekspor memiliki regulasi ketat terkait kontaminasi biologis. Satu kontainer yang tercemar dapat menyebabkan seluruh pengiriman ditolak.',
  },
]

const TOTAL_SLIDES = 3 + TOPIK.length + 1 // Cover + Pendahuluan + Tujuan + 11 Topik + Finish

// ─── CSS ──────────────────────────────────────────────────────────────────────

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
  .topik-hero::after {
    content: attr(data-kode);
    position: absolute;
    right: -4px; top: -6px;
    font-family: 'Playfair Display', serif;
    font-size: 64px;
    font-weight: 700;
    color: rgba(255,255,255,0.07);
    line-height: 1;
    pointer-events: none;
    user-select: none;
  }
  .font-playfair { font-family: 'Playfair Display', serif; }
  .font-jakarta  { font-family: 'Plus Jakarta Sans', sans-serif; }
`

// ─── COMPONENT ────────────────────────────────────────────────────────────────

export default function MateriCtpat({ employeeName, onSelesai }: MateriCtpatProps) {
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

  // ─── SLIDE 0: Cover ──────────────────────────────────────────────────────

  const Slide0Cover = () => (
    <div
      key="cover"
      className="slide-anim no-scrollbar flex flex-col items-center justify-center text-center overflow-y-auto flex-1 gap-4 px-5 py-8"
      style={{ background: 'linear-gradient(160deg, #0A1628 0%, #1B3A6B 60%, #0D2A50 100%)' }}
    >
      {/* C-TPAT Logo */}
      <div className="flex items-center justify-center w-24 h-24 rounded-2xl mb-1"
        style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.15)' }}>
        <img src={CtpatLogo} alt="CTPAT Logo" className="w-16 h-16 object-contain" />
      </div>

      <p className="font-jakarta text-[10px] font-bold tracking-[0.18em] uppercase" style={{ color: 'rgba(255,255,255,0.5)' }}>
        Materi Training · C-TPAT
      </p>

      <h1 className="font-playfair text-[clamp(28px,8vw,44px)] font-bold text-white leading-[1.1] tracking-tight">
        Customs-Trade<br />
        <em className="italic" style={{ color: '#5BA3D9' }}>Partnership</em><br />
        Against Terrorism
      </h1>

      <p className="font-jakarta text-sm leading-relaxed max-w-[300px]" style={{ color: 'rgba(255,255,255,0.65)' }}>
        {employeeName
          ? `Halo, ${employeeName}! Baca seluruh materi ini sebelum mengerjakan post-test.`
          : 'Pelajari 11 topik keamanan rantai pasok internasional bersama Zinus.'}
      </p>

      <div className="flex flex-wrap justify-center gap-1.5 mt-1">
        {['Employee ID', 'Visitor Controls', 'Container Inspection', 'Forced Labor', 'Anti-Money Laundering', '+ 6 topik lainnya'].map((t, i) => (
          <span
            key={i}
            className="font-jakarta text-[10px] font-semibold px-2.5 py-1 rounded-full"
            style={{ background: 'rgba(91,163,217,0.15)', border: '1px solid rgba(91,163,217,0.3)', color: '#93C7EA' }}
          >
            {t}
          </span>
        ))}
      </div>
    </div>
  )

  // ─── SLIDE 1: Pendahuluan ────────────────────────────────────────────────

  const Slide1Pendahuluan = () => (
    <div key="pendahuluan" className="slide-anim flex flex-col flex-1 overflow-hidden">
      <div ref={innerRef} onScroll={handleScroll} className="no-scrollbar flex-1 overflow-y-auto px-4 py-5 flex flex-col gap-4 max-w-[540px] w-full mx-auto">
        <div>
          <p className="font-jakarta text-[10px] font-bold tracking-[0.16em] uppercase mb-1" style={{ color: '#2471A3' }}>Pendahuluan</p>
          <h2 className="font-playfair text-[clamp(20px,5vw,28px)] font-bold leading-tight" style={{ color: '#0A1628' }}>Apa itu C-TPAT?</h2>
        </div>
        <p className="font-jakarta text-sm leading-relaxed" style={{ color: '#1A3A5C' }}>
          <strong>C-TPAT</strong> (Customs-Trade Partnership Against Terrorism) adalah program keamanan sukarela yang dikelola oleh <strong>U.S. Customs and Border Protection (CBP)</strong>, diluncurkan pada <strong>November 2002</strong> sebagai respons atas kejadian 9/11.
        </p>
        <div className="rounded-xl px-4 py-3 flex flex-col gap-2" style={{ background: '#0A1628' }}>
          <p className="font-jakarta text-[11px] font-bold tracking-[0.12em] uppercase" style={{ color: '#5BA3D9' }}>Tujuan Utama C-TPAT</p>
          {[
            'Meningkatkan keamanan rantai pasok internasional',
            'Mencegah masuknya barang ilegal, senjata, atau teroris melalui jalur perdagangan',
            'Membangun kemitraan antara sektor swasta dan pemerintah AS',
          ].map((t, i) => (
            <div key={i} className="flex items-start gap-2">
              <span className="flex-shrink-0 w-1.5 h-1.5 rounded-full mt-[6px]" style={{ background: '#5BA3D9' }} />
              <span className="font-jakarta text-[12px] leading-relaxed" style={{ color: 'rgba(255,255,255,0.75)' }}>{t}</span>
            </div>
          ))}
        </div>
        <div className="bg-white rounded-xl border p-4" style={{ borderColor: '#D6EAF8' }}>
          <p className="font-jakarta text-xs font-bold mb-3" style={{ color: '#1A5276' }}>11 Topik yang Akan Dipelajari</p>
          <div className="grid grid-cols-2 gap-1.5">
            {TOPIK.map((t) => (
              <div key={t.kode} className="flex items-center gap-1.5">
                <span className="font-jakarta text-[9px] font-bold px-1.5 py-0.5 rounded" style={{ background: '#EBF5FB', color: '#2471A3' }}>{t.kode}</span>
                <span className="font-jakarta text-[10px] leading-tight" style={{ color: '#1A3A5C' }}>{t.sub}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )

  // ─── SLIDE 2: Mengapa Penting ────────────────────────────────────────────

  const Slide2Mengapa = () => (
    <div key="mengapa" className="slide-anim flex flex-col flex-1 overflow-hidden">
      <div ref={innerRef} onScroll={handleScroll} className="no-scrollbar flex-1 overflow-y-auto px-4 py-5 flex flex-col gap-4 max-w-[540px] w-full mx-auto">
        <div>
          <p className="font-jakarta text-[10px] font-bold tracking-[0.16em] uppercase mb-1" style={{ color: '#2471A3' }}>Relevansi</p>
          <h2 className="font-playfair text-[clamp(20px,5vw,28px)] font-bold leading-tight" style={{ color: '#0A1628' }}>Mengapa C-TPAT Penting bagi Zinus?</h2>
        </div>
        <p className="font-jakarta text-sm leading-relaxed" style={{ color: '#1A3A5C' }}>
          Sebagai produsen furnitur yang mengekspor ke <strong>pasar Amerika Serikat</strong>, Zinus wajib memenuhi standar C-TPAT untuk menjaga kepercayaan pembeli dan kelancaran pengiriman.
        </p>
        <div className="grid grid-cols-1 gap-2.5">
          {[
            { icon: '🛡️', judul: 'Keamanan Rantai Pasok', detail: 'Memastikan setiap kontainer yang dikirim aman dari ancaman penyelundupan atau manipulasi.' },
            { icon: '✅', judul: 'Kepercayaan Pembeli', detail: 'Kepatuhan C-TPAT menjadi syarat utama bagi banyak retailer besar AS untuk bermitra.' },
            { icon: '⚡', judul: 'Kelancaran Pengiriman', detail: 'Perusahaan C-TPAT mendapat prioritas pemeriksaan di bea cukai AS, mengurangi risiko penundaan.' },
            { icon: '⚖️', judul: 'Kepatuhan Hukum', detail: 'Memenuhi regulasi perdagangan internasional dan standar hak asasi tenaga kerja global.' },
          ].map((item, i) => (
            <div key={i} className="flex items-start gap-3 bg-white rounded-xl p-3" style={{ border: '1px solid #D6EAF8', borderLeft: '3px solid #2471A3' }}>
              <span className="text-xl flex-shrink-0">{item.icon}</span>
              <div>
                <p className="font-jakarta text-xs font-bold mb-0.5" style={{ color: '#0A1628' }}>{item.judul}</p>
                <p className="font-jakarta text-[11px] leading-relaxed" style={{ color: '#1A5276' }}>{item.detail}</p>
              </div>
            </div>
          ))}
        </div>
        <div className="rounded-xl px-4 py-3 text-center" style={{ background: '#EBF5FB', border: '1px solid #AED6F1' }}>
          <p className="font-jakarta text-xs font-semibold" style={{ color: '#1A5276' }}>
            Setiap karyawan adalah bagian dari rantai keamanan C-TPAT
          </p>
        </div>
      </div>
    </div>
  )

  // ─── SLIDE 3–13: Topik ───────────────────────────────────────────────────

  const SlideTopik = ({ topik, idx }: { topik: typeof TOPIK[0]; idx: number }) => (
    <div key={`topik-${topik.kode}`} className="slide-anim flex flex-col flex-1 overflow-hidden">
      <div ref={innerRef} onScroll={handleScroll} className="no-scrollbar flex-1 overflow-y-auto px-4 py-5 flex flex-col gap-4 max-w-[540px] w-full mx-auto">

        {/* Hero */}
        <div
          className="topik-hero relative rounded-2xl overflow-hidden px-4 py-5 text-white"
          data-kode={topik.kode}
          style={{ background: topik.warna }}
        >
          <p className="font-jakarta text-[10px] font-bold tracking-[0.14em] uppercase text-white/70 mb-1">
            {topik.kode} · Topik {idx + 1} dari {TOPIK.length}
          </p>
          <p className="font-jakarta text-[11px] font-semibold text-white/60 mb-0.5">{topik.sub}</p>
          <p className="font-playfair text-[26px] font-bold leading-tight mb-1.5">{topik.nama}</p>
          <p className="font-jakarta text-[13px] text-white/85">{topik.tagline}</p>
        </div>

        {/* Deskripsi */}
        <p className="font-jakarta text-sm leading-relaxed" style={{ color: '#1A3A5C' }}>{topik.deskripsi}</p>

        <div className="h-px" style={{ background: '#D6EAF8' }} />

        {/* Poin-poin */}
        <div>
          <p className="font-jakarta text-[10px] font-bold tracking-[0.14em] uppercase mb-2" style={{ color: '#5D8AA8' }}>Yang Perlu Diketahui</p>
          <ul className="flex flex-col gap-2">
            {topik.poin.map((p, i) => (
              <li key={i} className="flex items-start gap-2.5 bg-white rounded-xl px-3 py-2.5" style={{ border: '1px solid #D6EAF8' }}>
                <span
                  className="flex-shrink-0 w-5 h-5 rounded-md flex items-center justify-center font-jakarta text-[9px] font-bold text-white mt-0.5"
                  style={{ background: topik.warna }}
                >
                  {i + 1}
                </span>
                <span className="font-jakarta text-[12px] leading-relaxed" style={{ color: '#1A3A5C' }}>{p}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Catatan */}
        <div className="rounded-xl px-3 py-3" style={{ background: '#EBF5FB', border: '1px solid #AED6F1' }}>
          <p className="font-jakarta text-[10px] font-bold tracking-[0.12em] uppercase mb-1" style={{ color: '#2471A3' }}>⚠ Catatan Penting</p>
          <p className="font-jakarta text-[12px] leading-relaxed" style={{ color: '#1A5276' }}>{topik.catatan}</p>
        </div>

      </div>
    </div>
  )

  // ─── SLIDE FINISH ────────────────────────────────────────────────────────

  const SlideFinish = () => (
    <div
      key="finish"
      className="slide-anim no-scrollbar flex flex-col flex-1 items-center justify-center text-center overflow-y-auto px-5 py-8 gap-4"
      style={{ background: 'linear-gradient(160deg, #0A1628 0%, #1B3A6B 60%, #0D2A50 100%)' }}
    >
      <div className="w-14 h-14 rounded-full flex items-center justify-center text-2xl flex-shrink-0" style={{ background: '#2471A3' }}>✓</div>
      <h2 className="font-playfair text-2xl font-bold" style={{ color: '#93C7EA' }}>Materi Selesai!</h2>
      <p className="font-jakarta text-[13px] leading-relaxed max-w-[280px]" style={{ color: 'rgba(255,255,255,0.55)' }}>
        {canFinish
          ? 'Kamu sudah membaca semua materi C-TPAT. Saatnya kerjakan Post-Test!'
          : `Kamu sudah membaca ${progress}% materi. Pastikan semua slide sudah dibuka sebelum melanjutkan.`}
      </p>
      <button
        onClick={onSelesai}
        disabled={!canFinish}
        className="font-jakarta font-bold text-sm text-white rounded-xl px-7 py-4 w-full max-w-[280px] mt-1 transition-all"
        style={{
          background: canFinish ? '#2471A3' : 'rgba(36,113,163,0.35)',
          cursor: canFinish ? 'pointer' : 'not-allowed',
        }}
      >
        Lanjut ke Post-Test →
      </button>
      {!canFinish && (
        <p className="font-jakarta text-[11px]" style={{ color: 'rgba(255,255,255,0.35)' }}>
          Kembali dan buka semua slide terlebih dahulu ({visited.size}/{TOTAL_SLIDES} slide terbuka)
        </p>
      )}
    </div>
  )

  // ─── SLIDE REGISTRY ──────────────────────────────────────────────────────

  const slides: React.ReactNode[] = [
    <Slide0Cover key="cover" />,
    <Slide1Pendahuluan key="pendahuluan" />,
    <Slide2Mengapa key="mengapa" />,
    ...TOPIK.map((t, i) => <SlideTopik key={t.kode} topik={t} idx={i} />),
    <SlideFinish key="finish" />,
  ]

  // ─── RENDER ──────────────────────────────────────────────────────────────

  return (
    <>
      <style>{minimalCss}</style>
      <div className="font-jakarta flex flex-col min-h-screen" style={{ background: '#F0F4FA' }}>

        {/* ── TOP BAR ── */}
        <div
          className="sticky top-0 z-50 flex items-center justify-between gap-2 bg-white px-3 h-14"
          style={{ borderBottom: '1px solid #D6EAF8' }}
        >
          {/* Logos */}
          <div className="flex items-center gap-2.5 flex-shrink-0">
            <img src={logoZinus} alt="Zinus" className="h-7 w-auto object-contain max-w-[80px]" loading="eager" />
            <div className="w-px h-5 flex-shrink-0" style={{ background: '#D6EAF8' }} />
            <img src={logoHyundai} alt="Hyundai" className="h-7 w-auto object-contain max-w-[80px]" loading="eager" />
          </div>
          {/* Progress */}
          <div className="flex-1 min-w-0 max-w-[120px]">
            <div className="h-1 rounded-full overflow-hidden" style={{ background: '#D6EAF8' }}>
              <div
                className="h-full rounded-full transition-all duration-300"
                style={{ width: `${progress}%`, background: '#2471A3' }}
              />
            </div>
            <p className="font-jakarta text-[10px] font-semibold text-right mt-0.5 tracking-wide whitespace-nowrap" style={{ color: '#2471A3' }}>
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
                background: 'rgba(10,22,40,0.92)',
                boxShadow: '0 2px 12px rgba(0,0,0,0.2)',
                whiteSpace: 'nowrap',
              }}
            >
              <span
                className="arrow-bounce w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0"
                style={{ background: '#2471A3' }}
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
          style={{ borderTop: '1px solid #D6EAF8', height: 68, paddingBottom: 'env(safe-area-inset-bottom, 0px)' }}
        >
          {/* PREV */}
          <button
            onClick={goPrev}
            disabled={slide === 0}
            aria-label="Slide sebelumnya"
            className="flex-shrink-0 w-11 h-11 rounded-full flex items-center justify-center transition-all active:scale-95"
            style={{
              background: slide === 0 ? '#D6EAF8' : '#2471A3',
              boxShadow: slide === 0 ? 'none' : '0 2px 8px rgba(36,113,163,0.35)',
            }}
          >
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="11,4 6,9 11,14" />
            </svg>
          </button>

          {/* Dots */}
          <div className="flex-1 flex items-center justify-center gap-1 overflow-x-auto no-scrollbar px-1" role="tablist">
            {Array.from({ length: TOTAL_SLIDES }).map((_, i) => (
              <button
                key={i}
                role="tab"
                aria-selected={slide === i}
                aria-label={`Slide ${i + 1}`}
                onClick={() => setSlide(i)}
                className="flex-shrink-0 rounded-full border-0 p-0 cursor-pointer transition-all duration-200"
                style={{
                  width: slide === i ? 10 : 6,
                  height: slide === i ? 10 : 6,
                  background: slide === i ? '#2471A3' : visited.has(i) ? '#85C1E9' : '#D6EAF8',
                  minWidth: 6,
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
              background: slide === TOTAL_SLIDES - 1 ? '#D6EAF8' : '#2471A3',
              boxShadow: slide === TOTAL_SLIDES - 1 ? 'none' : '0 2px 8px rgba(36,113,163,0.35)',
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