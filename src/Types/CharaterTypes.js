const getAgents = require('./utils/getAgents');

let obj = {};

for (let i = 0; i < getAgents.data.length; i++) {
    obj[getAgents.data[i].displayName] = getAgents.data[i].uuid;
}
module.exports = obj;