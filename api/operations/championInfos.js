'use strict';

var LolClient = require('../lol');

LolClient.prototype.getChampionsInfos = function (params, callback) {
    if (typeof callback !== 'function') {
        throw 'Callback is invalid';
    } else if (params.region === undefined || params.summonerName === undefined) {
        callback({
            statusCode: 500,
            message: 'Wrong params'
        });
    } else {
        this.httpsGetRequest({
            hostPrefix: 'global',
            path: '/api/lol/static-data/' + params.region + '/v1.2/champion',
            query: 'dataById=true&champData=altimages,image,tags'
        }, callback);
    }
};

module.exports = LolClient;