import { useState } from 'react'
import { Outlet } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext.jsx'
import Navbar from './Navbar.jsx'
import Sidebar from './Sidebar.jsx'

function AppLayout() {
  const { user } = useAuth()
  
  // Controls the mobile drawer only; desktop sidebar is always visible
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false)

  function toggleMobileSidebar() {
    setMobileSidebarOpen((prev) => !prev)
  }

  function closeMobileSidebar() {
    setMobileSidebarOpen(false)
  }

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 transition-colors dark:bg-gray-950 dark:text-gray-100">
      {/* Top application navigation header */}
      <Navbar onMenuToggle={toggleMobileSidebar} />

      {/* Role-aware navigation panel */}
      <Sidebar
        role={user?.role}
        isMobileOpen={mobileSidebarOpen}
        onMobileClose={closeMobileSidebar}
      />

      {/* Primary content area — always offset on lg+ for the permanent sidebar */}
      <main className="pt-16 min-h-screen transition-all duration-200 ease-in-out lg:ml-64">
        <div className="p-4 sm:p-6 lg:p-8">
          <Outlet />
        </div>
      </main>
    </div>
  )
}

export default AppLayout