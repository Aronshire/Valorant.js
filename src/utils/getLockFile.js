const fs = require('fs')
module.exports = function getLockFile() {
    if (fs.existsSync(process.env.LOCALAPPDATA + '\\Riot Games\\Riot Client\\Config\\lockfile')) {
        const file = fs.readFileSync(process.env.LOCALAPPDATA + '\\Riot Games\\Riot Client\\Config\\lockfile', 'utf8').split(':')
        return {
            port: file[2],
            password: file[3],
        }
    }
    else {
        return null;
    }
}