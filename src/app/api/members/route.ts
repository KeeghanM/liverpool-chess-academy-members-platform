import { NextResponse } from 'next/server'
import { auth } from '@/auth'
import { db } from '@/db/db'
import { users } from '@/db/schema'

export async function GET(): Promise<NextResponse> {
  try {
    const session = await auth()
    if (!session?.user?.id)
      return NextResponse.json('Unauthorised', { status: 401 })

    const members = await db
      .select({
        id: users.id,
        name: users.name,
      })
      .from(users)

    return NextResponse.json(members)
  } catch (error) {
    const message = error instanceof Error ? error.message : 'An error occurred'
    return NextResponse.json(message, { status: 500 })
  }
}
