import { prisma } from '../db.js'

export class FavoriteAlreadyExistsError extends Error {}

export async function addFavorite(userId, { tmdbId, type, rating, comment }) {
  try {
    return await prisma.favorite.create({
      data: { userId, tmdbId, type, rating, comment },
    })
  } catch (err) {
    if (err.code === 'P2002') {
      throw new FavoriteAlreadyExistsError('Favori déjà existant')
    }
    throw err
  }
}
