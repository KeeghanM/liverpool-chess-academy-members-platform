import { NextResponse } from 'next/server'
import { and, asc, desc, eq } from 'drizzle-orm'
import { alias } from 'drizzle-orm/sqlite-core'
import { auth } from '@/auth'
import { db } from '@/db/db'
import {
  memberData,
  roleMappings,
  roles,
  teamMembers,
  teams,
  users,
} from '@/db/schema'
import type { TeamType } from '@/components/team/types'

export async function GET(): Promise<NextResponse> {
  try {
    const session = await auth()
    if (!session?.user?.id)
      return NextResponse.json('Unauthorised', { status: 401 })

    const members = alias(users, 'members')
    const dbTeamsWithMembers = await db
      .select({
        teamId: teams.id,
        teamName: teams.name,
        captainId: teams.captainId,
        captainName: users.name,
        memberId: members.id,
        memberName: members.name,
        memberRole: teamMembers.role,
        memberRating: memberData.ecf_rating,
      })
      .from(teams)
      .leftJoin(users, eq(teams.captainId, users.id))
      .leftJoin(teamMembers, eq(teams.id, teamMembers.teamId))
      .leftJoin(members, eq(teamMembers.userId, members.id))
      .leftJoin(memberData, eq(members.id, memberData.userId))
      .orderBy(asc(teamMembers.role), desc(memberData.ecf_rating))

    const teamList: TeamType[] = []
    const teamMap: Record<number, TeamType> = {}

    dbTeamsWithMembers.forEach((row) => {
      if (!teamMap[row.teamId]) {
        const newTeam = {
          id: row.teamId,
          name: row.teamName,
          captain: row.captainId
            ? { id: row.captainId, name: row.captainName }
            : null,
          members: [],
        }
        teamMap[row.teamId] = newTeam
        teamList.push(newTeam)
      }

      if (row.memberId) {
        teamMap[row.teamId]?.members.push({
          id: row.memberId,
          name: row.memberName,
          role: row.memberRole ?? 'player',
          rating: row.memberRating,
        })
      }
    })

    return NextResponse.json(teamList)
  } catch (error) {
    const message = error instanceof Error ? error.message : 'An error occurred'
    return NextResponse.json(message, { status: 500 })
  }
}

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

export async function PATCH(request: Request): Promise<NextResponse> {
  try {
    const session = await auth()
    if (!session?.user?.id)
      return NextResponse.json('Unauthorised', { status: 401 })

    const { id, teamName, captainId } = (await request.json()) as {
      id: number
      teamName: string
      captainId: string | null
    }

    if (!teamName) return NextResponse.json('Name is required', { status: 400 })
    if (teamName.length < 5)
      return NextResponse.json('Name must be at least 5 characters long', {
        status: 400,
      })

    await db
      .update(teams)
      .set({ name: teamName, captainId: !captainId ? null : captainId })
      .where(eq(teams.id, id))
      .execute()

    return NextResponse.json('Team updated successfully')
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

    const { id } = (await request.json()) as { id: number }
    if (!id) return NextResponse.json('ID is required', { status: 400 })

    const hasAdmin = await db
      .select()
      .from(roleMappings)
      .leftJoin(roles, eq(roleMappings.roleId, roles.id))
      .where(
        and(eq(roleMappings.userId, session.user.id), eq(roles.name, 'Admin')),
      )
      .then((res) => res.length > 0)
    if (!hasAdmin) return NextResponse.json('Unauthorised', { status: 401 })

    await db.delete(teams).where(eq(teams.id, id))

    return NextResponse.json('Team deleted successfully')
  } catch (error) {
    const message = error instanceof Error ? error.message : 'An error occurred'
    return NextResponse.json(message, { status: 500 })
  }
}
