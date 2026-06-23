import { Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

const CUSTOMER_DASHBOARD_CARDS = [
  {
    title: 'My Profile',
    description: 'View and update your profile details.',
    to: '/customer/profile',
    icon: '👤',
    color: 'bg-gray-50 border-gray-200 hover:bg-gray-100 dark:bg-gray-900 dark:border-gray-800 dark:hover:bg-gray-800',
    iconBg: 'bg-gray-100 dark:bg-gray-800',
  },
  {
    title: 'Browse Products',
    description: 'Explore available insurance products and plans.',
    to: '/customer/products',
    icon: '🛡️',
    color: 'bg-blue-50 border-blue-200 hover:bg-blue-100 dark:bg-blue-900/20 dark:border-blue-800 dark:hover:bg-blue-900/40',
    iconBg: 'bg-blue-100 dark:bg-blue-800',
  },
  {
    title: 'My Policies',
    description: 'View and manage your policies and status.',
    to: '/customer/policies',
    icon: '📋',
    color: 'bg-green-50 border-green-200 hover:bg-green-100 dark:bg-green-900/20 dark:border-green-800 dark:hover:bg-green-900/40',
    iconBg: 'bg-green-100 dark:bg-green-800',
  },
  {
    title: 'My Claims',
    description: 'Submit new claims and track their status.',
    to: '/customer/claims',
    icon: '📝',
    color: 'bg-orange-50 border-orange-200 hover:bg-orange-100 dark:bg-orange-900/20 dark:border-orange-800 dark:hover:bg-orange-900/40',
    iconBg: 'bg-orange-100 dark:bg-orange-800',
  },
  {
    title: 'Payments',
    description: 'View payment history or make new payments.',
    to: '/customer/payments',
    icon: '💳',
    color: 'bg-teal-50 border-teal-200 hover:bg-teal-100 dark:bg-teal-900/20 dark:border-teal-800 dark:hover:bg-teal-900/40',
    iconBg: 'bg-teal-100 dark:bg-teal-800',
  },
]

function CustomerDashboard() {
  const { user } = useAuth()

  return (
    <div className="p-6 max-w-6xl mx-auto">
      {/* Refined Header Section */}
      <div className="mb-8 border-b border-gray-200 pb-6 dark:border-gray-800">
        <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white">
          Customer Dashboard
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-400 mt-2">
          Welcome back, <span className="font-semibold text-blue-600 dark:text-blue-400">{user?.name || 'Customer'}</span>. 
          Manage your insurance portfolio and records here.
        </p>
      </div>

      {/* Grid Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {CUSTOMER_DASHBOARD_CARDS.map((card) => (
          <Link
            key={card.to}
            to={card.to}
            className={`flex items-start gap-4 rounded-xl border p-5 transition-all hover:shadow-md ${card.color}`}
          >
            <div
              className={`flex h-14 w-14 items-center justify-center rounded-xl text-3xl ${card.iconBg} shrink-0 shadow-sm`}
            >
              {card.icon}
            </div>
            <div className="flex flex-col justify-center">
              <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100">{card.title}</h2>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1 leading-relaxed">
                {card.description}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}

export default CustomerDashboard