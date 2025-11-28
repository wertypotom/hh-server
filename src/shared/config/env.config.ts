import dotenv from 'dotenv'

dotenv.config()

interface EnvConfig {
  port: number
  nodeEnv: string
  hhClientId: string
  hhClientSecret: string
  hhRedirectUri: string
  firebaseServiceAccountPath: string
}

const getEnvVariable = (key: string, defaultValue?: string): string => {
  const value = process.env[key] || defaultValue
  if (!value) {
    throw new Error(`Missing environment variable: ${key}`)
  }
  return value
}

export const envConfig: EnvConfig = {
  port: parseInt(getEnvVariable('PORT', '3000'), 10),
  nodeEnv: getEnvVariable('NODE_ENV', 'development'),
  hhClientId: getEnvVariable('HH_CLIENT_ID'),
  hhClientSecret: getEnvVariable('HH_CLIENT_SECRET'),
  hhRedirectUri: getEnvVariable('HH_REDIRECT_URI'),
  firebaseServiceAccountPath: getEnvVariable(
    'FIREBASE_SERVICE_ACCOUNT_PATH',
    './serviceAccountKey.json'
  ),
}
