import { eq } from 'drizzle-orm'
import { auth } from '@/auth'
import { db } from '@/db/db'
import { memberData, resources, roleMappings } from '@/db/schema'
import { ResourceList } from '@/components/resources/list'
import { UploadResource } from '@/components/resources/upload'

export default async function Resources(): Promise<JSX.Element> {
  const session = await auth()
  if (!session?.user?.id)
    return (
      <h1 className='text-2xl md:text-4xl lg:text-6xl font-bold text-center flex items-center gap-4'>
        Log in to access this page.
      </h1>
    )

  const accessRules = await db
    .select({
      activePayment: memberData.active_payment,
      paymentOverride: memberData.payment_override,
      admin: roleMappings.roleId
    })
    .from(memberData)
    .leftJoin(roleMappings,eq(
      roleMappings.roleId, 2 // 2 === admin
    ))
    .where(eq(memberData.userId, session.user.id))
    .then((data) => {
      return {
        canView: data[0]?.activePayment === true || data[0]?.paymentOverride === true,
        canAdd: data[0]?.admin === 2}
      
    })

  if (!accessRules.canView)
    return (
      <h1 className='text-2xl md:text-4xl lg:text-6xl font-bold text-center flex items-center gap-4'>
        You need an active/paid membership to access resources.
      </h1>
    )

  const resourceList = await db.select({
    id: resources.id,
    fileName: resources.name,
    dateAdded: resources.dateAdded,
    fileUrl: resources.url,
    author: resources.author
  }).from(resources)

  return (<>
    <h1 className='text-2xl md:text-4xl lg:text-6xl font-bold text-center flex items-center gap-4'>
      Resources
    </h1>
    {accessRules.canAdd ? <UploadResource /> : null}
    <ResourceList resources={resourceList} />
    </>
  )
}
