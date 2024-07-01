'use server'

import { signIn } from '@/auth'
import { db } from '@/db/db'
import { users } from '@/db/schema'
import { eq } from 'drizzle-orm'

export type SignInState = {
  success: boolean | undefined
  message: string
}

export async function signInAction(
  previousState: SignInState,
  formData: FormData,
) {
  try {
    const code = formData.get('code') as string | undefined
    if (!code) throw new Error('Invalid form data')

    // Code comes in as LCA000 - which is just a zero padded version of the DB ID
    // So we need to parse that into the id and then look up the email
    if (!code.startsWith('LCA')) throw new Error('Invalid code')
    const id = parseInt(code.replace('LCA', ''))

    if (isNaN(id)) throw new Error('Invalid code')

    // Code is at least formatted correct, now check if it's a valid ID
    const emailAddress = await db
      .select({ email: users.email })
      .from(users)
      .where(eq(users.id, id))
      .then((result) => {
        return result[0].email
      })
    if (!emailAddress) throw new Error('No member found')

    // Send the sign in link to the email address
    await signIn('resend', { email: emailAddress })
    return { success: true, message: 'Check your email for a sign in link' }
  } catch (e) {
    console.error(e)
    return {
      success: false,
      message: e instanceof Error ? e.message : 'An error occurred',
    }
  }
}
