import { forwardRef } from 'react'

const FormSelect = forwardRef(function FormSelect(
  { label, name, options = [], error, required = false, className = '', ...rest },
  ref
) {
  const inputId = `field-${name}`

  return (
    <div className="flex flex-col gap-1">
      <label htmlFor={inputId} className="text-sm font-medium text-gray-700">
        {label}
        {required && (
          <span className="ml-1 text-red-500" aria-hidden="true">
            *
          </span>
        )}
      </label>

      <select
        ref={ref}
        id={inputId}
        name={name}
        aria-describedby={error ? `${inputId}-error` : undefined}
        aria-invalid={!!error}
        className={`rounded-md border bg-white px-3 py-2 text-sm text-gray-800 shadow-sm transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 ${
          error
            ? 'border-red-400 focus:border-red-400 focus:ring-red-400'
            : 'border-gray-300 focus:border-blue-500'
        } ${className}`}
        {...rest}
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>

      {error && (
        <p id={`${inputId}-error`} role="alert" className="text-xs text-red-600">
          {error}
        </p>
      )}
    </div>
  )
})

export default FormSelect
