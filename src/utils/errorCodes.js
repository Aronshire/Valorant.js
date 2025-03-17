const Codes = [
    "GameClientNotRunning",
    "GameClientNotRunningWillBeTryAgain",
    "WaitingGameClientToBeReady",
    "CharacterNotFound",
    "GameNotFound"
]

module.exports = Object.fromEntries(Codes.map(key => [key, key]));