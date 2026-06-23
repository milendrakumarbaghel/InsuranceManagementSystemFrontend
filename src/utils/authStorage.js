const ACCESS_TOKEN_KEY = 'accessToken'
const REFRESH_TOKEN_KEY = 'refreshToken'
const LEGACY_TOKEN_KEY = 'token'
const USER_KEY = 'user'
export const AUTH_CLEARED_EVENT = 'auth:cleared'

export function getAccessToken() {
  return localStorage.getItem(ACCESS_TOKEN_KEY) ?? localStorage.getItem(LEGACY_TOKEN_KEY)
}

export function getRefreshToken() {
  return localStorage.getItem(REFRESH_TOKEN_KEY)
}

export function clearAuthStorage({ notify = true } = {}) {
  localStorage.removeItem(ACCESS_TOKEN_KEY)
  localStorage.removeItem(REFRESH_TOKEN_KEY)
  localStorage.removeItem(LEGACY_TOKEN_KEY)
  localStorage.removeItem(USER_KEY)

  if (notify) {
    window.dispatchEvent(new Event(AUTH_CLEARED_EVENT))
  }
}

export function normalizeAuthUser(authUser = {}) {
  const accessToken = authUser.accessToken ?? authUser.token
  const refreshToken = authUser.refreshToken
  const role = (authUser.role ?? '').replace(/^ROLE_/, '')
  const username = authUser.username ?? authUser.name ?? authUser.email ?? ''

  return {
    ...authUser,
    accessToken,
    refreshToken,
    role,
    username,
  }
}

export function storeAuthSession(authUser) {
  const normalized = normalizeAuthUser(authUser)

  if (normalized.accessToken) {
    localStorage.setItem(ACCESS_TOKEN_KEY, normalized.accessToken)
    localStorage.removeItem(LEGACY_TOKEN_KEY)
  }

  if (normalized.refreshToken) {
    localStorage.setItem(REFRESH_TOKEN_KEY, normalized.refreshToken)
  }

  localStorage.setItem(USER_KEY, JSON.stringify(normalized))
  return normalized
}

export function readStoredAuthUser() {
  try {
    const accessToken = getAccessToken()
    const refreshToken = getRefreshToken()
    const userRaw = localStorage.getItem(USER_KEY)

    if ((accessToken || refreshToken) && userRaw) {
      return storeAuthSession({
        ...JSON.parse(userRaw),
        accessToken,
        refreshToken,
      })
    }
  } catch {
    clearAuthStorage({ notify: false })
  }

  return null
}
