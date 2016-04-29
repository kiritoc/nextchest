'use strict';

var LolClient = require('../lol');

LolClient.prototype.getChampionsInfos = function (params, callback) {
    if (typeof callback !== 'function') {
        throw 'Callback is invalid';
    } else if (params.region === undefined || params.locale === undefined) {
        callback({
            statusCode: 500,
            message: 'Wrong params'
        });
    } else {
        this.httpsGetRequest({
            hostPrefix: 'global',
            path: '/api/lol/static-data/' + params.region + '/v1.2/champion',
            query: 'champData=allytips,blurb,image,tags&locale=' + params.locale
        }, callback);
    }
};

module.exports = LolClient;