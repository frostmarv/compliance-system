import { useState, useEffect, useCallback } from 'react'
import type { FormEvent, ChangeEvent } from 'react'
import { supabase } from '@/lib/supabase'

// ── Types ────────────────────────────────────────────────────────────────────
type Karyawan = {
  nik: string
  nama: string
  department: string | null
  factory: number | null
  created_at?: string
}

// ── Constants ────────────────────────────────────────────────────────────────
const FACTORIES = [
  { value: 1, label: 'Zinus Global Indonesia',            short: 'ZGI', color: '#329F96', bg: '#e6f7f6' },
  { value: 2, label: 'Zinus Global Indonesia – Karawang', short: 'ZGK', color: '#0ea5e9', bg: '#e0f2fe' },
  { value: 3, label: 'Zinus Dream Indonesia',             short: 'ZDI', color: '#8b5cf6', bg: '#f3f0ff' },
]
const FACTORY_MAP: Record<number, typeof FACTORIES[number]> = Object.fromEntries(
  FACTORIES.map((f) => [f.value, f])
)
const PAGE_SIZE = 15

// ── Icons ────────────────────────────────────────────────────────────────────
const IconPlus = () => (
  <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 5v14M5 12h14" />
  </svg>
)
const IconEdit = () => (
  <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M17 3a2.828 2.828 0 114 4L7.5 20.5 2 22l1.5-5.5L17 3z" />
  </svg>
)
const IconTrash = () => (
  <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M3 6h18M8 6V4a1 1 0 011-1h6a1 1 0 011 1v2M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6" />
  </svg>
)
const IconSearch = () => (
  <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <circle cx="11" cy="11" r="8" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35" />
  </svg>
)
const IconUser = () => (
  <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" />
    <circle cx="12" cy="7" r="4" />
  </svg>
)
const IconClose = () => (
  <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
  </svg>
)
const IconChevronLeft = () => (
  <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
  </svg>
)
const IconChevronRight = () => (
  <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
  </svg>
)

// ── Avatar ────────────────────────────────────────────────────────────────────
function Avatar({ nama, factory }: { nama: string; factory: number | null }) {
  const f = factory ? FACTORY_MAP[factory] : null
  const color = f?.color ?? '#94a3b8'
  const initials = nama.split(' ').slice(0, 2).map((w) => w[0]).join('').toUpperCase()
  return (
    <div style={{
      width: 36, height: 36, borderRadius: 10,
      background: color + '22', color,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontWeight: 700, fontSize: 13, flexShrink: 0, fontFamily: 'inherit',
    }}>
      {initials}
    </div>
  )
}

// ── Factory Tab ───────────────────────────────────────────────────────────────
function FactoryTab({ factory, count, active, onClick }: {
  factory: typeof FACTORIES[number]; count: number; active: boolean; onClick: () => void
}) {
  return (
    <button onClick={onClick} style={{
      display: 'flex', alignItems: 'center', gap: 10,
      padding: '10px 20px', borderRadius: 12, border: 'none', cursor: 'pointer',
      fontFamily: 'inherit', fontWeight: 600, fontSize: 14, transition: 'all 0.18s',
      background: active ? factory.color : 'white',
      color: active ? 'white' : '#64748b',
      boxShadow: active ? `0 4px 16px ${factory.color}40` : '0 1px 4px rgba(0,0,0,0.07)',
    }}>
      <span style={{
        width: 24, height: 24, borderRadius: 6,
        background: active ? 'rgba(255,255,255,0.25)' : factory.bg,
        color: active ? 'white' : factory.color,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: 10, fontWeight: 800, letterSpacing: 0.3,
      }}>{factory.short}</span>
      {factory.label}
      <span style={{
        marginLeft: 4, padding: '2px 8px', borderRadius: 50,
        background: active ? 'rgba(255,255,255,0.25)' : factory.bg,
        color: active ? 'white' : factory.color,
        fontSize: 12, fontWeight: 700,
      }}>{count}</span>
    </button>
  )
}

