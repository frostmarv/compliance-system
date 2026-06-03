// lib/quiz-status.ts

export type QuizStatus = 'OPEN' | 'UPCOMING' | 'EXPIRED' | 'LOCKED'

export interface QuizSchedule {
  id: string
  training_type_id: string
  factory: number | null  // null = global
  starts_at: string       // ISO string
  ends_at: string         // ISO string
  is_manually_locked: boolean
}

/**
 * Hitung status UI berdasarkan WAKTU & MANUAL LOCK saja.
 * Factory check TIDAK dimasukkan disini agar form tetap bisa diakses user untuk input NIK.
 */
export function computeQuizStatus(
  schedule: QuizSchedule | null
): QuizStatus {
  // 1. Cek manual lock (Hard Lock: benar-benar tutup untuk semua)
  if (!schedule || schedule.is_manually_locked) return 'LOCKED'
  
  // 2. Cek waktu
  const now = new Date()
  const start = new Date(schedule.starts_at)
  const end = new Date(schedule.ends_at)
  
  if (start > now) return 'UPCOMING'
  if (end < now) return 'EXPIRED'
  
  // Jika waktu valid, UI akan menampilkan form "OPEN"
  return 'OPEN'
}

/**
 * ✅ Fungsi Baru: Cek apakah factory user diizinkan akses quiz ini.
 * Dipakai saat user klik "Mulai" atau setelah input NIK.
 */
export function checkFactoryAccess(
  schedule: QuizSchedule | null, 
  userFactory: number
): { allowed: boolean; reason?: string } {
  if (!schedule) return { allowed: false, reason: 'Jadwal tidak ditemukan' }
  
  // Jika schedule.factory null = Global (semua factory boleh)
  if (schedule.factory === null) return { allowed: true }
  
  // Jika schedule.factory spesifik, harus match
  if (schedule.factory === userFactory) return { allowed: true }
  
  // Jika tidak match
  return { 
    allowed: false, 
    reason: `Quiz ini khusus untuk Factory ${schedule.factory}` 
  }
}

/**
 * Format pesan user-friendly berdasarkan status
 */
export function getStatusMessage(status: QuizStatus, quizName: string): {
  title: string
  description: string
  tone: 'success' | 'warning' | 'error' | 'info'
} {
  switch (status) {
    case 'OPEN':
      return {
        title: 'Quiz Tersedia',
        description: `Silakan masukkan NIK untuk memulai ${quizName}`,
        tone: 'success'
      }
    case 'UPCOMING':
      return {
        title: 'Belum Dimulai',
        description: `${quizName} akan tersedia sesuai jadwal yang ditentukan`,
        tone: 'info'
      }
    case 'EXPIRED':
      return {
        title: 'Sudah Ditutup',
        description: `Periode ${quizName} telah berakhir. Hubungi Compliance Team untuk informasi lebih lanjut`,
        tone: 'error'
      }
    case 'LOCKED':
      return {
        title: 'Tidak Tersedia',
        description: `Akses ${quizName} sedang dibatasi. Silakan hubungi Compliance Team`,
        tone: 'error'
      }
  }
}