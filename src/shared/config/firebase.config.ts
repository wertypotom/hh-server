import admin from 'firebase-admin'
import path from 'path'
import { envConfig } from './env.config'

const serviceAccount = require(path.resolve(
  envConfig.firebaseServiceAccountPath
))

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
})

export const db = admin.firestore()
export const auth = admin.auth()

export default admin
