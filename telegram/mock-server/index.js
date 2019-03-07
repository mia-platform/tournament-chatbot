const fastify = require('fastify')()

const TOURNAMENT_TYPES = Object.freeze([
  {
    id: 0,
    name: 'TYPE_A',
    description: 'description TYPE_A'
  },
  {
    id: 1,
    name: 'TYPE_B',
    description: 'description TYPE_B'
  }
])

fastify.get('/tournaments/types/', async (request, reply) => {
  return TOURNAMENT_TYPES
})

fastify.post('/tournaments/:tournamentId/matches/:matchId', async (request, reply) => {
  const { tournamentId, matchId } = request.params
  const { scoreTeam1, scoreTeam2 } = request.body
  return {
    tournamentId,
    matchId,
    results: [ scoreTeam1, scoreTeam2 ]
  }
})

const start = async () => {
  try {
    await fastify.listen(3000)
  } catch (err) {
    fastify.log.error(err)
    process.exit(1)
  }
}
start()
