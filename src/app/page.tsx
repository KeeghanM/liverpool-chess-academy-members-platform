import { auth } from '@/auth'
import { SignIn } from '@/components/signIn/sign-in'
import { SignOut } from '@/components/signOut/sign-out'

export default async function Home() {
  const session = await auth()
  return (
    <main className="flex min-h-screen flex-col items-center gap-12 p-24">
      <h1 className="text-2xl md:text-4xl lg:text-6xl font-bold text-center">
        Liverpool Chess Academy
        <br />
        Members Platform
      </h1>
      <div>
        {session?.user ? (
          <>
            <SignOut />
            <div className="flex flex-col gap-4 w-[80vw] items-center"></div>
          </>
        ) : (
          <SignIn />
        )}
      </div>
    </main>
  )
}

