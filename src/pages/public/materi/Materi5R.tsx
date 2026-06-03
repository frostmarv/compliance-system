import { useState, useEffect, useCallback, useRef } from 'react'
import logoZinus from '@/assets/zinus-tulisan-putih-contour.webp'
import logoHyundai from '@/assets/hyundai-ori-hitam.png'

interface Materi5RProps {
  employeeName?: string
  onSelesai: () => void
}

// ─── DATA ───────────────────────────────────────────────────────────────────

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

// Slides: 0 = cover, 1 = pendahuluan, 2 = masalah, 3 = manfaat, 4..8 = S1..S5, 9 = finish
const TOTAL_SLIDES = 10

// ─── STYLES ──────────────────────────────────────────────────────────────────

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700&family=Playfair+Display:ital,wght@0,700;1,700&display=swap');

*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; -webkit-tap-highlight-color: transparent; }

.sr-wrapper {
  font-family: 'Plus Jakarta Sans', sans-serif;
  background: #F0FAF9;
  min-height: 100vh;
  min-height: 100dvh;
  display: flex;
  flex-direction: column;
  -webkit-text-size-adjust: 100%;
}

/* ── TOP BAR ── */
.sr-topbar {
  position: sticky;
  top: 0;
  z-index: 100;
  background: #fff;
  border-bottom: 1px solid #D4EDE9;
  padding: 0 12px;
  height: 56px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
}
.sr-logos {
  display: flex;
  align-items: center;
  gap: 10px;
  flex-shrink: 0;
}
.sr-logo {
  height: 28px;
  width: auto;
  object-fit: contain;
  max-width: 80px;
}
.sr-logo-divider {
  width: 1px;
  height: 20px;
  background: #D4EDE9;
  flex-shrink: 0;
}
.sr-progress-wrap {
  flex: 1;
  min-width: 0;
  max-width: 120px;
}
.sr-progress-track {
  height: 4px;
  background: #D4EDE9;
  border-radius: 99px;
  overflow: hidden;
}
.sr-progress-fill {
  height: 100%;
  background: #329F96;
  border-radius: 99px;
  transition: width 0.4s ease;
}
.sr-progress-label {
  font-size: 10px;
  color: #329F96;
  font-weight: 600;
  margin-top: 3px;
  text-align: right;
  letter-spacing: 0.04em;
  white-space: nowrap;
}

/* ── SLIDE CONTAINER ── */
.sr-slides {
  flex: 1;
  overflow: hidden;
  position: relative;
}
.sr-slide {
  display: none;
  min-height: calc(100dvh - 56px - 64px);
  flex-direction: column;
  animation: sr-fadein 0.35s ease;
  -webkit-overflow-scrolling: touch;
}
.sr-slide.active {
  display: flex;
}
@keyframes sr-fadein {
  from { opacity: 0; transform: translateY(8px); }
  to   { opacity: 1; transform: translateY(0); }
}

/* ── SCROLL INDICATOR ── */
.sr-scroll-hint {
  position: fixed;
  bottom: 80px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 90;
  background: rgba(13, 61, 58, 0.95);
  color: #fff;
  font-size: 11px;
  font-weight: 600;
  padding: 8px 16px;
  border-radius: 20px;
  display: flex;
  align-items: center;
  gap: 6px;
  box-shadow: 0 4px 20px rgba(0,0,0,0.15);
  animation: sr-hint-pulse 2s ease-in-out infinite, sr-hint-fadein 0.3s ease;
  pointer-events: none;
  white-space: nowrap;
}
.sr-scroll-hint::after {
  content: '';
  width: 6px; height: 6px;
  border-right: 2px solid #329F96;
  border-bottom: 2px solid #329F96;
  transform: rotate(45deg);
  animation: sr-hint-bounce 1.5s ease infinite;
}
@keyframes sr-hint-pulse {
  0%, 100% { opacity: 0.95; transform: translateX(-50%) scale(1); }
  50% { opacity: 1; transform: translateX(-50%) scale(1.02); }
}
@keyframes sr-hint-bounce {
  0%, 100% { transform: rotate(45deg) translate(0, 0); }
  50% { transform: rotate(45deg) translate(3px, 3px); }
}
@keyframes sr-hint-fadein {
  from { opacity: 0; transform: translateX(-50%) translateY(10px); }
  to { opacity: 0.95; transform: translateX(-50%) translateY(0); }
}
.sr-scroll-hint.hidden {
  display: none;
}

