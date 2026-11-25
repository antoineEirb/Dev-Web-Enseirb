export default function APropos() {
  return (
    <section className="flex-1 px-6 py-10 md:px-16">
      <div className="mx-auto max-w-2xl space-y-10">
        <header className="space-y-4">
          <h1 className="text-3xl font-semibold">À propos de Seen-flix</h1>
          <p className="text-lg text-muted-foreground">
            Seen-flix est une application web pour trouver des films et des
            séries, consulter leur fiche et garder une liste de ceux que l’on
            veut voir ou revoir.
          </p>
        </header>

        <div className="space-y-3">
          <h2 className="text-xl font-semibold">À quoi sert l’application</h2>
          <p>
            Sans compte, vous pouvez rechercher une œuvre par mot-clé et
            consulter sa fiche détaillée. En créant un compte et en vous
            connectant, vous pouvez en plus ajouter des films et des séries à
            vos favoris, les retrouver dans la page Favoris et les retirer
            quand vous voulez.
          </p>
        </div>

        <div className="space-y-3">
          <h2 className="text-xl font-semibold">Le projet</h2>
          <p>
            Seen-flix est le projet du module « Projet web » du semestre 7 de
            la formation Réseaux et Informatique (R&amp;I) de l’ENSEIRB-MATMECA.
            Il a été réalisé en trinôme par Rodolphe Schneider, Antoine Vaurin
            et Pierre Frostin.
          </p>
        </div>

        <div className="space-y-3">
          <h2 className="text-xl font-semibold">Ce qu’il y a derrière</h2>
          <p>
            L’interface est développée avec React, shadcn/ui et Tailwind CSS.
            L’application tient sur une seule page : on navigue entre
            l’accueil, les favoris et le profil sans rechargement.
          </p>
          <p>
            Le serveur est une API REST développée avec Node.js et Express. Les
            comptes et les favoris sont enregistrés dans une base de données,
            accessible via Prisma.
          </p>
          <p>
            Les mots de passe sont chiffrés avec bcrypt. La session repose sur
            des jetons JWT : un jeton d’accès de courte durée, renouvelé
            automatiquement grâce à un jeton de rafraîchissement.
          </p>
          <p>
            Les films et séries viennent de l’API de The Movie Database
            (TMDB), interrogée par notre serveur.
          </p>
        </div>

      </div>
    </section>
  )
}
