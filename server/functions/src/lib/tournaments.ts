import combinations from './combinations'

export interface Team {
  name: string
}

export enum TournamentType {
  SINGLE_ROUND = "SINGLE_ROUND",
  SINGLE_ROUND_AR = "SINGLE_ROUND_AR"
}

interface MatchResult {
  scoreTeam1: number
  scoreTeam2: number
  winner: 1 | 2
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
  playedMatch: number
}

interface Round {
  matches: Match[]
  ranking: RankingItem[]
  isCompleted: boolean
}

export interface SingleRoundTournament {
  round: Round
  teams: Team[]
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
      playedMatch: 0
    }
  })

  return {
    round: {
      matches,
      ranking: rankingItems,
      isCompleted: false,
    },
    teams
  }
}

// function createGroupTournamentAR (teams: Team[]): Match[] {
//   return []
// }

export default function createGroupTournamentWrapper (idGenerator: () => string): (type: TournamentType, teams: Team[]) => SingleRoundTournament {
  return function createTournamentByType(type: TournamentType, teams: Team[]): SingleRoundTournament {
    switch (type) {
      // case 'singleRoundAR': {
      //   return createGroupTournamentAR(teams)
      // }
      case TournamentType.SINGLE_ROUND:
      default:
        return createSingleRoundTournament(idGenerator, teams)
    }
  }
}
