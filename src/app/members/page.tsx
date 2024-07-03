import { eq } from 'drizzle-orm'
import { auth } from '@/auth'
import { db } from '@/db/db'
import { memberData, users } from '@/db/schema'

export default async function Members(): Promise<JSX.Element> {
  const session = await auth()
  if (!session?.user?.id) return <h1>Log in to access this page.</h1>

  const memberList = await db
    .select({
      name: users.name,
      email: users.email,
      memberNumber: memberData.memberNumber,
      active: memberData.active_payment,
      override: memberData.payment_override,
      ecf_rating: memberData.ecf_rating,
      online_rating: memberData.online_rating,
      ecf_number: memberData.ecf_number,
      fide_id: memberData.fide_id,
      lichess_username: memberData.lichess_username,
      chesscom_username: memberData.chesscom_username,
    })
    .from(users)
    .leftJoin(memberData, eq(users.id, memberData.userId))

  return (
    <>
      <h1 className='text-2xl md:text-4xl lg:text-6xl font-bold text-center flex items-center gap-4'>
        Members List
      </h1>
      <div className='overflow-x-auto max-w-[100vw]'>
        <table className='table table-xs'>
          <thead>
            <tr>
              <th>Member Number</th>
              <th>Name</th>
              <th>Email</th>
              <th>ECF Rating</th>
              <th>Online Rating</th>
              <th>ECF Number</th>
              <th>FIDE Number</th>
              <th>Lichess Username</th>
              <th>Chess.com Username</th>
            </tr>
          </thead>
          <tbody>
            {memberList.map((member) => (
              <tr key={member.memberNumber}>
                <td>
                  <div
                    className='tooltip'
                    data-tip={
                      member.active === true || member.override === true
                        ? 'Paid Up'
                        : 'Unpaid'
                    }
                  >
                    <span
                      className={`badge badge-${
                        member.active === true || member.override === true
                          ? 'success'
                          : 'warning'
                      }`}
                    >{`LCA${`000${(member.memberNumber ?? 0).toString()}`.slice(
                      -3,
                    )}`}</span>
                  </div>
                </td>
                <td>{member.name}</td>
                <td>{member.email}</td>
                <td>{member.ecf_rating}</td>
                <td>{member.online_rating}</td>
                <td>
                  {member.ecf_number ? (
                    <a
                      href={`https://rating.englishchess.org.uk/v2/new/player.php?ECF_code=${member.ecf_number}`}
                      className='link link-accent'
                      target='_blank'
                      rel='noreferrer noopener'
                    >
                      {member.ecf_number}
                    </a>
                  ) : (
                    ''
                  )}
                </td>
                <td>{member.fide_id}</td>
                <td>{member.lichess_username}</td>
                <td>{member.chesscom_username}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  )
}
