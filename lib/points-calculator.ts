import type { Sport, Match, Team, PointsTableEntry } from "./types"

export function calculatePointsTable(sport: Sport, teams: Team[], matches: Match[]): PointsTableEntry[] {
  const pointsTable: PointsTableEntry[] = teams.map((team) => ({
    teamId: team.id,
    teamName: team.name,
    matchesPlayed: 0,
    wins: 0,
    losses: 0,
    draws: 0,
    points: 0,
    nrr: 0,
    goalDifference: 0,
    goalsFor: 0,
    goalsAgainst: 0,
    pointsFor: 0,
    pointsAgainst: 0,
    pointsDifference: 0,
  }))

  // Calculate stats for each team
  matches
    .filter((match) => match.status === "completed")
    .forEach((match) => {
      const team1Entry = pointsTable.find((entry) => entry.teamId === match.team1Id)
      const team2Entry = pointsTable.find((entry) => entry.teamId === match.team2Id)

      if (!team1Entry || !team2Entry) return

      const team1Score = match.team1Score || 0
      const team2Score = match.team2Score || 0

      // Update matches played
      team1Entry.matchesPlayed++
      team2Entry.matchesPlayed++

      // Determine winner and update stats
      if (match.isDraw) {
        team1Entry.draws++
        team2Entry.draws++
      } else if (match.winnerId === match.team1Id) {
        team1Entry.wins++
        team2Entry.losses++
      } else if (match.winnerId === match.team2Id) {
        team2Entry.wins++
        team1Entry.losses++
      }

      // Sport-specific calculations
      switch (sport) {
        case "cricket":
          // Cricket: 2 points for win, 1 for draw, 0 for loss
          if (match.isDraw) {
            team1Entry.points += 1
            team2Entry.points += 1
          } else if (match.winnerId === match.team1Id) {
            team1Entry.points += 2
          } else if (match.winnerId === match.team2Id) {
            team2Entry.points += 2
          }
          break

        case "football":
          // Football: 3 points for win, 1 for draw, 0 for loss
          if (match.isDraw) {
            team1Entry.points += 1
            team2Entry.points += 1
          } else if (match.winnerId === match.team1Id) {
            team1Entry.points += 3
          } else if (match.winnerId === match.team2Id) {
            team2Entry.points += 3
          }

          // Goal difference
          team1Entry.goalsFor = (team1Entry.goalsFor || 0) + team1Score
          team1Entry.goalsAgainst = (team1Entry.goalsAgainst || 0) + team2Score
          team2Entry.goalsFor = (team2Entry.goalsFor || 0) + team2Score
          team2Entry.goalsAgainst = (team2Entry.goalsAgainst || 0) + team1Score
          team1Entry.goalDifference = (team1Entry.goalsFor || 0) - (team1Entry.goalsAgainst || 0)
          team2Entry.goalDifference = (team2Entry.goalsFor || 0) - (team2Entry.goalsAgainst || 0)
          break

        case "kabaddi":
        case "basketball":
        case "badminton":
          // Other sports: 2 points for win, 1 for draw, 0 for loss
          if (match.isDraw) {
            team1Entry.points += 1
            team2Entry.points += 1
          } else if (match.winnerId === match.team1Id) {
            team1Entry.points += 2
          } else if (match.winnerId === match.team2Id) {
            team2Entry.points += 2
          }

          // Points for/against for basketball and kabaddi
          if (sport === "basketball" || sport === "kabaddi") {
            team1Entry.pointsFor = (team1Entry.pointsFor || 0) + team1Score
            team1Entry.pointsAgainst = (team1Entry.pointsAgainst || 0) + team2Score
            team2Entry.pointsFor = (team2Entry.pointsFor || 0) + team2Score
            team2Entry.pointsAgainst = (team2Entry.pointsAgainst || 0) + team1Score
            team1Entry.pointsDifference = (team1Entry.pointsFor || 0) - (team1Entry.pointsAgainst || 0)
            team2Entry.pointsDifference = (team2Entry.pointsFor || 0) - (team2Entry.pointsAgainst || 0)
          }
          break
      }
    })

  // Calculate NRR for cricket
  if (sport === "cricket") {
    pointsTable.forEach((entry) => {
      // Simple NRR calculation (for demonstration - real NRR is more complex)
      const totalRunsScored = matches
        .filter((m) => m.status === "completed" && (m.team1Id === entry.teamId || m.team2Id === entry.teamId))
        .reduce((sum, m) => {
          if (m.team1Id === entry.teamId) return sum + (m.team1Score || 0)
          if (m.team2Id === entry.teamId) return sum + (m.team2Score || 0)
          return sum
        }, 0)

      const totalRunsConceded = matches
        .filter((m) => m.status === "completed" && (m.team1Id === entry.teamId || m.team2Id === entry.teamId))
        .reduce((sum, m) => {
          if (m.team1Id === entry.teamId) return sum + (m.team2Score || 0)
          if (m.team2Id === entry.teamId) return sum + (m.team1Score || 0)
          return sum
        }, 0)

      const matchesPlayed = entry.matchesPlayed || 1 // Avoid division by zero
      entry.nrr = Number(((totalRunsScored - totalRunsConceded) / matchesPlayed).toFixed(3))
    })
  }

  // Sort points table
  return sortPointsTable(sport, pointsTable)
}

function sortPointsTable(sport: Sport, table: PointsTableEntry[]): PointsTableEntry[] {
  return table.sort((a, b) => {
    // First, sort by points
    if (b.points !== a.points) return b.points - a.points

    // Then by sport-specific criteria
    switch (sport) {
      case "cricket":
        return (b.nrr || 0) - (a.nrr || 0)
      case "football":
        if ((b.goalDifference || 0) !== (a.goalDifference || 0)) {
          return (b.goalDifference || 0) - (a.goalDifference || 0)
        }
        return (b.goalsFor || 0) - (a.goalsFor || 0)
      case "basketball":
      case "kabaddi":
        return (b.pointsDifference || 0) - (a.pointsDifference || 0)
      default:
        return (b.wins || 0) - (a.wins || 0)
    }
  })
}
