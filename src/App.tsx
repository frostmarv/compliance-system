import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import QuizPage from './pages/public/QuizPage'
import LoginPage from './pages/admin/LoginPage'
import Dashboard from './pages/admin/Dashboard'
import ProtectedRoute from './components/admin/ProtectedRoute'
import Quiz5R from './pages/public/quiz/5r/5R'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* 🌐 Public Route */}
        <Route path="/" element={<QuizPage />} />
        <Route path="/quiz/5r" element={<Quiz5R />} />

        {/*  Admin Routes */}
        <Route path="/admin/login" element={<LoginPage />} />
        <Route element={<ProtectedRoute />}>
          <Route path="/admin/dashboard" element={<Dashboard />} />
        </Route>
        
        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App