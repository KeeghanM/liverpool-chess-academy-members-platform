import { eq } from 'drizzle-orm'
import { auth } from '@/auth'
import { db } from '@/db/db'
import { memberData, users } from '@/db/schema'

export default async function Membership(): Promise<JSX.Element> {
  const session = await auth()
  if (!session?.user?.id) return <h1>Log in to access this page.</h1>

  const user = await db
    .select({
      memberNumber: memberData.memberNumber,
      active: memberData.active_payment,
      override: memberData.payment_override,
      ecfRating: memberData.ecf_rating,
      onlineRating: memberData.online_rating,
      fideId: memberData.fide_id,
      ecfNumber: memberData.ecf_number,
      lichess: memberData.lichess_username,
      chesscom: memberData.chesscom_username,
      email: users.email,
    })
    .from(users)
    .leftJoin(memberData, eq(users.id, memberData.userId))
    .where(eq(users.id, session.user.id))
    .then((result) => result[0])

  if (!user) throw new Error('User not found')

  return (
    <div>
      <h1 className="text-2xl md:text-4xl lg:text-6xl font-bold text-center flex items-center gap-4">
        My Membership
        {user.active ?? user.override ? (
          <div className="badge badge-success">Paid Up</div>
        ) : (
          <div className="badge badge-error">Unpaid</div>
        )}
      </h1>
    </div>
  )
}
