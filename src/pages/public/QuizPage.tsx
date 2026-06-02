import { useState } from 'react'
import { supabase } from '../../lib/supabase'

export default function QuizPage() {
  const [nik, setNik] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    
    const { data, error } = await supabase
      .from('karyawan')
      .select('*')
      .eq('nik', nik.trim())
      .single()

    if (error || !data) {
      alert(' NIK tidak ditemukan!')
    } else {
      alert(`✅ Selamat datang, ${data.nama}! (Factory ${data.factory})`)
      // Nanti di sini redirect ke halaman soal
    }
    setLoading(false)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md">
        <h1 className="text-2xl font-bold text-center text-gray-800 mb-2">🏭 Compliance Quiz</h1>
        <p className="text-center text-gray-500 mb-6">Masukkan NIK untuk memulai ujian</p>
        
        <form onSubmit={handleSearch} className="space-y-4">
          <input
            type="text"
            placeholder="Contoh: 32406258"
            value={nik}
            onChange={(e) => setNik(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition"
            required
          />
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 rounded-lg transition disabled:opacity-50"
          >
            {loading ? 'Mencari...' : 'Mulai Ujian'}
          </button>
        </form>
      </div>
    </div>
  )
}