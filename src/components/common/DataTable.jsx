import { useState } from 'react'
import Spinner from './Spinner'
import EmptyState from './EmptyState'
import Pagination from './Pagination'
import { exportToPDF } from '../../utils/exportUtils'

function DataTable({
  columns = [],
  data = [],
  isLoading = false,
  emptyMessage = 'No records found.',
  onRowClick,
  paginationProps,
  exportTitle
}) {
  const [sortKey, setSortKey] = useState(null)
  const [sortDir, setSortDir] = useState('asc') // 'asc' | 'desc'
  const [isExporting, setIsExporting] = useState(false)

  function handleSort(col) {
    if (!col.sortable) return
    if (sortKey === col.key) {
      setSortDir((prev) => (prev === 'asc' ? 'desc' : 'asc'))
    } else {
      setSortKey(col.key)
      setSortDir('asc')
    }
  }
  const handleExport = () => {
    setIsExporting(true);
   setTimeout(() => {
    exportToPDF(rows, columns, exportTitle);
    setIsExporting(false);
  }, 100);
  };

  // Client-side sort when no external sort handler is provided
  const rows = [...data].sort((a, b) => {
    if (!sortKey) return 0
    const aVal = a[sortKey]
    const bVal = b[sortKey]
    if (aVal == null) return 1
    if (bVal == null) return -1
    if (typeof aVal === 'number' && typeof bVal === 'number') {
      return sortDir === 'asc' ? aVal - bVal : bVal - aVal
    }
    const cmp = String(aVal).localeCompare(String(bVal))
    return sortDir === 'asc' ? cmp : -cmp
  })

  function sortIndicator(col) {
    if (!col.sortable) return null
    if (sortKey !== col.key) return <span className="ml-1 text-gray-300">↕</span>
    return (
      <span className="ml-1 text-blue-500">{sortDir === 'asc' ? '↑' : '↓'}</span>
    )
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Spinner />
      </div>
    )
  }

  return (
    <div className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm">
      {exportTitle && (
        <div className="flex justify-end p-4 border-b border-gray-100">
          <button 
            onClick={handleExport}
            disabled={isExporting || rows.length === 0}
            className="px-4 py-2 bg-blue-600 text-white rounded text-sm hover:bg-blue-700 disabled:opacity-50"
          >
            {isExporting ? 'Exporting...' : 'Export PDF'}
          </button>
        </div>
      )}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              {columns.map((col) => (
                <th
                  key={col.key}
                  scope="col"
                  onClick={() => handleSort(col)}
                  className={`px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500 ${
                    col.sortable
                      ? 'cursor-pointer select-none hover:bg-gray-100'
                      : ''
                  } ${col.width ?? ''}`}
                >
                  {col.header}
                  {sortIndicator(col)}
                </th>
              ))}
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-100 bg-white">
            {rows.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className="px-4 py-0">
                  <EmptyState message={emptyMessage} />
                </td>
              </tr>
            ) : (
              rows.map((row, rowIdx) => (
                <tr
                  key={row.id ?? rowIdx}
                  onClick={onRowClick ? () => onRowClick(row) : undefined}
                  className={`transition-colors ${
                    onRowClick
                      ? 'cursor-pointer hover:bg-blue-50'
                      : 'hover:bg-gray-50'
                  }`}
                >
                  {columns.map((col) => (
                    <td
                      key={col.key}
                      className="whitespace-nowrap px-4 py-3 text-sm text-gray-700"
                    >
                      {col.render ? col.render(row) : row[col.key] ?? '—'}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Inline pagination */}
      {paginationProps && (
        <div className="border-t border-gray-100 px-4">
          <Pagination {...paginationProps} />
        </div>
      )}
    </div>
  )
}

export default DataTable
