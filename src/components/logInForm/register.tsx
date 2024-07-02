'use client'
import { useEffect, useState } from 'react'
import { useFormState } from 'react-dom'
import { Spinner } from '../spinner'
import { registerAction } from './register-action'
import type { RegisterState } from './register-action'

const initialState: RegisterState = { success: undefined, message: '' }
export function Register(): JSX.Element {
  const [state, formAction] = useFormState(registerAction, initialState)
  const [pending, setPending] = useState(false)

  useEffect(() => {
    setPending(false)
  }, [state])

  return state.message ? (
    <p
      className={
        state.success === true
          ? 'text-lime-600 text-xl font-bold'
          : 'text-red-500 italic'
      }
    >
      {state.message}
    </p>
  ) : (
    <form
      action={formAction}
      onSubmit={() => {
        setPending(true)
      }}
      className='flex flex-col gap-4 items-center justify-center'
    >
      <h2 className='text-lg font-bold'>Register</h2>
      <p className='text-gray-500 italic'>
        Enter your email address to register.
      </p>
      <input
        type='email'
        name='email'
        placeholder='magnus@lca.co.uk'
        required
        className='input input-bordered w-full max-w-xs'
      />
      <button disabled={pending} type='submit' className='btn btn-primary'>
        {pending ? <Spinner /> : 'Register'}
      </button>
    </form>
  )
}
