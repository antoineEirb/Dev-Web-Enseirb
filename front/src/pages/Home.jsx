import { useState } from "react"
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom"
import Header from "@/components/Header"
import LoginDialog from "@/components/LoginDialog"
import SignupDialog from "@/components/SignupDialog"
import RequireAuth from "@/components/RequireAuth"
import { AuthProvider, useAuth } from "@/context/AuthContext"
import Accueil from "@/pages/Accueil"
import APropos from "@/pages/APropos"
import Favoris from "@/pages/Favoris"
import Profil from "@/pages/Profil"

function HomeContent() {
  const { user, logout } = useAuth()
  const [loginOpen, setLoginOpen] = useState(false)
  const [signupOpen, setSignupOpen] = useState(false)
  const [registeredEmail, setRegisteredEmail] = useState("")

  const openLogin = () => {
    setSignupOpen(false)
    setLoginOpen(true)
  }
  const openSignup = () => {
    setRegisteredEmail("")
    setLoginOpen(false)
    setSignupOpen(true)
  }

  // Compte créé : on ouvre directement la connexion, email pré-rempli
  const handleRegistered = (email) => {
    setRegisteredEmail(email)
    openLogin()
  }

  // Ouverture manuelle de la connexion : on enlève le message "compte créé"
  const handleLoginClick = () => {
    setRegisteredEmail("")
    openLogin()
  }

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header
        user={user}
        onLoginClick={handleLoginClick}
        onSignupClick={openSignup}
        onLogoutClick={logout}
      />

      {/* Section principale : la page affichée change, le reste ne bouge pas */}
      <div className="flex flex-1 flex-col">
        <Routes>
          <Route path="/" element={<Accueil />} />
          <Route path="/a-propos" element={<APropos />} />
          <Route
            path="/favoris"
            element={
              <RequireAuth>
                <Favoris />
              </RequireAuth>
            }
          />
          <Route
            path="/profil"
            element={
              <RequireAuth>
                <Profil />
              </RequireAuth>
            }
          />
          {/* Toute autre URL ramène à l'accueil */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>

      <LoginDialog
        open={loginOpen}
        onOpenChange={setLoginOpen}
        onSwitchToSignup={openSignup}
        initialEmail={registeredEmail}
        notice={registeredEmail ? "Compte créé ! Connectez-vous pour continuer." : ""}
      />
      <SignupDialog
        open={signupOpen}
        onOpenChange={setSignupOpen}
        onSwitchToLogin={handleLoginClick}
        onRegistered={handleRegistered}
      />
    </div>
  )
}

export default function Home() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <HomeContent />
      </AuthProvider>
    </BrowserRouter>
  )
}
