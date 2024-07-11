import { NextResponse } from 'next/server'
import { revalidateTag } from 'next/cache'

export function POST(): NextResponse<{
  revalidated: boolean
  now: number
}> {
  revalidateTag('prismic')

  return NextResponse.json({ revalidated: true, now: Date.now() })
}
