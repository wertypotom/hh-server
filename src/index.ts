import 'module-alias/register' // Must be first import
import express, { Application } from 'express'
import { envConfig } from '@config/env.config'
import routes from '@modules/index'
import { errorHandler, notFoundHandler } from '@middlewares/error.middleware'
import { Logger } from '@utils/logger'

// Initialize Firebase (imported for side effects)
import '@config/firebase.config'

const app: Application = express()

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
