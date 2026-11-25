import { useAuth } from "@/context/AuthContext"

export default function Profil() {
  const { user } = useAuth()

  return (
    <section className="flex-1 px-6 py-8 md:px-16">
      <h1 className="text-2xl font-semibold">Profil</h1>
      <p className="mt-4 text-muted-foreground">{user?.email}</p>
      {/* Autres infos du profil à venir */}
    </section>
  )
}
