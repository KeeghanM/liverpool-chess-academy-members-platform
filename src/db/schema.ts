process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0'

import { integer, sqliteTable, text, primaryKey } from 'drizzle-orm/sqlite-core'
import type { AdapterAccountType } from 'next-auth/adapters'

/* MAIN SCHEMA */
export const roles = sqliteTable('role', {
  id: integer('id').primaryKey(),
  name: text('name').notNull(),
  description: text('description'),
})

export const roleMappings = sqliteTable('roleMapping', {
  userId: text('userId')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  roleId: integer('roleId').notNull(),
})

export const teams = sqliteTable('team', {
  id: integer('id').primaryKey(),
  name: text('name').notNull(),
  description: text('description'),
  captainId: text('captainId').references(() => users.id, {
    onDelete: 'set null',
  }),
})

export const teamMembers = sqliteTable('teamMember', {
  userId: text('userId')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  teamId: integer('teamId').notNull(),
  role: text('role', { enum: ['player', 'substitute'] })
    .$default(() => 'player')
    .notNull(),
})

export const memberData = sqliteTable('memberData', {
  memberNumber: integer('memberNumber').primaryKey({ autoIncrement: true }),
  userId: text('userId')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  payment_id: text('payment_id'),
  active_payment: integer('active_payment', { mode: 'boolean' }).$defaultFn(
    () => false,
  ),
  payment_override: integer('payment_override', { mode: 'boolean' }).$defaultFn(
    () => false,
  ),
  ecf_rating: integer('ecf_rating'),
  online_rating: integer('online_rating'),
  ecf_number: text('ecf_number'),
  lichess_username: text('lichess_username'),
  chesscom_username: text('chesscom_username'),
  fide_id: text('fide_id'),
})

/* AUTHENTICATION SCHEMA */
export const users = sqliteTable('user', {
  id: text('id')
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  name: text('name'),
  email: text('email').notNull(),
  emailVerified: integer('emailVerified', { mode: 'timestamp_ms' }),
  image: text('image'),
})

export const accounts = sqliteTable(
  'account',
  {
    userId: text('userId')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    type: text('type').$type<AdapterAccountType>().notNull(),
    provider: text('provider').notNull(),
    providerAccountId: text('providerAccountId').notNull(),
    refresh_token: text('refresh_token'),
    access_token: text('access_token'),
    expires_at: integer('expires_at'),
    token_type: text('token_type'),
    scope: text('scope'),
    id_token: text('id_token'),
    session_state: text('session_state'),
  },
  (account) => ({
    compoundKey: primaryKey({
      columns: [account.provider, account.providerAccountId],
    }),
  }),
)

export const sessions = sqliteTable('session', {
  sessionToken: text('sessionToken').primaryKey(),
  userId: text('userId')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  expires: integer('expires', { mode: 'timestamp_ms' }).notNull(),
})

export const verificationTokens = sqliteTable(
  'verificationToken',
  {
    identifier: text('identifier').notNull(),
    token: text('token').notNull(),
    expires: integer('expires', { mode: 'timestamp_ms' }).notNull(),
  },
  (verificationToken) => ({
    compositePk: primaryKey({
      columns: [verificationToken.identifier, verificationToken.token],
    }),
  }),
)

export const authenticators = sqliteTable(
  'authenticator',
  {
    credentialID: text('credentialID').notNull().unique(),
    userId: text('userId')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    providerAccountId: text('providerAccountId').notNull(),
    credentialPublicKey: text('credentialPublicKey').notNull(),
    counter: integer('counter').notNull(),
    credentialDeviceType: text('credentialDeviceType').notNull(),
    credentialBackedUp: integer('credentialBackedUp', {
      mode: 'boolean',
    }).notNull(),
    transports: text('transports'),
  },
  (authenticator) => ({
    compositePK: primaryKey({
      columns: [authenticator.userId, authenticator.credentialID],
    }),
  }),
)
