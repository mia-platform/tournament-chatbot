/* eslint-disable no-undef */
const moxios = require('moxios')
const Client = require('../Client')

const tournamentMatches = require('./data/matches.json')
const remainingMatches = require('./data/remainingMatches.json')
const teamNames = require('./data/teamNames.json')
const tournament = require('./data/tournament.json')

describe('Client', () => {
  beforeEach(function () {
    moxios.install()
  })

  afterEach(function () {
    moxios.uninstall()
  })
  describe('get tournament matches', () => {
    it('returns tournament matches', async () => {
      moxios.stubRequest('http://local.com/tournaments/001/matches?toPlay=false', {
        status: 200,
        response: tournamentMatches
      })

      const client = new Client({ baseURL: 'http://local.com' })
      const response = await client.getTournamentMatches('001')
      expect(response).toEqual(tournamentMatches)
    })

    it('should return only the match to play when toPlay is true', async () => {
      moxios.stubRequest('http://local.com/tournaments/001/matches?toPlay=true', {
        status: 200,
        response: remainingMatches
      })

      const client = new Client({ baseURL: 'http://local.com' })
      const response = await client.getTournamentMatches('001', true)
      expect(response).toEqual(remainingMatches)
    })

    it('should return Error if error occurs', async () => {
      moxios.stubRequest('http://local.com/tournaments/001/matches?toPlay=true', {
        status: 500
      })

      const client = new Client({ baseURL: 'http://local.com' })
      const response = await client.getTournamentMatches('001', true)
      expect(response).toEqual(new Error(`Cannot get tournament types: Request failed with status code 500`))
    })
  })

  describe('is tournament active', () => {
    it('should return true if tournarment is active', async () => {
      moxios.stubRequest('http://local.com/tournaments/001/matches', {
        status: 200
      })

      const client = new Client({ baseURL: 'http://local.com' })
      const response = await client.isTournamentActive('001')
      expect(response).toEqual(true)
    })

    it('should return false if tournament is completed', async () => {
      moxios.stubRequest('http://local.com/tournaments/001/matches', {
        status: 400
      })

      const client = new Client({ baseURL: 'http://local.com' })
      const response = await client.isTournamentActive('001')
      expect(response).toEqual(false)
    })
  })

  describe('create tournament', () => {
    it('should return the tournament id if torunament is created', async () => {
      moxios.stubRequest('http://local.com/tournaments', {
        status: 200,
        response: '001'
      })

      const client = new Client({ baseURL: 'http://local.com' })
      const response = await client.createTournament(teamNames)
      expect(response).toEqual('001')
    })

    it('shouls return error if error occurs', async () => {
      moxios.stubRequest('http://local.com/tournaments', {
        status: 500
      })

      const client = new Client({ baseURL: 'http://local.com' })
      const response = await client.createTournament(teamNames)
      expect(response).toEqual(new Error(`Cannot create new tournament.`))
    })
  })

  describe('record scores', () => {
    it('should return the updated tournament object if ok', async () => {
      moxios.stubRequest('http://local.com/tournaments/001/matches/1', {
        status: 200,
        response: tournament
      })

      const client = new Client({ baseURL: 'http://local.com' })
      const response = await client.recordMatchScore('1', '001', 2, 0)
      expect(response).toEqual(tournament)
    })

    it('should return error if error occurs', async () => {
      moxios.stubRequest('http://local.com/tournaments/001/matches/1', {
        status: 500
      })

      const client = new Client({ baseURL: 'http://local.com' })
      const response = await client.recordMatchScore('1', '001', 2, 0)
      expect(response).toEqual(new Error(`Cannot save results.`))
    })
  })
})
