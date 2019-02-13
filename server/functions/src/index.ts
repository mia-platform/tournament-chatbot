import * as functions from 'firebase-functions';
import * as express from 'express'
import * as hyperid from 'hyperid'

import axios from './lib/axios'
import createTournamentByTypeWrapper, {SingleRoundTournament} from './lib/tournaments'

const generateId: () => string = hyperid({urlSafe: true})

const app : express.Application = express();

const createTournamentByType = createTournamentByTypeWrapper(generateId)

// Add middleware to authenticate requests
// app.use(myMiddleware);

// build multiple CRUD interfaces:
app.post('/tournaments/', async (req: express.Request, res: express.Response): Promise<void> => {
  const {body} = req
  try {
    const tournament: SingleRoundTournament = createTournamentByType(body.type, body.teams)
    const {data} = await axios.post('/tournaments.json', tournament)
    res.status(200).send(data)
  } catch (error) {
    if (error.response) {
      res.status(error.response.statusCode).send(error.response.message)
    } else {
      res.status(500).send('Something went wrong')
    }
  }
})

// app.get('/:id', (req, res) => res.send(Widgets.getById(req.params.id)));
// app.post('/', (req, res) => res.send(Widgets.create()));

// Expose Express API as a single Cloud Function:
exports.tournaments = functions.https.onRequest(app);
