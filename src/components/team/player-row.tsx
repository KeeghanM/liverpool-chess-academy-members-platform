import type { TeamMember } from './types'

interface PlayerRowProps {
  member: TeamMember
}
export function PlayerRow({ member }: PlayerRowProps): JSX.Element {
  return (
    <tr key={member.name}>
      <td className='flex flex-row gap-1 items-center'>
        <div
          className='tooltip'
          data-tip={
            member.role.charAt(0).toUpperCase() + member.role.substring(1)
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
  )
}
