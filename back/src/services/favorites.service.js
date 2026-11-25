import { prisma } from '../db.js'

export class FavoriteAlreadyExistsError extends Error {}
export class FavoriteRemoveError extends Error {}

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


export async function removeFavorite(userId,tmdbId ,type) {
  try {
    return await prisma.favorite.delete({
      where: { userId_tmdbId_type: { userId, tmdbId, type } },
    })
  } catch (err) {
    console.log(err);
    throw new FavoriteRemoveError('Problème lors de la suppression du favori')
    
  }
}
