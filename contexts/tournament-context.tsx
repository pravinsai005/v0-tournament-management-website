"use client"

import type React from "react"
import { createContext, useContext, useState, useCallback } from "react"
import type { TournamentState, Sport, Language, Team, Match, TournamentType } from "@/lib/types"

interface TournamentContextType extends TournamentState {
  setSport: (sport: Sport) => void
  setLanguage: (language: Language) => void
  setTournamentType: (type: TournamentType) => void
  addTeam: (team: Team) => void
  updateTeam: (id: string, name: string) => void
  removeTeam: (id: string) => void
  setTeams: (teams: Team[]) => void
  generateMatches: () => void
  updateMatchResult: (
    matchId: string,
    team1Score: number,
    team2Score: number,
    winnerId?: string,
    isDraw?: boolean,
  ) => void
  resetTournament: () => void
}

const TournamentContext = createContext<TournamentContextType | undefined>(undefined)

const initialState: TournamentState = {
  sport: null,
  tournamentType: "round-robin",
  teams: [],
  matches: [],
  currentRound: 1,
  language: "en",
}

export function TournamentProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<TournamentState>(initialState)

  const setSport = useCallback((sport: Sport) => {
    setState((prev) => ({ ...prev, sport }))
  }, [])

  const setLanguage = useCallback((language: Language) => {
    setState((prev) => ({ ...prev, language }))
  }, [])

  const setTournamentType = useCallback((tournamentType: TournamentType) => {
    setState((prev) => ({ ...prev, tournamentType }))
  }, [])

  const addTeam = useCallback((team: Team) => {
    setState((prev) => ({ ...prev, teams: [...prev.teams, team] }))
  }, [])

  const updateTeam = useCallback((id: string, name: string) => {
    setState((prev) => ({
      ...prev,
      teams: prev.teams.map((team) => (team.id === id ? { ...team, name } : team)),
    }))
  }, [])

  const removeTeam = useCallback((id: string) => {
    setState((prev) => ({
      ...prev,
      teams: prev.teams.filter((team) => team.id !== id),
    }))
  }, [])

  const setTeams = useCallback((teams: Team[]) => {
    setState((prev) => ({ ...prev, teams }))
  }, [])

  const generateMatches = useCallback(() => {
    setState((prev) => {
      const { teams, tournamentType } = prev

      if (teams.length < 2) return prev

      const matches: Match[] = []

      if (tournamentType === "round-robin" || tournamentType === "league") {
        // Generate round-robin fixtures
        const round = 1
        let matchId = 1

        for (let i = 0; i < teams.length; i++) {
          for (let j = i + 1; j < teams.length; j++) {
            matches.push({
              id: `match-${matchId++}`,
              round,
              team1Id: teams[i].id,
              team2Id: teams[j].id,
              status: "pending",
            })
          }
        }
      } else if (tournamentType === "knockout") {
        // Generate knockout fixtures (first round only)
        let matchId = 1
        for (let i = 0; i < teams.length; i += 2) {
          if (i + 1 < teams.length) {
            matches.push({
              id: `match-${matchId++}`,
              round: 1,
              team1Id: teams[i].id,
              team2Id: teams[i + 1].id,
              status: "pending",
            })
          }
        }
      }

      return { ...prev, matches }
    })
  }, [])

  const updateMatchResult = useCallback(
    (matchId: string, team1Score: number, team2Score: number, winnerId?: string, isDraw?: boolean) => {
      setState((prev) => ({
        ...prev,
        matches: prev.matches.map((match) =>
          match.id === matchId
            ? {
                ...match,
                team1Score,
                team2Score,
                winnerId,
                isDraw,
                status: "completed" as const,
              }
            : match,
        ),
      }))
    },
    [],
  )

  const resetTournament = useCallback(() => {
    setState(initialState)
  }, [])

  return (
    <TournamentContext.Provider
      value={{
        ...state,
        setSport,
        setLanguage,
        setTournamentType,
        addTeam,
        updateTeam,
        removeTeam,
        setTeams,
        generateMatches,
        updateMatchResult,
        resetTournament,
      }}
    >
      {children}
    </TournamentContext.Provider>
  )
}

export function useTournament() {
  const context = useContext(TournamentContext)
  if (!context) {
    throw new Error("useTournament must be used within a TournamentProvider")
  }
  return context
}
