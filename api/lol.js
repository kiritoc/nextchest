'use strict';

const LOG_PREFIX = 'LOL Api Client - ';

function LolClient() {
    // API Request configuration
    this.config = {
        baseImagesUrl: 'http://ddragon.leagueoflegends.com/cdn/6.8.1/img/champion/',
        hostSuffix: '.api.pvp.net',
        port: 443,
        key: process.env.LOL_API_KEY,
        rateLimitRequests: 1 // seconds
    };

    if (this.config.key === undefined) {
        console.log(LOG_PREFIX + 'No API KEY configured !!');
    }

    // Available regions / platforms
    this.regions = getRegions();
    this.platforms = getPlatforms();

    this.requestsInQueue = [];
    this.requestsTimer = null;

    // Load operations files
    includeFiles('*/operations/*.js');
}

LolClient.prototype.getImageUrl = function (imageFull) {
    return this.config.baseImagesUrl + imageFull;
};

LolClient.prototype.addGetRequest = function (params, callback) {
    var request = {params: params, callbacks: [callback], asked: 1};

    if (params.rateLimited !== true) {
        httpsGetRequest.apply(this, [request]);
    } else {
        var _ = require('underscore'),
            existingRequest = _.findWhere(this.requestsInQueue, {params: params});

        if (existingRequest !== undefined) {
            request.asked += existingRequest.asked;
            request.callbacks = existingRequest.callbacks.concat(callback);
            this.requestsInQueue = _.without(this.requestsInQueue, existingRequest);
        }

        var index = Math.max(_.sortedIndex(this.requestsInQueue, request, 'asked') - 1, 0);
        this.requestsInQueue.splice(index, 0, request);

        if (this.requestsInQueue.length === 0) {
            stopRequestsTimer.apply(this);
        } else if (this.requestsTimer === null) {
            this.requestsTimer = setInterval(sendRequests.bind(this), this.config.rateLimitRequests * 1000);
            console.log(LOG_PREFIX + this.config.rateLimitRequests + ' request(s) with limited rate will be sent each second');
        }
    }
};

/////////////////////// PRIVATE METHODS ///////////////////////

function stopRequestsTimer() {
    clearInterval(this.requestsTimer);
    this.requestsTimer = null;
}

function sendRequests() {
    var _ = require('underscore'),
        async = require('async'),
        queue = async.queue(httpsGetRequest.bind(this), this.config.rateLimitRequests),
        index = 0;

    console.log(LOG_PREFIX + 'Send requests - ' + this.requestsInQueue.length + ' remaining request(s)');

    // Send maximum requests without reach the rate limit
    while (index < this.config.rateLimitRequests && this.requestsInQueue.length > 0) {
        const request = _.clone(this.requestsInQueue[index]);
        queue.push(request, function (err) {
            // If there is an error, we re add the request to the queue
            console.log(LOG_PREFIX + 'Error while sending request ' + err);
            this.addGetRequest(request.params, request.callbacks);
        }.bind(this));
        this.requestsInQueue.splice(index, 1);
        index++;
    }

    if (this.requestsInQueue.length === 0) {
        stopRequestsTimer.apply(this);
    }
}

function httpsGetRequest(request) {
    var https = require('https'),
        utils = require('../lib/utils');

    if (request.params !== undefined && request.params.path !== undefined) {
        var httpsRequest,
            hostPrefix = request.params.hostPrefix || 'global',
            options = {
                host: hostPrefix + this.config.hostSuffix,
                port: request.params.port || this.config.port,
                path: request.params.path
            };

        console.log(LOG_PREFIX + 'Request ' + options.host + ':' + options.port + options.path);

        // Add query
        if (request.params.query === undefined) {
            options.path += '?api_key=' + this.config.key;
        } else {
            options.path += '?' + request.params.query + '&api_key=' + this.config.key;
        }

        httpsRequest = https.get(options);

        httpsRequest.on('response', function (response) {
            var buffer = '';

            response.on('data', function (chunk) {
                buffer += chunk.toString('utf8');
            });

            response.on('end', function () {
                try {
                    var data = JSON.parse(buffer);
                    if (data.status !== undefined) {
                        utils.callMultipleCallbacks(request.callbacks, data.status);
                    } else {
                        utils.callMultipleCallbacks(request.callbacks, null, data);
                    }

                } catch (exception) {
                    console.log(LOG_PREFIX + 'Error while processing data', exception);
                    utils.callMultipleCallbacks(request.callbacks, {
                        status_code: 500,
                        message: exception
                    });
                }
            });
        });

        httpsRequest.on('error', function (error) {
            console.log(LOG_PREFIX + error.message);
            throw LOG_PREFIX + 'Error while requesting to API: ' + error.code;
        });

        httpsRequest.end();
    }
}

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