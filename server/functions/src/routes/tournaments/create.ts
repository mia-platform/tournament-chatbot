import * as express from 'express'
import * as hyperid from 'hyperid'

import axios from '../../lib/axios'
import TournamentClass, {SingleRoundTournament} from "../../lib/tournaments"

exports.path = '/tournaments'
exports.method = 'post'
exports.description = "Create tournament";
exports.tags = ["tournaments"];
exports.responses = {
  "200": {
    description: "tournament Id",
    type: "object",
    properties: {
      name: {type: "string"}
    }
  }
};
exports.parameters = [
  {
    name: "team name",
    in: "body",
    required: true,
    schema: {
      type: "array",
      items: {
        type: "object",
        properties: {
          name: {type: "string"}
        },
        additionalProperties: false,
        required: ["name"]
      },
      minLength: 4
    }
  }
];

const generateId: () => string = hyperid({urlSafe: true})
const tournamentClass = new TournamentClass(generateId)

exports.handler = async (req: express.Request, res: express.Response): Promise<void> => {
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
}
