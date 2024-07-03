import { NextResponse } from 'next/server'
import { eq } from 'drizzle-orm'
import { auth } from '@/auth'
import { db } from '@/db/db'
import { teams } from '@/db/schema'

export async function POST(request: Request): Promise<NextResponse> {
  try {
    const session = await auth()
    if (!session?.user?.id)
      return NextResponse.json('Unauthorised', { status: 401 })

    const { name } = (await request.json()) as { name: string }

    if (!name) return NextResponse.json('Name is required', { status: 400 })
    if (name.length < 5)
      return NextResponse.json('Name must be at least 5 characters long', {
        status: 400,
      })

    const existingTeam = await db
      .select()
      .from(teams)
      .where(eq(teams.name, name))
      .then((res) => res[0])
    if (existingTeam)
      return NextResponse.json('Team already exists', { status: 400 })

    await db.insert(teams).values({ name }).execute()

    return NextResponse.json('Team created successfully')
  } catch (error) {
    const message = error instanceof Error ? error.message : 'An error occurred'
    return NextResponse.json(message, { status: 500 })
  }
}
