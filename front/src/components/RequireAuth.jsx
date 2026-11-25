import { Navigate } from "react-router-dom"
import { useAuth } from "@/context/AuthContext"

// Protège une page : redirige vers l'accueil si l'utilisateur n'est pas connecté.
// Quand on se déconnecte depuis cette page, la redirection se fait toute seule.
export default function RequireAuth({ children }) {
  const { user, loading } = useAuth()

  // On attend la fin de la vérification du token (/me) avant de décider
  if (loading) return null

  return user ? children : <Navigate to="/" replace />
}
