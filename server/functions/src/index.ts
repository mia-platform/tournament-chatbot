import * as functions from 'firebase-functions';
import * as express from 'express'
import * as hyperid from 'hyperid'

import axios from './lib/axios'
import TournamentClass, {SingleRoundTournament} from './lib/tournaments'

const generateId: () => string = hyperid({urlSafe: true})

const app : express.Application = express();

const tournamentClass = new TournamentClass(generateId)

// Create tournament
app.post('/tournaments/', async (req: express.Request, res: express.Response): Promise<void> => {
  const {body} = req
  try {
    const tournament: SingleRoundTournament = tournamentClass.createByType(body.type, body.teams)
    const {data} = await axios.post('/tournaments.json', tournament)
    res.status(200).send(data)
  } catch (error) {
    if (error.response) {
      res.status(error.response.statusCode).send(error.response.message)
    } else {
      res.status(500).send(error.message || "Something went wrong")
    }
  }
})

// Save game result
app.post('/tournaments/:tournamentId/matches/:matchId', async (req: express.Request, res: express.Response): Promise<void> => {
  const {body, params} = req
  try {
    const tournament: SingleRoundTournament = await tournamentClass.getTournamentById(params.tournamentId)
    tournamentClass.updateTournamentMatch(tournament, params.matchId, body.scoreTeam1, body.scoreTeam2)
    await tournamentClass.updateTournament(params.tournamentId, tournament)
    res.status(200).send(tournament)
  } catch (error) {
    if (error.response) {
      res.status(error.response.statusCode).send(error.response.message)
    } else {
      res.status(500).send(error.message || "Something went wrong")
    }
  }
})

// Get nex matches to play
app.get('/tournaments/:tournamentId/matches-to-play', async (req: express.Request, res: express.Response): Promise<void> => {
  const {params} = req
  try {
    const tournament: SingleRoundTournament = await tournamentClass.getTournamentById(params.tournamentId)
    if (tournament.isCompleted) {
      res.status(400).send({
        message: 'Tournament is completed'
      })
    }
    const matchesToPlayByType = tournamentClass.getRemainingMatchesToPlayByType(tournament)
    res.status(200).send(matchesToPlayByType)
  } catch (error) {
    if (error.response) {
      res.status(error.response.statusCode).send(error.response.message)
    } else {
      res.status(500).send(error.message || "Something went wrong")
    }
  }
})

// Expose Express API as a single Cloud Function:
exports.tournaments = functions.https.onRequest(app);
