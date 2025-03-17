const localRequest = require('./localRequest');

module.exports = async function getClientData() {
        const data = await localRequest('chat/v4/presences');
        return data;
}