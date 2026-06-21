import { Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext.jsx'

const CARDS = [
  { title: 'My Profile', desc: 'View and update your profile details.', to: '/customer/profile', icon: '👤', color: 'bg-gray-50 border-gray-200 hover:bg-gray-100' },
  { title: 'Browse Products', desc: 'Explore available insurance products and plans.', to: '/customer/products', icon: '🛡️', color: 'bg-blue-50 border-blue-200 hover:bg-blue-100' },
  { title: 'My Policies', desc: 'View and manage your policies.', to: '/customer/policies', icon: '📋', color: 'bg-green-50 border-green-200 hover:bg-green-100' },
  { title: 'My Claims', desc: 'Track your submitted claims.', to: '/customer/claims', icon: '📝', color: 'bg-orange-50 border-orange-200 hover:bg-orange-100' },
]

function CustomerDashboard() {
  const { user } = useAuth()
  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Welcome, {user?.email}</h1>
        <p className="mt-1 text-sm text-gray-500">Manage your insurance policies and claims.</p>
      </div>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {CARDS.map((c) => (
          <Link key={c.to} to={c.to} className={`rounded-xl border p-6 transition-colors ${c.color}`}>
            <div className="mb-3 text-3xl">{c.icon}</div>
            <h2 className="text-base font-semibold text-gray-900">{c.title}</h2>
            <p className="mt-1 text-sm text-gray-600">{c.desc}</p>
          </Link>
        ))}
      </div>
    </div>
  )
}

export default CustomerDashboard
