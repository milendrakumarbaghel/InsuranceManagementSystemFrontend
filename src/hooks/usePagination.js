import { useSearchParams } from 'react-router-dom'
import {
  DEFAULT_PAGE_SIZE,
  MAX_PAGE_SIZE,
  DEFAULT_SORT,
  DEFAULT_SORT_DIR,
} from '../utils/constants'

function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max)
}

// Known pagination/sort param keys — used to identify filter params.
const PAGINATION_KEYS = new Set(['page', 'size', 'sort', 'sortDir'])

export function usePagination({
  defaultPageSize = DEFAULT_PAGE_SIZE,
  defaultSort = DEFAULT_SORT,
  defaultSortDir = DEFAULT_SORT_DIR,
} = {}) {
  const [searchParams, setSearchParams] = useSearchParams()

  // Derive current values from URL

  const page = clamp(
    parseInt(searchParams.get('page') ?? '0', 10) || 0,
    0,
    Number.MAX_SAFE_INTEGER
  )

  const pageSize = clamp(
    parseInt(searchParams.get('size') ?? String(defaultPageSize), 10) || defaultPageSize,
    1,
    MAX_PAGE_SIZE
  )

  const sort = searchParams.get('sort') ?? defaultSort
  const sortDir = searchParams.get('sortDir') ?? defaultSortDir

  // Collect any additional filter keys (everything that is not a pagination key)
  const filters = {}
  for (const [key, value] of searchParams.entries()) {
    if (!PAGINATION_KEYS.has(key)) {
      filters[key] = value
    }
  }

  const params = {
    page,
    pageSize,
    sort,
    sortDir,
    ...filters,
  }

  // Setters

  function setPage(n) {
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev)
      next.set('page', String(n))
      return next
    })
  }

  function setPageSize(n) {
    const clamped = clamp(n, 1, MAX_PAGE_SIZE)
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev)
      next.set('size', String(clamped))
      next.set('page', '0')
      return next
    })
  }

  function setSort(field, dir) {
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev)
      next.set('sort', field)
      next.set('sortDir', dir)
      next.set('page', '0')
      return next
    })
  }

  function setFilter(key, value) {
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev)
      if (value === undefined || value === '') {
        next.delete(key)
      } else {
        next.set(key, String(value))
      }
      next.set('page', '0')
      return next
    })
  }

  function resetFilters() {
    setSearchParams({
      page: '0',
      size: String(defaultPageSize),
      sort: defaultSort,
      sortDir: defaultSortDir,
    })
  }

  return {
    params,
    page,
    pageSize,
    sort,
    sortDir,
    setPage,
    setPageSize,
    setSort,
    setFilter,
    resetFilters,
  }
}

export default usePagination
