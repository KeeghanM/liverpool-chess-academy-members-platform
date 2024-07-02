import Link from 'next/link'
import { auth } from '@/auth'
import { SignOut } from '../signOut/sign-out'

export async function Header(): Promise<JSX.Element> {
  const session = await auth()

  return (
    <header className="navbar bg-base-100 shadow sticky top-0">
      <div className="flex-1">
        <Link
          className="btn btn-ghost"
          href="/"
        >
          LCA: Members
        </Link>
      </div>

      {session?.user ? (
        <div className="flex-none">
          <SignOut />
        </div>
      ) : null}
    </header>
  )
}
