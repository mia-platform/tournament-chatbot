'use strict'

const { Composer, log, session, Markup } = require('micro-bot')
const LocalSession = require('telegraf-session-local')

const Client = require('./lib/Client')
const Tournament = require('./lib/Tournament')

const create = require('./commands/create')
const join = require('./commands/join')

const bot = new Composer()

bot.use((ctx, next) => {
  const client = new Client(process.env.HOST)
  ctx.client = client
  ctx.tournament = new Tournament()
  return next(ctx)
})

bot.use(log())
bot.use((new LocalSession({
  database:'./sessions/session.json',
  getSessionKey: (ctx) => {
    if (ctx.from && ctx.chat) {
      return `${ctx.from.id}:${ctx.chat.id}`
    } else if (ctx.from && ctx.inlineQuery) {
      return `${ctx.from.id}:${ctx.from.id}`
    }
    return null
  }
})).middleware())

bot.use((ctx, next) => {
  ctx.tournament.loadFromSession(ctx.session)
  next()
})

bot.start(({ reply }) => reply('Welcome message'))
bot.help(({ reply }) => reply('Help message'))
bot.settings(({ reply }) => reply('Bot settings'))

bot.command(create.command, create.handler)
bot.command(join.command, join.handler)

/* save results */
bot.command('results', async (ctx) => {
  const { reply, axios, tournament, message } = ctx
  const tournamentId = tournament.id
  const { text, entities } = message
  const commands = text.substring(entities[0].length)
  const [, matchId, , scoreTeam1, , scoreTeam2 ] = commands.split(' ')

  const response = await axios.post(`/tournaments/${tournamentId}/matches/${matchId}`, { scoreTeam1, scoreTeam2 })
  const { data } = response

  return reply(`il tuo torneo: ${JSON.stringify(data)}`)

})

require('express')().get('/', function (req, res) {
  res.send('Hello World')
}).listen(process.env.PORT)

module.exports = bot
