"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useTournament } from "@/contexts/tournament-context"
import { getTranslation } from "@/lib/translations"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { FixturesView } from "@/components/fixtures-view"
import { PointsTableView } from "@/components/points-table-view"
import { TournamentSummary } from "@/components/tournament-summary"
import { SimulationControls } from "@/components/simulation-controls"
import { ExportControls } from "@/components/export-controls"
import { Home, Globe, RotateCcw, Trophy, Calendar, BarChart3, TrendingUp } from "lucide-react"

const languages: { id: "en" | "ta" | "hi"; label: string }[] = [
  { id: "en", label: "English" },
  { id: "ta", label: "தமிழ்" },
  { id: "hi", label: "हिंदी" },
]

export default function DashboardPage() {
  const router = useRouter()
  const { sport, teams, matches, language, setLanguage, resetTournament, tournamentType } = useTournament()
  const [activeTab, setActiveTab] = useState("overview")

  const t = (key: string) => getTranslation(language, key as any)

  useEffect(() => {
    if (!sport || teams.length === 0) {
      router.push("/")
    }
  }, [sport, teams, router])

  const completedMatches = matches.filter((m) => m.status === "completed").length
  const pendingMatches = matches.filter((m) => m.status === "pending").length

  const handleReset = () => {
    if (confirm("Are you sure you want to reset the tournament? All data will be lost.")) {
      resetTournament()
      router.push("/")
    }
  }

  const getSportClassName = () => {
    if (!sport) return ""
    return `sport-${sport}`
  }

  if (!sport || teams.length === 0) return null

  return (
    <div
      className={`min-h-screen bg-gradient-to-br from-background via-secondary/20 to-accent/10 ${getSportClassName()}`}
    >
      <div className="container mx-auto px-4 py-6">
        {/* Header */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-4">
            <Button variant="outline" size="icon" onClick={() => router.push("/")}>
              <Home className="w-4 h-4" />
            </Button>
            <div>
              <h1 className="text-3xl font-display font-bold text-balance capitalize">
                {t(sport)} {t("tournamentManager")}
              </h1>
              <p className="text-sm text-muted-foreground">
                {teams.length} {t("numberOfTeams")} • {t(tournamentType as any)}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Language Selector */}
            <div className="flex items-center gap-2 mr-2">
              <Globe className="w-4 h-4 text-muted-foreground" />
              <div className="flex gap-1">
                {languages.map((lang) => (
                  <Button
                    key={lang.id}
                    variant={language === lang.id ? "default" : "ghost"}
                    size="sm"
                    onClick={() => setLanguage(lang.id)}
                    className="px-3"
                  >
                    {lang.label}
                  </Button>
                ))}
              </div>
            </div>

            <Button variant="outline" onClick={handleReset}>
              <RotateCcw className="w-4 h-4 mr-2" />
              Reset
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <Card className="bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">{t("totalMatches")}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <p className="text-3xl font-bold text-primary">{matches.length}</p>
                <Calendar className="w-8 h-8 text-primary/50" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-accent/10 to-accent/5 border-accent/20">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">{t("completedMatches")}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <p className="text-3xl font-bold text-accent">{completedMatches}</p>
                <Trophy className="w-8 h-8 text-accent/50" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-muted to-muted/50">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">{t("pendingMatches")}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <p className="text-3xl font-bold">{pendingMatches}</p>
                <BarChart3 className="w-8 h-8 text-muted-foreground/50" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList className="grid w-full max-w-2xl grid-cols-3">
            <TabsTrigger value="overview" className="gap-2">
              <Calendar className="w-4 h-4" />
              {t("fixtures")}
            </TabsTrigger>
            <TabsTrigger value="table" className="gap-2">
              <Trophy className="w-4 h-4" />
              {t("pointsTable")}
            </TabsTrigger>
            <TabsTrigger value="summary" className="gap-2">
              <TrendingUp className="w-4 h-4" />
              Summary
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            <SimulationControls />
            <FixturesView />
          </TabsContent>

          <TabsContent value="table" className="space-y-4">
            <PointsTableView />
          </TabsContent>

          <TabsContent value="summary" className="space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              <div className="lg:col-span-2">
                <TournamentSummary />
              </div>
              <div>
                <ExportControls />
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
