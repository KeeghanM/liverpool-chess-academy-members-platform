import { db } from '@/db/db'
import { memberData, teamMembers, users } from '@/db/schema'
import { eq } from 'drizzle-orm'

export interface TeamMember {
  name: string | null
  role: 'player' | 'substitute'
  rating: number | null
}

export interface TeamProps {
  id: number
  name: string
  captain: string | null
}
export async function Team({
  id,
  name,
  captain,
}: TeamProps): Promise<JSX.Element> {
  const members: TeamMember[] = await db
    .select({
      name: users.name,
      role: teamMembers.role,
      rating: memberData.ecf_rating,
    })
    .from(teamMembers)
    .leftJoin(users, eq(teamMembers.userId, users.id))
    .leftJoin(memberData, eq(users.id, memberData.userId))
    .where(eq(teamMembers.teamId, id))

  return (
    <div className='border border-black p-4 flex flex-col gap-4 items-center justify-center'>
      <h3 className='text-lg font-bold'>{name}</h3>
      <p className='text-gray-500 italic'>
        Captain: {captain ? captain : 'No Captain'}
      </p>
      <table className='table table-sm table-zebra'>
        <thead className='text-black'>
          <tr>
            <th>Name</th>
            <th>Rating</th>
          </tr>
        </thead>
        <tbody>
          {members
            .sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0))
            .map((member) => (
              <tr key={member.name}>
                <td className='flex flex-row gap-1 items-center'>
                  <div
                    className='tooltip'
                    data-tip={
                      member.role.charAt(0).toUpperCase() +
                      member.role.substring(1)
                    }
                  >
                    <span
                      className={`badge badge-${
                        member.role === 'player' ? 'success' : 'warning'
                      }`}
                    >
                      {member.role.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  {member.name}
                </td>
                <td>{member.rating}</td>
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  )
}
