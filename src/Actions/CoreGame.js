const Actions = require('./Actions')
const { getAgents, sendRequest, errorCreator, errorCodes, getTokens, getMaps } = require('../utils/Util');
const Client = require('../Client');
/**
 * @extends {Actions}
 */
class CoreGame extends Actions {
    /**@param {Client} client */
    constructor(client) {
        super(client);
        this.client = client;
    }

    /**
     * Core Game Data
     * @typedef {Object} MatchData
     * @property {string} MatchID - The match ID.
     * @property {Number} Version - The version.
     * @property {string} State - The state.
     * @property {string} MapID - The map ID.
     * @property {string} ModeID - The mode ID.
     * @property {string} ProvisioningFlow - The provisioning flow
     * @property {string} GamePodID - The game pod ID.
     * @property {string} AllMUCName - The all MUC name.
     * @property {string} TeamMUCName - The team MUC name.
     * @property {string} TeamVoiceID - The team voice ID.
     * @property {string} TeamMatchToken - The team match token.
     * @property {Boolean} IsReconnectable - If the match is reconnectable.
     * @property {Object} ConnectionDetails
     * @property {Array} ConnectionDetails.GameServerHosts - The game server hosts.
     * @property {Number} ConnectionDetails.GameServerHost - The game server host.
     * @property {Number} ConnectionDetails.GameServerPort - The game server port.
     * @property {Number} ConnectionDetails.GameServerObfuscatedIP - The game server obfuscated IP.
     * @property {String} ConnectionDetails.PlayerKey - The player key.
     * @property {Object} PostGameDetails - The post game details.
     * @property {[
     * {
     *   Subject: string,
     *   TeamID: string,
     *   CharacterID: string,
     *   PlayerIdentity: Object,
     *   SeasonalBadgeInfo: Object,
     *   IsCoach: Boolean,
     *   IsAssociated: Boolean,
     * }
     * ]} Players - The players.
     * 
     */
    /**
     * 
     * @returns {MatchData} - Core Game Data.
     */
    async getData() {
        const tokens = await getTokens();
        let matchID = await sendRequest('core-game/v1/players/' + this.client.player.puuid, 'get', 'glz', { region: this.client.options.region, tokens })
        if (!matchID) return undefined;

        let matchData = await sendRequest('core-game/v1/matches/' + matchID.MatchID, 'get', 'glz', { region: this.client.options.region, tokens })

        if (!matchData) return undefined;
        return matchData;
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

        let data = await sendRequest('core-game/v1/matches/' + match.ID + "/loadouts", 'get', 'glz', { region: this.client.options.region, tokens: await getTokens() })

        if (!data) return undefined;

        return data.Loadouts;
    }

    
    async quitMatch() {
        const match = await this.getData();
        if (!match) throw errorCreator(errorCodes.GameNotFound);

        const tokens = await getTokens();

        let data = await sendRequest('core-game/v1/players/' + this.client.players.puuid + "/disassociate/" + match.ID, 'post', 'glz', { region: this.client.options.region, tokens: tokens })

        if (!data) return undefined;

        return data;
    }
}

module.exports = CoreGame;