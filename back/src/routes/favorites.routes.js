import { Router } from 'express'
import { z } from 'zod'
import { addFavorite, FavoriteAlreadyExistsError, removeFavorite } from '../services/favorites.service.js'

const router = Router()

const addFavoriteSchema = z.object({
  tmdbId: z.number().int().positive(),
  type: z.enum(['movie', 'tv']),
  rating: z.number().int().min(1).max(5).optional(),
  comment: z.string().max(1000).optional(),
})

router.post('/', async (req, res) => {
  const parsed = addFavoriteSchema.safeParse(req.body)
  if (!parsed.success) {
    return res.status(400).json({ error: { message: z.prettifyError(parsed.error), code: 'BAD_REQUEST' } })
  }

  try {
    const favorite = await addFavorite(req.userId, parsed.data)
    return res.status(201).json(favorite)
  } catch (err) {
    if (err instanceof FavoriteAlreadyExistsError) {
      const favoriteRemoved = await removeFavorite(req.userId,parsed.data.tmdbId,parsed.data.type);
      return res.status(202).json(favoriteRemoved.tmdbId);
    }
    console.error(err)
    return res.status(500).json({ error: { message: 'Erreur serveur', code: 'INTERNAL_ERROR' } })
  }
})

export default router
