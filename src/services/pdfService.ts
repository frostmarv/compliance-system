import { supabase } from "@/lib/supabase"

const EDGE_BASE = import.meta.env.VITE_SUPABASE_URL + "/functions/v1"

async function getAuthHeader() {
  const { data: { session } } = await supabase.auth.getSession()
  if (!session) throw new Error("Tidak ada session")
  return { "Authorization": `Bearer ${session.access_token}` }
}

async function parseError(res: Response): Promise<string> {
  try {
    const json = await res.json()
    return json.error ?? json.message ?? "Unknown error"
  } catch {
    return await res.text().catch(() => `HTTP ${res.status}`)
  }
}

// ── Generate PDF untuk 1 hasil ujian ─────────────────────────────────────
export async function generatePdf(hasilId: string) {
  const authHeader = await getAuthHeader()

  const res = await fetch(`${EDGE_BASE}/generate-quiz-pdf`, {
    method: "POST",
    headers: { ...authHeader, "Content-Type": "application/json" },
    body: JSON.stringify({ hasil_id: hasilId }),
  })

  if (!res.ok) {
    const msg = await parseError(res)
    throw new Error(msg)
  }

  return res.json() as Promise<{ status: "created" | "already_exists"; pdf_id: string }>
}

// ── Download ZIP per training ─────────────────────────────────────────────
export async function downloadZip(filter: {
  year: number
  semester: number
  training_type?: string
  factory?: string
  department?: string
}) {
  const authHeader = await getAuthHeader()

  const res = await fetch(`${EDGE_BASE}/download-training-zip`, {
    method: "POST",
    headers: { ...authHeader, "Content-Type": "application/json" },
    body: JSON.stringify(filter),
  })

  if (!res.ok) {
    const msg = await parseError(res)
    throw new Error(msg)
  }

  const blob = await res.blob()
  const url  = URL.createObjectURL(blob)
  const a    = document.createElement("a")
  a.href     = url
  a.download = `${filter.training_type ?? "training"}_${filter.year}_S${filter.semester}.zip`
  a.click()
  URL.revokeObjectURL(url)
}

// ── List PDF — untuk tabel di halaman admin ───────────────────────────────
export async function listPdfs(filter: {
  year?: number
  semester?: number
  training_type?: string
  factory?: string
  department?: string
  nik?: string
}) {
  const authHeader = await getAuthHeader()

  const res = await fetch(`${EDGE_BASE}/list-pdfs`, {
    method: "POST",
    headers: { ...authHeader, "Content-Type": "application/json" },
    body: JSON.stringify(filter),
  })

  if (!res.ok) {
    const msg = await parseError(res)
    throw new Error(msg)
  }

  return res.json() as Promise<{
    id: string
    training_name: string
    nik: string
    employee_name: string
    department: string
    factory: string
    score: number
    passed: boolean
    generated_at: string
  }[]>
}

// ── View / download PDF satuan ────────────────────────────────────────────
export async function openPdf(pdfId: string, mode: "view" | "download" = "view") {
  const authHeader = await getAuthHeader()

  const res = await fetch(`${EDGE_BASE}/get-pdf`, {
    method: "POST",
    headers: { ...authHeader, "Content-Type": "application/json" },
    body: JSON.stringify({ pdf_id: pdfId, mode }),
  })

  if (!res.ok) {
    const msg = await parseError(res)
    throw new Error(msg)
  }

  const blob = await res.blob()
  const url  = URL.createObjectURL(blob)

  if (mode === "view") {
    window.open(url, "_blank")
  } else {
    const a    = document.createElement("a")
    a.href     = url
    a.download = `result_${pdfId}.pdf`
    a.click()
  }

  URL.revokeObjectURL(url)
}