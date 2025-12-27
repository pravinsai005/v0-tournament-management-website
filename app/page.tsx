"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useTournament } from "@/contexts/tournament-context"
import type { Sport, Language } from "@/lib/types"
import { getTranslation } from "@/lib/translations"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Trophy, Globe } from "lucide-react"

const sports: { id: Sport; icon: string }[] = [
  { id: "cricket", icon: "🏏" },
  { id: "football", icon: "⚽" },
  { id: "kabaddi", icon: "🤼" },
  { id: "basketball", icon: "🏀" },
  { id: "badminton", icon: "🏸" },
]

const languages: { id: Language; label: string }[] = [
  { id: "en", label: "English" },
  { id: "ta", label: "தமிழ்" },
  { id: "hi", label: "हिंदी" },
]

export default function HomePage() {
  const router = useRouter()
  const { language, setLanguage, setSport } = useTournament()
  const [selectedSport, setSelectedSport] = useState<Sport | null>(null)

  const t = (key: string) => getTranslation(language, key as any)

  const handleGetStarted = () => {
    if (selectedSport) {
      setSport(selectedSport)
      router.push("/setup")
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-secondary/20 to-accent/10">
      <div className="container mx-auto px-4 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Trophy className="w-12 h-12 text-primary" />
            <h1 className="text-5xl font-display font-bold text-balance bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              {t("tournamentManager")}
            </h1>
          </div>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto text-balance">
            Create and manage multi-sport tournaments with automatic fixture generation and live points tables
          </p>
        </div>

        {/* Language Selector */}
        <div className="flex items-center justify-center gap-2 mb-8">
          <Globe className="w-5 h-5 text-muted-foreground" />
          <div className="flex gap-2">
            {languages.map((lang) => (
              <Button
                key={lang.id}
                variant={language === lang.id ? "default" : "outline"}
                size="sm"
                onClick={() => setLanguage(lang.id)}
                className="min-w-24"
              >
                {lang.label}
              </Button>
            ))}
          </div>
        </div>

        {/* Sport Selection */}
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-display font-semibold text-center mb-6">{t("selectSport")}</h2>

          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
            {sports.map((sport) => (
              <Card
                key={sport.id}
                className={`cursor-pointer transition-all hover:scale-105 ${
                  selectedSport === sport.id ? "ring-2 ring-primary shadow-lg shadow-primary/20" : "hover:shadow-md"
                }`}
                onClick={() => setSelectedSport(sport.id)}
              >
                <CardContent className="flex flex-col items-center justify-center p-6 gap-3">
                  <div className="text-5xl">{sport.icon}</div>
                  <p className="font-semibold capitalize text-center">{t(sport.id)}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Get Started Button */}
          <div className="flex justify-center">
            <Button
              size="lg"
              onClick={handleGetStarted}
              disabled={!selectedSport}
              className="min-w-48 text-lg font-semibold"
            >
              {t("getStarted")}
            </Button>
          </div>
        </div>

        {/* Features */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto mt-16">
          <Card className="bg-card/50 backdrop-blur">
            <CardContent className="p-6">
              <div className="text-3xl mb-3">📊</div>
              <h3 className="font-semibold text-lg mb-2">Automatic Fixtures</h3>
              <p className="text-sm text-muted-foreground">
                Generate match schedules automatically based on tournament type
              </p>
            </CardContent>
          </Card>

          <Card className="bg-card/50 backdrop-blur">
            <CardContent className="p-6">
              <div className="text-3xl mb-3">🏆</div>
              <h3 className="font-semibold text-lg mb-2">Live Points Table</h3>
              <p className="text-sm text-muted-foreground">Real-time standings with sport-specific calculations</p>
            </CardContent>
          </Card>

          <Card className="bg-card/50 backdrop-blur">
            <CardContent className="p-6">
              <div className="text-3xl mb-3">🌍</div>
              <h3 className="font-semibold text-lg mb-2">Multilingual</h3>
              <p className="text-sm text-muted-foreground">Support for English, Tamil, and Hindi languages</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
