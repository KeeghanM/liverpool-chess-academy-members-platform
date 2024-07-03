import 'dotenv/config'
import { defineConfig } from 'drizzle-kit'

if (!process.env.TURSO_CONNECTION_URL || !process.env.TURSO_AUTH_TOKEN)
  throw new Error('Missing TURSO_CONNECTION_URL or TURSO_AUTH_TOKEN')

export default defineConfig({
  schema: './src/db/schema.ts',
  out: './drizzle',
  dialect: 'sqlite',
  driver: 'turso',
  dbCredentials: {
    url: process.env.TURSO_CONNECTION_URL,
    authToken: process.env.TURSO_AUTH_TOKEN,
  },
})
