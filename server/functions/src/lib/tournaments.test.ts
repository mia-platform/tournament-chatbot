import * as test from "tape"

import TournamentClass, {TournamentType, Match, MatchResult, MatchWinner} from './tournaments'

test('create single round tournament by type', t => {
  let id = 0
  function idGenerator () {
    return `${id++}`
  }
  const tournament = new TournamentClass(idGenerator)
  const teams = [{name: 't1'}, {name: 't2'}, {name: 't3'}, {name: 't4'}, {name: 't5'}]
  const expected = { isCompleted: false, teams, round: { matches: [ { id: '0', team1: 't1', team2: 't2', isPlayed: false }, { id: '1', team1: 't1', team2: 't3', isPlayed: false }, { id: '2', team1: 't1', team2: 't4', isPlayed: false }, { id: '3', team1: 't1', team2: 't5', isPlayed: false }, { id: '4', team1: 't2', team2: 't3', isPlayed: false }, { id: '5', team1: 't2', team2: 't4', isPlayed: false }, { id: '6', team1: 't2', team2: 't5', isPlayed: false }, { id: '7', team1: 't3', team2: 't4', isPlayed: false }, { id: '8', team1: 't3', team2: 't5', isPlayed: false }, { id: '9', team1: 't4', team2: 't5', isPlayed: false } ], ranking: [ { teamName: 't1', points: 0, scoreDifference: 0, scoreFor: 0, scoreAgainst: 0, playedMatchesCount: 0 }, { teamName: 't2', points: 0, scoreDifference: 0, scoreFor: 0, scoreAgainst: 0, playedMatchesCount: 0 }, { teamName: 't3', points: 0, scoreDifference: 0, scoreFor: 0, scoreAgainst: 0, playedMatchesCount: 0 }, { teamName: 't4', points: 0, scoreDifference: 0, scoreFor: 0, scoreAgainst: 0, playedMatchesCount: 0 }, { teamName: 't5', points: 0, scoreDifference: 0, scoreFor: 0, scoreAgainst: 0, playedMatchesCount: 0 } ], isCompleted: false } }
  const result = tournament.createByType(TournamentType.SINGLE_ROUND, teams)
  t.deepEqual(result, expected)

  t.end()
})

test('on first team win', t => {
  let id = 0
  function idGenerator () {
    return `${id++}`
  }
  const playedMatchId = '0'
  const scoreTeam1 = 4
  const scoreTeam2 = 3
  const tournamentClass = new TournamentClass(idGenerator)
  const teams = [{name: 't1'}, {name: 't2'}, {name: 't3'}, {name: 't4'}, {name: 't5'}]
  const tournament = { isCompleted: false, teams, round: { matches: [ { id: '0', team1: 't1', team2: 't2', isPlayed: false }, { id: '1', team1: 't1', team2: 't3', isPlayed: false }, { id: '2', team1: 't1', team2: 't4', isPlayed: false }, { id: '3', team1: 't1', team2: 't5', isPlayed: false }, { id: '4', team1: 't2', team2: 't3', isPlayed: false }, { id: '5', team1: 't2', team2: 't4', isPlayed: false }, { id: '6', team1: 't2', team2: 't5', isPlayed: false }, { id: '7', team1: 't3', team2: 't4', isPlayed: false }, { id: '8', team1: 't3', team2: 't5', isPlayed: false }, { id: '9', team1: 't4', team2: 't5', isPlayed: false } ], ranking: [ { teamName: 't1', points: 0, scoreDifference: 0, scoreFor: 0, scoreAgainst: 0, playedMatchesCount: 0 }, { teamName: 't2', points: 0, scoreDifference: 0, scoreFor: 0, scoreAgainst: 0, playedMatchesCount: 0 }, { teamName: 't3', points: 0, scoreDifference: 0, scoreFor: 0, scoreAgainst: 0, playedMatchesCount: 0 }, { teamName: 't4', points: 0, scoreDifference: 0, scoreFor: 0, scoreAgainst: 0, playedMatchesCount: 0 }, { teamName: 't5', points: 0, scoreDifference: 0, scoreFor: 0, scoreAgainst: 0, playedMatchesCount: 0 } ], isCompleted: false } }

  tournamentClass.updateRoundMatchAndRanking(tournament, playedMatchId, scoreTeam1, scoreTeam2)

  t.test('the match is:', t => {
    const playedMatch: Match = <Match>tournament.round.matches.find(match => match.id === playedMatchId)
    t.assert(playedMatch)

    t.test('flagged as played', t => {
      t.equal(playedMatch.isPlayed, true)

      t.end()
    })

    t.test('won by first team', t => {
      const result = <MatchResult>playedMatch.result
      t.equal(result.winner, MatchWinner.TEAM_1)

      t.end()
    })

    t.test('ranking is correctly updated', t => {
      t.deepEqual(tournament.round.ranking, [{
        teamName: 't1',
        points: 3,
        scoreDifference: 1,
        scoreFor: 4,
        scoreAgainst: 3,
        playedMatchesCount: 1
      }, {
        teamName: 't3',
        points: 0,
        scoreDifference: 0,
        scoreFor: 0,
        scoreAgainst: 0,
        playedMatchesCount: 0
      }, {
        teamName: 't4',
        points: 0,
        scoreDifference: 0,
        scoreFor: 0,
        scoreAgainst: 0,
        playedMatchesCount: 0
      }, {
        teamName: 't5',
        points: 0,
        scoreDifference: 0,
        scoreFor: 0,
        scoreAgainst: 0,
        playedMatchesCount: 0
      }, {
        teamName: 't2',
        points: 0,
        scoreDifference: -1,
        scoreFor: 3,
        scoreAgainst: 4,
        playedMatchesCount: 1
      }])

      t.end()
    })

    t.end()
  })

  t.end()
})
