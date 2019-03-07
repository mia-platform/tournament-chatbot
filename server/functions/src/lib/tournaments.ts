import combinations from './combinations'
import axios from './axios';

export interface Team {
  name: string
}

export enum TournamentType {
  SINGLE_ROUND = "SINGLE_ROUND",
  SINGLE_ROUND_AR = "SINGLE_ROUND_AR"
}

export enum MatchWinner {
  DRAW = 0,
  TEAM_1 = 1,
  TEAM_2 = 2
}

enum MatchType {
  ROUND = "ROUND",
  SEMI_FINAL = "SEMI_FINAL",
  FINAL = "FINAL"
}

export interface MatchResult {
  scoreTeam1: number
  scoreTeam2: number
  winner: MatchWinner
}

export interface Match {
  id: string
  team1: string
  team2: string
  isPlayed: boolean
  result?: MatchResult
}

interface RankingItem {
  teamName: string
  points: number
  scoreDifference: number
  scoreFor: number
  scoreAgainst: number
  playedMatchesCount: number
}

interface Round {
  matches: Match[]
  ranking: RankingItem[]
  isCompleted: boolean
}

export interface SemiFinalMatches {
  isCompleted: boolean
  matches: [Match, Match]
}

export interface FinalMatch {
  isCompleted: boolean
  match: Match
}

interface RemainingMatchToPlay {
  type: MatchType
  matches: Match[]
  ranking?: RankingItem[]
}

export interface SingleRoundTournament {
  round: Round
  teams: Team[]
  semiFinalMatches?: SemiFinalMatches
  finalMatch?: FinalMatch
  isCompleted: boolean
}

function createSingleRoundTournament (idGenerator: () => string, teams: Team[]): SingleRoundTournament {
  const teamsNames: string[] = teams.map(team => team.name)
  const matches: Match[] = combinations(teamsNames, 2, 2).map(([team1, team2]) => {
    return {
      id: idGenerator(),
      team1,
      team2,
      isPlayed: false
    }
  })
  const rankingItems: RankingItem[] = teams.map((team: Team): RankingItem => {
    return {
      teamName: team.name,
      points: 0,
      scoreDifference: 0,
      scoreFor: 0,
      scoreAgainst: 0,
      playedMatchesCount: 0
    }
  })

  return {
    round: {
      matches,
      ranking: rankingItems,
      isCompleted: false,
    },
    teams,
    isCompleted: false
  }
}

function getWinner (scoreTeam1: number, scoreTeam2: number): MatchWinner {
  if (scoreTeam1 > scoreTeam2) return MatchWinner.TEAM_1
  if (scoreTeam1 < scoreTeam2) return MatchWinner.TEAM_2
  return MatchWinner.DRAW
}

interface TournamentClassInterface {
  idGenerator: () => string
  createByType: (type: TournamentType, teams: Team[]) => SingleRoundTournament
}
export default class TournamentClass implements TournamentClassInterface {
  idGenerator: () => string

  constructor (idGenerator: () => string) {
    this.idGenerator = idGenerator
  }

  createByType (type: TournamentType, teams: Team[]): SingleRoundTournament {
    switch (type) {
      case TournamentType.SINGLE_ROUND:
      default:
        return createSingleRoundTournament(this.idGenerator, teams)
    }
  }

  async getTournamentById (tournamentId: string): Promise<SingleRoundTournament> {
    const {data} = await axios.get(`/tournaments/${tournamentId}.json`)
    return data
  }

  async updateTournament (tournamentId: string, tournament: SingleRoundTournament): Promise<void> {
    await axios.put(`/tournaments/${tournamentId}.json`, tournament)
  }

  updateTournamentMatch (tournament: SingleRoundTournament, matchId: string, scoreTeam1: number, scoreTeam2: number): void {
    if (!tournament.round.isCompleted) {
      this.updateRoundMatchAndRanking(tournament, matchId, scoreTeam1, scoreTeam2)
      if (tournament.round.isCompleted) {
        this.createSemiFinals(tournament)
      }
      return
    }
    if (tournament.semiFinalMatches && !tournament.semiFinalMatches.isCompleted) {
      this.updateSemiFinalMatch(tournament, matchId, scoreTeam1, scoreTeam2)
      if (tournament.semiFinalMatches.isCompleted) {
        this.createFinals(tournament)
      }
      return
    }
    if (!tournament.isCompleted) {
      this.updateFinalMatch(tournament, matchId, scoreTeam1, scoreTeam2)
      return
    }
    throw new Error('Tournament is already completed')
  }

  createSemiFinals (tournament: SingleRoundTournament): void {
    tournament.semiFinalMatches = {
      isCompleted:false,
      matches: [
        {
          id: this.idGenerator(),
          isPlayed: false,
          team1: tournament.round.ranking[0].teamName,
          team2: tournament.round.ranking[3].teamName
        },
        {
          id: this.idGenerator(),
          isPlayed: false,
          team1: tournament.round.ranking[1].teamName,
          team2: tournament.round.ranking[2].teamName
        }
      ]
    }
  }

  updateSemiFinalMatch (tournament: SingleRoundTournament, matchId: string, scoreTeam1: number, scoreTeam2: number): void {
    const semiFinal = <SemiFinalMatches>tournament.semiFinalMatches
    updateMatchWithResult(semiFinal.matches, matchId, scoreTeam1, scoreTeam2)
    semiFinal.isCompleted = semiFinal.matches.every(match => match.isPlayed)
  }

