'use server'

import { signIn } from '@/auth'
import { db } from '@/db/db'
import { users } from '@/db/schema'
import { eq } from 'drizzle-orm'

export async function signInAction(
  previousState: { success: boolean },
  formData: FormData,
) {
  try {
    const email = formData.get('email') as string | undefined
    const code = formData.get('code') as string | undefined

    console.log('email', email)
    console.log('code', code)

    if (!email && !code) throw new Error('Invalid form data')

    const signInData = {
      email: email ?? undefined,
    }

    if (code && !email) {
      // Code comes in as LCA000 - which is just a zero padded version of the DB ID
      // So we need to parse that into the id and then look up the email
      const id = parseInt(code.replace('LCA', ''))
      const emailAddress = await db
        .select({ email: users.email })
        .from(users)
        .where(eq(users.id, id))
        .then((result) => {
          return result[0].email
        })
      if (!emailAddress) throw new Error('Invalid code')

      signInData.email = emailAddress
    }

    await signIn('resend', signInData)
    return { success: true }
  } catch (e) {
    console.error(e)
    return { success: false }
  }
}
