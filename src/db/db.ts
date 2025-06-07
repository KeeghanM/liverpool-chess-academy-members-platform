import 'dotenv/config'
import { drizzle } from 'drizzle-orm/libsql'
import { createClient } from '@libsql/client/web'

// fix UNABLE TO GET ISSUER CERT LOCALLY
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0'

if (!process.env.TURSO_CONNECTION_URL || !process.env.TURSO_AUTH_TOKEN)
  throw new Error('Missing TURSO_CONNECTION_URL or TURSO_AUTH_TOKEN')

console.log({
  TURSO_CONNECTION_URL: process.env.TURSO_CONNECTION_URL,
  TURSO_AUTH_TOKEN: process.env.TURSO_AUTH_TOKEN,
})

const client = createClient({
  url: process.env.TURSO_CONNECTION_URL,
  authToken: process.env.TURSO_AUTH_TOKEN,
  syncUrl: undefined,
  syncInterval: undefined,
})
export const db = drizzle(client)
