const { Composer, log, session, Markup } = require('micro-bot')
const axios = require('axios')
const { HOST } = process.env

const axiosInstance = axios.create({
  baseURL: HOST,
  timeout: 1000
})

const bot = new Composer()
bot.use((ctx, next) => {
  ctx.axios = axiosInstance
  return next(ctx)
})

bot.use(log())
bot.use(session())
/* defaulT commands */
bot.start(({ reply }) => reply('Welcome message'))
bot.help(({ reply }) => reply('Help message'))
bot.settings(({ reply }) => reply('Bot settings'))

/* custom commands */
bot.command('create', async (ctx) => {
  const { reply, axios } = ctx

  const response = await axios.get('/types')
  const types = response.data
  return reply('Crea un Torneo', Markup.keyboard([types])
    .resize()
    .extra()
  )
})

module.exports = bot
