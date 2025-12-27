"use client"

import { useState, useEffect } from "react"
import { useTournament } from "@/contexts/tournament-context"
import { getTranslation } from "@/lib/translations"
import type { Match } from "@/lib/types"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"

interface UpdateResultDialogProps {
  match: Match
  onClose: () => void
}

export function UpdateResultDialog({ match, onClose }: UpdateResultDialogProps) {
  const { teams, language, updateMatchResult, sport } = useTournament()
  const [team1Score, setTeam1Score] = useState(match.team1Score?.toString() || "")
  const [team2Score, setTeam2Score] = useState(match.team2Score?.toString() || "")
  const [winner, setWinner] = useState<string>(match.winnerId || "")

  const t = (key: string) => getTranslation(language, key as any)

  const team1 = teams.find((t) => t.id === match.team1Id)
  const team2 = teams.find((t) => t.id === match.team2Id)

  useEffect(() => {
    // Auto-determine winner based on scores
    const score1 = Number.parseInt(team1Score) || 0
    const score2 = Number.parseInt(team2Score) || 0

    if (score1 > score2) {
      setWinner(match.team1Id)
    } else if (score2 > score1) {
      setWinner(match.team2Id)
    } else if (team1Score && team2Score) {
      setWinner("draw")
    }
  }, [team1Score, team2Score, match.team1Id, match.team2Id])

  const handleSave = () => {
    const score1 = Number.parseInt(team1Score) || 0
    const score2 = Number.parseInt(team2Score) || 0

    updateMatchResult(match.id, score1, score2, winner === "draw" ? undefined : winner, winner === "draw")

    onClose()
  }

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{t("updateMatchResult")}</DialogTitle>
          <DialogDescription>
            {team1?.name} {t("vs")} {team2?.name}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Scores */}
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <Label className="min-w-24">{team1?.name}</Label>
              <Input
                type="number"
                min={0}
                value={team1Score}
                onChange={(e) => setTeam1Score(e.target.value)}
                placeholder="0"
              />
            </div>

            <div className="flex items-center gap-4">
              <Label className="min-w-24">{team2?.name}</Label>
              <Input
                type="number"
                min={0}
                value={team2Score}
                onChange={(e) => setTeam2Score(e.target.value)}
                placeholder="0"
              />
            </div>
          </div>

          {/* Winner Selection */}
          <div className="space-y-3">
            <Label>{t("winner")}</Label>
            <RadioGroup value={winner} onValueChange={setWinner}>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value={match.team1Id} id="team1" />
                <Label htmlFor="team1" className="cursor-pointer">
                  {team1?.name}
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value={match.team2Id} id="team2" />
                <Label htmlFor="team2" className="cursor-pointer">
                  {team2?.name}
                </Label>
              </div>
              {(sport === "cricket" || sport === "football") && (
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="draw" id="draw" />
                  <Label htmlFor="draw" className="cursor-pointer">
                    {t("draw")}
                  </Label>
                </div>
              )}
            </RadioGroup>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            {t("cancel")}
          </Button>
          <Button onClick={handleSave} disabled={!team1Score || !team2Score || !winner}>
            {t("save")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
