import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { useAuth } from "@/context/AuthContext"

const MIN_LENGTH = 8

export default function SignupDialog({
  open,
  onOpenChange,
  onSwitchToLogin,
  onRegistered, // appelé avec l'email quand le compte est bien créé
}) {
  const { register } = useAuth()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirm, setConfirm] = useState("")
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  // Règles de validation du mot de passe (les mêmes que dans le back)
  const rules = [
    { label: `Au moins ${MIN_LENGTH} caractères`, ok: password.length >= MIN_LENGTH },
    { label: "Au moins une majuscule", ok: /[A-Z]/.test(password) },
    { label: "Au moins un chiffre", ok: /\d/.test(password) },
  ]
  const passwordValid = rules.every((r) => r.ok)
  const passwordsMatch = password === confirm
  const showMismatch = confirm.length > 0 && !passwordsMatch

  const reset = () => {
    setEmail("")
    setPassword("")
    setConfirm("")
    setSubmitted(false)
    setError("")
  }

  const handleOpenChange = (value) => {
    if (!value) reset()
    onOpenChange(value)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSubmitted(true)
    setError("")
    if (!passwordValid || !passwordsMatch) return

    setLoading(true)
    try {
      await register(email, password)
      const registeredEmail = email
      reset()
      onRegistered(registeredEmail)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-sm">
        <form onSubmit={handleSubmit} className="space-y-4" noValidate>
          <DialogHeader>
            <DialogTitle>Créer un compte</DialogTitle>
            <DialogDescription>
              Renseignez vos informations pour vous inscrire.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-2">
            <Label htmlFor="signup-email">Email</Label>
            <Input
              id="signup-email"
              type="email"
              placeholder="nom@exemple.fr"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="signup-password">Mot de passe</Label>
            <Input
              id="signup-password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              aria-invalid={submitted && !passwordValid}
              required
            />
            <ul className="space-y-1 text-xs">
              {rules.map((rule) => (
                <li
                  key={rule.label}
                  className={
                    rule.ok
                      ? "text-green-600"
                      : submitted
                        ? "text-destructive"
                        : "text-muted-foreground"
                  }
                >
                  {rule.ok ? "✓" : "•"} {rule.label}
                </li>
              ))}
            </ul>
          </div>

          <div className="space-y-2">
            <Label htmlFor="signup-confirm">Confirmer le mot de passe</Label>
            <Input
              id="signup-confirm"
              type="password"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              aria-invalid={showMismatch || (submitted && !passwordsMatch)}
              required
            />
            {(showMismatch || (submitted && !passwordsMatch)) && (
              <p className="text-xs text-destructive">
                Les mots de passe ne correspondent pas.
              </p>
            )}
          </div>

          {error && <p className="text-sm text-destructive">{error}</p>}

          <DialogFooter className="flex-col sm:flex-col">
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Création…" : "Créer mon compte"}
            </Button>
            <p className="text-center text-sm text-muted-foreground">
              Déjà un compte ?{" "}
              <button
                type="button"
                onClick={onSwitchToLogin}
                className="font-medium text-foreground underline underline-offset-4"
              >
                Se connecter
              </button>
            </p>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
