import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'

function LoadingFallback() {
  return (
    <div
      role="status"
      aria-label="Loading"
      className="fixed inset-0 flex items-center justify-center bg-white"
    >
      <div className="flex flex-col items-center gap-3">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-blue-600 border-t-transparent" />
        <p className="text-sm text-gray-500">Loading…</p>
      </div>
    </div>
  )
}


function ProtectedRoute({ allowedRoles }) {
  const { isLoading, isAuthenticated, user } = useAuth()
  const location = useLocation()

  // Step 1 — still reading localStorage / resolving initial auth state
  if (isLoading) {
    return <LoadingFallback />
  }

  // Step 2 — unauthenticated: send to login, remember the attempted URL
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  // Step 3 — authenticated but wrong role
  if (allowedRoles && allowedRoles.length > 0 && !allowedRoles.includes(user?.role)) {
    return <Navigate to="/unauthorized" replace />
  }

  // Step 4 — all checks passed; render the child routes
  return <Outlet />
}

export default ProtectedRoute
