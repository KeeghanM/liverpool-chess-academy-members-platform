import { auth } from '@/auth'
import { Grid } from '@/components/grid/grid'
import { Tile } from '@/components/grid/tile'
import { LogInForm } from '@/components/logInForm/log-in-form'

export default async function Home(): Promise<JSX.Element> {
  const session = await auth()
  return (
    <>
      <h1 className='text-2xl md:text-4xl lg:text-6xl font-bold text-center'>
        Liverpool Chess Academy
        <br />
        <span className='text-lg md:text-2xl lg:text-4xl text-accent'>
          Members Platform
        </span>
      </h1>
      {session?.user ? (
        <Grid>
          <Tile title='My Membership' url='/membership'>
            View and manage your personal & membership details. Use this to
            update your contact details, ratings, and manage payments.
          </Tile>
          <Tile title='Teams' url='/teams'>
            View team information, match results, and upcoming fixtures.
          </Tile>
          <Tile title='Resources' url='/resources'>
            Access resources, training materials, and other useful information.
          </Tile>
          <Tile title='View Members' url='/members'>
            View other members, contact details, and ratings.
          </Tile>
        </Grid>
      ) : (
        <LogInForm />
      )}
    </>
  )
}
