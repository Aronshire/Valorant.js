const getClientData = require('./getClientData');
const getTokens = require('./getTokens');
const createError = require('./errorCreator');
const errorCodes = require('./errorCodes');

module.exports = async function getPresenceData() {
    const data = await getClientData();
    const tokens = await getTokens();

    if(!data?.presences) throw createError(errorCodes.WaitingGameClientToBeReady);
    const presence = data.presences.filter(p => p.puuid == tokens.subject);

    if(!presence[0]) return null;

    return presence[0];
}