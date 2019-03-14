const axios = require('axios')

class Client {
  constructor ({ baseURL }) {
    this.axiosInstance = axios.create({ baseURL })
  }

  //WIP
  async getTournamentTypes () {
    try {
      const response = await this.axiosInstance.get(`/tournaments/types/`)
      return response.data
    } catch (error) {
      return new Error(`Cannot get tournament types: ${error.message}`)
    }
  }

  //WIP
  async isTournamentActive (tournamentID) {
    try {
      await this.axiosInstance.get(`/tournaments/${tournamentID}`)
      return true
    } catch (error) {
      if (error.statusCode === 404) {
        return false
      } else {
        return new Error(`Cannot get status for tournament with id ${tournamentID}: ${error.message}`)
      }
    }
  }

  //createTournament creates the tournament and returns the identifier of the tournament
  async createTournament ({type, teams }) {
    try {
      const {name} = await this.axiosInstance.post(`/tournaments/`, {
        type,
        teams
      })
      return name
    } catch (error) {
      return new Error(`Cannot create new tournament with id ${tournamentID}: ${error.message}`)
    }
  }

  //get tournament results
  async recordMatchScores (matchId, tournamentId, scoreTeam1, scoreTeam2) {
    try {
      const response = await this.axiosInstance.post(`/tournaments/${tournamentId}/matches/${matchId}`, { scoreTeam1, scoreTeam2 })
      const { data } = response

      return `il tuo torneo: ${JSON.stringify(data)}`

    } catch (error) {
      return new Error(`Cannot save results ${tournamentId}: ${error.message}`)
    }
  }












  async getTournamentMatch ({ tournamentID, matchID }) {
    try {
      const response = await this.axiosInstance.get(`/tournaments/${tournamentID}/matches/${matchID}`)
      return response.data
    } catch (error) {
      return new Error(`Cannot get games for tournament with id ${tournamentID}: ${error.message}`)
    }
  }
}

module.exports = Client
