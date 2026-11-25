import 'dotenv/config'
import express from 'express'
import authRouter, { requireAuth } from './auth.js'
import searchContent from './tmdb.js'
import favoritesRouter from './routes/favorites.routes.js'

const app = express()
app.use(express.json())


app.get('/api/health', (req, res) => res.json({ ok: true }))
app.use('/api/auth', authRouter)
app.use('/me/favorites', requireAuth, favoritesRouter)


app.get('/movies/search', async (req, res) => {
    let reqRes = await searchContent(req.query.q);
    res.status(200);
    res.send(reqRes);
})


const port = process.env.PORT || 3000
app.listen(port, () => console.log(`API sur http://localhost:${port}`))