import { Router } from 'express'
import authRoutes from './auth/auth.routes'
import userRoutes from './user/user.routes'

const router = Router()

router.use('/auth', authRoutes)
router.use('/users', userRoutes)

// Health check
router.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() })
})

export default router
