import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'

// ── Types ────────────────────────────────────────────────────────────────────
interface Stats {
  totalKaryawan: number
  totalSoal: number
  rataRata: number
  tertinggi: number
  terendah: number
}

interface HasilTerbaru {
  id: string
  nama: string
  quiz_title: string
  skor: number
  created_at: string
}

interface ScoreTrend {
  tanggal: string
  rata: number
}

interface DistribusiSkor {
  range: string
  jumlah: number
}

// ── Stat Card ────────────────────────────────────────────────────────────────
function StatCard({
  label,
  value,
  sub,
  icon,
  accent,
  delay,
}: {
  label: string
  value: string | number
  sub?: string
  icon: React.ReactNode
  accent: string
  delay: string
}) {
  return (
    <div
      className="relative rounded-2xl p-5 overflow-hidden animate-fadein"
      style={{
        background: 'white',
        boxShadow: '0 1px 3px rgba(0,0,0,0.07), 0 8px 24px rgba(0,0,0,0.05)',
        animationDelay: delay,
        animationFillMode: 'both',
      }}
    >
      {/* Accent bar */}
      <div
        className="absolute top-0 left-0 w-1 h-full rounded-l-2xl"
        style={{ background: accent }}
      />
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-semibold tracking-widest uppercase text-gray-400 mb-1">
            {label}
          </p>
          <p className="text-3xl font-bold text-gray-800 leading-none">{value}</p>
          {sub && <p className="text-xs text-gray-400 mt-1.5">{sub}</p>}
        </div>
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center"
          style={{ background: accent + '18', color: accent }}
        >
          {icon}
        </div>
      </div>
    </div>
  )
}

// ── Custom Tooltip ────────────────────────────────────────────────────────────
function CustomTooltip({ active, payload, label }: any) {
  if (active && payload && payload.length) {
    return (
      <div
        className="rounded-xl px-3 py-2 text-xs shadow-lg"
        style={{ background: '#1a7a73', color: 'white' }}
      >
        <p className="font-semibold mb-0.5">{label}</p>
        <p>Rata-rata: <strong>{payload[0].value.toFixed(1)}</strong></p>
      </div>
    )
  }
  return null
}

function BarTooltip({ active, payload, label }: any) {
  if (active && payload && payload.length) {
    return (
      <div
        className="rounded-xl px-3 py-2 text-xs shadow-lg"
        style={{ background: '#329F96', color: 'white' }}
      >
        <p className="font-semibold mb-0.5">{label}</p>
        <p>{payload[0].value} peserta</p>
      </div>
    )
  }
  return null
}

// ── Score Badge ───────────────────────────────────────────────────────────────
function ScoreBadge({ skor }: { skor: number }) {
  const color =
    skor >= 80 ? '#10b981' : skor >= 60 ? '#f59e0b' : '#ef4444'
  const bg =
    skor >= 80 ? '#d1fae5' : skor >= 60 ? '#fef3c7' : '#fee2e2'
  return (
    <span
      className="inline-block px-2.5 py-0.5 rounded-full text-xs font-bold"
      style={{ background: bg, color }}
    >
      {skor}
    </span>
  )
}

