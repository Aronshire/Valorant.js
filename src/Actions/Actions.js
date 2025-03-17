const Client = require('../Client');
const utils = require('../utils/Util');

class Actions {
    /**@param {Client} client */
    constructor(client) {
        this.client = client;
        this.utils = utils;
    }

}

module.exports = Actions;