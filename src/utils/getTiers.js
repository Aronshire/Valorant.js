const sendRequest = require('./sendRequest');
module.exports = async function getAgents() {

    const data = await sendRequest('https://valorant-api.com/v1/competitivetiers', 'get', 'custom', { headers: { 'Content-Type': 'application/json' } })

    return data;

}