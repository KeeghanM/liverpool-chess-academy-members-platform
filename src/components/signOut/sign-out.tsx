'use client'
import { signOut } from 'next-auth/react'

export function SignOut() {
  //   const
  return (
    <button
      className="btn btn-secondary absolute top-4 right-4"
      onClick={() => signOut()}
    >
      Sign Out
    </button>
  )
}
