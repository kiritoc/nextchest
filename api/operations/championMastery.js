'use strict';

var LolClient = require('../lol'),
    cache = require('../../core/cache');

const keyCacheSuffix = "championMastery";

require('./summoner');

LolClient.prototype.getChampionMasteryFromID = function (params, callback) {
    var platformId = this.platforms[params.region];

    if (typeof callback !== 'function') {
        throw LOG_PREFIX + 'Callback is invalid';
    } else if (platformId === undefined) {
        throw LOG_PREFIX + 'Platform is invalid';
    } else if (params.playerId === undefined) {
        throw LOG_PREFIX + 'Player ID is missing';
    } else {
        var keyCache = keyCacheSuffix + JSON.stringify(params);
        cache.wrap(keyCache, function (cb) {
            this.addGetRequest({
                rateLimited: true,
                hostPrefix: params.region,
                path: '/championmastery/location/' + platformId + '/player/' + params.playerId + '/champions'
            }, cb);
        }.bind(this), callback);
    }
};

LolClient.prototype.getChampionMasteryFromName = function (params, callback) {
    if (typeof callback !== 'function') {
        throw LOG_PREFIX + 'Callback is invalid';
    } else if (params.region === undefined) {
        throw LOG_PREFIX + 'Region is invalid';
    } else if (params.summonerName === undefined) {
        throw LOG_PREFIX + 'Summoner name is missing';
    } else {
        this.getSummonerIDFromName(params, function (error, result) {
            if (error !== null) {
                callback(error);
            } else if (result[params.summonerName] !== undefined && result[params.summonerName].id !== undefined) {
                this.getChampionMasteryFromID({
                    region: params.region,
                    playerId: result[params.summonerName].id
                }, callback);
            } else {
                callback({
                    status_code: 500,
                    message: ''
                });
            }
        }.bind(this));
    }
};

module.exports = LolClient;