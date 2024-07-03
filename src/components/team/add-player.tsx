'use client'

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useState } from 'react'
import { Spinner } from '../spinner'

interface AddPlayerProps {
  teamId: number
}

export function AddPlayer({ teamId }: AddPlayerProps): JSX.Element {
  const modalId = `add-player-modal-${teamId.toString()}`
  const queryClient = useQueryClient()
  const [playerId, setPlayerId] = useState('')
  const [playerRole, setPlayerRole] = useState<'player' | 'substitute'>(
    'player',
  )

  function openModal(): void {
    const modal = document.getElementById(modalId) as HTMLDialogElement
    modal.showModal()
  }

  const { data: memberList, isPending: memberListPending } = useQuery({
    queryKey: ['members'],
    queryFn: async () => {
      const response = await fetch('/api/members')
      if (!response.ok) throw new Error(response.statusText)
      return (await response.json()) as { name: string; id: string }[]
    },
  })

  const mutation = useMutation({
    mutationFn: async () => {
      const response = await fetch('/api/teams/player', {
        method: 'POST',
        body: JSON.stringify({ teamId, playerId, playerRole }),
      })
      if (!response.ok) throw new Error(response.statusText)
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['teams'] })
      const modal = document.getElementById(modalId) as HTMLDialogElement
      modal.close()
    },
  })

  return (
    <>
      <button
        className='btn btn-primary mt-auto'
        type='button'
        onClick={openModal}
      >
        Add Player
      </button>
      <dialog id={modalId} className='modal'>
        <div className='modal-box'>
          {memberListPending ? (
            <Spinner />
          ) : (
            <div className='flex flex-col gap-2'>
              <select
                disabled={mutation.isPending}
                className='select select-bordered'
                value={playerId}
                onChange={(e) => {
                  setPlayerId(e.currentTarget.value)
                }}
              >
                <option value=''>Add Player</option>
                {memberList?.map((member) => (
                  <option key={member.id} value={member.id}>
                    {member.name}
                  </option>
                ))}
              </select>
              <label className='label cursor-pointer w-fit flex gap-2 m-auto'>
                <span className='label-text'>Player</span>
                <input
                  type='checkbox'
                  className='toggle bg-black hover:bg-black'
                  onChange={() => {
                    setPlayerRole(
                      playerRole === 'player' ? 'substitute' : 'player',
                    )
                  }}
                />
                <span className='label-text'>Substitute</span>
              </label>
              {mutation.isError ? (
                <p className='text-red-500 italic'>
                  Error: {mutation.error.message} - Please contact admin
                </p>
              ) : null}
              <button
                type='button'
                className='btn btn-primary'
                disabled={mutation.isPending}
                onClick={() => {
                  mutation.mutate()
                }}
              >
                {mutation.isPending ? (
                  <>
                    Adding <Spinner />
                  </>
                ) : (
                  'Add Player'
                )}
              </button>
            </div>
          )}
        </div>
        <form method='dialog' className='modal-backdrop'>
          <button type='button'>close</button>
        </form>
      </dialog>
    </>
  )
}
