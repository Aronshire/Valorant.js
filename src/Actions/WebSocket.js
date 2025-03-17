const Actions = require('./Actions')
const WS = require('ws');
const { errorCreator, errorCodes, getLockFile } = require('../utils/Util');
const Client = require('../Client');

class WebSocket extends Actions {
    /**@param {Client} client */
    constructor(client) {
        super(client);
        this.client = client;
        /**@param {WS.WebSocket} this.ws */
        this.ws = null;
    }

    async connect() {
        const lockFile = getLockFile();

        if (!lockFile) {
            throw errorCreator(errorCodes.GameClientNotRunning);
        };

        this.ws = new WS('wss://riot:' + lockFile.password+  "@127.0.0.1:" + lockFile.port, {
            rejectUnauthorized: false
        });
        return this.ws;
    }

    async disconnect() {
        this.ws.close();
    }

    async send(data) {
        this.ws.send(JSON.stringify(data));
    }

}

module.exports = WebSocket;