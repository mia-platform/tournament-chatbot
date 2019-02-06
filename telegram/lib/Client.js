const axios = require('axios')

class Client {
  constructor ({ baseURL }) {
    this.axioInstance = axios.create({ baseURL })
  }

  async getTournamentTypes () {
    try {
      const response = await this.axioInstance.get(`/tournaments/types/`)
      return response.data
    } catch (error) {
      return new Error(`Cannot get tournament types: ${error.message}`)
    }
  }

  async isTournamentActive (tournamentID) {
    try {
      await this.axioInstance.get(`/tournaments/${tournamentID}`)
      return true
    } catch (error) {
      if (error.statusCode === 404) {
        return false
      } else {
        return new Error(`Cannot get status for tournament with id ${tournamentID}: ${error.message}`)
      }
    }
  }

  async createTournament ({ tournamentID, teams }) {
    try {
      await this.axioInstance.post(`/tournaments/`, {
        uid: tournamentID,
        teams
      })
    } catch (error) {
      return new Error(`Cannot create new tournament with id ${tournamentID}: ${error.message}`)
    }
  }

  async getTournamentGames ({ tournamentID }) {
    try {
      const response = await this.axioInstance.get(`/tournaments/${tournamentID}/games/`)
      return response.data
    } catch (error) {
      return new Error(`Cannot get games for tournament with id ${tournamentID}: ${error.message}`)
    }
  }
}

module.exports = Client
