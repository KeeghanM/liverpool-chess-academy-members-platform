'use client'
import { signOut } from 'next-auth/react'

export function SignOut() {
  return (
    <button
      className="btn btn-accent absolute top-4 right-4"
      onClick={() => signOut()}
    >
      Sign Out
    </button>
  )
}
