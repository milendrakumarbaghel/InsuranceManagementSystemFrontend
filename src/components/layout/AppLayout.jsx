import { useState } from 'react'
import { Outlet } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext.jsx'
import Navbar from './Navbar.jsx'
import Sidebar from './Sidebar.jsx'

function AppLayout() {
  const { user } = useAuth()
  
  // Set to false initially so the sidebar is completely hidden by default
  const [sidebarOpen, setSidebarOpen] = useState(false)

  function toggleSidebar() {
    setSidebarOpen((prev) => !prev)
  }

  function closeSidebar() {
    setSidebarOpen(false)
  }

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 transition-colors dark:bg-gray-950 dark:text-gray-100">
      {/* Top application navigation header */}
      <Navbar onMenuToggle={toggleSidebar} />

      {/* Role-aware navigation panel drawer */}
      <Sidebar
        role={user?.role}
        isOpen={sidebarOpen}
        onClose={closeSidebar}
      />

      {/* Primary router contents canvas layout view */}
      <main
        className={[
          'pt-16 min-h-screen transition-all duration-200 ease-in-out',
          // Shuns left padding dynamically when sidebar state switches
          sidebarOpen ? 'lg:ml-64' : 'lg:ml-0',
        ].join(' ')}
      >
        <div className="p-4 sm:p-6 lg:p-8">
          <Outlet />
        </div>
      </main>
    </div>
  )
}

export default AppLayout