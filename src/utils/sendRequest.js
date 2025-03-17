const axios = require('axios');
module.exports = function sendRequest(path, method, type, options={}) {

    if(!options?.data) options.data = {}
    if(!options?.headers) options.headers = {}
    
    return new Promise(async(resolve, reject) => {
        if(type === "glz"){
            if(method == "post"){
                let data = await axios[method](`https://glz-${options.region}-1.${options.region}.a.pvp.net/` + path,{}, {headers: {Authorization: "Bearer " + options.tokens.accessToken,"X-Riot-Entitlements-JWT": options.tokens.token,"X-Riot-ClientVersion": "release-03.00-shipping-22-574489","X-Riot-ClientPlatform": "ew0KCSJwbGF0Zm9ybVR5cGUiOiAiUEMiLA0KCSJwbGF0Zm9ybU9TIjogIldpbmRvd3MiLA0KCSJwbGF0Zm9ybU9TVmVyc2lvbiI6ICIxMC4wLjE5MDQyLjEuMjU2LjY0Yml0IiwNCgkicGxhdGZvcm1DaGlwc2V0IjogIlVua25vd24iDQp9"}}).catch(error => {return resolve(null)})
                resolve(data?.data)
                return;
            }
            let data = await axios[method](`https://glz-${options.region}-1.${options.region}.a.pvp.net/` + path, {headers: {Authorization: "Bearer " + options.tokens.accessToken,"X-Riot-Entitlements-JWT": options.tokens.token,"X-Riot-ClientVersion": "release-03.00-shipping-22-574489","X-Riot-ClientPlatform": "ew0KCSJwbGF0Zm9ybVR5cGUiOiAiUEMiLA0KCSJwbGF0Zm9ybU9TIjogIldpbmRvd3MiLA0KCSJwbGF0Zm9ybU9TVmVyc2lvbiI6ICIxMC4wLjE5MDQyLjEuMjU2LjY0Yml0IiwNCgkicGxhdGZvcm1DaGlwc2V0IjogIlVua25vd24iDQp9"}}).catch(error => {return resolve(null)})
            resolve(data?.data)
        }

        if(type === "pd"){
            let data = await axios[method](`https://pd.${options.region}.a.pvp.net/` + path, {headers: {Authorization: "Bearer " + options.tokens.accessToken,"X-Riot-Entitlements-JWT": options.tokens.token,"X-Riot-ClientVersion": "release-06.06-shipping-15-851458","X-Riot-ClientPlatform": "ew0KCSJwbGF0Zm9ybVR5cGUiOiAiUEMiLA0KCSJwbGF0Zm9ybU9TIjogIldpbmRvd3MiLA0KCSJwbGF0Zm9ybU9TVmVyc2lvbiI6ICIxMC4wLjE5MDQyLjEuMjU2LjY0Yml0IiwNCgkicGxhdGZvcm1DaGlwc2V0IjogIlVua25vd24iDQp9"}}).catch(error => {console.log(error);return resolve(null)})
            resolve(data?.data)
        }

        if(type === "custom"){
            let data = await axios[method](path, options.data, {headers: options.headers}).catch(error => {console.log(error.response);return resolve(null)})
            resolve(data?.data)
        }
    })
}