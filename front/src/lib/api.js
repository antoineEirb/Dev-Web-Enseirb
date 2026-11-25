// Adapte l'URL à ton serveur (ou définis VITE_API_URL dans un fichier .env)
const API_URL = import.meta.env.VITE_API_URL ?? "http://localhost:3000/api"

const ACCESS_KEY = "accessToken"
const REFRESH_KEY = "refreshToken"

export const tokens = {
  get access() {
    return localStorage.getItem(ACCESS_KEY)
  },
  get refresh() {
    return localStorage.getItem(REFRESH_KEY)
  },
  set({ accessToken, refreshToken }) {
    localStorage.setItem(ACCESS_KEY, accessToken)
    localStorage.setItem(REFRESH_KEY, refreshToken)
  },
  clear() {
    localStorage.removeItem(ACCESS_KEY)
    localStorage.removeItem(REFRESH_KEY)
  },
}

// Requête JSON de base. Lève une Error avec le message renvoyé par le back.
async function request(path, { method = "GET", body, token } = {}) {
  let res
  try {
    res = await fetch(`${API_URL}${path}`, {
      method,
      headers: {
        ...(body && { "Content-Type": "application/json" }),
        ...(token && { Authorization: `Bearer ${token}` }),
      },
      body: body ? JSON.stringify(body) : undefined,
    })
  } catch {
    throw new Error("Impossible de joindre le serveur")
  }

  const data = res.status === 204 ? null : await res.json().catch(() => null)
  if (!res.ok) {
    const error = new Error(data?.error ?? "Une erreur est survenue")
    error.status = res.status
    throw error
  }
  return data
}

// Demande une nouvelle paire de tokens avec le refresh token
async function refreshTokens() {
  if (!tokens.refresh) throw new Error("Session expirée")
  const data = await request("/auth/refresh", {
    method: "POST",
    body: { refreshToken: tokens.refresh },
  })
  tokens.set(data)
}

// Requête authentifiée : si l'access token est expiré (401),
// on le renouvelle une fois puis on retente.
export async function authRequest(path, options = {}) {
  try {
    return await request(path, { ...options, token: tokens.access })
  } catch (err) {
    if (err.status !== 401) throw err
    await refreshTokens()
    return request(path, { ...options, token: tokens.access })
  }
}

export const api = {
  register: (email, password) =>
    request("/auth/register", { method: "POST", body: { email, password } }),
  login: (email, password) =>
    request("/auth/login", { method: "POST", body: { email, password } }),
  logout: () => request("/auth/logout", { method: "POST" }),
  me: () => authRequest("/auth/me"),
}
