'use client'
import { EditTeam } from './edit-team'
import { AddPlayer } from './add-player'
import { PlayerRow } from './player-row'
import type { TeamType } from './types'

interface TeamProps {
  team: TeamType
  hasAdmin: boolean
  userId: string
}

export function Team({ team, hasAdmin, userId }: TeamProps): JSX.Element {
  const { name, captain, members } = team

  const actions = hasAdmin || userId === captain?.id
  return (
    <div className='border border-black p-4 flex flex-col gap-4 items-center'>
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
            {actions ? <th>Actions</th> : null}
          </tr>
        </thead>
        <tbody>
          {members.map((member) => (
            <PlayerRow
              key={member.name}
              {...member}
              hasAdmin={actions}
              teamId={team.id}
            />
          ))}
        </tbody>
      </table>
      {actions ? <AddPlayer teamId={team.id} /> : null}
    </div>
  )
}
