'use server'

import { signIn } from '@/auth'
import { db } from '@/db/db'
import { users } from '@/db/schema'
import { eq } from 'drizzle-orm'

export type RegisterState = {
  success: boolean | undefined
  message: string
}

export async function registerAction(
  previousState: RegisterState,
  formData: FormData,
) {
  try {
    const email = formData.get('email') as string | undefined
    if (!email) throw new Error('Invalid form data')

    // Check if the email address already exists, and error if it does
    const userId = await db
      .select({ id: users.id })
      .from(users)
      .where(eq(users.email, email))
      .then((result) => {
        return result[0]?.id
      })
    if (userId)
      throw new Error('A member with that email address already exists')

    // Send the sign in link to the email address
    await signIn('resend', { email })
    return {
      success: true,
      message: 'Check your email to complete registration',
    }
  } catch (e) {
    console.error(e)
    return {
      success: false,
      message: e instanceof Error ? e.message : 'An error occurred',
    }
  }
}
