import { Link, NavLink } from "react-router-dom"
import { Flower } from "lucide-react"
import { Button } from "@/components/ui/button"

// Style d'un lien de navigation, avec un soulignement sur la page active
const navClass = ({ isActive }) =>
  isActive
    ? "underline underline-offset-8"
    : "hover:text-muted-foreground transition-colors"

export default function Header({ user, onLoginClick, onSignupClick, onLogoutClick }) {
  return (
    <header className="border-b bg-background">
      <div className="flex h-16 items-center justify-between px-6 md:px-16">
        <div className="flex items-center gap-8 md:gap-12">
          <Link to="/" className="flex items-center gap-2">
            <Flower className="size-6" />
            <span className="text-lg font-semibold">Seen-flix</span>
          </Link>

          <nav className="flex items-center gap-6 text-base font-semibold">
            <NavLink to="/" end className={navClass}>
              Accueil
            </NavLink>
            {/* Pages visibles uniquement quand l'utilisateur est connecté */}
            {user && (
              <>
                <NavLink to="/favoris" className={navClass}>
                  Favoris
                </NavLink>
                <NavLink to="/profil" className={navClass}>
                  Profil
                </NavLink>
              </>
            )}
            <NavLink to="/a-propos" className={navClass}>
              À propos
            </NavLink>
          </nav>
        </div>

        <div className="flex items-center gap-2">
          {user ? (
            <Button size="sm" onClick={onLogoutClick}>
              Se déconnecter
            </Button>
          ) : (
            <>
              <Button variant="ghost" size="sm" onClick={onLoginClick}>
                Se connecter
              </Button>
              <Button size="sm" onClick={onSignupClick}>
                S'inscrire
              </Button>
            </>
          )}
        </div>
      </div>
    </header>
  )
}
