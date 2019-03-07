const axios = require('axios')

class Client {
  constructor ({ baseURL }) {
    this.axioInstance = axios.create({ baseURL })
  }

  //WIP
  async getTournamentTypes () {
    try {
      const response = await this.axioInstance.get(`/tournaments/types/`)
      return response.data
    } catch (error) {
      return new Error(`Cannot get tournament types: ${error.message}`)
    }
  }

  //WIP
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

  //createTournament creates the tournament and returns the identifier of the tournament
  async createTournament ({type, teams }) {
    try {
      const {name} = await this.axioInstance.post(`/tournaments/`, {
        type,
        teams
      })
      return name
    } catch (error) {
      return new Error(`Cannot create new tournament with id ${tournamentID}: ${error.message}`)
    }
  }

  








  

  async getTournamentMatch ({ tournamentID, matchID }) {
    try {
      const response = await this.axioInstance.get(`/tournaments/${tournamentID}/matches/${matchID}`)
      return response.data
    } catch (error) {
      return new Error(`Cannot get games for tournament with id ${tournamentID}: ${error.message}`)
    }
  }
}

module.exports = Client
