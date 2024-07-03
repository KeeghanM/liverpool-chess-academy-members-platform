import 'dotenv/config'
import { drizzle } from 'drizzle-orm/libsql'
import { createClient } from '@libsql/client/web'

if (!process.env.TURSO_CONNECTION_URL || !process.env.TURSO_AUTH_TOKEN)
  throw new Error('Missing TURSO_CONNECTION_URL or TURSO_AUTH_TOKEN')

const client = createClient({
  url: process.env.TURSO_CONNECTION_URL,
  authToken: process.env.TURSO_AUTH_TOKEN,
})
export const db = drizzle(client)
