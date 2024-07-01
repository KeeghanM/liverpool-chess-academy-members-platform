import { auth } from '@/auth'

export default async function Resources(): Promise<JSX.Element> {
  const session = await auth()
  if (!session?.user?.id) return <h1>Log in to access this page.</h1>

  return (
    <h1 className="text-2xl md:text-4xl lg:text-6xl font-bold text-center flex items-center gap-4">
      Resources <div className="badge badge-warning">Coming Soon</div>
    </h1>
  )
}
