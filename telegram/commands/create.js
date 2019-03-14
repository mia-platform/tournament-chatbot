

const TOURNAMENT_JOINING_PHASE = 'JOINING'
const TOURNAMENT_SESSION_PROPERTY = 'tournament'

function isThereRunningTournament(session) {
    return null
}

async function handler (ctx) {
    const { replyWithMarkdown, session, tournament } = ctx

    if(!isThereRunningTournament(session)){
        tournament.initTournament()
        return replyWithMarkdown(`Tournament is ready!\nAll teams can now register with */join* command!`)
    } else {
        return replyWithMarkdown(`A tournament is already going on here, you cannot create a new one`)
    }
}


module.exports =  {
    command: 'create',
    handler
}
