import { auth } from '@/auth'
import { db } from '@/db/db'
import { teamMembers } from '@/db/schema'
import { NextResponse } from 'next/server'

export async function POST(request: Request): Promise<NextResponse> {
  try {
    const session = await auth()
    if (!session?.user?.id)
      return NextResponse.json('Unauthorised', { status: 401 })

    const { teamId, playerId, playerRole } = (await request.json()) as {
      teamId?: number
      playerId?: string
      playerRole?: 'player' | 'substitute'
    }

    if (
      teamId === undefined ||
      playerId === undefined ||
      playerRole === undefined
    )
      return NextResponse.json('All fields are required', { status: 400 })

    await db
      .insert(teamMembers)
      .values({ teamId: teamId, userId: playerId, role: playerRole })

    return NextResponse.json('Player added successfully')
  } catch (error) {
    const message = error instanceof Error ? error.message : 'An error occurred'
    return NextResponse.json(message, { status: 500 })
  }
}
