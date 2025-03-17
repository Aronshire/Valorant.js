const Actions = require('./Actions')
const { getAgents, sendRequest, errorCreator, errorCodes, getTokens, localRequest } = require('../utils/Util');
const Client = require('../Client');

class Match extends Actions {
    /**@param {Client} client */
    constructor(client) {
        super(client);
        this.client = client;
    }

    async getMatchInfo(puuid) {

        const data = await sendRequest('match-details/v1/matches/' + puuid, 'get', 'pd', { region: this.client.options.region, tokens: await getTokens() })

        if (!data) return undefined;

        return data.matchInfo;
    }

    async getMatchPlayers(puuid) {

        const data = await sendRequest('match-details/v1/matches/' + puuid, 'get', 'pd', { region: this.client.options.region, tokens: await getTokens() })

        if (!data) return undefined;

        return data.players;
    }

    async getMatchResult(puuid) {

        const data = await sendRequest('match-details/v1/matches/' + puuid, 'get', 'pd', { region: this.client.options.region, tokens: await getTokens() })

        if (!data) return undefined;

        return data.teams;
    }

    async getMatchRoundResults(puuid) {

        const data = await sendRequest('match-details/v1/matches/' + puuid, 'get', 'pd', { region: this.client.options.region, tokens: await getTokens() })

        if (!data) return undefined;

        return data.roundResults;
    }

    async getMatchKillFeed(puuid) {
            
            const data = await sendRequest('match-details/v1/matches/' + puuid, 'get', 'pd', { region: this.client.options.region, tokens: await getTokens() })
    
            if (!data) return undefined;
    
            return data.kills;
    }

    async getCoaches(puuid) {
        
        const data = await sendRequest('match-details/v1/matches/' + puuid, 'get', 'pd', { region: this.client.options.region, tokens: await getTokens() })

        if (!data) return undefined;

        return data.coaches;
    }
}

module.exports = Match;