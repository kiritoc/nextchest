'use strict';

function LolClient() {
    // API Request configuration
    this.config = {
        hostSuffix: '.api.pvp.net',
        port: 443,
        key: 'a4fa26df-f21c-4943-99e6-5176149748c3'
    };

    // Available regions / platforms
    this.regions = getRegions();
    this.platforms = getPlatforms();

    // Load operations files
    includeFiles('*/operations/*.js');
}

LolClient.prototype.httpsGetRequest = function (params, callback) {
    var https = require('https');
    const LOG_PREFIX = 'LOL Api Client - ';

    if (params !== undefined && params.path !== undefined) {
        var request,
            hostPrefix = params.hostPrefix || 'global',
            options = {
                host: hostPrefix + this.config.hostSuffix,
                port: params.port || this.config.port,
                path: params.path
            };

        console.log(LOG_PREFIX + 'Request ' + options.host + ':' + options.port + options.path);

        // Add query
        if (params.query === undefined) {
            options.path += '?api_key=' + this.config.key;
        } else {
            options.path += '?' + params.query + '&api_key=' + this.config.key;
        }

        request = https.get(options);

        request.on('response', function (response) {
            var buffer = '';

            response.on('data', function (chunk) {
                buffer += chunk.toString('utf8');
            });

            response.on('end', function () {
                try {
                    var data = JSON.parse(buffer);
                    callback(null, data);
                } catch (exception) {
                    console.log(LOG_PREFIX + 'Error while processing data', exception);

                    callback({
                        statusCode: 500,
                        message: exception
                    });
                }
            });
        });

        request.on('error', function (error) {
            console.log(LOG_PREFIX + error.message);
            throw LOG_PREFIX + 'Error while requesting to API: ' + error.code;
        });

        request.end();
    }
};

/////////////////////// PRIVATE METHODS ///////////////////////

/**
 * Get list of available regions
 * @returns {{br: string, eune: string, euw: string, jp: string, kr: string, lan: string, las: string, na: string, oce: string, ru: string, tr: string}}
 */
function getRegions() {
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
}

/**
 * Get list of available platforms
 * (Which means regions name followed by 1, eg: euw1)
 * @returns {{}}
 */
function getPlatforms() {
    var regions = getRegions(),
        platforms = {};

    for (var key in regions) {
        if (regions.hasOwnProperty(key)) {
            platforms[key] = regions[key] + '1';
        }
    }

    return platforms;
}

/**
 * Include files found from path
 * @param path
 */
function includeFiles(path) {
    var glob = require('glob'),
        include = require('include')(__dirname);

    glob.sync(path).forEach(function (file) {
        var name = file.substr(0, file.lastIndexOf('.')) || file;
        include(name);
    });
}

module.exports = LolClient;