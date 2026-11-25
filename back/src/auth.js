import { Router } from 'express'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { prisma } from './db.js'

const ACCESS_TTL = '15m'
const REFRESH_TTL = '7d'
const MIN_PASSWORD_LENGTH = 8

// "sub" doit être une chaîne dans un JWT, alors que l'id Prisma est un Int
const signAccess = (user) =>
    jwt.sign({ sub: String(user.id) }, process.env.JWT_SECRET, { expiresIn: ACCESS_TTL })

const signRefresh = (user) =>
    jwt.sign({ sub: String(user.id) }, process.env.JWT_REFRESH_SECRET, { expiresIn: REFRESH_TTL })

// Mêmes règles que le formulaire d'inscription du front.
// Renvoie un message d'erreur, ou null si le mot de passe est valide.
function validatePassword(password) {
    if (password.length < MIN_PASSWORD_LENGTH) {
        return `Mot de passe trop court (${MIN_PASSWORD_LENGTH} caractères min.)`
    }
    if (!/[A-Z]/.test(password)) {
        return 'Le mot de passe doit contenir au moins une majuscule'
    }
    if (!/\d/.test(password)) {
        return 'Le mot de passe doit contenir au moins un chiffre'
    }
    return null
}

const router = Router()

// Middleware : lit "Authorization: Bearer <token>", vérifie l'access token
// et met l'id de l'utilisateur dans req.userId
export function requireAuth(req, res, next) {
    const header = req.headers.authorization ?? ''
    const token = header.startsWith('Bearer ') ? header.slice(7) : null
    if (!token) {
        return res.status(401).json({ error: 'Token manquant' })
    }

    try {
        const payload = jwt.verify(token, process.env.JWT_SECRET)
        req.userId = Number(payload.sub)
        next()
    } catch {
        return res.status(401).json({ error: 'Token invalide ou expiré' })
    }
}

// POST /api/auth/register
router.post('/register', async (req, res) => {
    try {
        const { email, password } = req.body ?? {}
        if (typeof email !== 'string' || typeof password !== 'string' || !email || !password) {
            return res.status(400).json({ error: 'Email et mot de passe requis' })
        }

        const passwordError = validatePassword(password)
        if (passwordError) {
            return res.status(400).json({ error: passwordError })
        }

        const passwordHash = await bcrypt.hash(password, 10)
        const user = await prisma.user.create({
            data: { email: email.trim().toLowerCase(), passwordHash },
            select: { id: true, email: true, createdAt: true },
        })
        return res.status(201).json(user)
    } catch (err) {
        if (err.code === 'P2002') {
            return res.status(409).json({ error: 'Cet email est déjà utilisé' })
        }
        console.error(err)
        return res.status(500).json({ error: 'Erreur serveur' })
    }
})

// POST /api/auth/login
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body ?? {}
        if (typeof email !== 'string' || typeof password !== 'string' || !email || !password) {
            return res.status(400).json({ error: 'Email et mot de passe requis' })
        }

        const user = await prisma.user.findUnique({
            where: { email: email.trim().toLowerCase() },
        })

        // Même message si l'email est inconnu ou si le mot de passe est faux
        const ok = user && (await bcrypt.compare(password, user.passwordHash))
        if (!ok) {
            return res.status(401).json({ error: 'Identifiants incorrects' })
        }

        return res.json({
            accessToken: signAccess(user),
            refreshToken: signRefresh(user),
            user: { id: user.id, email: user.email },
        })
    } catch (err) {
        console.error(err)
        return res.status(500).json({ error: 'Erreur serveur' })
    }
})

// POST /api/auth/refresh
// Body : { refreshToken }. Renvoie une nouvelle paire de tokens (rotation). ATTENTION L'ANCIENNE PAIR EST TOUJOURS VALIDE
router.post('/refresh', async (req, res) => {
    const { refreshToken } = req.body ?? {}
    if (!refreshToken) {
        return res.status(400).json({ error: 'refreshToken requis' })
    }

    try {
        const payload = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET)
        const user = await prisma.user.findUnique({
            where: { id: Number(payload.sub) },
        })
        if (!user) {
            return res.status(401).json({ error: 'Utilisateur introuvable' })
        }

        return res.json({
            accessToken: signAccess(user),
            refreshToken: signRefresh(user),
        })
    } catch {
        return res.status(401).json({ error: 'Refresh token invalide ou expiré' })
    }
})

// GET /api/auth/me (protégée)
router.get('/me', requireAuth, async (req, res) => {
    try {
        const user = await prisma.user.findUnique({
            where: { id: req.userId },
            select: { id: true, email: true, createdAt: true },
        })
        if (!user) {
            return res.status(404).json({ error: 'Utilisateur introuvable' })
        }
        return res.json(user)
    } catch (err) {
        console.error(err)
        return res.status(500).json({ error: 'Erreur serveur' })
    }
})

// POST /api/auth/logout
// Minimal : c'est le front qui supprime ses tokens.
router.post('/logout', (req, res) => {
    return res.status(204).end()
})

export default router