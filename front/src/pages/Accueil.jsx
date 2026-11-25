import { Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import MovieCard from "@/components/MovieCard"

// Données factices : remplace-les par tes vrais films plus tard.
const movies = Array.from({ length: 6 }, (_, i) => ({ id: i, rating: 4 }))

export default function Accueil() {
  return (
    <div className="flex flex-1">
      {/* Colonne des filtres */}
      <aside className="hidden w-60 shrink-0 border-r p-6 md:block">
        <h2 className="text-xl font-medium underline underline-offset-4">
          Filtres
        </h2>
        {/* Tes filtres viendront ici */}
      </aside>

      {/* Recherche + grille */}
      <section className="flex-1 px-6 py-4 md:px-12">
        <div className="relative max-w-xl">
          <Search className="absolute left-4 top-1/2 size-5 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Rechercher"
            className="h-12 rounded-full border-0 bg-muted pl-12 text-lg md:text-lg"
          />
        </div>

        <div className="mt-8 grid grid-cols-1 gap-8 sm:grid-cols-2 xl:grid-cols-3">
          {movies.map((movie) => (
            <MovieCard
              key={movie.id}
              title="Titre"
              description="Lorem ipsum dolor sit amet, consectetur elit. Proin placerat finibus ultricies. Nulla placerat, odio in ultricies tincidunt, leo velit vehicula massa, in dapibus lacus."
              rating={movie.rating}
            />
          ))}
        </div>
      </section>
    </div>
  )
}
