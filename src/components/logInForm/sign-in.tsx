'use client'
import { Spinner } from '../spinner'
import { signInAction } from './sign-in-action'
import type { SignInState } from './sign-in-action'
import { useEffect, useState } from 'react'
import { useFormState } from 'react-dom'

const initialState: SignInState = { success: undefined, message: '' }
export function SignIn() {
  const [state, formAction] = useFormState(signInAction, initialState)
  const [pending, setPending] = useState(false)

  useEffect(() => {
    setPending(false)
  }, [state])

  return (
    <form
      action={formAction}
      onSubmit={() => setPending(true)}
      className="flex flex-col gap-4 items-center justify-center"
    >
      <h2 className="text-lg font-bold">Sign In</h2>
      <p className="text-gray-500 italic">
        Enter your membership code to sign in.
      </p>
      <input
        type="text"
        name="code"
        placeholder="LCA001"
        required
        className="input input-bordered w-full max-w-xs"
      />
      <button
        disabled={pending}
        type="submit"
        className="btn btn-primary"
      >
        {pending ? <Spinner /> : 'Log In'}
      </button>
      {state.message && (
        <p
          className={
            'italic ' +
            (state.success === true ? 'text-lime-500' : 'text-red-500')
          }
        >
          {state.message}
        </p>
      )}
    </form>
  )
}
