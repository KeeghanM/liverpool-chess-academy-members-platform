'use client'
import { EditPlayer } from './edit-player'

interface PlayerRowProps {
  id: string
  name: string | null
  role: 'player' | 'substitute'
  rating: number | null
  hasAdmin: boolean
  teamId: number
}
export function PlayerRow({
  id,
  name,
  role,
  rating,
  hasAdmin,
  teamId,
}: PlayerRowProps): JSX.Element {
  return (
    <tr key={name}>
      <td>
        <div
          className='tooltip'
          data-tip={role.charAt(0).toUpperCase() + role.substring(1)}
        >
          <span
            className={`badge badge-${
              role === 'player' ? 'success' : 'warning'
            } mr-2`}
          >
            {role.charAt(0).toUpperCase()}
          </span>
        </div>
        {name}
      </td>
      <td>{rating}</td>
      {hasAdmin ? (
        <td>
          <EditPlayer
            teamId={teamId}
            playerId={id}
            name={name ?? ''}
            role={role}
          />
        </td>
      ) : null}
    </tr>
  )
}
