import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'

// 🌐 Public Pages
import HomePage from './pages/HomePage'
import QuizPage from './pages/public/QuizPage'
import Quiz5R from './pages/public/quiz/5r/5R'

// 🔐 Admin Pages & Layouts
import LoginPage from './pages/admin/LoginPage'
import Dashboard from './pages/admin/Dashboard'
import SoalUjian from './pages/admin/quiz/SoalUjian'
import ProtectedRoute from './components/admin/ProtectedRoute'
import AdminLayout from './layouts/AdminLayout'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* 🌐 Public Routes */}
        <Route path="/" element={<HomePage />} />
        <Route path="/quiz" element={<QuizPage />} />
        <Route path="/quiz/5r" element={<Quiz5R />} />

        {/* 🔐 Admin Login — tanpa sidebar */}
        <Route path="/admin/login" element={<LoginPage />} />

        {/* 🛡️ Admin Routes — dengan Sidebar */}
        <Route element={<ProtectedRoute />}>
          <Route element={<AdminLayout />}>
            <Route path="/admin/dashboard" element={<Dashboard />} />
            <Route path="/admin/quiz/soal" element={<SoalUjian />} />
            
            {/* 🔹 Tambahkan route admin lain di sini */}
            {/* <Route path="/admin/hasil" element={<Hasil />} /> */}
            {/* <Route path="/admin/users" element={<Users />} /> */}
          </Route>
        </Route>

        {/* Fallback — redirect ke Home jika route tidak ditemukan */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App