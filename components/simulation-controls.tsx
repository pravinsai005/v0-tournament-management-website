"use client"

import { useState } from "react"
import { useTournament } from "@/contexts/tournament-context"
import { getTranslation } from "@/lib/translations"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Zap, AlertCircle } from "lucide-react"
import { simulateAllMatches } from "@/lib/simulation"

export function SimulationControls() {
  const { sport, matches, language, updateMatchResult } = useTournament()
  const [isSimulating, setIsSimulating] = useState(false)
  const t = (key: string) => getTranslation(language, key as any)

  const pendingMatches = matches.filter((m) => m.status === "pending")

  const handleSimulate = () => {
    if (!sport) return

    setIsSimulating(true)

    // Simulate all pending matches with a delay for visual effect
    let delay = 0
    const simulatedMatches = simulateAllMatches(pendingMatches, sport)

    simulatedMatches.forEach((match) => {
      setTimeout(() => {
        updateMatchResult(match.id, match.team1Score!, match.team2Score!, match.winnerId, match.isDraw)
      }, delay)
      delay += 100 // 100ms delay between each match
    })

    setTimeout(() => {
      setIsSimulating(false)
    }, delay + 500)
  }

  if (pendingMatches.length === 0) return null

  return (
    <Card className="bg-gradient-to-br from-purple-500/10 to-purple-500/5 border-purple-500/20">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Zap className="w-5 h-5 text-purple-500" />
          Simulation Mode
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-start gap-2 text-sm text-muted-foreground">
          <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
          <p>
            Automatically generate results for all {pendingMatches.length} pending matches with realistic scores based
            on the selected sport.
          </p>
        </div>
        <Button onClick={handleSimulate} disabled={isSimulating} className="w-full bg-purple-500 hover:bg-purple-600">
          <Zap className="w-4 h-4 mr-2" />
          {isSimulating ? "Simulating..." : `Simulate ${pendingMatches.length} Matches`}
        </Button>
      </CardContent>
    </Card>
  )
}
