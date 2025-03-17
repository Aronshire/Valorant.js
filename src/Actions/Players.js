const Actions = require('./Actions')
const { getAgents, sendRequest, errorCreator, errorCodes, getTokens, localRequest, getTiers } = require('../utils/Util');
const Client = require('../Client');

class Players extends Actions {
    /**@param {Client} client */
    constructor(client) {
        super(client);
        this.client = client;
    }

    async getData(puuid) {
        const tokens = await getTokens();
        let data = await sendRequest('https://europe.api.riotgames.com/riot/account/v1/accounts/by-puuid/' + puuid, 'get', 'custom', { headers: { Authorization: "Bearer " + tokens.accessToken, "X-Riot-Entitlements-JWT": tokens.token, "X-Riot-ClientVersion": "release-03.00-shipping-22-574489", "X-Riot-ClientPlatform": "ew0KCSJwbGF0Zm9ybVR5cGUiOiAiUEMiLA0KCSJwbGF0Zm9ybU9TIjogIldpbmRvd3MiLA0KCSJwbGF0Zm9ybU9TVmVyc2lvbiI6ICIxMC4wLjE5MDQyLjEuMjU2LjY0Yml0IiwNCgkicGxhdGZvcm1DaGlwc2V0IjogIlVua25vd24iDQp9" } })

        if (!data) return undefined;

        return data;
    }

    async getLevel(puuid) {
        const userMatches = await this.getPlayerMatchHistory(puuid);
        if (!userMatches) return undefined;
        const match = userMatches.History[0];

        if (!match) return undefined;

        const matchPlayers = await this.client.match.getMatchPlayers(match.MatchID);
        if (!matchPlayers) return undefined;


        const player = matchPlayers.find(x => x.subject == puuid);
        if (!player) return undefined;
        return player.accountLevel;
    }

    async getPuuid(name) {
        let nameParsed = name.split("#");

        let data = await localRequest('chat/v4/friendrequests', "post", { game_name: nameParsed[0], game_tag: nameParsed[1] });

        if (!data) return undefined;
        let puuid = data.requests[0].puuid;

        await localRequest('chat/v4/friendrequests', "delete", { puuid: puuid });
        return puuid;
    }

    async getPlayerMMR(puuid) {
        const tokens = await getTokens();
        const data = await sendRequest('mmr/v1/players/' + puuid + "/competitiveupdates", 'get', 'pd', { region: this.client.options.region, tokens: tokens })

        if (!data) return undefined;
        const tiersData = (await getTiers())
        if (!data.Matches.filter(x => x.RankedRatingEarned !== 0)[0]) return null;
        const tier = tiersData.data[tiersData.data.length - 1].tiers.filter(x => x.tier === data.Matches.filter(x => x.RankedRatingEarned !== 0)[0].TierAfterUpdate)[0]

        return {
            mmr: data.Matches.filter(x => x.RankedRatingEarned !== 0)[0].RankedRatingAfterUpdate,
            tier: data.Matches.filter(x => x.RankedRatingEarned !== 0)[0].TierAfterUpdate,
            tierName: tier.tierName,
            images: {
                smallIcon: tier.smallIcon,
                largeIcon: tier.largeIcon,
                rankTriangleDownIcon: tier.rankTriangleDownIcon,
                rankTriangleUpIcon: tier.rankTriangleUpIcon,
            }
        };
    }

    async getPlayerMatchHistory(puuid) {
        const tokens = await getTokens();
        const data = await sendRequest('match-history/v1/history/' + puuid, 'get', 'pd', { region: this.client.options.region, tokens: tokens })

        if (!data) return undefined;

        return data;
    }

}

module.exports = Players;