// ── Pagination ────────────────────────────────────────────────────────────────
function Pagination({ page, totalPages, totalRows, onPage }: {
  page: number; totalPages: number; totalRows: number; onPage: (p: number) => void
}) {
  if (totalPages <= 1) return null

  // Generate page numbers with ellipsis
  const getPages = () => {
    if (totalPages <= 7) return Array.from({ length: totalPages }, (_, i) => i + 1)
    const pages: (number | '...')[] = [1]
    if (page > 3) pages.push('...')
    for (let i = Math.max(2, page - 1); i <= Math.min(totalPages - 1, page + 1); i++) pages.push(i)
    if (page < totalPages - 2) pages.push('...')
    pages.push(totalPages)
    return pages
  }

  const btnBase: React.CSSProperties = {
    minWidth: 34, height: 34, borderRadius: 8, border: 'none', cursor: 'pointer',
    fontFamily: 'inherit', fontWeight: 600, fontSize: 13, transition: 'all 0.15s',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
  }

  return (
    <div style={{
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      padding: '14px 20px', borderTop: '1px solid #f1f5f9', flexWrap: 'wrap', gap: 12,
    }}>
      {/* Info */}
      <p style={{ fontSize: 12, color: '#94a3b8', margin: 0 }}>
        Halaman <strong style={{ color: '#475569' }}>{page}</strong> dari{' '}
        <strong style={{ color: '#475569' }}>{totalPages}</strong> · Total{' '}
        <strong style={{ color: '#475569' }}>{totalRows.toLocaleString('id-ID')}</strong> karyawan
      </p>

      {/* Pages */}
      <div style={{ display: 'flex', gap: 4, alignItems: 'center' }}>
        {/* Prev */}
        <button
          onClick={() => onPage(page - 1)}
          disabled={page === 1}
          style={{
            ...btnBase,
            background: page === 1 ? '#f8fafc' : 'white',
            color: page === 1 ? '#cbd5e1' : '#475569',
            boxShadow: page === 1 ? 'none' : '0 1px 4px rgba(0,0,0,0.08)',
            cursor: page === 1 ? 'not-allowed' : 'pointer',
          }}
        >
          <IconChevronLeft />
        </button>

        {getPages().map((p, i) =>
          p === '...' ? (
            <span key={`ellipsis-${i}`} style={{ color: '#cbd5e1', fontSize: 13, padding: '0 4px' }}>…</span>
          ) : (
            <button
              key={p}
              onClick={() => onPage(p as number)}
              style={{
                ...btnBase,
                background: page === p ? '#329F96' : 'white',
                color: page === p ? 'white' : '#475569',
                boxShadow: page === p ? '0 4px 12px rgba(50,159,150,0.35)' : '0 1px 4px rgba(0,0,0,0.08)',
              }}
            >
              {p}
            </button>
          )
        )}

        {/* Next */}
        <button
          onClick={() => onPage(page + 1)}
          disabled={page === totalPages}
          style={{
            ...btnBase,
            background: page === totalPages ? '#f8fafc' : 'white',
            color: page === totalPages ? '#cbd5e1' : '#475569',
            boxShadow: page === totalPages ? 'none' : '0 1px 4px rgba(0,0,0,0.08)',
            cursor: page === totalPages ? 'not-allowed' : 'pointer',
          }}
        >
          <IconChevronRight />
        </button>
      </div>
    </div>
  )
}

