'use strict';

var LolClient = require('../lol');

LolClient.prototype.getSummonerIDFromName = function (params, callback) {
    if (typeof callback !== 'function') {
        throw 'Callback is invalid';
    } else if (params.region === undefined || params.summonerName === undefined) {
        callback({
            statusCode: 500,
            message: 'Wrong params'
        });
    } else {
        this.httpsGetRequest({
            hostPrefix: params.region,
            path: '/api/lol/' + params.region + '/v1.4/summoner/by-name/' + params.summonerName
        }, callback);
    }
};

module.exports = LolClient;