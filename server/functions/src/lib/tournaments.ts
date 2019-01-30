export interface Team {
  name: string
}

interface Game {
  team1: string,
  team2: string,
  goalTeam1?: number,
  goalTeam2?: number
}

function createGroupTournament (teams: Team[]): Game[] {
  return teams.map((team: Team, index: number, array: Team[]) => {
    return {
      team1: team.name,
      team2: ''
    }
  })
}

function createGroupTournamentAR (teams: Team[]): Game[] {

}

export default function createTournamentByType(type: string, teams: Team[]): Game[] {
  switch (type) {
    case 'singleAR': {
      return createGroupTournamentAR(teams)
    }
    case 'single':
    default:
      return createGroupTournament(teams)
  }
}
