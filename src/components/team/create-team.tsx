'use client'

import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useState } from 'react'
import { Spinner } from '../spinner'

export function CreateTeam() {
  const queryClient = useQueryClient()
  const [name, setName] = useState('')

  function openModal() {
    setName('')
    const modal = document.getElementById(
      'create-team-modal',
    ) as HTMLDialogElement
    modal.showModal()
  }

  const mutation = useMutation({
    mutationFn: async () => {
      const response = await fetch('/api/teams', {
        method: 'POST',
        body: JSON.stringify({ name }),
      })
      if (!response.ok) throw new Error(response.statusText)
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['teams'] })
      const modal = document.getElementById(
        'create-team-modal',
      ) as HTMLDialogElement
      modal.close()
    },
  })

  return (
    <>
      <button className='btn btn-primary' onClick={openModal}>
        Create New Team
      </button>
      <dialog id='create-team-modal' className='modal'>
        <div className='modal-box max-w-sm'>
          <div className='flex flex-col gap-2'>
            <input
              disabled={mutation.isPending}
              className='input input-bordered'
              type='text'
              placeholder='Team Name'
              value={name}
              onInput={(e) => {
                setName(e.currentTarget.value)
              }}
            />
            {mutation.isError ? (
              <p className='text-red-500 italic'>
                Error: {mutation.error.message} - Please contact admin
              </p>
            ) : null}
            <button
              className='btn btn-primary'
              disabled={mutation.isPending || name.length < 5}
              onClick={() => {
                mutation.mutate()
              }}
            >
              {mutation.isPending ? (
                <>
                  Creating <Spinner />
                </>
              ) : (
                'Create Team'
              )}
            </button>
          </div>
        </div>
        <form method='dialog' className='modal-backdrop'>
          <button>close</button>
        </form>
      </dialog>
    </>
  )
}
