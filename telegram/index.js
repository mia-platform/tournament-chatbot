const { Composer, log, session, Markup } = require('micro-bot')

const bot = new Composer()

bot.use(log())
bot.use(session())

bot.start(({ reply }) => reply('Welcome message'))
bot.help(({ reply }) => reply('Help message'))
bot.settings(({ reply }) => reply('Bot settings'))

bot.command('date', ({ reply }) => reply(`Server time: ${Date()}`))

/* custom commands */
bot.command('create', ({ reply }) => {
  return reply('Crea un Torneo', Markup.keyboard([['bottone1', 'bottone2']])
    .resize()
    .extra()
  )
})

module.exports = bot
