const { Composer, log, session, Markup } = require('micro-bot')
const LocalSession = require('telegraf-session-local')
const R = require('ramda')

const localSession = new LocalSession({
  database: 'sessions/session.json',
  property: 'session',
  storage: LocalSession.storageFileAsync,
  state: { create: [], join: [] }
})

const bot = new Composer()
bot.use((ctx, next) => {
  return next(ctx)
})

// bot.use(log())

bot.use(localSession.middleware())

localSession.DB.then(DB => {
  // Database now initialized, so now you can retrieve anything you want from it
  console.log('Current LocalSession DB:', DB.value())
})

/* defaulT commands */
bot.start(({ reply }) => reply('Welcome message'))
bot.help(({ reply }) => reply('Help message'))
bot.settings(({ reply }) => reply('Bot settings'))

bot.command('create', async (ctx) => {
  const { reply, message, sessionDB } = ctx
  const { chat: { id: chatId }, text } = message

  const currentTournament = sessionDB
    .get('join')
    .getById(chatId)
    .value()

  if (!R.isNil(currentTournament)) {
    return reply('You have already initialized your tournament. Select the type of tournament!')
  }

  sessionDB
    .get('join')
    .insert({ id: chatId, players: [] })
    .write()

  return reply('Ok, the tournament has been initializes. Join it using the \'/join\' command.')
})

bot.command('join', async (ctx) => {
  const { reply, message, sessionDB } = ctx
  const { chat: { id: chatId }, text, entities } = message

  const botCommandEntity = entities[0]
  const teamName = text.substring(botCommandEntity.length)
  console.log('*********', teamName)

  const currentTournament = sessionDB
    .get('tournaments')
    .getById(chatId)
    .value()

  if (R.isNil(currentTournament)) {
    return reply('You do not have initialized any tournament. Use the \'/create\' command to initialize it!')
  }

  const { teams } = currentTournament
  if (R.includes(teamName, teams)) {
    return reply(`This team name (${teamName}) has already been chosen`)
  }

  const newTeamsList = R.append(teamName, teams)

  sessionDB
    .get('tournaments')
    .updateById(chatId, { teams: newTeamsList })
    .write()

  return reply(`You have been added to the tournament list. This is the current list: ${newTeamsList}`)
})

module.exports = bot
