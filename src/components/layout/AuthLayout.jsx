import { Outlet } from 'react-router-dom'

function AuthLayout() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-4 py-12">
      {/* Brand header */}
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold text-blue-700 tracking-tight">InsureMS</h1>
        <p className="text-sm text-gray-500 mt-1">Insurance Management System</p>
      </div>

      {/* Card */}
      <div className="w-full max-w-md bg-white rounded-2xl shadow-md p-8">
        {/* Page-specific content (LoginPage / RegisterPage) */}
        <Outlet />
      </div>

      <p className="mt-6 text-xs text-gray-400">
        &copy; {new Date().getFullYear()} InsureMS. All rights reserved.
      </p>
    </div>
  )
}

export default AuthLayout
