'use client'
import { useState } from 'react'
import { SignIn } from './sign-in'
import { Register } from './register'

export function LogInForm() {
  const [mode, setMode] = useState<'login' | 'register'>('login')

  return (
    <div className="border border-black p-4 flex flex-col gap-4 items-center justify-center">
      {mode === 'login' ? <SignIn /> : <Register />}
      {mode === 'login' ? (
        <button
          className="btn btn-link"
          onClick={() => setMode('register')}
        >
          Don't have an account? Register here.
        </button>
      ) : (
        <button
          className="btn btn-link"
          onClick={() => setMode('login')}
        >
          Already a member? Sign in here.
        </button>
      )}
    </div>
  )
}
