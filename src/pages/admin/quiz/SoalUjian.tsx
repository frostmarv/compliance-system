import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'

// ── Types ────────────────────────────────────────────────────────────────────
interface TrainingType {
  id: string
  code: string
  name: string
  is_active: boolean
}

interface Soal {
  id: string
  training_type_id: string
  factory: number | null
  type: 'pg' | 'tf'
  question_number: number
  question_text: string
  options: Record<string, string>
  correct_answer: string
  category: string | null
  is_active: boolean
}

// ── Badge helpers ────────────────────────────────────────────────────────────
function TypeBadge({ type }: { type: 'pg' | 'tf' }) {
  return type === 'pg' ? (
    <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-semibold bg-blue-50 text-blue-600 border border-blue-100">
      Pilihan Ganda
    </span>
  ) : (
    <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-semibold bg-amber-50 text-amber-600 border border-amber-100">
      YA / TIDAK
    </span>
  )
}

function FactoryBadge({ factory }: { factory: number | null }) {
  if (!factory) return (
    <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-semibold bg-gray-100 text-gray-500">
      Semua
    </span>
  )
  return (
    <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-semibold bg-teal-50 text-teal-600 border border-teal-100">
      F{factory}
    </span>
  )
}

// ── Skeleton loader ──────────────────────────────────────────────────────────
function SkeletonRow() {
  return (
    <tr className="border-b border-gray-50">
      {[1, 2, 3, 4, 5].map((i) => (
        <td key={i} className="px-5 py-4">
          <div className="h-3 bg-gray-100 rounded-full animate-pulse" style={{ width: `${40 + i * 10}%` }} />
        </td>
      ))}
    </tr>
  )
}