/* ── BOTTOM NAV ── */
.sr-nav {
  position: sticky;
  bottom: 0;
  z-index: 100;
  background: #fff;
  border-top: 1px solid #D4EDE9;
  height: 64px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 12px;
  gap: 8px;
  -webkit-padding-bottom: env(safe-area-inset-bottom);
  padding-bottom: env(safe-area-inset-bottom);
}
.sr-nav-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 44px;
  height: 44px;
  border-radius: 50%;
  border: 1.5px solid #D4EDE9;
  background: #fff;
  cursor: pointer;
  transition: all 0.15s;
  color: #329F96;
  font-size: 20px;
  font-weight: 700;
  flex-shrink: 0;
  min-width: 44px;
  -webkit-tap-highlight-color: transparent;
  line-height: 1;
}
.sr-nav-btn:active:not(:disabled) { 
  background: #E6F6F5; 
  border-color: #329F96; 
  transform: scale(0.98);
}
.sr-nav-btn:hover:not(:disabled) { background: #E6F6F5; border-color: #329F96; }
.sr-nav-btn:disabled { opacity: 0.3; cursor: not-allowed; }
.sr-nav-dots {
  display: flex;
  align-items: center;
  gap: 6px;
  flex: 1;
  justify-content: center;
  overflow-x: auto;
  overflow-y: hidden;
  padding: 0 4px;
  scrollbar-width: none;
  -ms-overflow-style: none;
}
.sr-nav-dots::-webkit-scrollbar { display: none; }
.sr-nav-dot {
  width: 8px; height: 8px;
  border-radius: 50%;
  background: #C8E6E4;
  transition: all 0.2s;
  flex-shrink: 0;
  border: none;
  padding: 0;
  cursor: pointer;
  min-width: 8px;
  -webkit-tap-highlight-color: transparent;
}
.sr-nav-dot:active { transform: scale(1.2); }
.sr-nav-dot.on { background: #329F96; transform: scale(1.4); }

/* ── SLIDE INNER SHARED ── */
.sr-inner {
  padding: 20px 16px 28px;
  max-width: 540px;
  width: 100%;
  margin: 0 auto;
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 18px;
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;
}

/* ── COVER SLIDE ── */
.sr-cover {
  background: #329F96;
  justify-content: center;
  align-items: center;
  text-align: center;
  padding: 32px 20px;
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 14px;
}
.sr-cover-eyebrow {
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: rgba(255,255,255,0.7);
}
.sr-cover-title {
  font-family: 'Playfair Display', serif;
  font-size: clamp(32px, 9vw, 48px);
  font-weight: 700;
  color: #fff;
  line-height: 1.1;
  letter-spacing: -0.02em;
  word-break: keep-all;
}
.sr-cover-title em {
  font-style: italic;
  color: #C2EDE9;
}
.sr-cover-sub {
  font-size: 14px;
  color: rgba(255,255,255,0.9);
  line-height: 1.6;
  max-width: 300px;
}
.sr-cover-pills {
  display: flex;
  gap: 6px;
  flex-wrap: wrap;
  justify-content: center;
  margin-top: 4px;
}
.sr-cover-pill {
  background: rgba(255,255,255,0.15);
  border: 1px solid rgba(255,255,255,0.25);
  border-radius: 99px;
  padding: 4px 12px;
  font-size: 12px;
  font-weight: 600;
  color: #fff;
  white-space: nowrap;
}

/* ── SECTION LABEL ── */
.sr-eyebrow {
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  color: #329F96;
}
.sr-h2 {
  font-family: 'Playfair Display', serif;
  font-size: clamp(20px, 5vw, 28px);
  font-weight: 700;
  color: #0D3D3A;
  line-height: 1.25;
  letter-spacing: -0.01em;
}
.sr-body {
  font-size: 14px;
  line-height: 1.7;
  color: #2D5C58;
}

/* ── CHAIN ── */
.sr-chain {
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
  align-items: center;
  background: #0D3D3A;
  border-radius: 10px;
  padding: 10px 12px;
}
.sr-chain-item {
  font-size: 11px;
  font-weight: 600;
  color: #C2EDE9;
  padding: 2px 4px;
}
.sr-chain-arrow { font-size: 10px; color: rgba(255,255,255,0.35); }

/* ── MASALAH CARDS ── */
.sr-masalah-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
}
@media (max-width: 360px) { .sr-masalah-grid { grid-template-columns: 1fr; } }
.sr-masalah-card {
  background: #fff;
  border: 1px solid #D4EDE9;
  border-left: 3px solid #329F96;
  border-radius: 10px;
  padding: 12px;
}
.sr-masalah-icon { font-size: 18px; margin-bottom: 5px; display: block; }
.sr-masalah-text { font-size: 11px; line-height: 1.55; color: #2D5C58; }

/* ── SOLUSI BAR ── */
.sr-solusi {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 10px 14px;
  background: #0D3D3A;
  border-radius: 10px;
  color: #fff;
  font-size: 12px;
  font-weight: 600;
  flex-wrap: wrap;
  text-align: center;
}
.sr-solusi-badge {
  background: #329F96;
  color: #fff;
  border-radius: 6px;
  padding: 2px 10px;
  font-size: 12px;
  font-weight: 700;
}

/* ── QCDSM ── */
.sr-qcdsm {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
}
.sr-qcdsm-last { grid-column: 1 / -1; max-width: 180px; margin: 0 auto; width: 100%; }
.sr-qcdsm-card {
  background: #fff;
  border: 1px solid #D4EDE9;
  border-radius: 10px;
  padding: 12px 10px;
  text-align: center;
}
.sr-qcdsm-circle {
  width: 36px; height: 36px;
  border-radius: 50%;
  background: #329F96;
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: 'Playfair Display', serif;
  font-size: 16px;
  font-weight: 700;
  color: #fff;
  margin: 0 auto 7px;
  flex-shrink: 0;
}
.sr-qcdsm-label { font-size: 11px; font-weight: 700; color: #0D3D3A; margin-bottom: 3px; }
.sr-qcdsm-detail { font-size: 10px; color: #5A8A86; line-height: 1.45; }

/* ── PILAR HEADER ── */
.sr-pilar-hero {
  background: #329F96;
  border-radius: 14px;
  padding: 18px 16px;
  color: #fff;
  position: relative;
  overflow: hidden;
}
.sr-pilar-hero::after {
  content: attr(data-kode);
  position: absolute;
  right: -8px; top: -10px;
  font-family: 'Playfair Display', serif;
  font-size: 72px;
  font-weight: 700;
  color: rgba(255,255,255,0.08);
  line-height: 1;
  pointer-events: none;
  user-select: none;
}
.sr-pilar-kode-row {
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: rgba(255,255,255,0.75);
  margin-bottom: 4px;
}
.sr-pilar-nama {
  font-family: 'Playfair Display', serif;
  font-size: 28px;
  font-weight: 700;
  line-height: 1;
  margin-bottom: 5px;
}
.sr-pilar-tagline { font-size: 13px; color: rgba(255,255,255,0.9); }

/* ── PILAR CONTENT ── */
.sr-pilar-desc {
  font-size: 14px;
  line-height: 1.7;
  color: #2D5C58;
}
.sr-sub-title {
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: #5A8A86;
  margin-bottom: 8px;
}
.sr-ul {
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 7px;
}
.sr-ul li {
  display: flex;
  align-items: flex-start;
  gap: 7px;
  font-size: 13px;
  line-height: 1.55;
  color: #2D5C58;
}
.sr-ul-dot {
  flex-shrink: 0;
  width: 5px; height: 5px;
  border-radius: 50%;
  background: #329F96;
  margin-top: 6px;
}

/* ── STEPS ── */
.sr-steps { display: flex; flex-direction: column; gap: 7px; }
.sr-step {
  display: flex;
  align-items: flex-start;
  gap: 10px;
  background: #fff;
  border: 1px solid #D4EDE9;
  border-radius: 10px;
  padding: 10px;
}
.sr-step-num {
  flex-shrink: 0;
  width: 26px; height: 26px;
  border-radius: 6px;
  background: #329F96;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 10px;
  font-weight: 700;
  color: #fff;
}
.sr-step-judul { font-size: 12px; font-weight: 600; color: #0D3D3A; margin-bottom: 2px; }
.sr-step-detail { font-size: 11px; color: #5A8A86; line-height: 1.45; }

/* ── TABLE ── */
.sr-table-wrap {
  overflow-x: auto;
  border: 1px solid #D4EDE9;
  border-radius: 10px;
  -webkit-overflow-scrolling: touch;
}
.sr-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 11px;
  min-width: 280px;
}
.sr-table th {
  background: #0D3D3A;
  color: #C2EDE9;
  padding: 8px 9px;
  font-size: 9px;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  text-align: left;
  white-space: nowrap;
}
.sr-table th:first-child { border-radius: 9px 0 0 0; }
.sr-table th:last-child { border-radius: 0 9px 0 0; }
.sr-table td {
  padding: 8px 9px;
  border-bottom: 1px solid #E6F3F2;
  color: #2D5C58;
  line-height: 1.45;
  vertical-align: top;
}
.sr-table tr:last-child td { border-bottom: none; }
.sr-table tr:nth-child(odd) td { background: #F7FFFE; }

/* ── FINISH SLIDE ── */
.sr-finish {
  background: #0D3D3A;
  justify-content: center;
  align-items: center;
  text-align: center;
  padding: 32px 20px;
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 14px;
}
.sr-finish-icon {
  width: 56px; height: 56px;
  border-radius: 50%;
  background: #329F96;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  margin: 0 auto;
  flex-shrink: 0;
}
.sr-finish-title {
  font-family: 'Playfair Display', serif;
  font-size: 24px;
  font-weight: 700;
  color: #C2EDE9;
  letter-spacing: -0.01em;
}
.sr-finish-sub { font-size: 13px; color: rgba(255,255,255,0.6); line-height: 1.65; }
.sr-finish-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  background: #329F96;
  color: #fff;
  border: none;
  border-radius: 12px;
  padding: 14px 28px;
  font-size: 14px;
  font-weight: 700;
  cursor: pointer;
  font-family: 'Plus Jakarta Sans', sans-serif;
  transition: all 0.2s;
  margin-top: 4px;
  min-height: 48px;
  width: 100%;
  max-width: 280px;
  -webkit-tap-highlight-color: transparent;
}
.sr-finish-btn:active:not(:disabled) {
  background: #2A8A82;
  transform: translateY(1px);
}
.sr-finish-btn:hover:not(:disabled) {
  background: #2A8A82;
  transform: translateY(-1px);
}
.sr-finish-btn:disabled {
  opacity: 0.4;
  cursor: not-allowed;
  transform: none;
}
.sr-finish-hint { font-size: 11px; color: rgba(255,255,255,0.4); }

/* ── CARD WRAP ── */
.sr-card {
  background: #fff;
  border: 1px solid #D4EDE9;
  border-radius: 12px;
  padding: 14px;
}
.sr-divider { height: 1px; background: #E6F3F2; border: none; }

/* ── SLIDE PILAR TINT ── */
.sr-slide[data-pilar="S2"] .sr-pilar-hero,
.sr-slide[data-pilar="S2"] .sr-step-num,
.sr-slide[data-pilar="S2"] .sr-qcdsm-circle { background: #2A7D76; }
.sr-slide[data-pilar="S3"] .sr-pilar-hero,
.sr-slide[data-pilar="S3"] .sr-step-num { background: #1E6B64; }
.sr-slide[data-pilar="S4"] .sr-pilar-hero,
.sr-slide[data-pilar="S4"] .sr-step-num { background: #155955; }
.sr-slide[data-pilar="S5"] .sr-pilar-hero,
.sr-slide[data-pilar="S5"] .sr-step-num { background: #0D3D3A; }

/* ── MOBILE OPTIMIZATIONS ── */
@media (max-width: 375px) {
  .sr-topbar { padding: 0 10px; height: 52px; }
  .sr-logo { height: 24px; max-width: 70px; }
  .sr-nav { height: 60px; padding: 0 10px; }
  .sr-nav-btn { width: 40px; height: 40px; font-size: 18px; }
  .sr-inner { padding: 16px 14px 24px; gap: 16px; }
  .sr-pilar-hero { padding: 16px 14px; }
  .sr-pilar-nama { font-size: 26px; }
  .sr-step { padding: 9px; gap: 9px; }
  .sr-step-num { width: 24px; height: 24px; font-size: 9px; }
  .sr-qcdsm-circle { width: 32px; height: 32px; font-size: 14px; }
  .sr-scroll-hint { bottom: 76px; font-size: 10px; padding: 7px 14px; }
}

/* ── SAFE AREA SUPPORT ── */
@supports (padding: max(0px)) {
  .sr-wrapper { padding-left: env(safe-area-inset-left); padding-right: env(safe-area-inset-right); }
  .sr-topbar { padding-left: max(12px, env(safe-area-inset-left)); padding-right: max(12px, env(safe-area-inset-right)); }
  .sr-nav { padding-left: max(12px, env(safe-area-inset-left)); padding-right: max(12px, env(safe-area-inset-right)); }
  .sr-inner { padding-left: max(16px, env(safe-area-inset-left)); padding-right: max(16px, env(safe-area-inset-right)); }
}
`

// ─── COMPONENT ───────────────────────────────────────────────────────────────

export default function Materi5R({ employeeName, onSelesai }: Materi5RProps) {
  const [slide, setSlide] = useState(0)
  const [visited, setVisited] = useState<Set<number>>(new Set([0]))
  const [showScrollHint, setShowScrollHint] = useState(false)
  const scrollContainerRef = useRef<HTMLDivElement>(null)
  const hintTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  // Mark slide as visited
  useEffect(() => {
    setVisited(prev => new Set([...prev, slide]))
  }, [slide])

  // Reset scroll hint when slide changes
  useEffect(() => {
    setShowScrollHint(false)
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTop = 0
    }
    // Show hint after short delay for slides with scrollable content
    if (slide > 0 && slide < TOTAL_SLIDES - 1) {
      hintTimeoutRef.current = setTimeout(() => {
        checkScrollable()
      }, 800)
    }
    return () => {
      if (hintTimeoutRef.current) clearTimeout(hintTimeoutRef.current)
    }
  }, [slide])

  const checkScrollable = useCallback(() => {
    const el = scrollContainerRef.current
    if (!el) return
    const isScrollable = el.scrollHeight > el.clientHeight + 20
    const isAtBottom = el.scrollTop + el.clientHeight >= el.scrollHeight - 10
    setShowScrollHint(isScrollable && !isAtBottom)
  }, [])

  const handleScroll = useCallback(() => {
    checkScrollable()
  }, [checkScrollable])

  const goNext = useCallback(() => {
    setSlide(s => Math.min(s + 1, TOTAL_SLIDES - 1))
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [])

  const goPrev = useCallback(() => {
    setSlide(s => Math.max(s - 1, 0))
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [])

  const canFinish = visited.size >= TOTAL_SLIDES - 1
  const progress = Math.round((visited.size / TOTAL_SLIDES) * 100)

  const LogoBar = () => (
    <div className="sr-logos">
      <img src={logoZinus} alt="Zinus" className="sr-logo" loading="eager" />
      <div className="sr-logo-divider" />
      <img src={logoHyundai} alt="Hyundai" className="sr-logo" loading="eager" />
    </div>
  )

  // ─── SLIDES ───

  const Slide0_Cover = () => (
    <div className="sr-slide active sr-cover">
      <div className="sr-cover-eyebrow">Materi Training · 5R</div>
      <h1 className="sr-cover-title">
        Mengenal<br /><em>5R</em> di<br />Tempat Kerja
      </h1>
      <p className="sr-cover-sub">
        {employeeName
          ? `Halo, ${employeeName}! Baca seluruh materi ini sebelum mengerjakan post-test.`
          : 'Pelajari metode 5R untuk tempat kerja yang efisien, aman, dan nyaman.'}
      </p>
      <div className="sr-cover-pills">
        {PILAR.map(p => (
          <span key={p.kode} className="sr-cover-pill">{p.kode} · {p.nama}</span>
        ))}
      </div>
    </div>
  )

  const Slide1_Pendahuluan = () => (
    <div className="sr-slide active">
      <div className="sr-inner" ref={scrollContainerRef} onScroll={handleScroll}>
        <div>
          <p className="sr-eyebrow">Pendahuluan</p>
          <h2 className="sr-h2">Mengapa 5R Penting?</h2>
        </div>
        <p className="sr-body">
          5R adalah metode pengelolaan tempat kerja yang melibatkan <strong>semua orang</strong> di area kerja.
          5R menjadi dasar penting dalam melakukan aktivitas perbaikan lainnya dan menciptakan budaya kerja
          dalam memelihara tempat kerja. Tujuan akhirnya adalah menciptakan <strong>budaya disiplin</strong>
          melalui rantai perubahan:
        </p>
        <div className="sr-chain">
          {['Tempat Kerja', '→', 'Perilaku', '→', 'Kebiasaan', '→', 'Sikap', '→', 'Budaya'].map((t, i) => (
            <span key={i} className={t === '→' ? 'sr-chain-arrow' : 'sr-chain-item'}>{t}</span>
          ))}
        </div>
        <div className="sr-card" style={{ textAlign: 'center', padding: '18px 14px' }}>
          <p style={{ fontSize: 12, color: '#5A8A86', marginBottom: 8 }}>5R terdiri dari 5 Pilar</p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: 6, flexWrap: 'wrap' }}>
            {PILAR.map((p, i) => (
              <div key={p.kode} style={{
                background: `rgba(50,159,150,${0.12 + i * 0.12})`,
                borderRadius: 8,
                padding: '5px 10px',
                fontSize: 12,
                fontWeight: 700,
                color: '#0D3D3A',
              }}>
                {p.kode} {p.nama}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )

  const Slide2_Masalah = () => (
    <div className="sr-slide active">
      <div className="sr-inner" ref={scrollContainerRef} onScroll={handleScroll}>
        <div>
          <p className="sr-eyebrow">Tanpa 5R</p>
          <h2 className="sr-h2">Masalah yang Terjadi</h2>
        </div>
        <div className="sr-masalah-grid">
          {MASALAH.map((m, i) => (
            <div className="sr-masalah-card" key={i}>
              <span className="sr-masalah-icon">{m.icon}</span>
              <p className="sr-masalah-text">{m.teks}</p>
            </div>
          ))}
        </div>
        <div className="sr-solusi">
          <span>Semua masalah ini dapat diselesaikan dengan</span>
          <span className="sr-solusi-badge">5R</span>
        </div>
      </div>
    </div>
  )

  const Slide3_Manfaat = () => (
    <div className="sr-slide active">
      <div className="sr-inner" ref={scrollContainerRef} onScroll={handleScroll}>
        <div>
          <p className="sr-eyebrow">Manfaat Penerapan</p>
          <h2 className="sr-h2">Dampak 5R pada Kinerja</h2>
        </div>
        <div className="sr-qcdsm">
          {MANFAAT.map((m, i) => (
            <div key={m.kode} className={`sr-qcdsm-card${i === 4 ? ' sr-qcdsm-last' : ''}`}>
              <div className="sr-qcdsm-circle">{m.kode}</div>
              <div className="sr-qcdsm-label">{m.label}</div>
              <div className="sr-qcdsm-detail">{m.detail}</div>
            </div>
          ))}
        </div>
        <p className="sr-body" style={{ textAlign: 'center', fontSize: 13 }}>
          Penerapan 5R yang konsisten menghasilkan lingkungan kerja yang lebih aman, efisien, dan produktif.
        </p>
      </div>
    </div>
  )

  const SlidePilar = ({ pilar, idx }: { pilar: typeof PILAR[0]; idx: number }) => (
    <div className="sr-slide active" data-pilar={pilar.kode}>
      <div className="sr-inner" ref={scrollContainerRef} onScroll={handleScroll}>
        {/* Hero header */}
        <div className="sr-pilar-hero" data-kode={pilar.kode} style={{ background: pilar.warna }}>
          <div className="sr-pilar-kode-row">{pilar.kode} · {pilar.jepang} · Pilar {idx + 1} dari 5</div>
          <div className="sr-pilar-nama">{pilar.nama}</div>
          <div className="sr-pilar-tagline">{pilar.tagline}</div>
        </div>

        {/* Deskripsi */}
        <p className="sr-pilar-desc">{pilar.deskripsi}</p>

        <hr className="sr-divider" />

        {/* Tujuan */}
        <div>
          <p className="sr-sub-title">Tujuan</p>
          <ul className="sr-ul">
            {pilar.tujuan.map((t, i) => (
              <li key={i}><span className="sr-ul-dot" style={{ background: pilar.warna }} />{t}</li>
            ))}
          </ul>
        </div>

        {/* Manfaat */}
        <div>
          <p className="sr-sub-title">Manfaat</p>
          <ul className="sr-ul">
            {pilar.manfaat.map((m, i) => (
              <li key={i}><span className="sr-ul-dot" style={{ background: pilar.warna }} />{m}</li>
            ))}
          </ul>
        </div>

        {/* Aktivitas */}
        <div>
          <p className="sr-sub-title">Langkah Aktivitas</p>
          <div className="sr-steps">
            {pilar.aktivitas.map(a => (
              <div className="sr-step" key={a.step}>
                <div className="sr-step-num" style={{ background: pilar.warna }}>{a.step}</div>
                <div>
                  <div className="sr-step-judul">{a.judul}</div>
                  <div className="sr-step-detail">{a.detail}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Tabel */}
        {pilar.tabel.length > 0 && (
          <div>
            <p className="sr-sub-title">Panduan Pelaksanaan</p>
            <div className="sr-table-wrap">
              <table className="sr-table">
                <thead>
                  <tr>
                    <th>Kategori</th>
                    <th>Kondisi</th>
                    <th>Tindakan</th>
                  </tr>
                </thead>
                <tbody>
                  {pilar.tabel.map((row, i) => (
                    <tr key={i}>
                      <td><strong>{row.frek}</strong></td>
                      <td>{row.contoh}</td>
                      <td>{row.aksi}</td>
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

  const Slide9_Finish = () => (
    <div className="sr-slide active sr-finish">
      <div className="sr-finish-icon">✓</div>
      <h2 className="sr-finish-title">Materi Selesai!</h2>
      <p className="sr-finish-sub">
        {canFinish
          ? 'Kamu sudah membaca semua materi 5R. Saatnya kerjakan Post-Test!'
          : `Kamu sudah membaca ${progress}% materi. Pastikan semua slide sudah dibuka sebelum melanjutkan.`}
      </p>
      <button className="sr-finish-btn" onClick={onSelesai} disabled={!canFinish}>
        Lanjut ke Post-Test →
      </button>
      {!canFinish && (
        <p className="sr-finish-hint">
          Kembali dan buka semua slide terlebih dahulu ({visited.size}/{TOTAL_SLIDES} slide terbuka)
        </p>
      )}
    </div>
  )

  const SLIDE_COMPONENTS: React.ReactNode[] = [
    <Slide0_Cover key={0} />,
    <Slide1_Pendahuluan key={1} />,
    <Slide2_Masalah key={2} />,
    <Slide3_Manfaat key={3} />,
    ...PILAR.map((p, i) => <SlidePilar key={p.kode} pilar={p} idx={i} />),
    <Slide9_Finish key={9} />,
  ]

  return (
    <>
      <style>{CSS}</style>
      <div className="sr-wrapper">

        {/* Top Bar */}
        <div className="sr-topbar">
          <LogoBar />
          <div className="sr-progress-wrap">
            <div className="sr-progress-track">
              <div className="sr-progress-fill" style={{ width: `${progress}%` }} />
            </div>
            <div className="sr-progress-label">{progress}% terbaca</div>
          </div>
        </div>

        {/* Slides */}
        <div className="sr-slides">
          {SLIDE_COMPONENTS[slide]}
        </div>

        {/* Scroll Hint Indicator */}
        {showScrollHint && slide > 0 && slide < TOTAL_SLIDES - 1 && (
          <div className="sr-scroll-hint">Gulir ke bawah</div>
        )}

        {/* Bottom Nav */}
        <div className="sr-nav">
          <button
            className="sr-nav-btn"
            onClick={goPrev}
            disabled={slide === 0}
            aria-label="Slide sebelumnya"
          >
            &lt;
          </button>

          <div className="sr-nav-dots" role="tablist" aria-label="Navigasi slide">
            {Array.from({ length: TOTAL_SLIDES }).map((_, i) => (
              <button
                key={i}
                className={`sr-nav-dot${slide === i ? ' on' : ''}`}
                style={visited.has(i) && slide !== i ? { background: '#9CCEC9' } : {}}
                onClick={() => {
                  setSlide(i)
                  window.scrollTo({ top: 0, behavior: 'smooth' })
                }}
                aria-label={`Slide ${i + 1}`}
                role="tab"
                aria-selected={slide === i}
              />
            ))}
          </div>

          <button
            className="sr-nav-btn"
            onClick={goNext}
            disabled={slide === TOTAL_SLIDES - 1}
            aria-label="Slide berikutnya"
          >
            &gt;
          </button>
        </div>

      </div>
    </>
  )
}