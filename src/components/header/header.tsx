import Link from 'next/link'
import { eq } from 'drizzle-orm'
import { auth } from '@/auth'
import { SignOut } from '../signOut/sign-out'
import { db } from '@/db/db'
import { memberData } from '@/db/schema'

export async function Header(): Promise<JSX.Element> {
  const session = await auth()

  const memberNumber = session?.user?.id
    ? await db
        .select({
          memberNumber: memberData.memberNumber,
        })
        .from(memberData)
        .where(eq(memberData.userId, session.user.id))
        .then((result) => result[0]?.memberNumber)
    : null

  return (
    <header className='navbar bg-base-100 shadow sticky top-0'>
      <div className='flex-1'>
        <Link className='btn btn-ghost' href='/'>
          LCA: Members
        </Link>
      </div>
      {memberNumber ? (
        <div className='flex-1'>
          <span className='badge badge-primary text-white text-lg p-4'>
            LCA{`000${memberNumber.toString()}`.slice(-3)}
          </span>
        </div>
      ) : null}
      {session?.user ? (
        <div className='flex-none'>
          <SignOut />
        </div>
      ) : null}
    </header>
  )
}
