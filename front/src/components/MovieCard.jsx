import { Star } from "lucide-react"
import { Card } from "@/components/ui/card"

// Tous les props sont optionnels : tu les brancheras sur tes données plus tard.
export default function MovieCard({ poster, title, description, rating = 0 }) {
  return (
    <Card className="overflow-hidden bg-muted p-0 gap-0">
      <div className="aspect-[2/3] w-full bg-muted-foreground/10">
        {poster && (
          <img
            src={poster}
            alt={title ? `Affiche de ${title}` : "Affiche du film"}
            className="h-full w-full object-cover"
          />
        )}
      </div>

      <div className="space-y-2 border-t border-foreground/60 p-3">
        <div className="flex gap-1" aria-label={`Note : ${rating} sur 5`}>
          {Array.from({ length: 5 }).map((_, i) => (
            <Star
              key={i}
              className={`size-4 ${
                i < rating
                  ? "fill-yellow-600/70 text-yellow-600/70"
                  : "fill-muted-foreground/60 text-muted-foreground/60"
              }`}
            />
          ))}
        </div>
        <h3 className="text-sm font-medium">{title}</h3>
        <p className="line-clamp-4 text-xs text-muted-foreground">{description}</p>
      </div>
    </Card>
  )
}
