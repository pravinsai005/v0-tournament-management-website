import type { Match } from "./types"

export function simulateMatchResult(sport: string): {
  team1Score: number
  team2Score: number
  winnerId?: string
  isDraw: boolean
} {
  let team1Score: number
  let team2Score: number
  let isDraw = false

  switch (sport) {
    case "cricket":
      // Cricket scores typically range from 100-300
      team1Score = Math.floor(Math.random() * 200) + 100
      team2Score = Math.floor(Math.random() * 200) + 100
      // Rare draws in cricket
      isDraw = Math.random() < 0.05
      break

    case "football":
      // Football scores typically 0-5
      team1Score = Math.floor(Math.random() * 6)
      team2Score = Math.floor(Math.random() * 6)
      // More common draws in football
      isDraw = Math.random() < 0.25
      if (isDraw) {
        team2Score = team1Score
      }
      break

    case "basketball":
      // Basketball scores typically 60-120
      team1Score = Math.floor(Math.random() * 60) + 60
      team2Score = Math.floor(Math.random() * 60) + 60
      // Very rare draws in basketball
      isDraw = false
      break

    case "kabaddi":
      // Kabaddi scores typically 20-50
      team1Score = Math.floor(Math.random() * 30) + 20
      team2Score = Math.floor(Math.random() * 30) + 20
      isDraw = Math.random() < 0.1
      if (isDraw) {
        team2Score = team1Score
      }
      break

    case "badminton":
      // Badminton scores (best of 3 games) 0-2
      team1Score = Math.floor(Math.random() * 3)
      team2Score = 2 - team1Score // One team must win 2 games
      isDraw = false
      break

    default:
      team1Score = Math.floor(Math.random() * 100)
      team2Score = Math.floor(Math.random() * 100)
      isDraw = Math.random() < 0.15
  }

  return {
    team1Score,
    team2Score,
    winnerId: isDraw ? undefined : team1Score > team2Score ? "team1" : "team2",
    isDraw,
  }
}

export function simulateAllMatches(matches: Match[], sport: string): Match[] {
  return matches.map((match) => {
    if (match.status === "completed") return match

    const result = simulateMatchResult(sport)

    return {
      ...match,
      team1Score: result.team1Score,
      team2Score: result.team2Score,
      winnerId: result.winnerId === "team1" ? match.team1Id : result.winnerId === "team2" ? match.team2Id : undefined,
      isDraw: result.isDraw,
      status: "completed" as const,
    }
  })
}
