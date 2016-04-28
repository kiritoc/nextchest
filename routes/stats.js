'use strict';

module.exports = function () {
    var express = require('express'),
        router = express.Router(),
        LolClient = require('../api/lol');

    var lolClient = new LolClient();

    router.get('/', function (req, res) {
        lolClient.getChampionMasteryFromName({
            region: 'euw',
            summonerName: 'kiritoc'
        }, function (error, data) {
            if (error === null) {
                res.render('stats', {
                    data: JSON.stringify(data[0])
                });
            } else {
                res.render('error', {
                    error: error
                });
            }
        });
    });

    return router;
};