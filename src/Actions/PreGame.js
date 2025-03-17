'use strict';

const Actions = require('./Actions')
const { getAgents, sendRequest, errorCreator, errorCodes, getTokens, getMaps } = require('../utils/Util');
const Client = require('../Client');
/**
 * @extends {Actions}
 */
class PreGame extends Actions {
    /**@param {Client} client */
    constructor(client) {
        super(client);
        this.client = client;
    }

    async getData() {
        const tokens = await getTokens();
        let matchID = await sendRequest('pregame/v1/players/' + this.client.player.puuid, 'get', 'glz', { region: this.client.options.region, tokens })
        if (!matchID) return undefined;

        let matchData = await sendRequest('pregame/v1/matches/' + matchID.MatchID, 'get', 'glz', { region: this.client.options.region, tokens })

        if (!matchID) return undefined;

        return matchData;
    }

    /**
    * 
    * @param {string} character
    */
    async selectAndLockCharacter(character) {
        let agents = await getAgents();

        let agent = agents.data.find(a => a.displayName?.toLowerCase() == character.toLowerCase() || a.uuid == character);

        if (!agent) throw errorCreator(errorCodes.CharacterNotFound);
        const tokens = await getTokens();
        const preGame = await this.getData();

        if (!preGame) throw errorCreator(errorCodes.GameNotFound);

        let data = await sendRequest('pregame/v1/matches/' + preGame.ID + '/lock/' + agent.uuid, 'post', 'glz', { region: this.client.options.region, tokens })

        if (!data) return undefined;

        return data;
    }


    async getMap() {
        const match = await this.getData();
        if (!match) return undefined;

        let data = await getMaps();

        if (!data) return undefined;

        return data.data.find(m => m.mapUrl == match.MapID);
    }


    async getLoadouts() {
        const match = await this.getData();
        if (!match) return undefined;

        let data = await sendRequest('pregame/v1/matches/' + match.ID + "/loadouts", 'get', 'glz', { region: this.client.options.region, tokens: await getTokens() })

        if (!data) return undefined;

        return data.Loadouts;
    }

    async quitMatch() {
        let match = await this.getData();

        if (!match) throw errorCreator(errorCodes.GameNotFound);

        const tokens = await getTokens();

        let data = await sendRequest("pregame/v1/matches/" + match.ID + "/quit" + match.ID, 'post', 'glz', { region: this.client.options.region, tokens: tokens })

        if (!data) return undefined;

        return data;
    }
}

module.exports = PreGame;