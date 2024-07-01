'use server'

import { signIn } from '@/auth'
import { db } from '@/db/db'
import { users, memberData } from '@/db/schema'
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
    const memberCode = formData.get('code') as string | undefined
    if (!memberCode) throw new Error('Invalid form data')

    // Code comes in as LCA000 - which is just a zero padded version of the DB ID
    // So we need to parse that into the id and then look up the email
    if (!memberCode.startsWith('LCA')) throw new Error('Invalid code')
    const memberNumber = parseInt(memberCode.replace('LCA', ''))

    if (isNaN(memberNumber)) throw new Error('Invalid code')

    // Code is at least formatted correct, now check if it's a valid ID
    const emailAddress = await db
      .select({ email: users.email })
      .from(users)
      .fullJoin(memberData, eq(users.id, memberData.userId))
      .where(eq(memberData.memberNumber, memberNumber))
      .then((result) => {
        return result[0]?.email
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