// ── Main Dashboard ────────────────────────────────────────────────────────────
export default function Dashboard() {
  const [stats, setStats] = useState<Stats>({
    totalKaryawan: 0,
    totalSoal: 0,
    rataRata: 0,
    tertinggi: 0,
    terendah: 0,
  })
  const [hasilTerbaru, setHasilTerbaru] = useState<HasilTerbaru[]>([])
  const [scoreTrend, setScoreTrend] = useState<ScoreTrend[]>([])
  const [distribusi, setDistribusi] = useState<DistribusiSkor[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchAll()
  }, [])

  async function fetchAll() {
    setLoading(true)
    try {
      // Total karyawan
      const { count: karyawanCount } = await supabase
        .from('karyawan')
        .select('*', { count: 'exact', head: true })

      // Total soal
      const { count: soalCount } = await supabase
        .from('soal')
        .select('*', { count: 'exact', head: true })

      // Statistik skor dari hasil_ujian
      const { data: hasilData } = await supabase
        .from('hasil_ujian')
        .select('id, nama, quiz_title, skor, created_at')
        .order('created_at', { ascending: false })

      if (hasilData && hasilData.length > 0) {
        const skors = hasilData.map((h) => h.skor)
        const rata = skors.reduce((a, b) => a + b, 0) / skors.length
        const maks = Math.max(...skors)
        const min = Math.min(...skors)

        setStats({
          totalKaryawan: karyawanCount ?? 0,
          totalSoal: soalCount ?? 0,
          rataRata: Math.round(rata * 10) / 10,
          tertinggi: maks,
          terendah: min,
        })

        // Hasil terbaru (5)
        setHasilTerbaru(hasilData.slice(0, 5))

        // Trend skor 7 hari terakhir
        const trendMap: Record<string, number[]> = {}
        hasilData.forEach((h) => {
          const tgl = new Date(h.created_at).toLocaleDateString('id-ID', {
            day: '2-digit',
            month: 'short',
          })
          if (!trendMap[tgl]) trendMap[tgl] = []
          trendMap[tgl].push(h.skor)
        })
        const trend = Object.entries(trendMap)
          .slice(-7)
          .map(([tanggal, arr]) => ({
            tanggal,
            rata: Math.round((arr.reduce((a, b) => a + b, 0) / arr.length) * 10) / 10,
          }))
        setScoreTrend(trend)

        // Distribusi skor
        const dist = [
          { range: '0–39', jumlah: skors.filter((s) => s < 40).length },
          { range: '40–59', jumlah: skors.filter((s) => s >= 40 && s < 60).length },
          { range: '60–79', jumlah: skors.filter((s) => s >= 60 && s < 80).length },
          { range: '80–100', jumlah: skors.filter((s) => s >= 80).length },
        ]
        setDistribusi(dist)
      } else {
        setStats({
          totalKaryawan: karyawanCount ?? 0,
          totalSoal: soalCount ?? 0,
          rataRata: 0,
          tertinggi: 0,
          terendah: 0,
        })
      }
    } catch (err) {
      console.error(err)
    }
    setLoading(false)
  }

  const formatTanggal = (iso: string) =>
    new Date(iso).toLocaleDateString('id-ID', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    })

  return (
    <>
      <style>{`
        @keyframes fadein {
          from { opacity: 0; transform: translateY(14px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .animate-fadein { animation: fadein 0.45s ease both; }
      `}</style>

      <div className="min-h-screen bg-gray-50 p-7 space-y-7">

        {/* ── Header ─────────────────────────────────────────── */}
        <div className="animate-fadein" style={{ animationDelay: '0ms' }}>
          <h1
            className="text-2xl font-bold tracking-tight"
            style={{ color: '#1a7a73' }}
          >
            Dashboard
          </h1>
          <p className="text-gray-400 text-sm mt-0.5">
            Ringkasan data & performa ujian karyawan
          </p>
        </div>

        {/* ── Stat Cards ──────────────────────────────────────── */}
        <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
          <StatCard
            label="Total Karyawan"
            value={loading ? '—' : stats.totalKaryawan}
            sub="terdaftar di sistem"
            icon={
              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
                <circle cx="9" cy="7" r="4" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75" />
              </svg>
            }
            accent="#329F96"
            delay="80ms"
          />
          <StatCard
            label="Total Soal"
            value={loading ? '—' : stats.totalSoal}
            sub="soal aktif"
            icon={
              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2" />
                <rect x="9" y="3" width="6" height="4" rx="1" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6M9 16h4" />
              </svg>
            }
            accent="#0ea5e9"
            delay="140ms"
          />
          <StatCard
            label="Rata-rata Skor"
            value={loading ? '—' : stats.rataRata}
            sub="dari seluruh ujian"
            icon={
              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            }
            accent="#8b5cf6"
            delay="200ms"
          />
          <StatCard
            label="Skor Tertinggi"
            value={loading ? '—' : stats.tertinggi}
            sub={loading ? '' : `Terendah: ${stats.terendah}`}
            icon={
              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 3l14 9-14 9V3z" />
              </svg>
            }
            accent="#f59e0b"
            delay="260ms"
          />
        </div>

        {/* ── Charts row ──────────────────────────────────────── */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">

          {/* Trend skor */}
          <div
            className="rounded-2xl p-5 bg-white animate-fadein"
            style={{
              boxShadow: '0 1px 3px rgba(0,0,0,0.07), 0 8px 24px rgba(0,0,0,0.05)',
              animationDelay: '320ms',
              animationFillMode: 'both',
            }}
          >
            <p className="text-sm font-bold text-gray-700 mb-0.5">Tren Rata-rata Skor</p>
            <p className="text-xs text-gray-400 mb-4">Per tanggal ujian berlangsung</p>
            {loading || scoreTrend.length === 0 ? (
              <div className="h-48 flex items-center justify-center text-gray-300 text-sm">
                Belum ada data
              </div>
            ) : (
              <ResponsiveContainer width="100%" height={200}>
                <AreaChart data={scoreTrend} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorRata" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#329F96" stopOpacity={0.25} />
                      <stop offset="95%" stopColor="#329F96" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="tanggal" tick={{ fontSize: 11, fill: '#9ca3af' }} />
                  <YAxis domain={[0, 100]} tick={{ fontSize: 11, fill: '#9ca3af' }} />
                  <Tooltip content={<CustomTooltip />} />
                  <Area
                    type="monotone"
                    dataKey="rata"
                    stroke="#329F96"
                    strokeWidth={2.5}
                    fill="url(#colorRata)"
                    dot={{ r: 4, fill: '#329F96', strokeWidth: 0 }}
                    activeDot={{ r: 6 }}
                  />
                </AreaChart>
              </ResponsiveContainer>
            )}
          </div>

          {/* Distribusi skor */}
          <div
            className="rounded-2xl p-5 bg-white animate-fadein"
            style={{
              boxShadow: '0 1px 3px rgba(0,0,0,0.07), 0 8px 24px rgba(0,0,0,0.05)',
              animationDelay: '380ms',
              animationFillMode: 'both',
            }}
          >
            <p className="text-sm font-bold text-gray-700 mb-0.5">Distribusi Skor</p>
            <p className="text-xs text-gray-400 mb-4">Jumlah peserta per rentang nilai</p>
            {loading || distribusi.every((d) => d.jumlah === 0) ? (
              <div className="h-48 flex items-center justify-center text-gray-300 text-sm">
                Belum ada data
              </div>
            ) : (
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={distribusi} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="range" tick={{ fontSize: 11, fill: '#9ca3af' }} />
                  <YAxis allowDecimals={false} tick={{ fontSize: 11, fill: '#9ca3af' }} />
                  <Tooltip content={<BarTooltip />} />
                  <Bar dataKey="jumlah" fill="#329F96" radius={[6, 6, 0, 0]} maxBarSize={52} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        {/* ── Hasil Ujian Terbaru ──────────────────────────────── */}
        <div
          className="rounded-2xl bg-white overflow-hidden animate-fadein"
          style={{
            boxShadow: '0 1px 3px rgba(0,0,0,0.07), 0 8px 24px rgba(0,0,0,0.05)',
            animationDelay: '440ms',
            animationFillMode: 'both',
          }}
        >
          <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
            <div>
              <p className="text-sm font-bold text-gray-700">Hasil Ujian Terbaru</p>
              <p className="text-xs text-gray-400">5 entri terakhir</p>
            </div>
            <a
              href="/admin/hasil"
              className="text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors"
              style={{ background: '#329F9618', color: '#329F96' }}
            >
              Lihat Semua →
            </a>
          </div>

          {loading ? (
            <div className="px-6 py-10 text-center text-gray-300 text-sm">Memuat data…</div>
          ) : hasilTerbaru.length === 0 ? (
            <div className="px-6 py-10 text-center text-gray-300 text-sm">Belum ada hasil ujian</div>
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50">
                  <th className="text-left px-6 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">Nama</th>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">Quiz</th>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">Tanggal</th>
                  <th className="text-center px-6 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">Skor</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {hasilTerbaru.map((h, i) => (
                  <tr
                    key={h.id}
                    className="hover:bg-gray-50/70 transition-colors animate-fadein"
                    style={{ animationDelay: `${500 + i * 60}ms`, animationFillMode: 'both' }}
                  >
                    <td className="px-6 py-3.5 font-medium text-gray-700">{h.nama}</td>
                    <td className="px-6 py-3.5 text-gray-500">{h.quiz_title}</td>
                    <td className="px-6 py-3.5 text-gray-400 text-xs">{formatTanggal(h.created_at)}</td>
                    <td className="px-6 py-3.5 text-center">
                      <ScoreBadge skor={h.skor} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

      </div>
    </>
  )
}