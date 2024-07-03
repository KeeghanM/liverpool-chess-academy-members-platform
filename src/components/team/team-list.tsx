'use client'

import { useQuery } from '@tanstack/react-query'
import { Spinner } from '../spinner'
import { Team, TeamType } from './team'

export function TeamList({
  hasAdmin,
  userId,
}: {
  hasAdmin: boolean
  userId: string
}): JSX.Element {
  const { isPending, error, data } = useQuery({
    queryKey: ['teams'],
    queryFn: async () => {
      const response = await fetch('/api/teams')
      if (!response.ok) throw new Error(response.statusText)
      return (await response.json()) as TeamType[]
    },
  })

  if (error)
    return (
      <p className='text-red-500 italic'>
        Error: {error.message} - Please contact admin
      </p>
    )
  if (isPending) return <Spinner />

  return (
    <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2'>
      {data.map((team) => (
        <Team key={team.id} team={team} hasAdmin={hasAdmin} userId={userId} />
      ))}
    </div>
  )
}
