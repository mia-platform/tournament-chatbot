const { Composer, log, session, Markup } = require('micro-bot')
const LocalSession = require('telegraf-session-local')
const R = require('ramda')

const Client = require('./lib/Client')

const TOURNAMENTS_SESSION_KEY = 'tournaments'

const client = new Client({baseURL: process.env.HOST})
const getTournamentName = R.prop('name')

const getTournamentsTypes = async () => {
  const response = await client.getTournamentTypes()
  return R.map(getTournamentName, response)
}

const localSession = new LocalSession({
  database: 'sessions/session.json',
  property: 'session',
  storage: LocalSession.storageFileAsync,
  state: { [TOURNAMENTS_SESSION_KEY]: [] }
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
  const { chat: { id: chatId } , text, entities} = message

  const botCommandEntity = entities[0]
  const tournamentType = R.trim(text.substring(botCommandEntity.length))

  if (R.isEmpty(tournamentType)){
    return reply(`You have to specify the type of tournament you want to create, ask /help to know how`)
  }

  const tournamentTypes = await getTournamentsTypes()
  if (!R.includes(tournamentType, tournamentTypes)){
    return reply(`You have to specify a valid tournament type, ask /help to know how`)
  }

  const currentTournament = sessionDB
    .get(TOURNAMENTS_SESSION_KEY)
    .getById(chatId)
    .value()

  if (!R.isNil(currentTournament)) {
    return reply('You have already initialized your tournament. Select the type of tournament!')
  }

  sessionDB
    .get(TOURNAMENTS_SESSION_KEY)
    .insert({ type: tournamentType, id: chatId, teams: [], isStarted: false })
    .write()

  return reply('Ok, the tournament has been initializes. Join it using the \'/join\' command.')
})

bot.command('join', async (ctx) => {
  const { reply, message, sessionDB } = ctx
  const { chat: { id: chatId }, text, entities } = message

  const botCommandEntity = entities[0]
  const teamName = text.substring(botCommandEntity.length)

  const currentTournament = sessionDB
    .get(TOURNAMENTS_SESSION_KEY)
    .getById(chatId)
    .value()

  if (R.isNil(currentTournament)) {
    return reply('You do not have initialized any tournament. Use the \'/create\' command to initialize it!')
  }

  const isTournamentAlreadyStarted = R.prop('isStarted', currentTournament)
  if (isTournamentAlreadyStarted) {
    return reply('Your tournament is already started!')
  }

  const { teams } = currentTournament
  if (R.includes(teamName, teams)) {
    return reply(`This team name (${teamName}) has already been chosen`)
  }

  const newTeamsList = R.append(teamName, teams)

  sessionDB
    .get(TOURNAMENTS_SESSION_KEY)
    .updateById(chatId, { teams: newTeamsList })
    .write()

  return reply(`You have been added to the tournament list. This is the current list: ${newTeamsList}`)
})

bot.command('play', async (ctx) => {
  const { reply, message, sessionDB } = ctx
  const { chat: { id: chatId }, text, entities } = message

  const currentTournament = sessionDB
    .get(TOURNAMENTS_SESSION_KEY)
    .getById(chatId)
    .value()

  if (R.isNil(currentTournament)) {
    return reply('You do not have initialized any tournament. Use the \'/create\' command to initialize it!')
  }

  const isTournamentAlreadyStarted = R.prop('isStarted', currentTournament)
  if (isTournamentAlreadyStarted) {
    return reply('Your tournament is already started!')
  }

  const tournamentSettings = {
    tournamentID: currentTournament.id,
    tournamentID: currentTournament.type,
    tournamentID: currentTournament.teams,
  }
  await client.createTournament({ tournamentSettings })

  sessionDB
    .get(TOURNAMENTS_SESSION_KEY)
    .updateById(chatId, { isStarted: true })
    .write()

  return reply(`Your tournament is started!!`)
})

module.exports = bot
