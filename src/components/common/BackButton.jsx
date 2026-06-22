import { useNavigate } from 'react-router-dom'

function BackButton({ label = 'Back' }) {
  const navigate = useNavigate()

  return (
    <button
      type="button"
      onClick={() => navigate(-1)}
      className="mb-4 inline-flex items-center text-sm font-medium text-gray-500 transition-colors hover:text-blue-600 focus:outline-none"
    >
      <svg className="mr-1.5 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
      </svg>
      {label}
    </button>
  )
}

export default BackButton