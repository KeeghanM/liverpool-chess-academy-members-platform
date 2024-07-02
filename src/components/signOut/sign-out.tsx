'use client'
import { signOut } from 'next-auth/react'

export function SignOut({ pinned }: { pinned?: boolean }): JSX.Element {
  return (
    <button
      type='button'
      className={`btn btn-accent ${pinned ? ' absolute top-4 right-4' : ''}`}
      onClick={() => {
        void signOut()
      }}
    >
      Sign Out
    </button>
  )
}
