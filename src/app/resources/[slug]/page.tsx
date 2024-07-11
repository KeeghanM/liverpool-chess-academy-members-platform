import Link from 'next/link'
import { PrismicRichText } from '@prismicio/react'
import { createClient } from '@/prismicio'

export default async function ResourcePage({
  params,
}: {
  params: { slug: string }
}): Promise<JSX.Element> {
  const { slug } = params
  const client = createClient()
  const resource = await client.getByUID('resource', slug)

  return (
    <>
      <div className='flex flex-col items-start gap-1'>
        <Link href='/resources' className='btn'>
          Back
        </Link>
        <h1 className='text-2xl md:text-4xl lg:text-6xl font-bold text-center flex items-center gap-4'>
          {resource.data.title}
        </h1>
      </div>
      {
        // eslint-disable-next-line -- Dunno why the prismic types arent working
        resource.data.videos.map((video) => (
          <iframe
            key={video.embed.video_id as string}
            src={video.embed.embed_url}
            width='100%'
            height='300px'
            allow='autoplay; fullscreen; picture-in-picture; clipboard-write'
            title={video.embed.title ?? 'Video'}
          />
        ))
      }
      {resource.data.description.length > 0 ? (
        <PrismicRichText field={resource.data.description} />
      ) : null}
    </>
  )
}
