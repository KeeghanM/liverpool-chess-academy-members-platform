import { eq } from 'drizzle-orm'
import { auth } from '@/auth'
import { db } from '@/db/db'
import { memberData } from '@/db/schema'
import { ResourceList } from '@/components/resources/list'
import { createClient } from '@/prismicio'

export default async function Resources(): Promise<JSX.Element> {
  const session = await auth()
  if (!session?.user?.id)
    return (
      <h1 className='text-2xl md:text-4xl lg:text-6xl font-bold text-center flex items-center gap-4'>
        Log in to access this page.
      </h1>
    )

  const canView = await db
    .select({
      activePayment: memberData.active_payment,
      paymentOverride: memberData.payment_override,
    })
    .from(memberData)
    .where(eq(memberData.userId, session.user.id))
    .then((data) => {
      return (
        data[0]?.activePayment === true || data[0]?.paymentOverride === true
      )
    })

  if (!canView)
    return (
      <h1 className='text-2xl md:text-4xl lg:text-6xl font-bold text-center flex items-center gap-4'>
        You need an active/paid membership to access resources.
      </h1>
    )

  const client = createClient()
  const resources = await client.getAllByType('resource', {
    graphQuery: `
      {
        resource {
          title
          type
        }
      }
      `,
  })

  const allTags: string[] = []
  resources.forEach((r) => {
    r.tags.forEach((t) => {
      allTags.push(t)
    })
  })
  const tags = [...new Set(allTags)]

  return (
    <>
      <h1 className='text-2xl md:text-4xl lg:text-6xl font-bold text-center flex items-center gap-4'>
        Resources
      </h1>
      <ResourceList tags={tags} resources={resources} />
    </>
  )
}
