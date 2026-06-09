import { useState } from "react"
import { generatePdf, downloadZip } from "@/services/pdfService"

export function usePdf() {
  const [generating, setGenerating] = useState(false)
  const [downloading, setDownloading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Dipanggil setelah karyawan submit quiz
  const handleGeneratePdf = async (hasilId: string) => {
    setGenerating(true)
    setError(null)
    try {
      const result = await generatePdf(hasilId)
      return result
    } catch (err: any) {
      setError(err.message)
      throw err
    } finally {
      setGenerating(false)
    }
  }

  // Dipanggil admin untuk download ZIP
  const handleDownloadZip = async (filter: Parameters<typeof downloadZip>[0]) => {
    setDownloading(true)
    setError(null)
    try {
      await downloadZip(filter)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setDownloading(false)
    }
  }

  return {
    generating,
    downloading,
    error,
    generatePdf:  handleGeneratePdf,
    downloadZip:  handleDownloadZip,
  }
}