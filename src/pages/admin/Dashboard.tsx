import { useNavigate } from 'react-router-dom'
import { supabase } from '../../lib/supabase'

export default function Dashboard() {
  const navigate = useNavigate()

  const handleLogout = async () => {
    await supabase.auth.signOut()
    navigate('/admin/login')
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow px-6 py-4 flex justify-between items-center">
        <h1 className="text-xl font-bold text-gray-800">📊 Admin Dashboard</h1>
        <button onClick={handleLogout} className="text-red-500 hover:text-red-700 font-medium">Logout</button>
      </nav>
      <main className="p-6">
        <div className="bg-white p-6 rounded-xl shadow mb-6">
          <h2 className="text-lg font-semibold mb-2">Selamat Datang, Admin!</h2>
          <p className="text-gray-600">Kelola soal, karyawan, dan lihat hasil ujian di sini.</p>
        </div>
        {/* Nanti di sini kita tambah tabel & form input */}
      </main>
    </div>
  )
}