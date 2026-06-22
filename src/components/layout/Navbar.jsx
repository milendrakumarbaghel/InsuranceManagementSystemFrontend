import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext.jsx'
import { useTheme } from '../../context/ThemeContext.jsx'

function roleBadgeClass(role) {
  const map = {
    ADMIN: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
    AGENT: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400',
    CUSTOMER: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
  }
  return map[role] ?? 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300'
}

function Navbar({ onMenuToggle }) {
  const { user, logout } = useAuth()
  const { isDark, toggleTheme } = useTheme()
  const navigate = useNavigate()

  function handleLogout() {
    logout()
    navigate('/login', { replace: true })
  }

  return (
    <header className="h-16 bg-white border-b border-gray-200 flex items-center px-4 gap-3 shadow-sm z-30 fixed top-0 left-0 right-0 transition-colors dark:bg-gray-900 dark:border-gray-800">
      {/* Unified Sidebar Hamburger Menu Toggle Button */}
      <button
        type="button"
        onClick={onMenuToggle}
        aria-label="Toggle navigation menu"
        className="p-2 rounded-lg text-gray-500 hover:bg-gray-100 hover:text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-white"
      >
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>

      {/* App branding title logo */}
      <span className="text-lg font-bold text-blue-600 tracking-tight select-none ml-2 dark:text-blue-400">
        InsureMS
      </span>

      {/* Flex spacing spacer */}
      <div className="flex-1" />

      {/* Authenticated user session account configuration actions */}
      {user && (
        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={toggleTheme}
            aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
            title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
            className="group relative inline-flex h-9 w-9 items-center justify-center rounded-full bg-gray-100 text-gray-600 transition-all hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
          >
            {isDark ? (
              <svg className="h-4 w-4 transition-transform group-hover:rotate-90" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v2m0 14v2m9-9h-2M5 12H3m15.36-6.36-1.42 1.42M7.05 16.95l-1.41 1.41m12.72 0-1.42-1.41M7.05 7.05 5.64 5.64M12 8a4 4 0 100 8 4 4 0 000-8z" />
              </svg>
            ) : (
              <svg className="h-4 w-4 transition-transform group-hover:-rotate-12" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z" />
              </svg>
            )}
          </button>

          <div className="hidden sm:flex flex-col items-end leading-tight">
            <span className="text-sm font-medium text-gray-900 dark:text-gray-100">{user.username}</span>
            <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider mt-0.5 ${roleBadgeClass(user.role)}`}>
              {user.role}
            </span>
          </div>

          <button
            type="button"
            onClick={handleLogout}
            className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-gray-600 rounded-lg border border-gray-200 bg-white hover:bg-red-50 hover:text-red-600 hover:border-red-200 focus:outline-none focus:ring-2 focus:ring-red-400 transition-colors dark:bg-gray-800 dark:border-gray-700 dark:text-gray-300 dark:hover:border-red-900/50 dark:hover:bg-red-900/20 dark:hover:text-red-400"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h6a2 2 0 012 2v1" />
            </svg>
            <span className="hidden sm:inline">Logout</span>
          </button>
        </div>
      )}
    </header>
  )
}

export default Navbar