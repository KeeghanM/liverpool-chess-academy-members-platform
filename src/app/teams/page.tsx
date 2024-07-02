import { auth } from '@/auth'
import { Team } from '@/components/team/team'
import { db } from '@/db/db'
import { teams, users } from '@/db/schema'
import { eq } from 'drizzle-orm'

export default async function Teams(): Promise<JSX.Element> {
  const session = await auth()
  if (!session?.user?.id) return <h1>Log in to access this page.</h1>

  const teamList = await db
    .select({
      id: teams.id,
      name: teams.name,
      captain: users.name,
    })
    .from(teams)
    .leftJoin(users, eq(teams.captainId, users.id))

  return (
    <>
      <h1 className='text-2xl md:text-4xl lg:text-6xl font-bold text-center flex items-center gap-4'>
        Teams
      </h1>
      <div className='grid grid-cols-1 md:grid-cols-2'>
        {teamList.map((team) => (
          <Team key={team.id} {...team} />
        ))}
      </div>
    </>
  )
}
