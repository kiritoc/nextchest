'use strict';

var LolClient = require('../lol'),
    cache = require('../../core/cache');

const keyCacheSuffix = 'summoner',
    ttl = 86400;

LolClient.prototype.getSummonerIDFromName = function (params, callback) {
    var keyCache = keyCacheSuffix + JSON.stringify(params);

    if (params.region === undefined || params.summonerName === undefined) {
        callback({
            status_code: 500,
            message: 'Wrong params'
        });
    } else {
        cache.wrap(keyCache, function (cb) {
            this.addGetRequest({
                rateLimited: true,
                hostPrefix: params.region,
                path: '/api/lol/' + params.region + '/v1.4/summoner/by-name/' + params.summonerName
            }, cb);
        }.bind(this), {ttl: ttl}, callback);
    }
};

module.exports = LolClient;