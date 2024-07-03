import { eq } from 'drizzle-orm'
import { auth } from '@/auth'
import { db } from '@/db/db'
import { memberData, users } from '@/db/schema'
import { EditForm } from '@/components/membership/edit-form'

export default async function Membership(): Promise<JSX.Element> {
  const session = await auth()
  if (!session?.user?.id) return <h1>Log in to access this page.</h1>

  const user = await db
    .select({
      memberNumber: memberData.memberNumber,
      active: memberData.active_payment,
      override: memberData.payment_override,
    })
    .from(users)
    .leftJoin(memberData, eq(users.id, memberData.userId))
    .where(eq(users.id, session.user.id))
    .then((result) => result[0])

  if (!user?.memberNumber) throw new Error('User not found')

  const memberNumber = `LCA${`000${user.memberNumber.toString()}`.slice(-3)}`

  return (
    <div>
      <h1 className='text-2xl md:text-4xl lg:text-6xl font-bold text-center flex gap-4 items-center'>
        My Membership
        {user.active === true || user.override === true ? (
          <span className='badge badge-success'>Paid Up</span>
        ) : (
          <span className='badge badge-error'>Unpaid</span>
        )}
      </h1>
      <h2 className='text-lg md:text-2xl mt-2'>
        Member Number:{' '}
        <span className='badge badge-primary text-white'>{memberNumber}</span>
      </h2>
      <h3 className='text-lg md:text-2xl mt-6'>Edit your details</h3>
      <EditForm />
    </div>
  )
}
