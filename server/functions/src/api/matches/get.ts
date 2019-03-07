import * as express from 'express'
import * as hyperid from 'hyperid'

import TournamentClass, {SingleRoundTournament, SemiFinalMatches, FinalMatch} from "../../lib/tournaments"

exports.path = '/tournaments/:tournamentId/matches'
exports.method = 'get'
exports.description = "Get tournament match";
exports.tags = ["tournaments"];
exports.responses = {
  "200": {
    description: "matches"
  }
};
exports.parameters = [
  {
    in: "path",
    name: "tournamentId",
    type: "string",
    required: true,
    description: "ID of the tournament"
  }, {
    in: "query",
    name: "toPlay",
    type: "boolean",
    description: "Returns only the match to play?"
  }
];

const generateId: () => string = hyperid({urlSafe: true})
const tournamentClass = new TournamentClass(generateId)

exports.handler = async (req: express.Request, res: express.Response): Promise<void> => {
  const {params, query} = req
  try {
    const tournament: SingleRoundTournament = await tournamentClass.getTournamentById(params.tournamentId)
    if (!tournament) {
      res.sendStatus(404)
    }
    if (tournament.isCompleted) {
      res.status(400).send({
        message: 'Tournament is completed'
      })
    }
    if (query.toPlay) {
      const matchesToPlayByType = tournamentClass.getRemainingMatchesToPlayByType(tournament)
      res.status(200).send(matchesToPlayByType)
    }
    const semiFinal = <SemiFinalMatches>tournament.semiFinalMatches || {}
    const final = <FinalMatch>tournament.finalMatch || {}
    res.status(200).send(final.match || semiFinal.matches || tournament.round.matches)
  } catch (error) {
    if (error.response) {
      res.status(error.response.statusCode).send(error.response.message)
    } else {
      res.status(500).send(error.message || "Something went wrong")
    }
  }
}
