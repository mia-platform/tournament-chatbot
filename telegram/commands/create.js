

const TOURNAMENT_JOINING_PHASE = 'JOINING'
const TOURNAMENT_SESSION_PROPERTY = 'tournament'

async function handler (ctx) {
    const { replyWithMarkdown, session } = ctx

    if(!isThereRunningTournament(session)){
        initTournament(session)
        return replyWithMarkdown(`Tournament is ready!\nAll teams can now register with */join* command!`)
    } else {
        return replyWithMarkdown(`A tournament is already going on here, you cannot create a new one`)
    } 
}


module.exports =  {
    command: 'create',
    handler
}

