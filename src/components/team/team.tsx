'use client'
import { EditTeam } from './edit-team'
import { AddPlayer } from './add-player'

export interface TeamMember {
  name: string | null
  role: 'player' | 'substitute'
  rating: number | null
}

export interface TeamType {
  id: number
  name: string
  captain: {
    id: string
    name: string | null
  } | null
  members: TeamMember[]
}

interface TeamProps {
  team: TeamType
  hasAdmin: boolean
  userId: string
}

export function Team({ team, hasAdmin, userId }: TeamProps): JSX.Element {
  const { name, captain, members } = team

  return (
    <div className='border border-black p-4 flex flex-col gap-4 items-center justify-center'>
      <h3 className='text-lg font-bold'>
        {name}
        {hasAdmin ? (
          <EditTeam key={team.id} id={team.id} name={team.name} />
        ) : null}
      </h3>
      <p className='text-gray-500 italic'>
        Captain: {captain ? captain.name : 'No Captain'}
      </p>
      <table className='table table-sm table-zebra'>
        <thead className='text-black'>
          <tr>
            <th>Name</th>
            <th>Rating</th>
          </tr>
        </thead>
        <tbody>
          {members.map((member) => (
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
      {hasAdmin || userId === captain?.id ? (
        <AddPlayer teamId={team.id} />
      ) : null}
    </div>
  )
}
