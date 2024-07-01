import NextAuth from 'next-auth'
import Resend from 'next-auth/providers/resend'
import { DrizzleAdapter } from '@auth/drizzle-adapter'
import { db } from '@/db/db'
import { memberData } from './db/schema'

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: DrizzleAdapter(db),
  providers: [
    Resend({
      apiKey: process.env.RESEND_API_KEY,
      from: 'auth@liverpoolchessacademy.co.uk',
    }),
  ],
  callbacks: {
    async signIn({ user }) {
      if (!user.id) return false

      // @ts-expect-error - emailVerified is not in the type definition for some reason
      if (user.emailVerified === null) {
        // This is the first time the user has signed in with this account
        // So we need to generate their member number
        await db.insert(memberData).values({
          userId: user.id,
        })
      }
      return true
    },
  },
})
