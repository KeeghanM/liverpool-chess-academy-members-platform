import { NextResponse } from 'next/server'
import { eq } from 'drizzle-orm'
import { auth } from '@/auth'
import { db } from '@/db/db'
import { memberData, users } from '@/db/schema'

export interface EditDetailForm {
  email: string | null
  name: string | null
  ecfRating: number | null
  onlineRating: number | null
  ecfNumber: string | null
  fideNumber: string | null
  lichessUsername: string | null
  chesscomUsername: string | null
}

export async function GET(): Promise<NextResponse> {
  try {
    const session = await auth()
    if (!session?.user?.id)
      return NextResponse.json('Unauthorised', { status: 401 })

    const member = await db
      .select({
        email: users.email,
        name: users.name,
        ecfRating: memberData.ecf_rating,
        onlineRating: memberData.online_rating,
        ecfNumber: memberData.ecf_number,
        fideNumber: memberData.fide_id,
        lichessUsername: memberData.lichess_username,
        chesscomUsername: memberData.chesscom_username,
      })
      .from(memberData)
      .leftJoin(users, eq(users.id, memberData.userId))
      .where(eq(users.id, session.user.id))
      .then((result) => result[0])

    if (!member) throw new Error('Member not found')

    return NextResponse.json(member as EditDetailForm)
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

    const { formData } = (await request.json()) as {
      formData: EditDetailForm | undefined
    }

    if (!formData?.email)
      return NextResponse.json('Email is required', { status: 400 })

    // Update the member data
    await db
      .update(memberData)
      .set({
        ecf_rating: formData.ecfRating,
        online_rating: formData.onlineRating,
        ecf_number: formData.ecfNumber,
        fide_id: formData.fideNumber,
        lichess_username: formData.lichessUsername,
        chesscom_username: formData.chesscomUsername,
      })
      .where(eq(memberData.userId, session.user.id))
      .run()

    // Update the user data
    await db
      .update(users)
      .set({
        name: formData.name,
        email: formData.email,
      })
      .where(eq(users.id, session.user.id))
      .run()

    return NextResponse.json('Details updated')
  } catch (error) {
    const message = error instanceof Error ? error.message : 'An error occurred'
    return NextResponse.json(message, { status: 500 })
  }
}
