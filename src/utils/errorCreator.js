const errorCodes = require('./errorMessages');

module.exports = function errorCreator(message) {
    const error = new Error(errorCodes[message]);
    return error;
}