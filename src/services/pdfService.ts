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

// ── View PDF — buka di tab baru ───────────────────────────────────────────
export async function viewPdf(pdfId: string) {
  const authHeader = await getAuthHeader()

  const res = await fetch(`${EDGE_BASE}/view-pdf`, {
    method: "POST",
    headers: { ...authHeader, "Content-Type": "application/json" },
    body: JSON.stringify({ pdf_id: pdfId }),
  })

  if (!res.ok) {
    const msg = await parseError(res)
    throw new Error(msg)
  }

  const blob = await res.blob()
  const url  = URL.createObjectURL(blob)
  const tab  = window.open(url, "_blank")

  // Cleanup blob URL setelah tab dibuka
  setTimeout(() => URL.revokeObjectURL(url), 10_000)

  if (!tab) throw new Error("Popup diblokir browser — izinkan popup untuk situs ini")
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