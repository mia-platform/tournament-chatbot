const moxios = require('moxios')
const Client = require('../Client')

describe('Client', function () {
  describe('getTournamentTypes', function () {
    beforeEach(function () {
      moxios.install()
    })

    afterEach(function () {
      moxios.uninstall()
    })

    it('returns tournament types', async function () {
      const tournamentTypes = [
        {
          id: 0,
          name: 'TYPE_A',
          description: 'description'
        }
      ]
      moxios.stubRequest('http://local.com/tournaments/types/', {
        status: 200,
        response: tournamentTypes
      })

      const client = new Client({ baseURL: 'http://local.com' })
      const response = await client.getTournamentTypes()
      expect(response).toEqual(tournamentTypes)
    })
  })
})
