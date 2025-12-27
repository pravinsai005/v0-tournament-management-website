"use client"

import { useTournament } from "@/contexts/tournament-context"
import { getTranslation } from "@/lib/translations"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Trophy, Target, Award } from "lucide-react"

export function TournamentSummary() {
  const { sport, teams, matches, language } = useTournament()
  const t = (key: string) => getTranslation(language, key as any)

  if (!sport || teams.length === 0 || matches.length === 0) return null

  const completedMatches = matches.filter((m) => m.status === "completed")
  const totalGoals = completedMatches.reduce((sum, m) => sum + (m.team1Score || 0) + (m.team2Score || 0), 0)

  // Calculate team performance stats
  const teamStats = teams.map((team) => {
    const teamMatches = completedMatches.filter((m) => m.team1Id === team.id || m.team2Id === team.id)
    const wins = teamMatches.filter((m) => m.winnerId === team.id).length
    const losses = teamMatches.filter((m) => m.winnerId && m.winnerId !== team.id && !m.isDraw).length
    const draws = teamMatches.filter((m) => m.isDraw).length

    let totalScored = 0
    let totalConceded = 0

    teamMatches.forEach((match) => {
      if (match.team1Id === team.id) {
        totalScored += match.team1Score || 0
        totalConceded += match.team2Score || 0
      } else {
        totalScored += match.team2Score || 0
        totalConceded += match.team1Score || 0
      }
    })

    return {
      ...team,
      played: teamMatches.length,
      wins,
      losses,
      draws,
      winRate: teamMatches.length > 0 ? (wins / teamMatches.length) * 100 : 0,
      totalScored,
      totalConceded,
    }
  })

  const topScorer = teamStats.reduce((prev, current) => (current.totalScored > prev.totalScored ? current : prev))

  const bestDefense = teamStats.reduce((prev, current) => (current.totalConceded < prev.totalConceded ? current : prev))

  const bestWinRate = teamStats.reduce((prev, current) => (current.winRate > prev.winRate ? current : prev))

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-display font-bold mb-4">{t("tournamentSummary")}</h2>

      {/* Overall Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Matches Completed</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">
              {completedMatches.length} / {matches.length}
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              {Math.round((completedMatches.length / matches.length) * 100)}% Complete
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total {sport === "football" ? "Goals" : "Points"} Scored
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{totalGoals}</p>
            <p className="text-xs text-muted-foreground mt-1">
              {completedMatches.length > 0 ? (totalGoals / completedMatches.length).toFixed(1) : 0} per match
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Average Match Score</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">
              {completedMatches.length > 0 ? (totalGoals / (completedMatches.length * 2)).toFixed(1) : 0}
            </p>
            <p className="text-xs text-muted-foreground mt-1">Per team per match</p>
          </CardContent>
        </Card>
      </div>

      {/* Team Achievements */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
        <Card className="bg-gradient-to-br from-yellow-500/10 to-yellow-500/5 border-yellow-500/20">
          <CardHeader className="pb-3 flex flex-row items-center justify-between">
            <CardTitle className="text-sm font-medium">Best Win Rate</CardTitle>
            <Trophy className="w-5 h-5 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <p className="font-bold text-lg">{bestWinRate.name}</p>
            <p className="text-sm text-muted-foreground">{bestWinRate.winRate.toFixed(1)}% win rate</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-500/10 to-green-500/5 border-green-500/20">
          <CardHeader className="pb-3 flex flex-row items-center justify-between">
            <CardTitle className="text-sm font-medium">Top Scorer</CardTitle>
            <Target className="w-5 h-5 text-green-500" />
          </CardHeader>
          <CardContent>
            <p className="font-bold text-lg">{topScorer.name}</p>
            <p className="text-sm text-muted-foreground">
              {topScorer.totalScored} {sport === "football" ? "goals" : "points"} scored
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-blue-500/10 to-blue-500/5 border-blue-500/20">
          <CardHeader className="pb-3 flex flex-row items-center justify-between">
            <CardTitle className="text-sm font-medium">Best Defense</CardTitle>
            <Award className="w-5 h-5 text-blue-500" />
          </CardHeader>
          <CardContent>
            <p className="font-bold text-lg">{bestDefense.name}</p>
            <p className="text-sm text-muted-foreground">
              {bestDefense.totalConceded} {sport === "football" ? "goals" : "points"} conceded
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Team Performance */}
      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Team Performance Breakdown</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {teamStats
              .sort((a, b) => b.winRate - a.winRate)
              .map((team) => (
                <div key={team.id} className="flex items-center justify-between p-3 rounded-lg bg-secondary/30">
                  <div className="flex-1">
                    <p className="font-semibold">{team.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {team.wins}W - {team.draws}D - {team.losses}L
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-primary">{team.winRate.toFixed(1)}%</p>
                    <p className="text-xs text-muted-foreground">Win Rate</p>
                  </div>
                  <div className="text-right ml-6">
                    <p className="font-semibold">
                      {team.totalScored} - {team.totalConceded}
                    </p>
                    <p className="text-xs text-muted-foreground">Scored - Conceded</p>
                  </div>
                </div>
              ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
