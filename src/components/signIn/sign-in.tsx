'use client'
import { Spinner } from '../spinner'
import { signInAction } from './action'
import { useActionState, useEffect, useState } from 'react'

export function SignIn() {
  const [state, formAction] = useActionState(signInAction, { success: true })
  const [mode, setMode] = useState<'email' | 'code'>('email')
  const [pending, setPending] = useState(false)

  useEffect(() => {
    setPending(false)
  }, [state.success])

  return (
    <form
      action={formAction}
      className="flex flex-col gap-4 items-center justify-center border border-black p-4"
    >
      <h2 className="text-lg font-bold">Sign In with your:</h2>
      <div className="form-control">
        <label className="label cursor-pointer flex gap-2">
          <span className="label-text">Email</span>
          <input
            type="checkbox"
            className="toggle bg-black hover:bg-black"
            defaultChecked={false}
            onClick={() => setMode(mode === 'email' ? 'code' : 'email')}
          />
          <span className="label-text">Member Code</span>
        </label>
      </div>
      {mode === 'code' ? (
        <input
          type="text"
          name="code"
          placeholder="LCA001"
          required
          className="input input-bordered w-full max-w-xs"
        />
      ) : (
        <input
          type="email"
          name="email"
          placeholder="Email"
          required
          className="input input-bordered w-full max-w-xs"
        />
      )}
      <button
        disabled={state.success}
        type="submit"
        onClick={() => setPending(true)}
        className="btn btn-primary"
      >
        {pending ? <Spinner /> : 'Log In'}
      </button>
    </form>
  )
}
