import * as functions from 'firebase-functions';
import * as express from 'express'

import axios from './lib/axios'
import createTournamentByType from './lib/tournaments'

// // Start writing Firebase Functions
// // https://firebase.google.com/docs/functions/typescript
//

const app : express.Application = express();


// Add middleware to authenticate requests
// app.use(myMiddleware);

// build multiple CRUD interfaces:
app.post('/tournaments/', async (req: express.Request, res: express.Response): Promise<void> => {
  const {body} = req
  try {
    const games = createTournamentByType(body.type, body.teams)
    const {data} = await axios.post('/tournaments.json', body)
    res.status(200).send(data)
  } catch (error) {
    if (error.response) {
      res.status(error.response.statusCode).send(error.response.message)
    }
  }
})
// app.get('/:id', (req, res) => res.send(Widgets.getById(req.params.id)));
// app.post('/', (req, res) => res.send(Widgets.create()));

// Expose Express API as a single Cloud Function:
exports.tournaments = functions.https.onRequest(app);
