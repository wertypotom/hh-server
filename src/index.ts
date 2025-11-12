import 'tsconfig-paths/register'

import express, { Application } from 'express'
import { envConfig } from '@config/env.config'
import routes from '@modules/index'
import { errorHandler, notFoundHandler } from '@middlewares/error.middleware'
import { Logger } from '@utils/logger'
import cors from 'cors'

// Initialize Firebase (imported for side effects)
import '@config/firebase.config'

const app: Application = express()

app.use(
  cors({
    origin: 'http://localhost:5173',
    credentials: true,
  })
)

// Middlewares
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// Routes
app.use('/api', routes)

// Error handling
app.use(notFoundHandler)
app.use(errorHandler)

// Start server
app.listen(envConfig.port, () => {
  Logger.info(
    `Server running on port ${envConfig.port} in ${envConfig.nodeEnv} mode`
  )
})

export default app
