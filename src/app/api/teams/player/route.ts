import { NextResponse } from 'next/server'
import { and, eq } from 'drizzle-orm'
import { auth } from '@/auth'
import { db } from '@/db/db'
import { teamMembers } from '@/db/schema'

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
      .values({ teamId, userId: playerId, role: playerRole })

    return NextResponse.json('Player added successfully')
  } catch (error) {
    const message = error instanceof Error ? error.message : 'An error occurred'
    return NextResponse.json(message, { status: 500 })
  }
}

export async function PATCH(request: Request): Promise<NextResponse> {
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
      .update(teamMembers)
      .set({ role: playerRole })
      .where(
        and(eq(teamMembers.teamId, teamId), eq(teamMembers.userId, playerId)),
      )

    return NextResponse.json('Player updated successfully')
  } catch (error) {
    const message = error instanceof Error ? error.message : 'An error occurred'
    return NextResponse.json(message, { status: 500 })
  }
}

export async function DELETE(request: Request): Promise<NextResponse> {
  try {
    const session = await auth()
    if (!session?.user?.id)
      return NextResponse.json('Unauthorised', { status: 401 })

    const { teamId, playerId } = (await request.json()) as {
      teamId?: number
      playerId?: string
    }

    if (teamId === undefined || playerId === undefined)
      return NextResponse.json('All fields are required', { status: 400 })

    await db
      .delete(teamMembers)
      .where(
        and(eq(teamMembers.teamId, teamId), eq(teamMembers.userId, playerId)),
      )

    return NextResponse.json('Player removed successfully')
  } catch (error) {
    const message = error instanceof Error ? error.message : 'An error occurred'
    return NextResponse.json(message, { status: 500 })
  }
}
