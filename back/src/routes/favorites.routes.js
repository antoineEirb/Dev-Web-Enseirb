import { Router } from 'express'
import { z } from 'zod'
import { addFavorite, listFavorites, FavoriteAlreadyExistsError } from '../services/favorites.service.js'

const router = Router()

const addFavoriteSchema = z.object({
  tmdbId: z.number().int().positive(),
  type: z.enum(['movie', 'tv']),
  rating: z.number().int().min(1).max(5).optional(),
  comment: z.string().max(1000).optional(),
})

router.get('/', async (req, res) => {
  try {
    const favorites = await listFavorites(req.userId)
    return res.status(200).json(favorites)
  } catch (err) {
    console.error(err)
    return res.status(500).json({ error: { message: 'Erreur serveur', code: 'INTERNAL_ERROR' } })
  }
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
      return res.status(409).json({ error: { message: err.message, code: 'CONFLICT' } })
    }
    console.error(err)
    return res.status(500).json({ error: { message: 'Erreur serveur', code: 'INTERNAL_ERROR' } })
  }
})

export default router
