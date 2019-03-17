const axios = require('axios')

class Client {
  constructor ({ baseURL }) {
    this.axiosInstance = axios.create({ baseURL })
  }

  async getTournamentMatches (tournamentID, toPlay = false) {
    try {
      const response = await this.axiosInstance.get(`/tournaments/${tournamentID}/matches?toPlay=${toPlay}`)
      return response.data
    } catch (error) {
      return new Error(`Cannot get tournament types: ${error.message}`)
    }
  }

  async isTournamentActive (tournamentID) {
    try {
      await this.axiosInstance.get(`/tournaments/${tournamentID}/matches`)
      return true
    } catch (error) {
      if (error.response.status === 400) {
        return false
      } else {
        return new Error(`Cannot get status for tournament with id ${tournamentID}: ${error.message}`)
      }
    }
  }

  async createTournament (teamNames) {
    try {
      const response = await this.axiosInstance.post(`/tournaments`, teamNames)
      return response.data
    } catch (error) {
      return new Error(`Cannot create new tournament.`)
    }
  }

  async recordMatchScore (matchId, tournamentId, scoreTeam1, scoreTeam2) {
    try {
      const response = await this.axiosInstance.post(`/tournaments/${tournamentId}/matches/${matchId}`, { scoreTeam1, scoreTeam2 })
      return response.data
    } catch (error) {
      return new Error(`Cannot save results.`)
    }
  }
}

module.exports = Client
