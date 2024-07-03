'use client'

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useState } from 'react'
import { Spinner } from '../spinner'

interface EditTeamProps {
  id: number
  name: string
}

export function EditTeam({ id, name }: EditTeamProps): JSX.Element {
  const modalId = `edit-team-modal-${id.toString()}`
  const queryClient = useQueryClient()
  const [teamName, setTeamName] = useState(name)
  const [captainId, setCaptainId] = useState('')

  function openModal() {
    const modal = document.getElementById(modalId) as HTMLDialogElement
    modal.showModal()
  }

  function handleDelete() {
    // eslint-disable-next-line -- I don't mind the confirm here
    if (confirm('Are you sure you want to delete this team?')) {
      deleteMutation.mutate()
    }
  }

  const { data: memberList, isPending: memberListPending } = useQuery({
    queryKey: ['members'],
    queryFn: async () => {
      const response = await fetch('/api/members')
      if (!response.ok) throw new Error(response.statusText)
      return (await response.json()) as { name: string; id: string }[]
    },
  })

  const editMutation = useMutation({
    mutationFn: async () => {
      const response = await fetch('/api/teams', {
        method: 'PATCH',
        body: JSON.stringify({ id, teamName, captainId: captainId }),
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
      const response = await fetch('/api/teams', {
        method: 'DELETE',
        body: JSON.stringify({ id }),
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
      <div className='tooltip' data-tip='Edit Team'>
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
            ></path>
          </svg>
        </button>
      </div>
      <dialog id={modalId} className='modal'>
        <div className='modal-box'>
          {memberListPending ? (
            <Spinner />
          ) : (
            <div className='flex flex-col gap-2'>
              <input
                disabled={editMutation.isPending || deleteMutation.isPending}
                className='input input-bordered'
                type='text'
                placeholder='Team Name'
                value={teamName}
                onInput={(e) => {
                  setTeamName(e.currentTarget.value)
                }}
              />
              <select
                disabled={editMutation.isPending || deleteMutation.isPending}
                className='select select-bordered'
                value={captainId}
                onChange={(e) => {
                  setCaptainId(e.currentTarget.value)
                }}
              >
                <option value=''>Select Captain</option>
                {memberList?.map((member) => (
                  <option key={member.id} value={member.id}>
                    {member.name}
                  </option>
                ))}
              </select>
              {editMutation.isError ? (
                <p className='text-red-500 italic'>
                  Error: {editMutation.error.message} - Please contact admin
                </p>
              ) : null}
              <button
                className='btn btn-primary'
                disabled={
                  editMutation.isPending ||
                  deleteMutation.isPending ||
                  teamName.length < 5
                }
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
                className='btn btn-warning'
                disabled={editMutation.isPending || deleteMutation.isPending}
                onClick={handleDelete}
              >
                {deleteMutation.isPending ? (
                  <>
                    Deleting <Spinner />
                  </>
                ) : (
                  'Delete Team'
                )}
              </button>
            </div>
          )}
        </div>
        <form method='dialog' className='modal-backdrop'>
          <button>close</button>
        </form>
      </dialog>
    </>
  )
}
