import { useState } from 'react'
import { Outlet } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext.jsx'
import Navbar from './Navbar.jsx'
import Sidebar from './Sidebar.jsx'


function AppLayout() {
  const { user } = useAuth()

  
  const [sidebarOpen, setSidebarOpen] = useState(true)

  function toggleSidebar() {
    setSidebarOpen((prev) => !prev)
  }

  function closeSidebar() {
    setSidebarOpen(false)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top navigation bar */}
      <Navbar onMenuToggle={toggleSidebar} />

      {/* Sidebar — role-aware navigation */}
      <Sidebar
        role={user?.role}
        isOpen={sidebarOpen}
        onClose={closeSidebar}
      />

      
      <main
        className={[
          'pt-16 min-h-screen transition-all duration-200',
          // When sidebar is open on lg, push content right
          sidebarOpen ? 'lg:ml-64' : 'lg:ml-0',
        ].join(' ')}
      >
        <div className="p-4 sm:p-6 lg:p-8">
          {/* Active page content */}
          <Outlet />
        </div>
      </main>
    </div>
  )
}

export default AppLayout