// ── Delete Modal ──────────────────────────────────────────────────────────────
function DeleteModal({ nama, hasilCount, loading, onConfirm, onCancel }: {
  nama: string; hasilCount: number; loading: boolean; onConfirm: () => void; onCancel: () => void
}) {
  return (
    <div onClick={onCancel} style={{
      position: 'fixed', inset: 0, zIndex: 60,
      background: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(4px)',
      display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16,
    }}>
      <div onClick={(e) => e.stopPropagation()} style={{
        background: 'white', borderRadius: 20, padding: '28px 28px 24px',
        maxWidth: 380, width: '100%', textAlign: 'center',
        boxShadow: '0 20px 60px rgba(0,0,0,0.15)',
        animation: 'modalIn 0.18s ease both',
      }}>
        <div style={{
          width: 52, height: 52, borderRadius: 16, background: '#fef2f2',
          margin: '0 auto 16px', display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <svg width="24" height="24" fill="none" stroke="#ef4444" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v4m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
          </svg>
        </div>
        <p style={{ fontWeight: 700, fontSize: 16, color: '#0d1f1e', marginBottom: 6 }}>Hapus Karyawan?</p>
        <p style={{ fontSize: 13, color: '#64748b', marginBottom: hasilCount > 0 ? 12 : 24, lineHeight: 1.6 }}>
          Data <strong>{nama}</strong> akan dihapus permanen dan tidak dapat dikembalikan.
        </p>
        {hasilCount > 0 && (
          <div style={{
            marginBottom: 20, padding: '10px 14px', borderRadius: 10,
            background: '#fffbeb', border: '1px solid #fde68a',
            display: 'flex', alignItems: 'flex-start', gap: 10,
          }}>
            <svg width="16" height="16" fill="none" stroke="#d97706" strokeWidth="2" viewBox="0 0 24 24" style={{ flexShrink: 0, marginTop: 1 }}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v4m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/>
            </svg>
            <p style={{ margin: 0, fontSize: 12, color: '#92400e', lineHeight: 1.6 }}>
              Karyawan ini memiliki <strong>{hasilCount} data hasil ujian</strong> yang juga akan ikut terhapus.
            </p>
          </div>
        )}
        <div style={{ display: 'flex', gap: 10 }}>
          <button onClick={onCancel} disabled={loading} style={{
            flex: 1, padding: '10px', borderRadius: 10, border: '1.5px solid #e2e8f0',
            background: 'white', color: '#64748b', fontWeight: 600, fontSize: 14,
            cursor: loading ? 'not-allowed' : 'pointer', fontFamily: 'inherit', opacity: loading ? 0.6 : 1,
          }}>Batal</button>
          <button onClick={onConfirm} disabled={loading} style={{
            flex: 1, padding: '10px', borderRadius: 10, border: 'none',
            background: loading ? '#fca5a5' : 'linear-gradient(135deg, #ef4444, #dc2626)',
            color: 'white', fontWeight: 600, fontSize: 14,
            cursor: loading ? 'not-allowed' : 'pointer', fontFamily: 'inherit',
            boxShadow: loading ? 'none' : '0 4px 14px rgba(239,68,68,0.35)',
          }}>{loading ? 'Menghapus…' : 'Hapus'}</button>
        </div>
      </div>
    </div>
  )
}

// ── Main Page ─────────────────────────────────────────────────────────────────
export default function UserPage() {
  // ── Data state ───────────────────────────────────────────────────────────
  const [rows, setRows] = useState<Karyawan[]>([])
  const [totalRows, setTotalRows] = useState(0)
  const [countByFac, setCountByFac] = useState<Record<number, number>>({})
  const [loading, setLoading] = useState(true)

  // ── UI state ─────────────────────────────────────────────────────────────
  const [activeFactory, setActiveFactory] = useState<number>(1)
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)

  // ── Modal state ──────────────────────────────────────────────────────────
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingNik, setEditingNik] = useState<string | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<Karyawan | null>(null)
  const [deleteHasilCount, setDeleteHasilCount] = useState(0)
  const [deleteLoading, setDeleteLoading] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState({ nik: '', nama: '', department: '', factory: '1' })
  const [formError, setFormError] = useState('')
  const [toast, setToast] = useState<{ msg: string; type: 'success' | 'error' } | null>(null)

  // Auto-dismiss toast
  useEffect(() => {
    if (!toast) return
    const t = setTimeout(() => setToast(null), 3500)
    return () => clearTimeout(t)
  }, [toast])

  // ── Fetch data (server-side pagination) ──────────────────────────────────
  const fetchPage = useCallback(async (fac: number, q: string, pg: number) => {
    setLoading(true)
    const from = (pg - 1) * PAGE_SIZE
    const to = from + PAGE_SIZE - 1

    let query = supabase
      .from('karyawan')
      .select('*', { count: 'exact' })
      .eq('factory', fac)
      .order('nama')
      .range(from, to)

    if (q.trim()) {
      // Supabase ilike filter — search on nama, nik, department
      query = query.or(
        `nama.ilike.%${q.trim()}%,nik.ilike.%${q.trim()}%,department.ilike.%${q.trim()}%`
      )
    }

    const { data, count } = await query
    setRows(data ?? [])
    setTotalRows(count ?? 0)
    setLoading(false)
  }, [])

  // Fetch counts per factory (for summary cards) — no row limit needed, just count
  const fetchCounts = useCallback(async () => {
    const results = await Promise.all(
      FACTORIES.map(async (f) => {
        const { count } = await supabase
          .from('karyawan')
          .select('*', { count: 'exact', head: true })
          .eq('factory', f.value)
        return [f.value, count ?? 0] as [number, number]
      })
    )
    setCountByFac(Object.fromEntries(results))
  }, [])

  // Initial + reactive fetch
  useEffect(() => {
    fetchCounts()
  }, [fetchCounts])

  useEffect(() => {
    fetchPage(activeFactory, search, page)
  }, [activeFactory, search, page, fetchPage])

  // Reset page on filter change
  const handleFactoryChange = (fac: number) => {
    setActiveFactory(fac)
    setPage(1)
    setSearch('')
  }
  const handleSearch = (q: string) => {
    setSearch(q)
    setPage(1)
  }

  const totalPages = Math.max(1, Math.ceil(totalRows / PAGE_SIZE))
  const totalAll = Object.values(countByFac).reduce((a, b) => a + b, 0)

  // ── Modal helpers ─────────────────────────────────────────────────────────
  const openCreate = () => {
    setEditingNik(null)
    setFormData({ nik: '', nama: '', department: '', factory: String(activeFactory) })
    setFormError('')
    setIsModalOpen(true)
  }
  const openEdit = (k: Karyawan) => {
    setEditingNik(k.nik)
    setFormData({ nik: k.nik, nama: k.nama, department: k.department ?? '', factory: String(k.factory ?? 1) })
    setFormError('')
    setIsModalOpen(true)
  }
  const closeModal = () => { setIsModalOpen(false); setEditingNik(null) }

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData((p) => ({ ...p, [e.target.name]: e.target.value }))
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setFormError('')
    if (!formData.nik.trim()) return setFormError('NIK wajib diisi')
    if (!formData.nama.trim()) return setFormError('Nama wajib diisi')
    setIsSubmitting(true)
    try {
      const payload = {
        nik: formData.nik.trim(),
        nama: formData.nama.trim(),
        department: formData.department.trim() || null,
        factory: Number(formData.factory) || null,
      }
      if (editingNik) {
        const { error } = await supabase.from('karyawan').update(payload).eq('nik', editingNik)
        if (error) throw error
      } else {
        const { error } = await supabase.from('karyawan').insert([payload])
        if (error) throw error
      }
      setToast({ msg: editingNik ? 'Data berhasil diperbarui' : 'Karyawan berhasil ditambahkan', type: 'success' })
      closeModal()
      fetchCounts()
      fetchPage(activeFactory, search, page)
    } catch (err: any) {
      setFormError(err.message ?? 'Terjadi kesalahan')
    } finally {
      setIsSubmitting(false)
    }
  }

  // Cek hasil ujian dulu sebelum buka modal delete
  const openDeleteModal = async (k: Karyawan) => {
    const { count } = await supabase
      .from('hasil_ujian')
      .select('*', { count: 'exact', head: true })
      .eq('nik', k.nik)
    setDeleteHasilCount(count ?? 0)
    setDeleteTarget(k)
  }

  const handleDelete = async () => {
    if (!deleteTarget) return
    setDeleteLoading(true)
    try {
      // Hapus hasil_ujian dulu agar tidak kena FK constraint
      if (deleteHasilCount > 0) {
        const { error: errHasil } = await supabase
          .from('hasil_ujian')
          .delete()
          .eq('nik', deleteTarget.nik)
        if (errHasil) throw errHasil
      }
      // Baru hapus karyawan
      const { error } = await supabase
        .from('karyawan')
        .delete()
        .eq('nik', deleteTarget.nik)
      if (error) throw error

      setToast({ msg: `${deleteTarget.nama} berhasil dihapus`, type: 'success' })
      setDeleteTarget(null)
      fetchCounts()
      const newTotal = totalRows - 1
      const newTotalPages = Math.max(1, Math.ceil(newTotal / PAGE_SIZE))
      const newPage = Math.min(page, newTotalPages)
      setPage(newPage)
      fetchPage(activeFactory, search, newPage)
    } catch (err: any) {
      setToast({ msg: 'Gagal menghapus: ' + (err.message ?? 'Unknown error'), type: 'error' })
      setDeleteTarget(null)
    } finally {
      setDeleteLoading(false)
    }
  }

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <>
      <style>{`
        @keyframes fadein  { from { opacity:0; transform:translateY(10px); } to { opacity:1; transform:none; } }
        @keyframes spin     { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        @keyframes modalIn { from { opacity:0; transform:scale(0.95); } to { opacity:1; transform:scale(1); } }
        .row-hover:hover { background: #f8fdfc !important; }
        .action-btn { opacity: 0; transition: opacity 0.15s; }
        .row-hover:hover .action-btn { opacity: 1 !important; }
        input:focus, select:focus { outline: none; border-color: #329F96 !important; box-shadow: 0 0 0 3px rgba(50,159,150,0.12); }
        .page-btn:hover:not(:disabled) { background: #f1f5f9 !important; }
      `}</style>

      <div style={{ minHeight: '100vh', background: '#f5fafa', padding: '28px', fontFamily: "'DM Sans', 'Segoe UI', sans-serif" }}>

        {/* ── Header ────────────────────────────────────────────── */}
        <div style={{ marginBottom: 24, animation: 'fadein 0.4s ease both' }}>
          <h1 style={{ fontSize: 22, fontWeight: 700, color: '#0d2220', margin: 0 }}>Manajemen Karyawan</h1>
          <p style={{ fontSize: 13, color: '#7a9997', marginTop: 4 }}>Kelola data karyawan per factory</p>
        </div>

        {/* ── Summary Cards ─────────────────────────────────────── */}
        <div style={{ display: 'flex', gap: 16, marginBottom: 24, flexWrap: 'wrap', animation: 'fadein 0.4s 0.05s ease both', animationFillMode: 'both' }}>
          {FACTORIES.map((f) => (
            <div key={f.value} style={{
              flex: 1, minWidth: 180, background: 'white', borderRadius: 16, padding: '16px 20px',
              boxShadow: '0 1px 4px rgba(0,0,0,0.07)', borderLeft: `4px solid ${f.color}`,
              display: 'flex', alignItems: 'center', gap: 14,
            }}>
              <div style={{ width: 40, height: 40, borderRadius: 10, background: f.bg, color: f.color, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <IconUser />
              </div>
              <div>
                <p style={{ fontSize: 11, color: '#94a3b8', fontWeight: 600, textTransform: 'uppercase', letterSpacing: 0.5, margin: 0 }}>{f.short}</p>
                <p style={{ fontSize: 24, fontWeight: 800, color: '#0d2220', margin: 0, lineHeight: 1.1 }}>{(countByFac[f.value] ?? 0).toLocaleString('id-ID')}</p>
                <p style={{ fontSize: 11, color: '#94a3b8', margin: 0 }}>{f.label}</p>
              </div>
            </div>
          ))}
          <div style={{
            flex: 1, minWidth: 180,
            background: 'linear-gradient(135deg, #1a7a73, #329F96)', borderRadius: 16, padding: '16px 20px',
            boxShadow: '0 4px 16px rgba(50,159,150,0.3)', display: 'flex', alignItems: 'center', gap: 14,
          }}>
            <div style={{ width: 40, height: 40, borderRadius: 10, background: 'rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white' }}>
              <IconUser />
            </div>
            <div>
              <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.7)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: 0.5, margin: 0 }}>Total</p>
              <p style={{ fontSize: 24, fontWeight: 800, color: 'white', margin: 0, lineHeight: 1.1 }}>{totalAll.toLocaleString('id-ID')}</p>
              <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.6)', margin: 0 }}>Semua Factory</p>
            </div>
          </div>
        </div>

        {/* ── Table Card ────────────────────────────────────────── */}
        <div style={{
          background: 'white', borderRadius: 20, boxShadow: '0 1px 4px rgba(0,0,0,0.07)', overflow: 'hidden',
          animation: 'fadein 0.4s 0.1s ease both', animationFillMode: 'both',
        }}>
          {/* Toolbar */}
          <div style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            padding: '16px 20px', borderBottom: '1px solid #f1f5f9', flexWrap: 'wrap', gap: 12,
          }}>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              {FACTORIES.map((f) => (
                <FactoryTab
                  key={f.value} factory={f}
                  count={countByFac[f.value] ?? 0}
                  active={activeFactory === f.value}
                  onClick={() => handleFactoryChange(f.value)}
                />
              ))}
            </div>
            <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
              <div style={{ position: 'relative' }}>
                <span style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }}>
                  <IconSearch />
                </span>
                <input
                  type="text"
                  placeholder="Cari NIK, nama, departemen…"
                  value={search}
                  onChange={(e) => handleSearch(e.target.value)}
                  style={{
                    paddingLeft: 38, paddingRight: 14, paddingTop: 9, paddingBottom: 9,
                    border: '1.5px solid #e2e8f0', borderRadius: 10,
                    fontSize: 13, fontFamily: 'inherit', color: '#1a2e2d',
                    background: '#f8fdfc', width: 240, transition: 'border-color 0.15s',
                  }}
                />
              </div>
              <button onClick={openCreate} style={{
                display: 'flex', alignItems: 'center', gap: 8,
                padding: '9px 18px', borderRadius: 10, border: 'none', cursor: 'pointer',
                background: 'linear-gradient(135deg, #1a7a73, #329F96)',
                color: 'white', fontWeight: 600, fontSize: 13, fontFamily: 'inherit',
                boxShadow: '0 4px 14px rgba(50,159,150,0.35)', transition: 'transform 0.15s, box-shadow 0.15s',
              }}
              onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-1px)'; e.currentTarget.style.boxShadow = '0 6px 18px rgba(50,159,150,0.45)' }}
              onMouseLeave={(e) => { e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = '0 4px 14px rgba(50,159,150,0.35)' }}
              >
                <IconPlus /> Tambah Karyawan
              </button>
            </div>
          </div>

          {/* Table */}
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
              <thead>
                <tr style={{ background: '#f8fdfc' }}>
                  {['#', 'NIK', 'Nama', 'Departemen', 'Factory', 'Aksi'].map((h, i) => (
                    <th key={h} style={{
                      padding: '11px 16px',
                      textAlign: i === 0 ? 'center' : i === 5 ? 'center' : 'left',
                      fontSize: 11, fontWeight: 700, color: '#94a3b8',
                      textTransform: 'uppercase', letterSpacing: 0.6,
                      borderBottom: '1px solid #f1f5f9',
                      width: i === 0 ? 48 : i === 5 ? 100 : 'auto',
                    }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  Array.from({ length: PAGE_SIZE }).map((_, i) => (
                    <tr key={i} style={{ borderBottom: '1px solid #f8fdfc' }}>
                      {[40, 90, 180, 140, 130, 80].map((w, j) => (
                        <td key={j} style={{ padding: '14px 16px' }}>
                          <div style={{
                            height: 12, borderRadius: 6, background: '#f1f5f9', width: w,
                            animation: `fadein 0.4s ${i * 30}ms ease both`, animationFillMode: 'both',
                          }} />
                        </td>
                      ))}
                    </tr>
                  ))
                ) : rows.length === 0 ? (
                  <tr>
                    <td colSpan={6} style={{ textAlign: 'center', padding: '56px 16px', color: '#cbd5e1' }}>
                      <div style={{ fontSize: 40, marginBottom: 10 }}>👤</div>
                      <p style={{ margin: 0, fontWeight: 600, fontSize: 14 }}>
                        {search ? 'Tidak ada hasil pencarian' : 'Belum ada data karyawan'}
                      </p>
                      <p style={{ margin: '4px 0 0', fontSize: 12 }}>
                        {search ? `Tidak ditemukan hasil untuk "${search}"` : 'Klik "Tambah Karyawan" untuk mulai'}
                      </p>
                    </td>
                  </tr>
                ) : (
                  rows.map((k, i) => {
                    const fac = k.factory ? FACTORY_MAP[k.factory] : null
                    const rowNum = (page - 1) * PAGE_SIZE + i + 1
                    return (
                      <tr key={k.nik} className="row-hover" style={{
                        borderBottom: '1px solid #f8fdfc', transition: 'background 0.15s',
                        animation: `fadein 0.25s ${i * 20}ms ease both`, animationFillMode: 'both',
                      }}>
                        {/* Row number */}
                        <td style={{ padding: '12px 16px', textAlign: 'center' }}>
                          <span style={{ fontSize: 11, color: '#cbd5e1', fontWeight: 600 }}>{rowNum}</span>
                        </td>
                        {/* NIK */}
                        <td style={{ padding: '12px 16px' }}>
                          <code style={{
                            fontSize: 12, fontFamily: 'monospace', fontWeight: 700,
                            background: '#f1f5f9', color: '#475569',
                            padding: '3px 8px', borderRadius: 6,
                          }}>{k.nik}</code>
                        </td>
                        {/* Nama */}
                        <td style={{ padding: '12px 16px' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                            <Avatar nama={k.nama} factory={k.factory} />
                            <span style={{ fontWeight: 600, color: '#1a2e2d' }}>{k.nama}</span>
                          </div>
                        </td>
                        {/* Departemen */}
                        <td style={{ padding: '12px 16px', color: '#64748b' }}>
                          {k.department ?? <span style={{ color: '#cbd5e1' }}>—</span>}
                        </td>
                        {/* Factory */}
                        <td style={{ padding: '12px 16px' }}>
                          {fac ? (
                            <span style={{
                              display: 'inline-flex', alignItems: 'center', gap: 6,
                              padding: '4px 10px', borderRadius: 50,
                              background: fac.bg, color: fac.color,
                              fontSize: 12, fontWeight: 700,
                            }}>
                              <span style={{ width: 6, height: 6, borderRadius: '50%', background: fac.color }} />
                              {fac.short} · {fac.label}
                            </span>
                          ) : <span style={{ color: '#cbd5e1' }}>—</span>}
                        </td>
                        {/* Aksi */}
                        <td style={{ padding: '12px 16px' }}>
                          <div style={{ display: 'flex', gap: 6, justifyContent: 'center' }}>
                            <button className="action-btn" onClick={() => openEdit(k)} title="Edit" style={{
                              width: 30, height: 30, borderRadius: 8, border: 'none', cursor: 'pointer',
                              background: '#e6f7f6', color: '#329F96',
                              display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'background 0.15s',
                            }}
                            onMouseEnter={(e) => e.currentTarget.style.background = '#c8efed'}
                            onMouseLeave={(e) => e.currentTarget.style.background = '#e6f7f6'}>
                              <IconEdit />
                            </button>
                            <button className="action-btn" onClick={() => openDeleteModal(k)} title="Hapus" style={{
                              width: 30, height: 30, borderRadius: 8, border: 'none', cursor: 'pointer',
                              background: '#fef2f2', color: '#ef4444',
                              display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'background 0.15s',
                            }}
                            onMouseEnter={(e) => e.currentTarget.style.background = '#fecaca'}
                            onMouseLeave={(e) => e.currentTarget.style.background = '#fef2f2'}>
                              <IconTrash />
                            </button>
                          </div>
                        </td>
                      </tr>
                    )
                  })
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {!loading && totalRows > 0 && (
            <Pagination
              page={page}
              totalPages={totalPages}
              totalRows={totalRows}
              onPage={setPage}
            />
          )}
        </div>
      </div>

      {/* ── Modal Form ─────────────────────────────────────────────── */}
      {isModalOpen && (
        <div onClick={closeModal} style={{
          position: 'fixed', inset: 0, zIndex: 50,
          background: 'rgba(0,0,0,0.35)', backdropFilter: 'blur(4px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16,
        }}>
          <div onClick={(e) => e.stopPropagation()} style={{
            background: 'white', borderRadius: 24, overflow: 'hidden',
            width: '100%', maxWidth: 480,
            boxShadow: '0 24px 64px rgba(0,0,0,0.15)',
            animation: 'modalIn 0.2s ease both',
          }}>
            <div style={{
              padding: '20px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              background: 'linear-gradient(135deg, #1a7a73, #329F96)',
            }}>
              <div>
                <p style={{ color: 'rgba(255,255,255,0.65)', fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: 0.5, margin: 0 }}>
                  {editingNik ? 'Edit Data' : 'Tambah Baru'}
                </p>
                <p style={{ color: 'white', fontSize: 16, fontWeight: 700, margin: 0 }}>
                  {editingNik ? 'Edit Karyawan' : 'Tambah Karyawan'}
                </p>
              </div>
              <button onClick={closeModal} style={{
                width: 32, height: 32, borderRadius: 10, border: 'none', cursor: 'pointer',
                background: 'rgba(255,255,255,0.2)', color: 'white',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <IconClose />
              </button>
            </div>
            <form onSubmit={handleSubmit} style={{ padding: 24, display: 'flex', flexDirection: 'column', gap: 16 }}>
              {[
                { name: 'nik', label: 'NIK', placeholder: 'Contoh: 001', required: true, disabled: !!editingNik },
                { name: 'nama', label: 'Nama Lengkap', placeholder: 'Masukkan nama karyawan', required: true },
                { name: 'department', label: 'Departemen', placeholder: 'Contoh: Produksi, HRD, Logistik', required: false },
              ].map((field) => (
                <label key={field.name} style={{ display: 'flex', flexDirection: 'column', gap: 6, fontSize: 13, fontWeight: 600, color: '#374151' }}>
                  {field.label}{field.required && <span style={{ color: '#ef4444', display: 'inline' }}> *</span>}
                  <input
                    type="text"
                    name={field.name}
                    value={(formData as any)[field.name]}
                    onChange={handleChange}
                    placeholder={field.placeholder}
                    disabled={field.disabled}
                    required={field.required}
                    style={{
                      padding: '10px 14px', borderRadius: 10,
                      border: '1.5px solid #e2e8f0', fontSize: 13, fontFamily: 'inherit',
                      background: field.disabled ? '#f8fafc' : 'white', color: '#1a2e2d',
                      transition: 'border-color 0.15s, box-shadow 0.15s',
                    }}
                  />
                </label>
              ))}
              <label style={{ display: 'flex', flexDirection: 'column', gap: 6, fontSize: 13, fontWeight: 600, color: '#374151' }}>
                Factory <span style={{ color: '#ef4444', display: 'inline' }}>*</span>
                <select name="factory" value={formData.factory} onChange={handleChange} style={{
                  padding: '10px 14px', borderRadius: 10,
                  border: '1.5px solid #e2e8f0', fontSize: 13, fontFamily: 'inherit',
                  color: '#1a2e2d', background: 'white', cursor: 'pointer',
                  transition: 'border-color 0.15s, box-shadow 0.15s',
                }}>
                  {FACTORIES.map((f) => (
                    <option key={f.value} value={f.value}>{f.short} — {f.label}</option>
                  ))}
                </select>
              </label>
              {formError && (
                <div style={{ padding: '10px 14px', borderRadius: 10, background: '#fef2f2', color: '#dc2626', fontSize: 13, border: '1px solid #fecaca' }}>
                  {formError}
                </div>
              )}
              <div style={{ display: 'flex', gap: 10, marginTop: 4 }}>
                <button type="button" onClick={closeModal} style={{
                  flex: 1, padding: '11px', borderRadius: 12, border: '1.5px solid #e2e8f0',
                  background: 'white', color: '#64748b', fontWeight: 600, fontSize: 14,
                  cursor: 'pointer', fontFamily: 'inherit',
                }}>Batal</button>
                <button type="submit" disabled={isSubmitting} style={{
                  flex: 2, padding: '11px', borderRadius: 12, border: 'none',
                  background: isSubmitting ? '#88ceca' : 'linear-gradient(135deg, #1a7a73, #329F96)',
                  color: 'white', fontWeight: 600, fontSize: 14,
                  cursor: isSubmitting ? 'not-allowed' : 'pointer', fontFamily: 'inherit',
                  boxShadow: '0 4px 14px rgba(50,159,150,0.35)',
                }}>
                  {isSubmitting ? 'Menyimpan…' : editingNik ? 'Perbarui Data' : 'Simpan Karyawan'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── Delete Confirm ────────────────────────────────────────── */}
      {deleteTarget && (
        <DeleteModal
          nama={deleteTarget.nama}
          hasilCount={deleteHasilCount}
          loading={deleteLoading}
          onConfirm={handleDelete}
          onCancel={() => { if (!deleteLoading) setDeleteTarget(null) }}
        />
      )}

      {/* ── Toast ─────────────────────────────────────────────────── */}
      {toast && (
        <div style={{
          position: 'fixed', bottom: 28, right: 28, zIndex: 100,
          display: 'flex', alignItems: 'center', gap: 12,
          padding: '14px 20px', borderRadius: 14,
          background: toast.type === 'success' ? '#0f5c57' : '#7f1d1d',
          color: 'white', fontSize: 14, fontWeight: 600,
          boxShadow: '0 8px 32px rgba(0,0,0,0.25)',
          animation: 'modalIn 0.25s ease both',
          maxWidth: 360,
        }}>
          <span style={{
            width: 28, height: 28, borderRadius: 8, flexShrink: 0,
            background: 'rgba(255,255,255,0.2)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16,
          }}>
            {toast.type === 'success' ? '✓' : '✕'}
          </span>
          {toast.msg}
          <button onClick={() => setToast(null)} style={{
            marginLeft: 8, background: 'rgba(255,255,255,0.15)', border: 'none',
            color: 'white', width: 24, height: 24, borderRadius: 6,
            cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
          }}>✕</button>
        </div>
      )}
    </>
  )
}
