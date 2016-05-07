'use strict';

var LolClient = require('../lol'),
    cache = require('../../core/cache');

const keyCacheSuffix = 'championsInfos';

LolClient.prototype.getChampionsInfos = function (params, callback) {
    if (params.region === undefined || params.locale === undefined) {
        callback({
            statusCode: 500,
            message: 'Wrong params'
        });
    } else {
        var keyCache = keyCacheSuffix + '[' + params.locale + ']' + JSON.stringify(params);

        cache.wrap(keyCache, function (cb) {
            this.addGetRequest({
                rateLimited: false,
                hostPrefix: 'global',
                path: '/api/lol/static-data/' + params.region + '/v1.2/champion',
                query: 'champData=allytips,blurb,image,tags&dataById=true&locale=' + params.locale
            }, cb);
        }.bind(this), {ttl: 86400}, callback);
    }
};

module.exports = LolClient;