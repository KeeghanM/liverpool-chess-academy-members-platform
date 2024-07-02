'use client'

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import type { EditDetailForm } from '@/app/api/member/route'
import { Spinner } from '../spinner'

export function EditForm(): JSX.Element {
  const queryClient = useQueryClient()

  const { isPending, error, data } = useQuery({
    queryKey: ['alerts'],
    queryFn: async () => {
      const response = await fetch('/api/member')
      if (!response.ok) throw new Error(response.statusText)
      return (await response.json()) as EditDetailForm
    },
  })

  const mutation = useMutation({
    mutationFn: async (formData: EditDetailForm) => {
      const response = await fetch('/api/member', {
        method: 'POST',
        body: JSON.stringify({ formData }),
      })
      if (!response.ok) throw new Error(response.statusText)
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['alerts'] })
    },
  })

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>): void => {
    event.preventDefault()
    const formData = Object.fromEntries(
      new FormData(event.currentTarget),
    ) as unknown as EditDetailForm

    mutation.mutate(formData)
  }

  if (error) return <div>Error: {error.message}</div>

  return isPending ? (
    <Spinner />
  ) : (
    <form onSubmit={handleSubmit}>
      <fieldset
        className='grid grid-cols-1 md:grid-cols-2 gap-2'
        disabled={mutation.isPending || isPending}
      >
        <label className='form-control w-full max-w-xs'>
          <span className='label-text'>Name</span>
          <input
            className='input input-bordered w-full max-w-xs'
            type='text'
            defaultValue={data.name ?? ''}
            name='name'
          />
        </label>
        <label className='form-control w-full max-w-xs'>
          <span className='label-text'>Email</span>
          <input
            className='input input-bordered w-full max-w-xs'
            type='email'
            defaultValue={data.email ?? ''}
            name='email'
          />
        </label>
        <label className='form-control w-full max-w-xs'>
          <span className='label-text'>ECF Rating</span>
          <input
            className='input input-bordered w-full max-w-xs'
            type='number'
            min={0}
            max={3000}
            defaultValue={data.ecfRating ?? ''}
            name='ecfRating'
          />
        </label>
        <label className='form-control w-full max-w-xs'>
          <span className='label-text'>Online Rating</span>
          <input
            className='input input-bordered w-full max-w-xs'
            type='number'
            min={0}
            max={3000}
            defaultValue={data.onlineRating ?? ''}
            name='onlineRating'
          />
        </label>
        <label className='form-control w-full max-w-xs'>
          <span className='label-text'>ECF Number</span>
          <input
            className='input input-bordered w-full max-w-xs'
            type='text'
            defaultValue={data.ecfNumber ?? ''}
            name='ecfNumber'
          />
        </label>
        <label className='form-control w-full max-w-xs'>
          <span className='label-text'>FIDE Number</span>
          <input
            className='input input-bordered w-full max-w-xs'
            type='text'
            defaultValue={data.fideNumber ?? ''}
            name='fideNumber'
          />
        </label>
        <label className='form-control w-full max-w-xs'>
          <span className='label-text'>LiChess Username</span>
          <input
            className='input input-bordered w-full max-w-xs'
            type='text'
            defaultValue={data.lichessUsername ?? ''}
            name='lichessUsername'
          />
        </label>
        <label className='form-control w-full max-w-xs'>
          <span className='label-text'>Chess.com Username</span>
          <input
            className='input input-bordered w-full max-w-xs'
            type='text'
            defaultValue={data.chesscomUsername ?? ''}
            name='chesscomUsername'
          />
        </label>
        <button
          type='submit'
          disabled={mutation.isPending}
          className='btn btn-primary'
        >
          {mutation.isPending ? (
            <>
              Saving <Spinner />
            </>
          ) : (
            'Save'
          )}
        </button>
      </fieldset>
    </form>
  )
}
