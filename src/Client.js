const EventEmitter = require('events');
const { getLockFile, errorCodes, errorCreator, getPresenceData, getTokens, sendRequest, getAgents } = require('./utils/Util');
const Actions = require('./Actions/Actions');
const PreGame = require('./Actions/PreGame');
const CoreGame = require('./Actions/CoreGame');
const Players = require('./Actions/Players');
const WebSocket = require('./Actions/WebSocket');
const Match = require('./Actions/Match');

class Client extends EventEmitter {
    constructor(options = { region: 'eu', reAuth: false }) {
        super({ captureRejections: true });
        this.options = options;
        this.player = null
        this._init();
        this.inGame = false;
        this.inPregame = false;
        this.actions = new Actions(this);
        this.preGame = new PreGame(this);
        this.coreGame = new CoreGame(this);
        this.players = new Players(this);
        this.ws = new WebSocket(this);
        this.match = new Match(this);
    }

    async login() {

        const lockFile = getLockFile();
        if (!lockFile) {
            if (this.options.reAuth) {
                this.login();
                try {
                    throw errorCreator(errorCodes.GameClientNotRunningWillBeTryAgain);
                } catch { }
            }
            throw errorCreator(errorCodes.GameClientNotRunning);
        }

        this.player = await this.getPlayer();
        this.emit('ready');
    }

    async getPlayer() {

        const presenceData = await getPresenceData()
        let tokens = await getTokens();
        if (!presenceData) {
            throw errorCreator(errorCodes.GameClientNotRunning);
        }

        let data = JSON.parse(new Buffer.from(presenceData.private, 'base64').toString('utf8'));
        return {
            puuid: tokens.subject,
            ...data
        }

    }

    async _init() {
        setInterval(async () => {
            this.player = await this.getPlayer();

            let preMatchData = await this.preGame.getData();
            let coreMatchData = await this.coreGame.getData();
            if (preMatchData && !this.inPregame) {
                this.inGame = false;
                this.inPregame = true;
                this.emit('matchFound', preMatchData);
            }
            if (coreMatchData && !this.inGame) {
                this.inGame = true;
                this.inPregame = false;
                this.emit('matchStarted', coreMatchData);
            }

            if (!coreMatchData && this.inGame) {
                this.inGame = false;
                this.emit('matchEnded');
            }

            if (!preMatchData && this.inPregame) {
                this.inPregame = false;
                this.emit('matchCancelled');
            }

            if (!coreMatchData && !preMatchData) {
                this.inGame = false;
                this.inPregame = false;
            }
        }, 500);
    }
}
process.stdin.resume();
global.Client = module.exports = Client;