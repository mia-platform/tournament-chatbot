const fastify = require('fastify')()

const TOURNAMENT_TYPES = Object.freeze(['TYPE_A'])

fastify.get('/types', async (request, reply) => {
  return TOURNAMENT_TYPES
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
