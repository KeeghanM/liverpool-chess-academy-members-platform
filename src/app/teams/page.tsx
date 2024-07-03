import { and, eq } from 'drizzle-orm'
import { auth } from '@/auth'
import { CreateTeam } from '@/components/team/create-team'
import { TeamList } from '@/components/team/team-list'
import { db } from '@/db/db'
import { roleMappings, roles } from '@/db/schema'

export default async function Teams(): Promise<JSX.Element> {
  const session = await auth()
  if (!session?.user?.id) return <h1>Log in to access this page.</h1>

  const hasAdmin = await db
    .select()
    .from(roleMappings)
    .leftJoin(roles, eq(roleMappings.roleId, roles.id))
    .where(
      and(eq(roleMappings.userId, session.user.id), eq(roles.name, 'Admin')),
    )
    .then((res) => res.length > 0)

  return (
    <>
      <h1 className='text-2xl md:text-4xl lg:text-6xl font-bold text-center flex items-center gap-4'>
        Teams
      </h1>
      <TeamList hasAdmin={hasAdmin} userId={session.user.id} />
      {hasAdmin ? <CreateTeam /> : null}
    </>
  )
}
