export type Sport = "cricket" | "football" | "kabaddi" | "basketball" | "badminton"

export type TournamentType = "round-robin" | "knockout" | "league"

export type Language = "en" | "ta" | "hi"

export interface Team {
  id: string
  name: string
}

export interface Match {
  id: string
  round: number
  team1Id: string
  team2Id: string
  team1Score?: number
  team2Score?: number
  winnerId?: string
  status: "pending" | "completed"
  isDraw?: boolean
}

export interface PointsTableEntry {
  teamId: string
  teamName: string
  matchesPlayed: number
  wins: number
  losses: number
  draws: number
  points: number
  // Cricket specific
  nrr?: number
  // Football specific
  goalDifference?: number
  goalsFor?: number
  goalsAgainst?: number
  // Basketball specific
  pointsFor?: number
  pointsAgainst?: number
  pointsDifference?: number
}

export interface TournamentState {
  sport: Sport | null
  tournamentType: TournamentType
  teams: Team[]
  matches: Match[]
  currentRound: number
  language: Language
}
