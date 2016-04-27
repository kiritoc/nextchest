'use strict';

var https = require('https');
const LOG_PREFIX = 'LOL Api Client - ';

function LolClient() {
    // Config
    this.config = {
        host: 'euw.api.pvp.net',
        port: 443,
        key: 'a4fa26df-f21c-4943-99e6-5176149748c3',
        apiVersion: 'v1.4'
    };

    this.regions = this.getRegions();
    this.platforms = this.getPlatforms();

    this.get = function (path, callback) {
        if (path !== undefined) {
            var request,
                options = {
                    host: this.config.host,
                    port: this.config.port,
                    path: path + '?api_key=' + this.config.key
                };

            console.log(LOG_PREFIX + 'Request ' + path);

            request = https.get(options);

            request.on('response', function (response) {
                var buffer = '';

                response.on('data', function (chunk) {
                    buffer += chunk.toString('utf8');
                });

                response.on('end', function () {
                    if (response.statusCode === 204) {

                    }

                    try {
                        var data = JSON.parse(buffer);
                        callback(data);
                    } catch (exception) {
                        console.log(exception);
                        throw LOG_PREFIX + 'Error while processing data';
                    }
                });
            });

            request.on('error', function (error) {
                console.log(LOG_PREFIX + error.message);
                throw LOG_PREFIX + 'Error while requesting to API: ' + error.code;
            });

            request.end();
        }
    }
}

LolClient.prototype.getRegions = function () {
    return {
        br: 'BR',
        eune: 'EUNE',
        euw: 'EUW',
        jp: 'JP',
        kr: 'KR',
        lan: 'LAN',
        las: 'LAS',
        na: 'NA',
        oce: 'OCE',
        ru: 'RU',
        tr: 'TR'
    };
};

LolClient.prototype.getPlatforms = function () {
    var regions = this.getRegions(),
        platforms = {};

    for (var key in regions) {
        if (regions.hasOwnProperty(key)) {
            platforms[key] = regions[key] + '1';
        }
    }

    return platforms;
};

LolClient.prototype.getSummonerID = function (region, summonerName, callback) {
    var path;

    if (typeof callback !== 'function') {
        throw LOG_PREFIX + 'Callback is invalid';
    } else if (region === undefined) {
        throw LOG_PREFIX + 'Region is invalid';
    } else if (summonerName === undefined) {
        throw LOG_PREFIX + 'Summoner name is missing';
    } else {
        path = '/api/lol/' + region + '/' + this.config.apiVersion + '/summoner/by-name/' + summonerName;
        this.get(path, callback);
    }
};

LolClient.prototype.getChampionMasteryFromID = function (region, playerId, callback) {
    var platformId = this.platforms[region],
        path = '/championmastery/location/';

    if (typeof callback !== 'function') {
        throw LOG_PREFIX + 'Callback is invalid';
    } else if (platformId === undefined) {
        throw LOG_PREFIX + 'Platform is invalid';
    } else if (playerId === undefined) {
        throw LOG_PREFIX + 'Player ID is missing';
    } else {
        path += platformId + '/player/' + playerId + '/champions';
        this.get(path, callback);
    }
};

LolClient.prototype.getChampionMasteryFromName = function (region, summonerName, callback) {
    if (typeof callback !== 'function') {
        throw LOG_PREFIX + 'Callback is invalid';
    } else if (region === undefined) {
        throw LOG_PREFIX + 'Region is invalid';
    } else if (summonerName === undefined) {
        throw LOG_PREFIX + 'Summoner name is missing';
    } else {
        this.getSummonerID(region, summonerName, function(result) {
            if (result[summonerName] !== undefined && result[summonerName].id !== undefined) {
                this.getChampionMasteryFromID(region, result[summonerName].id, callback);
            }
        }.bind(this));
    }
};

// LolClient.prototype.getChampionsInfos = function (region, locale, statsList, callback) {
//     var path = '/api/lol/static-data/',
//         version = 'v1.2';
//
//     if (region === undefined) {
//         throw LOG_PREFIX + 'Region is invalid';
//     }
//
//     path += region + '/' + version + '/champion?dataById=true&champData=';
//
//     if (locale !== undefined) {
//
//     }
//     https://global.api.pvp.net/api/lol/static-data/euw/v1.2/champion?dataById=true&champData=altimages,image,tags&api_key=a4fa26df-f21c-4943-99e6-5176149748c3
// };

module.exports = LolClient;