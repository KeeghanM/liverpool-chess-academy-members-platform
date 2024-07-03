import Stripe from 'stripe'
import { eq } from 'drizzle-orm'
import { NextResponse } from 'next/server'
import { db } from '@/db/db'
import { users, memberData } from '@/db/schema'

export async function GET(): Promise<NextResponse> {
  try {
    if (process.env.STRIPE_SECRET_KEY === undefined)
      throw new Error('Stripe secret key not set')

    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)

    const membersToCheck = await db
      .select({
        id: users.id,
        email: users.email,
        paymentId: memberData.payment_id,
        paymentOverride: memberData.payment_override,
      })
      .from(users)
      .fullJoin(memberData, eq(memberData.userId, users.id))

    await Promise.all(
      membersToCheck.map(async (member) => {
        if (!member.email || !member.id || member.paymentOverride) return

        let stripeCustomerId: string | null | undefined = member.paymentId
        if (!stripeCustomerId) {
          stripeCustomerId = await stripe.customers
            .search({ query: `email:"${member.email}"`, limit: 1 })
            .then((res) => res.data[0]?.id)

          // If we found a stripeCustomerId, update the memberData record with it
          if (stripeCustomerId) {
            await db
              .update(memberData)
              .set({ payment_id: stripeCustomerId })
              .where(eq(memberData.userId, member.id))
          } else {
            // If we didn't find a stripeCustomerId, update the memberData record to indicate that we couldn't find one
            await db
              .update(memberData)
              .set({ active_payment: false })
              .where(eq(memberData.userId, member.id))
            // TODO: Send email to user if not notified already (within the last 30 days)
            return
          }
        }

        // If we're here, we have a stripeCustomerId to work with
        // so now we can check if they have an active subscription or not
        const stripeSubscriptions = await stripe.subscriptions.list({
          customer: stripeCustomerId,
          status: 'active',
        })

        // Update the memberData record with the result of the check
        await db
          .update(memberData)
          .set({ active_payment: stripeSubscriptions.data.length > 0 })
          .where(eq(memberData.userId, member.id))
      }),
    )

    return NextResponse.json('Checks complete')
  } catch (error) {
    const message = error instanceof Error ? error.message : 'An error occurred'
    return NextResponse.json(message, { status: 500 })
  }
}
