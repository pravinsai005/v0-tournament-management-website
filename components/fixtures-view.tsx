"use client"

import { useState } from "react"
import { useTournament } from "@/contexts/tournament-context"
import { getTranslation } from "@/lib/translations"
import type { Match } from "@/lib/types"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Edit, Trophy } from "lucide-react"
import { UpdateResultDialog } from "./update-result-dialog"

export function FixturesView() {
  const { matches, teams, language } = useTournament()
  const [selectedMatch, setSelectedMatch] = useState<Match | null>(null)

  const t = (key: string) => getTranslation(language, key as any)

  const getTeamName = (teamId: string) => {
    const team = teams.find((t) => t.id === teamId)
    return team?.name || "Unknown Team"
  }

  // Group matches by round
  const matchesByRound = matches.reduce(
    (acc, match) => {
      if (!acc[match.round]) {
        acc[match.round] = []
      }
      acc[match.round].push(match)
      return acc
    },
    {} as Record<number, Match[]>,
  )

  const rounds = Object.keys(matchesByRound)
    .map(Number)
    .sort((a, b) => a - b)

  if (matches.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-12">
          <Trophy className="w-12 h-12 text-muted-foreground mb-4" />
          <p className="text-muted-foreground">No fixtures generated yet</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <>
      <div className="space-y-6">
        {rounds.map((round) => (
          <Card key={round}>
            <CardHeader>
              <CardTitle>
                {t("round")} {round}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {matchesByRound[round].map((match) => (
                  <div
                    key={match.id}
                    className="flex items-center justify-between p-4 rounded-lg border bg-card hover:bg-accent/5 transition-colors"
                  >
                    <div className="flex items-center gap-4 flex-1">
                      <div className="flex-1 text-right">
                        <p className="font-semibold">{getTeamName(match.team1Id)}</p>
                        {match.status === "completed" && match.team1Score !== undefined && (
                          <p className="text-2xl font-bold text-primary">{match.team1Score}</p>
                        )}
                      </div>

                      <div className="flex flex-col items-center gap-1 min-w-16">
                        <span className="text-sm font-semibold text-muted-foreground">{t("vs")}</span>
                        {match.status === "completed" && match.winnerId && <Trophy className="w-4 h-4 text-accent" />}
                      </div>

                      <div className="flex-1">
                        <p className="font-semibold">{getTeamName(match.team2Id)}</p>
                        {match.status === "completed" && match.team2Score !== undefined && (
                          <p className="text-2xl font-bold text-primary">{match.team2Score}</p>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      {match.status === "completed" ? (
                        <>
                          <Badge variant="secondary">{t("completed")}</Badge>
                          <Button variant="outline" size="sm" onClick={() => setSelectedMatch(match)}>
                            <Edit className="w-4 h-4" />
                          </Button>
                        </>
                      ) : (
                        <>
                          <Badge variant="outline">{t("pending")}</Badge>
                          <Button size="sm" onClick={() => setSelectedMatch(match)}>
                            {t("updateResult")}
                          </Button>
                        </>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {selectedMatch && <UpdateResultDialog match={selectedMatch} onClose={() => setSelectedMatch(null)} />}
    </>
  )
}
