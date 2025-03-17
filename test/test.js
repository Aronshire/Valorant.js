const Client = require('../index.js');
const client = new Client({ region: 'eu' });

client.login();

client.on('ready', async () => {
    console.log('ready');
});

client.on('matchFound', async (matchData) => {
    console.log('game found');
    client.preGame.selectAndLockCharacter('Waylay');
    console.log('character selected');
    console.log(matchData);

    const players = matchData.AllyTeam.Players;

    players.forEach(async player => {
        const mmr = await client.players.getPlayerMMR(player.Subject);
        const matchHistory = await client.players.getPlayerMatchHistory(player.Subject);
        if (!mmr) return;
        if (!matchHistory.History[0]) return;
        const matchData = await client.match.getMatchPlayers(matchHistory.History[0].MatchID)
        const playerData = matchData.find(x => x.subject == player.Subject);
        console.log({
            gameName: playerData.gameName,
            tagLine: playerData.tagLine,
            mmr: mmr.tierName
        })
    });

});

client.on('ready', async () => {
    /*const prematch = await client.preGame.getData();
    prematch.AllyTeam.Players.forEach(async player => {
            const mmr = await client.players.getPlayerMMR(player.Subject);
            console.log(mmr);
    });*/

    /*const coregame = await client.coreGame.getData();

    const player = coregame.Players[0];
    const matchHistory = await client.players.getPlayerMatchHistory(player.Subject);

    const matchData =await  client.match.getMatchPlayers(matchHistory.History[0].MatchID)
    const playerData = matchData.find(x => x.subject == player.Subject);
    console.log(playerData.gameName ,"#", playerData.tagLine);*/


    const coregame = await client.coreGame.getData();
    console.log(coregame)
    if (!coregame) return;
    coregame.Players.forEach(async player => {
        //if(player.TeamID !== "Blue") return;
        const mmr = await client.players.getPlayerMMR(player.Subject);
        if (!mmr) return;
        const matchHistory = await client.players.getPlayerMatchHistory(player.Subject);
        if (!matchHistory.History[0]) return;
        const matchData = await client.match.getMatchPlayers(matchHistory.History[0].MatchID)
        const playerData = matchData.find(x => x.subject == player.Subject);
        console.log({
            gameName: playerData.gameName,
            tagLine: playerData.tagLine,
            mmr: mmr.tierName,
            team: player.TeamID
        })
    });

    const helpData = await client.actions.utils.localRequest('/help');
    client.ws.connect();
    //console.log(helpData.events);
    client.ws.ws.on('open', () => {
        Object.entries(helpData.events).forEach(([name, desc]) => {
            if (name === 'OnJsonApiEvent') return;
            client.ws.ws.send(JSON.stringify([5, name]));
        });
        console.log('Connected to websocket!');
    });

    /*client.ws.ws.on('message', data => {
    
        data = new Buffer.from(data).toString('utf8')
        console.log(data);
    

    });*/


});

client.on('matchStarted', async (coregame) => {
    console.log('game started');

    coregame.Players.forEach(async player => {
        //if(player.TeamID !== "Blue") return;
        const mmr = await client.players.getPlayerMMR(player.Subject);
        if (!mmr) return;
        const matchHistory = await client.players.getPlayerMatchHistory(player.Subject);
        if (!matchHistory.History[0]) return;
        const matchData = await client.match.getMatchPlayers(matchHistory.History[0].MatchID)
        const playerData = matchData.find(x => x.subject == player.Subject);
        console.log({
            gameName: playerData.gameName,
            tagLine: playerData.tagLine,
            mmr: mmr.tierName,
            team: player.TeamID
        })
    });
});

client.on('matchEnded', async () => {
    console.log('game ended');

});

client.on('matchCancelled', async () => {
    console.log('game cancelled');
});