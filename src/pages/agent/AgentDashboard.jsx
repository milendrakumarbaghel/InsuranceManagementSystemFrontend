import { Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

const DASHBOARD_CARDS = [
  {
    title: 'Customers',
    description: 'Browse and search customer profiles, view their policies.',
    to: '/agent/customers',
    icon: '👤',
    color: 'bg-blue-50 border-blue-200 hover:bg-blue-100 dark:bg-blue-900/20 dark:border-blue-800 dark:hover:bg-blue-900/40',
    iconBg: 'bg-blue-100 dark:bg-blue-800',
  },
  {
    title: 'Policies',
    description: 'View all policies and issue new policies on behalf of customers.',
    to: '/agent/policies',
    icon: '📄',
    color: 'bg-purple-50 border-purple-200 hover:bg-purple-100 dark:bg-purple-900/20 dark:border-purple-800 dark:hover:bg-purple-900/40',
    iconBg: 'bg-purple-100 dark:bg-purple-800',
  },
  {
    title: 'Claim Queue',
    description: 'Review submitted and under-review claims, add remarks and recommendations.',
    to: '/agent/claims',
    icon: '🔔',
    color: 'bg-orange-50 border-orange-200 hover:bg-orange-100 dark:bg-orange-900/20 dark:border-orange-800 dark:hover:bg-orange-900/40',
    iconBg: 'bg-orange-100 dark:bg-orange-800',
  },
  {
    title: 'Payments',
    description: 'Record premium payments and view payment history.',
    to: '/agent/payments',
    icon: '💳',
    color: 'bg-teal-50 border-teal-200 hover:bg-teal-100 dark:bg-teal-900/20 dark:border-teal-800 dark:hover:bg-teal-900/40',
    iconBg: 'bg-teal-100 dark:bg-teal-800',
  },
]

function AgentDashboard() {
  const { user } = useAuth()
  
  return (
    <div className="p-6 max-w-6xl mx-auto">
      {/* Refined Header Section */}
      <div className="mb-8 border-b border-gray-200 pb-6 dark:border-gray-800">
        <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white">
          Agent Dashboard
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-400 mt-2">
          Welcome back, <span className="font-semibold text-blue-600 dark:text-blue-400">{user?.name || 'Agent'}</span>. 
          Manage your daily operations efficiently below.
        </p>
      </div>

      {/* Grid Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {DASHBOARD_CARDS.map((card) => (
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

export default AgentDashboard
