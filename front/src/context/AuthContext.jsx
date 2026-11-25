import { createContext, useContext, useEffect, useState } from "react"
import { api, tokens } from "@/lib/api"

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  // Au chargement : si des tokens existent, on récupère l'utilisateur
  useEffect(() => {
    if (!tokens.access) {
      setLoading(false)
      return
    }
    api
      .me()
      .then(setUser)
      .catch(() => tokens.clear())
      .finally(() => setLoading(false))
  }, [])

  const login = async (email, password) => {
    const data = await api.login(email, password)
    tokens.set(data)
    setUser(data.user)
  }

  const register = (email, password) => api.register(email, password)

  const logout = async () => {
    try {
      await api.logout()
    } catch {
      // Le logout serveur ne fait rien d'important : on ignore l'erreur
    }
    tokens.clear()
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error("useAuth doit être utilisé dans un <AuthProvider>")
  return ctx
}
