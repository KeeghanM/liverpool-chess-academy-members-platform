import { auth } from '@/auth'
import { Grid } from '@/components/grid/grid'
import { Tile } from '@/components/grid/tile'
import { SignIn } from '@/components/signIn/sign-in'
import { SignOut } from '@/components/signOut/sign-out'
import Link from 'next/link'

export default async function Home() {
  const session = { user: { email: 'keeghan_m@live.com' } } // await auth()
  return (
    <main className="flex min-h-screen flex-col items-center gap-12 p-24">
      <Link
        href="/"
        className="hover:text-accent"
      >
        <h1 className="text-2xl md:text-4xl lg:text-6xl font-bold text-center">
          Liverpool Chess Academy
          <br />
          <span className="text-lg md:text-2xl lg:text-4xl text-accent">
            Members Platform
          </span>
        </h1>
      </Link>
      <div>
        {session?.user ? (
          <>
            <SignOut />
            <Grid>
              <Tile
                title="My Membership"
                url="/membership"
              >
                View and manage your personal & membership details. Use this to
                update your contact details, ratings, and manage payments.
              </Tile>
              <Tile
                title="Teams"
                url="/teams"
              >
                View team information, match results, and upcoming fixtures.
              </Tile>
              <Tile
                title="Resources"
                url="/resources"
              >
                Access resources, training materials, and other useful
                information.
              </Tile>
              <Tile
                title="View Members"
                url="/members"
              >
                View other members, contact details, and ratings.
              </Tile>
            </Grid>
          </>
        ) : (
          <SignIn />
        )}
      </div>
    </main>
  )
}

