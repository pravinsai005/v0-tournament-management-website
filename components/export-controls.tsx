"use client"

import { useState } from "react"
import { useTournament } from "@/contexts/tournament-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Download, FileText, Table } from "lucide-react"

export function ExportControls() {
  const { sport, teams, matches } = useTournament()
  const [isExporting, setIsExporting] = useState(false)

  const exportAsJSON = (type: "fixtures" | "results" | "full") => {
    setIsExporting(true)

    let data: any = {}
    let filename = ""

    switch (type) {
      case "fixtures":
        data = {
          sport,
          teams,
          fixtures: matches,
        }
        filename = `${sport}-fixtures.json`
        break
      case "results":
        data = {
          sport,
          teams,
          results: matches.filter((m) => m.status === "completed"),
        }
        filename = `${sport}-results.json`
        break
      case "full":
        data = {
          sport,
          teams,
          matches,
          exportDate: new Date().toISOString(),
        }
        filename = `${sport}-tournament-full.json`
        break
    }

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.href = url
    link.download = filename
    link.click()
    URL.revokeObjectURL(url)

    setTimeout(() => setIsExporting(false), 500)
  }

  if (teams.length === 0 || matches.length === 0) return null

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Download className="w-5 h-5" />
          Export Tournament Data
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <Button
          onClick={() => exportAsJSON("fixtures")}
          disabled={isExporting}
          variant="outline"
          className="w-full justify-start"
        >
          <FileText className="w-4 h-4 mr-2" />
          Export Fixtures (JSON)
        </Button>
        <Button
          onClick={() => exportAsJSON("results")}
          disabled={isExporting}
          variant="outline"
          className="w-full justify-start"
        >
          <Table className="w-4 h-4 mr-2" />
          Export Results (JSON)
        </Button>
        <Button
          onClick={() => exportAsJSON("full")}
          disabled={isExporting}
          variant="outline"
          className="w-full justify-start"
        >
          <Download className="w-4 h-4 mr-2" />
          Export Full Tournament (JSON)
        </Button>
      </CardContent>
    </Card>
  )
}
