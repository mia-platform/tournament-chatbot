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

module.exports = bot
