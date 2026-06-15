import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'

export interface Staff {
  id: string
  nik: string
  nama: string
  department: string | null
  factory: number | null
  role: string
}

interface AuthState {
  staff: Staff | null
  loading: boolean
}

export function useAuth(): AuthState {
  const [staff, setStaff]   = useState<Staff | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const load = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) { setLoading(false); return }

      const { data } = await supabase
        .from('staff')
        .select('id, nik, nama, department, factory, role')
        .eq('id', session.user.id)
        .single()

      setStaff(data ?? null)
      setLoading(false)
    }

    load()

    const { data: listener } = supabase.auth.onAuthStateChange(() => {
      load()
    })

    return () => listener.subscription.unsubscribe()
  }, [])

  return { staff, loading }
}

/** Helper: apakah user adalah owner (akses semua factory) */
export const isOwner = (staff: Staff | null) =>
  staff?.role?.toLowerCase() === 'owner'

// Opsional: Gunakan ini jika Anda tetap ingin memakai nama fungsi 'isPemilik' di komponen lain
// export const isPemilik = (staff: Staff | null) =>
//   staff?.role?.toLowerCase() === 'owner'