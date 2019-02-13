import * as test from "tape"

import tournamentWrapper, {TournamentType} from './tournaments'


test('#1', t => {
  let id = 0
  function idGenerator () {
    return `${id++}`
  }
  const teams = [{name: 't1'}, {name: 't2'}, {name: 't3'}, {name: 't4'}, {name: 't5'}]
  const expected = { round: { matches: [ { id: '0', team1: 't1', team2: 't2', isPlayed: false }, { id: '1', team1: 't1', team2: 't3', isPlayed: false }, { id: '2', team1: 't1', team2: 't4', isPlayed: false }, { id: '3', team1: 't1', team2: 't5', isPlayed: false }, { id: '4', team1: 't2', team2: 't3', isPlayed: false }, { id: '5', team1: 't2', team2: 't4', isPlayed: false }, { id: '6', team1: 't2', team2: 't5', isPlayed: false }, { id: '7', team1: 't3', team2: 't4', isPlayed: false }, { id: '8', team1: 't3', team2: 't5', isPlayed: false }, { id: '9', team1: 't4', team2: 't5', isPlayed: false } ], ranking: [ { teamName: 't1', points: 0, scoreDifference: 0, scoreFor: 0, scoreAgainst: 0, playedMatch: 0 }, { teamName: 't2', points: 0, scoreDifference: 0, scoreFor: 0, scoreAgainst: 0, playedMatch: 0 }, { teamName: 't3', points: 0, scoreDifference: 0, scoreFor: 0, scoreAgainst: 0, playedMatch: 0 }, { teamName: 't4', points: 0, scoreDifference: 0, scoreFor: 0, scoreAgainst: 0, playedMatch: 0 }, { teamName: 't5', points: 0, scoreDifference: 0, scoreFor: 0, scoreAgainst: 0, playedMatch: 0 } ], isCompleted: false } }
  const tournaments = tournamentWrapper(idGenerator)
  const result = tournaments(TournamentType.SINGLE_ROUND, teams)
  t.deepEqual(result, expected)

  t.end()
})
