let axios = require('axios');
const https = require('https');
const getLockFile = require('./getLockFile');

const lockFile = getLockFile();
let axios_ = axios.create({
    baseURL: "https://127.0.0.1:" + lockFile.port + "/",
    headers: {
        'Authorization': `Basic ${Buffer.from(`riot:${lockFile.password}`, 'utf8').toString('base64')}`,
        "user-agent": "ShooterGame/21 Windows/10.0.19042.1.768.64bit",
        "X-Riot-ClientVersion": "release-02.03-shipping-8-521855",
        "Content-Type": "application/json",
        "rchat-blocking": "true",
    },
    httpsAgent: new https.Agent({
        rejectUnauthorized: false,
    }),
});

module.exports = async function localRequest(path, method = "get", body = {}) {

    if (method === "delete") {
        let data = await axios_.delete(path, {
            data: { ...body }
        }).catch(error => { return error })

        return data.data;
    }


    let data = await axios_[method](path, { ...body }).catch(error => { return error })
    return data.data;
}