  createFinals (tournament: SingleRoundTournament): void {
    const semiFinal = <SemiFinalMatches>tournament.semiFinalMatches
    const firstSemiFinalResult = <MatchResult>semiFinal.matches[0].result
    const secondSemiFinalResult = <MatchResult>semiFinal.matches[1].result
    tournament.finalMatch = {
      isCompleted: false,
      match: {
        id: this.idGenerator(),
        isPlayed: false,
        team1: firstSemiFinalResult.winner === MatchWinner.TEAM_1 ? semiFinal.matches[0].team1 : semiFinal.matches[0].team2,
        team2: secondSemiFinalResult.winner === MatchWinner.TEAM_1 ? semiFinal.matches[1].team1 : semiFinal.matches[1].team2,
      }
    }
  }

  updateFinalMatch (tournament: SingleRoundTournament, matchId: string, scoreTeam1: number, scoreTeam2: number): void {
    const finalMatch = <FinalMatch>tournament.finalMatch
    updateMatchWithResult([finalMatch.match], matchId, scoreTeam1, scoreTeam2)
    finalMatch.isCompleted = true
    tournament.isCompleted = true
  }

  updateRoundMatchAndRanking (tournament: SingleRoundTournament, matchId: string, scoreTeam1: number, scoreTeam2: number): void {
    const {matches} = tournament.round
    const winner = getWinner(scoreTeam1, scoreTeam2)
    const playedMatch = updateMatchWithResult(matches, matchId, scoreTeam1, scoreTeam2)

    const {team1, team2} = playedMatch
    const team1Ranking: RankingItem = <RankingItem>tournament.round.ranking.find(teamRanking => teamRanking.teamName === team1)
    const team2Ranking: RankingItem = <RankingItem>tournament.round.ranking.find(teamRanking => teamRanking.teamName === team2)
    if (winner === MatchWinner.DRAW) {
      team1Ranking.points += 1
      team2Ranking.points += 1
    } else if (winner === MatchWinner.TEAM_1) {
      team1Ranking.points += 3
    } else if (winner === MatchWinner.TEAM_2) {
      team2Ranking.points += 3
    }
    team1Ranking.scoreFor += scoreTeam1
    team1Ranking.scoreAgainst += scoreTeam2
    team1Ranking.scoreDifference = team1Ranking.scoreFor - team1Ranking.scoreAgainst
    team2Ranking.scoreFor += scoreTeam2
    team2Ranking.scoreAgainst += scoreTeam1
    team2Ranking.scoreDifference = team2Ranking.scoreFor - team2Ranking.scoreAgainst
    team1Ranking.playedMatchesCount += 1
    team2Ranking.playedMatchesCount += 1

    tournament.round.ranking.sort(rankingComparator(tournament))

    tournament.round.isCompleted = matches.every(match => match.isPlayed)
  }

  getRemainingMatchesToPlayByType (tournament: SingleRoundTournament): RemainingMatchToPlay {
    if (!tournament.round.isCompleted) {
      return {
        type: MatchType.ROUND,
        matches: tournament.round.matches.filter(match => !match.isPlayed),
        ranking: tournament.round.ranking
      }
    }
    const semiFinalMatches = <SemiFinalMatches>tournament.semiFinalMatches
    if (!semiFinalMatches.isCompleted) {
      return {
        type: MatchType.SEMI_FINAL,
        matches: semiFinalMatches.matches.filter(match => !match.isPlayed)
      }
    }
    const finalMatch = <FinalMatch>tournament.finalMatch
    if (!finalMatch.isCompleted) {
      return {
        type: MatchType.FINAL,
        matches: [finalMatch.match]
      }
    }
    throw new Error('There are not match to play!')
  }
}

export function rankingComparator (tournament: SingleRoundTournament): (r1: RankingItem, r2: RankingItem) => number {
  return (r1: RankingItem, r2: RankingItem) => {
    if (r1.points !== r2.points) return r2.points - r1.points
    const matchBetweenR1AndR2 = tournament.round.matches.find(match => (
      (match.team1 === r1.teamName && match.team2 === r2.teamName) ||
      (match.team1 === r2.teamName && match.team2 === r1.teamName)
    ) && !!match.result)
    if (matchBetweenR1AndR2 && matchBetweenR1AndR2.result) {
      const result = matchBetweenR1AndR2.result.winner
      if (result === MatchWinner.TEAM_1) {
        return matchBetweenR1AndR2.team1 === r1.teamName ? -1 : 1
      }
      if (result === MatchWinner.TEAM_2) {
        return matchBetweenR1AndR2.team1 === r2.teamName ? 1 : -1
      }
    }
    if (r1.scoreDifference !== r2.scoreDifference) return r2.scoreDifference - r1.scoreDifference
    if (r1.scoreFor !== r2.scoreFor) return r2.scoreFor - r1.scoreFor
    return 0
  }
}

function updateMatchWithResult (matches: Match[], matchId: string, scoreTeam1: number, scoreTeam2: number): Match {
  const winner = getWinner(scoreTeam1, scoreTeam2)
  const playedMatch = matches.find(match => match.id === matchId)
  if (!playedMatch) {
    throw new Error('Unknown match id')
  }
  if (playedMatch.isPlayed) {
    throw new Error('Match already played')
  }
  playedMatch.isPlayed = true
  playedMatch.result = {
    scoreTeam1,
    scoreTeam2,
    winner
  }
  return playedMatch
}