// ── Modal Detail Soal ────────────────────────────────────────────────────────
function ModalDetail({ soal, onClose }: { soal: Soal; onClose: () => void }) {
  const optionKeys = Object.keys(soal.options)
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: 'rgba(0,0,0,0.35)', backdropFilter: 'blur(4px)' }}
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden"
        onClick={(e) => e.stopPropagation()}
        style={{ animation: 'modalIn 0.2s ease both' }}
      >
        {/* Header */}
        <div
          className="px-6 py-4 flex items-center justify-between"
          style={{ background: 'linear-gradient(135deg, #1a7a73, #329F96)' }}
        >
          <div>
            <p className="text-white/60 text-xs font-medium uppercase tracking-wider">
              Soal No. {soal.question_number}
            </p>
            <p className="text-white font-bold text-sm mt-0.5">{soal.category || '—'}</p>
          </div>
          <div className="flex items-center gap-2">
            <TypeBadge type={soal.type} />
            <button
              onClick={onClose}
              className="w-7 h-7 rounded-full bg-white/20 flex items-center justify-center text-white hover:bg-white/30 transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Body */}
        <div className="px-6 py-5">
          <p className="text-gray-700 text-sm leading-relaxed mb-5">{soal.question_text}</p>

          <div className="space-y-2">
            {optionKeys.map((key) => {
              const isCorrect = key === soal.correct_answer
              return (
                <div
                  key={key}
                  className="flex items-start gap-3 px-4 py-3 rounded-xl border text-sm transition-colors"
                  style={{
                    borderColor: isCorrect ? '#329F96' : '#f1f5f9',
                    background: isCorrect ? '#f0fdfa' : '#fafafa',
                  }}
                >
                  <span
                    className="shrink-0 w-6 h-6 rounded-lg flex items-center justify-center text-xs font-bold mt-0.5"
                    style={{
                      background: isCorrect ? '#329F96' : '#e2e8f0',
                      color: isCorrect ? 'white' : '#64748b',
                    }}
                  >
                    {key}
                  </span>
                  <span className={isCorrect ? 'text-teal-700 font-medium' : 'text-gray-600'}>
                    {soal.options[key]}
                    {isCorrect && (
                      <span className="ml-2 text-[10px] font-semibold text-teal-500 uppercase tracking-wider">
                        ✓ Jawaban Benar
                      </span>
                    )}
                  </span>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}

// ── Main Page ────────────────────────────────────────────────────────────────
export default function SoalUjian() {
  const [trainingTypes, setTrainingTypes] = useState<TrainingType[]>([])
  const [activeTab, setActiveTab] = useState<string>('')
  const [soalList, setSoalList] = useState<Soal[]>([])
  const [loadingTabs, setLoadingTabs] = useState(true)
  const [loadingSoal, setLoadingSoal] = useState(false)
  const [selectedSoal, setSelectedSoal] = useState<Soal | null>(null)
  const [search, setSearch] = useState('')
  const [filterType, setFilterType] = useState<'all' | 'pg' | 'tf'>('all')
  const [filterFactory, setFilterFactory] = useState<'all' | '1' | '2' | 'null'>('all')

  // Fetch training types
  useEffect(() => {
    supabase
      .from('training_types')
      .select('id, code, name, is_active')
      .eq('is_active', true)
      .order('name')
      .then(({ data }) => {
        if (data && data.length > 0) {
          setTrainingTypes(data)
          setActiveTab(data[0].id)
        }
        setLoadingTabs(false)
      })
  }, [])

  // Fetch soal saat tab berubah
  useEffect(() => {
    if (!activeTab) return
    setLoadingSoal(true)
    setSoalList([])
    supabase
      .from('bank_soal')
      .select('*')
      .eq('training_type_id', activeTab)
      .order('question_number')
      .then(({ data }) => {
        setSoalList(data ?? [])
        setLoadingSoal(false)
      })
  }, [activeTab])

  // Filter soal
  const filtered = soalList.filter((s) => {
    const matchSearch = s.question_text.toLowerCase().includes(search.toLowerCase()) ||
      (s.category ?? '').toLowerCase().includes(search.toLowerCase())
    const matchType = filterType === 'all' || s.type === filterType
    const matchFactory =
      filterFactory === 'all' ||
      (filterFactory === 'null' ? s.factory === null : String(s.factory) === filterFactory)
    return matchSearch && matchType && matchFactory
  })

  const activeTraining = trainingTypes.find((t) => t.id === activeTab)

  return (
    <>
      <style>{`
        @keyframes fadein { from { opacity:0; transform:translateY(12px); } to { opacity:1; transform:none; } }
        @keyframes modalIn { from { opacity:0; transform:scale(0.96); } to { opacity:1; transform:scale(1); } }
        .animate-fadein { animation: fadein 0.35s ease both; }
      `}</style>

      <div className="min-h-screen bg-gray-50">

        {/* ── Page Header ──────────────────────────────────────── */}
        <div className="bg-white border-b border-gray-100 px-7 pt-7 pb-0">
          <div className="animate-fadein">
            <h1 className="text-2xl font-bold tracking-tight" style={{ color: '#1a7a73' }}>
              Bank Soal
            </h1>
            <p className="text-gray-400 text-sm mt-0.5 mb-4">
              Kelola soal ujian berdasarkan kategori training
            </p>
          </div>

          {/* ── Tabs ─────────────────────────────────────────────── */}
          <div className="flex items-center gap-1 overflow-x-auto">
            {loadingTabs ? (
              [1, 2, 3].map((i) => (
                <div key={i} className="h-9 w-24 rounded-t-lg bg-gray-100 animate-pulse" />
              ))
            ) : (
              trainingTypes.map((t) => (
                <button
                  key={t.id}
                  onClick={() => { setActiveTab(t.id); setSearch(''); setFilterType('all'); setFilterFactory('all') }}
                  className="relative px-5 py-2.5 text-sm font-semibold rounded-t-xl transition-all duration-150 whitespace-nowrap"
                  style={
                    activeTab === t.id
                      ? { background: 'white', color: '#329F96', borderTop: '2px solid #329F96', borderLeft: '1px solid #e5e7eb', borderRight: '1px solid #e5e7eb', marginBottom: '-1px', zIndex: 2 }
                      : { color: '#9ca3af', background: 'transparent' }
                  }
                >
                  {t.name}
                  <span
                    className="ml-2 text-[10px] px-1.5 py-0.5 rounded-full font-bold"
                    style={activeTab === t.id ? { background: '#329F9620', color: '#329F96' } : { background: '#f1f5f9', color: '#94a3b8' }}
                  >
                    {activeTab === t.id ? filtered.length : '—'}
                  </span>
                </button>
              ))
            )}
          </div>
        </div>

        {/* ── Content ──────────────────────────────────────────── */}
        <div className="px-7 py-6 space-y-4">

          {/* Toolbar */}
          <div className="flex flex-wrap items-center gap-3 animate-fadein">
            {/* Search */}
            <div className="relative flex-1 min-w-[200px]">
              <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M17 11A6 6 0 115 11a6 6 0 0112 0z" />
              </svg>
              <input
                type="text"
                placeholder="Cari soal atau kategori…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-gray-200 bg-white text-sm
                           focus:outline-none focus:ring-2 transition"
                style={{ '--tw-ring-color': '#329F96' } as React.CSSProperties}
              />
            </div>

            {/* Filter tipe */}
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value as any)}
              className="px-4 py-2.5 rounded-xl border border-gray-200 bg-white text-sm text-gray-600 focus:outline-none focus:ring-2 transition cursor-pointer"
              style={{ '--tw-ring-color': '#329F96' } as React.CSSProperties}
            >
              <option value="all">Semua Tipe</option>
              <option value="pg">Pilihan Ganda</option>
              <option value="tf">YA / TIDAK</option>
            </select>

            {/* Filter factory */}
            <select
              value={filterFactory}
              onChange={(e) => setFilterFactory(e.target.value as any)}
              className="px-4 py-2.5 rounded-xl border border-gray-200 bg-white text-sm text-gray-600 focus:outline-none focus:ring-2 transition cursor-pointer"
              style={{ '--tw-ring-color': '#329F96' } as React.CSSProperties}
            >
              <option value="all">Semua Factory</option>
              <option value="null">Semua (Global)</option>
              <option value="1">Factory 1</option>
              <option value="2">Factory 2</option>
            </select>

            {/* Info count */}
            <span className="text-xs text-gray-400 ml-auto hidden sm:block">
              {filtered.length} soal ditemukan
            </span>
          </div>

          {/* ── Table ──────────────────────────────────────────── */}
          <div
            className="bg-white rounded-2xl overflow-hidden animate-fadein"
            style={{ boxShadow: '0 1px 3px rgba(0,0,0,0.07), 0 8px 24px rgba(0,0,0,0.05)', animationDelay: '80ms', animationFillMode: 'both' }}
          >
            {/* Table header */}
            <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
              <div>
                <p className="text-sm font-bold text-gray-700">{activeTraining?.name ?? '—'}</p>
                <p className="text-xs text-gray-400">{activeTraining?.code}</p>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-100">
                    <th className="text-left px-5 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wider w-12">No.</th>
                    <th className="text-left px-5 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">Pertanyaan</th>
                    <th className="text-left px-5 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wider w-32">Kategori</th>
                    <th className="text-center px-5 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wider w-32">Tipe</th>
                    <th className="text-center px-5 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wider w-24">Factory</th>
                    <th className="text-center px-5 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wider w-20">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {loadingSoal
                    ? Array.from({ length: 6 }).map((_, i) => <SkeletonRow key={i} />)
                    : filtered.length === 0
                    ? (
                      <tr>
                        <td colSpan={6} className="text-center py-16 text-gray-300">
                          <svg className="w-10 h-10 mx-auto mb-3 opacity-40" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                          </svg>
                          <p className="text-sm">Tidak ada soal ditemukan</p>
                        </td>
                      </tr>
                    )
                    : filtered.map((soal, i) => (
                      <tr
                        key={soal.id}
                        className="hover:bg-gray-50/70 transition-colors animate-fadein"
                        style={{ animationDelay: `${i * 30}ms`, animationFillMode: 'both' }}
                      >
                        {/* Nomor */}
                        <td className="px-5 py-4">
                          <span
                            className="w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold"
                            style={{ background: '#329F9615', color: '#329F96' }}
                          >
                            {soal.question_number}
                          </span>
                        </td>

                        {/* Pertanyaan */}
                        <td className="px-5 py-4 max-w-xs">
                          <p className="text-gray-700 line-clamp-2 leading-snug">{soal.question_text}</p>
                        </td>

                        {/* Kategori */}
                        <td className="px-5 py-4">
                          <span className="text-xs text-gray-500">{soal.category ?? '—'}</span>
                        </td>

                        {/* Tipe */}
                        <td className="px-5 py-4 text-center">
                          <TypeBadge type={soal.type} />
                        </td>

                        {/* Factory */}
                        <td className="px-5 py-4 text-center">
                          <FactoryBadge factory={soal.factory} />
                        </td>

                        {/* Aksi */}
                        <td className="px-5 py-4 text-center">
                          <button
                            onClick={() => setSelectedSoal(soal)}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors"
                            style={{ background: '#329F9615', color: '#329F96' }}
                            onMouseEnter={(e) => (e.currentTarget.style.background = '#329F9625')}
                            onMouseLeave={(e) => (e.currentTarget.style.background = '#329F9615')}
                          >
                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                            </svg>
                            Detail
                          </button>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* ── Modal ──────────────────────────────────────────────── */}
      {selectedSoal && (
        <ModalDetail soal={selectedSoal} onClose={() => setSelectedSoal(null)} />
      )}
    </>
  )
}