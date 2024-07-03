'use client'

import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useState } from 'react'
import { Spinner } from '../spinner'

interface EditPlayerProps {
  teamId: number
  playerId: string
  name: string
  role: 'player' | 'substitute'
}

export function EditPlayer({
  teamId,
  playerId,
  name,
  role,
}: EditPlayerProps): JSX.Element {
  const modalId = `edit-player-modal-${playerId.toString()}`
  const queryClient = useQueryClient()
  const [playerRole, setPlayerRole] = useState(role)

  function openModal(): void {
    const modal = document.getElementById(modalId) as HTMLDialogElement
    modal.showModal()
  }

  function handleDelete(): void {
    // eslint-disable-next-line -- I don't mind the confirm here
    if (confirm('Are you sure you want to remove this player from the team?')) {
      deleteMutation.mutate()
    }
  }
  const editMutation = useMutation({
    mutationFn: async () => {
      const response = await fetch('/api/teams/player', {
        method: 'PATCH',
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

  const deleteMutation = useMutation({
    mutationFn: async () => {
      const response = await fetch('/api/teams/player', {
        method: 'DELETE',
        body: JSON.stringify({ teamId, playerId }),
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
      <div className='tooltip' data-tip='Edit Player'>
        <button
          className='btn btn-ghost hover:text-accent'
          type='button'
          onClick={openModal}
        >
          <svg
            xmlns='http://www.w3.org/2000/svg'
            width={16}
            height={16}
            viewBox='0 0 256 256'
          >
            <path
              fill='currentColor'
              d='m227.31 73.37l-44.68-44.69a16 16 0 0 0-22.63 0L36.69 152A15.86 15.86 0 0 0 32 163.31V208a16 16 0 0 0 16 16h44.69a15.86 15.86 0 0 0 11.31-4.69L227.31 96a16 16 0 0 0 0-22.63M51.31 160L136 75.31L152.69 92L68 176.68ZM48 179.31L76.69 208H48Zm48 25.38L79.31 188L164 103.31L180.69 120Zm96-96L147.31 64l24-24L216 84.68Z'
            />
          </svg>
        </button>
      </div>
      <dialog id={modalId} className='modal'>
        <div className='modal-box'>
          <div className='flex flex-col gap-2'>
            <h3 className='text-xl font-bold'>Edit Player: {name}</h3>
            <select
              disabled={editMutation.isPending || deleteMutation.isPending}
              className='select select-bordered'
              value={playerRole}
              onChange={(e) => {
                setPlayerRole(e.currentTarget.value as 'player' | 'substitute')
              }}
            >
              <option value='player'>Player</option>
              <option value='substitute'>Substitute</option>
            </select>
            {editMutation.isError ? (
              <p className='text-red-500 italic'>
                Error: {editMutation.error.message} - Please contact admin
              </p>
            ) : null}
            <button
              type='button'
              className='btn btn-primary'
              disabled={editMutation.isPending || deleteMutation.isPending}
              onClick={() => {
                editMutation.mutate()
              }}
            >
              {editMutation.isPending ? (
                <>
                  Saving <Spinner />
                </>
              ) : (
                'Save'
              )}
            </button>
            <button
              type='button'
              className='btn btn-warning'
              disabled={editMutation.isPending || deleteMutation.isPending}
              onClick={handleDelete}
            >
              {deleteMutation.isPending ? (
                <>
                  Removing <Spinner />
                </>
              ) : (
                'Remove Player'
              )}
            </button>
          </div>
        </div>
        <form method='dialog' className='modal-backdrop'>
          <button type='button'>close</button>
        </form>
      </dialog>
    </>
  )
}
