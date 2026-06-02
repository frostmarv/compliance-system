// src/layouts/AdminLayout.tsx
import { Outlet } from 'react-router-dom'
import Sidebar from '@/components/ui/Sidebar'

export default function AdminLayout() {
  return (
    <div className="flex h-screen">
      <Sidebar />
      <main className="flex-1 overflow-y-auto bg-gray-50">
        <Outlet />
      </main>
    </div>
  )
}