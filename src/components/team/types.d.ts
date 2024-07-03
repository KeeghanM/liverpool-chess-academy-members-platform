export interface TeamMember {
  name: string | null
  role: 'player' | 'substitute'
  rating: number | null
}

export interface TeamType {
  id: number
  name: string
  captain: {
    id: string
    name: string | null
  } | null
  members: TeamMember[]
}
