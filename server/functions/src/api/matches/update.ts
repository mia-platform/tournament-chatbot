import * as express from 'express'
import * as hyperid from 'hyperid'

import TournamentClass, {SingleRoundTournament} from "../../lib/tournaments"

exports.path = '/tournaments/:tournamentId/matches/:matchId'
exports.method = 'post'
exports.description = "Update tournament match";
exports.tags = ["tournaments"];
exports.responses = {
  "200": {
    description: "tournament json"
  }
};
exports.parameters = [
  {
    name: "name result",
    in: "body",
    required: true,
    schema: {
      type: "object",
      properties: {
        scoreTeam1: {type: "integer"},
        scoreTeam2: {type: "integer"}
      },
      additionalProperties: false,
      required: ["scoreTeam1", "scoreTeam2"]
    }
  },
  {
    in: "path",
    name: "tournamentId",
    type: "string",
    required: true,
    description: "ID of the tournament"
  }, {
    in: "path",
    name: "matchId",
    type: "string",
    required: true,
    description: "ID of the match"
  }
];

const generateId: () => string = hyperid({urlSafe: true})
const tournamentClass = new TournamentClass(generateId)

exports.handler = async (req: express.Request, res: express.Response): Promise<void> => {
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
}
