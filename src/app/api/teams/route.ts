import { NextResponse } from 'next/server'
import { asc, desc, eq } from 'drizzle-orm'
import { auth } from '@/auth'
import { db } from '@/db/db'
import { memberData, teamMembers, teams, users } from '@/db/schema'
import type { TeamMember, TeamType } from '@/components/team/team'

export async function GET(): Promise<NextResponse> {
  try {
    const session = await auth()
    if (!session?.user?.id)
      return NextResponse.json('Unauthorised', { status: 401 })

    const teamList = (await db
      .select({
        id: teams.id,
        name: teams.name,
        captain: users.name,
      })
      .from(teams)
      .leftJoin(users, eq(teams.captainId, users.id))) as TeamType[]

    for (const team of teamList) {
      const members: TeamMember[] = await db
        .select({
          name: users.name,
          role: teamMembers.role,
          rating: memberData.ecf_rating,
        })
        .from(teamMembers)
        .leftJoin(users, eq(teamMembers.userId, users.id))
        .leftJoin(memberData, eq(users.id, memberData.userId))
        .where(eq(teamMembers.teamId, team.id))
        .orderBy(asc(teamMembers.role), desc(memberData.ecf_rating))

      team.members = members
    }

    return NextResponse.json(teamList)
  } catch (error) {
    const message = error instanceof Error ? error.message : 'An error occurred'
    return NextResponse.json(message, { status: 500 })
  }
}
