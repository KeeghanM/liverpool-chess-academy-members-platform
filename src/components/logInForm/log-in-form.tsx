'use client'
import { useState } from 'react'
import { SignIn } from './sign-in'
import { Register } from './register'

export function LogInForm(): JSX.Element {
  const [mode, setMode] = useState<'login' | 'register'>('login')

  return (
    <div className='border border-black p-4 flex flex-col gap-4 items-center justify-center'>
      {mode === 'login' ? <SignIn /> : <Register />}
      {mode === 'login' ? (
        <button
          type='button'
          className='btn btn-link'
          onClick={() => {
            setMode('register')
          }}
        >
          Don&apos;t have an account? Register here.
        </button>
      ) : (
        <button
          type='button'
          className='btn btn-link'
          onClick={() => {
            setMode('login')
          }}
        >
          Already a member? Sign in here.
        </button>
      )}
    </div>
  )
}
