import { createUploadthing, type FileRouter } from 'uploadthing/next'
import { auth } from '@/auth'
import { db } from '@/db/db'
import { resources } from '@/db/schema'

const f = createUploadthing()

export const ourFileRouter = {
  videoUploader: f({ video: { maxFileSize: '1GB' } })
    .middleware(async () => {
      // This code runs on your server before upload
      const session = await auth()
      if (!session?.user?.id) throw new Error('Unauthorized')

      // Whatever is returned here is accessible in onUploadComplete as `metadata`
      return { author: session.user.name }
    })
    .onUploadComplete(async ({ metadata, file }) => {
      // This code runs on your server before upload
      await db.insert(resources).values({
        name: file.name,
        author: metadata.author ?? "Unknown",
        type: "video",
        url: file.url,
      })

      // !!! Whatever is returned here is sent to the clientside `onClientUploadComplete` callback
      return { name: file.name, url: file.url }
    })
} satisfies FileRouter

export type OurFileRouter = typeof ourFileRouter
