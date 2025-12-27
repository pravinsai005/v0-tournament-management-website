"use client"

import { useTournament } from "@/contexts/tournament-context"
import { getTranslation } from "@/lib/translations"
import { calculatePointsTable } from "@/lib/points-calculator"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Trophy, Medal, Award } from "lucide-react"

export function PointsTableView() {
  const { sport, teams, matches, language } = useTournament()

  const t = (key: string) => getTranslation(language, key as any)

  if (!sport) return null

  const pointsTable = calculatePointsTable(sport, teams, matches)

  const getPositionIcon = (index: number) => {
    if (index === 0) return <Trophy className="w-5 h-5 text-accent" />
    if (index === 1) return <Medal className="w-5 h-5 text-muted-foreground" />
    if (index === 2) return <Award className="w-5 h-5 text-muted-foreground" />
    return null
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Trophy className="w-5 h-5" />
          {t("pointsTable")}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-12">#</TableHead>
                <TableHead>{t("team")}</TableHead>
                <TableHead className="text-center">{t("played")}</TableHead>
                <TableHead className="text-center">{t("won")}</TableHead>
                <TableHead className="text-center">{t("lost")}</TableHead>
                {(sport === "cricket" || sport === "football") && (
                  <TableHead className="text-center">{t("drawn")}</TableHead>
                )}
                <TableHead className="text-center font-semibold">{t("points")}</TableHead>

                {/* Sport-specific columns */}
                {sport === "cricket" && <TableHead className="text-center">{t("nrr")}</TableHead>}
                {sport === "football" && (
                  <>
                    <TableHead className="text-center">{t("gd")}</TableHead>
                    <TableHead className="text-center">{t("gf")}</TableHead>
                    <TableHead className="text-center">{t("ga")}</TableHead>
                  </>
                )}
                {(sport === "basketball" || sport === "kabaddi") && (
                  <>
                    <TableHead className="text-center">{t("pf")}</TableHead>
                    <TableHead className="text-center">{t("pa")}</TableHead>
                    <TableHead className="text-center">{t("pd")}</TableHead>
                  </>
                )}
              </TableRow>
            </TableHeader>
            <TableBody>
              {pointsTable.map((entry, index) => (
                <TableRow key={entry.teamId} className={index < 3 ? "bg-accent/5" : ""}>
                  <TableCell className="font-medium">
                    <div className="flex items-center gap-2">
                      {getPositionIcon(index)}
                      {index + 1}
                    </div>
                  </TableCell>
                  <TableCell className="font-semibold">{entry.teamName}</TableCell>
                  <TableCell className="text-center">{entry.matchesPlayed}</TableCell>
                  <TableCell className="text-center text-green-600 dark:text-green-400">{entry.wins}</TableCell>
                  <TableCell className="text-center text-red-600 dark:text-red-400">{entry.losses}</TableCell>
                  {(sport === "cricket" || sport === "football") && (
                    <TableCell className="text-center text-muted-foreground">{entry.draws}</TableCell>
                  )}
                  <TableCell className="text-center font-bold text-primary text-lg">{entry.points}</TableCell>

                  {/* Sport-specific data */}
                  {sport === "cricket" && (
                    <TableCell className="text-center">
                      {entry.nrr && entry.nrr > 0 ? "+" : ""}
                      {entry.nrr?.toFixed(3) || "0.000"}
                    </TableCell>
                  )}
                  {sport === "football" && (
                    <>
                      <TableCell className="text-center">
                        {entry.goalDifference && entry.goalDifference > 0 ? "+" : ""}
                        {entry.goalDifference || 0}
                      </TableCell>
                      <TableCell className="text-center">{entry.goalsFor || 0}</TableCell>
                      <TableCell className="text-center">{entry.goalsAgainst || 0}</TableCell>
                    </>
                  )}
                  {(sport === "basketball" || sport === "kabaddi") && (
                    <>
                      <TableCell className="text-center">{entry.pointsFor || 0}</TableCell>
                      <TableCell className="text-center">{entry.pointsAgainst || 0}</TableCell>
                      <TableCell className="text-center">
                        {entry.pointsDifference && entry.pointsDifference > 0 ? "+" : ""}
                        {entry.pointsDifference || 0}
                      </TableCell>
                    </>
                  )}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  )
}
