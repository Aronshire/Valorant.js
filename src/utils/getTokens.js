const localRequest = require('./localRequest');

module.exports = async function getTokens() {

    const data = await localRequest('entitlements/v1/token');
    return data;
}