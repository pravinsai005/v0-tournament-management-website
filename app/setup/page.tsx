"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useTournament } from "@/contexts/tournament-context"
import { getTranslation } from "@/lib/translations"
import type { TournamentType } from "@/lib/types"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft, Play } from "lucide-react"
import { nanoid } from "nanoid"

export default function SetupPage() {
  const router = useRouter()
  const {
    sport,
    language,
    teams,
    tournamentType,
    setTournamentType,
    addTeam,
    updateTeam,
    removeTeam,
    generateMatches,
  } = useTournament()

  const [numberOfTeams, setNumberOfTeams] = useState<number>(4)
  const [teamNames, setTeamNames] = useState<string[]>(["Team 1", "Team 2", "Team 3", "Team 4"])

  const t = (key: string) => getTranslation(language, key as any)

  useEffect(() => {
    if (!sport) {
      router.push("/")
    }
  }, [sport, router])

  useEffect(() => {
    // Update team names array when numberOfTeams changes
    const newNames = Array.from({ length: numberOfTeams }, (_, i) => teamNames[i] || `${t("teamName")} ${i + 1}`)
    setTeamNames(newNames)
  }, [numberOfTeams])

  const handleGenerateFixtures = () => {
    // Clear existing teams and add new ones
    const newTeams = teamNames.map((name, index) => ({
      id: nanoid(),
      name: name || `Team ${index + 1}`,
    }))

    newTeams.forEach((team) => addTeam(team))
    generateMatches()
    router.push("/dashboard")
  }

  const getSportClassName = () => {
    if (!sport) return ""
    return `sport-${sport}`
  }

  if (!sport) return null

  return (
    <div
      className={`min-h-screen bg-gradient-to-br from-background via-secondary/20 to-accent/10 ${getSportClassName()}`}
    >
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Button variant="outline" size="icon" onClick={() => router.push("/")}>
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <div>
            <h1 className="text-3xl font-display font-bold text-balance">{t("teamSetup")}</h1>
            <p className="text-sm text-muted-foreground capitalize">
              {t(sport)} {t("tournamentManager")}
            </p>
          </div>
        </div>

        <div className="grid gap-6">
          {/* Tournament Type Selection */}
          <Card>
            <CardHeader>
              <CardTitle>{t("tournamentType")}</CardTitle>
            </CardHeader>
            <CardContent>
              <Select value={tournamentType} onValueChange={(value) => setTournamentType(value as TournamentType)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="round-robin">{t("roundRobin")}</SelectItem>
                  <SelectItem value="league">{t("league")}</SelectItem>
                  <SelectItem value="knockout">{t("knockout")}</SelectItem>
                </SelectContent>
              </Select>
            </CardContent>
          </Card>

          {/* Number of Teams */}
          <Card>
            <CardHeader>
              <CardTitle>{t("numberOfTeams")}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex gap-2">
                  <Input
                    type="number"
                    min={2}
                    max={20}
                    value={numberOfTeams}
                    onChange={(e) => setNumberOfTeams(Math.max(2, Math.min(20, Number.parseInt(e.target.value) || 2)))}
                    className="max-w-32"
                  />
                  <span className="flex items-center text-muted-foreground">{t("numberOfTeams")}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Team Names */}
          <Card>
            <CardHeader>
              <CardTitle>{t("editTeams")}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {teamNames.map((name, index) => (
                  <div key={index} className="flex gap-2 items-center">
                    <Label className="min-w-20 text-muted-foreground">
                      {t("team")} {index + 1}
                    </Label>
                    <Input
                      value={name}
                      onChange={(e) => {
                        const newNames = [...teamNames]
                        newNames[index] = e.target.value
                        setTeamNames(newNames)
                      }}
                      placeholder={`${t("teamName")} ${index + 1}`}
                    />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Generate Button */}
          <div className="flex justify-end">
            <Button size="lg" onClick={handleGenerateFixtures} className="min-w-48 gap-2">
              <Play className="w-4 h-4" />
              {t("generateFixtures")}
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
