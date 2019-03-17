const TOURNAMENT_SESSION_PROPERTY = 'tournament'

const TOURNAMENT_JOINING_PHASE = 'JOINING'

module.exports = class Tournament {
  loadFromSession (session) {
    this.tournament = session[TOURNAMENT_SESSION_PROPERTY]
  }

  flushToSession (session) {
    session[TOURNAMENT_SESSION_PROPERTY] = this.tournament
  }

  isTournamentRunning () {
    return this.tournament !== undefined
  }

  initTournament () {
    this.tournament = {
      teams: [],
      status: TOURNAMENT_JOINING_PHASE,
      id: undefined
    }
  }
}
