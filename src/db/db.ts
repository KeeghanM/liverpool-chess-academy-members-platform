import 'dotenv/config'
import { drizzle } from 'drizzle-orm/libsql'
import { createClient } from '@libsql/client/web'

const client = createClient({
  // eslint-disable-next-line -- @typescript-eslint/no-non-null-assertion
  url: process.env.TURSO_CONNECTION_URL!,
  // eslint-disable-next-line -- @typescript-eslint/no-non-null-assertion
  authToken: process.env.TURSO_AUTH_TOKEN!,
})
export const db = drizzle(client)
